# 🚀 Hướng dẫn Deploy Web HSK

## Các cách deploy miễn phí

### 1. 🌐 GitHub Pages (Khuyến nghị - Miễn phí)

**Bước 1: Tạo repository trên GitHub**
1. Đăng nhập GitHub: https://github.com
2. Click nút "New repository"
3. Đặt tên: `vibe-check-hsk`
4. Chọn "Public"
5. Click "Create repository"

**Bước 2: Upload code lên GitHub**
```bash
# Mở terminal trong thư mục dự án
cd c:/Users/Tuantx/Downloads/tuantx/vibe-check-hsk

# Khởi tạo git
git init

# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit"

# Thêm remote repository (thay YOUR_USERNAME bằng tên GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/vibe-check-hsk.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

**Bước 3: Bật GitHub Pages**
1. Vào repository trên GitHub
2. Click "Settings" > "Pages"
3. Trong "Source", chọn "main" branch
4. Click "Save"
5. Đợi vài phút, web sẽ có tại: `https://YOUR_USERNAME.github.io/vibe-check-hsk/`

---

### 2. 🔷 Netlify (Rất dễ - Miễn phí)

**Cách 1: Drag & Drop**
1. Truy cập: https://app.netlify.com/drop
2. Kéo thả toàn bộ thư mục `vibe-check-hsk` vào
3. Đợi vài giây, web sẽ được deploy!
4. Netlify sẽ tạo URL ngẫu nhiên, bạn có thể đổi tên

**Cách 2: Từ GitHub**
1. Đăng ký/Đăng nhập: https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Chọn "GitHub" và authorize
4. Chọn repository `vibe-check-hsk`
5. Click "Deploy site"
6. Web sẽ tự động deploy và cập nhật khi bạn push code mới

---

### 3. 🔶 Vercel (Nhanh - Miễn phí)

**Deploy từ GitHub:**
1. Đăng ký/Đăng nhập: https://vercel.com
2. Click "Add New" > "Project"
3. Import repository từ GitHub
4. Click "Deploy"
5. Web sẽ có tại: `https://vibe-check-hsk.vercel.app`

**Deploy bằng CLI:**
```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy
cd c:/Users/Tuantx/Downloads/tuantx/vibe-check-hsk
vercel

# Follow hướng dẫn trên màn hình
```

---

### 4. 🟦 Cloudflare Pages (Nhanh - Miễn phí)

1. Đăng ký: https://pages.cloudflare.com
2. Click "Create a project"
3. Connect GitHub account
4. Chọn repository
5. Click "Begin setup" > "Save and Deploy"

---

### 5. 📦 Render (Miễn phí)

1. Đăng ký: https://render.com
2. Click "New" > "Static Site"
3. Connect GitHub repository
4. Click "Create Static Site"

---

## 🎯 So sánh các nền tảng

| Nền tảng | Độ khó | Tốc độ | Custom Domain | Auto Deploy |
|----------|--------|--------|---------------|-------------|
| **GitHub Pages** | ⭐⭐ | Nhanh | ✅ Miễn phí | ✅ |
| **Netlify** | ⭐ | Rất nhanh | ✅ Miễn phí | ✅ |
| **Vercel** | ⭐ | Rất nhanh | ✅ Miễn phí | ✅ |
| **Cloudflare** | ⭐⭐ | Cực nhanh | ✅ Miễn phí | ✅ |
| **Render** | ⭐⭐ | Nhanh | ✅ Có phí | ✅ |

---

## 🔧 Chuẩn bị trước khi deploy

### Kiểm tra file cần thiết:
```
vibe-check-hsk/
├── index.html     ✅
├── style.css      ✅
├── script.js      ✅
└── README.md      ✅
```

### Không cần:
- ❌ Node.js
- ❌ Build process
- ❌ Server
- ❌ Database

Web này là **static site** nên deploy rất đơn giản!

---

## 🌍 Custom Domain (Tùy chọn)

Sau khi deploy, bạn có thể dùng tên miền riêng:

### Với GitHub Pages:
1. Mua domain (VD: namecheap.com, godaddy.com)
2. Vào Settings > Pages
3. Nhập custom domain
4. Cấu hình DNS theo hướng dẫn

### Với Netlify/Vercel:
1. Vào Dashboard > Domain settings
2. Add custom domain
3. Follow hướng dẫn cấu hình DNS

---

## 🔄 Cập nhật web sau khi deploy

### Nếu dùng GitHub Pages/Netlify/Vercel:
```bash
# Chỉnh sửa code
# Sau đó:
git add .
git commit -m "Update features"
git push

# Web sẽ tự động cập nhật sau vài phút!
```

### Nếu dùng Netlify Drag & Drop:
- Kéo thả lại thư mục mới vào Netlify

---

## 📱 Kiểm tra sau khi deploy

✅ Web hiển thị đúng trên desktop
✅ Web hiển thị đúng trên mobile
✅ Dữ liệu từ RSS feeds load được
✅ Tìm kiếm hoạt động
✅ Ẩn/hiện cột hoạt động
✅ Link Facebook mở được

---

## 🆘 Troubleshooting

**Lỗi: Web không load dữ liệu**
- Kiểm tra console (F12) xem có lỗi CORS không
- RSS feeds có thể bị block, thử dùng proxy

**Lỗi: CSS/JS không load**
- Kiểm tra đường dẫn file trong index.html
- Đảm bảo tất cả file cùng thư mục

**Lỗi: 404 Not Found**
- Đảm bảo file index.html ở root directory
- Kiểm tra cấu hình build settings

---

## 💡 Khuyến nghị

**Cho người mới:** Dùng **Netlify Drag & Drop** - Đơn giản nhất!

**Cho developer:** Dùng **GitHub Pages** hoặc **Vercel** - Tự động deploy khi push code

**Cho tốc độ:** Dùng **Cloudflare Pages** - CDN toàn cầu, cực nhanh

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi deploy, check:
- GitHub Issues của các platform
- Documentation chính thức
- Stack Overflow

Chúc bạn deploy thành công! 🎉