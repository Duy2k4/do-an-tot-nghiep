# Database Design - Du Lịch Quảng Bá

## 1. ERD Overview

```
┌──────────┐       ┌──────────┐       ┌──────────────────┐
│   Role   │──1:N──│   User   │──1:N──│    Review        │
└──────────┘       └────┬─────┘       └────────┬─────────┘
                        │                      │
                        │                      ├──────► Destination
                        │                      └──────► Tour
                        │
                  ┌─────┴─────┐
                  │Favorite   │
                  │Inquiry    │
                  │ChatbotHistory│
                  │RecommendationLog│
                  └───────────┘

┌──────────┐ 1:N ┌────────────┐ 1:N ┌──────────────┐
│ Province  │────►│Destination │◄───►│DestinationTag│──N:1►Tag
└──────────┘      └─────┬──────┘      └──────────────┘
                         │
          ┌───────────────┼───────────────┬──────────────┐
          │               │               │              │
          ▼               ▼               ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌───────────┐ ┌───────────────┐
│DestinationImage││   Review    │ │  Favorite │ │DestinationRelation│
└──────────────┘ └──────────────┘ └───────────┘ └───────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌──────────┐       ┌──────────┐
        │  Tour    │       │ Article  │
        └────┬─────┘       └────┬─────┘
             │                   │
      ┌──────┴──────┐      ┌─────┴──────────┐
      ▼              ▼      ▼                ▼
┌──────────┐ ┌────────────┐ ┌───────────┐ ┌──────────────┐
│TourSchedule│ │ TourImage  │ │TourImage  │ │ArticleCategory│
└──────────┘ └────────────┘ └───────────┘ └──────────────┘
```

## 2. Bảng chi tiết

### 2.1. users
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK, default | Khóa chính |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| password | VARCHAR(255) | NOT NULL | Hash password |
| fullName | VARCHAR(255) | NOT NULL | Họ tên đầy đủ |
| phone | VARCHAR(20) | NULLABLE | Số điện thoại |
| avatar | VARCHAR(500) | NULLABLE | URL avatar |
| isActive | BOOLEAN | DEFAULT true | Trạng thái hoạt động |
| roleId | UUID | FK -> roles.id | ID vai trò |
| createdAt | DATETIME | DEFAULT now() | Ngày tạo |
| updatedAt | DATETIME | auto | Ngày cập nhật |

### 2.2. roles
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK | Khóa chính |
| name | VARCHAR(50) | UNIQUE | Tên vai trò (admin, user) |

### 2.3. destinations
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK | Khóa chính |
| name | VARCHAR(255) | NOT NULL | Tên địa điểm |
| slug | VARCHAR(255) | UNIQUE | Slug URL |
| description | TEXT | NOT NULL | Mô tả chi tiết |
| shortDescription | TEXT | NULLABLE | Mô tả ngắn |
| address | VARCHAR(500) | NOT NULL | Địa chỉ |
| provinceId | UUID | FK -> provinces | Tỉnh/thành |
| categoryId | UUID | FK -> destination_categories | Danh mục |
| latitude | FLOAT | NULLABLE | Vĩ độ |
| longitude | FLOAT | NULLABLE | Kinh độ |
| bestTime | VARCHAR(255) | | Thời gian đẹp nhất |
| estimatedCost | VARCHAR(255) | | Chi phí ước tính |
| rating | FLOAT | DEFAULT 0 | Điểm đánh giá |
| reviewCount | INT | DEFAULT 0 | Số đánh giá |
| viewCount | INT | DEFAULT 0 | Số lượt xem |
| tips | TEXT | NULLABLE | Mẹo du lịch |
| highlights | TEXT | NULLABLE | Điểm nổi bật (JSON) |
| isFeatured | BOOLEAN | DEFAULT false | Nổi bật |
| isActive | BOOLEAN | DEFAULT true | Hoạt động |
| createdAt | DATETIME | DEFAULT now() | Ngày tạo |
| updatedAt | DATETIME | auto | Ngày cập nhật |

