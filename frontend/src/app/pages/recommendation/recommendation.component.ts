import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  loading = false;
  results: any = null;
  preferences: any = {};
  categories: any[] = [];
  selectedCategories = new Set<string>();

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.api.getDestinationCategories().subscribe({
      next: (data: any) => { this.categories = data; }
    });
  }

  toggleCategory(slug: string) {
    if (this.selectedCategories.has(slug)) {
      this.selectedCategories.delete(slug);
    } else {
      this.selectedCategories.add(slug);
    }
  }

  getRecommendations() {
    this.loading = true;
    const prefs: any = {};
    const regions: string[] = [];

    if (this.preferences.north) regions.push('NORTH');
    if (this.preferences.central) regions.push('CENTRAL');
    if (this.preferences.south) regions.push('SOUTH');

    if (regions.length) prefs.regions = regions;
    if (this.selectedCategories.size > 0) prefs.categories = Array.from(this.selectedCategories);
    if (this.preferences.budget) prefs.budget = this.preferences.budget;

    this.api.getRecommendations(prefs).subscribe({
      next: (res: any) => {
        // Xử lý cả định dạng phản hồi cũ (theo luật) và mới (AI)
        if (res.recommendations) {
          res.recommendations = res.recommendations.map((r: any) => ({
            ...r,
            // Chuẩn hóa: AI trả về matchScore/aiReason, bản cũ trả về recommendationScore/matchReasons
            matchScore: r.matchScore ?? r.recommendationScore ?? 0,
            aiReason: r.aiReason ?? (r.matchReasons?.join(', ') || ''),
          }));
        }
        this.results = res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
