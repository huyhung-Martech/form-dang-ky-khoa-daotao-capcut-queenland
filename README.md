# Khóa Đào Tạo: Xây Dựng Kênh TikTok BĐS 2026 | Queen Land

Hệ thống Landing Page Đăng Ký và Bảng Quản Trị Thống Kê Ghi Danh Khóa Đào Tạo Nội Bộ **"Xây Dựng Kênh TikTok BĐS – Từ Con Số 0"** dành riêng cho chiến binh Sales Công ty Cổ phần Tập đoàn Queen Land.

---

## 🌟 Tính Năng Nổi Bật

### 1. Trang Đăng Ký Học Viên (`index.html`)
* **Giao diện hiện đại & tươi sáng:** Sử dụng font chữ cao cấp **Google Sans Flex**, thiết kế chuẩn Mobile-First (tối ưu mật độ hiển thị và tốc độ lướt trên điện thoại).
* **Lộ trình 3 buổi thực chiến:**
  * **Buổi 1:** *Giọng Nói Triệu Đô & Kịch Bản Giữ Chân* (Luyện hơi bụng, nhả chữ, ngữ điệu Hook, AI viết kịch bản BĐS & gom tài nguyên số).
  * **Buổi 2:** *Làm Chủ Ống Kính – Thần Thái Chuyên Gia* (Phong thái diễn, quay điện thoại, AE/AF Lock, Ninja Walk, bấm máy thực tế).
  * **Buổi 3:** *Phù Thủy CapCut – Bật Kênh Ra Deal* (Jump cut, Auto Sub, chèn B-roll, ảnh bìa Canva, xuất bản TikTok kéo khách).
* **Lịch học & 2 Địa điểm đào tạo (Ca Sáng):**
  * *Đợt 1:* Trụ sở 35 Lê Văn Lương (Thanh Xuân, Hà Nội) [15/09 - 22/09].
  * *Đợt 2:* Tòa TechnoPark Tower (Vinhomes Ocean Park) [23/09 - 30/09].
* **Form ghi danh tiện lợi:** Cho phép tự nhập tên Khối/Đội nhóm kinh doanh tự do, kiểm tra số điện thoại chuẩn Việt Nam và cấp Mã ghi danh tự động.

### 2. Trang Quản Trị Riêng Tư (`admin.html`)
* **Bảo mật mã PIN:** Mặc định `2026` (chỉ Ban Tổ Chức & Phòng MKT mới truy cập được).
* **Bảng thống kê Real-time:** 
  * 4 thẻ chỉ số: Tổng học viên, Cơ sở TechnoPark, Cơ sở 35 Lê Văn Lương, Đội nhóm dẫn đầu (TOP 1).
  * Biểu đồ tỷ lệ % tiến độ đăng ký theo từng khối kinh doanh.
  * Bảng danh sách chi tiết có bộ lọc theo cơ sở và tìm kiếm theo tên/SĐT.
* **Xuất báo cáo Excel:** Nút *"Xuất File Excel (.xlsx / .csv)"* tải file trực tiếp về máy tính có dấu tiếng Việt đầy đủ (UTF-8 BOM).

### 3. Tự Động Đồng Bộ Google Sheets
* Tích hợp Webhook Apps Script đẩy dữ liệu tự động về file Google Sheet của bạn ngay khi học viên bấm nút đăng ký (Xem hướng dẫn chi tiết tại `HUONG_DAN_KET_NOI_GOOGLE_SHEET.md`).

---

## 📁 Cấu Trúc Thư Mục

```text
├── index.html                           # Trang đăng ký học viên (Public)
├── admin.html                           # Trang quản trị & thống kê (Bảo mật mã PIN)
├── style.css                            # CSS thiết kế tươi sáng, chuẩn Google Sans Flex
├── app.js                               # Logic xử lý dữ liệu, biểu đồ, xuất Excel & sync Google Sheet
├── HUONG_DAN_KET_NOI_GOOGLE_SHEET.md    # Hướng dẫn kết nối tự động với Google Sheets
└── README.md                            # Tài liệu giới thiệu dự án
```

---

## 🚀 Cách Triển Khai Miễn Phí Lên GitHub Pages
1. Vào repository trên GitHub $\rightarrow$ **Settings** $\rightarrow$ **Pages**.
2. Tại mục **Build and deployment** $\rightarrow$ **Branch**, chọn nhánh `main` và thư mục `/(root)`.
3. Bấm **Save**. Sau 1 phút, bạn sẽ có đường link web trực tuyến dạng:  
   `https://huyhung-martech.github.io/form-dang-ky-khoa-daotao-capcut-queenland/`  
   để gửi ngay vào nhóm Zalo nội bộ cho toàn thể nhân sự đăng ký!

---
© 2026 Queen Land Real Estate. Bản quyền thuộc Ban Đào Tạo Nội Bộ - Phòng Marketing.
