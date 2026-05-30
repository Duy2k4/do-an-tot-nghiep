# Sequence Diagrams - Du Lịch Quảng Bá

> Hướng dẫn: Copy nội dung từng phần vào StarUML qua MCP. Sử dụng kích thước lớn, font 14pt, chỉ màu đen trắng, không nền màu. Biểu đồ trình bày ở mức phân tích (không chi tiết API).

---

## 1. SD-001: Đăng ký tài khoản

```
STARUML SEQUENCE DIAGRAM: "SD-001_DangKyTaiKhoan"

KÍCH THƯỚC: W2200 x H800, font 14pt
MÀU SẮC: Chỉ đen trắng (#000000 / #FFFFFF)

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Đăng ký]
[Entity: Hệ thống Xác thực]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Đăng ký]: Điền form (email, mật khẩu, họ tên, SĐT)
2. User -> [Trang Đăng ký]: Nhấn nút "Đăng ký"
3. [Trang Đăng ký] -> [Hệ thống Xác thực]: Gửi yêu cầu đăng ký
4. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: Validate dữ liệu
5. [Hệ thống Xác thực] -> [Cơ sở dữ liệu]: Kiểm tra email tồn tại
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: Kết quả (email chưa tồn tại)
7. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: Hash mật khẩu (bcrypt)
8. [Hệ thống Xác thực] -> [Cơ sở dữ liệu]: Tạo user mới (role=user)
9. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: Xác nhận tạo thành công
10. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: Tạo JWT token
11. [Hệ thống Xác thực] -> [Trang Đăng ký]: Trả về user info + token
12. [Trang Đăng ký] -> [Actor: User]: Chuyển hướng đến trang chủ

ALT BRANCH (email đã tồn tại):
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: Kết quả (email đã tồn tại)
7. [Hệ thống Xác thực] -> [Trang Đăng ký]: Lỗi "Email đã được đăng ký"
8. [Trang Đăng ký] -> [Actor: User]: Hiển thị thông báo lỗi
```

---

## 2. SD-002: Đăng nhập

```
STARUML SEQUENCE DIAGRAM: "SD-002_DangNhap"

KÍCH THƯỚC: W2200 x H800, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Đăng nhập]
[Entity: Hệ thống Xác thực]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Đăng nhập]: Điền email và mật khẩu
2. User -> [Trang Đăng nhập]: Nhấn nút "Đăng nhập"
3. [Trang Đăng nhập] -> [Hệ thống Xác thực]: Gửi credentials
4. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: Validate dữ liệu
5. [Hệ thống Xác thực] -> [Cơ sở dữ liệu]: Tìm user theo email
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: Kết quả user

ALT BRANCH (email không tồn tại):
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: Không tìm thấy user
7. [Hệ thống Xác thực] -> [Trang Đăng nhập]: Lỗi "Email hoặc mật khẩu không đúng"
8. [Trang Đăng nhập] -> [Actor: User]: Hiển thị lỗi

ALT BRANCH (mật khẩu sai):
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: User found
7. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: So sánh mật khẩu
8. [Hệ thống Xác thực] -> [Trang Đăng nhập]: Lỗi "Email hoặc mật khẩu không đúng"
9. [Trang Đăng nhập] -> [Actor: User]: Hiển thị lỗi

MAIN FLOW (đăng nhập thành công):
6. [Cơ sở dữ liệu] -> [Hệ thống Xác thực]: User found
7. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: So sánh mật khẩu (đúng)
8. [Hệ thống Xác thực] -> [Hệ thống Xác thực]: Tạo JWT token
9. [Hệ thống Xác thực] -> [Trang Đăng nhập]: Trả về token + user info
10. [Trang Đăng nhập] -> [Actor: User]: Lưu token, chuyển hướng trang chủ
```

---

## 3. SD-003: Xem và tìm kiếm địa điểm du lịch

