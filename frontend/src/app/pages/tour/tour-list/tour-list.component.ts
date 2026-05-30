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
  pagination: any = { page: 1, limit: 12, total: 0, totalPages: 0 };
  pageNumbers: number[] = [];

  constructor(public api: ApiService) {}

  ngOnInit() { this.loadTours(); }

  loadTours() {
    this.loading = true;
    this.pagination.page = 1;
    const params: any = { page: 1, limit: 12, sort: this.sort };
    if (this.search) params.search = this.search;
    this.api.getTours(params).subscribe({
      next: (res) => {
        this.tours = res.data;
        this.pagination = res.pagination;
        this.pageNumbers = Array.from({length: Math.min(5, res.pagination.totalPages)}, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getDiscount(t: any): number {
    if (!t.discountPrice) return 0;
    return Math.round((1 - t.discountPrice / t.price) * 100);
  }

  goToPage(page: number) {
    this.pagination.page = page;
    this.loadTours();
  }
}
