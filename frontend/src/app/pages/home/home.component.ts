import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredDestinations: any[] = [];
  featuredTours: any[] = [];
  recentArticles: any[] = [];
  loadingDestinations = true;
  loadingTours = true;
  loadingArticles = true;
  searchKeyword = '';
  searchCategory = '';
  contactName = '';
  contactEmail = '';
  contactMessage = '';
  contactSuccess = false;
  contactErrors: any = {};

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.loadFeaturedDestinations();
    this.loadFeaturedTours();
    this.loadRecentArticles();
  }

  loadFeaturedDestinations() {
    this.api.getFeaturedDestinations().subscribe({
      next: (data) => { this.featuredDestinations = data; this.loadingDestinations = false; },
      error: () => { this.loadingDestinations = false; }
    });
  }

  loadFeaturedTours() {
    this.api.getFeaturedTours().subscribe({
      next: (data) => { this.featuredTours = data; this.loadingTours = false; },
      error: () => { this.loadingTours = false; }
    });
  }

  loadRecentArticles() {
    this.api.getRecentArticles().subscribe({
      next: (data) => { this.recentArticles = data; this.loadingArticles = false; },
      error: () => { this.loadingArticles = false; }
    });
  }

  search() {
    const params: any = {};
    if (this.searchKeyword) params.search = this.searchKeyword;
    if (this.searchCategory) params.category = this.searchCategory;
    window.location.href = `/destinations?${Object.entries(params).map(([k,v]) => `${k}=${v}`).join('&')}`;
  }

  getDiscount(tour: any): number {
    if (!tour.discountPrice) return 0;
    return Math.round((1 - tour.discountPrice / tour.price) * 100);
  }

  requestTour(tour: any) {
    window.location.href = '/contact';
  }

  validateContact(): boolean {
    this.contactErrors = {};
    if (!this.contactName.trim()) {
      this.contactErrors.name = 'Vui lòng nhập họ tên';
    } else if (this.contactName.trim().length < 2) {
      this.contactErrors.name = 'Họ tên ít nhất 2 ký tự';
    }
    if (!this.contactEmail.trim()) {
      this.contactErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail)) {
      this.contactErrors.email = 'Email không đúng định dạng';
    }
    if (!this.contactMessage.trim()) {
      this.contactErrors.message = 'Vui lòng nhập nội dung';
    } else if (this.contactMessage.trim().length < 10) {
      this.contactErrors.message = 'Nội dung ít nhất 10 ký tự';
    }
    return Object.keys(this.contactErrors).length === 0;
  }

  submitQuickContact() {
    if (!this.validateContact()) return;
    this.api.createInquiry({
      name: this.contactName,
      email: this.contactEmail,
      message: this.contactMessage,
      subject: 'Yêu cầu tư vấn nhanh từ trang chủ',
      type: 'contact'
    }).subscribe({
      next: () => {
        this.contactSuccess = true;
        this.contactName = '';
        this.contactEmail = '';
        this.contactMessage = '';
        setTimeout(() => this.contactSuccess = false, 5000);
      }
    });
  }
}
