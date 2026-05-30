import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

interface Breadcrumb { label: string; }

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  today = new Date();
  breadcrumbs: Breadcrumb[] = [];
  isSidebarOpen = false;

  private routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    destinations: 'Quản lý điểm đến',
    'destinations/create': 'Thêm điểm đến',
    'destinations/edit': 'Chỉnh sửa điểm đến',
    tours: 'Quản lý tour',
    'tours/create': 'Thêm tour',
    'tours/edit': 'Chỉnh sửa tour',
    articles: 'Quản lý bài viết',
    'articles/create': 'Thêm bài viết',
    'articles/edit': 'Chỉnh sửa bài viết',
    categories: 'Quản lý danh mục',
    users: 'Quản lý người dùng',
    reviews: 'Quản lý đánh giá',
    inquiries: 'Yêu cầu tư vấn',
    settings: 'Cài đặt',
  };

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateBreadcrumb(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateBreadcrumb(event.urlAfterRedirects);
      this.isSidebarOpen = false;
    });
  }

  private updateBreadcrumb(url: string) {
    const segments = url.replace('/admin/', '').split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [{ label: 'Admin' }];
    if (segments.length === 0) {
      crumbs.push({ label: 'Dashboard' });
    } else {
      const key = segments[0];
      const label = this.routeLabels[key] || this.capitalize(key);
      crumbs.push({ label });
      if (segments.length > 1) {
        const subKey = `${segments[0]}/${segments[1]}`;
        const subLabel = this.routeLabels[subKey] || this.capitalize(segments[1]);
        crumbs.push({ label: subLabel });
      }
    }
    this.breadcrumbs = crumbs;
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  logout() { this.auth.logout(); }
}
