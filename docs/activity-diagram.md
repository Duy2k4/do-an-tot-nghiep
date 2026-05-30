# Activity Diagrams - Du Lịch Quảng Bá

> Hướng dẫn: Copy nội dung từng phần vào StarUML qua MCP. Sử dụng kích thước lớn, font 14pt, chỉ màu đen trắng, không nền màu.

---

## 1. AD-001: Đăng ký tài khoản

```
STARUML ACTIVITY DIAGRAM: "AD-001_DangKyTaiKhoan"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1200, font 14pt

CỘT USER:
[Start] --> [Điền form đăng ký: email, mật khẩu, họ tên, SĐT]
[Điền form] --> [Nhấn nút "Đăng ký"]
[Nhấn nút] --> (validate dữ liệu)

CỘT SYSTEM:
(validate dữ liệu) --> [Kiểm tra email đã tồn tại chưa?]
[Kiểm tra] --> [Email đã tồn tại?] --> [Hiển thị lỗi "Email đã được đăng ký"]
[Hiển thị lỗi] --> [End]

[Kiểm tra] --> [Email chưa tồn tại?] --> [Hash mật khẩu bằng bcrypt]
[Hash mật khẩu] --> [Tạo user với role='user']
[Tạo user] --> [Tạo JWT token]
[Tạo JWT] --> [Lưu user vào database]
[Lưu database] --> [Trả về thông tin user + token]
[Trả về] --> [Lưu token vào localStorage]
[Lưu token] --> [Chuyển hướng đến trang chủ]
[Chuyển hướng] --> [End]
```

---

## 2. AD-002: Đăng nhập

```
STARUML ACTIVITY DIAGRAM: "AD-002_DangNhap"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1000, font 14pt

CỘT USER:
[Start] --> [Điền email và mật khẩu]
[Điền] --> [Nhấn nút "Đăng nhập"]
[Nhấn nút] --> [Gửi dữ liệu đăng nhập]

CỘT SYSTEM:
[Gửi dữ liệu] --> [Validate dữ liệu đầu vào]
[Validate] --> [Kiểm tra email tồn tại?]
[Kiểm tra] --> [Email không tồn tại?] --> [Hiển thị "Email hoặc mật khẩu không đúng"]
[Hiển thị] --> [End]

[Kiểm tra] --> [Email tồn tại?] --> [So sánh mật khẩu với hash?]
[So sánh] --> [Mật khẩu sai?] --> [Hiển thị "Email hoặc mật khẩu không đúng"]
[Mật khẩu sai] --> [End]

[So sánh] --> [Mật khẩu đúng?] --> [Tạo JWT token]
[Tạo JWT] --> [Lưu token vào localStorage]
[Lưu token] --> [Chuyển hướng đến trang chủ]
[Chuyển hướng] --> [End]
```

---

## 3. AD-003: Xem và tìm kiếm địa điểm du lịch

```
STARUML ACTIVITY DIAGRAM: "AD-003_TimKiemDiaDiem"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2200 x H1100, font 14pt

CỘT USER:
[Start] --> [Truy cập trang "Địa điểm du lịch"]
[Truy cập] --> [Xem danh sách địa điểm với phân trang]
[Xem danh sách] --> [Tìm kiếm / Lọc / Sắp xếp?]
[Tìm kiếm / Lọc / Sắp xếp?] --> [Có tìm kiếm/lọc?] --> [Nhập từ khóa, chọn bộ lọc]
[Nhập từ khóa] --> [Nhấn tìm kiếm]
[Nhấn tìm kiếm] --> [Có tìm kiếm/lọc?]

[Có tìm kiếm/lọc?] --> [Không?] --> [Click vào địa điểm]
[Click địa điểm] --> [Xem chi tiết địa điểm]
[Xem chi tiết] --> [End]

CỘT SYSTEM:
[Xem danh sách] --> [Query danh sách địa điểm, phân trang 12 item/trang]
[Query] --> [Trả về danh sách]
[Trả về] --> [Hiển thị danh sách]
[Nhấn tìm kiếm] --> [Xử lý tìm kiếm theo từ khóa, danh mục, vùng miền]
[Xử lý] --> [Trả về kết quả lọc]
[Trả về kết quả] --> [Hiển thị kết quả]
[Hiển thị] --> [Xem chi tiết] --> [Query chi tiết địa điểm + reviews]
[Query] --> [Trả về chi tiết]
[Trả về] --> [Hiển thị trang chi tiết]
```

---

