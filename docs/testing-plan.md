# Kế Hoạch Kiểm Thử - Du Lịch Quảng Bá

## 1. Phạm Vi Kiểm Thử

### Trong Phạm Vi
- Tất cả tính năng người dùng (trang công khai, tài khoản user)
- Trang quản trị và tính năng quản lý
- API endpoints (backend)
- Xác thực và ủy quyền
- Tính năng AI (chatbot, gợi ý)
- Giao diện responsive trên nhiều thiết bị

### Ngoài Phạm Vi
- Kiểm thử hiệu năng dưới tải
- Kiểm thử bảo mật xâm nhập
- Tích hợp dịch vụ bên thứ ba (cổng thanh toán, email)

## 2. Các Loại Kiểm Thử

### 2.1. Kiểm Thử Đơn Vị
- Phương thức service backend (thuật toán chấm điểm, validation)
- Hàm tiện ích frontend
- Logic component (Angular services)

### 2.2. Kiểm Thử Tích Hợp
- API endpoints (thao tác CRUD)
- Thao tác database
- Luồng xác thực

### 2.3. Kiểm Thử Thủ Công
- Tất cả tính năng người dùng
- Validation UI/UX
- Kiểm thử đa trình duyệt
- Thiết kế responsive

## 3. Các Ca Kiểm Thử

### 3.1 Xác Thực
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| AUTH-01 | Đăng ký với dữ liệu hợp lệ | Điền form, gửi | Thành công, chuyển hướng về trang chủ | |
| AUTH-02 | Đăng ký với email trùng lặp | Sử dụng email đã tồn tại | Thông báo lỗi | |
| AUTH-03 | Đăng ký với email không hợp lệ | Nhập định dạng sai | Lỗi validation | |
| AUTH-04 | Đăng nhập với thông tin chính xác | Nhập email/mật khẩu hợp lệ | Đăng nhập thành công, token được lưu | |
| AUTH-05 | Đăng nhập với mật khẩu sai | Nhập mật khẩu sai | Thông báo lỗi | |
| AUTH-06 | Đăng nhập với email không tồn tại | Nhập email chưa đăng ký | Thông báo lỗi | |
| AUTH-07 | Đăng xuất | Nhấn đăng xuất | Xóa phiên, chuyển hướng | |
| AUTH-08 | Truy cập admin khi chưa đăng nhập | Truy cập trang admin | Chuyển hướng đến đăng nhập | |
| AUTH-09 | Truy cập admin với tài khoản user | Đăng nhập user, vào trang admin | Từ chối truy cập | |
| AUTH-10 | Đổi mật khẩu | Nhập mật khẩu cũ đúng, mật khẩu mới | Thông báo thành công | |

### 3.2 Điểm Đến
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| DEST-01 | Xem danh sách điểm đến | Truy cập trang điểm đến | Hiển thị danh sách phân trang | |
| DEST-02 | Tìm kiếm điểm đến | Nhập từ khóa tìm kiếm | Kết quả lọc | |
| DEST-03 | Lọc theo danh mục | Chọn danh mục | Kết quả lọc theo danh mục | |
| DEST-04 | Sắp xếp điểm đến | Chọn tùy chọn sắp xếp | Kết quả đã sắp xếp | |
| DEST-05 | Xem chi tiết điểm đến | Nhấn vào card điểm đến | Hiển thị trang chi tiết | |
| DEST-06 | Xem đánh giá điểm đến | Cuộn đến phần đánh giá | Hiển thị đánh giá | |
| DEST-07 | Admin tạo điểm đến | Điền form, gửi | Điểm đến mới được tạo | |
| DEST-08 | Admin chỉnh sửa điểm đến | Chỉnh sửa trường, lưu | Điểm đến được cập nhật | |
| DEST-09 | Admin xóa điểm đến | Nhấn xóa, xác nhận | Điểm đến được xóa | |

### 3.3 Tours
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| TOUR-01 | Xem danh sách tour | Truy cập trang tours | Hiển thị danh sách phân trang | |
| TOUR-02 | Xem chi tiết tour | Nhấn vào card tour | Hiển thị chi tiết với lịch trình | |
| TOUR-03 | Lọc tours theo giá | Đặt khoảng giá | Kết quả lọc | |
| TOUR-04 | Yêu cầu tư vấn tour | Điền form, gửi | Yêu cầu được gửi | |

### 3.4 Bài Viết
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| ART-01 | Xem danh sách bài viết | Truy cập trang bài viết | Hiển thị danh sách phân trang | |
| ART-02 | Xem chi tiết bài viết | Nhấn vào bài viết | Hiển thị nội dung đầy đủ | |
| ART-03 | Lọc theo danh mục | Chọn danh mục | Kết quả lọc | |
| ART-04 | Admin tạo bài viết | Điền form, gửi | Bài viết được xuất bản | |

