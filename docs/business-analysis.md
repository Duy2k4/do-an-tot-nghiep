# Business Analysis - Du Lịch Quảng Bá

## 1. Tổng quan dự án

**Tên dự án:** Du Lịch Quảng Bá - Website Giới Thiệu và Quảng Báo Du Lịch Việt Nam

**Mô tả:** Hệ thống website giới thiệu du lịch toàn diện, kết hợp tính năng thông minh AI để gợi ý địa điểm và chatbot tư vấn du lịch.

## 2. Actor (Tác nhân)

| Actor | Mô tả | Loại |
|-------|--------|------|
| **Khách vãng lai** | Người dùng chưa đăng nhập, có thể xem thông tin công khai | Primary |
| **Người dùng đã đăng ký** | Người dùng đã có tài khoản, sử dụng các chức năng cá nhân | Primary |
| **Quản trị viên (Admin)** | Người quản lý nội dung và người dùng | Primary |
| **Hệ thống AI** | Chatbot và Engine gợi ý thông minh | Supporting |

## 3. Mục tiêu hệ thống

### Mục tiêu chính
- Cung cấp nền tảng giới thiệu, quảng bá du lịch Việt Nam
- Giúp du khách tìm kiếm, khám phá điểm đến dễ dàng
- Cung cấp gợi ý thông minh cá nhân hóa
- Hỗ trợ chatbot tư vấn 24/7
- Quản lý nội dung du lịch hiệu quả

### Mục tiêu phi chức năng
- Giao diện đẹp, hiện đại, responsive
- Bảo mật: hash password, JWT, role-based auth
- Hiệu năng tốt, tốc độ tải nhanh
- Dễ bảo trì và mở rộng

## 4. Các chức năng chính

### 4.1. Người dùng công khai
- Xem trang chủ với banner, điểm đến nổi bật, tour, bài viết
- Tìm kiếm và lọc địa điểm theo nhiều tiêu chí
- Xem chi tiết địa điểm với hình ảnh, đánh giá
- Xem danh sách và chi tiết tour du lịch
- Đọc cẩm nang/bài viết du lịch
- Gửi yêu cầu liên hệ / tư vấn
- Trò chuyện với chatbot tư vấn du lịch
- Nhận gợi ý địa điểm thông minh

### 4.2. Người dùng đã đăng nhập
- Đăng ký / đăng nhập / đăng xuất
- Cập nhật hồ sơ cá nhân
- Đổi mật khẩu
- Lưu địa điểm yêu thích
- Đánh giá và bình luận địa điểm/tour
- Gửi yêu cầu tư vấn / đặt tour
- Xem lịch sử tương tác
- Sử dụng chatbot với lịch sử trò chuyện

### 4.3. Quản trị viên
- Dashboard thống kê tổng quan
- CRUD địa điểm du lịch
- CRUD tour du lịch
- CRUD bài viết cẩm nang
- Quản lý danh mục (địa điểm, bài viết, tỉnh/thành)
- Quản lý người dùng (kích hoạt/vô hiệu, xóa)
- Quản lý đánh giá/bình luận (duyệt, xóa)
- Quản lý yêu cầu tư vấn/liên hệ (trả lời, cập nhật trạng thái)
- Upload hình ảnh

## 5. Luồng nghiệp vụ chính

### 5.1. Luồng đăng ký / đăng nhập
1. Người dùng điền thông tin đăng ký
2. Hệ thống validate dữ liệu
3. Hash password và lưu vào database
4. Tạo JWT token
5. Trả về thông tin user + token

### 5.2. Luồng tìm kiếm địa điểm
1. Người dùng nhập từ khóa hoặc chọn bộ lọc
2. Backend query database với điều kiện
3. Trả về danh sách phân trang
4. Frontend hiển thị với card component
5. Người dùng click xem chi tiết

### 5.3. Luồng đặt tour / tư vấn
1. Người dùng xem chi tiết tour
2. Click nút "Đặt tư vấn" / "Liên hệ"
3. Điền form yêu cầu
4. Hệ thống lưu vào bảng inquiries
5. Admin nhận và xử lý yêu cầu

### 5.4. Luồng gợi ý thông minh
1. Người dùng truy cập trang gợi ý
2. Chọn sở thích, ngân sách, thời gian, vùng miền
3. Backend chạy rule-based scoring engine
4. Trả về danh sách địa điểm đã được chấm điểm
5. Hiển thị với điểm match và lý do

### 5.5. Luồng chatbot
1. Người dùng nhập câu hỏi
2. Hệ thống keyword detection + intent classification
3. Query knowledge base (địa điểm, tour, bài viết)
4. Generate response từ rule-based engine
5. Lưu lịch sử chat

## 6. So sánh với đề cương mẫu

| Yêu cầu đề cương | Đề xuất thực tế |
|-------------------|-----------------|
| App mobile đặt đồ ăn | Không áp dụng - chuyển thành website du lịch |
| Quản lý đơn hàng | Chuyển thành quản lý yêu cầu tư vấn/tour |
| Trả hàng | Không áp dụng |
| Cập nhật trạng thái đơn | Cập nhật trạng thái yêu cầu tư vấn |
| Thông báo push | Không áp dụng - dùng notification in-app |

## 7. Rủi ro và giải pháp

| Rủi ro | Giải pháp |
|---------|-----------|
| Không có API key AI thật | Xây dựng chatbot hybrid với rule-based fallback |
| Dữ liệu mẫu thiếu | Seed 30+ địa điểm, 15+ tour, 20+ bài viết |
| Performance khi query lớn | Pagination, caching, database indexing |
| Security | JWT, bcrypt, input validation, CORS |
