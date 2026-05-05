# 🐍 HSK Check Backend API

Flask REST API cho ứng dụng tra cứu lịch thi HSK.

## 📋 Tính năng

### 🎯 Core Features
- ✅ **REST API** - RESTful API endpoints
- ✅ **Database** - SQLite/PostgreSQL với SQLAlchemy ORM
- ✅ **CORS** - Cross-Origin Resource Sharing enabled
- ✅ **Auto-refresh** - Tự động cập nhật RSS feeds mỗi 5 phút
- ✅ **Caching** - Cache posts trong database

### 📊 API Endpoints

#### **Feeds Management**
- `GET /api/feeds` - Lấy danh sách RSS feeds
- `POST /api/feeds` - Thêm RSS feed mới
- `DELETE /api/feeds/<id>` - Xóa RSS feed

#### **Posts Management**
- `GET /api/posts` - Lấy danh sách bài viết (có filter, search, pagination)
- `POST /api/posts/refresh` - Refresh posts từ tất cả feeds

#### **Email Subscriptions**
- `GET /api/subscriptions` - Lấy danh sách subscriptions
- `POST /api/subscriptions` - Đăng ký email mới
- `DELETE /api/subscriptions/<id>` - Hủy đăng ký
- `DELETE /api/subscriptions/email/<email>` - Hủy đăng ký theo email

---

## 🚀 Cài đặt

### 1. Yêu cầu hệ thống
- Python 3.8+
- pip

### 2. Clone repository
```bash
cd backend
```

### 3. Tạo virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 4. Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 5. Cấu hình environment
```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
```

### 6. Chạy server
```bash
python app.py
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 📁 Cấu trúc

```
backend/
├── app.py              # Main application
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── hsk_check.db       # SQLite database (auto-created)
```

---

## 🗄️ Database Schema

### **RSSFeed**
```python
id: Integer (Primary Key)
name: String(100)
url: String(500) - Unique
page_url: String(500)
color1: String(20)
color2: String(20)
active: Boolean
created_at: DateTime
```

### **Post**
```python
id: String(100) (Primary Key)
feed_id: Integer (Foreign Key)
title: Text
content_text: Text
content_html: Text
url: String(500)
image: String(500)
date_published: DateTime
created_at: DateTime
```

### **EmailSubscription**
```python
id: Integer (Primary Key)
name: String(100)
email: String(120) - Unique
frequency: String(20) - immediate/daily/weekly
active: Boolean
last_sent: DateTime
created_at: DateTime
```

---

## 📡 API Documentation

### **GET /api/feeds**
Lấy danh sách tất cả RSS feeds đang active.

**Response:**
```json
[
  {
    "id": 1,
    "name": "ULIS - ĐH Ngoại ngữ ĐHQGHN",
    "url": "https://rss.app/feeds/v1.1/AgH8JEE481LUB8cs.json",
    "page_url": "https://www.facebook.com/...",
    "colors": ["#667eea", "#764ba2"],
    "active": true,
    "created_at": "2026-05-05T06:00:00"
  }
]
```

### **POST /api/feeds**
Thêm RSS feed mới.

**Request Body:**
```json
{
  "name": "Tên điểm thi",
  "url": "https://rss.app/feeds/v1.1/xxx.json",
  "page_url": "https://facebook.com/...",
  "color1": "#667eea",
  "color2": "#764ba2"
}
```

**Response:** `201 Created`

### **GET /api/posts**
Lấy danh sách bài viết với filter và pagination.

**Query Parameters:**
- `feed_id` (optional) - Filter theo feed ID
- `search` (optional) - Tìm kiếm trong title và content
- `limit` (optional, default: 50) - Số lượng posts
- `offset` (optional, default: 0) - Offset cho pagination

**Response:**
```json
{
  "total": 150,
  "limit": 50,
  "offset": 0,
  "posts": [
    {
      "id": "abc123",
      "feed_id": 1,
      "feed_name": "ULIS - ĐH Ngoại ngữ ĐHQGHN",
      "title": "Thông báo lịch thi HSK...",
      "content_text": "Nội dung...",
      "url": "https://facebook.com/...",
      "image": "https://...",
      "date_published": "2026-05-05T06:00:00",
      "created_at": "2026-05-05T06:00:00"
    }
  ]
}
```

### **POST /api/posts/refresh**
Refresh posts từ tất cả feeds ngay lập tức.

**Response:**
```json
{
  "message": "Refreshed successfully",
  "new_posts": 5
}
```

### **POST /api/subscriptions**
Đăng ký nhận email notification.

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "example@gmail.com",
  "frequency": "daily"
}
```

**Response:** `201 Created`

---

## ⚙️ Configuration

### Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
# Flask
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///hsk_check.db
# Hoặc PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/hsk_check

# Email (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🔄 Background Tasks

Backend tự động chạy các task sau:

### **Auto-refresh Feeds**
- Chạy mỗi 5 phút
- Fetch posts mới từ tất cả RSS feeds
- Lưu vào database

### **Email Notifications** (Coming soon)
- Gửi email theo schedule
- Immediate: Ngay khi có bài mới
- Daily: 1 lần/ngày vào 8:00 AM
- Weekly: 1 lần/tuần vào Thứ 2

---

## 🧪 Testing

### Test API với curl

```bash
# Get feeds
curl http://localhost:5000/api/feeds

# Get posts
curl http://localhost:5000/api/posts

# Search posts
curl "http://localhost:5000/api/posts?search=HSK"

# Refresh posts
curl -X POST http://localhost:5000/api/posts/refresh

# Subscribe email
curl -X POST http://localhost:5000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","frequency":"daily"}'
```

### Test với Postman

Import collection từ file `postman_collection.json` (sẽ tạo sau)

---

## 🚀 Deploy

### Deploy lên Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create hsk-check-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run python -c "from app import init_db; init_db()"
```

### Deploy lên Railway

1. Tạo tài khoản tại https://railway.app
2. Connect GitHub repository
3. Deploy từ `backend` folder
4. Add PostgreSQL database
5. Set environment variables

### Deploy lên Render

1. Tạo tài khoản tại https://render.com
2. New Web Service
3. Connect repository
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`

---

## 📊 Database Migration

Nếu cần thay đổi schema:

```bash
# Backup database
cp hsk_check.db hsk_check.db.backup

# Make changes in app.py models

# Drop and recreate (WARNING: Loses data)
python -c "from app import db, app; app.app_context().push(); db.drop_all(); db.create_all()"

# Or use Flask-Migrate for proper migrations
pip install Flask-Migrate
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Database locked
```bash
# Close all connections and restart
rm hsk_check.db
python app.py
```

### CORS errors
```bash
# Check CORS_ORIGINS in .env
# Make sure frontend URL is included
```

---

## 📝 TODO

- [ ] Add authentication (JWT)
- [ ] Add rate limiting
- [ ] Add email sending functionality
- [ ] Add admin dashboard
- [ ] Add API documentation (Swagger)
- [ ] Add unit tests
- [ ] Add Docker support
- [ ] Add CI/CD pipeline

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

MIT License

---

## 📞 Support

- Email: support@hskcheck.com
- Issues: GitHub Issues
- Docs: https://docs.hskcheck.com

---

**Made with ❤️ by HSK Check Team**