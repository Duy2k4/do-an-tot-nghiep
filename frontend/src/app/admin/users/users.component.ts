import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  data: any[] = [];
  loading = true;
  search = '';
  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  pageNumbers: (number | string)[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, limit: this.limit };
    if (this.search) params.search = this.search;
    this.api.getUsers(params).subscribe((res: any) => {
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

  toggle(id: string) { this.api.toggleUserActive(id).subscribe(() => this.load()); }
}
