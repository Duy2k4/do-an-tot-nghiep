# Kết Quả Kiểm Thử - Du Lịch Quảng Bá

## Môi Trường
- Backend: http://localhost:3000
- Frontend: http://localhost:4200
- Database: MySQL 8.0 (localhost:3306)
- Ngày kiểm thử: 2026-04-20

## Tài Khoản Kiểm Thử
- Quản trị: admin@webquangbadulich.com / admin123
- Người dùng: user@webquangbadulich.com / user123

---

## Kết Quả Các Ca Kiểm Thử

### A. Xác Thực

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| AUTH-01 | Đăng ký hợp lệ | Email mới, mật khẩu hợp lệ, thông tin đầy đủ | Thành công, chuyển hướng về trang chủ | Thành công, chuyển hướng về trang chủ | **ĐẠT** | |
| AUTH-02 | Đăng ký trùng lặp | Email đã tồn tại trong hệ thống | Thông báo lỗi "Email đã được sử dụng" | Thông báo lỗi "Email đã được sử dụng" | **ĐẠT** | |
| AUTH-03 | Đăng ký mật khẩu yếu | Mật khẩu có ít hơn 6 ký tự | Lỗi validation "Mật khẩu phải có ít nhất 6 ký tự" | Lỗi validation "Mật khẩu phải có ít nhất 6 ký tự" | **ĐẠT** | |
| AUTH-04 | Đăng ký email không hợp lệ | Định dạng email sai (ví dụ: test@) | Lỗi validation "Email không hợp lệ" | Lỗi validation "Email không hợp lệ" | **ĐẠT** | |
| AUTH-05 | Đăng nhập đúng | Email và mật khẩu chính xác | Đăng nhập thành công, lưu JWT token | Đăng nhập thành công, JWT token được lưu | **ĐẠT** | |
| AUTH-06 | Đăng nhập sai mật khẩu | Mật khẩu không đúng với email đã đăng ký | Thông báo lỗi "Mật khẩu không chính xác" | Thông báo lỗi "Mật khẩu không chính xác" | **ĐẠT** | |
| AUTH-07 | Đăng nhập tài khoản không tồn tại | Email chưa được đăng ký trong hệ thống | Thông báo lỗi "Tài khoản không tồn tại" | Thông báo lỗi "Tài khoản không tồn tại" | **ĐẠT** | |
| AUTH-08 | Đăng xuất | Nhấn nút đăng xuất | Phiên đăng nhập bị xóa, chuyển hướng về trang chủ | Phiên đăng nhập bị xóa, chuyển hướng về trang chủ | **ĐẠT** | |
| AUTH-09 | Truy cập admin khi chưa đăng nhập | Truy cập trực tiếp URL /admin | Chuyển hướng đến trang đăng nhập | Chuyển hướng đến trang đăng nhập | **ĐẠT** | |
| AUTH-10 | Truy cập admin với tài khoản user | Đăng nhập với tài khoản user, truy cập /admin | Từ chối truy cập, hiển thị trang 403 | Từ chối truy cập, hiển thị trang 403 | **ĐẠT** | |
| AUTH-11 | Truy cập admin với tài khoản admin | Đăng nhập với tài khoản admin, truy cập /admin | Toàn quyền truy cập trang quản trị | Toàn quyền truy cập trang quản trị | **ĐẠT** | |
| AUTH-12 | Đổi mật khẩu | Nhập mật khẩu cũ đúng và mật khẩu mới hợp lệ | Thông báo thành công, mật khẩu được cập nhật | Thông báo thành công, mật khẩu được cập nhật | **ĐẠT** | |
| AUTH-13 | Đổi mật khẩu sai mật khẩu cũ | Nhập mật khẩu cũ không đúng | Thông báo lỗi "Mật khẩu cũ không chính xác" | Hệ thống chấp nhận và cập nhật mật khẩu mới | **KHÔNG ĐẠT** | Hệ thống không kiểm tra đúng mật khẩu cũ. Đã ghi nhận lỗi BUG-01. |
| AUTH-14 | Đổi mật khẩu trùng mật khẩu cũ | Nhập mật khẩu mới giống mật khẩu cũ | Thông báo lỗi "Mật khẩu mới không được trùng mật khẩu cũ" | Hệ thống chấp nhận và cập nhật mật khẩu mới | **KHÔNG ĐẠT** | Hệ thống không kiểm tra mật khẩu mới khác mật khẩu cũ. Đã ghi nhận lỗi BUG-02. |
| AUTH-15 | Truy cập route được bảo vệ không có token | Gọi API endpoint yêu cầu xác thực mà không có JWT | Phản hồi HTTP 401 Unauthorized | Phản hồi HTTP 401 Unauthorized | **ĐẠT** | |
| AUTH-16 | Truy cập route được bảo vệ với token hết hạn | Sử dụng JWT đã hết hạn để gọi API | Phản hồi HTTP 401 Unauthorized | Phản hồi HTTP 401 Unauthorized | **ĐẠT** | |
| AUTH-17 | Truy cập route được bảo vệ với token không hợp lệ | Sử dụng JWT đã bị sửa đổi/tampered | Phản hồi HTTP 401 Unauthorized | Phản hồi HTTP 401 Unauthorized | **ĐẠT** | |

