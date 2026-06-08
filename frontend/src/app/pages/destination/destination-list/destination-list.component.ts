import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.css']
})
export class DestinationListComponent implements OnInit {
  destinations: any[] = [];
  categories: any[] = [];
  loading = true;
  filters: any = { search: '', category: '', region: '', sort: 'createdAt' };
  pagination: any = { page: 1, limit: 12, total: 0, totalPages: 0 };
  pageNumbers: number[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filters.search = params['search'] || '';
      this.filters.category = params['category'] || '';
      this.loadCategories();
      this.loadDestinations(1);
    });
  }

  loadCategories() {
    this.api.getDestinationCategories().subscribe({
      next: (data) => { this.categories = data; }
    });
  }

  loadDestinations(page = this.pagination.page) {
    this.loading = true;
    this.pagination.page = page;
    const params = { page, limit: this.pagination.limit, ...this.filters };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    this.api.getDestinations(params).subscribe({
      next: (res) => {
        this.destinations = res.data;
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

  onSearchChange() {
    clearTimeout((this as any).searchTimeout);
    (this as any).searchTimeout = setTimeout(() => this.loadDestinations(1), 500);
  }

  clearFilters() {
    this.filters.search = '';
    this.filters.category = '';
    this.filters.region = '';
    this.filters.sort = 'createdAt';
    this.loadDestinations(1);
  }

  goToPage(page: number) {
    if(page<1 || page> this.pagination.totalPages || page === this.pagination.page) return;
    this.loadDestinations(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
}
