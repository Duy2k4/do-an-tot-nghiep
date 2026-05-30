# API Specification - Du Lịch Quảng Bá

## Base URL
```
Development: http://localhost:3000/api
```

## Authentication
JWT token required for protected endpoints. Include in header:
```
Authorization: Bearer <token>
```

## Response Format

### Success
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Paginated
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### Error
```json
{
  "error": "Error message",
  "errors": [{ "field": "...", "message": "..." }]
}
```

---

## Auth Endpoints

### POST /auth/register
Register new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "phone": "0901234567"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "token": "jwt_token",
  "user": { "id": "...", "email": "...", "fullName": "...", "role": "user" }
}
```

### POST /auth/login
Login user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": { "id": "...", "email": "...", "fullName": "...", "role": "user" }
}
```

### GET /auth/profile
Get current user profile. (Auth required)

### PUT /auth/profile
Update profile. (Auth required)

### PUT /auth/change-password
Change password. (Auth required)

---

## Destination Endpoints

### GET /destinations
Get paginated list of destinations.

**Query params:** `page, limit, search, category, province, region, sort, order, featured, minRating`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Vinh Ha Long",
      "slug": "vinh-ha-long",
      "shortDescription": "...",
      "rating": 4.8,
      "reviewCount": 245,
      "images": [{ "url": "...", "isPrimary": true }],
      "category": { "name": "Biển & Đảo" },
      "province": { "name": "Quảng Ninh" }
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 30, "totalPages": 3 }
}
```

### GET /destinations/featured
Get featured destinations (public, no pagination).

### GET /destinations/:id
Get single destination by ID or slug.

### POST /destinations
Create destination. (Admin required)

### PUT /destinations/:id
Update destination. (Admin required)

### DELETE /destinations/:id
Delete destination. (Admin required)

---

## Tour Endpoints

### GET /tours
Get paginated list of tours.

**Query params:** `page, limit, search, destinationId, minPrice, maxPrice, sort, featured`

### GET /tours/featured
Get featured tours.

### GET /tours/:id
Get single tour by ID or slug.

### POST /tours
Create tour. (Admin required)

### PUT /tours/:id
Update tour. (Admin required)

### DELETE /tours/:id
Delete tour. (Admin required)

---

## Article Endpoints

### GET /articles
Get paginated list of articles.

**Query params:** `page, limit, search, category, tag, sort, featured`

### GET /articles/featured
Get featured articles.

### GET /articles/recent
Get recent articles.

### GET /articles/:id
Get single article by ID or slug.

### POST /articles
Create article. (Admin required)

### PUT /articles/:id
Update article. (Admin required)

### DELETE /articles/:id
Delete article. (Admin required)

---

## Review Endpoints

### GET /reviews/destination/:id
Get reviews for destination.

### GET /reviews/tour/:id
Get reviews for tour.

### POST /reviews
Create review. (Auth required)

**Body:**
```json
{
  "destinationId": "uuid",
  "rating": 5,
  "comment": "Bai viet rat hay!"
}
```

### DELETE /reviews/:id
Delete review. (Auth required)

---

## Favorite Endpoints

### GET /favorites
Get user favorites. (Auth required)

### POST /favorites
Add to favorites. (Auth required)

**Body:** `{ "destinationId": "uuid" }`

### DELETE /favorites/:destinationId
Remove from favorites. (Auth required)

### GET /favorites/check/:destinationId
Check if destination is favorite. (Auth required)

---

## Inquiry Endpoints

### GET /inquiries
Get all inquiries (Admin) or user's inquiries.

### POST /inquiries
Submit inquiry.

**Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0901234567",
  "type": "tour",
  "subject": "Tu van tour",
  "message": "Toi muon tu van ve tour Sapa",
  "tourId": "uuid"
}
```

### PUT /inquiries/:id
Update inquiry status. (Admin required)

### DELETE /inquiries/:id
Delete inquiry. (Admin required)

---

## Category Endpoints

### GET /categories/destinations
Get destination categories.

### GET /categories/articles
Get article categories.

### GET /categories/provinces
Get provinces.

### GET /categories/regions
Get regions (NORTH, CENTRAL, SOUTH).

### GET /categories/tags
Get all tags.

---

## AI Features Endpoints

### POST /chatbot
Send chatbot message.

**Body:**
```json
{
  "message": "Toi nen di dau dep?",
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "reply": "Toi goi y cho ban nhung dia diem sau...",
  "sessionId": "uuid"
}
```

### GET /chatbot/history
Get chat history. (Auth required)

### POST /recommendations
Get AI recommendations.

**Body:**
```json
{
  "preferences": {
    "regions": ["NORTH"],
    "categories": ["bien"],
    "budget": "medium"
  }
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "recommendations": [
    {
      "id": "uuid",
      "name": "...",
      "recommendationScore": 85.5,
      "matchReasons": ["Thuộc khu vực Miền Bắc", "Địa điểm nổi bật"]
    }
  ],
  "algorithm": "rule-based-scoring"
}
```

### GET /recommendations/popular
Get popular destinations.

---

## Dashboard Endpoints

### GET /dashboard
Get dashboard statistics. (Admin required)

**Response:**
```json
{
  "stats": {
    "destinations": 30,
    "tours": 15,
    "articles": 20,
    "users": 20,
    "reviews": 100,
    "pendingInquiries": 5,
    "activeUsers": 18
  },
  "recentInquiries": [...],
  "recentReviews": [...],
  "topDestinations": [...],
  "monthlyStats": [...]
}
```

---

## Upload Endpoints

### POST /upload/image
Upload single image. (Admin required)

### POST /upload/images
Upload multiple images. (Admin required)

---

## User Endpoints (Admin)

### GET /users
Get paginated user list. (Admin required)

### PUT /users/:id/toggle-active
Toggle user active status. (Admin required)

### DELETE /users/:id
Delete user. (Admin required)
