import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any = null;
  currentImageIndex = 0;
  
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  
  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.getArticle(slug).subscribe(data => { 
      this.article = data;
      this.currentImageIndex = 0;
    });
  }
  
  getTags(): string[] { 
    return this.article?.tags?.split(',').map((t: string) => t.trim()) || []; 
  }
  
  getHeroImage(): string {
    if (this.article?.images && this.article.images.length > 0) {
      const primary = this.article.images.find((img: any) => img.isPrimary);
      return primary?.url || this.article.images[0]?.url;
    }
    return this.article?.imageUrl || `https://picsum.photos/seed/${this.article?.slug || 'article'}/1200/500`;
  }
  
  setImageIndex(index: number) {
    this.currentImageIndex = index;
  }
  
  prevImage() {
    if (!this.article?.images) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.article.images.length) % this.article.images.length;
  }
  
  nextImage() {
    if (!this.article?.images) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.article.images.length;
  }
}