## 4. AD-004: Đánh giá địa điểm du lịch

```
STARUML ACTIVITY DIAGRAM: "AD-004_DanhGiaDiaDiem"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1300, font 14pt

CỘT USER:
[Start] --> [Xem chi tiết địa điểm du lịch]
[Xem chi tiết] --> [Cuộn xuống phần đánh giá]
[Cuộn xuống] --> [Nhấn nút "Viết đánh giá"]
[Nhấn nút] --> [Điền điểm sao (1-5) và nội dung nhận xét]
[Điền] --> [Nhấn "Gửi đánh giá"]
[Nhấn gửi] --> [Đã đánh giá?]

CỘT SYSTEM:
[Đã đánh giá?] --> [Rồi?] --> [Hiển thị "Bạn đã đánh giá địa điểm này"]
[Hiển thị] --> [End]

[Đã đánh giá?] --> [Chưa?] --> [Validate dữ liệu: điểm 1-5, nội dung không rỗng]
[Validate] --> [Dữ liệu hợp lệ?] --> [Không?] --> [Hiển thị lỗi validation]
[Hiển thị lỗi] --> [End]

[Dữ liệu hợp lệ?] --> [Có?] --> [Lưu đánh giá vào database]
[Lưu] --> [Cập nhật điểm rating trung bình của địa điểm]
[Cập nhật] --> [Hiển thị đánh giá mới]
[Hiển thị] --> [End]
```

---

## 5. AD-005: Gửi yêu cầu tư vấn / liên hệ

```
STARUML ACTIVITY DIAGRAM: "AD-005_GuiYeuCauTuVan"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1100, font 14pt

CỘT USER:
[Start] --> [Điền form liên hệ: họ tên, email, điện thoại, loại yêu cầu, tiêu đề, nội dung]
[Điền form] --> [Nhấn "Gửi yêu cầu"]
[Nhấn gửi] --> [Kiểm tra đã đăng nhập?]

CỘT SYSTEM:
[Kiểm tra] --> [Chưa đăng nhập?] --> [Lưu inquiry không có userId]
[Lưu không userId] --> [Hiển thị "Gửi thành công"]
[Hiển thị] --> [End]

[Kiểm tra] --> [Đã đăng nhập?] --> [Lưu inquiry với userId]
[Lưu với userId] --> [Validate dữ liệu]
[Validate] --> [Hợp lệ?] --> [Không?] --> [Hiển thị lỗi validation]
[Hiển thị lỗi] --> [End]

[Hợp lệ?] --> [Có?] --> [Lưu vào bảng inquiries]
[Lưu] --> [Hiển thị "Gửi thành công"]
[Hiển thị] --> [End]
```

---

## 6. AD-006: Sử dụng chatbot tư vấn du lịch

```
STARUML ACTIVITY DIAGRAM: "AD-006_ChatbotTuVan"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1300, font 14pt

CỘT USER:
[Start] --> [Mở chatbot widget]
[Mở widget] --> [Gửi tin nhắn câu hỏi]
[Gửi tin nhắn] --> [Nhận phản hồi từ chatbot]
[Nhận phản hồi] --> [Tiếp tục hỏi?]

CỘT SYSTEM:
[Tiếp tục hỏi?] --> [Có?] --> [Nhận tin nhắn]
[Nhận] --> [Keyword detection xác định intent]
[Intent?] --> [Greeting?] --> [Phản hồi chào hỏi]

[Intent?] --> [Budget?] --> [Query thông tin chi phí]
[Intent?] --> [Region: Bắc/Trung/Nam?] --> [Query địa điểm theo vùng]
[Intent?] --> [Type: Biển/Núi/Di tích?] --> [Query địa điểm theo loại]
[Intent?] --> [Recommend?] --> [Query gợi ý địa điểm phù hợp]

[Intent?] --> [Khác?] --> [Fallback: xin lỗi không hiểu]

[Tiếp tục hỏi?] --> [Không?] --> [Đóng chatbot]
[Đóng] --> [Lưu lịch sử chat (nếu đăng nhập)]
[Lưu lịch sử] --> [End]

[Tất cả intent branches] --> [Generate phản hồi từ knowledge base]
[Generate] --> [Trả về phản hồi cho user]
```

---

## 7. AD-007: Gợi ý địa điểm thông minh

