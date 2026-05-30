# Du Lịch Quảng Bá - Website Giới Thiệu & Quảng Báo Du Lịch

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Tính năng](#tính-năng)
4. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
5. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
6. [Tài khoản demo](#tài-khoản-demo)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)

---

## Giới thiệu

**Du Lịch Quảng Bá** là đồ án tốt nghiệp - website giới thiệu và quảng bá du lịch Việt Nam. Hệ thống tích hợp các tính năng thông minh bao gồm gợi ý địa điểm bằng AI và chatbot tư vấn du lịch 24/7.

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | Angular 17, Angular Material, TypeScript, SCSS |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | MySQL 8.0 |
| **Auth** | JWT, bcryptjs |

---

## Tính năng

### Website người dùng
- [x] Trang chủ với banner, điểm đến nổi bật, tour, bài viết
- [x] Danh sách & chi tiết địa điểm du lịch
- [x] Danh sách & chi tiết tour du lịch
- [x] Danh sách & chi tiết bài viết cẩm nang
- [x] Tìm kiếm và lọc theo nhiều tiêu chí
- [x] Đăng ký / đăng nhập / đăng xuất
- [x] Cập nhật hồ sơ & đổi mật khẩu
- [x] Lưu địa điểm yêu thích
- [x] Đánh giá & bình luận địa điểm/tour
- [x] Gửi yêu cầu tư vấn / liên hệ
- [x] Xem lịch sử yêu cầu của mình

### Tính năng thông minh (AI)
- [x] **Chatbot tư vấn du lịch** - Hybrid chatbot với keyword detection, intent classification, knowledge base retrieval, và rule-based response generation
- [x] **Gợi ý địa điểm thông minh** - Rule-based scoring engine với các tiêu chí: rating, review count, region match, category match, budget match

### Trang quản trị (Admin)
- [x] Dashboard thống kê
- [x] CRUD địa điểm du lịch
- [x] CRUD tour du lịch
- [x] CRUD bài viết cẩm nang
- [x] Quản lý danh mục
- [x] Quản lý người dùng
- [x] Quản lý đánh giá/bình luận
- [x] Quản lý yêu cầu tư vấn/liên hệ

---

## Cấu trúc thư mục

```
webquangbadulich/
├── backend/
│   ├── src/
│   │   ├── index.js              # Entry point
│   │   ├── routes/               # API routes
│   │   ├── middlewares/          # Auth, error, logger
│   │   └── utils/
│   │       └── prisma.js         # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed/
│   │       └── index.js          # Seed data
│   ├── uploads/                  # Uploaded files
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── main.ts               # Bootstrap
│   │   ├── styles.scss          # Global styles
│   │   └── app/
│   │       ├── app.component.ts
│   │       ├── app.routes.ts
│   │       ├── core/             # Services, guards, interceptors
│   │       ├── shared/          # Shared components (navbar, footer, chatbot)
│   │       ├── pages/           # Public pages
│   │       └── admin/           # Admin module
│   └── package.json
│
├── docs/                         # Tài liệu phân tích thiết kế
│   ├── business-analysis.md
│   ├── database-design.md
│   ├── use-cases.md
│   ├── api-spec.md
│   ├── system-architecture.md
│   ├── testing-plan.md
│   └── deployment-guide.md
│
└── README.md
```

---

## Hướng dẫn cài đặt

### Yêu cầu
- Node.js 18+
- MySQL 8.0+
- npm 9+

### Bước 1: Cài đặt MySQL

```sql
-- Tạo database
CREATE DATABASE webquangbadulich CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Cài đặt Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Copy và chỉnh sửa .env
cp .env.example .env
# Chỉnh sửa DATABASE_URL trong .env:
# DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/webquangbadulich"

# Generate Prisma client
npx prisma generate

# Push schema lên database
npx prisma db push

# Seed dữ liệu mẫu
npm run db:seed

# Chạy server
npm run dev
# Server chạy tại http://localhost:3000
```

### Bước 3: Cài đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
# Frontend chạy tại http://localhost:4200
```

### Lệnh tổng hợp

```bash
# Backend
cd backend && npm install && npx prisma generate && npx prisma db push && npm run db:seed && npm run dev

# Frontend (terminal khác)
cd frontend && npm install && npm start
```

---

## Tài khoản demo

| Vai trò | Email | Password | URL |
|---------|-------|----------|-----|
| **Admin** | admin@webquangbadulich.com | admin123 | http://localhost:4200/admin |
| **User** | user@webquangbadulich.com | user123 | http://localhost:4200 |

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Destinations
- `GET /api/destinations` - Danh sách (phân trang, lọc)
- `GET /api/destinations/featured` - Điểm đến nổi bật
- `GET /api/destinations/:id` - Chi tiết
- `POST /api/destinations` - Tạo (admin)
- `PUT /api/destinations/:id` - Sửa (admin)
- `DELETE /api/destinations/:id` - Xóa (admin)

### Tours, Articles, Reviews, Favorites, Inquiries
Tương tự với các endpoint CRUD đầy đủ.

### AI Features
- `POST /api/chatbot` - Gửi tin nhắn chatbot
- `POST /api/recommendations` - Gợi ý địa điểm thông minh

---

## Database Schema

Tổng cộng **18 tables**:
- users, roles
- destinations, destination_categories, destination_images, destination_tags, destination_relations, tags
- tours, tour_schedules, tour_images
- articles, article_categories
- provinces
- reviews, favorites, inquiries
- chatbot_histories, recommendation_logs

---

## Dữ liệu mẫu

Sau khi seed thành công:
- **30+ địa điểm du lịch** trên khắp Việt Nam
- **15 tour du lịch** với lịch trình chi tiết
- **20 bài viết cẩm nang** chia theo danh mục
- **20 người dùng** (1 admin + 19 user)
- **100+ đánh giá**
- **30 yêu cầu tư vấn/liên hệ**
- Đầy đủ categories, provinces, tags

---

## Scripts

```bash
# Backend
npm run dev          # Chạy dev server với nodemon
npm start            # Chạy production
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema
npm run db:seed       # Seed data
npm run db:setup      # Push + seed

# Frontend
npm start            # Dev server (port 4200)
npm run build        # Build production
```

---

## Environment Variables

```env
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/webquangbadulich"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:4200"
```

---

## Testing Checklist

- [ ] Backend server khởi động thành công
- [ ] Database connection thành công
- [ ] Seed data được tạo đầy đủ
- [ ] Frontend dev server khởi động thành công
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản admin
- [ ] Đăng nhập với tài khoản user
- [ ] Xem danh sách địa điểm
- [ ] Xem chi tiết địa điểm
- [ ] Tìm kiếm và lọc địa điểm
- [ ] Xem danh sách tour
- [ ] Xem chi tiết tour
- [ ] Xem danh sách bài viết
- [ ] Xem chi tiết bài viết
- [ ] Gửi yêu cầu liên hệ
- [ ] Gửi yêu cầu tư vấn tour
- [ ] Đăng nhập, đánh giá địa điểm
- [ ] Thêm/bớt yêu thích
- [ ] Chatbot trả lời câu hỏi
- [ ] AI recommendation hoạt động
- [ ] Admin dashboard thống kê
- [ ] Admin CRUD destinations
- [ ] Admin CRUD tours
- [ ] Admin CRUD articles
- [ ] Admin quản lý users
- [ ] Admin quản lý inquiries
- [ ] Responsive trên mobile
- [ ] Responsive trên tablet
- [ ] Responsive trên desktop

