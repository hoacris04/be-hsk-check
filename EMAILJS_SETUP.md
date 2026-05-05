# 📧 Hướng dẫn cài đặt Email Notification với EmailJS

## 🎯 Tổng quan

EmailJS là dịch vụ miễn phí cho phép gửi email trực tiếp từ JavaScript mà không cần backend server. Hoàn hảo cho static website!

---

## 📝 Bước 1: Đăng ký tài khoản EmailJS

1. Truy cập: https://www.emailjs.com/
2. Click **"Sign Up"** (góc trên bên phải)
3. Đăng ký bằng:
   - Email
   - Google
   - GitHub
4. Xác nhận email (nếu đăng ký bằng email)

---

## ⚙️ Bước 2: Tạo Email Service

1. Đăng nhập vào EmailJS Dashboard
2. Click **"Email Services"** ở sidebar
3. Click **"Add New Service"**
4. Chọn email provider:
   - **Gmail** (khuyến nghị - miễn phí)
   - Outlook
   - Yahoo
   - Custom SMTP
5. Với Gmail:
   - Click **"Connect Account"**
   - Đăng nhập Gmail của bạn
   - Cho phép EmailJS truy cập
6. Đặt tên service (ví dụ: `hsk_notification`)
7. Click **"Create Service"**
8. **Lưu lại Service ID** (dạng: `service_xxxxxxx`)

---

## 📧 Bước 3: Tạo Email Template

1. Click **"Email Templates"** ở sidebar
2. Click **"Create New Template"**
3. Cấu hình template:

### Template Settings:
- **Template Name**: `HSK Notification`
- **Template ID**: Tự động tạo (lưu lại ID này)

### Email Content:
```
Subject: {{subject}}

To: {{to_email}}

Content:
{{message}}

---
HSK Check - Tra cứu lịch thi HSK
```

### Template Variables:
- `{{to_name}}` - Tên người nhận
- `{{to_email}}` - Email người nhận
- `{{subject}}` - Tiêu đề email
- `{{message}}` - Nội dung email

4. Click **"Save"**
5. **Lưu lại Template ID** (dạng: `template_xxxxxxx`)

---

## 🔑 Bước 4: Lấy Public Key

1. Click **"Account"** ở sidebar
2. Tìm mục **"API Keys"**
3. Copy **Public Key** (dạng: `xxxxxxxxxxxxxxxx`)

---

## 💻 Bước 5: Cấu hình trong code

Mở file `script.js` và thay đổi 3 dòng sau:

```javascript
// Dòng 4-6 trong script.js
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';  // Thay bằng Public Key
const EMAILJS_SERVICE_ID = 'service_xxxxxxx';       // Thay bằng Service ID
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';     // Thay bằng Template ID
```

### Ví dụ:
```javascript
const EMAILJS_PUBLIC_KEY = 'abcdef123456789';
const EMAILJS_SERVICE_ID = 'service_hsk2024';
const EMAILJS_TEMPLATE_ID = 'template_notification';
```

---

## ✅ Bước 6: Test Email

1. Mở web trong browser
2. Click nút **📧** (Email)
3. Điền thông tin:
   - Họ tên
   - Email của bạn
   - Chọn tần suất
   - Tick đồng ý
4. Click **"Đăng ký"**
5. Kiểm tra email (cả inbox và spam)

---

## 📊 Free Plan Limits

EmailJS Free Plan:
- ✅ **200 emails/tháng** (đủ dùng)
- ✅ **2 email services**
- ✅ **2 email templates**
- ✅ Không cần credit card
- ✅ Không giới hạn số lượng user

---

## 🎯 Cách hoạt động

### 1. **Immediate (Ngay lập tức)**
- Gửi email ngay khi có bài viết mới
- Phù hợp cho người cần cập nhật real-time

### 2. **Daily (Hàng ngày)**
- Tổng hợp tất cả bài viết trong ngày
- Gửi 1 email/ngày (tiết kiệm quota)

### 3. **Weekly (Hàng tuần)**
- Tổng hợp tất cả bài viết trong tuần
- Gửi 1 email/tuần (tiết kiệm nhất)

---

## 🔧 Troubleshooting

### ❌ Lỗi: "EmailJS not configured"
**Nguyên nhân:** Chưa thay đổi config trong script.js
**Giải pháp:** Kiểm tra lại 3 constants: PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID

### ❌ Không nhận được email
**Kiểm tra:**
1. Email có trong spam không?
2. Service ID và Template ID đúng chưa?
3. Gmail có bật "Less secure app access" không? (nếu dùng Gmail)
4. Quota còn không? (xem trong EmailJS Dashboard)

### ❌ Lỗi 403 Forbidden
**Nguyên nhân:** Public Key sai hoặc service chưa active
**Giải pháp:** 
1. Copy lại Public Key từ Dashboard
2. Kiểm tra service đã "Connected" chưa

---

## 🎨 Tùy chỉnh Email Template

### Thêm logo:
```html
<img src="https://your-domain.com/logo.png" alt="Logo" style="width: 100px;">
```

### Thêm button:
```html
<a href="{{website_url}}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Xem chi tiết
</a>
```

### Thêm styling:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #6366f1;">{{subject}}</h2>
    <p>{{message}}</p>
</div>
```

---

## 📈 Nâng cấp (Optional)

Nếu cần nhiều email hơn:

| Plan | Emails/tháng | Giá |
|------|--------------|-----|
| Free | 200 | $0 |
| Personal | 1,000 | $7/tháng |
| Professional | 10,000 | $25/tháng |

---

## 🔗 Links hữu ích

- **EmailJS Dashboard**: https://dashboard.emailjs.com/
- **Documentation**: https://www.emailjs.com/docs/
- **Examples**: https://www.emailjs.com/docs/examples/
- **Support**: support@emailjs.com

---

## 💡 Tips

1. **Dùng Gmail riêng** cho EmailJS (không dùng email chính)
2. **Test kỹ** trước khi deploy
3. **Monitor quota** trong Dashboard
4. **Backup config** (Service ID, Template ID, Public Key)
5. **Không commit** Public Key lên GitHub public repo

---

## 🎉 Hoàn thành!

Sau khi setup xong:
- ✅ User có thể đăng ký nhận email
- ✅ Tự động gửi email khi có bài mới
- ✅ Chọn được tần suất nhận email
- ✅ Có thể hủy đăng ký bất cứ lúc nào

**Chúc bạn thành công! 🚀**