```
STARUML ACTIVITY DIAGRAM: "AD-007_GoiYThongMinh"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2200 x H1100, font 14pt

CỘT USER:
[Start] --> [Truy cập trang "Gợi ý thông minh"]
[Truy cập] --> [Chọn tiêu chí: vùng miền, loại hình, ngân sách, thời gian]
[Chọn tiêu chí] --> [Nhấn "Gợi ý cho tôi"]
[Nhấn nút] --> [Xem danh sách gợi ý với điểm match]

CỘT SYSTEM:
[Nhấn nút] --> [Chạy rule-based scoring engine]
[Scoring] --> [Tính điểm cho từng địa điểm]
[Tính điểm] --> [Rating score: 0-40 điểm]
[Tính điểm] --> [Review count bonus: 0-20 điểm]
[Tính điểm] --> [Featured bonus: 10 điểm]
[Tính điểm] --> [Region match: 10 điểm]
[Tính điểm] --> [Category match: 10 điểm]
[Tính điểm] --> [Budget match: 10 điểm]
[Tính điểm] --> [Popularity: 0-10 điểm]

[Tất cả điểm] --> [Sắp xếp theo điểm tổng giảm dần]
[Sắp xếp] --> [Trả về top địa điểm với điểm match và lý do]
[Trả về] --> [Hiển thị kết quả với lý do match]
[Hiển thị] --> [End]
```

---

## 8. AD-008: Quản lý địa điểm du lịch (Admin)

```
STARUML ACTIVITY DIAGRAM: "AD-008_AdminQuanLyDiaDiem"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["ADMIN" | "SYSTEM"]
- Kích thước: W2200 x H1400, font 14pt

CỘT ADMIN:
[Start] --> [Đăng nhập với tài khoản admin]
[Đăng nhập] --> [Truy cập trang quản trị]
[Truy cập] --> [Vào mục "Quản lý địa điểm"]
[Vào mục] --> [Xem danh sách, tìm kiếm, lọc]
[Xem danh sách] --> [Thao tác?]
[Thao tác?] --> [Tạo mới?] --> [Điền form đầy đủ thông tin]
[Điền form] --> [Nhấn "Lưu"]

[Thao tác?] --> [Cập nhật?] --> [Sửa thông tin, upload ảnh]
[Sửa] --> [Nhấn "Lưu"]

[Thao tác?] --> [Xóa?] --> [Nhấn nút xóa]
[Nhấn xóa] --> [Xác nhận xóa?]

[Xác nhận] --> [Có?] --> [Gửi yêu cầu xóa]

CỘT SYSTEM:
[Nhấn "Lưu"] --> [Validate dữ liệu đầu vào]
[Validate] --> [Hợp lệ?] --> [Không?] --> [Hiển thị lỗi validation]
[Hiển thị lỗi] --> [End]

[Hợp lệ?] --> [Có?] --> [Tạo / Cập nhật địa điểm trong database]
[Xử lý database] --> [Thành công?] --> [Không?] --> [Hiển thị lỗi hệ thống]
[Hiển thị lỗi] --> [End]

[Thành công?] --> [Có?] --> [Thông báo thành công]
[Thông báo] --> [Refresh danh sách]
[Refresh] --> [End]

[Gửi yêu cầu xóa] --> [Xóa địa điểm (xóa mềm)]
[Xóa] --> [Thông báo thành công]
[Thông báo] --> [Refresh danh sách]
```

---

## 9. AD-009: Đặt tour du lịch

```
STARUML ACTIVITY DIAGRAM: "AD-009_DatTour"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2200 x H1300, font 14pt

CỘT USER:
[Start] --> [Xem chi tiết tour]
[Xem chi tiết] --> [Chọn ngày khởi hành và số lượng khách]
[Chọn] --> [Điền thông tin: họ tên, email, điện thoại, ghi chú]
[Điền] --> [Kiểm tra thông tin]
[Kiểm tra] --> [Xác nhận đặt tour]
[Xác nhận] --> [Thanh toán?]
[Thanh toán?] --> [Thành công?] --> [Nhận email xác nhận]
[Nhận email] --> [End]

CỘT SYSTEM:
[Chọn] --> [Kiểm tra số chỗ còn trong ngày?]
[Kiểm tra] --> [Đủ chỗ?] --> [Cho phép tiếp tục]
[Cho phép] --> [Điền thông tin]

[Kiểm tra] --> [Không đủ chỗ?] --> [Hiển thị "Số chỗ không đủ"]
[Hiển thị] --> [End]

[Xác nhận] --> [Validate thông tin đặt tour]
[Validate] --> [Hợp lệ?] --> [Không?] --> [Hiển thị lỗi validation]
[Hiển thị] --> [End]

[Hợp lệ?] --> [Có?] --> [Tạo booking record với status='pending']
[Tạo record] --> [Gửi email xác nhận cho người dùng]
[Gửi email] --> [Thông báo đặt thành công]
[Thông báo] --> [End]
```

