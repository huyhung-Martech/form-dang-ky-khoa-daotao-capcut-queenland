# HƯỚNG DẪN KẾT NỐI FORM ĐĂNG KÝ & FORM PHẢN HỒI VỚI GOOGLE SHEETS

Hệ thống đã được nâng cấp hỗ trợ **đồng thời cả 2 luồng dữ liệu** đổ về cùng 1 file Google Sheet duy nhất:
1. **Tab `DangKy`**: Chứa danh sách học viên đăng ký tham gia khóa đào tạo và đối soát nộp video.
2. **Tab `PhanHoi`**: Chứa toàn bộ câu trả lời, mức độ tự tin, vướng mắc và câu hỏi ẩn danh sau buổi học.

---

### BƯỚC 1: CHUẨN BỊ FILE GOOGLE SHEET
1. Mở trình duyệt, vào [Google Sheets (docs.google.com/spreadsheets)](https://docs.google.com/spreadsheets) và mở file của bạn (hoặc tạo file mới đặt tên: `Quan_Ly_Dao_Tao_TikTok_QueenLand_2026`).
2. Đổi tên sheet đầu tiên thành **`DangKy`** và đặt hàng tiêu đề tại Dòng 1:
   * **Cột A:** Mã Ghi Danh
   * **Cột B:** Họ và Tên
   * **Cột C:** Số Điện Thoại *(Khóa định danh chính)*
   * **Cột D:** Khối Kinh Doanh
   * **Cột E:** Phòng Kinh Doanh
   * **Cột F:** Link TikTok
   * **Cột G:** Kỳ Vọng / Mục Tiêu
   * **Cột H:** Thời Gian Đăng Ký
   * **Cột I:** Trạng Thái Nộp Video *(Tự động đối soát bằng SĐT)*

*(Lưu ý: Sheet `PhanHoi` hệ thống sẽ **tự động khởi tạo và điền sẵn tiêu đề** ngay khi có người đầu tiên gửi phản hồi, bạn không cần phải tự tạo bằng tay!)*

---

### BƯỚC 2: DÁN ĐOẠN CODE APPS SCRIPT ĐA NĂNG
1. Trên thanh menu của Google Sheet, bấm vào **Tiện ích mở rộng** (Extensions) $\rightarrow$ **Apps Script**.
2. Xóa toàn bộ code cũ có sẵn, và **sao chép toàn bộ đoạn code dưới đây dán vào**:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // ==========================================
    // LUỒNG 1: DỮ LIỆU PHẢN HỒI SAU BUỔI HỌC
    // ==========================================
    if (data.action === "feedback" || data.type === "feedback") {
      var fbSheet = ss.getSheetByName("PhanHoi");
      // Tự động tạo tab PhanHoi và dòng tiêu đề nếu chưa có
      if (!fbSheet) {
        fbSheet = ss.insertSheet("PhanHoi");
        fbSheet.appendRow([
          "Thời Gian Gửi",
          "Mức Tự Tin (Thang 1-5)",
          "Bước Khó Áp Dụng Nhất",
          "Tiến Độ Video",
          "Ưu Tiên Buổi Tiếp Theo",
          "Dự Án Mẫu Đề Xuất",
          "Hộp Thư Kín (Thắc Mắc Chưa Rõ)",
          "Họ và Tên",
          "Số Điện Thoại",
          "Khối Kinh Doanh",
          "Phòng Kinh Doanh"
        ]);
        fbSheet.setFrozenRows(1);
        fbSheet.getRange("A1:K1").setBackground("#F1F5F9").setFontWeight("bold");
      }
      
      fbSheet.appendRow([
        data.timestamp || new Date().toLocaleString("vi-VN"),
        data.confidenceScale || '',
        data.hardestSteps || '',
        data.videoProgress || '',
        data.nextPriorities || '',
        data.sampleProject || '',
        data.anonymousQuestion || '',
        data.fullName || 'Ẩn danh',
        data.phoneNumber ? "'" + data.phoneNumber : '',
        data.division || (data.team ? data.team.split('-')[0].trim() : ''),
        data.department || (data.team && data.team.includes('-') ? data.team.split('-')[1].trim() : '')
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({ "status": "success", "type": "feedback" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==========================================
    // LUỒNG 2: DỮ LIỆU ĐĂNG KÝ THAM GIA KHÓA HỌC
    // ==========================================
    var sheet = ss.getSheetByName("DangKy");
    if (!sheet) {
      sheet = ss.getActiveSheet();
    }
    
    var nextRow = sheet.getLastRow() + 1;
    // Cột I đặt công thức tự động kiểm tra trạng thái nộp theo SĐT (Cột C)
    var formulaNop = '=IF(C' + nextRow + '="","", IF(COUNTIF(NopBai!B:B, C' + nextRow + ')>0, "✅ ĐÃ NỘP", "⏳ CHƯA NỘP"))';

    sheet.appendRow([
      data.id || '',
      data.fullName || '',
      "'" + (data.phoneNumber || ''), // Thêm dấu nháy để giữ số 0 đầu
      data.division || (data.team ? data.team.split('-')[0].trim() : ''),
      data.department || (data.team && data.team.includes('-') ? data.team.split('-')[1].trim() : ''),
      data.tiktokLink || '',
      data.goal || '',
      data.timestamp || new Date().toLocaleString("vi-VN"),
      formulaNop
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "type": "registration" }))
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

### BƯỚC 3: TRIỂN KHAI THÀNH WEB APP & LẤY URL WEBHOOK
1. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Quản lý tùy chọn triển khai (Manage deployments)** (hoặc *Tùy chọn triển khai mới* nếu làm lần đầu).
2. Nhấp vào biểu tượng chiếc bút chì ✏️ để chỉnh sửa:
   * **Phiên bản (Version):** Chọn **Phiên bản mới (New version)**.
   * **Thực thi dưới dạng (Execute as):** `Tôi (Email của bạn)`.
   * **Người có quyền truy cập (Who has access):** Chọn **`Bất kỳ ai (Anyone)`** *(Bắt buộc để web có thể gửi dữ liệu)*.
3. Bấm nút **Triển khai (Deploy)**.
4. Copy đường link **URL ứng dụng web** (có đuôi `/exec`).

---

### BƯỚC 4: GẮN URL VÀO WEB APP
Mở file `app.js` trong dự án web, tại dòng đầu tiên (dòng 12):
```javascript
const GOOGLE_SHEETS_WEBHOOK_URL = "DÁN_URL_WEB_APP_CỦA_BẠN_VÀO_ĐÂY";
```
Bấm lưu và đẩy code lên là xong! Cả form đăng ký và form phản hồi đều sẽ tự động đổ dữ liệu trực tiếp về Google Sheets của bạn.

---

### BƯỚC 5: ĐỐI SOÁT TỰ ĐỘNG BẰNG SỐ ĐIỆN THOẠI (Dành cho 150 - 200 học viên)
1. **Tạo sheet thứ 3 tên là `NopBai`:**
   * Kết nối Google Form nộp video buổi 1 / buổi 2 vào cùng file Google Sheet này. Đổi tên tab nhận kết quả thành `NopBai`.
   * Cột B trong tab `NopBai` sẽ là **Số điện thoại** học viên điền khi nộp.
2. **Công thức tại Cột I (Sheet `DangKy`):**
   * Đã được đoạn Apps Script tự động chèn vào cho từng người đăng ký mới.
3. **Định dạng màu tự động (Conditional Formatting):**
   * Chọn toàn bộ Cột I $\rightarrow$ Menu **Định dạng (Format)** $\rightarrow$ **Định dạng có điều kiện (Conditional formatting)**:
     * Chứa `ĐÃ NỘP` $\rightarrow$ Tô nền xanh lá nhạt (`#DCFCE7`).
     * Chứa `CHƯA NỘP` $\rightarrow$ Tô nền đỏ nhạt (`#FEF2F2`).
