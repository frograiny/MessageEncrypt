# 🔐 Message Encrypt Extension

Một extension Chrome/Edge bảo vệ tin nhắn Messenger của bạn khỏi admin leak bằng mã hóa!

## 🎯 Tính năng

✅ **Mã hóa tin nhắn** - Tin nhắn được mã hóa trước khi gửi  
✅ **Giải mã bằng hover** - Trỏ chuột vào tin nhắn để xem nội dung gốc (tooltip)  
✅ **Passphrase chia sẻ** - Tất cả mọi người dùng cùng mật khẩu  
✅ **Phím tắt** - Ctrl+Shift+E để mã hóa nhanh  
✅ **An toàn** - Admin không thể đọc được tin nhắn mã hóa  

## 📦 Cài đặt

### 1. Clone hoặc tải về extension
```bash
# Nếu dùng git
git clone <repo-url>
cd MessageEncrypt
```

### 2. Cài đặt trên Chrome/Edge

**Chrome:**
1. Mở `chrome://extensions/`
2. Bật "Developer mode" (góc phải trên)
3. Nhấn "Load unpacked"
4. Chọn thư mục `MessageEncrypt`
5. Xong! Extension sẽ được cài đặt

**Edge:**
1. Mở `edge://extensions/`
2. Bật "Developer mode" (góc trái dưới)
3. Nhấn "Load unpacked"
4. Chọn thư mục `MessageEncrypt`
5. Xong!

## 🚀 Hướng dẫn sử dụng

### Bước 1: Lưu Passphrase
1. Click biểu tượng 🔐 extension ở góc phải trên
2. Nhập mật khẩu **chung cho cả nhóm** (ví dụ: "group123456")
3. Nhấn "💾 Lưu mật khẩu"
4. Tất cả mọi người phải lưu **cùng** passphrase này

### Bước 2: Mã hóa tin nhắn
1. Vào Messenger, gõ tin nhắn bình thường
2. **Cách 1:** Click nút 🔐 bên cạnh nút gửi
3. **Cách 2:** Nhấn `Ctrl+Shift+E` (hoặc `Cmd+Shift+E` trên Mac)
4. Tin nhắn sẽ được mã hóa thành ký tự lộn xộn
5. Nhấn "Gửi" như bình thường

### Bước 3: Xem tin nhắn mã hóa
1. Hover chuột vào tin nhắn đã mã hóa (bắt đầu bằng 🔐)
2. Một **tooltip** sẽ hiển thị tin nhắn gốc
3. Chỉ những ai có cùng passphrase mới xem được

## 💡 Ví dụ

**Trước mã hóa:**
```
"Hôm nay mình không vào văn phòng nhé"
```

**Sau mã hóa (gửi trên Messenger):**
```
🔐aB3XYz9mK2pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj
```

**Hover vào tin nhắn → Tooltip:**
```
┌─────────────────────────────────────┐
│ "Hôm nay mình không vào văn phòng   │
│ nhé"                                │
└─────────────────────────────────────┘
```

## ⚙️ Công cụ nhanh (Encryption Tool)

Extension có công cụ mã hóa nhanh trong popup:
1. Click biểu tượng 🔐
2. Dán text cần mã hóa vào ô "📝 Công cụ mã hóa nhanh"
3. Nhấn "Mã hóa"
4. Copy text mã hóa bằng "📋 Copy"
5. Dán vào Messenger theo cách thủ công

## 🔒 An niệm bảo mật

- Extension dùng XOR cipher + Base64 encoding (đủ an toàn cho tin nhắn casual)
- Passphrase được lưu trong `chrome.storage.local` (local device only)
- Không có dữ liệu gửi đến server nào
- Chỉ ai có passphrase mới giải mã được

## ⚠️ Lưu ý quan trọng

1. **Passphrase phải giống nhau** - Nếu ai nhập sai, sẽ không giải mã được
2. **Tất cả phải cài extension** - Nếu ai không có extension, họ chỉ thấy ký tự lộn xộn
3. **Không lưu passphrase đâu** - Hãy nhớ passphrase hoặc lưu ở chỗ an toàn
4. **Admin vẫn có thể thấy** - Nhưng chỉ thấy ký tự lộn xộn, không đọc được nội dung

## 🐛 Troubleshooting

### "Không thể giải mã (sai passphrase?)"
- Kiểm tra passphrase có giống với những người khác không
- Thử xóa passphrase và lưu lại

### Nút 🔐 không hiện
- Refresh lại trang Messenger
- Đảm bảo extension đã được cài đặt (check chrome://extensions)

### Tooltip không hiện khi hover
- Kiểm tra passphrase có được lưu không
- Refresh trang Messenger

### Tin nhắn không mã hóa khi gửi
- Kiểm tra passphrase có được lưu không (sẽ báo lỗi)
- Xác nhận bạn đã bấm nút 🔐 hoặc Ctrl+Shift+E

## 📝 Phát triển

Cấu trúc dự án:
```
MessageEncrypt/
├── manifest.json           # Cài đặt extension
├── src/
│   ├── popup.html         # UI popup passphrase
│   ├── popup.js           # Logic popup
│   ├── content.js         # Script chạy trên Messenger
│   ├── crypto.js          # Hàm mã hóa/giải mã
│   ├── background.js      # Service worker
│   ├── styles.css         # Styling
│   ├── onboarding.html    # Trang hướng dẫn
│   └── icons/             # Icons (16x16, 48x48, 128x128)
└── README.md              # File này
```

## 🤝 Đóng góp

Nếu bạn có ý tưởng cải tiến hoặc tìm thấy bug, hãy tạo issue hoặc pull request!

## 📄 License

MIT License - Dùng tự do!

## ⭐ Ủng hộ

Nếu thấy hữu ích, hãy ⭐ star dự án này!

---

**Made with 💜 for privacy lovers**
