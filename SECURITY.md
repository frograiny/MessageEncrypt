# 🔐 Security Information

## Cách hoạt động của mã hóa

### Algorithm: XOR Cipher + Base64 Encoding

**Ưu điểm:**
- ✅ Nhanh, đơn giản
- ✅ Đủ an toàn cho tin nhắn casual
- ✅ Không cần thư viện nặng

**Nhược điểm:**
- ⚠️ Không phải cryptographically secure như AES
- ⚠️ Dễ bị tấn công nếu biết plaintext
- ⚠️ Weak passphrase = yếu security

### Quy trình mã hóa:

```
Plaintext: "Hôm nay mình không vào văn phòng nhé"
Passphrase: "group123456"

1. XOR mỗi ký tự với ký tự từ passphrase (lặp lại)
   - H ^ g = ?
   - o ^ r = ?
   - m ^ o = ?
   ... (lặp lại passphrase)

2. Encode thành Base64 để có chuỗi ký tự an toàn
   
3. Thêm marker 🔐 ở đầu để nhận diện

Ciphertext: "🔐aB3XYz9mK2pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj"
```

### Quy trình giải mã:

```
Ciphertext: "🔐aB3XYz9mK2pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj"
Passphrase: "group123456"

1. Loại bỏ marker 🔐

2. Decode từ Base64 về binary

3. XOR lại với passphrase (XOR có tính đối xứng)

Plaintext: "Hôm nay mình không vào văn phòng nhé"
```

## 🛡️ Bảo mật Passphrase

### Lưu trữ:
- Passphrase được lưu trong `chrome.storage.local`
- Đây là local storage - không đồng bộ ra cloud
- Chỉ bạn (user) có thể truy cập được

### Truy cập:
- Chỉ extension này có thể đọc được
- Không có request nào gửi server
- Chrome không truy cập

## ⚠️ Giới hạn an niệm

### Điều extension KHÔNG bảo vệ:
- ❌ **Metadata** - Ai gửi, mấy giờ, ai nhận vẫn thấy
- ❌ **Device compromise** - Nếu máy của bạn bị hack
- ❌ **Keylogger** - Nếu có keylogger đánh cắp passphrase
- ❌ **Weak passphrase** - "123456" dễ brute force
- ❌ **Memory access** - Admin có quyền cao có thể dump memory

### Điều extension BẢO VỆ:
- ✅ **Screenshot reader** - Chỉ thấy ký tự lộn xộn
- ✅ **Message intercept** - Giữa bạn và nhận viên
- ✅ **Admin snooping** - Admin không thể đọc được
- ✅ **Casual threats** - Bảo vệ từ những người không có tool

## 🔐 Khuyến cáo bảo mật

### ✅ NÊN LÀM:
1. **Dùng passphrase mạnh**
   - Ít 12 ký tự
   - Mix chữ hoa, số, ký tự đặc biệt
   - Ví dụ: `K@m0nN0tW3ak!2024`

2. **Nhớ passphrase** (hoặc lưu ở nơi an toàn)
   - Không viết trên giấy ở nơi công cộng
   - Không screenshot

3. **Chỉ chia cho những người cần**
   - Không nói với admin
   - Không gửi qua tin nhắn group

4. **Thay đổi passphrase định kỳ**
   - Hàng tháng nếu có thành viên rời nhóm
   - Sau khi bị leak

5. **Dùng VPN/Proxy thêm**
   - Để bảo vệ IP address
   - Che giấu vị trí

### ❌ KHÔNG NÊN LÀM:
1. ❌ Dùng passphrase yếu ("123456", "password")
2. ❌ Chia passphrase qua tin nhắn group
3. ❌ Viết passphrase ở nơi công cộng
4. ❌ Tin tưởng admin có quyền server
5. ❌ Quên mất passphrase (không thể phục hồi)

## 🔬 Kỹ thuật chống tấn công

### Brute Force Attack
- **Risk**: Nếu passphrase yếu
- **Defense**: Dùng passphrase dài + complex
- **Thời gian**: 12 ký tự = ~10^12 khả năng

### Known Plaintext Attack
- **Risk**: Nếu attacker biết plaintext của 1 tin nhắn
- **Defense**: XOR weak, dùng AES-256 nếu lo
- **Giải pháp**: Dùng randomized cipher (v1.2)

### Dictionary Attack
- **Risk**: Nếu passphrase là từ từ điển
- **Defense**: Dùng random string
- **Thời gian**: 100,000 từ = nhanh hơn brute force

### Man-in-the-Middle
- **Risk**: Attacker intercept tin nhắn ở Facebook
- **Defense**: Facebook dùng HTTPS/SSL
- **Giải pháp**: Extension không can thiệp đó

## 🚀 Upgrade sang AES-256 (trong tương lai)

Hiện tại extension dùng XOR đơn giản. Có thể upgrade:

```javascript
// Pseudocode for future AES-256
const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: getRandomIV() },
    await deriveKey(passphrase),
    new TextEncoder().encode(plaintext)
);
```

**Lợi ích:**
- ✅ Cryptographically secure
- ✅ Có authentication (GCM mode)
- ✅ Resistant to known plaintext attacks
- ✅ Industry standard

**Hạn chế:**
- ❌ Chậm hơn XOR
- ❌ Cần lib crypto (nhưng Chrome có Web Crypto API)

## 📚 Tài liệu tham khảo

- [XOR cipher - Wikipedia](https://en.wikipedia.org/wiki/XOR_cipher)
- [Web Crypto API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Chrome Extension Security - Google](https://developer.chrome.com/docs/extensions/mv3/security/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

**Remember: No encryption is 100% secure. This is "good enough" for most cases.** 🔐
