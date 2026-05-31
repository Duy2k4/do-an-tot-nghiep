import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api';
const API_ORIGIN = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = API;

  constructor(private http: HttpClient) {}

  mediaUrl(url?: string | null): string {
    if (!url) return '';
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
  }

  // Xác thực
  login(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.base}/auth/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.base}/auth/profile`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.base}/auth/change-password`, data);
  }

  // Điểm đến
  getDestinations(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/destinations`, { params: httpParams });
  }

  getFeaturedDestinations(): Observable<any> {
    return this.http.get(`${this.base}/destinations/featured`);
  }

  getDestination(id: string): Observable<any> {
    return this.http.get(`${this.base}/destinations/${id}`);
  }

  createDestination(data: any): Observable<any> {
    return this.http.post(`${this.base}/destinations`, data);
  }

  updateDestination(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/destinations/${id}`, data);
  }

  deleteDestination(id: string): Observable<any> {
    return this.http.delete(`${this.base}/destinations/${id}`);
  }

  // Chuyến tham quan
  getTours(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/tours`, { params: httpParams });
  }

  getFeaturedTours(): Observable<any> {
    return this.http.get(`${this.base}/tours/featured`);
  }

  getTour(id: string): Observable<any> {
    return this.http.get(`${this.base}/tours/${id}`);
  }

  createTour(data: any): Observable<any> {
    return this.http.post(`${this.base}/tours`, data);
  }

  updateTour(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/tours/${id}`, data);
  }

  deleteTour(id: string): Observable<any> {
    return this.http.delete(`${this.base}/tours/${id}`);
  }

  // Bài viết
  getArticles(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/articles`, { params: httpParams });
  }

  getFeaturedArticles(): Observable<any> {
    return this.http.get(`${this.base}/articles/featured`);
  }

  getRecentArticles(): Observable<any> {
    return this.http.get(`${this.base}/articles/recent`);
  }

  getArticle(id: string): Observable<any> {
    return this.http.get(`${this.base}/articles/${id}`);
  }

  createArticle(data: any): Observable<any> {
    return this.http.post(`${this.base}/articles`, data);
  }

  updateArticle(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/articles/${id}`, data);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.base}/articles/${id}`);
  }

  getReviews(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/reviews`, { params: httpParams });
  }

  // Chi tiết đánh giá
  getReviewsByDestination(id: string, page = 1): Observable<any> {
    return this.http.get(`${this.base}/reviews/destination/${id}`, { params: { page, limit: 10 } });
  }

  getReviewsByTour(id: string, page = 1): Observable<any> {
    return this.http.get(`${this.base}/reviews/tour/${id}`, { params: { page, limit: 10 } });
  }

  createReview(data: any): Observable<any> {
    return this.http.post(`${this.base}/reviews`, data);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.base}/reviews/${id}`);
  }

  // Yêu thích
  getFavorites(): Observable<any> {
    return this.http.get(`${this.base}/favorites`);
  }

  addFavorite(destinationId: string): Observable<any> {
    return this.http.post(`${this.base}/favorites`, { destinationId });
  }

  removeFavorite(destinationId: string): Observable<any> {
    return this.http.delete(`${this.base}/favorites/${destinationId}`);
  }

  checkFavorite(destinationId: string): Observable<any> {
    return this.http.get(`${this.base}/favorites/check/${destinationId}`);
  }

  // Yêu cầu tư vấn
  getInquiries(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) httpParams = httpParams.set(key, params[key].toString());
      });
    }
    return this.http.get(`${this.base}/inquiries`, { params: httpParams });
  }

  getMyInquiries(): Observable<any> {
    return this.http.get(`${this.base}/inquiries/my`);
  }

  createInquiry(data: any): Observable<any> {
    return this.http.post(`${this.base}/inquiries`, data);
  }

  updateInquiry(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/inquiries/${id}`, data);
  }

  deleteInquiry(id: string): Observable<any> {
    return this.http.delete(`${this.base}/inquiries/${id}`);
  }

  // Đặt tour
  getBookings(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/bookings`, { params: httpParams });
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.base}/bookings/my`);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.base}/bookings`, data);
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.base}/bookings/${id}/status`, { status });
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.patch(`${this.base}/bookings/${id}/cancel`, {});
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.base}/bookings/${id}`);
  }

  // Danh mục
  getDestinationCategories(): Observable<any> {
    return this.http.get(`${this.base}/categories/destinations`);
  }

  getArticleCategories(): Observable<any> {
    return this.http.get(`${this.base}/categories/articles`);
  }

  createDestinationCategory(data: any): Observable<any> {
    return this.http.post(`${this.base}/categories/destinations`, data);
  }

  deleteDestinationCategory(id: string): Observable<any> {
    return this.http.delete(`${this.base}/categories/destinations/${id}`);
  }

  createArticleCategory(data: any): Observable<any> {
    return this.http.post(`${this.base}/categories/articles`, data);
  }

  deleteArticleCategory(id: string): Observable<any> {
    return this.http.delete(`${this.base}/categories/articles/${id}`);
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.base}/categories/provinces`);
  }

  syncExternalProvinces(): Observable<any> {
    return this.http.post(`${this.base}/categories/provinces/sync-external`, {});
  }

  getExternalProvinces(): Observable<any> {
    return this.http.get('https://provinces.open-api.vn/api/p/');
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.base}/categories/regions`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.base}/categories/tags`);
  }

  // Chatbot
  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.base}/chatbot`, data);
  }

  getChatHistory(): Observable<any> {
    return this.http.get(`${this.base}/chatbot/history`);
  }

  // Gợi ý
  getRecommendations(preferences: any): Observable<any> {
    return this.http.post(`${this.base}/recommendations`, { preferences });
  }

  getPopularRecommendations(): Observable<any> {
    return this.http.get(`${this.base}/recommendations/popular`);
  }

  // Bảng điều khiển
  getDashboard(): Observable<any> {
    return this.http.get(`${this.base}/dashboard`);
  }

  // Người dùng
  getUsers(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) httpParams = httpParams.set(key, params[key].toString());
      });
    }
    return this.http.get(`${this.base}/users`, { params: httpParams });
  }

  toggleUserActive(id: string): Observable<any> {
    return this.http.put(`${this.base}/users/${id}/toggle-active`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.base}/users/${id}`);
  }

  // Tải lên
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.base}/upload/image`, formData);
  }

  // Cài đặt
  getSettings(): Observable<any> {
    return this.http.get(`${this.base}/settings`);
  }

  getSettingsByGroup(group: string): Observable<any> {
    return this.http.get(`${this.base}/settings/group/${group}`);
  }

  updateSetting(data: any): Observable<any> {
    return this.http.put(`${this.base}/settings`, data);
  }

  updateSettingsBulk(settings: any): Observable<any> {
    return this.http.put(`${this.base}/settings/bulk`, { settings });
  }
}
