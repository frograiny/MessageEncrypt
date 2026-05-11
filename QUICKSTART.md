# ✅ Quick Start Checklist

## 📦 Installation Checklist

Hãy chắc chắn bạn đã hoàn thành tất cả các bước này:

### 1️⃣ Chuẩn bị
- [ ] Tải về folder `MessageEncrypt` 
- [ ] Tìm được file `manifest.json` trong folder (xác nhận đúng folder)
- [ ] Đóng tất cả tab Messenger đang mở

### 2️⃣ Cài đặt Extension
- [ ] Mở `chrome://extensions/` (hoặc `edge://extensions/`)
- [ ] Bật "Developer mode" (góc trên phải hoặc dưới trái)
- [ ] Nhấn "Load unpacked"
- [ ] Chọn folder `MessageEncrypt` (có chứa `manifest.json`)
- [ ] Xác nhận extension đã hiện trong danh sách

### 3️⃣ Cấu hình Passphrase
- [ ] Click biểu tượng 🔐 ở góc phải trên
- [ ] Nhập passphrase (ví dụ: "group123456")
- [ ] Nhấn "💾 Lưu mật khẩu"
- [ ] Thấy tin "✅ Lưu mật khẩu thành công!"

### 4️⃣ Test Extension
- [ ] Mở Messenger: https://www.messenger.com
- [ ] Refresh trang (Ctrl+R)
- [ ] Gõ tin nhắn test: "Hello World"
- [ ] Nhấn Ctrl+Shift+E (hoặc click nút 🔐)
- [ ] Thấy tin nhắn biến thành ký tự lộn xộn
- [ ] Hover vào tin nhắn → thấy tooltip "Hello World"

## 🎯 Hướng dẫn cho nhóm

Chia link này với mọi người:

```
https://github.com/your-repo/MessageEncrypt
```

Hãy nói với mọi người:
1. Clone/tải repo
2. Cài extension theo INSTALL.md
3. Dùng **CÙNG passphrase**: "group123456" (hoặc gì đó bạn chọn)
4. Refresh Messenger

## 🔧 Troubleshooting

### ❓ Nút 🔐 không hiện?
```
1. Vào chrome://extensions
2. Tìm "Message Encrypt" → bật công tắc
3. Click "Details" → "Site permissions"
4. Cho phép truy cập facebook.com và messenger.com
5. Refresh lại Messenger
```

### ❓ Lỗi "extension cannot be added"?
```
1. Kiểm tra bạn chọn đúng folder (có manifest.json)
2. Thử xóa extension cũ → reload lại
3. Restart trình duyệt
```

### ❓ Tooltip không hiện?
```
1. Kiểm tra passphrase có được lưu chưa
2. Refresh Messenger (Ctrl+R)
3. Kiểm tra Console (F12) có lỗi gì không
```

### ❓ Tin nhắn không mã hóa?
```
1. Kiểm tra passphrase lưu chưa
2. Xác nhận bạn nhấn Ctrl+Shift+E
3. Kiểm tra nút 🔐 có hiện không
```

## 📊 File Structure (để reference)

```
MessageEncrypt/
├── manifest.json              ← QUAN TRỌNG: File khai báo
├── INSTALL.md                 ← Hướng dẫn cài (bạn đang đọc)
├── README.md                  ← Hướng dẫn sử dụng
├── SECURITY.md                ← Thông tin bảo mật
├── CHANGELOG.md               ← Danh sách thay đổi
├── src/
│   ├── popup.html            ← UI passphrase popup
│   ├── popup.js              ← Logic popup
│   ├── content.js            ← Script chạy trên Messenger
│   ├── crypto.js             ← Hàm encrypt/decrypt
│   ├── background.js         ← Service worker
│   ├── styles.css            ← Styling
│   ├── onboarding.html       ← Trang hướng dẫn lần đầu
│   └── icons/
│       ├── icon-16.png       ← Icon nhỏ
│       ├── icon-48.png       ← Icon vừa
│       └── icon-128.png      ← Icon lớn
└── [Checklist] ← File này
```

## 🚀 Next Steps

Sau khi cài xong:

1. **Thử test** - Gửi tin nhắn mã hóa cho bạn bè
2. **Thay passphrase** - Nếu cần security cao hơn
3. **Đọc SECURITY.md** - Để hiểu rõ hơn về bảo mật
4. **Chia sẻ** - Nói với nhóm để cài

## 🎓 Hướng dẫn nhanh

| Hành động | Cách làm |
|-----------|---------|
| Mã hóa tin nhắn | Ctrl+Shift+E hoặc click 🔐 |
| Xem tin nhắn gốc | Hover chuột vào tin nhắn mã hóa |
| Mở settings | Click 🔐 ở góc phải trên |
| Lưu passphrase | Click "💾 Lưu mật khẩu" |
| Dùng công cụ | Dán text, nhấn "Mã hóa" → Copy |

## ❓ FAQ

**Q: Có cần phải cài extension tất cả mọi người không?**
A: Có! Nếu ai không cài sẽ chỉ thấy ký tự lộn xộn.

**Q: Nếu quên passphrase thì sao?**
A: Xin lỗi, không có cách phục hồi. Phải hỏi lại người khác.

**Q: Có thể dùng 2 passphrase khác nhau không?**
A: Không, tất cả phải dùng 1 cái để giải mã được nhau.

**Q: Admin có bị lộ nếu thấy tin nhắn mã hóa?**
A: Không, họ sẽ thấy ký tự lộn xộn, không đọc được.

**Q: Có thể tắt extension không?**
A: Có, vào chrome://extensions, bật/tắt công tắc.

**Q: Tin nhắn mã hóa sẽ lưu ở đâu?**
A: Facebook lưu dạng mã hóa. Chỉ người có passphrase mới xem được.

## 🎯 Success Criteria

Extension sử dụng thành công khi:
- ✅ Tất cả mọi người cài được extension
- ✅ Cả nhóm nhập cùng passphrase
- ✅ Mã hóa/giải mã hoạt động bình thường
- ✅ Admin không thể đọc được tin nhắn mã hóa
- ✅ Tooltip hiển thị khi hover

## 💬 Feedback

Nếu có vấn đề hoặc ý kiến, tạo issue hoặc contact author.

---

**Chúc mừng! 🎉 Extension của bạn đã sẵn sàng!**

*Happy encrypting! 🔐*
