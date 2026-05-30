import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<any>(null);
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  user = computed(() => this.currentUser());
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);
    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user));
      } catch {
        this.logout();
      }
    }
  }

  login(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  updateUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }
}
