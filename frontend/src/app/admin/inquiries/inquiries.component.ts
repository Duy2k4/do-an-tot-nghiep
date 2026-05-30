import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class AdminInquiriesComponent implements OnInit {
  data: any[] = [];
  loading = true;
  filterStatus = '';
  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  pageNumbers: (number | string)[] = [];
  selectedInquiry: any = null;

  constructor(private api: ApiService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, limit: this.limit };
    if (this.filterStatus) params.status = this.filterStatus;
    this.api.getInquiries(params).subscribe((res: any) => {
      this.data = res.data;
      this.total = res.pagination.total;
      this.totalPages = res.pagination.totalPages;
      this.buildPageNumbers();
      this.loading = false;
    }, () => { this.loading = false; });
  }

  buildPageNumbers() {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    this.pageNumbers = pages;
  }

  goTo(page: number | string) {
    if (page === '...' || page === this.page) return;
    this.page = +page;
    this.load();
  }

  prev() { if (this.page > 1) { this.page--; this.load(); } }
  next() { if (this.page < this.totalPages) { this.page++; this.load(); } }

  updateStatus(inq: any) {
    this.api.updateInquiry(inq.id, { status: inq.status }).subscribe();
  }

  openDetail(inquiry: any) {
    this.selectedInquiry = inquiry;
  }

  closeDetail() {
    this.selectedInquiry = null;
  }

  async delete(id: string) {
    if (await this.confirmDialog.confirm({ message: 'Bạn có chắc muốn xóa yêu cầu này?' })) {
      this.api.deleteInquiry(id).subscribe(() => this.load());
    }
  }
}
