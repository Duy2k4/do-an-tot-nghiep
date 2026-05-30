# Use Cases - Du Lịch Quảng Bá

## 1. UC-001: Đăng ký tài khoản

**Actor:** Khách vãng lai
**Mô tả:** Người dùng đăng ký tài khoản mới trên hệ thống

**Pre-condition:** Người dùng chưa có tài khoản

**Main Flow:**
1. Người dùng truy cập trang đăng ký
2. Điền email, mật khẩu (>=6 ký tự), họ tên, số điện thoại (tùy chọn)
3. Hệ thống validate dữ liệu đầu vào
4. Kiểm tra email chưa tồn tại
5. Hash password bằng bcrypt
6. Tạo user với role = 'user'
7. Tạo JWT token
8. Trả về thông tin user + token
9. Chuyển hướng đến trang chủ với trạng thái đã đăng nhập

**Alternative Flow:**
- Email đã tồn tại: Hiển thị lỗi "Email đã được đăng ký"
- Dữ liệu không hợp lệ: Hiển thị lỗi validation cụ thể

---

## 2. UC-002: Đăng nhập

**Actor:** Người dùng đã đăng ký
**Mô tả:** Người dùng đăng nhập vào hệ thống

**Pre-condition:** Người dùng đã có tài khoản

**Main Flow:**
1. Người dùng truy cập trang đăng nhập
2. Điền email và mật khẩu
3. Hệ thống validate dữ liệu
4. Kiểm tra email tồn tại
5. So sánh password với hash trong database
6. Tạo JWT token
7. Trả về thông tin user + token
8. Lưu token vào localStorage
9. Chuyển hướng đến trang chủ

**Alternative Flow:**
- Email không tồn tại: Hiển thị "Email hoặc mật khẩu không đúng"
- Password sai: Hiển thị "Email hoặc mật khẩu không đúng"
- Tài khoản bị vô hiệu: Hiển thị "Tài khoản đã bị vô hiệu hóa"

---

## 3. UC-003: Xem và tìm kiếm địa điểm du lịch

**Actor:** Khách vãng lai / Người dùng đã đăng nhập
**Mô tả:** Người dùng tìm kiếm và xem danh sách địa điểm du lịch

**Pre-condition:** Không

**Main Flow:**
1. Người dùng truy cập trang "Địa điểm du lịch"
2. Hệ thống hiển thị danh sách với phân trang
3. Người dùng có thể:
   - Tìm kiếm theo từ khóa
   - Lọc theo danh mục (biển, núi, di tích...)
   - Lọc theo tỉnh/thành
   - Lọc theo vùng miền
   - Sắp xếp theo: mới nhất, phổ biến, đánh giá
4. Click vào địa điểm để xem chi tiết

---

## 4. UC-004: Đánh giá địa điểm du lịch

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Người dùng đăng nhập có thể đánh giá địa điểm

**Pre-condition:** Người dùng đã đăng nhập, đã xem chi tiết địa điểm

**Main Flow:**
1. Người dùng đăng nhập và xem chi tiết địa điểm
2. Cuộn xuống phần đánh giá
3. Click nút "Viết đánh giá"
4. Điền điểm sao (1-5) và nội dung nhận xét
5. Click "Gửi đánh giá"
6. Hệ thống validate dữ liệu
7. Kiểm tra user chưa đánh giá địa điểm này
8. Lưu đánh giá vào database
9. Cập nhật điểm rating trung bình của địa điểm
10. Hiển thị đánh giá mới

**Alternative Flow:**
- Đã đánh giá: Hiển thị "Bạn đã đánh giá địa điểm này"

---

## 5. UC-005: Gửi yêu cầu tư vấn / liên hệ

**Actor:** Khách vãng lai / Người dùng đã đăng nhập
**Mô tả:** Người dùng gửi yêu cầu tư vấn tour hoặc liên hệ

**Pre-condition:** Không

**Main Flow:**
1. Người dùng điền form liên hệ/tư vấn
2. Nhập: Họ tên, email, điện thoại, loại yêu cầu, tiêu đề, nội dung
3. Click "Gửi yêu cầu"
4. Hệ thống validate dữ liệu
5. Lưu vào bảng inquiries
6. Hiển thị thông báo "Gửi thành công"
7. (Nếu đăng nhập) Lưu userId vào inquiry

---

## 6. UC-006: Sử dụng chatbot tư vấn du lịch

**Actor:** Khách vãng lai / Người dùng đã đăng nhập
**Mô tả:** Người dùng trò chuyện với chatbot để được tư vấn du lịch

**Pre-condition:** Không

**Main Flow:**
1. Người dùng mở chatbot widget
2. Gửi tin nhắn câu hỏi
3. Hệ thống keyword detection xác định intent
4. Query knowledge base (destinations, tours, articles)
5. Generate response từ rule-based engine
6. Hiển thị phản hồi chatbot
7. Lưu lịch sử chat (nếu đăng nhập)