```
STARUML SEQUENCE DIAGRAM: "SD-003_TimKiemDiaDiem"

KÍCH THƯỚC: W2200 x H900, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Địa điểm du lịch]
[Entity: Bộ xử lý Tìm kiếm]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Địa điểm du lịch]: Truy cập trang
2. [Trang Địa điểm] -> [Bộ xử lý Tìm kiếm]: Yêu cầu danh sách (page=1)
3. [Bộ xử lý Tìm kiếm] -> [Cơ sở dữ liệu]: Query địa điểm (phân trang 12 item)
4. [Cơ sở dữ liệu] -> [Bộ xử lý Tìm kiếm]: Trả về danh sách + tổng số
5. [Bộ xử lý Tìm kiếm] -> [Trang Địa điểm]: Trả về kết quả
6. [Trang Địa điểm] -> [Actor: User]: Hiển thị danh sách địa điểm

TÙY CHỌN TÌM KIẾM:
7. User -> [Trang Địa điểm]: Nhập từ khóa tìm kiếm
8. User -> [Trang Địa điểm]: Chọn bộ lọc (danh mục, vùng miền)
9. User -> [Trang Địa điểm]: Nhấn nút tìm kiếm
10. [Trang Địa điểm] -> [Bộ xử lý Tìm kiếm]: Yêu cầu tìm kiếm (keyword, filters)
11. [Bộ xử lý Tìm kiếm] -> [Cơ sở dữ liệu]: Query với điều kiện lọc
12. [Cơ sở dữ liệu] -> [Bộ xử lý Tìm kiếm]: Trả về kết quả lọc
13. [Bộ xử lý Tìm kiếm] -> [Trang Địa điểm]: Trả về kết quả
14. [Trang Địa điểm] -> [Actor: User]: Hiển thị kết quả lọc

XEM CHI TIẾT:
15. User -> [Trang Địa điểm]: Click vào một địa điểm
16. [Trang Địa điểm] -> [Bộ xử lý Tìm kiếm]: Yêu cầu chi tiết địa điểm
17. [Bộ xử lý Tìm kiếm] -> [Cơ sở dữ liệu]: Query chi tiết + reviews
18. [Cơ sở dữ liệu] -> [Bộ xử lý Tìm kiếm]: Trả về chi tiết
19. [Bộ xử lý Tìm kiếm] -> [Trang Địa điểm]: Trả về chi tiết
20. [Trang Địa điểm] -> [Actor: User]: Chuyển hướng trang chi tiết
```

---

## 4. SD-004: Đánh giá địa điểm du lịch

```
STARUML SEQUENCE DIAGRAM: "SD-004_DanhGiaDiaDiem"

KÍCH THƯỚC: W2200 x H800, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Chi tiết Địa điểm]
[Entity: Bộ xử lý Đánh giá]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Chi tiết]: Xem chi tiết địa điểm
2. User -> [Trang Chi tiết]: Cuộn xuống phần đánh giá
3. User -> [Trang Chi tiết]: Nhấn nút "Viết đánh giá"
4. [Trang Chi tiết] -> [Bộ xử lý Đánh giá]: Kiểm tra đã đánh giá chưa (userId, destinationId)
5. [Bộ xử lý Đánh giá] -> [Cơ sở dữ liệu]: Query đánh giá
6. [Cơ sở dữ liệu] -> [Bộ xử lý Đánh giá]: Kết quả

ALT BRANCH (đã đánh giá):
7. [Bộ xử lý Đánh giá] -> [Trang Chi tiết]: Thông báo "Bạn đã đánh giá"
8. [Trang Chi tiết] -> [Actor: User]: Hiển thị thông báo

MAIN FLOW (chưa đánh giá):
7. [Bộ xử lý Đánh giá] -> [Trang Chi tiết]: Cho phép đánh giá
8. User -> [Trang Chi tiết]: Điền điểm sao (1-5) và nội dung
9. User -> [Trang Chi tiết]: Nhấn "Gửi đánh giá"
10. [Trang Chi tiết] -> [Bộ xử lý Đánh giá]: Gửi đánh giá
11. [Bộ xử lý Đánh giá] -> [Bộ xử lý Đánh giá]: Validate (điểm 1-5, nội dung không rỗng)
12. [Bộ xử lý Đánh giá] -> [Cơ sở dữ liệu]: Lưu đánh giá
13. [Cơ sở dữ liệu] -> [Bộ xử lý Đánh giá]: Xác nhận
14. [Bộ xử lý Đánh giá] -> [Cơ sở dữ liệu]: Cập nhật điểm rating trung bình địa điểm
15. [Cơ sở dữ liệu] -> [Bộ xử lý Đánh giá]: Xác nhận cập nhật
16. [Bộ xử lý Đánh giá] -> [Trang Chi tiết]: Trả về đánh giá mới
17. [Trang Chi tiết] -> [Actor: User]: Hiển thị đánh giá mới
```

---

## 5. SD-005: Gửi yêu cầu tư vấn / liên hệ

