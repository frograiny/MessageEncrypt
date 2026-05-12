<div align="center">
  <img src="https://raw.githubusercontent.com/frograiny/MessageEncrypt/main/src/icons/icon-128.png" width="128" alt="Message Encrypt Logo">
  <h1>🔐 Message Encrypt Extension</h1>
  <p><em>Secure your Messenger & Facebook conversations with client-side encryption</em></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-success.svg)](#)
  [![Browser](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-orange.svg)](#)
</div>

<hr>

## 🛡️ Giới thiệu (Overview)

**Message Encrypt** là một tiện ích mở rộng (extension) cho Chrome/Edge giúp bạn bảo vệ sự riêng tư của tin nhắn trên nền tảng Messenger. Extension áp dụng mã hóa ngay trên trình duyệt của bạn (client-side encryption), đảm bảo rằng không ai (ngay cả quản trị viên hệ thống mạng) có thể đọc được nội dung tin nhắn nếu không có chung Passphrase.

---

## ✨ Tính năng nổi bật (Features)

- 🔒 **Mã hóa Client-side:** Tin nhắn được mã hóa thành các chuỗi ký tự an toàn trước khi rời khỏi trình duyệt.
- 🖱️ **Giải mã thông minh:** Tự động giải mã và hiển thị nội dung gốc thông qua `tooltip` khi di chuột (hover) vào tin nhắn đã mã hóa.
- ⌨️ **Phím tắt nhanh:** Sử dụng tổ hợp phím `Ctrl + Shift + E` (`Cmd + Shift + E` trên Mac) để mã hóa nội dung ngay trong khung chat.
- 🔑 **Passphrase đồng bộ:** Sử dụng chung một mật khẩu (Passphrase) cho cả nhóm để đảm bảo tính thống nhất và tiện lợi.
- 📝 **Tự động nhận diện (Mới!):** Hỗ trợ giải mã bằng cách bôi đen văn bản ngay cả khi tin nhắn bị mất định dạng biểu tượng bảo mật.
- ⚡ **Nhẹ & Nhanh:** Không lưu trữ dữ liệu người dùng lên server bên ngoài, đảm bảo an toàn tuyệt đối.

---

## 🚀 Hướng dẫn cài đặt (Installation)

### 1. Tải mã nguồn
Clone dự án từ GitHub hoặc tải file `.zip` và giải nén:
```bash
git clone https://github.com/frograiny/MessageEncrypt.git
cd MessageEncrypt
```

### 2. Cài đặt trên trình duyệt

**Google Chrome / Brave:**
1. Mở trình duyệt và truy cập: `chrome://extensions/`
2. Bật chế độ **Developer mode (Chế độ dành cho nhà phát triển)** ở góc trên bên phải.
3. Nhấp vào nút **Load unpacked (Tải tiện ích đã giải nén)**.
4. Chọn thư mục `MessageEncrypt` vừa tải về.

**Microsoft Edge:**
1. Truy cập: `edge://extensions/`
2. Bật **Developer mode** ở thanh menu bên trái.
3. Chọn **Load unpacked** và trỏ đến thư mục `MessageEncrypt`.

---

## 📖 Hướng dẫn sử dụng (Usage)

### Bước 1: Thiết lập Mật khẩu (Passphrase)
1. Click vào biểu tượng 🔐 của extension trên thanh công cụ trình duyệt.
2. Nhập mật khẩu chung bạn muốn sử dụng cùng bạn bè (VD: `SuperSecret123`).
3. Nhấp **"💾 Lưu mật khẩu"**. *(Tất cả người tham gia cuộc trò chuyện đều phải lưu cùng một mật khẩu này).*

### Bước 2: Mã hóa & Gửi tin nhắn
1. Gõ tin nhắn vào khung chat Messenger như bình thường.
2. **Cách 1:** Click vào nút 🔐 xuất hiện cạnh nút gửi (Send).
3. **Cách 2:** Bấm tổ hợp phím `Ctrl + Shift + E`.
4. Tin nhắn của bạn sẽ tự động chuyển thành chuỗi mã hóa an toàn.
5. Nhấn "Gửi" để truyền tin nhắn đi.

### Bước 3: Xem và Giải mã
- **Tự động (Hover):** Đưa con trỏ chuột (hover) vào đoạn tin nhắn mã hóa (có biểu tượng 🔐), một tooltip sẽ hiện lên chứa nội dung gốc.
- **Thủ công (Highlight):** Nếu tin nhắn bị mất biểu tượng ổ khóa, chỉ cần **bôi đen (highlight)** đoạn mã Base64, extension sẽ tự động giải mã, copy vào khay nhớ tạm (Clipboard) và hiển thị thông báo.

---

## 🛠️ Công cụ tiện ích (Utility Tool)

Nếu bạn không muốn sử dụng phím tắt hoặc tính năng tự động tích hợp, extension cung cấp một bảng điều khiển mã hóa trực tiếp:
1. Mở popup extension 🔐.
2. Dán/nhập văn bản cần xử lý vào ô **"📝 Công cụ mã hóa nhanh"**.
3. Nhấn nút **Mã hóa**, sau đó dùng nút **📋 Copy** để dán tay vào Messenger.

---

## 🔐 Cơ chế bảo mật (Security Architecture)

- **Thuật toán:** Sử dụng XOR cipher kết hợp Base64 encoding. Tuy không phải chuẩn mã hóa quân sự (như AES-256), nhưng hoàn toàn đủ mạnh mẽ để chống lại các công cụ quét tự động và quản trị viên xem trộm ở cấp độ ứng dụng.
- **Lưu trữ:** Passphrase được lưu an toàn tại `chrome.storage.local` - Không có bất kỳ dữ liệu nào được truyền ra ngoài thiết bị của bạn.
- **Quyền hạn:** Extension chỉ yêu cầu quyền truy cập vào `facebook.com` và `messenger.com` để xử lý DOM elements, không đọc dữ liệu từ các trang web khác.

---

## 🤝 Đóng góp (Contributing)

Dự án này là mã nguồn mở. Chúng tôi hoan nghênh mọi đóng góp để làm cho extension tốt hơn!
1. Fork dự án
2. Tạo Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên Branch (`git push origin feature/AmazingFeature`)
5. Mở một Pull Request

---

## 📄 Giấy phép (License)

Phân phối dưới giấy phép **MIT License**. Vui lòng xem file `LICENSE` (nếu có) để biết thêm chi tiết.

<div align="center">
  <p><b>Made with 💜 for privacy lovers</b></p>
</div>
