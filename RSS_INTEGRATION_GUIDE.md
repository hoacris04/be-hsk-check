# 📖 Hướng dẫn tích hợp RSS từ Facebook vào Web HSK

## 🎯 Tổng quan

Để thêm một trang Facebook mới vào web, bạn cần:
1. Lấy RSS feed từ trang Facebook qua rss.app
2. Thêm feed vào web bằng tính năng "Thêm nguồn"

---

## 📝 Bước 1: Lấy RSS Feed từ rss.app

### Cách 1: Sử dụng rss.app (Khuyến nghị)

1. **Truy cập rss.app**
   - Vào: https://rss.app

2. **Tạo RSS feed mới**
   - Click nút **"Create Feed"** hoặc **"New Feed"**

3. **Chọn nguồn Facebook**
   - Chọn **"Facebook"** trong danh sách sources
   - Hoặc chọn **"Social Media"** → **"Facebook"**

4. **Nhập link Facebook Page**
   ```
   Ví dụ:
   https://www.facebook.com/profile.php?id=100065248250882
   hoặc
   https://www.facebook.com/HSKTestCenter
   ```

5. **Cấu hình feed (tùy chọn)**
   - **Feed Name**: Đặt tên cho feed (VD: "HSK ĐHQGHN")
   - **Number of items**: Số bài viết tối đa (khuyến nghị: 20-50)
   - **Update frequency**: Tần suất cập nhật (khuyến nghị: Every hour)

6. **Tạo feed**
   - Click **"Create Feed"** hoặc **"Generate"**
   - Đợi vài giây để rss.app xử lý

7. **Lấy JSON Feed URL**
   - Sau khi tạo xong, tìm **"JSON Feed"** URL
   - URL có dạng: `https://rss.app/feeds/v1.1/XXXXXXXXXX.json`
   - Click **"Copy"** để sao chép URL

---

## 🔧 Bước 2: Thêm Feed vào Web

### Cách 1: Qua giao diện web (Dễ nhất)

1. **Mở web HSK**
   - Truy cập web của bạn

2. **Click nút "➕ Thêm nguồn"**
   - Nút màu cam ở thanh controls

3. **Nhập mật khẩu**
   - Mật khẩu: `anhtuandepzai`
   - Click **"Xác nhận"**

4. **Điền thông tin**
   - **Tên nguồn**: VD: "ĐH Khoa học Xã hội"
   - **RSS Feed URL**: Paste URL từ bước 1
   - **Màu gradient**: Chọn 2 màu cho cột (tùy chọn)

5. **Click "Thêm nguồn"**
   - Feed mới sẽ xuất hiện ngay lập tức
   - Dữ liệu tự động được tải

### Cách 2: Thêm trực tiếp vào code

Nếu bạn muốn thêm feed mặc định vào code:

**Mở file `script.js`**, tìm phần `RSS_FEEDS` và thêm:

```javascript
let RSS_FEEDS = loadFeedsFromStorage() || {
    ulis: {
        url: 'https://rss.app/feeds/v1.1/AgH8JEE481LUB8cs.json',
        name: 'ULIS - ĐH Ngoại ngữ ĐHQGHN',
        class: 'source-ulis',
        colors: ['#6366f1', '#8b5cf6']
    },
    hanu: {
        url: 'https://rss.app/feeds/v1.1/8p6E2WY0mwptt3q9.json',
        name: 'HANU - Viện Khổng Tử',
        class: 'source-hanu',
        colors: ['#ec4899', '#f43f5e']
    },
    hnue: {
        url: 'https://rss.app/feeds/v1.1/nGNlg9y9t8HP6Kd8.json',
        name: 'HNUE - ĐH Sư phạm HN',
        class: 'source-hnue',
        colors: ['#06b6d4', '#3b82f6']
    },
    // THÊM FEED MỚI Ở ĐÂY
    khxh: {
        url: 'https://rss.app/feeds/v1.1/YOUR_FEED_ID.json',
        name: 'ĐH Khoa học Xã hội',
        class: 'source-khxh',
        colors: ['#f59e0b', '#ef4444']
    }
};
```

---

## 🎨 Chọn màu gradient đẹp

Một số gợi ý màu gradient hài hòa:

```javascript
// Blue to Purple
colors: ['#6366f1', '#8b5cf6']

// Pink to Red
colors: ['#ec4899', '#f43f5e']

// Cyan to Blue
colors: ['#06b6d4', '#3b82f6']

// Orange to Red
colors: ['#f59e0b', '#ef4444']

// Green to Teal
colors: ['#10b981', '#14b8a6']

// Purple to Pink
colors: ['#a855f7', '#ec4899']

// Yellow to Orange
colors: ['#fbbf24', '#f97316']

// Indigo to Purple
colors: ['#6366f1', '#a855f7']
```

---

## 🔍 Kiểm tra Feed hoạt động

### Test Feed URL

Trước khi thêm vào web, test feed:

