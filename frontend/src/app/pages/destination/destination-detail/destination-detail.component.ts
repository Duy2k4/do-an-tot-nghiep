import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalService } from '../../../core/services/auth-modal.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './destination-detail.component.html',
  styleUrls: ['./destination-detail.component.css']
})
export class DestinationDetailComponent implements OnInit, OnDestroy {
  destination: any = null;
  relatedDestinations: any[] = [];
  reviews: any[] = [];
  isFavorite = false;
  loadingError = false;
  newReview: any = { rating: 0, comment: '' };
  reviewSuccess = false;
  userReview: any = null;
  isEditingReview = false;
  reviewSubmitted = false;
  reviewError = '';
  private routeSub!: Subscription;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private authModal: AuthModalService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || params.get('id');
      if (slug) {
        this.resetState();
        this.loadDestination(slug);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  resetState() {
    this.destination = null;
    this.relatedDestinations = [];
    this.reviews = [];
    this.isFavorite = false;
    this.loadingError = false;
    this.newReview = { rating: 0, comment: '' };
    this.reviewSuccess = false;
    this.userReview = null;
    this.isEditingReview = false;
    this.reviewSubmitted = false;
    this.reviewError = '';
  }

  loadDestination(slug: string) {
    this.api.getDestination(slug).subscribe({
      next: (data) => {
        this.destination = data;
        this.relatedDestinations = data.relatedTo?.map((r: any) => r.from).filter(Boolean) || [];
        this.reviews = data.reviews || [];
        if (this.auth.isLoggedIn()) {
          this.checkFavorite();
          this.findUserReview();
        }
      },
      error: () => { this.loadingError = true; }
    });
  }

  findUserReview() {
    const userId = this.auth.user()?.id;
    if (!userId || !this.destination) return;
    const found = this.reviews.find((r: any) => r.user?.id === userId);
    if (found) {
      this.userReview = found;
      this.newReview = { rating: found.rating, comment: found.comment };
    }
  }

  get visibleReviews(): any[] {
    if (!this.userReview?.id) return this.reviews;
    return this.reviews.filter((r: any) => r.id !== this.userReview.id);
  }

  getHighlights(): string[] {
    if (!this.destination?.highlights) return [];
    try { return JSON.parse(this.destination.highlights); } catch { return []; }
  }

  toggleFavorite() {
    if (!this.auth.isLoggedIn()) {
      this.openLogin();
      return;
    }
    if (this.isFavorite) {
      this.api.removeFavorite(this.destination.id).subscribe(() => { this.isFavorite = false; });
    } else {
      this.api.addFavorite(this.destination.id).subscribe(() => { this.isFavorite = true; });
    }
  }

  openLogin() {
    this.authModal.open('login');
  }

  checkFavorite() {
    this.api.checkFavorite(this.destination.id).subscribe((res) => { this.isFavorite = res.isFavorite; });
  }

  setReviewRating(rating: number) {
    this.newReview.rating = rating;
    if (this.reviewSubmitted) this.validateReview();
  }

  onReviewCommentChange() {
    if (this.reviewSubmitted) this.validateReview();
  }

  isReviewCommentInvalid(): boolean {
    const comment = this.newReview.comment?.trim() || '';
    return this.reviewSubmitted && (comment.length === 0 || comment.length < 10);
  }

  canSubmitReview(): boolean {
    return !!this.newReview.rating && (this.newReview.comment?.trim() || '').length >= 10;
  }

  validateReview(): boolean {
    this.reviewError = '';
    if (!this.newReview.rating) {
      this.reviewError = 'Vui lòng chọn số sao';
      return false;
    }

    const comment = this.newReview.comment?.trim() || '';
    if (!comment) {
      this.reviewError = 'Vui lòng nhập nội dung đánh giá';
      return false;
    }

    if (comment.length < 10) {
      this.reviewError = 'Nội dung đánh giá ít nhất 10 ký tự';
      return false;
    }

    return true;
  }

  submitReview() {
    this.reviewSubmitted = true;
    if (!this.validateReview()) return;

    this.api.createReview({
      destinationId: this.destination.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim(),
    }).subscribe({
      next: (res) => {
        this.reviews.unshift(res);
        this.userReview = res;
        this.newReview = { rating: 0, comment: '' };
        this.isEditingReview = false;
        this.reviewSubmitted = false;
        this.reviewSuccess = true;
        setTimeout(() => this.reviewSuccess = false, 3000);
      }
    });
  }

  editReview() {
    if (!this.userReview) return;

    this.newReview = {
      rating: this.userReview.rating,
      comment: this.userReview.comment || '',
    };
    this.isEditingReview = true;
    this.reviewSubmitted = false;
    this.reviewError = '';
  }

  cancelEdit() {
    this.isEditingReview = false;
    this.reviewSubmitted = false;
    this.reviewError = '';
    if (this.userReview) {
      this.newReview = { rating: this.userReview.rating, comment: this.userReview.comment };
    }
  }

  saveReview() {
    this.reviewSubmitted = true;
    if (!this.validateReview()) return;

    this.api.updateReview(this.userReview.id, {
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim(),
    }).subscribe({
      next: (res) => {
        const idx = this.reviews.findIndex((r: any) => r.id === this.userReview.id);
        if (idx !== -1) this.reviews[idx] = res;
        this.userReview = res;
        this.isEditingReview = false;
        this.reviewSubmitted = false;
        this.reviewSuccess = true;
        setTimeout(() => this.reviewSuccess = false, 3000);
      }
    });
  }

  async deleteReview() {
    if (!this.userReview) return;
    const confirmed = await this.confirmDialog.confirm({ message: 'Bạn có chắc muốn xóa đánh giá này?' });
    if (!confirmed) return;

    this.api.deleteReview(this.userReview.id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r: any) => r.id !== this.userReview.id);
        this.userReview = null;
        this.newReview = { rating: 0, comment: '' };
        this.isEditingReview = false;
        this.reviewSubmitted = false;
        this.reviewError = '';
      }
    });
  }
}
