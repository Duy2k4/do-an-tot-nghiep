import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'destinations',
    loadComponent: () => import('./pages/destination/destination-list/destination-list.component').then(m => m.DestinationListComponent),
  },
  {
    path: 'destinations/:slug',
    loadComponent: () => import('./pages/destination/destination-detail/destination-detail.component').then(m => m.DestinationDetailComponent),
  },
  {
    path: 'tours',
    loadComponent: () => import('./pages/tour/tour-list/tour-list.component').then(m => m.TourListComponent),
  },
  {
    path: 'tours/:slug',
    loadComponent: () => import('./pages/tour/tour-detail/tour-detail.component').then(m => m.TourDetailComponent),
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/article/article-list/article-list.component').then(m => m.ArticleListComponent),
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('./pages/article/article-detail/article-detail.component').then(m => m.ArticleDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'recommendations',
    loadComponent: () => import('./pages/recommendation/recommendation.component').then(m => m.RecommendationComponent),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'profile', loadComponent: () => import('./pages/user/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'favorites', loadComponent: () => import('./pages/user/favorites/favorites.component').then(m => m.FavoritesComponent) },
      { path: 'inquiries', loadComponent: () => import('./pages/user/inquiries/inquiries.component').then(m => m.InquiriesComponent) },
      { path: 'bookings', loadComponent: () => import('./pages/user/bookings/bookings.component').then(m => m.UserBookingsComponent) },
    ]
  },
  // Route quản trị
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'destinations', loadComponent: () => import('./admin/destinations/destinations.component').then(m => m.AdminDestinationsComponent) },
      { path: 'destinations/create', loadComponent: () => import('./admin/destinations/destination-form/destination-form.component').then(m => m.DestinationFormComponent) },
      { path: 'destinations/edit/:id', loadComponent: () => import('./admin/destinations/destination-form/destination-form.component').then(m => m.DestinationFormComponent) },
      { path: 'tours', loadComponent: () => import('./admin/tours/tours.component').then(m => m.AdminToursComponent) },
      { path: 'tours/create', loadComponent: () => import('./admin/tours/tour-form/tour-form.component').then(m => m.TourFormComponent) },
      { path: 'tours/edit/:id', loadComponent: () => import('./admin/tours/tour-form/tour-form.component').then(m => m.TourFormComponent) },
      { path: 'articles', loadComponent: () => import('./admin/articles/articles.component').then(m => m.AdminArticlesComponent) },
      { path: 'articles/create', loadComponent: () => import('./admin/articles/article-form/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'articles/edit/:id', loadComponent: () => import('./admin/articles/article-form/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'categories', loadComponent: () => import('./admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'users', loadComponent: () => import('./admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'reviews', loadComponent: () => import('./admin/reviews/reviews.component').then(m => m.ReviewsComponent) },
      { path: 'inquiries', loadComponent: () => import('./admin/inquiries/inquiries.component').then(m => m.AdminInquiriesComponent) },
      { path: 'bookings', loadComponent: () => import('./admin/bookings/bookings.component').then(m => m.AdminBookingsComponent) },
      { path: 'settings', loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
