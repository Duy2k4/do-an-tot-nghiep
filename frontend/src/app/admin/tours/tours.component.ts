import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class AdminToursComponent implements OnInit {
  data: any[] = [];
  loading = true;
  search = '';
  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  pageNumbers: (number | string)[] = [];

  constructor(public api: ApiService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, limit: this.limit };
    if (this.search) params.search = this.search;
    this.api.getTours(params).subscribe(res => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev() { if (this.page > 1) { this.page--; this.load(); } }
  next() { if (this.page < this.totalPages) { this.page++; this.load(); } }

  async delete(id: string) {
    if (await this.confirmDialog.confirm({ message: 'Bạn có chắc muốn xóa tour này?' })) {
      this.api.deleteTour(id).subscribe(() => this.load());
    }
  }
}
