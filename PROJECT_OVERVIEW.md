# Du Lịch Quảng Bá - Tourism Website

## 1. Giới thiệu dự án

**Du Lịch Quảng Bá** là website giới thiệu và quảng bá du lịch Việt Nam, được phát triển như đồ án tốt nghiệp. Hệ thống cung cấp nền tảng cho du khách tìm kiếm, khám phá điểm đến, đặt tour, đọc cẩm nang du lịch, và nhận gợi ý thông minh từ AI.

## 2. Công nghệ sử dụng

### Frontend
- **Angular 17+** (standalone components, signals)
- **Angular Material** (UI components)
- **TypeScript 5.x**
- **SCSS** (styling)

### Backend
- **Node.js 18+**
- **Express.js 4.x**
- **Prisma ORM**
- **JWT** (authentication)
- **bcrypt** (password hashing)

### Database
- **MySQL 8.0**

## 3. Kiến trúc hệ thống

```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐
│   Angular SPA   │ ◄──────────────► │   Express API   │
│   (Frontend)    │                  │   (Backend)      │
└─────────────────┘                  └────────┬────────┘
                                              │
                                              │ Prisma ORM
                                              ▼
                                      ┌─────────────────┐
                                      │     MySQL 8      │
                                      │   (Database)     │
                                      └─────────────────┘
```

## 4. Cấu trúc thư mục

```
webquangbadulich/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Auth, validation, error
│   │   ├── modules/      # Feature modules
│   │   ├── utils/        # Helpers
│   │   └── index.js      # Entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed/         # Seed data
│   └── package.json
│
├── frontend/             # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Guards, interceptors, services
│   │   │   ├── shared/   # Shared components, pipes, directives
│   │   │   ├── pages/    # Page components
│   │   │   └── admin/    # Admin module
│   │   └── assets/
│   └── package.json
│
└── docs/                 # Tài liệu phân tích thiết kế
```

## 5. Tính năng chính

### Người dùng (Public)
- Xem trang chủ với banner, điểm đến nổi bật, tour, bài viết
- Tìm kiếm & lọc địa điểm du lịch theo tỉnh/thành, loại hình
- Xem chi tiết địa điểm với hình ảnh, mô tả, đánh giá
- Xem danh sách tour với giá, lịch trình
- Đọc cẩm nang/bài viết du lịch theo danh mục
- Đăng ký / đăng nhập tài khoản
- Lưu địa điểm yêu thích
- Đánh giá & bình luận địa điểm/tour
- Gửi yêu cầu tư vấn / liên hệ
- Chatbot tư vấn du lịch (AI-powered)
- Gợi ý địa điểm thông minh theo sở thích

### Quản trị (Admin)
- Dashboard thống kê
- CRUD địa điểm du lịch
- CRUD tour du lịch
- CRUD bài viết cẩm nang
- Quản lý danh mục
- Quản lý người dùng
- Quản lý đánh giá/bình luận
- Quản lý yêu cầu tư vấn/liên hệ

## 6. Cơ sở dữ liệu

- **users** - Tài khoản người dùng & admin
- **roles** - Phân quyền (admin, user)
- **destinations** - Địa điểm du lịch
- **destination_categories** - Danh mục địa điểm
- **destination_images** - Hình ảnh địa điểm
- **tours** - Tour du lịch
- **tour_schedules** - Lịch trình tour
- **articles** - Bài viết cẩm nang
- **article_categories** - Danh mục bài viết
- **reviews** - Đánh giá & bình luận
- **favorites** - Danh sách yêu thích
- **inquiries** - Yêu cầu tư vấn / liên hệ
- **chatbot_histories** - Lịch sử chatbot
- **recommendation_logs** - Log gợi ý AI
- **provinces** - Tỉnh/thành Việt Nam
- **tags** - Thẻ địa điểm
- **destination_tags** - Liên kết địa điểm - tag

## 7. API Endpoints chính

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Destinations
- `GET /api/destinations` - Danh sách địa điểm
- `GET /api/destinations/:id` - Chi tiết địa điểm
- `POST /api/destinations` - Tạo mới (admin)
- `PUT /api/destinations/:id` - Cập nhật (admin)
- `DELETE /api/destinations/:id` - Xóa (admin)

### Tours
- `GET /api/tours` - Danh sách tour
- `GET /api/tours/:id` - Chi tiết tour
- `POST /api/tours` - Tạo mới (admin)
- `PUT /api/tours/:id` - Cập nhật (admin)
- `DELETE /api/tours/:id` - Xóa (admin)

### Articles
- `GET /api/articles` - Danh sách bài viết
- `GET /api/articles/:id` - Chi tiết bài viết
- `POST /api/articles` - Tạo mới (admin)
- `PUT /api/articles/:id` - Cập nhật (admin)
- `DELETE /api/articles/:id` - Xóa (admin)

### Reviews
- `GET /api/reviews/destination/:id` - Đánh giá theo địa điểm
- `GET /api/reviews/tour/:id` - Đánh giá theo tour
- `POST /api/reviews` - Tạo đánh giá (user)
- `DELETE /api/reviews/:id` - Xóa đánh giá

### Favorites
- `GET /api/favorites` - Danh sách yêu thích (user)
- `POST /api/favorites` - Thêm yêu thích
- `DELETE /api/favorites/:destinationId` - Xóa yêu thích

### Inquiries
- `GET /api/inquiries` - Danh sách yêu cầu (admin)
- `POST /api/inquiries` - Gửi yêu cầu tư vấn
- `PUT /api/inquiries/:id` - Cập nhật trạng thái (admin)
- `DELETE /api/inquiries/:id` - Xóa (admin)

### AI Features
- `POST /api/recommendations` - Gợi ý địa điểm thông minh
- `POST /api/chatbot` - Chatbot tư vấn du lịch
- `GET /api/chatbot/history` - Lịch sử chat

### Categories
- `GET /api/categories/destinations` - Danh mục địa điểm
- `GET /api/categories/articles` - Danh mục bài viết
- `GET /api/provinces` - Danh sách tỉnh/thành

## 8. Địa chỉ triển khai

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Database**: localhost:3306

## 9. Tài khoản demo

- **Admin**: admin@webquangbadulich.com / admin123
- **User**: user@webquangbadulich.com / user123