---

## 10. AD-010: Bình luận bài viết

```
STARUML ACTIVITY DIAGRAM: "AD-010_BinhLuanBaiViet"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["USER" | "SYSTEM"]
- Kích thước: W2000 x H1100, font 14pt

CỘT USER:
[Start] --> [Xem chi tiết bài viết]
[Xem chi tiết] --> [Cuộn xuống phần bình luận]
[Cuộn] --> [Nhập nội dung bình luận]
[Nhập] --> [Nhấn "Gửi bình luận"]
[Nhấn gửi] --> [Xem bình luận mới hiển thị]

CỘT SYSTEM:
[Nhấn gửi] --> [Kiểm tra đã đăng nhập?]
[Kiểm tra] --> [Chưa đăng nhập?] --> [Hiển thị "Đăng nhập để bình luận"]
[Hiển thị] --> [Chuyển hướng đến trang đăng nhập]
[Chuyển hướng] --> [End]

[Kiểm tra] --> [Đã đăng nhập?] --> [Validate nội dung: không rỗng, <=1000 ký tự]
[Validate] --> [Hợp lệ?] --> [Không?] --> [Hiển thị lỗi validation]
[Hiển thị lỗi] --> [End]

[Hợp lệ?] --> [Có?] --> [Lưu bình luận vào database]
[Lưu] --> [Hiển thị bình luận mới]
[Hiển thị] --> [End]
```

---

## 11. AD-011: Quản lý đặt tour (Admin)

```
STARUML ACTIVITY DIAGRAM: "AD-011_AdminQuanLyDatTour"

BIỂU ĐỒ:
- Swimlanes: 2 cột ["ADMIN" | "SYSTEM"]
- Kích thước: W2200 x H1200, font 14pt

CỘT ADMIN:
[Start] --> [Đăng nhập admin]
[Đăng nhập] --> [Truy cập "Quản lý đặt tour"]
[Truy cập] --> [Xem danh sách với filter: pending/confirmed/cancelled/completed]
[Xem danh sách] --> [Click vào booking để xem chi tiết]
[Click] --> [Xem chi tiết đặt tour]
[Xem chi tiết] --> [Thao tác?]

[Thao tác?] --> [Cập nhật trạng thái?] --> [Chọn trạng thái mới]
[Chọn trạng thái] --> [Nhấn "Cập nhật"]

[Thao tác?] --> [Gửi email?] --> [Nhấn "Gửi thông báo"]
[Nhấn gửi] --> [Nhấn "Cập nhật"]

[Thao tác?] --> [Hủy đặt?] --> [Xác nhận hủy]
[Xác nhận] --> [Nhấn "Hủy đặt"]

CỘT SYSTEM:
[Nhấn "Cập nhật"] --> [Cập nhật trạng thái booking]
[Cập nhật] --> [Gửi email thông báo cho khách hàng]
[Gửi email] --> [Thông báo thành công]
[Thông báo] --> [Refresh danh sách]
[Refresh] --> [End]

[Nhấn "Hủy đặt"] --> [Cập nhật status='cancelled']
[Cập nhật] --> [Hoàn lại số chỗ tour]
[Hoàn lại] --> [Gửi email thông báo hủy]
[Gửi email] --> [Refresh danh sách]
```

---

## Hướng dẫn sử dụng MCP cho StarUML

Để tạo biểu đồ trong StarUML qua MCP, sử dụng lệnh sau:

```
/mdgen staruml.createActivityDiagram {
  "diagramName": "Tên biểu đồ",
  "swimlanes": ["USER", "SYSTEM"],
  "activities": [...],
  "transitions": [...],
  "decisions": [...]
}
```

Hoặc tạo thủ công trong StarUML với các thiết lập:
- **Kích thước canvas:** W2000 x H1200 trở lên
- **Font chữ:** 14pt, Arial hoặc Times New Roman
- **Màu sắc:** Chỉ đen trắng (Black #000000, White #FFFFFF)
- **Đường viền:** 1pt solid black
- **Shape:** Rounded rectangle cho activities, Diamond cho decisions
- **Swimlanes:** 2 cột rõ ràng phân chia User/System
