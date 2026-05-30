import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form: any = { type: 'contact' };
  fieldErrors: any = {};
  error = '';
  success = false;
  loading = false;

  constructor(private api: ApiService, public auth: AuthService) {
    if (this.auth.isLoggedIn()) {
      this.form.name = this.auth.user()?.fullName;
      this.form.email = this.auth.user()?.email;
    }
  }

  validate(): boolean {
    this.fieldErrors = {};
    if (!this.form.name || !this.form.name.trim()) {
      this.fieldErrors.name = 'Vui lòng nhập họ tên';
    } else if (this.form.name.trim().length < 2) {
      this.fieldErrors.name = 'Họ tên ít nhất 2 ký tự';
    }
    if (!this.form.email || !this.form.email.trim()) {
      this.fieldErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.fieldErrors.email = 'Email không đúng định dạng';
    }
    if (!this.form.phone || !this.form.phone.trim()) {
      this.fieldErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(this.form.phone.replace(/\s/g, ''))) {
      this.fieldErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    if (!this.form.subject || !this.form.subject.trim()) {
      this.fieldErrors.subject = 'Vui lòng nhập tiêu đề';
    } else if (this.form.subject.trim().length < 3) {
      this.fieldErrors.subject = 'Tiêu đề ít nhất 3 ký tự';
    }
    if (!this.form.message || !this.form.message.trim()) {
      this.fieldErrors.message = 'Vui lòng nhập nội dung';
    } else if (this.form.message.trim().length < 10) {
      this.fieldErrors.message = 'Nội dung ít nhất 10 ký tự';
    }
    return Object.keys(this.fieldErrors).length === 0;
  }

  submit() {
    if (!this.validate()) return;
    this.loading = true;
    this.error = '';
    this.api.createInquiry(this.form).subscribe({
      next: () => { this.success = true; this.loading = false; this.form = { type: 'contact' }; },
      error: (err) => { this.error = err.error?.error || 'Gửi thất bại'; this.loading = false; }
    });
  }
}
