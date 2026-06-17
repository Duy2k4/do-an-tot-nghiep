import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  categories: any[] = [];
  loading = true;
  search = '';
  category = '';
  pagination: any = { page: 1, limit: 3, total: 0, totalPages: 0 };
  pageNumbers: number[] = [];
  
  constructor(private api: ApiService) {}
  
  ngOnInit() { this.loadCategories(); this.loadArticles(); }
  
  loadCategories() { this.api.getArticleCategories().subscribe(data => { this.categories = data; }); }
  
  loadArticles(page = this.pagination.page) {
    this.loading = true;
    this.pagination.page = page;
    const params: any = { page, limit: this.pagination.limit, category: this.category };
    if (this.search) params.search = this.search;
    this.api.getArticles(params).subscribe(res => {
      this.articles = res.data;
      // Khởi tạo currentImageIndex cho từng bài viết
      this.articles.forEach(a => {
        if (!a.currentImageIndex) {
          a.currentImageIndex = 0;
        }
      });
      this.pagination = res.pagination;
      this.pageNumbers = this.getPageNumbers(res.pagination.page, res.pagination.totalPages);
      this.loading = false;
    }, () => { this.loading = false; });
  }

  getPageNumbers(current: number, totalPages: number): number[] {
    const visibleCount = Math.min(5, totalPages);
    const start = Math.max(1, Math.min(current - 2, totalPages - visibleCount + 1));
    return Array.from({ length: visibleCount }, (_, i) => start + i);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.totalPages || page === this.pagination.page) return;
    this.loadArticles(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
  
  // Các hàm xử lý slider ảnh
  getArticleImage(article: any): string {
    if (article.images && article.images.length > 0) {
      const primary = article.images.find((img: any) => img.isPrimary);
      return primary?.url || article.images[0]?.url;
    }
    return article.imageUrl || `https://picsum.photos/seed/${article.slug}/400/250`;
  }
  
  setArticleImageIndex(article: any, index: number, event: Event) {
    event.stopPropagation();
    article.currentImageIndex = index;
  }
  
  prevImage(article: any, event: Event) {
    event.stopPropagation();
    if (!article.currentImageIndex) article.currentImageIndex = 0;
    article.currentImageIndex = (article.currentImageIndex - 1 + article.images.length) % article.images.length;
  }
  
  nextImage(article: any, event: Event) {
    event.stopPropagation();
    if (!article.currentImageIndex) article.currentImageIndex = 0;
    article.currentImageIndex = (article.currentImageIndex + 1) % article.images.length;
  }
}