**Supported Intents:**
- greeting: Chào hỏi
- budget: Hỏi về chi phí
- time: Hỏi về thời gian
- family/couple/group: Hỏi phù hợp đối tượng
- beach/mountain: Hỏi về loại hình
- recommend: Yêu cầu gợi ý
- south/north/central: Hỏi theo vùng miền

---

## 7. UC-007: Gợi ý địa điểm thông minh

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Hệ thống gợi ý địa điểm dựa trên sở thích

**Pre-condition:** Người dùng đã đăng nhập

**Main Flow:**
1. Người dùng truy cập trang "Gợi ý thông minh"
2. Chọn các tiêu chí:
   - Vùng miền (Bắc/Trung/Nam)
   - Loại hình du lịch (biển, núi, di tích...)
   - Ngân sách (thấp/trung bình/cao)
   - Thời gian (ngắn/trung bình/dài)
3. Click "Gợi ý cho tôi"
4. Backend chạy rule-based scoring engine
5. Trả về danh sách địa điểm với điểm match
6. Hiển thị với lý do match

**Scoring Algorithm:**
- Rating score: 0-40 điểm
- Review count bonus: 0-20 điểm
- Featured bonus: 10 điểm
- Region match: 10 điểm
- Category match: 10 điểm
- Budget match: 10 điểm
- Popularity: 0-10 điểm

---

## 8. UC-008: Quản lý địa điểm du lịch (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin CRUD địa điểm du lịch

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang quản trị
3. Vào mục "Quản lý địa điểm"
4. Xem danh sách, tìm kiếm, lọc
5. Tạo mới: Điền form với tất cả trường
6. Cập nhật: Sửa thông tin, upload ảnh
7. Xóa: Xác nhận trước khi xóa
8. Hệ thống xử lý và thông báo kết quả

---

## 9. UC-009: Quản lý yêu cầu tư vấn (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin xem và xử lý yêu cầu tư vấn

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Yêu cầu tư vấn"
3. Xem danh sách với filter: pending/replied/closed
4. Click vào yêu cầu để xem chi tiết
5. Nhập phản hồi và cập nhật trạng thái
6. Lưu và thông báo cho người dùng (nếu có email)

---

## 10. UC-010: Lưu địa điểm yêu thích

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Người dùng lưu địa điểm yêu thích

**Main Flow:**
1. Người dùng xem chi tiết địa điểm
2. Click nút trái tim (yêu thích)
3. Hệ thống kiểm tra đã yêu thích chưa
4. Nếu chưa: Thêm vào favorites
5. Nếu rồi: Xóa khỏi favorites
6. Cập nhật UI
7. Người dùng có thể xem danh sách yêu thích trong profile

---

## 11. UC-011: Xem và tìm kiếm tour du lịch

**Actor:** Khách vãng lai / Người dùng đã đăng nhập
**Mô tả:** Người dùng tìm kiếm và xem danh sách tour du lịch

**Pre-condition:** Không

**Main Flow:**
1. Người dùng truy cập trang "Tour du lịch"
2. Hệ thống hiển thị danh sách tour với phân trang
3. Người dùng có thể:
   - Tìm kiếm theo từ khóa
   - Lọc theo mức giá (dưới 1M, 1M-3M, 3M-5M, trên 5M)
   - Lọc theo thời gian (ngắn ngày, nhiều ngày)
   - Lọc theo vùng miền
   - Sắp xếp theo: giá thấp-cao, mới nhất, phổ biến
4. Click vào tour để xem chi tiết lịch trình

---

## 12. UC-012: Đặt tour du lịch

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Người dùng đặt tour du lịch

**Pre-condition:** Người dùng đã đăng nhập

**Main Flow:**
1. Người dùng xem chi tiết tour
2. Chọn ngày khởi hành và số lượng khách
3. Điền thông tin liên hệ (họ tên, email, điện thoại, ghi chú)
4. Kiểm tra thông tin đặt tour
5. Xác nhận đặt tour
6. Hệ thống tạo booking record với status = 'pending'
7. Gửi email xác nhận cho người dùng
8. Thông báo đặt thành công

**Alternative Flow:**
- Số lượng khách vượt giới hạn: Hiển thị "Số chỗ không đủ"
- Chưa chọn ngày: Yêu cầu chọn ngày khởi hành

---

## 13. UC-013: Xem và tìm kiếm bài viết / tin tức

**Actor:** Khách vãng lai / Người dùng đã đăng nhập
**Mô tả:** Người dùng đọc bài viết, tin tức du lịch

**Pre-condition:** Không

**Main Flow:**
1. Người dùng truy cập trang "Tin tức / Bài viết"
2. Hệ thống hiển thị danh sách bài viết nổi bật
3. Người dùng có thể:
   - Tìm kiếm theo từ khóa
   - Lọc theo danh mục (tin tức, kinh nghiệm, ẩm thực...)
   - Xem bài viết nổi bật (featured)
