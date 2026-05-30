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
      this.loadDestinations();
    });
  }

  loadCategories() {
    this.api.getDestinationCategories().subscribe({
      next: (data) => { this.categories = data; }
    });
  }

  loadDestinations() {
    this.loading = true;
    this.pagination.page = 1;
    const params = { page: 1, limit: 12, ...this.filters };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    this.api.getDestinations(params).subscribe({
      next: (res) => {
        this.destinations = res.data;
        this.pagination = res.pagination;
        this.pageNumbers = Array.from({length: Math.min(5, res.pagination.totalPages)}, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange() {
    clearTimeout((this as any).searchTimeout);
    (this as any).searchTimeout = setTimeout(() => this.loadDestinations(), 500);
  }

  clearFilters() {
    this.filters.search = '';
    this.filters.category = '';
    this.filters.region = '';
    this.filters.sort = 'createdAt';
    this.loadDestinations();
  }

  goToPage(page: number) {
    this.pagination.page = page;
    this.loadDestinations();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
}