### 3.5 Đánh Giá
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| REV-01 | Gửi đánh giá (đã đăng nhập) | Đăng nhập, chấm điểm, bình luận, gửi | Đánh giá được tạo | |
| REV-02 | Gửi đánh giá (chưa đăng nhập) | Thử gửi | Chuyển hướng đến đăng nhập | |
| REV-03 | Gửi đánh giá trùng lặp | Đánh giá cùng mục lại | Thông báo lỗi | |
| REV-04 | Xóa đánh giá của mình | Nhấn xóa | Đánh giá được xóa | |
| REV-05 | Admin xóa bất kỳ đánh giá nào | Nhấn xóa | Đánh giá được xóa | |

### 3.6 Yêu Thích
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| FAV-01 | Thêm vào yêu thích | Nhấn biểu tượng trái tim | Được thêm vào danh sách | |
| FAV-02 | Xóa khỏi yêu thích | Nhấn lại | Được xóa khỏi danh sách | |
| FAV-03 | Xem danh sách yêu thích | Vào hồ sơ > yêu thích | Hiển thị tất cả yêu thích | |
| FAV-04 | Thêm khi chưa đăng nhập | Nhấn trái tim | Chuyển hướng đến đăng nhập | |

### 3.7 Liên Hệ
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| INQ-01 | Gửi biểu mẫu liên hệ | Điền form, gửi | Thông báo thành công | |
| INQ-02 | Gửi với dữ liệu không hợp lệ | Để trống các trường bắt buộc | Lỗi validation | |
| INQ-03 | Admin xem liên hệ | Vào admin > liên hệ | Liệt kê tất cả liên hệ | |
| INQ-04 | Admin trả lời liên hệ | Thêm trả lời, cập nhật trạng thái | Trạng thái thay đổi | |
| INQ-05 | User xem liên hệ của mình | Vào hồ sơ > liên hệ | Hiển thị liên hệ của user | |

### 3.8 Chatbot
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| CHAT-01 | Gửi lời chào | Gõ "xin chào" | Bot trả lời | |
| CHAT-02 | Hỏi về địa điểm biển | Gõ "địa điểm biển" | Trả về điểm đến biển | |
| CHAT-03 | Hỏi về chi phí | Gõ "chi phí đi Sapa" | Trả về thông tin giá | |
| CHAT-04 | Hỏi câu hỏi không liên quan | Gõ text ngẫu nhiên | Phản hồi mặc định | |
| CHAT-05 | Lịch sử chat được lưu | Đăng nhập, chat, đăng xuất, đăng nhập | Lịch sử được khôi phục | |

### 3.9 Gợi Ý
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| REC-01 | Lấy gợi ý | Chọn sở thích, gửi | Trả về điểm đến có điểm số | |
| REC-02 | Không có sở thích | Gửi mà không chọn | Trả về điểm đến phổ biến | |
| REC-03 | Lọc theo khu vực | Chọn BẮC, gửi | Trả về điểm đến phía Bắc | |

### 3.10 Trang Quản Trị
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| ADMIN-01 | Xem thống kê trang quản trị | Đăng nhập admin | Hiển thị tất cả thống kê | |
| ADMIN-02 | Quản lý người dùng | Xem danh sách user, bật/tắt hoạt động | Trạng thái được cập nhật | |
| ADMIN-03 | Quản lý danh mục | Thêm/sửa/xóa danh mục | Thay đổi được phản ánh | |

### 3.11 Giao Diện Responsive
| ID | Ca Kiểm Thử | Các Bước | Kết Quả Mong Đợi | Trạng Thái |
|----|-------------|----------|------------------|------------|
| RESP-01 | Xem trên desktop | Mở trên desktop (1920px) | Bố cục đầy đủ, lưới 3 cột | |
| RESP-02 | Xem trên tablet | Mở trên tablet (768px) | Lưới 2 cột, nav điều chỉnh | |
| RESP-03 | Xem trên mobile | Mở trên mobile (375px) | Một cột, menu hamburger | |

## 4. Thực Thi Kiểm Thử

### Thiết Lập Môi Trường
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Database: MySQL trên localhost:3306

### Tài Khoản Kiểm Thử
- Quản trị: admin@webquangbadulich.com / admin123
- Người dùng: user@webquangbadulich.com / user123

## 5. Báo Cáo Lỗi

Tất cả lỗi được tìm thấy sẽ được ghi chép trong `test-results.md` với:
- ID Lỗi
- Mô Tả
- Các Bước Tái Tạo
- Mức Độ Nghiêm Trọng (Nghiêm trọng nhất/Nghiêm trọng/Nhỏ)
- Trạng Thái (Đang mở/Đã sửa/Đã đóng)
- Ghi chú sửa lỗi
