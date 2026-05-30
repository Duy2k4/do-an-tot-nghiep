import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: any = {};
  formErrors: any = {};
  success = '';
  passwordForm: any = {};
  pwErrors: any = {};
  pwError = '';
  pwSuccess = '';
  loading = false;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.form = { ...this.auth.user() };
  }

  save() {
    this.formErrors = {};
    if (!this.form.fullName || !this.form.fullName.trim()) {
      this.formErrors.fullName = 'Vui lòng nhập họ tên'; return;
    } else if (this.form.fullName.trim().length < 2) {
      this.formErrors.fullName = 'Họ tên ít nhất 2 ký tự'; return;
    }
    this.loading = true;
    this.api.updateProfile(this.form).subscribe({
      next: (res) => {
        this.auth.updateUser(res.user);
        this.success = 'Cập nhật thành công!';
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.loading = false; }
    });
  }

  changePassword() {
    this.pwErrors = {};
    if (!this.passwordForm.current) { this.pwErrors.current = 'Vui lòng nhập mật khẩu hiện tại'; return; }
    if (!this.passwordForm.newPass) { this.pwErrors.newPass = 'Vui lòng nhập mật khẩu mới'; return; }
    if (this.passwordForm.newPass.length < 6) { this.pwErrors.newPass = 'Mật khẩu ít nhất 6 ký tự'; return; }
    this.loading = true;
    this.pwError = '';
    this.api.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.pwSuccess = 'Đổi mật khẩu thành công!';
        this.passwordForm = {};
        this.loading = false;
        setTimeout(() => this.pwSuccess = '', 3000);
      },
      error: (err) => {
        this.pwError = err.error?.error || 'Đổi mật khẩu thất bại';
        this.loading = false;
      }
    });
  }
}
