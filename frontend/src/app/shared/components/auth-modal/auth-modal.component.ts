import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalService, AuthModalTab } from '../../../core/services/auth-modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  activeTab: 'login' | 'register' = 'login';
  private sub!: Subscription;

  // Đăng nhập
  loginEmail = '';
  loginPassword = '';
  loginShowPassword = false;
  loginError = '';
  loginFieldErrors: any = {};
  loginLoading = false;

  // Đăng ký
  regFullName = '';
  regEmail = '';
  regPhone = '';
  regPassword = '';
  regConfirmPassword = '';
  regShowPassword = false;
  regShowConfirmPassword = false;
  regError = '';
  regFieldErrors: any = {};
  regLoading = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private modalService: AuthModalService
  ) {}

  ngOnInit() {
    this.sub = this.modalService.open$.subscribe(tab => {
      if (tab) {
        this.open(tab);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  open(tab: AuthModalTab = 'login') {
    this.activeTab = tab;
    this.isOpen = true;
    this.clearErrors();
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.clearErrors();
  }

  clearErrors() {
    this.loginError = '';
    this.loginFieldErrors = {};
    this.regError = '';
    this.regFieldErrors = {};
  }

  // ============ ĐĂNG NHẬP ============
  validateLogin(): boolean {
    this.loginFieldErrors = {};
    if (!this.loginEmail.trim()) {
      this.loginFieldErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginEmail)) {
      this.loginFieldErrors.email = 'Email không đúng định dạng';
    }
    if (!this.loginPassword) {
      this.loginFieldErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (this.loginPassword.length < 6) {
      this.loginFieldErrors.password = 'Mật khẩu ít nhất 6 ký tự';
    }
    return Object.keys(this.loginFieldErrors).length === 0;
  }

  onLogin() {
    if (!this.validateLogin()) return;
    this.loginLoading = true;
    this.loginError = '';
    this.api.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (res) => {
        this.auth.login(res.token, res.user);
        this.loginLoading = false;
        this.close();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loginError = err.error?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
        this.loginLoading = false;
      }
    });
  }

  // ============ ĐĂNG KÝ ============
  validateRegister(): boolean {
    this.regFieldErrors = {};
    if (!this.regFullName.trim()) {
      this.regFieldErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (this.regFullName.trim().length < 2) {
      this.regFieldErrors.fullName = 'Họ tên ít nhất 2 ký tự';
    }
    if (!this.regEmail.trim()) {
      this.regFieldErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.regEmail)) {
      this.regFieldErrors.email = 'Email không đúng định dạng';
    }
    if (!this.regPhone || this.regPhone.trim().length < 10) {
      this.regFieldErrors.phone = 'Vui lòng nhập số điện thoại (ít nhất 10 số)';
    } else if (!/^[0-9]{10,11}$/.test(this.regPhone.replace(/\s/g, ''))) {
      this.regFieldErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!this.regPassword) {
      this.regFieldErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (this.regPassword.length < 6) {
      this.regFieldErrors.password = 'Mật khẩu ít nhất 6 ký tự';
    }
    if (!this.regConfirmPassword) {
      this.regFieldErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (this.regPassword !== this.regConfirmPassword) {
      this.regFieldErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    return Object.keys(this.regFieldErrors).length === 0;
  }

  onRegister() {
    if (!this.validateRegister()) return;
    this.regLoading = true;
    this.regError = '';
    this.api.register({
      fullName: this.regFullName,
      email: this.regEmail,
      phone: this.regPhone,
      password: this.regPassword
    }).subscribe({
      next: (res) => {
        this.auth.login(res.token, res.user);
        this.regLoading = false;
        this.close();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.regError = err.error?.error || 'Đăng ký thất bại. Vui lòng thử lại.';
        this.regLoading = false;
      }
    });
  }
}