```
STARUML SEQUENCE DIAGRAM: "SD-005_GuiYeuCauTuVan"

KÍCH THƯỚC: W2200 x H700, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Form Liên hệ]
[Entity: Bộ xử lý Inquiry]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Form Liên hệ]: Điền thông tin (họ tên, email, điện thoại, loại yêu cầu, tiêu đề, nội dung)
2. User -> [Form Liên hệ]: Nhấn "Gửi yêu cầu"
3. [Form Liên hệ] -> [Bộ xử lý Inquiry]: Gửi dữ liệu form
4. [Bộ xử lý Inquiry] -> [Bộ xử lý Inquiry]: Validate dữ liệu
5. [Bộ xử lý Inquiry] -> [Bộ xử lý Inquiry]: Kiểm tra đăng nhập

ALT BRANCH (chưa đăng nhập):
6. [Bộ xử lý Inquiry] -> [Cơ sở dữ liệu]: Lưu inquiry (không có userId)
7. [Cơ sở dữ liệu] -> [Bộ xử lý Inquiry]: Xác nhận
8. [Bộ xử lý Inquiry] -> [Form Liên hệ]: Thành công
9. [Form Liên hệ] -> [Actor: User]: Hiển thị "Gửi thành công"

MAIN FLOW (đã đăng nhập):
6. [Bộ xử lý Inquiry] -> [Cơ sở dữ liệu]: Lưu inquiry (với userId)
7. [Cơ sở dữ liệu] -> [Bộ xử lý Inquiry]: Xác nhận
8. [Bộ xử lý Inquiry] -> [Form Liên hệ]: Thành công
9. [Form Liên hệ] -> [Actor: User]: Hiển thị "Gửi thành công"
```

---

## 6. SD-006: Sử dụng chatbot tư vấn du lịch

```
STARUML SEQUENCE DIAGRAM: "SD-006_ChatbotTuVan"

KÍCH THƯỚC: W2400 x H900, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Chatbot Widget]
[Entity: Bộ xử lý Chatbot]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Chatbot Widget]: Mở chatbot widget
2. User -> [Chatbot Widget]: Gửi tin nhắn câu hỏi
3. [Chatbot Widget] -> [Bộ xử lý Chatbot]: Gửi tin nhắn + userId (nếu đăng nhập)
4. [Bộ xử lý Chatbot] -> [Bộ xử lý Chatbot]: Keyword detection xác định intent
5. [Bộ xử lý Chatbot] -> [Cơ sở dữ liệu]: Query knowledge base theo intent

SWITCH INTENT:
- intent = "greeting": Query thông tin chào hỏi
- intent = "budget": Query chi phí địa điểm
- intent = "region": Query địa điểm theo vùng miền
- intent = "type": Query địa điểm theo loại hình
- intent = "recommend": Chạy scoring engine
- intent = "other": Trả về fallback

6. [Cơ sở dữ liệu] -> [Bộ xử lý Chatbot]: Trả về dữ liệu
7. [Bộ xử lý Chatbot] -> [Bộ xử lý Chatbot]: Generate phản hồi
8. [Bộ xử lý Chatbot] -> [Chatbot Widget]: Trả về phản hồi
9. [Chatbot Widget] -> [Actor: User]: Hiển thị phản hồi

ALT BRANCH (đăng nhập, lưu lịch sử):
10. [Bộ xử lý Chatbot] -> [Cơ sở dữ liệu]: Lưu lịch sử chat
11. [Cơ sở dữ liệu] -> [Bộ xử lý Chatbot]: Xác nhận
```

---

## 7. SD-007: Gợi ý địa điểm thông minh

