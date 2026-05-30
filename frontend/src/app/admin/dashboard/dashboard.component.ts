import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  stats: any = null;
  recentInquiries: any[] = [];
  topDestinations: any[] = [];
  inquiryStats: any = null;

  lineChartOptions: Highcharts.Options = {};
  columnChartOptions: Highcharts.Options = {};
  pieChartOptions: Highcharts.Options = {};

  lineChartUpdateFlag = false;
  columnChartUpdateFlag = false;
  pieChartUpdateFlag = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboard().subscribe({
      next: (data: any) => {
        this.stats = data.stats;
        this.recentInquiries = data.recentInquiries || [];
        this.topDestinations = data.topDestinations || [];

        this.initChartOptions();

        if (data.monthlyStats && data.monthlyStats.length > 0) {
          this.updateLineChart(data.monthlyStats);
        }
        if (data.topDestinations && data.topDestinations.length > 0) {
          this.updateColumnChart(data.topDestinations);
        }
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
        this.stats = { destinations: 0, tours: 0, articles: 0, users: 0, reviews: 0, pendingInquiries: 0, activeUsers: 0 };
        this.initChartOptions();
      }
    });

    this.api.getInquiries().subscribe({
      next: (res: any) => {
        const data = res.data || [];
        this.inquiryStats = {
          pending: data.filter((i: any) => i.status === 'pending').length,
          replied: data.filter((i: any) => i.status === 'replied').length,
          closed: data.filter((i: any) => i.status === 'closed').length,
        };
        if (!this.pieChartOptions || !this.pieChartOptions.series) {
          this.initChartOptions();
        }
        this.updatePieChart();
      },
      error: (err) => console.error('Inquiries API error:', err)
    });
  }

  initChartOptions() {
    const chartStyle = { fontFamily: 'Nunito Sans, sans-serif' };

    this.lineChartOptions = {
      chart: { type: 'spline', style: chartStyle, height: 300 },
      title: { text: 'Thống kê 6 tháng gần nhất' },
      credits: { enabled: false },
      xAxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
      yAxis: { title: { text: 'Số lượng' }, min: 0 },
      tooltip: { shared: true },
      legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
      series: [
        { name: 'Người dùng', type: 'spline', data: [0, 0, 0, 0, 0, 0], color: '#0d6efd' },
        { name: 'Đánh giá', type: 'spline', data: [0, 0, 0, 0, 0, 0], color: '#f59e0b' },
        { name: 'Yêu cầu', type: 'spline', data: [0, 0, 0, 0, 0, 0], color: '#22c55e' },
      ],
    };

    this.columnChartOptions = {
      chart: { type: 'column', style: chartStyle, height: 300 },
      title: { text: 'Top 5 địa điểm xem nhiều nhất' },
      credits: { enabled: false },
      xAxis: { categories: ['Chưa có dữ liệu'], labels: { style: { fontSize: '11px' } } },
      yAxis: { title: { text: 'Lượt xem' }, min: 0 },
      tooltip: { valueSuffix: ' lượt xem' },
      plotOptions: { column: { borderRadius: 4, borderWidth: 0 } },
      colors: ['#0d6efd', '#6f42c1', '#f59e0b', '#22c55e', '#ef4444'],
      series: [{ name: 'Lượt xem', type: 'column', data: [0] }],
    };

    this.pieChartOptions = {
      chart: { type: 'pie', style: chartStyle, height: 300 },
      title: { text: 'Phân bố trạng thái yêu cầu' },
      credits: { enabled: false },
      tooltip: { valueSuffix: ' yêu cầu' },
      plotOptions: {
        pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: true, format: '{point.name}: {point.y}' }, showInLegend: true }
      },
      series: [{ type: 'pie', name: 'Trạng thái', data: [
        { name: 'Chờ xử lý', y: 0, color: '#f59e0b' },
        { name: 'Đã trả lời', y: 0, color: '#22c55e' },
        { name: 'Đã đóng', y: 0, color: '#6b7280' },
      ] }],
    };

    this.lineChartUpdateFlag = true;
    this.columnChartUpdateFlag = true;
    this.pieChartUpdateFlag = true;
  }

  updateLineChart(monthlyStats: any[]) {
    (this.lineChartOptions.series as any[])[0]['data'] = monthlyStats.map((m: any) => m.users);
    (this.lineChartOptions.series as any[])[1]['data'] = monthlyStats.map((m: any) => m.reviews);
    (this.lineChartOptions.series as any[])[2]['data'] = monthlyStats.map((m: any) => m.inquiries);
    this.lineChartOptions.xAxis = { categories: monthlyStats.map((m: any) => m.month) };
    this.lineChartUpdateFlag = true;
  }

  updateColumnChart(topDestinations: any[]) {
    (this.columnChartOptions.series as any[])[0]['data'] = topDestinations.map((d: any) => d.viewCount);
    this.columnChartOptions.xAxis = { categories: topDestinations.map((d: any) => d.name) };
    this.columnChartUpdateFlag = true;
  }

  updatePieChart() {
    (this.pieChartOptions.series as any[])[0]['data'] = [
      { name: 'Chờ xử lý', y: this.inquiryStats?.pending || 0, color: '#f59e0b' },
      { name: 'Đã trả lời', y: this.inquiryStats?.replied || 0, color: '#22c55e' },
      { name: 'Đã đóng', y: this.inquiryStats?.closed || 0, color: '#6b7280' },
    ];
    this.pieChartUpdateFlag = true;
  }
}