1. **Mở URL trong browser**
   ```
   https://rss.app/feeds/v1.1/YOUR_FEED_ID.json
   ```

2. **Kiểm tra JSON response**
   - Phải có `items` array
   - Mỗi item có: `title`, `content_text`, `url`, `date_published`

3. **Ví dụ response hợp lệ:**
   ```json
   {
     "version": "https://jsonfeed.org/version/1.1",
     "title": "Page Name",
     "items": [
       {
         "id": "...",
         "title": "Post title",
         "content_text": "Post content...",
         "url": "https://facebook.com/...",
         "date_published": "2026-05-05T00:00:00.000Z"
       }
     ]
   }
   ```

---

## ⚠️ Xử lý lỗi thường gặp

### Lỗi 1: Feed không load được

**Nguyên nhân:**
- URL sai
- Facebook page bị private
- rss.app chưa cập nhật

**Giải pháp:**
- Kiểm tra lại URL
- Đảm bảo Facebook page là Public
- Đợi vài phút để rss.app cập nhật

### Lỗi 2: CORS Error

**Nguyên nhân:**
- Browser block request từ domain khác

**Giải pháp:**
- rss.app đã enable CORS, không cần lo
- Nếu vẫn lỗi, dùng proxy hoặc deploy lên server

### Lỗi 3: Không có bài viết

**Nguyên nhân:**
- Facebook page chưa có bài viết mới
- rss.app chưa crawl được

**Giải pháp:**
- Đợi page đăng bài mới
- Kiểm tra lại URL feed

---

## 📊 Giới hạn của rss.app

### Free Plan:
- ✅ Unlimited feeds
- ✅ Update mỗi giờ
- ✅ 50 items per feed
- ❌ Không có webhook
- ❌ Không có custom domain

### Paid Plan ($9/month):
- ✅ Update mỗi 15 phút
- ✅ 100 items per feed
- ✅ Webhook support
- ✅ Custom domain
- ✅ Priority support

---

## 🚀 Tips & Tricks

### 1. Tối ưu số lượng items
```javascript
// Trong rss.app settings
Number of items: 20-30 (đủ dùng, load nhanh)
```

### 2. Tần suất cập nhật
```javascript
// Free plan: Mỗi giờ (đủ cho HSK)
// Paid plan: Mỗi 15 phút (nếu cần real-time)
```

### 3. Backup feeds
```javascript
// Xuất settings thường xuyên
Click ⚙️ → Xuất cài đặt
```

### 4. Chia sẻ feeds
```javascript
// Tạo link chia sẻ
Click ⚙️ → Sao chép link chia sẻ
```

---

## 📱 Tích hợp nâng cao

### Webhook (Paid plan)

Nếu có paid plan, có thể setup webhook:

```javascript
// rss.app webhook URL
https://your-domain.com/webhook

// Payload khi có bài mới
{
  "feed_id": "...",
  "item": {
    "title": "...",
    "url": "...",
    "date_published": "..."
  }
}
```

### Custom RSS Parser

Nếu muốn tự parse RSS:

```javascript
// Thêm vào script.js
async function fetchCustomRSS(url) {
    const response = await fetch(url);
    const xml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Parse XML to JSON
    const items = Array.from(doc.querySelectorAll('item')).map(item => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        pubDate: item.querySelector('pubDate').textContent,
        description: item.querySelector('description').textContent
    }));
    
    return items;
}
```

---

## 🎓 Ví dụ thực tế

### Thêm trang HSK mới

**Trang Facebook:**
```
https://www.facebook.com/HSKTestVietnam
```

**Các bước:**

1. Vào rss.app → Create Feed
2. Paste link Facebook
3. Lấy JSON URL: `https://rss.app/feeds/v1.1/ABC123.json`
4. Vào web HSK → Click ➕ Thêm nguồn
5. Nhập mật khẩu: `anhtuandepzai`
6. Điền:
   - Tên: "HSK Test Vietnam"
   - URL: `https://rss.app/feeds/v1.1/ABC123.json`
   - Màu: Chọn gradient đẹp
7. Click "Thêm nguồn"
8. Done! ✅

---

## 📞 Hỗ trợ

**Nếu gặp vấn đề:**

1. Check console (F12) xem có lỗi gì
2. Test feed URL trực tiếp trong browser
3. Kiểm tra Facebook page có public không
4. Thử tạo lại feed trên rss.app

**Liên hệ rss.app:**
- Website: https://rss.app
- Support: support@rss.app
- Docs: https://rss.app/docs

---

## ✅ Checklist

Trước khi thêm feed mới:

- [ ] Facebook page là Public
- [ ] Đã tạo feed trên rss.app
- [ ] Đã test JSON URL trong browser
- [ ] JSON có `items` array
- [ ] Đã chuẩn bị tên và màu gradient
- [ ] Biết mật khẩu: `anhtuandepzai`

---

**Chúc bạn tích hợp thành công! 🎉**