```
STARUML SEQUENCE DIAGRAM: "SD-007_GoiYThongMinh"

KÍCH THƯỚC: W2400 x H800, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Gợi ý]
[Entity: Bộ Scoring Engine]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Gợi ý]: Truy cập trang
2. User -> [Trang Gợi ý]: Chọn tiêu chí (vùng miền, loại hình, ngân sách, thời gian)
3. User -> [Trang Gợi ý]: Nhấn "Gợi ý cho tôi"
4. [Trang Gợi ý] -> [Bộ Scoring Engine]: Gửi preferences
5. [Bộ Scoring Engine] -> [Cơ sở dữ liệu]: Query tất cả địa điểm
6. [Cơ sở dữ liệu] -> [Bộ Scoring Engine]: Trả về danh sách địa điểm
7. [Bộ Scoring Engine] -> [Bộ Scoring Engine]: Scoring từng địa điểm

SCORING STEPS:
8. [Bộ Scoring Engine]: Tính Rating score (0-40 điểm)
9. [Bộ Scoring Engine]: Tính Review count bonus (0-20 điểm)
10. [Bộ Scoring Engine]: Tính Featured bonus (10 điểm nếu featured)
11. [Bộ Scoring Engine]: Tính Region match (10 điểm nếu khớp)
12. [Bộ Scoring Engine]: Tính Category match (10 điểm nếu khớp)
13. [Bộ Scoring Engine]: Tính Budget match (10 điểm nếu khớp)
14. [Bộ Scoring Engine]: Tính Popularity (0-10 điểm)

15. [Bộ Scoring Engine] -> [Bộ Scoring Engine]: Tổng hợp điểm, sắp xếp giảm dần
16. [Bộ Scoring Engine] -> [Bộ Scoring Engine]: Gắn lý do match cho từng địa điểm
17. [Bộ Scoring Engine] -> [Trang Gợi ý]: Trả về top địa điểm + điểm + lý do
18. [Trang Gợi ý] -> [Actor: User]: Hiển thị kết quả với điểm và lý do
```

---

## 8. SD-008: Đặt tour du lịch

```
STARUML SEQUENCE DIAGRAM: "SD-008_DatTour"

KÍCH THƯỚC: W2400 x H900, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Chi tiết Tour]
[Entity: Bộ xử lý Đặt Tour]
[Entity: Cơ sở dữ liệu]
[Entity: Email Service]

SEQUENCE:
1. User -> [Trang Chi tiết Tour]: Xem chi tiết tour
2. User -> [Trang Chi tiết Tour]: Chọn ngày khởi hành và số lượng khách
3. [Trang Chi tiết Tour] -> [Bộ xử lý Đặt Tour]: Kiểm tra số chỗ còn lại
4. [Bộ xử lý Đặt Tour] -> [Cơ sở dữ liệu]: Query số chỗ ngày đã chọn
5. [Cơ sở dữ liệu] -> [Bộ xử lý Đặt Tour]: Trả về số chỗ còn

ALT BRANCH (không đủ chỗ):
6. [Bộ xử lý Đặt Tour] -> [Trang Chi tiết Tour]: Thông báo "Số chỗ không đủ"
7. [Trang Chi tiết Tour] -> [Actor: User]: Hiển thị thông báo

MAIN FLOW (đủ chỗ):
6. [Bộ xử lý Đặt Tour] -> [Trang Chi tiết Tour]: Cho phép đặt
7. User -> [Trang Chi tiết Tour]: Điền thông tin (họ tên, email, điện thoại, ghi chú)
8. User -> [Trang Chi tiết Tour]: Nhấn "Xác nhận đặt tour"
9. [Trang Chi tiết Tour] -> [Bộ xử lý Đặt Tour]: Gửi thông tin đặt tour
10. [Bộ xử lý Đặt Tour] -> [Bộ xử lý Đặt Tour]: Validate dữ liệu
11. [Bộ xử lý Đặt Tour] -> [Cơ sở dữ liệu]: Tạo booking (status=pending)
12. [Cơ sở dữ liệu] -> [Bộ xử lý Đặt Tour]: Xác nhận tạo
13. [Bộ xử lý Đặt Tour] -> [Email Service]: Gửi email xác nhận
14. [Email Service] -> [Actor: User]: Email xác nhận đặt tour
15. [Bộ xử lý Đặt Tour] -> [Trang Chi tiết Tour]: Thông báo thành công
16. [Trang Chi tiết Tour] -> [Actor: User]: Hiển thị "Đặt tour thành công"
```

---

## 9. SD-009: Bình luận bài viết

```
STARUML SEQUENCE DIAGRAM: "SD-009_BinhLuanBaiViet"

KÍCH THƯỚC: W2200 x H700, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Chi tiết Bài viết]
[Entity: Bộ xử lý Bình luận]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Chi tiết Bài viết]: Xem bài viết
2. User -> [Trang Chi tiết Bài viết]: Cuộn xuống phần bình luận
3. User -> [Trang Chi tiết Bài viết]: Nhập nội dung bình luận
4. User -> [Trang Chi tiết Bài viết]: Nhấn "Gửi bình luận"
5. [Trang Chi tiết Bài viết] -> [Bộ xử lý Bình luận]: Gửi bình luận + userId
6. [Bộ xử lý Bình luận] -> [Bộ xử lý Bình luận]: Kiểm tra đăng nhập

ALT BRANCH (chưa đăng nhập):
7. [Bộ xử lý Bình luận] -> [Trang Chi tiết Bài viết]: Thông báo "Đăng nhập để bình luận"
8. [Trang Chi tiết Bài viết] -> [Actor: User]: Chuyển hướng đăng nhập

MAIN FLOW (đã đăng nhập):
7. [Bộ xử lý Bình luận] -> [Bộ xử lý Bình luận]: Validate (nội dung không rỗng, <=1000 ký tự)
8. [Bộ xử lý Bình luận] -> [Cơ sở dữ liệu]: Lưu bình luận
9. [Cơ sở dữ liệu] -> [Bộ xử lý Bình luận]: Xác nhận
10. [Bộ xử lý Bình luận] -> [Trang Chi tiết Bài viết]: Trả về bình luận mới
11. [Trang Chi tiết Bài viết] -> [Actor: User]: Hiển thị bình luận mới
```

