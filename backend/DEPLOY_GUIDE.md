# 🚀 Hướng dẫn Deploy Backend

Hướng dẫn chi tiết deploy Flask Backend lên các platform miễn phí.

---

## 📋 Mục lục

1. [Render.com (Khuyến nghị)](#1-rendercom-khuyến-nghị)
2. [Railway.app](#2-railwayapp)
3. [PythonAnywhere](#3-pythonanywhere)
4. [Heroku](#4-heroku)
5. [Vercel (Serverless)](#5-vercel-serverless)
6. [Google Cloud Run](#6-google-cloud-run)

---

## 1. Render.com (Khuyến nghị) ⭐

**Ưu điểm:**
- ✅ Miễn phí (750 giờ/tháng)
- ✅ PostgreSQL database miễn phí
- ✅ Auto-deploy từ GitHub
- ✅ HTTPS tự động
- ✅ Dễ setup

### Bước 1: Chuẩn bị code

Tạo file `render.yaml` trong thư mục `backend/`:

```yaml
services:
  - type: web
    name: hsk-check-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DATABASE_URL
        fromDatabase:
          name: hsk-check-db
          property: connectionString

databases:
  - name: hsk-check-db
    databaseName: hsk_check
    user: hsk_user
```

Thêm `gunicorn` vào `requirements.txt`:

```txt
Flask==3.0.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.1.1
requests==2.31.0
APScheduler==3.10.4
python-dotenv==1.0.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

### Bước 2: Push code lên GitHub

```bash
git add .
git commit -m "Add Render config"
git push origin main
```

### Bước 3: Deploy trên Render

1. Truy cập: https://render.com
2. Sign up/Login (dùng GitHub)
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub repository
5. Chọn repository `vibe-check-hsk`
6. Cấu hình:
   - **Name**: `hsk-check-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`
7. Click **"Create Web Service"**

### Bước 4: Thêm Database

1. Trong dashboard, click **"New +"** → **"PostgreSQL"**
2. **Name**: `hsk-check-db`
3. **Database**: `hsk_check`
4. **User**: `hsk_user`
5. Click **"Create Database"**

### Bước 5: Connect Database

1. Vào Web Service settings
2. **Environment** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy từ PostgreSQL connection string

### Bước 6: Test

API sẽ có URL: `https://hsk-check-api.onrender.com`

```bash
curl https://hsk-check-api.onrender.com/api/feeds
```

---

## 2. Railway.app

**Ưu điểm:**
- ✅ $5 credit miễn phí/tháng
- ✅ PostgreSQL miễn phí
- ✅ Deploy cực nhanh
- ✅ Auto-scaling

### Bước 1: Chuẩn bị

Tạo file `Procfile` trong `backend/`:

```
web: gunicorn app:app
```

Tạo file `runtime.txt`:

```
python-3.11.0
```

### Bước 2: Deploy

1. Truy cập: https://railway.app
2. Sign up với GitHub
3. Click **"New Project"**
4. **"Deploy from GitHub repo"**
5. Chọn repository
6. Railway tự động detect Python
7. Add PostgreSQL:
   - Click **"New"** → **"Database"** → **"PostgreSQL"**
8. Connect database:
   - Railway tự động set `DATABASE_URL`

### Bước 3: Configure

1. Settings → Environment Variables
2. Add:
   ```
   PYTHON_VERSION=3.11.0
   ```

### Bước 4: Test

URL: `https://hsk-check-api.up.railway.app`

---

## 3. PythonAnywhere

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Không cần credit card
- ✅ MySQL database miễn phí
- ✅ Dễ dùng cho Python

### Bước 1: Đăng ký

1. Truy cập: https://www.pythonanywhere.com
2. Sign up (Free account)
3. Verify email

### Bước 2: Upload code

**Option 1: Git clone**
```bash
# Trong PythonAnywhere Bash console
git clone https://github.com/your-username/vibe-check-hsk.git
cd vibe-check-hsk/backend
```

**Option 2: Upload files**
- Dùng Files tab để upload

### Bước 3: Setup Virtual Environment

```bash
# Trong Bash console
cd ~/vibe-check-hsk/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Bước 4: Configure Web App

1. **Web** tab → **"Add a new web app"**
2. **Manual configuration** → **Python 3.10**
3. **Virtualenv**: `/home/yourusername/vibe-check-hsk/backend/venv`
4. **Source code**: `/home/yourusername/vibe-check-hsk/backend`
5. **WSGI configuration file**: Click to edit

Thay nội dung bằng:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/vibe-check-hsk/backend'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set environment variables
os.environ['DATABASE_URL'] = 'sqlite:////home/yourusername/vibe-check-hsk/backend/hsk_check.db'

# Import Flask app
from app import app as application
```

### Bước 5: Reload

Click **"Reload"** button

URL: `https://yourusername.pythonanywhere.com`

---

## 4. Heroku

**Lưu ý:** Heroku đã ngừng free tier từ 2022, nhưng có $5 credit/tháng cho students.

### Bước 1: Chuẩ bị

Tạo `Procfile`:
```
web: gunicorn app:app
```

Tạo `runtime.txt`:
```
python-3.11.0
```

### Bước 2: Deploy

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create hsk-check-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Initialize database
heroku run python -c "from app import init_db; init_db()"

# Open app
heroku open
```

---

## 5. Vercel (Serverless)

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Serverless (auto-scale)
- ✅ Global CDN

### Bước 1: Chuẩn bị

Tạo `vercel.json` trong `backend/`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ]
}
```

Sửa `app.py` cuối file:

```python
# For Vercel
app = app
```

### Bước 2: Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd backend
vercel

# Production
vercel --prod
```

**Lưu ý:** Vercel serverless không hỗ trợ background jobs (APScheduler).

---

## 6. Google Cloud Run

**Ưu điểm:**
- ✅ $300 credit miễn phí (3 tháng)
- ✅ Auto-scaling
- ✅ Pay per use

### Bước 1: Tạo Dockerfile

Tạo `Dockerfile` trong `backend/`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
```

### Bước 2: Deploy

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy hsk-check-api \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

---

## 📊 So sánh Platforms

| Platform | Free Tier | Database | Auto-deploy | Dễ dùng | Khuyến nghị |
|----------|-----------|----------|-------------|---------|-------------|
| **Render** | 750h/tháng | PostgreSQL | ✅ | ⭐⭐⭐⭐⭐ | ✅ Tốt nhất |
| **Railway** | $5 credit | PostgreSQL | ✅ | ⭐⭐⭐⭐⭐ | ✅ Rất tốt |
| **PythonAnywhere** | Unlimited | MySQL | ❌ | ⭐⭐⭐ | ✅ Dễ nhất |
| **Heroku** | ❌ Trả phí | PostgreSQL | ✅ | ⭐⭐⭐⭐ | ⚠️ Không free |
| **Vercel** | Unlimited | ❌ | ✅ | ⭐⭐⭐⭐ | ⚠️ Serverless |
| **Cloud Run** | $300 credit | Cloud SQL | ✅ | ⭐⭐⭐ | ⚠️ Phức tạp |

---

## 🎯 Khuyến nghị

### **Cho người mới:**
→ **PythonAnywhere** - Dễ nhất, hoàn toàn miễn phí

### **Cho production:**
→ **Render.com** - Tốt nhất, free tier tốt, PostgreSQL

### **Cho developer:**
→ **Railway.app** - Nhanh nhất, DX tốt nhất

### **Cho scale:**
→ **Google Cloud Run** - Auto-scale, pay per use

---

## 🔧 Troubleshooting

### **Port binding error**
```python
# Sửa app.py
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### **Database connection error**
```python
# Kiểm tra DATABASE_URL
import os
print(os.environ.get('DATABASE_URL'))
```

### **Module not found**
```bash
# Kiểm tra requirements.txt
pip freeze > requirements.txt
```

### **CORS error**
```python
# Thêm frontend URL vào CORS
CORS(app, origins=['https://your-frontend.com'])
```

---

## 📝 Checklist Deploy

- [ ] Code đã push lên GitHub
- [ ] `requirements.txt` đầy đủ
- [ ] Environment variables đã set
- [ ] Database đã tạo và connect
- [ ] CORS đã config đúng
- [ ] Test API endpoints
- [ ] Check logs nếu có lỗi

---

## 🎉 Hoàn thành!

Sau khi deploy, bạn sẽ có:
- ✅ Backend API public
- ✅ Database persistent
- ✅ Auto-deploy khi push code
- ✅ HTTPS tự động
- ✅ Monitoring và logs

**API URL mẫu:**
- Render: `https://hsk-check-api.onrender.com`
- Railway: `https://hsk-check-api.up.railway.app`
- PythonAnywhere: `https://yourusername.pythonanywhere.com`

**Test API:**
```bash
curl https://your-api-url.com/api/feeds
```

---

**Made with ❤️ by HSK Check Team**