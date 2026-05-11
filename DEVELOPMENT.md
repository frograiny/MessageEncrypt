# 🛠️ Development Guide

Hướng dẫn này dành cho những ai muốn tùy chỉnh hoặc phát triển extension tiếp.

## 📁 Cấu trúc Project

```
MessageEncrypt/
├── manifest.json              # Khai báo extension (important!)
├── INSTALL.md                 # Hướng dẫn cài
├── README.md                  # Hướng dẫn sử dụng
├── SECURITY.md                # Thông tin bảo mật
├── CHANGELOG.md               # Danh sách thay đổi
├── QUICKSTART.md              # Quick start
├── DEVELOPMENT.md             # File này
│
└── src/
    ├── popup.html             # UI popup passphrase
    ├── popup.js               # Logic popup & encryption UI
    ├── content.js             # Content script (chạy trên Messenger)
    ├── crypto.js              # Hàm encrypt/decrypt (CORE)
    ├── background.js          # Service worker
    ├── styles.css             # CSS styling
    ├── onboarding.html        # Trang welcome lần đầu
    └── icons/                 # Extension icons
        ├── icon-16.png
        ├── icon-48.png
        └── icon-128.png
```

## 🔑 File Chính

### `manifest.json`
```json
{
  "manifest_version": 3,          // Chrome extension v3
  "name": "Message Encrypt",
  "permissions": ["storage"],     // Quyền lưu data
  "host_permissions": [
    "https://www.facebook.com/*", // Chạy trên Facebook
    "https://www.messenger.com/*" // Chạy trên Messenger
  ]
}
```

**Để chỉnh sửa:**
- Thay tên: `"name": "New Name"`
- Thêm quyền: `"permissions": [..., "new_permission"]`
- Thay host: Sửa domain trong `"host_permissions"`

### `src/crypto.js` ⭐ (CORE)
Hàm mã hóa/giải mã chính của extension.

```javascript
class MessageCrypto {
  encrypt(text, passphrase)   // Text → Encrypted
  decrypt(encrypted, passphrase) // Encrypted → Text
  isEncrypted(text)           // Check if 🔐 marker
  hashPassphrase(passphrase)  // Hash cho verification
}
```

**Để upgrade XOR → AES-256:**
```javascript
// Thay phần XOR bằng:
const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
);

const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(12) },
    key,
    new TextEncoder().encode(text)
);
```

### `src/content.js` (Chạy trên Messenger)
Script này:
1. Detect tin nhắn mới trên Messenger
2. Thêm nút 🔐 vào input
3. Xử lý hover để show decrypted message

**Key functions:**
```javascript
encryptMessage(inputElement)    // Mã hóa tin nhắn
addDecryptTooltip(element, text) // Thêm hover tooltip
showTooltip(event, message)     // Hiển thị tooltip
```

**Để modify:**
- Thay selector: `querySelector(...)` để target elements
- Thêm event listener: Cho button/hotkey mới
- Thay CSS class: Dùng class khác

### `src/popup.html` & `src/popup.js`
UI popup để lưu passphrase.

**Để thêm feature:**
1. Thêm HTML element (input, button, etc.)
2. Thêm CSS styling
3. Thêm event listener trong popup.js
4. Save data: `chrome.storage.local.set({ key: value })`

### `src/background.js`
Service worker - chạy ở background.

**Hiện tại:** Chỉ log messages và handle passphrase requests.

**Có thể thêm:**
- Periodic encryption routine
- Message history logging
- Statistics tracking

## 🔄 Data Flow

```
User input (Messenger)
    ↓
content.js detect input
    ↓
User click 🔐 or Ctrl+Shift+E
    ↓
content.js call crypto.js encrypt()
    ↓
Encrypted text replace input
    ↓
User click Send button
    ↓
Encrypted text sent to Messenger
    ↓
---
Messenger receive encrypted message
    ↓
content.js detect 🔐 marker
    ↓
User hover message
    ↓
content.js call crypto.js decrypt()
    ↓
Show tooltip with original text
```

## 💾 Storage