---

## 10. SD-010: Lưu địa điểm yêu thích

```
STARUML SEQUENCE DIAGRAM: "SD-010_YeuThich"

KÍCH THƯỚC: W2000 x H700, font 14pt
MÀU SẮC: Chỉ đen trắng

ACTOR / LIFELINE:
[Actor: User]
[Boundary: Trang Chi tiết Địa điểm]
[Entity: Bộ xử lý Favorites]
[Entity: Cơ sở dữ liệu]

SEQUENCE:
1. User -> [Trang Chi tiết Địa điểm]: Xem chi tiết địa điểm
2. User -> [Trang Chi tiết Địa điểm]: Nhấn nút trái tim (yêu thích)
3. [Trang Chi tiết Địa điểm] -> [Bộ xử lý Favorites]: Gửi yêu cầu (userId, destinationId)
4. [Bộ xử lý Favorites] -> [Bộ xử lý Favorites]: Kiểm tra đăng nhập

ALT BRANCH (chưa đăng nhập):
5. [Bộ xử lý Favorites] -> [Trang Chi tiết Địa điểm]: Chuyển hướng đăng nhập
6. [Trang Chi tiết Địa điểm] -> [Actor: User]: Hiển thị trang đăng nhập

MAIN FLOW (đã đăng nhập):
5. [Bộ xử lý Favorites] -> [Cơ sở dữ liệu]: Kiểm tra đã yêu thích chưa
6. [Cơ sở dữ liệu] -> [Bộ xử lý Favorites]: Kết quả

ALT BRANCH (chưa yêu thích):
7. [Bộ xử lý Favorites] -> [Cơ sở dữ liệu]: Thêm vào favorites
8. [Cơ sở dữ liệu] -> [Bộ xử lý Favorites]: Xác nhận
9. [Bộ xử lý Favorites] -> [Trang Chi tiết Địa điểm]: Trả về thành công
10. [Trang Chi tiết Địa điểm] -> [Actor: User]: Cập nhật icon trái tim (filled)

ALT BRANCH (đã yêu thích):
7. [Bộ xử lý Favorites] -> [Cơ sở dữ liệu]: Xóa khỏi favorites
8. [Cơ sở dữ liệu] -> [Bộ xử lý Favorites]: Xác nhận
9. [Bộ xử lý Favorites] -> [Trang Chi tiết Địa điểm]: Trả về thành công
10. [Trang Chi tiết Địa điểm] -> [Actor: User]: Cập nhật icon trái tim (outline)
```

---

## Hướng dẫn sử dụng MCP cho StarUML

Để tạo biểu đồ trong StarUML qua MCP, sử dụng lệnh sau:

```
/mdgen staruml.createSequenceDiagram {
  "diagramName": "Tên biểu đồ",
  "actors": [...],
  "lifelines": [...],
  "messages": [...],
  "altBranches": [...]
}
```

Hoặc tạo thủ công trong StarUML với các thiết lập:
- **Kích thước canvas:** W2200 x H800 trở lên
- **Font chữ:** 14pt, Arial hoặc Times New Roman
- **Màu sắc:** Chỉ đen trắng (Black #000000, White #FFFFFF)
- **Lifeline:** Đường gạch dọc, đầu mũi tên cho messages
- **Actor:** Hình người ở trên cùng
- **Boundary:** Hình chữ nhật bo góc
- **Entity:** Hình chữ nhật có gạch đầu
- **Self-call:** Vòng lặp trên chính lifeline đó
- **ALT/OPT/LOOP:** Khối combined fragment
- **Messages:** Mũi tên nét liền (synchronous), nét đứt (asynchronous)
