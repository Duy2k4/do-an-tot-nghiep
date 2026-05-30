import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-inquiries',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent implements OnInit {
  inquiries: any[] = [];
  loading = true;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getMyInquiries().subscribe(data => { this.inquiries = data; this.loading = false; }, () => { this.loading = false; }); }
}
