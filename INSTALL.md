# 🚀 Hướng dẫn Cài đặt Extension

## ⚡ Cài đặt nhanh 5 phút

### Bước 1: Tải về extension
- Tải toàn bộ folder `MessageEncrypt` về máy của bạn
- Hoặc clone từ Git: `git clone <repo-url>`

### Bước 2: Mở trình duyệt (Chrome hoặc Edge)

#### 🔵 Nếu dùng Chrome:
1. Mở URL: `chrome://extensions/`
2. Bật công tắc "**Developer mode**" ở góc phải trên
3. Nhấn nút "**Load unpacked**"
4. Chọn thư mục `MessageEncrypt` (thư mục chứa `manifest.json`)
5. ✅ Xong! Extension sẽ hiện trong danh sách

#### 🔴 Nếu dùng Edge:
1. Mở URL: `edge://extensions/`
2. Bật công tắc "**Developer mode**" ở góc trái dưới
3. Nhấn nút "**Load unpacked**"
4. Chọn thư mục `MessageEncrypt`
5. ✅ Xong!

### Bước 3: Xác nhận cài đặt thành công
- Tìm biểu tượng 🔐 ở góc phải trên cùng
- Click vào nó → Thấy popup với cài đặt
- Nếu có lỗi, xem phần "Troubleshooting" dưới đây

## 🔧 Cài đặt cho tất cả mọi người trong nhóm

Hãy chia sẻ hướng dẫn trên với từng người trong nhóm. Mỗi người phải:
1. ✅ Cài extension theo các bước trên
2. ✅ Lưu **cùng một passphrase** (ví dụ: "group123456")
3. ✅ Refresh lại trang Messenger

## ❌ Troubleshooting

### Problem: "manifest.json not found"
**Giải pháp:**
- Đảm bảo bạn chọn đúng folder (folder chứa file `manifest.json`)
- Không chọn folder cha!
- Path phải là: `D:\c_thang\MessageEncrypt` (chứa manifest.json)

### Problem: "This extension cannot be added"
**Giải pháp:**
- Kiểm tra bạn đã bật Developer Mode chưa
- Thử xóa extension cũ đi rồi load lại

### Problem: Extension hiện nhưng không hoạt động trên Messenger
**Giải pháp:**
1. Vào `chrome://extensions`
2. Tìm "Message Encrypt"
3. Bật công tắc "Enabled" (nếu tắt)
4. Click "Details" → "Site permissions"
5. Cho phép truy cập `facebook.com` và `messenger.com`

### Problem: Biểu tượng 🔐 không hiện ở góc phải trên
**Giải pháp:**
1. Click icon menu (3 dấu chấm) góc phải trên
2. Click "Extensions"
3. Tìm "Message Encrypt" → Pin nó

### Problem: Nút mã hóa không hiện trong Messenger
**Giải pháp:**
1. Refresh trang Messenger (F5)
2. Đóng tab Messenger, mở lại
3. Nếu vẫn không, xem chrome://extensions → Details → "Errors"

## 📝 File Structure

```
MessageEncrypt/
├── manifest.json          ← Tệp chính (bắt buộc)
├── src/
│   ├── popup.html        ← UI popup
│   ├── popup.js          ← Logic popup
│   ├── content.js        ← Script mã hóa/giải mã
│   ├── crypto.js         ← Hàm encrypt/decrypt
│   ├── background.js     ← Service worker
│   ├── styles.css        ← Styling
│   ├── onboarding.html   ← Trang hướng dẫn
│   └── icons/            ← Icons (optional)
├── README.md             ← Hướng dẫn
└── INSTALL.md            ← File này
```

## ✅ Kiểm tra cài đặt

Sau khi cài, hãy test:

1. **Mở Messenger** - https://www.messenger.com
2. **Gõ tin nhắn test** - Ví dụ: "Hello World"
3. **Mở popup extension** - Click 🔐
4. **Lưu passphrase** - Nhập "test123", nhấn "Lưu"
5. **Quay lại Messenger** - Gõ tin nhắn
6. **Mã hóa** - Nhấn Ctrl+Shift+E
7. **Xem tin nhắn mã hóa** - Hover vào nó

✅ Nếu thấy tooltip với tin nhắn gốc → **Thành công!**

## 🎓 Hướng dẫn cho nhóm chat

Dùng text dưới để copy vào nhóm:

```
🔐 CẬP NHẬT: Chúng mình sẽ mã hóa tin nhắn từ giờ!

📱 Cách cài:
1. Vào chrome://extensions/ (hoặc edge://extensions/)
2. Bật Developer mode
3. Load unpacked → chọn folder MessageEncrypt
4. Click 🔐 ở góc phải → lưu passphrase: "KhôngLeakTinNhắn123"
5. Vào Messenger, gõ tin nhắn, nhấn Ctrl+Shift+E

📌 LƯU Ý: Tất cả phải dùng CÙNG passphrase!

💡 Xem tin nhắn: Hover chuột vào tin nhắn mã hóa
```

## 🚨 Lưu ý bảo mật

- **Passphrase phải mạnh** - Không dùng "123456" hay "password"
- **Giữ bí mật** - Không nói passphrase với admin nào cả!
- **Không screenshot passphrase** - Xóa lịch sử chat nếu bạo lộ

## 📞 Cần giúp?

Nếu có vấn đề:
1. Kiểm tra Console (F12 → Console tab) → Xem có lỗi không
2. Xem Chrome Extensions Documentation: https://developer.chrome.com/docs/extensions/

---

**Happy Encrypting! 🔐**
