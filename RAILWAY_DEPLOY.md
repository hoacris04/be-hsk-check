# 🚂 Hướng dẫn Deploy lên Railway.app

Hướng dẫn nhanh deploy HSK Check Backend lên Railway.app

---

## 📋 Yêu cầu

- ✅ Tài khoản GitHub
- ✅ Code đã push lên GitHub repository
- ✅ Tài khoản Railway.app (đăng ký bằng GitHub)

---

## 🚀 Các bước Deploy

### Bước 1: Đăng nhập Railway

1. Truy cập: https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway truy cập GitHub

### Bước 2: Tạo Project mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository `vibe-check-hsk`
4. Railway sẽ tự động detect Python project

### Bước 3: Cấu hình Backend Service

1. Railway tự động tạo service từ code
2. Vào **Settings** của service:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### Bước 4: Thêm PostgreSQL Database

1. Click **"New"** trong project
2. Chọn **"Database"** → **"Add PostgreSQL"**
3. Railway tự động tạo database và set biến `DATABASE_URL`

### Bước 5: Cấu hình Environment Variables

1. Vào service → **Variables** tab
2. Railway đã tự động thêm `DATABASE_URL`
3. Thêm các biến khác nếu cần:
   ```
   PYTHON_VERSION=3.11.0
   SECRET_KEY=your-secret-key-here
   ```

### Bước 6: Deploy

1. Railway tự động deploy khi detect changes
2. Xem logs trong **Deployments** tab
3. Đợi build hoàn thành (2-3 phút)

### Bước 7: Lấy Public URL

1. Vào **Settings** tab
2. Scroll xuống **Networking**
3. Click **"Generate Domain"**
4. Copy URL (ví dụ: `https://hsk-check-api.up.railway.app`)

---

## ✅ Kiểm tra

Test API của bạn:

```bash
# Thay YOUR_RAILWAY_URL bằng URL thực tế
curl https://YOUR_RAILWAY_URL/api/feeds
```

Hoặc mở trình duyệt:
```
https://YOUR_RAILWAY_URL/api/feeds
```

---

## 🔄 Auto-Deploy

Railway tự động deploy khi bạn push code mới:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway sẽ tự động:
1. Detect changes
2. Build lại
3. Deploy version mới
4. Zero-downtime deployment

---

## 💰 Free Tier

Railway cung cấp:
- ✅ **$5 credit miễn phí/tháng**
- ✅ PostgreSQL database miễn phí
- ✅ 500 hours execution time
- ✅ Unlimited projects

**Lưu ý:** $5 credit thường đủ cho 1-2 project nhỏ chạy 24/7

---

## 🐛 Troubleshooting

### Lỗi: "Application failed to respond"

**Nguyên nhân:** Port binding không đúng

**Giải pháp:** Kiểm tra `app.py` có đoạn này:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### Lỗi: "Module not found"

**Nguyên nhân:** Thiếu package trong `requirements.txt`

**Giải pháp:**
```bash
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

### Lỗi: Database connection

**Nguyên nhân:** `DATABASE_URL` không đúng format

**Giải pháp:**
1. Vào PostgreSQL service
2. Copy **Connection URL** từ **Connect** tab
3. Paste vào biến `DATABASE_URL` của backend service

### Lỗi: Build timeout

**Nguyên nhân:** Dependencies quá lớn

**Giải pháp:**
1. Vào **Settings** → **Deploy**
2. Tăng **Build Timeout** lên 10-15 phút

---

## 📊 Monitoring

### Xem Logs

1. Vào service
2. Click **Deployments** tab
3. Click vào deployment mới nhất
4. Xem **Build Logs** và **Deploy Logs**

### Xem Metrics

1. Vào service
2. Click **Metrics** tab
3. Xem:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## 🎯 Best Practices

### 1. Sử dụng Environment Variables

Không hardcode sensitive data:

```python
# ❌ Không tốt
DATABASE_URL = "postgresql://user:pass@host/db"

# ✅ Tốt
DATABASE_URL = os.environ.get('DATABASE_URL')
```

### 2. Health Check Endpoint

Thêm endpoint để Railway check health:

```python
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200
```

### 3. Logging

Sử dụng logging thay vì print:

```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Server started")
logger.error("Error occurred")
```

### 4. Database Migrations

Chạy migrations sau mỗi deploy:

```python
# Thêm vào app.py
with app.app_context():
    db.create_all()
```

---

## 🔗 Kết nối Frontend

Sau khi deploy backend, update frontend:

1. Mở `script.js`
2. Thay đổi API URL:

```javascript
const API_URL = 'https://YOUR_RAILWAY_URL';
```

3. Push code frontend lên hosting (Vercel, Netlify, etc.)

---

## 📝 Checklist

- [ ] Code đã push lên GitHub
- [ ] Railway project đã tạo
- [ ] PostgreSQL database đã thêm
- [ ] Environment variables đã set
- [ ] Domain đã generate
- [ ] API test thành công
- [ ] Frontend đã update API URL
- [ ] Auto-deploy đã test

---

## 🎉 Hoàn thành!

Backend của bạn đã live trên Railway! 🚀

**URL mẫu:**
```
https://hsk-check-api.up.railway.app
```

**Test endpoints:**
```bash
# Get all feeds
curl https://YOUR_RAILWAY_URL/api/feeds

# Get posts
curl https://YOUR_RAILWAY_URL/api/posts

# Health check
curl https://YOUR_RAILWAY_URL/health
```

---

## 📚 Tài liệu thêm

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Blog: https://blog.railway.app

---

**Made with ❤️ for HSK Check**