4. Click vào bài viết để đọc chi tiết
5. Cuộn xuống để xem bình luận

---

## 14. UC-014: Bình luận bài viết

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Người dùng bình luận trên bài viết

**Pre-condition:** Người dùng đã đăng nhập, đã xem chi tiết bài viết

**Main Flow:**
1. Người dùng đăng nhập và xem chi tiết bài viết
2. Cuộn xuống phần bình luận
3. Nhập nội dung bình luận
4. Click "Gửi bình luận"
5. Hệ thống validate dữ liệu (không rỗng, không quá 1000 ký tự)
6. Lưu bình luận vào database
7. Hiển thị bình luận mới

**Alternative Flow:**
- Chưa đăng nhập: Hiển thị "Đăng nhập để bình luận"
- Nội dung rỗng: Hiển thị lỗi validation

---

## 15. UC-015: Quản lý bài viết (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin CRUD bài viết và tin tức

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Quản lý bài viết"
3. Xem danh sách với filter: all/draft/published
4. Tạo mới: Điền tiêu đề, danh mục, nội dung, ảnh, tag
5. Cập nhật: Sửa nội dung, publish/unpublish
6. Xóa: Xác nhận trước khi xóa (xóa mềm)
7. Hệ thống xử lý và thông báo kết quả

---

## 16. UC-016: Quản lý tour (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin CRUD tour du lịch

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Quản lý tour"
3. Xem danh sách, tìm kiếm, lọc theo trạng thái
4. Tạo mới: Điền tên, mô tả, lịch trình, giá, ngày khả dụng
5. Cập nhật: Sửa thông tin, cập nhật số chỗ
6. Xóa: Xác nhận trước khi xóa
7. Xem danh sách đặt tour và cập nhật trạng thái (pending/confirmed/cancelled)

---

## 17. UC-017: Xem dashboard thống kê (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin xem thống kê tổng quan hệ thống

**Main Flow:**
1. Admin đăng nhập
2. Dashboard tự động load dữ liệu:
   - Tổng số người dùng, địa điểm, tour, bài viết
   - Số lượng đặt tour theo tháng (chart)
   - Top 5 địa điểm được yêu thích nhất
   - Các yêu cầu tư vấn chưa xử lý
3. Lọc theo khoảng thời gian (tuần/tháng/quý)
4. Export báo cáo (PDF/Excel)

---

## 18. UC-018: Quản lý người dùng (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin quản lý tài khoản người dùng

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Quản lý người dùng"
3. Xem danh sách với phân trang
4. Tìm kiếm theo email, họ tên
5. Toggle trạng thái active/inactive
6. Reset mật khẩu cho user
7. Xem chi tiết: địa điểm yêu thích, đánh giá, đặt tour

**Alternative Flow:**
- Không thể tự khóa tài khoản admin khác: Cảnh báo

---

## 19. UC-019: Quản lý danh mục (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin CRUD danh mục địa điểm và bài viết

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Quản lý danh mục"
3. Xem danh sách danh mục
4. Tạo mới: Nhập tên, mô tả, icon
5. Cập nhật: Sửa tên, mô tả
6. Xóa: Kiểm tra không còn địa điểm/bài viết thuộc danh mục

**Alternative Flow:**
- Danh mục đang có nội dung: Hiển thị "Không thể xóa, danh mục đang có nội dung"

---

## 20. UC-020: Quản lý đặt tour (Admin)

**Actor:** Quản trị viên
**Mô tả:** Admin xem và cập nhật trạng thái đặt tour

**Main Flow:**
1. Admin đăng nhập
2. Truy cập trang "Quản lý đặt tour"
3. Xem danh sách với filter: pending/confirmed/cancelled/completed
4. Click vào booking để xem chi tiết
5. Cập nhật trạng thái đặt tour
6. Gửi email thông báo cho khách hàng
7. Export danh sách đặt tour

**Alternative Flow:**
- Hủy đặt: Cập nhật trạng thái, hoàn lại số chỗ

---

## 21. UC-021: Cập nhật thông tin cá nhân

**Actor:** Người dùng đã đăng nhập
**Mô tả:** Người dùng cập nhật hồ sơ cá nhân

**Pre-condition:** Người dùng đã đăng nhập

**Main Flow:**
1. Người dùng truy cập trang "Hồ sơ" trong profile
2. Xem thông tin hiện tại
3. Cập nhật: Họ tên, số điện thoại, avatar
4. Click "Lưu thay đổi"
5. Hệ thống validate và lưu
6. Hiển thị thông báo thành công

**Alternative Flow:**
- Upload avatar: Validate định dạng (jpg, png), kích thước <= 2MB
- Số điện thoại không hợp lệ: Hiển thị lỗi validation
