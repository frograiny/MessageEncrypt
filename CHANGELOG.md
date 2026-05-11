# 📋 Danh sách thay đổi (Changelog)

## [1.0.0] - 2024-05-11

### ✨ Features
- ✅ Mã hóa tin nhắn Messenger bằng passphrase
- ✅ Giải mã bằng tooltip khi hover chuột
- ✅ Phím tắt Ctrl+Shift+E để mã hóa nhanh
- ✅ UI popup đẹp để lưu/quản lý passphrase
- ✅ Công cụ mã hóa nhanh trong popup
- ✅ Tự động nhận diện tin nhắn đã mã hóa
- ✅ Passphrase lưu an toàn trong chrome.storage

### 🎨 UI/UX
- Popup đẹp với gradient color
- Tooltip hiển thị tin nhắn gốc khi hover
- Button mã hóa 🔐 hiện trong input tin nhắn
- Trang onboarding hướng dẫn cài đặt

### 🔒 Security
- Sử dụng XOR cipher + Base64 encoding
- Passphrase lưu local (không gửi server)
- Không tracking hay logging dữ liệu người dùng

### 📝 Documentation
- README.md chi tiết
- INSTALL.md hướng dẫn cài đặt
- Hướng dẫn trong onboarding.html

---

## 📊 Features Roadmap

### 🔜 Phiên bản 1.1 (lên kế hoạch)
- [ ] Hỗ trợ end-to-end encryption mạnh hơn (AES-256)
- [ ] Lưu lịch sử tin nhắn đã mã hóa
- [ ] Dark mode cho popup
- [ ] Multiple passphrase profiles
- [ ] Hỗ trợ Firefox

### 🔜 Phiên bản 1.2 (lên kế hoạch)
- [ ] Hỗ trợ chat group settings
- [ ] Tự động mã hóa tin nhắn
- [ ] Export/Import passphrase an toàn
- [ ] QR code để chia sẻ passphrase

### 🔜 Phiên bản 2.0 (dài hạn)
- [ ] Support cho hệ thống public key
- [ ] Automatic key exchange
- [ ] Message signatures
- [ ] File encryption support

---

## 🐛 Known Issues

- Không support tin nhắn có hình ảnh/video
- Tooltip có thể bị che khuất bởi các phần tử khác
- Phải refresh Messenger nếu extension update

## 🔧 Improvement Ideas

Các cải tiến có thể làm:

1. **Mã hóa mạnh hơn** - Dùng TweetNaCl.js hoặc libsodium
2. **Automatic encryption** - Tự động mã hóa mà không cần click nút
3. **Key derivation** - Dùng PBKDF2 để derive key từ passphrase
4. **Message authentication** - Thêm HMAC để verify tin nhắn
5. **Rich tooltip** - Hiển thị metadata (thời gian, người gửi)
6. **User preferences** - Settings tùy chỉnh UI, ngôn ngữ

---

## 🙏 Contributor

- Created: 2024-05-11
- Author: Anonymous (vì privacy lol)
- License: MIT

---

**Keep your messages safe! 🔐**
