# HƯỚNG DẪN KẾT NỐI FORM ĐĂNG KÝ VỚI GOOGLE SHEETS

Chỉ với 3 bước đơn giản (mất khoảng 2 phút), mỗi khi học viên bấm đăng ký trên website, dữ liệu sẽ tự động nhảy về file Google Sheet của bạn ngay lập tức.

---

### BƯỚC 1: TẠO FILE GOOGLE SHEET MỚI
1. Mở trình duyệt, vào [Google Sheets (docs.google.com/spreadsheets)](https://docs.google.com/spreadsheets) và tạo một trang tính mới.
2. Đặt tên file: `Danh Sách Đăng Ký Khóa Học TikTok 2026 - Queen Land`.
3. Đổi tên sheet thành `DangKy` và đặt hàng tiêu đề tại Dòng 1:
   * **Cột A:** Mã Ghi Danh
   * **Cột B:** Họ và Tên
   * **Cột C:** Số Điện Thoại
   * **Cột D:** Đội Nhóm / Khối Kinh Doanh
   * **Cột E:** Cơ Sở Học
   * **Cột F:** Link TikTok
   * **Cột G:** Kỳ Vọng / Mục Tiêu
   * **Cột H:** Thời Gian Đăng Ký

---

### BƯỚC 2: DÁN ĐOẠN CODE APPS SCRIPT
1. Trên thanh menu của Google Sheet, bấm vào **Tiện ích mở rộng** (Extensions) $\rightarrow$ **Apps Script**.
2. Xóa toàn bộ code mặc định có sẵn, và **dán toàn bộ đoạn code dưới đây vào**:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DangKy");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Thêm một dòng mới với dữ liệu học viên vừa gửi
    sheet.appendRow([
      data.id || '',
      data.fullName || '',
      "'" + (data.phoneNumber || ''), // Thêm dấu nháy để giữ số 0 đầu
      data.team || '',
      data.venue || '',
      data.tiktokLink || '',
      data.goal || '',
      data.timestamp || new Date().toLocaleString("vi-VN")
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Bấm biểu tượng **Lưu (Save / Ctrl + S)**.

---

### BƯỚC 3: TRIỂN KHAI THÀNH WEB APP & LẤY URL
1. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Tại mục "Chọn loại", bấm icon bánh răng $\rightarrow$ Chọn **Ứng dụng web (Web app)**.
3. Điền thông tin cấu hình:
   * **Mô tả:** `Webhook nhận form đăng ký TikTok`
   * **Thực thi dưới dạng (Execute as):** `Tôi (Email của bạn)`
   * **Người có quyền truy cập (Who has access):** **`Bất kỳ ai (Anyone)`** *(Bắt buộc chọn cái này để web gửi được dữ liệu về mà không bị lỗi cấp quyền)*.
4. Bấm nút **Triển khai (Deploy)**.
5. Cấp quyền truy cập Google Account nếu được hỏi (bấm *Advanced* $\rightarrow$ *Go to Project (unsafe)* $\rightarrow$ *Allow*).
6. Copy đường link **URL ứng dụng web** (có dạng `https://script.google.com/macros/s/AKfycb.../exec`).

---

### BƯỚC 4: GẮN URL VÀO WEB APP
Mở file `app.js` trong thư mục web app, tìm dòng thứ 12:
```javascript
const GOOGLE_SHEETS_WEBHOOK_URL = "DÁN_URL_CỦA_BẠN_VÀO_ĐÂY";
```
Bấm lưu lại là xong! Giờ đây mỗi khi có ai đăng ký trên web, một dòng mới sẽ tự động nhảy vào Google Sheet của bạn ngay tức thì.

---

### 💡 MẸO TẠO BIỂU ĐỒ & BÁO CÁO TRÊN GOOGLE SHEETS
1. **Biểu đồ tỷ lệ đội nhóm:** Bôi đen Cột D (Đội Nhóm) $\rightarrow$ Bấm **Chèn** $\rightarrow$ **Biểu đồ** $\rightarrow$ Chọn Biểu đồ tròn (Pie Chart) hoặc Biểu đồ cột.
2. **Biểu đồ tỷ lệ cơ sở học:** Bôi đen Cột E (Cơ Sở Học) $\rightarrow$ Bấm **Chèn** $\rightarrow$ **Biểu đồ**.
Google Sheet sẽ tự động đếm số lượng người tham gia theo từng khối và vẽ đồ thị chuyên nghiệp, đẹp mắt cho bạn báo cáo!
