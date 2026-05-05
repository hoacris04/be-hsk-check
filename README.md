# 🎓 Tra cứu lịch thi HSK

Web application để tra cứu thông tin lịch thi HSK từ các điểm thi chính thức tại Hà Nội.

## 📋 Tính năng

### 🎯 Core Features
- ✅ Hiển thị thông tin lịch thi từ 3 điểm thi HSK:
  - **ULIS** - Đại học Ngoại ngữ, ĐHQGHN
  - **HANU** - Viện Khổng Tử tại Đại học Hà Nội
  - **HNUE** - Đại học Sư phạm Hà Nội

- 🔍 **Tìm kiếm**: Tìm kiếm thông tin theo từ khóa
- 🎯 **Lọc theo nguồn**: Xem thông tin từ từng điểm thi riêng biệt
- 🔄 **Tự động cập nhật**: Dữ liệu được làm mới mỗi 5 phút
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị

### 🌟 Advanced Features
- 🌙 **Dark Mode**: Chế độ tối bảo vệ mắt
- ⭐ **Bookmarks**: Đánh dấu bài viết quan trọng
- 🔔 **Browser Notifications**: Thông báo bài viết mới
- 📧 **Email Notifications**: Nhận email khi có bài mới (EmailJS)
- 🔗 **Clickable Sources**: Click tên nguồn để mở Facebook Page
- ➕ **Add Sources**: Thêm nguồn RSS mới (password-protected)
- ⚙️ **Settings Management**: Export/Import/Share cài đặt
- 📖 **In-app Guide**: Hướng dẫn tích hợp RSS

## 🚀 Cách sử dụng

### Chạy trực tiếp

1. Mở file `index.html` bằng trình duyệt web
2. Ứng dụng sẽ tự động tải dữ liệu từ các nguồn RSS

### Chạy với Live Server (khuyến nghị)

1. Cài đặt extension "Live Server" trong VS Code
2. Click chuột phải vào `index.html` và chọn "Open with Live Server"
3. Ứng dụng sẽ mở tại `http://localhost:5500`

### Cài đặt Email Notification (Optional)

Để sử dụng tính năng nhận email:

1. Xem hướng dẫn chi tiết trong file `EMAILJS_SETUP.md`
2. Đăng ký tài khoản EmailJS (miễn phí)
3. Cấu hình Service ID, Template ID, và Public Key trong `script.js`
4. Test bằng cách đăng ký email trong web

## 📁 Cấu trúc dự án

```
vibe-check-hsk/
├── index.html              # Trang chính
├── style.css               # Stylesheet
├── script.js               # Logic ứng dụng
├── cookies.js              # Cookie management
├── README.md               # Tài liệu chính
├── EMAILJS_SETUP.md        # Hướng dẫn cài đặt EmailJS
├── RSS_INTEGRATION_GUIDE.md # Hướng dẫn tích hợp RSS
├── FEATURE_IDEAS.md        # Ý tưởng tính năng
└── DEPLOY.md               # Hướng dẫn deploy
```

## 🔧 Công nghệ sử dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling với gradient, animations, responsive design
- **Vanilla JavaScript**: Fetch API, DOM manipulation, LocalStorage
- **RSS.app API**: Nguồn dữ liệu từ Facebook pages
- **EmailJS**: Gửi email notification (optional)
- **Browser APIs**: Notification API, Clipboard API

## 📊 Nguồn dữ liệu

Dữ liệu được lấy từ các trang Facebook chính thức thông qua RSS feeds:

1. **ULIS**: https://rss.app/feeds/v1.1/AgH8JEE481LUB8cs.json
2. **HANU**: https://rss.app/feeds/v1.1/8p6E2WY0mwptt3q9.json
3. **HNUE**: https://rss.app/feeds/v1.1/nGNlg9y9t8HP6Kd8.json

## 🎯 Hướng dẫn sử dụng các tính năng

### 🔍 Tìm kiếm
- Nhập từ khóa vào ô tìm kiếm để lọc bài viết
- Tìm kiếm theo tiêu đề và nội dung bài viết

### 🎯 Lọc theo nguồn
- Tick/untick checkbox để ẩn/hiện cột
- **ULIS**: Chỉ hiển thị bài viết từ ĐH Ngoại ngữ
- **HANU**: Chỉ hiển thị bài viết từ Viện Khổng Tử
- **HNUE**: Chỉ hiển thị bài viết từ ĐH Sư phạm

### 🌙 Dark Mode
- Click nút **🌙** để bật/tắt chế độ tối
- Tự động lưu preference

### ⭐ Bookmarks
- Click **☆** trên bài viết để đánh dấu
- Click nút **⭐** để xem tất cả bài đã lưu
- Có thể xóa bookmark bất cứ lúc nào

### 🔔 Browser Notifications
- Click nút **🔔** để bật thông báo
- Nhận thông báo khi có bài viết mới
- Cần cho phép notification trong browser

### 📧 Email Notifications
- Click nút **📧** để đăng ký nhận email
- Chọn tần suất: Ngay lập tức / Hàng ngày / Hàng tuần
- Nhận email khi có bài viết mới về lịch thi
- **Lưu ý**: Cần cấu hình EmailJS (xem `EMAILJS_SETUP.md`)

### 📖 Hướng dẫn tích hợp RSS
- Click nút **📖** để xem hướng dẫn
- Học cách thêm nguồn RSS từ Facebook Page
- Có preview màu gradient và tips

### ➕ Thêm nguồn mới
- Click nút **➕ Thêm nguồn**
- Nhập mật khẩu: `anhtuandepzai`
- Điền thông tin nguồn RSS mới
- Chọn màu gradient đẹp

### ⚙️ Settings
- Export/Import cài đặt
- Chia sẻ cài đặt qua link
- Xóa tất cả dữ liệu

### 🔄 Làm mới dữ liệu
- Click nút **🔄 Làm mới** để cập nhật ngay
- Tự động làm mới mỗi 5 phút

## 🎨 Giao diện

- **Gradient background**: Màu sắc gradient đẹp mắt
- **Card design**: Mỗi bài viết được hiển thị dạng card
- **Hover effects**: Hiệu ứng khi di chuột
- **Smooth animations**: Chuyển động mượt mà
- **Mobile responsive**: Tối ưu cho điện thoại

## 📝 Lưu ý

- Cần kết nối internet để tải dữ liệu
- Dữ liệu phụ thuộc vào RSS feeds từ rss.app
- Nếu không tải được dữ liệu, thử làm mới trang hoặc kiểm tra kết nối

## 🐛 Xử lý lỗi

Ứng dụng có xử lý các trường hợp:
- Không có kết nối internet
- RSS feed không khả dụng
- Không có dữ liệu
- Lỗi khi tải ảnh

## 🔮 Phát triển tương lai

- [ ] Thêm thông báo khi có bài viết mới
- [ ] Lưu bài viết yêu thích
- [ ] Xuất dữ liệu ra PDF
- [ ] Thêm chế độ dark mode
- [ ] Thêm nhiều điểm thi khác

## 👨‍💻 Tác giả

Được phát triển để hỗ trợ sinh viên tra cứu lịch thi HSK dễ dàng hơn.

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.

---

**Chúc các bạn thi tốt! 🎉**