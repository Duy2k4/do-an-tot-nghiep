import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error = '';

  constructor(public api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getMyBookings().subscribe({
      next: data => { this.bookings = data; this.loading = false; },
      error: () => { this.error = 'Không thể tải danh sách đặt tour'; this.loading = false; }
    });
  }

  cancel(booking: any) {
    if (booking.status !== 'pending') return;
    this.api.cancelBooking(booking.id).subscribe(updated => {
      booking.status = updated.status;
    });
  }

  getTourImage(booking: any): string {
    const tour = booking?.tour;
    if (tour?.images?.[0]?.url) return this.api.mediaUrl(tour.images[0].url);
    if (tour?.imageUrl) return this.api.mediaUrl(tour.imageUrl);
    return `https://picsum.photos/seed/${tour?.slug || booking?.bookingCode || 'tour'}/180/120`;
  }

  statusLabel(status: string): string {
    if (status === 'confirmed') return 'Đã xác nhận';
    if (status === 'cancelled') return 'Đã hủy';
    return 'Chờ xác nhận';
  }
}
