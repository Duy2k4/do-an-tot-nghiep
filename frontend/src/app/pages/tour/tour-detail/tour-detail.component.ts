import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalService } from '../../../core/services/auth-modal.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour: any = null;
  bookingForm: any = {
    startDate: '',
    peopleCount: 1,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    note: '',
  };
  bookingLoading = false;
  bookingError = '';
  bookingSuccess = '';
  bookingFieldErrors: Record<string, string> = {};

  constructor(
    public api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private authModal: AuthModalService,
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || this.route.snapshot.paramMap.get('id') || '';
    this.api.getTour(slug).subscribe(data => { this.tour = data; });
    const user = this.auth.user();
    if (user) {
      this.bookingForm.contactName = user.fullName || '';
      this.bookingForm.contactEmail = user.email || '';
      this.bookingForm.contactPhone = user.phone || '';
    }
  }

  getIncludes(): string[] { try { return JSON.parse(this.tour?.includes || '[]'); } catch { return []; } }

  get minStartDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get unitPrice(): number {
    return this.tour ? (this.tour.discountPrice || this.tour.price || 0) : 0;
  }

  get estimatedTotal(): number {
    return this.unitPrice * Number(this.bookingForm.peopleCount || 0);
  }

  validateBookingForm(): boolean {
    this.bookingFieldErrors = {};
    const peopleCount = Number(this.bookingForm.peopleCount);
    const maxPeople = Number(this.tour?.maxPeople || 0);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(0|\+84)(\d{9,10})$/;

    if (!this.bookingForm.startDate) {
      this.bookingFieldErrors['startDate'] = 'Vui lòng chọn ngày khởi hành';
    } else if (this.bookingForm.startDate < this.minStartDate) {
      this.bookingFieldErrors['startDate'] = 'Ngày khởi hành không được nhỏ hơn hôm nay';
    }

    if (!Number.isInteger(peopleCount) || peopleCount < 1) {
      this.bookingFieldErrors['peopleCount'] = 'Số người phải lớn hơn 0';
    } else if (maxPeople && peopleCount > maxPeople) {
      this.bookingFieldErrors['peopleCount'] = `Số người tối đa là ${maxPeople}`;
    }

    if (!String(this.bookingForm.contactName || '').trim()) {
      this.bookingFieldErrors['contactName'] = 'Vui lòng nhập họ tên liên hệ';
    } else if (String(this.bookingForm.contactName).trim().length < 2) {
      this.bookingFieldErrors['contactName'] = 'Họ tên ít nhất 2 ký tự';
    }

    if (!String(this.bookingForm.contactEmail || '').trim()) {
      this.bookingFieldErrors['contactEmail'] = 'Vui lòng nhập email';
    } else if (!emailPattern.test(String(this.bookingForm.contactEmail).trim())) {
      this.bookingFieldErrors['contactEmail'] = 'Email không hợp lệ';
    }

    const normalizedPhone = String(this.bookingForm.contactPhone || '').replace(/\s/g, '');
    if (!normalizedPhone) {
      this.bookingFieldErrors['contactPhone'] = 'Vui lòng nhập số điện thoại';
    } else if (!phonePattern.test(normalizedPhone)) {
      this.bookingFieldErrors['contactPhone'] = 'Số điện thoại không hợp lệ';
    }

    return Object.keys(this.bookingFieldErrors).length === 0;
  }

  submitBooking() {
    if (!this.auth.isLoggedIn()) {
      this.authModal.open('login');
      return;
    }

    if (!this.validateBookingForm()) {
      this.bookingError = '';
      this.bookingSuccess = '';
      return;
    }

    this.bookingLoading = true;
    this.bookingError = '';
    this.bookingSuccess = '';

    this.api.createBooking({
      tourId: this.tour.id,
      ...this.bookingForm,
      peopleCount: Number(this.bookingForm.peopleCount),
    }).subscribe({
      next: (res: any) => {
        this.bookingSuccess = `Đặt tour thành công. Mã booking: ${res.booking.bookingCode}`;
        this.bookingLoading = false;
      },
      error: (err) => {
        this.bookingError = err.error?.error || 'Không thể đặt tour lúc này';
        this.bookingLoading = false;
      },
    });
  }
}
