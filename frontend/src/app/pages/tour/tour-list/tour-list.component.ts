import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
  tours: any[] = [];
  loading = true;
  search = '';
  sort = 'createdAt';
  pagination: any = { page: 1, limit: 6, total: 0, totalPages: 0 };
  pageNumbers: number[] = [];

  constructor(public api: ApiService) {}

  ngOnInit() { this.loadTours(); }

  loadTours(page = this.pagination.page) {
    this.loading = true;
    this.pagination.page = page;
    const params: any = { page, limit: this.pagination.limit, sort: this.sort };
    if (this.search) params.search = this.search;
    this.api.getTours(params).subscribe({
      next: (res) => {
        this.tours = res.data;
        this.pagination = res.pagination;
        this.pageNumbers = this.getPageNumbers(res.pagination.page, res.pagination.totalPages);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getPageNumbers(current: number, totalPages: number): number[] {
    const visibleCount = Math.min(5, totalPages);
    const start = Math.max(1, Math.min(current - 2, totalPages - visibleCount + 1));
    return Array.from({ length: visibleCount }, (_, i) => start + i);
  }

  getDiscount(t: any): number {
    if (!t.discountPrice) return 0;
    return Math.round((1 - t.discountPrice / t.price) * 100);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.totalPages || page === this.pagination.page) return;
    this.loadTours(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
}