### 2.4. tours
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK | Khóa chính |
| name | VARCHAR(255) | NOT NULL | Tên tour |
| slug | VARCHAR(255) | UNIQUE | Slug URL |
| description | TEXT | NOT NULL | Mô tả |
| shortDescription | TEXT | NULLABLE | Mô tả ngắn |
| destinationId | UUID | FK -> destinations | Địa điểm chính |
| duration | VARCHAR(50) | | Thời lượng |
| maxPeople | INT | | Số người tối đa |
| price | FLOAT | NOT NULL | Giá gốc |
| discountPrice | FLOAT | NULLABLE | Giá giảm |
| includes | TEXT | NULLABLE | Bao gồm (JSON) |
| excludes | TEXT | NULLABLE | Không bao gồm |
| imageUrl | VARCHAR(500) | NULLABLE | URL ảnh chính |
| isFeatured | BOOLEAN | DEFAULT false | Nổi bật |
| isActive | BOOLEAN | DEFAULT true | Hoạt động |
| createdAt | DATETIME | | Ngày tạo |
| updatedAt | DATETIME | | Ngày cập nhật |

### 2.5. articles
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK | Khóa chính |
| title | VARCHAR(500) | NOT NULL | Tiêu đề |
| slug | VARCHAR(255) | UNIQUE | Slug URL |
| content | TEXT | NOT NULL | Nội dung HTML |
| excerpt | TEXT | NULLABLE | Tóm tắt |
| imageUrl | VARCHAR(500) | NULLABLE | URL ảnh |
| categoryId | UUID | FK -> article_categories | Danh mục |
| authorId | UUID | FK -> users | Tác giả |
| tags | VARCHAR(500) | NULLABLE | Tags (comma-separated) |
| viewCount | INT | DEFAULT 0 | Lượt xem |
| isFeatured | BOOLEAN | DEFAULT false | Nổi bật |
| isPublished | BOOLEAN | DEFAULT true | Đã xuất bản |
| publishedAt | DATETIME | NULLABLE | Ngày xuất bản |
| createdAt | DATETIME | | Ngày tạo |
| updatedAt | DATETIME | | Ngày cập nhật |

### 2.6. reviews
| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | UUID | PK | Khóa chính |
| userId | UUID | FK -> users | Người đánh giá |
| destinationId | UUID | FK -> destinations, NULLABLE | Địa điểm |
| tourId | UUID | FK -> tours, NULLABLE | Tour |
| rating | INT | 1-5 | Điểm sao |
| comment | TEXT | NOT NULL | Nội dung |
| createdAt | DATETIME | | Ngày tạo |
| updatedAt | DATETIME | | Ngày cập nhật |

## 3. Indexes

- `destinations.slug` - UNIQUE index cho URL
- `users.email` - UNIQUE index cho đăng nhập
- `destinations.provinceId` - Foreign key index
- `destinations.categoryId` - Foreign key index
- `reviews.destinationId` - Foreign key index
- `reviews.tourId` - Foreign key index
- `favorites.userId_destinationId` - UNIQUE composite index

## 4. Relationships

- User 1:N Review (user có nhiều review)
- User 1:N Favorite (user có nhiều favorites)
- User 1:N Inquiry (user có nhiều inquiries)
- User 1:N ChatbotHistory (user có nhiều chat histories)
- Destination 1:N Review (destination có nhiều review)
- Destination 1:N Favorite (destination có nhiều favorite)
- Destination N:N Tag (qua bảng destination_tags)
- Tour 1:N Review (tour có nhiều review)
- Tour 1:N TourSchedule (tour có nhiều lịch trình)
- Province 1:N Destination (province có nhiều destination)
- Category 1:N Destination (category có nhiều destination)
- Article 1:N Category (category có nhiều article)
