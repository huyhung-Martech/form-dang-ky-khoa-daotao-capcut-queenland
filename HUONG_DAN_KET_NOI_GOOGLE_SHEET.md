# HƯỚNG DẪN KẾT NỐI FORM ĐĂNG KÝ VỚI GOOGLE SHEETS

Chỉ với 3 bước đơn giản (mất khoảng 2 phút), mỗi khi học viên bấm đăng ký trên website, dữ liệu sẽ tự động nhảy về file Google Sheet của bạn ngay lập tức.

---

### BƯỚC 1: TẠO FILE GOOGLE SHEET MỚI
1. Mở trình duyệt, vào [Google Sheets (docs.google.com/spreadsheets)](https://docs.google.com/spreadsheets) và tạo một trang tính mới.
2. Đặt tên file: `Danh Sách Đăng Ký Khóa Học TikTok 2026 - Queen Land`.
3. Đổi tên sheet thành `DangKy` và đặt hàng tiêu đề tại Dòng 1:
   * **Cột A:** Mã Ghi Danh
   * **Cột B:** Họ và Tên
   * **Cột C:** Số Điện Thoại *(Khóa định danh chính)*
   * **Cột D:** Đội Nhóm / Khối Kinh Doanh
   * **Cột E:** Địa Điểm Đào Tạo
   * **Cột F:** Link TikTok
   * **Cột G:** Kỳ Vọng / Mục Tiêu
   * **Cột H:** Thời Gian Đăng Ký
   * **Cột I:** Trạng Thái Nộp Video *(Tự động đối soát bằng SĐT)*

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
    // Cột I đặt sẵn công thức kiểm tra trạng thái nộp theo SĐT (Cột C)
    var nextRow = sheet.getLastRow() + 1;
    var formulaNop = '=IF(C' + nextRow + '="","", IF(COUNTIF(NopBai!B:B, C' + nextRow + ')>0, "✅ ĐÃ NỘP", "⏳ CHƯA NỘP"))';

    sheet.appendRow([
      data.id || '',
      data.fullName || '',
      "'" + (data.phoneNumber || ''), // Thêm dấu nháy để giữ số 0 đầu
      data.team || '',
      data.venue || '',
      data.tiktokLink || '',
      data.goal || '',
      data.timestamp || new Date().toLocaleString("vi-VN"),
      formulaNop // Cột I tự động tính toán trạng thái nộp
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

### BƯỚC 5: CÀI ĐẶT ĐỐI SOÁT NỘP VIDEO TỰ ĐỘNG BẰNG SỐ ĐIỆN THOẠI (Dành cho 150 - 200 người)
1. **Tạo Sheet thứ 2 tên là `NopBai`:**
   * Khi bạn tạo Google Form cho học viên nộp video (có câu hỏi: **Số điện thoại** và **Tải tệp lên**), chọn lưu câu trả lời vào chính file Google Sheet này. Đổi tên tab đó thành `NopBai`.
   * Cột B trong tab `NopBai` sẽ là **Số điện thoại** học viên điền khi nộp.
2. **Công thức tại Cột I (Sheet `DangKy`):**
   * Tại ô `I2`, dán công thức sau rồi kéo xuống toàn bộ cột:
     ```excel
     =IF(C2="","", IF(COUNTIF(NopBai!B:B, C2) > 0, "✅ ĐÃ NỘP", "⏳ CHƯA NỘP"))
     ```
3. **Định dạng màu tự động (Conditional Formatting):**
   * Chọn toàn bộ Cột I $\rightarrow$ Bấm menu **Định dạng (Format)** $\rightarrow$ **Định dạng có điều kiện (Conditional formatting)**.
   * Quy tắc 1: Văn bản chứa `ĐÃ NỘP` $\rightarrow$ Tô nền xanh lá nhạt (`#DCFCE7`), chữ xanh đậm.
   * Quy tắc 2: Văn bản chứa `CHƯA NỘP` $\rightarrow$ Tô nền đỏ nhạt (`#FEF2F2`), chữ đỏ đậm.
4. **Lọc người chưa nộp trên hội trường:**
   * Bấm nút Tạo bộ lọc (Filter icon) $\rightarrow$ Tại Cột I chọn chỉ hiện `⏳ CHƯA NỘP`.
   * Lập tức hiện ra danh sách những nhân sự chưa nộp bài để giảng viên/MC nhắc nhở đích danh!