Extension dùng `chrome.storage.local`:
```javascript
// Save
chrome.storage.local.set({ passphrase: "value" })

// Load
chrome.storage.local.get(['passphrase'], (result) => {
    console.log(result.passphrase);
})

// Clear
chrome.storage.local.remove(['passphrase'])

// Watch for changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.passphrase) {
        console.log("Passphrase changed");
    }
})
```

## 🎨 Styling Guide

File: `src/styles.css`

Key classes:
```css
#msg-encrypt-tooltip   /* Tooltip bubble */
.msg-encrypt-btn       /* Encrypt button */
[data-encrypt-processed] /* Encrypted message element */
```

**Để customize:**
- Thay color: `#667eea` (purple)
- Thay font: `font-family: ...`
- Thay size: `font-size: ...`

## 🧪 Testing

### Test locally:
1. Edit file (e.g., `crypto.js`)
2. Vào `chrome://extensions`
3. Click "Reload" extension
4. Refresh Messenger tab
5. Test functionality

### Test encryption:
```javascript
// Mở Console (F12)
const crypto = new MessageCrypto();
const encrypted = crypto.encrypt("Hello", "password123");
console.log(encrypted); // 🔐...

const decrypted = crypto.decrypt(encrypted, "password123");
console.log(decrypted); // "Hello"
```

### Debug:
```javascript
// Add console.log everywhere
console.log("Event triggered", event);
console.log("Text before:", text);
console.log("Text after:", encryptedText);

// Check in DevTools: F12 → Console tab
// For content script: F12 → More Tools → Console
```

## 🚀 Improvement Ideas

### Level 1: Easy
- [ ] Thêm light mode / dark mode
- [ ] Thêm custom emoji marker (thay thế 🔐)
- [ ] Thêm copy to clipboard button
- [ ] I18n (translate to other languages)

### Level 2: Medium
- [ ] AES-256 encryption (thay XOR)
- [ ] Auto-encrypt mode (check checkbox)
- [ ] Message history (lưu tin nhắn)
- [ ] Multiple passphrase profiles
- [ ] Export/import settings

### Level 3: Hard
- [ ] Public key encryption (dùng individual keys)
- [ ] Message signing & verification
- [ ] Group key management
- [ ] File encryption support
- [ ] Cross-browser sync (Firefox, Safari, etc.)

## 📦 Build & Publish

### Local ZIP:
```bash
# Windows PowerShell
Compress-Archive -Path MessageEncrypt -DestinationPath MessageEncrypt.zip
```

### Chrome Web Store:
1. Tạo developer account
2. Zip extension folder
3. Upload lên Chrome Web Store
4. Chờ approval (~24 hours)
5. Nó sẽ public cho mọi người cài

### Firefox Add-ons:
1. Modify manifest.json (add Firefox entries)
2. Submit lên mozilla.org
3. Chờ review

## 🔐 Best Practices

### Code style:
```javascript
// ✅ GOOD
const passphrase = storage.get('passphrase');
const encrypted = crypto.encrypt(text, passphrase);

// ❌ BAD
var p = s.get('p');
let e = c.e(t, p);
```

### Error handling:
```javascript
// ✅ GOOD
try {
    const result = decrypt(text, passphrase);
    return result;
} catch (error) {
    console.error('Decrypt failed:', error);
    return null;
}

// ❌ BAD
const result = decrypt(text, passphrase);
return result;
```

### Security:
```javascript
// ✅ GOOD
const passphrase = atob(encoded); // Decode
await crypto.subtle.encrypt(...); // Use Web Crypto

// ❌ BAD
const passphrase = encoded; // No encoding
const encrypted = simpleXor(text, pass); // Weak algo
```

## 🐛 Common Issues

### Issue: Content script not running
**Solution:**
- Check `chrome://extensions` → Details → Site permissions
- Add `facebook.com` and `messenger.com`
- Refresh page

### Issue: Storage not working
**Solution:**
- Chrome private mode doesn't allow storage
- Use regular browsing mode
- Check `chrome.storage.onChanged` listener

### Issue: Tooltip position wrong
**Solution:**
- Adjust `tooltip.style.top` and `tooltip.style.left`
- Add viewport checks

## 📚 References

- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

## 🤝 Contributing

Nếu muốn contribute:
1. Fork repo
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request

---

**Happy developing! 🚀**