### B. Điểm Đến

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| DEST-01 | Xem danh sách điểm đến | Truy cập trang /destinations | Danh sách điểm đến phân trang được hiển thị | Danh sách điểm đến phân trang được hiển thị | **ĐẠT** | |
| DEST-02 | Tìm kiếm điểm đến | Nhập từ khóa tìm kiếm vào ô tìm kiếm | Danh sách điểm đến phù hợp với từ khóa | Danh sách điểm đến phù hợp với từ khóa | **ĐẠT** | |
| DEST-03 | Lọc theo danh mục | Chọn một danh mục từ dropdown lọc | Danh sách điểm đến thuộc danh mục đã chọn | Danh sách điểm đến thuộc danh mục đã chọn | **ĐẠT** | |
| DEST-04 | Lọc theo khu vực | Chọn một khu vực từ dropdown lọc | Danh sách điểm đến thuộc khu vực đã chọn | Danh sách điểm đến thuộc khu vực đã chọn | **ĐẠT** | |
| DEST-05 | Sắp xếp điểm đến | Chọn tiêu chí sắp xếp (tên, rating,...) | Danh sách điểm đến được sắp xếp theo tiêu chí | Danh sách điểm đến được sắp xếp theo tiêu chí | **ĐẠT** | |
| DEST-06 | Xem chi tiết điểm đến | Nhấn vào card điểm đến bất kỳ | Hiển thị trang chi tiết đầy đủ của điểm đến | Hiển thị trang chi tiết đầy đủ của điểm đến | **ĐẠT** | |
| DEST-07 | Xem đánh giá điểm đến | Cuộn xuống phần đánh giá trên trang chi tiết | Hiển thị danh sách các đánh giá và rating trung bình | Hiển thị danh sách các đánh giá và rating trung bình | **ĐẠT** | |
| DEST-08 | Điểm đến không tìm thấy | Truyền ID không tồn tại trong URL | Hiển thị trang 404 Not Found | Hiển thị trang 404 Not Found | **ĐẠT** | |
| DEST-09 | Admin tạo điểm đến | Điền form tạo điểm đến với dữ liệu hợp lệ, nhấn Lưu | Điểm đến mới được tạo và hiển thị trong danh sách | Điểm đến mới được tạo và hiển thị trong danh sách | **ĐẠT** | |
| DEST-10 | Admin tạo thiếu trường bắt buộc | Bỏ trống trường tên, điền các trường khác, nhấn Lưu | Lỗi validation yêu cầu nhập tên | Lỗi validation yêu cầu nhập tên | **ĐẠT** | |
| DEST-11 | Admin tạo với hình ảnh không hợp lệ | Tải lên file không phải hình ảnh (ví dụ: .pdf, .txt) | Lỗi validation "Vui lòng tải lên file hình ảnh" | Hệ thống chấp nhận file không phải hình ảnh | **KHÔNG ĐẠT** | Hệ thống không kiểm tra loại file khi tải lên. Đã ghi nhận lỗi BUG-03. |
| DEST-12 | Admin chỉnh sửa điểm đến | Chỉnh sửa thông tin điểm đến, nhấn Lưu | Thông tin điểm đến được cập nhật | Thông tin điểm đến được cập nhật | **ĐẠT** | |
| DEST-13 | Admin chỉnh sửa với tên rỗng | Xóa trống trường tên, nhấn Lưu | Lỗi validation yêu cầu nhập tên | Lỗi validation yêu cầu nhập tên | **ĐẠT** | |
| DEST-14 | Admin xóa điểm đến | Nhấn nút xóa và xác nhận xóa | Điểm đến được xóa khỏi hệ thống | Điểm đến được xóa khỏi hệ thống | **ĐẠT** | |
| DEST-15 | User xóa điểm đến | Đăng nhập user, thử xóa điểm đến | Từ chối truy cập, thông báo quyền không được phép | Từ chối truy cập, thông báo quyền không được phép | **ĐẠT** | |
| DEST-16 | Xem điểm đến nổi bật | Truy cập trang điểm đến nổi bật | Danh sách điểm đến nổi bật được hiển thị | Danh sách điểm đến nổi bật được hiển thị | **ĐẠT** | |
| DEST-17 | Xem điểm đến không có hình ảnh | Truy cập điểm đến chưa có hình ảnh | Hiển thị ảnh placeholder mặc định | Hiển thị ảnh placeholder mặc định | **ĐẠT** | |
| DEST-18 | Phân trang - trang ngoài phạm vi | Truy cập trang lớn hơn tổng số trang (ví dụ: ?page=100) | Kết quả trống, thông báo không có dữ liệu | Kết quả trống, thông báo không có dữ liệu | **ĐẠT** | |
| DEST-19 | Tìm kiếm với ký tự đặc biệt | Nhập chuỗi chứa ký tự đặc biệt (!@#$%^&*) | Không xảy ra lỗi, trả về kết quả trống | Không xảy ra lỗi, trả về kết quả trống | **ĐẠT** | |
| DEST-20 | Xem điểm đến đồng thời | Nhiều người dùng cùng truy cập trang chi tiết điểm đến | Dữ liệu hiển thị nhất quán cho tất cả người dùng | Dữ liệu hiển thị nhất quán cho tất cả người dùng | **ĐẠT** | |

### C. Tours

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| TOUR-01 | Xem danh sách tour | Truy cập trang /tours | Danh sách tour phân trang được hiển thị | Danh sách tour phân trang được hiển thị | **ĐẠT** | |
| TOUR-02 | Xem chi tiết tour | Nhấn vào card tour bất kỳ | Hiển thị trang chi tiết tour với lịch trình, giá, thông tin | Hiển thị trang chi tiết tour với lịch trình, giá, thông tin | **ĐẠT** | |
| TOUR-03 | Lọc theo giá | Chọn khoảng giá từ bộ lọc | Danh sách tour trong khoảng giá đã chọn | Danh sách tour trong khoảng giá đã chọn | **ĐẠT** | |
| TOUR-04 | Lọc theo thời gian | Chọn số ngày từ bộ lọc (ví dụ: 3 ngày) | Danh sách tour có thời gian tương ứng | Danh sách tour có thời gian tương ứng | **ĐẠT** | |
| TOUR-05 | Sắp xếp theo giá thấp-cao | Chọn sắp xếp "Giá: Thấp đến Cao" | Danh sách tour được sắp xếp theo giá tăng dần | Danh sách tour được sắp xếp theo giá tăng dần | **ĐẠT** | |
| TOUR-06 | Yêu cầu tư vấn tour | Điền form yêu cầu tư vấn với thông tin hợp lệ | Yêu cầu được gửi thành công | Yêu cầu được gửi thành công | **ĐẠT** | |
| TOUR-07 | Đặt tour khi chưa đăng nhập | Nhấn nút Đặt tour mà chưa đăng nhập | Chuyển hướng đến trang đăng nhập | Chuyển hướng đến trang đăng nhập | **ĐẠT** | |
| TOUR-08 | Đặt tour đầy đủ thông tin | Điền đầy đủ form đặt tour (ngày, số người, thông tin liên hệ) | Booking được tạo, hiển thị thông tin xác nhận | Booking được tạo, hiển thị thông tin xác nhận | **ĐẠT** | |
| TOUR-09 | Đặt tour thiếu ngày | Bỏ trống trường ngày khởi hành, điền các trường khác | Lỗi validation "Vui lòng chọn ngày khởi hành" | Lỗi validation "Vui lòng chọn ngày khởi hành" | **ĐẠT** | |
| TOUR-10 | Đặt tour vượt số chỗ | Đặt tour với số người lớn hơn số chỗ còn lại | Lỗi "Số chỗ không đủ, vui lòng chọn số lượng ít hơn" | Hệ thống chấp nhận đặt, không hiển thị cảnh báo | **KHÔNG ĐẠT** | Hệ thống không kiểm tra số chỗ trước khi đặt. Đã ghi nhận lỗi BUG-04. |
| TOUR-11 | Đặt tour ngày trong quá khứ | Chọn ngày khởi hành trước ngày hiện tại | Lỗi validation "Ngày khởi hành phải lớn hơn ngày hiện tại" | Hệ thống chấp nhận đặt với ngày trong quá khứ | **KHÔNG ĐẠT** | Hệ thống không kiểm tra ngày hợp lệ. Đã ghi nhận lỗi BUG-05. |
| TOUR-12 | Xem tour không tìm thấy | Truyền ID tour không tồn tại trong URL | Hiển thị trang 404 Not Found | Hiển thị trang 404 Not Found | **ĐẠT** | |
| TOUR-13 | Admin tạo tour | Điền form tạo tour với dữ liệu hợp lệ, nhấn Lưu | Tour mới được tạo và hiển thị trong danh sách | Tour mới được tạo và hiển thị trong danh sách | **ĐẠT** | |
| TOUR-14 | Admin chỉnh sửa tour | Chỉnh sửa thông tin tour, nhấn Lưu | Thông tin tour được cập nhật | Thông tin tour được cập nhật | **ĐẠT** | |
| TOUR-15 | Admin xóa tour | Nhấn nút xóa và xác nhận xóa | Tour được xóa khỏi hệ thống | Tour được xóa khỏi hệ thống | **ĐẠT** | |

### D. Bài Viết

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| ART-01 | Xem danh sách bài viết | Truy cập trang /articles | Danh sách bài viết phân trang được hiển thị | Danh sách bài viết phân trang được hiển thị | **ĐẠT** | |
| ART-02 | Xem chi tiết bài viết | Nhấn vào bài viết bất kỳ | Hiển thị nội dung đầy đủ của bài viết | Hiển thị nội dung đầy đủ của bài viết | **ĐẠT** | |
| ART-03 | Lọc theo danh mục | Chọn một danh mục từ dropdown | Danh sách bài viết thuộc danh mục đã chọn | Danh sách bài viết thuộc danh mục đã chọn | **ĐẠT** | |
| ART-04 | Tìm kiếm bài viết | Nhập từ khóa vào ô tìm kiếm | Danh sách bài viết phù hợp với từ khóa | Danh sách bài viết phù hợp với từ khóa | **ĐẠT** | |
| ART-05 | Xem bài viết nổi bật | Truy cập trang bài viết nổi bật | Danh sách bài viết nổi bật được hiển thị | Danh sách bài viết nổi bật được hiển thị | **ĐẠT** | |
| ART-06 | Xem bài viết không tìm thấy | Truyền ID bài viết không tồn tại trong URL | Hiển thị trang 404 Not Found | Hiển thị trang 404 Not Found | **ĐẠT** | |
| ART-07 | Admin tạo bài viết | Điền form tạo bài viết với nội dung đầy đủ, nhấn Xuất bản | Bài viết được tạo và xuất bản | Bài viết được tạo và xuất bản | **ĐẠT** | |
| ART-08 | Admin tạo với nội dung rỗng | Bỏ trống trường nội dung, nhấn Xuất bản | Lỗi validation "Nội dung không được để trống" | Lỗi validation "Nội dung không được để trống" | **ĐẠT** | |
| ART-09 | Admin chỉnh sửa bài viết | Chỉnh sửa nội dung bài viết, nhấn Lưu | Bài viết được cập nhật với nội dung mới | Bài viết được cập nhật với nội dung mới | **ĐẠT** | |
| ART-10 | Admin xóa bài viết | Nhấn nút xóa và xác nhận | Bài viết được xóa khỏi hệ thống | Bài viết được xóa khỏi hệ thống | **ĐẠT** | |
| ART-11 | Admin hủy xuất bản bài viết | Nhấn nút Hủy xuất bản | Trạng thái bài viết chuyển thành "Nháp" | Trạng thái bài viết chuyển thành "Nháp" | **ĐẠT** | |
| ART-12 | User xóa bài viết | Đăng nhập user, thử xóa bài viết | Từ chối truy cập, thông báo quyền không được phép | Từ chối truy cập, thông báo quyền không được phép | **ĐẠT** | |
| ART-13 | Bình luận bài viết (đã đăng nhập) | Đăng nhập, nhập nội dung bình luận, nhấn Gửi | Bình luận được tạo và hiển thị dưới bài viết | Bình luận được tạo và hiển thị dưới bài viết | **ĐẠT** | |
| ART-14 | Bình luận bài viết (chưa đăng nhập) | Chưa đăng nhập, thử gửi bình luận | Chuyển hướng đến trang đăng nhập | Chuyển hướng đến trang đăng nhập | **ĐẠT** | |
| ART-15 | Bình luận với nội dung rỗng | Nhập nội dung trống, nhấn Gửi | Lỗi validation "Nội dung bình luận không được để trống" | Lỗi validation "Nội dung bình luận không được để trống" | **ĐẠT** | |
| ART-16 | Bình luận quá dài (>1000 ký tự) | Nhập nội dung bình luận hơn 1000 ký tự | Lỗi validation "Bình luận không được vượt quá 1000 ký tự" | Hệ thống chấp nhận bình luận vượt quá 1000 ký tự | **KHÔNG ĐẠT** | Hệ thống không kiểm tra độ dài bình luận. Đã ghi nhận lỗi BUG-06. |
| ART-17 | Xóa bình luận của mình | Đăng nhập, nhấn xóa bình luận do mình tạo | Bình luận được xóa khỏi hệ thống | Bình luận được xóa khỏi hệ thống | **ĐẠT** | |
| ART-18 | Xóa bình luận của người khác | Đăng nhập user, thử xóa bình luận của user khác | Từ chối truy cập, thông báo quyền không được phép | Hệ thống cho phép xóa bình luận của người khác | **KHÔNG ĐẠT** | Lỗ hổng phân quyền cho phép xóa bình luận không thuộc về mình. Đã ghi nhận lỗi BUG-07. |

### E. Đánh Giá

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| REV-01 | Gửi đánh giá (đã đăng nhập) | Đăng nhập, chọn rating (1-5 sao), nhập nội dung, nhấn Gửi | Đánh giá được tạo và hiển thị tại điểm đến | Đánh giá được tạo và hiển thị tại điểm đến | **ĐẠT** | |
| REV-02 | Gửi đánh giá (chưa đăng nhập) | Chưa đăng nhập, thử gửi đánh giá | Chuyển hướng đến trang đăng nhập | Chuyển hướng đến trang đăng nhập | **ĐẠT** | |
| REV-03 | Gửi đánh giá trùng lặp | Đánh giá cùng một điểm đến lần thứ hai | Thông báo lỗi "Bạn đã đánh giá địa điểm này" | Thông báo lỗi "Bạn đã đánh giá địa điểm này" | **ĐẠT** | |
| REV-04 | Gửi đánh giá với nội dung rỗng | Bỏ trống trường nội dung đánh giá, nhấn Gửi | Lỗi validation "Nội dung đánh giá không được để trống" | Lỗi validation "Nội dung đánh giá không được để trống" | **ĐẠT** | |
| REV-05 | Gửi đánh giá với rating 0 | Chọn rating 0 sao, nhấn Gửi | Lỗi validation "Rating phải từ 1 đến 5" | Hệ thống chấp nhận rating 0 | **KHÔNG ĐẠT** | Hệ thống không kiểm tra rating trong khoảng 1-5. Đã ghi nhận lỗi BUG-08. |
| REV-06 | Gửi đánh giá với rating > 5 | Chọn rating lớn hơn 5 sao, nhấn Gửi | Lỗi validation "Rating phải từ 1 đến 5" | Hệ thống chấp nhận rating > 5 | **KHÔNG ĐẠT** | Hệ thống không kiểm tra rating trong khoảng 1-5. Đã ghi nhận lỗi BUG-08. |
| REV-07 | Xóa đánh giá của mình | Đăng nhập, nhấn xóa đánh giá do mình tạo | Đánh giá được xóa khỏi hệ thống | Đánh giá được xóa khỏi hệ thống | **ĐẠT** | |
| REV-08 | Xóa đánh giá của người khác | Đăng nhập user, thử xóa đánh giá của user khác | Từ chối truy cập, thông báo quyền không được phép | Hệ thống cho phép xóa đánh giá của người khác | **KHÔNG ĐẠT** | Lỗ hổng phân quyền cho phép xóa đánh giá không thuộc về mình. Đã ghi nhận lỗi BUG-09. |
| REV-09 | Admin xóa bất kỳ đánh giá nào | Đăng nhập admin, nhấn xóa bất kỳ đánh giá nào | Đánh giá được xóa khỏi hệ thống | Đánh giá được xóa khỏi hệ thống | **ĐẠT** | |
| REV-10 | Chỉnh sửa đánh giá của mình | Đăng nhập, chỉnh sửa nội dung đánh giá, nhấn Lưu | Đánh giá được cập nhật với nội dung mới | Đánh giá được cập nhật với nội dung mới | **ĐẠT** | |
| REV-11 | Xem điểm đến sau khi có đánh giá mới | Sau khi gửi đánh giá mới, quay lại trang chi tiết điểm đến | Rating trung bình được cập nhật chính xác | Rating trung bình được cập nhật chính xác | **ĐẠT** | |

### F. Yêu Thích

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| FAV-01 | Thêm vào yêu thích | Nhấn biểu tượng trái tim (heart) trên card điểm đến | Điểm đến được thêm vào danh sách yêu thích | Điểm đến được thêm vào danh sách yêu thích | **ĐẠT** | |
| FAV-02 | Xóa khỏi yêu thích | Nhấn lại biểu tượng trái tim đã được chọn | Điểm đến được xóa khỏi danh sách yêu thích | Điểm đến được xóa khỏi danh sách yêu thích | **ĐẠT** | |
| FAV-03 | Bật/tắt yêu thích hai lần | Nhấn trái tim hai lần liên tiếp | Điểm đến được xóa khỏi danh sách yêu thích (sau lần nhấn thứ hai) | Điểm đến được xóa khỏi danh sách yêu thích (sau lần nhấn thứ hai) | **ĐẠT** | |
| FAV-04 | Xem danh sách yêu thích | Truy cập trang hồ sơ > mục Yêu thích | Hiển thị tất cả điểm đến đã yêu thích | Hiển thị tất cả điểm đến đã yêu thích | **ĐẠT** | |
| FAV-05 | Thêm khi chưa đăng nhập | Chưa đăng nhập, nhấn biểu tượng trái tim | Chuyển hướng đến trang đăng nhập | Chuyển hướng đến trang đăng nhập | **ĐẠT** | |
| FAV-06 | Xem danh sách yêu thích rỗng | Truy cập trang yêu thích khi chưa có điểm đến nào | Thông báo "Bạn chưa có điểm đến yêu thích nào" | Thông báo "Bạn chưa có điểm đến yêu thích nào" | **ĐẠT** | |
| FAV-07 | Phân trang danh sách yêu thích | Danh sách yêu thích có nhiều hơn 10 mục, chuyển sang trang 2 | Trang 2 được tải với danh sách điểm đến tiếp theo | Trang 2 được tải với danh sách điểm đến tiếp theo | **ĐẠT** | |

### G. Liên Hệ

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| INQ-01 | Gửi biểu mẫu liên hệ | Điền đầy đủ form liên hệ (tên, email, nội dung), nhấn Gửi | Thông báo thành công, liên hệ được gửi | Thông báo thành công, liên hệ được gửi | **ĐẠT** | |
| INQ-02 | Gửi với dữ liệu không hợp lệ | Bỏ trống tất cả các trường bắt buộc, nhấn Gửi | Hiển thị các lỗi validation cho từng trường | Hiển thị các lỗi validation cho từng trường | **ĐẠT** | |
| INQ-03 | Gửi với email rỗng | Bỏ trống trường email, điền các trường khác, nhấn Gửi | Lỗi validation "Email không được để trống" | Lỗi validation "Email không được để trống" | **ĐẠT** | |
| INQ-04 | Gửi với nội dung rỗng | Bỏ trống trường nội dung, điền các trường khác, nhấn Gửi | Lỗi validation "Nội dung không được để trống" | Lỗi validation "Nội dung không được để trống" | **ĐẠT** | |
| INQ-05 | Admin xem liên hệ | Đăng nhập admin, truy cập trang quản lý liên hệ | Liệt kê tất cả các liên hệ đã gửi | Liệt kê tất cả các liên hệ đã gửi | **ĐẠT** | |
| INQ-06 | Admin lọc theo trạng thái | Chọn trạng thái từ dropdown (Đã trả lời / Chưa trả lời) | Danh sách liên hệ được lọc theo trạng thái | Danh sách liên hệ được lọc theo trạng thái | **ĐẠT** | |
| INQ-07 | Admin trả lời liên hệ | Nhập nội dung trả lời, thay đổi trạng thái thành "Đã trả lời", nhấn Lưu | Trạng thái liên hệ được cập nhật thành "Đã trả lời" | Trạng thái liên hệ được cập nhật thành "Đã trả lời" | **ĐẠT** | |
| INQ-08 | Admin trả lời với nội dung rỗng | Bỏ trống trường trả lời, nhấn Lưu | Lỗi validation "Nội dung trả lời không được để trống" | Hệ thống lưu nội dung trả lời rỗng mà không báo lỗi | **KHÔNG ĐẠT** | Hệ thống không kiểm tra nội dung trả lời trước khi lưu. Đã ghi nhận lỗi BUG-10. |
| INQ-09 | User xem liên hệ của mình | Đăng nhập user, truy cập trang liên hệ của tôi | Hiển thị danh sách các liên hệ do user gửi | Hiển thị danh sách các liên hệ do user gửi | **ĐẠT** | |
| INQ-10 | User không thể xem liên hệ của người khác | Đăng nhập user A, thử truy cập liên hệ của user B | Từ chối truy cập, thông báo quyền không được phép | Từ chối truy cập, thông báo quyền không được phép | **ĐẠT** | |

### H. Chatbot

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| CHAT-01 | Gửi lời chào | Gửi tin nhắn "xin chào" hoặc "hello" | Bot trả lời với lời chào và gợi ý các câu hỏi | Bot trả lời với lời chào và gợi ý các câu hỏi | **ĐẠT** | |
| CHAT-02 | Hỏi về bãi biển | Gửi tin nhắn "địa điểm biển" hoặc "beach" | Bot trả về danh sách các điểm đến biển | Bot trả về danh sách các điểm đến biển | **ĐẠT** | |
| CHAT-03 | Hỏi về chi phí | Gửi tin nhắn "chi phí đi Sapa" hoặc "giá tour" | Bot trả về thông tin chi phí dự kiến | Bot trả về thông tin chi phí dự kiến | **ĐẠT** | |
| CHAT-04 | Hỏi về miền núi | Gửi tin nhắn "địa điểm miền núi" hoặc "mountain" | Bot trả về danh sách các điểm đến miền núi | Bot trả về danh sách các điểm đến miền núi | **ĐẠT** | |
| CHAT-05 | Hỏi về khu vực phía Bắc | Gửi tin nhắn "địa điểm phía Bắc" hoặc "miền Bắc" | Bot trả về danh sách các địa điểm phía Bắc | Bot trả về danh sách các địa điểm phía Bắc | **ĐẠT** | |
| CHAT-06 | Hỏi câu hỏi không liên quan | Gửi tin nhắn ngẫu nhiên không liên quan đến du lịch | Bot trả về phản hồi mặc định, gợi ý các câu hỏi liên quan | Bot trả về phản hồi mặc định, gợi ý các câu hỏi liên quan | **ĐẠT** | |
| CHAT-07 | Lịch sử chat được lưu (đã đăng nhập) | Đăng nhập, gửi vài tin nhắn, đăng xuất, đăng nhập lại | Lịch sử các tin nhắn trước đó được khôi phục | Lịch sử các tin nhắn trước đó được khôi phục | **ĐẠT** | |
| CHAT-08 | Lịch sử chat (chưa đăng nhập) | Không đăng nhập, gửi vài tin nhắn, đăng xuất, đăng nhập | Không có lịch sử tin nhắn được lưu | Không có lịch sử tin nhắn được lưu | **ĐẠT** | |
| CHAT-09 | Tin nhắn rất dài | Gửi tin nhắn có độ dài hơn 5000 ký tự | Bot trả lời hoặc thông báo giới hạn độ dài | Hệ thống bị crash, không phản hồi | **KHÔNG ĐẠT** | Chatbot không xử lý được tin nhắn quá dài. Đã ghi nhận lỗi BUG-11. |
| CHAT-10 | Ký tự đặc biệt trong tin nhắn | Gửi tin nhắn chứa chuỗi ký tự đặc biệt (ví dụ: `SQL injection attempt' OR '1'='1`) | Bot không crash, trả về phản hồi mặc định | Hệ thống bị crash hoặc xử lý sai | **KHÔNG ĐẠT** | Chatbot không xử lý được ký tự đặc biệt. Đã ghi nhận lỗi BUG-12. |
| CHAT-11 | Gửi nhiều tin nhắn liên tục | Gửi 10 tin nhắn liên tiếp trong vòng vài giây | Tất cả phản hồi được trả về đúng thứ tự | Tất cả phản hồi được trả về đúng thứ tự | **ĐẠT** | |

### I. Gợi Ý

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| REC-01 | Lấy gợi ý | Chọn các sở thích (loại điểm đến, khu vực, ngân sách), nhấn Gợi ý | Trả về danh sách điểm đến có điểm số phù hợp với sở thích | Trả về danh sách điểm đến có điểm số phù hợp với sở thích | **ĐẠT** | |
| REC-02 | Không có sở thích | Không chọn bất kỳ sở thích nào, nhấn Gợi ý | Trả về danh sách các điểm đến phổ biến nhất | Trả về danh sách các điểm đến phổ biến nhất | **ĐẠT** | |
| REC-03 | Lọc theo khu vực | Chọn khu vực "Miền Bắc", nhấn Gợi ý | Trả về danh sách điểm đến thuộc khu vực miền Bắc | Trả về danh sách điểm đến thuộc khu vực miền Bắc | **ĐẠT** | |
| REC-04 | Lọc theo tất cả tiêu chí | Chọn tất cả các tiêu chí (loại, khu vực, ngân sách, thời gian), nhấn Gợi ý | Trả về danh sách điểm đến phù hợp với tất cả tiêu chí | Trả về danh sách điểm đến phù hợp với tất cả tiêu chí | **ĐẠT** | |
| REC-05 | Không có điểm đến phù hợp | Chọn các tiêu chí không khớp với bất kỳ điểm đến nào | Trả về kết quả trống, thông báo không tìm thấy điểm đến phù hợp | Trả về kết quả trống, thông báo không tìm thấy điểm đến phù hợp | **ĐẠT** | |
| REC-06 | Lấy gợi ý khi chưa đăng nhập | Không đăng nhập, truy cập trang gợi ý, chọn sở thích, nhấn Gợi ý | Hệ thống vẫn trả về kết quả gợi ý bình thường | Hệ thống vẫn trả về kết quả gợi ý bình thường | **ĐẠT** | |

### J. Trang Quản Trị

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| ADMIN-01 | Xem thống kê trang quản trị | Đăng nhập admin, truy cập trang dashboard | Hiển thị đầy đủ các thống kê (số người dùng, điểm đến, tour, bài viết, booking) | Hiển thị đầy đủ các thống kê (số người dùng, điểm đến, tour, bài viết, booking) | **ĐẠT** | |
| ADMIN-02 | Quản lý người dùng | Truy cập trang quản lý người dùng, bật/tắt trạng thái hoạt động của một user | Trạng thái hoạt động của user được cập nhật | Trạng thái hoạt động của user được cập nhật | **ĐẠT** | |
| ADMIN-03 | Tự hủy tài khoản | Đăng nhập admin, thử hủy kích hoạt tài khoản của chính mình | Hệ thống hiển thị cảnh báo và từ chối thực hiện | Hệ thống cho phép hủy kích hoạt tài khoản của chính mình | **KHÔNG ĐẠT** | Admin không nên có thể tự hủy tài khoản. Đã ghi nhận lỗi BUG-13. |
| ADMIN-04 | Quản lý danh mục | Thực hiện thêm, sửa, xóa danh mục điểm đến | Các thay đổi được phản ánh ngay lập tức trên hệ thống | Các thay đổi được phản ánh ngay lập tức trên hệ thống | **ĐẠT** | |
| ADMIN-05 | Xóa danh mục có nội dung | Thử xóa một danh mục đang có điểm đến thuộc danh mục đó | Hệ thống hiển thị thông báo lỗi, từ chối xóa | Hệ thống cho phép xóa danh mục mà không có cảnh báo | **KHÔNG ĐẠT** | Hệ thống không kiểm tra ràng buộc khi xóa danh mục. Đã ghi nhận lỗi BUG-14. |
| ADMIN-06 | Xem tất cả booking | Truy cập trang quản lý booking, áp dụng các bộ lọc | Danh sách booking với các bộ lọc (theo ngày, trạng thái, tour) | Danh sách booking với các bộ lọc (theo ngày, trạng thái, tour) | **ĐẠT** | |
| ADMIN-07 | Cập nhật trạng thái booking | Chọn một booking, thay đổi trạng thái (ví dụ: Từ "Chờ xác nhận" sang "Đã xác nhận"), nhấn Lưu | Trạng thái booking được cập nhật | Trạng thái booking được cập nhật | **ĐẠT** | |
| ADMIN-08 | Hủy booking | Chọn một booking, nhấn nút Hủy | Trạng thái booking chuyển thành "Đã hủy", hoàn tiền được kích hoạt | Trạng thái booking chuyển thành "Đã hủy", hoàn tiền được kích hoạt | **ĐẠT** | |

### K. Giao Diện Responsive

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| RESP-01 | Xem trên desktop (1920px) | Mở trang web trên trình duyệt có độ rộng 1920px | Bố cục đầy đủ, lưới 3 cột cho danh sách điểm đến, navigation đầy đủ | Bố cục đầy đủ, lưới 3 cột cho danh sách điểm đến, navigation đầy đủ | **ĐẠT** | |
| RESP-02 | Xem trên tablet (768px) | Mở trang web trên trình duyệt có độ rộng 768px | Lưới 2 cột, navigation điều chỉnh phù hợp | Lưới 2 cột, navigation điều chỉnh phù hợp | **ĐẠT** | |
| RESP-03 | Xem trên tablet (1024px) | Mở trang web trên trình duyệt có độ rộng 1024px | Lưới 3 cột, layout cân đối | Lưới 3 cột, layout cân đối | **ĐẠT** | |
| RESP-04 | Xem trên mobile (375px) | Mở trang web trên trình duyệt có độ rộng 375px (hoặc thiết bị mobile) | Bố cục một cột, nội dung hiển thị vừa màn hình | Bố cục một cột, nội dung hiển thị vừa màn hình | **ĐẠT** | |
| RESP-05 | Menu hamburger trên mobile | Nhấn biểu tượng menu hamburger trên giao diện mobile | Menu điều hướng mở ra với các mục đầy đủ | Menu điều hướng mở ra với các mục đầy đủ | **ĐẠT** | |
| RESP-06 | Cuộn cảm ứng trên mobile | Thực hiện vuốt (swipe) lên/xuống trên thiết bị mobile | Cuộn mượt mà, không có hiện tượng giật hoặc lag | Cuộn mượt mà, không có hiện tượng giật hoặc lag | **ĐẠT** | |
| RESP-07 | Tải hình ảnh trên 3G chậm | Mở trang web với điều kiện mạng chậm (throttling 3G) | Hiển thị placeholder/skeleton trong khi tải hình ảnh | Hiển thị placeholder/skeleton trong khi tải hình ảnh | **ĐẠT** | |

### L. Hồ Sơ & Cài Đặt Người Dùng

| ID | Test Case | Input | Expected Output | Actual Output | Status | Note |
|----|-----------|-------|-----------------|---------------|--------|------|
| PROF-01 | Xem trang hồ sơ | Đăng nhập, truy cập trang /profile | Hiển thị thông tin cá nhân của người dùng (tên, email, số điện thoại, avatar) | Hiển thị thông tin cá nhân của người dùng (tên, email, số điện thoại, avatar) | **ĐẠT** | |
| PROF-02 | Cập nhật tên | Nhập tên mới, nhấn Lưu | Tên được cập nhật và hiển thị trên trang hồ sơ | Tên được cập nhật và hiển thị trên trang hồ sơ | **ĐẠT** | |
| PROF-03 | Cập nhật số điện thoại hợp lệ | Nhập số điện thoại Việt Nam hợp lệ (ví dụ: 0912345678), nhấn Lưu | Số điện thoại được cập nhật thành công | Số điện thoại được cập nhật thành công | **ĐẠT** | |
| PROF-04 | Cập nhật số điện thoại sai định dạng | Nhập số điện thoại không hợp lệ (ví dụ: "abc123", "123", "0123456789"), nhấn Lưu | Lỗi validation "Số điện thoại không hợp lệ" | Hệ thống chấp nhận số điện thoại không hợp lệ | **KHÔNG ĐẠT** | Validation số điện thoại quá lỏng lẻo. Đã ghi nhận lỗi BUG-15. |
| PROF-05 | Tải lên ảnh đại diện (hợp lệ) | Chọn file hình ảnh có kích thước dưới 2MB (jpg, png), nhấn Tải lên | Ảnh đại diện được hiển thị và cập nhật | Ảnh đại diện được hiển thị và cập nhật | **ĐẠT** | |
| PROF-06 | Tải lên ảnh đại diện quá lớn (>2MB) | Chọn file hình ảnh có kích thước lớn hơn 2MB, nhấn Tải lên | Lỗi validation "Kích thước file không được vượt quá 2MB" | Hệ thống chấp nhận file lớn hơn 2MB | **KHÔNG ĐẠT** | Hệ thống không kiểm tra kích thước file trước khi tải lên. Đã ghi nhận lỗi BUG-16. |
| PROF-07 | Tải lên file không phải hình ảnh làm ảnh đại diện | Chọn file không phải hình ảnh (ví dụ: .pdf, .docx), nhấn Tải lên | Lỗi validation "Vui lòng tải lên file hình ảnh (jpg, png, gif)" | Hệ thống chấp nhận file không phải hình ảnh | **KHÔNG ĐẠT** | Hệ thống không kiểm tra loại file trước khi tải lên. Đã ghi nhận lỗi BUG-17. |
| PROF-08 | Xem lịch sử booking | Truy cập trang hồ sơ > Lịch sử đặt tour | Hiển thị danh sách các booking đã thực hiện với trạng thái tương ứng | Hiển thị danh sách các booking đã thực hiện với trạng thái tương ứng | **ĐẠT** | |
| PROF-09 | Hủy booking của mình | Chọn một booking đang ở trạng thái "Chờ xác nhận", nhấn Hủy | Trạng thái booking chuyển thành "Đã hủy", hoàn tiền được kích hoạt | Trạng thái booking chuyển thành "Đã hủy", hoàn tiền được kích hoạt | **ĐẠT** | |

---

## Tổng Kết

| Danh Mục | Tổng | ĐẠT | KHÔNG ĐẠT | Tỷ Lệ Đạt |
|----------|------|-----|-----------|-----------|
| Xác Thực | 17 | 15 | 2 | 88% |
| Điểm Đến | 20 | 19 | 1 | 95% |
| Tours | 15 | 13 | 2 | 87% |
| Bài Viết | 18 | 16 | 2 | 89% |
| Đánh Giá | 11 | 8 | 3 | 73% |
| Yêu Thích | 7 | 7 | 0 | 100% |
| Liên Hệ | 10 | 9 | 1 | 90% |
| Chatbot | 11 | 9 | 2 | 82% |
| Gợi Ý | 6 | 6 | 0 | 100% |
| Trang Quản Trị | 8 | 6 | 2 | 75% |
| Giao Diện Responsive | 7 | 7 | 0 | 100% |
| Hồ Sơ & Cài Đặt Người Dùng | 9 | 6 | 3 | 67% |
| **TỔNG** | **139** | **121** | **18** | **87%** |

---

## Các Lỗi Đã Tìm Thấy & Đã Sửa

| ID Lỗi | Mô Tả | Mức Độ Nghiêm Trọng | Trạng Thái | Sửa Bởi |
|--------|-------|---------------------|------------|----------|
| BUG-01 | Đổi mật khẩu: hệ thống chấp nhận mật khẩu cũ sai | **Nghiêm trọng** | Đã sửa | AUTH-13 |
| BUG-02 | Đổi mật khẩu: hệ thống chấp nhận trùng mật khẩu cũ | **Nghiêm trọng** | Đã sửa | AUTH-14 |
| BUG-03 | Admin tải lên file không phải hình ảnh làm ảnh điểm đến | **Trung bình** | Đã sửa | DEST-11 |
| BUG-04 | Đặt tour vượt số chỗ không bị chặn | **Nghiêm trọng** | Đang mở | TOUR-10 |
| BUG-05 | Đặt tour ngày trong quá khứ không bị chặn | **Nghiêm trọng** | Đang mở | TOUR-11 |
| BUG-06 | Validation bình luận cho phép >1000 ký tự | **Trung bình** | Đã sửa | ART-16 |
| BUG-07 | User có thể xóa bình luận của người khác | **Nghiêm trọng** | Đã sửa | ART-18 |
| BUG-08 | Rating đánh giá chấp nhận 0 hoặc >5 | **Trung bình** | Đã sửa | REV-05, REV-06 |
| BUG-09 | User có thể xóa đánh giá của người khác | **Nghiêm trọng** | Đã sửa | REV-08 |
| BUG-10 | Admin trả lời liên hệ với nội dung rỗng được lưu | **Trung bình** | Đã sửa | INQ-08 |
| BUG-11 | Chatbot crash khi nhận tin nhắn rất dài | **Trung bình** | Đang mở | CHAT-09 |
| BUG-12 | Chatbot crash khi có ký tự đặc biệt | **Trung bình** | Đang mở | CHAT-10 |
| BUG-13 | Admin có thể hủy tài khoản của mình | **Nghiêm trọng** | Đã sửa | ADMIN-03 |
| BUG-14 | Xóa danh mục có nội dung tồn tại | **Trung bình** | Đã sửa | ADMIN-05 |
| BUG-15 | Validation số điện thoại trong hồ sơ quá lỏng lẻo | **Nhỏ** | Đã sửa | PROF-04 |
| BUG-16 | Tải lên ảnh đại diện cho phép file >2MB | **Trung bình** | Đã sửa | PROF-06 |
| BUG-17 | Tải lên ảnh đại diện cho phép file không phải hình ảnh | **Trung bình** | Đã sửa | PROF-07 |

**Mức độ nghiêm trọng:** Nghiêm trọng nhất / Nghiêm trọng / Trung bình / Nhỏ

---

## Ghi Chú

- Tất cả 30+ điểm đến hiển thị đúng với hình ảnh, đánh giá và mô tả
- Tất cả 15 tour hiển thị với giá, lịch trình và bao gồm
- Tất cả 20 bài viết có thể tìm kiếm và lọc
- Chatbot trả lời đúng các câu hỏi du lịch phổ biến
- Engine gợi ý AI chấm điểm điểm đến chính xác theo sở thích
- Trang quản trị cung cấp CRUD đầy đủ cho tất cả loại nội dung
- Xác thực JWT hoạt động đúng cho cả vai trò user và admin
- Tất cả API endpoints được bảo vệ phù hợp với ủy quyền dựa trên vai trò
- 18 ca kiểm thử thất bại; 14 đã được sửa, 4 vẫn đang mở (BUG-04, BUG-05, BUG-11, BUG-12)
- Các lỗi đang mở được theo dõi và lên lịch sửa trong sprint tiếp theo
