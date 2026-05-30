import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
export class DestinationDetailComponent implements OnInit {
  destination: any = null;
  relatedDestinations: any[] = [];
  reviews: any[] = [];
  isFavorite = false;
  loadingError = false;
  newReview: any = { rating: 0, comment: '' };
  reviewSuccess = false;
  userReview: any = null;
  isEditingReview = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private authModal: AuthModalService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || this.route.snapshot.paramMap.get('id');
    this.loadDestination(slug!);
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
  reviewError = '';

  submitReview() {
    this.reviewError = '';
    if (!this.newReview.rating) { this.reviewError = 'Vui lòng chọn số sao'; return; }
    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Vui lòng nhập nội dung đánh giá'; return;
    } else if (this.newReview.comment.trim().length < 10) {
      this.reviewError = 'Nội dung đánh giá ít nhất 10 ký tự'; return;
    }
    this.api.createReview({
      destinationId: this.destination.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    }).subscribe({
      next: (res) => {
        this.reviews.unshift(res);
        this.userReview = res;
        this.newReview = { rating: 0, comment: '' };
        this.isEditingReview = false;
        this.reviewSuccess = true;
        setTimeout(() => this.reviewSuccess = false, 3000);
      }
    });
  }

  editReview() {
    this.isEditingReview = true;
  }

  cancelEdit() {
    this.isEditingReview = false;
    if (this.userReview) {
      this.newReview = { rating: this.userReview.rating, comment: this.userReview.comment };
    }
  }

  saveReview() {
    this.reviewError = '';
    if (!this.newReview.rating) { this.reviewError = 'Vui lòng chọn số sao'; return; }
    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Vui lòng nhập nội dung đánh giá'; return;
    } else if (this.newReview.comment.trim().length < 10) {
      this.reviewError = 'Nội dung đánh giá ít nhất 10 ký tự'; return;
    }
    this.api.createReview({
      destinationId: this.destination.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    }).subscribe({
      next: (res) => {
        const idx = this.reviews.findIndex((r: any) => r.id === this.userReview.id);
        if (idx !== -1) this.reviews[idx] = res;
        this.userReview = res;
        this.isEditingReview = false;
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
      }
    });
  }
}
