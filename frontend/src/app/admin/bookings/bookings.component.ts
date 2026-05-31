import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  data: any[] = [];
  loading = true;
  filterStatus = '';
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  pageNumbers: (number | string)[] = [];

  constructor(private api: ApiService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, limit: this.limit };
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.search) params.search = this.search;
    this.api.getBookings(params).subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.total = res.pagination.total;
        this.totalPages = res.pagination.totalPages;
        this.buildPageNumbers();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  buildPageNumbers() {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.page > 3) pages.push('...');
      for (let i = Math.max(2, this.page - 1); i <= Math.min(this.totalPages - 1, this.page + 1); i++) pages.push(i);
      if (this.page < this.totalPages - 2) pages.push('...');
      pages.push(this.totalPages);
    }
    this.pageNumbers = pages;
  }

  goTo(page: number | string) {
    if (page === '...' || page === this.page) return;
    this.page = +page;
    this.load();
  }

  updateStatus(booking: any) {
    this.api.updateBookingStatus(booking.id, booking.status).subscribe();
  }

  async delete(id: string) {
    if (await this.confirmDialog.confirm({ message: 'Bạn có chắc muốn xóa booking này?' })) {
      this.api.deleteBooking(id).subscribe(() => this.load());
    }
  }
}
