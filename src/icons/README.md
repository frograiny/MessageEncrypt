# 📁 Icons Folder

Để sử dụng extension đầy đủ, bạn cần tạo 3 file icon PNG:

## Kích thước cần thiết

1. **icon-16.png** - 16x16 pixels (for browser tab)
2. **icon-48.png** - 48x48 pixels (for extension menu)
3. **icon-128.png** - 128x128 pixels (for Chrome Web Store)

## Cách tạo icon nhanh

### Option 1: Dùng website tạo icon
1. Vào https://www.favicon-generator.org/
2. Tải hoặc chọn ảnh 🔐 (lock emoji)
3. Download icon ở các kích thước trên
4. Đặt vào thư mục này

### Option 2: Dùng Python (PIL)
```python
from PIL import Image, ImageDraw, ImageFont

# Create gradient background
img = Image.new('RGBA', (128, 128), (102, 126, 234, 255))
draw = ImageDraw.Draw(img)

# Add lock emoji or text
draw.text((30, 20), "🔐", fill=(255, 255, 255, 255))

# Save in different sizes
img.save("icon-128.png")
img.resize((48, 48)).save("icon-48.png")
img.resize((16, 16)).save("icon-16.png")
```

### Option 3: Sử dụng Figma / Adobe XD
- Tạo design với lock emoji
- Export ở các kích thước 16, 48, 128
- Lưu dưới dạng PNG

### Option 4: Sử dụng online tools
- https://www.pixlr.com/ (free editor)
- https://www.photopea.com/ (Photoshop-like)
- https://canva.com/ (design templates)

## 🔧 Nếu bỏ qua icon

Nếu chưa tạo icon, bạn có thể tạm thời sửa `manifest.json`:

Thay:
```json
"icons": {
    "16": "src/icons/icon-16.png",
    "48": "src/icons/icon-48.png",
    "128": "src/icons/icon-128.png"
}
```

Bằng (bỏ icons):
```json
"icons": {}
```

Extension vẫn hoạt động bình thường, chỉ không có icon tùy chỉnh.

---

**Lưu ý:** Icons là optional nhưng nên thêm để extension trông chuyên nghiệp hơn!
