import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  data: any[] = [];
  loading = true;
  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  pageNumbers: (number | string)[] = [];
  selectedReview: any = null;

  constructor(private api: ApiService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getReviews({ page: this.page, limit: this.limit }).subscribe((res: any) => {
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

  openDetail(review: any) {
    this.selectedReview = review;
  }

  closeDetail() {
    this.selectedReview = null;
  }

  async delete(id: string) {
    if (await this.confirmDialog.confirm({ message: 'Bạn có chắc muốn xóa đánh giá này?' })) {
      this.api.deleteReview(id).subscribe(() => this.load());
    }
  }

  getStars(rating: number): string[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 'star' : 'star_border');
  }
}
