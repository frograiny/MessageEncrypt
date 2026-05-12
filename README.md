<div align="center">
  <img src="https://raw.githubusercontent.com/frograiny/MessageEncrypt/main/src/icons/icon-128.png" width="128" alt="Message Encrypt Logo">
  <h1>🔐 Message Encrypt</h1>
  <p><em>Tiện ích mã hóa tin nhắn nội bộ dành riêng cho Facebook Messenger</em></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Version: 1.1.0](https://img.shields.io/badge/Version-1.1.0-success.svg)](#)
  [![Browser](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-orange.svg)](#)
</div>

<hr>

## 🛡️ Giới thiệu (Overview)

**Message Encrypt** là một tiện ích mở rộng (extension) trên trình duyệt giúp bạn bảo vệ nội dung các cuộc hội thoại nhạy cảm trên Facebook Messenger. Bằng cách mã hóa ngay tại trình duyệt (client-side encryption), tiện ích đảm bảo rằng chỉ những người có chung Mật khẩu (Passphrase) mới có thể đọc được tin nhắn. 

Bất kỳ ai nhìn vào màn hình, hoặc thậm chí là quản trị viên hệ thống mạng, cũng chỉ thấy những đoạn mã Base64 vô nghĩa.

---

## ✨ Các Tính Năng Nổi Bật (Key Features)

- 🔒 **Mã Hóa Tức Thì:** Sử dụng tổ hợp phím `Ctrl + Shift + E` (`Cmd + Shift + E` trên Mac) để biến đoạn text bạn vừa gõ thành chuỗi mã hóa an toàn trước khi gửi.
- 🖱️ **Giải Mã Thông Minh (Highlight to Decrypt):** Không cần nút bấm rườm rà. Chỉ cần **bôi đen** đoạn tin nhắn đã mã hóa, hệ thống sẽ tự động giải mã và hiển thị một Popup nổi (Floating UI) ngay trên đoạn text đó. Popup sẽ tự động biến mất khi bạn bỏ bôi đen.
- 🇻🇳 **Hỗ Trợ Tiếng Việt & Emoji Hoàn Hảo:** Thuật toán mã hóa đã được tối ưu (`encodeURIComponent`) để xử lý mượt mà tiếng Việt có dấu, ký tự đặc biệt, và cả Emoji mà không gặp bất kỳ lỗi định dạng nào.
- 👻 **Shadow DOM UI:** Giao diện giải mã được cách ly hoàn toàn bằng Shadow DOM (Closed mode), ngăn chặn xung đột giao diện với CSS phức tạp của Facebook.
- ⚙️ **Bypass Chặn Sự Kiện của Messenger:** Thay vì phụ thuộc vào các event DOM dễ bị Facebook vô hiệu hóa, tiện ích sử dụng cơ chế Polling tối ưu để phát hiện vùng chọn, đảm bảo hoạt động mượt mà và ổn định qua mọi bản cập nhật giao diện của Messenger.
- ⚡ **Zero-Tracking:** Dữ liệu và mật khẩu của bạn chỉ được lưu cục bộ trên trình duyệt thông qua `chrome.storage.local`.

---

## 🚀 Hướng Dẫn Cài Đặt (Installation)

### Bước 1: Tải mã nguồn
Mở terminal và clone dự án về máy tính của bạn:
```bash
git clone https://github.com/frograiny/MessageEncrypt.git
```

### Bước 2: Cài đặt lên trình duyệt (Chrome / Edge / Brave)
1. Truy cập vào trang quản lý tiện ích: `chrome://extensions/` (hoặc `edge://extensions/`).
2. Bật chế độ **Developer mode (Chế độ dành cho nhà phát triển)** ở góc trên cùng.
3. Nhấp vào nút **Load unpacked (Tải tiện ích đã giải nén)**.
4. Chọn thư mục `MessageEncrypt` vừa tải về.

---

## 📖 Hướng Dẫn Sử Dụng (Usage)

### 1. Thiết lập Mật khẩu (Passphrase)
Để hai người có thể giải mã tin nhắn của nhau, cả hai cần thống nhất một mật khẩu chung.
1. Click vào biểu tượng 🔐 của extension trên thanh công cụ của trình duyệt.
2. Nhập mật khẩu chung (Ví dụ: `SuperSecret10`).
3. Bấm **"💾 Lưu mật khẩu"**.

### 2. Gửi Tin Nhắn Mã Hóa
1. Gõ tin nhắn bạn muốn gửi vào khung chat Messenger.
2. Bấm tổ hợp phím **`Ctrl + Shift + E`**.
3. Đoạn chữ của bạn sẽ tự động biến thành một chuỗi mã hóa (VD: `XRV0ARRycBVw...`).
4. Bấm **Enter** để gửi tin nhắn.

### 3. Đọc Tin Nhắn Mã Hóa
Khi nhận được đoạn tin nhắn mã hóa từ bạn bè:
1. Dùng chuột **bôi đen (highlight)** đoạn mã đó trên Messenger.
2. Một Popup chứa nội dung đã giải mã sẽ hiển thị ngay lập tức phía trên.
3. Click chuột ra ngoài để bỏ bôi đen, Popup sẽ tự động tắt đi.

---

## 🛠️ Công Cụ Hỗ Trợ (Popup Tool)

Nếu bạn không muốn dùng phím tắt, extension cũng cung cấp một giao diện mã hóa thủ công:
1. Click vào biểu tượng extension.
2. Gõ nội dung vào mục **"Công cụ mã hóa nhanh"**.
3. Nhấn **Mã hóa**, sau đó nhấn **Copy** và dán tay vào Messenger.

---

## 🔐 Cơ Chế Hoạt Động (Architecture)

- **Core Algorithm:** XOR Cipher kết hợp Base64 Encoding. Toàn bộ input (Passphrase và Text) đều được chuẩn hóa qua `encodeURIComponent` để tránh lỗi out-of-range character (Latin1) khi dùng hàm `btoa` của trình duyệt.
- **Selection Detection:** Sử dụng `setInterval` polling (300ms) kết hợp với `window.getSelection()`. Phương pháp này hoàn toàn bypass mọi cơ chế `stopPropagation` hay Event Canceling của React trên nền tảng Messenger.

---

## 📄 Giấy phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Vui lòng xem file `LICENSE` (nếu có) để biết thêm chi tiết.

<div align="center">
  <p><b>Made with 💜 for privacy lovers</b></p>
</div>
