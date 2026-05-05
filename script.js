// Password for adding sources
const ADMIN_PASSWORD = 'anhtuandepzai';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your EmailJS public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID

// RSS Feed URLs - Load from localStorage or use defaults
let RSS_FEEDS = loadFeedsFromStorage() || {
    ulis: {
        url: 'https://rss.app/feeds/v1.1/AgH8JEE481LUB8cs.json',
        name: 'ULIS - ĐH Ngoại ngữ ĐHQGHN',
        class: 'source-ulis',
        colors: ['#667eea', '#764ba2'],
        pageUrl: 'https://www.facebook.com/profile.php?id=100065248250882'
    },
    hanu: {
        url: 'https://rss.app/feeds/v1.1/8p6E2WY0mwptt3q9.json',
        name: 'HANU - Viện Khổng Tử',
        class: 'source-hanu',
        colors: ['#f093fb', '#f5576c'],
        pageUrl: ''
    },
    hnue: {
        url: 'https://rss.app/feeds/v1.1/nGNlg9y9t8HP6Kd8.json',
        name: 'HNUE - ĐH Sư phạm HN',
        class: 'source-hnue',
        colors: ['#4facfe', '#00f2fe'],
        pageUrl: ''
    }
};

let allPosts = {};
let visibleColumns = {};
let searchQuery = '';
let isPasswordVerified = false;
let bookmarks = JSON.parse(localStorage.getItem('hsk_bookmarks')) || [];
let lastPostIds = JSON.parse(localStorage.getItem('hsk_last_posts')) || {};
let notificationsEnabled = localStorage.getItem('hsk_notifications') === 'true';
let emailSubscription = JSON.parse(localStorage.getItem('hsk_email_subscription')) || null;
let pendingEmailPosts = JSON.parse(localStorage.getItem('hsk_pending_email_posts')) || [];

// Initialize posts and visibility for all sources
function initializeSources() {
    Object.keys(RSS_FEEDS).forEach(key => {
        allPosts[key] = [];
        visibleColumns[key] = true;
    });
}

// Dark Mode functions
function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton(true);
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeButton(isDark);
}

function updateDarkModeButton(isDark) {
    const btn = document.getElementById('darkModeToggle');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Chế độ sáng' : 'Chế độ tối';
}

// Bookmark functions
function toggleBookmark(postId, postData) {
    const index = bookmarks.findIndex(b => b.id === postId);
    
    if (index > -1) {
        bookmarks.splice(index, 1);
        showMessage('❌ Đã xóa khỏi danh sách lưu', 'info');
    } else {
        bookmarks.push({
            id: postId,
            ...postData,
            savedAt: new Date().toISOString()
        });
        showMessage('⭐ Đã lưu bài viết', 'success');
    }
    
    localStorage.setItem('hsk_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtons();
}

function isBookmarked(postId) {
    return bookmarks.some(b => b.id === postId);
}

function updateBookmarkButtons() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const postId = btn.dataset.postId;
        if (isBookmarked(postId)) {
            btn.classList.add('bookmarked');
            btn.textContent = '⭐';
        } else {
            btn.classList.remove('bookmarked');
            btn.textContent = '☆';
        }
    });
}

function showBookmarks() {
    const modal = document.getElementById('bookmarksModal');
    const list = document.getElementById('bookmarksList');
    
    if (bookmarks.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">Chưa có bài viết nào được lưu</p>';
    } else {
        list.innerHTML = bookmarks.map(post => `
            <div class="bookmark-item">
                <h3>${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(post.content.substring(0, 150))}...</p>
                <small style="color: var(--text-secondary);">Lưu lúc: ${new Date(post.savedAt).toLocaleString('vi-VN')}</small>
                <div class="bookmark-actions">
                    <button class="view-btn" onclick="window.open('${post.url}', '_blank')">Xem bài viết</button>
                    <button class="remove-btn" onclick="removeBookmark('${post.id}')">Xóa</button>
                </div>
            </div>
        `).join('');
    }
    
    modal.style.display = 'block';
}

function removeBookmark(postId) {
    toggleBookmark(postId, null);
    showBookmarks();
}

// Notification functions
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notificationsEnabled = true;
                localStorage.setItem('hsk_notifications', 'true');
                showMessage('🔔 Đã bật thông báo', 'success');
                updateNotificationButton();
            }
        });
    } else if (Notification.permission === 'granted') {
        notificationsEnabled = !notificationsEnabled;
        localStorage.setItem('hsk_notifications', notificationsEnabled);
        showMessage(notificationsEnabled ? '🔔 Đã bật thông báo' : '🔕 Đã tắt thông báo', 'info');
        updateNotificationButton();
    } else {
        showMessage('❌ Trình duyệt không hỗ trợ thông báo', 'error');
    }
}

function updateNotificationButton() {
    const btn = document.getElementById('notificationsBtn');
    if (notificationsEnabled) {
        btn.classList.add('active');
        btn.title = 'Tắt thông báo';
    } else {
        btn.classList.remove('active');
        btn.title = 'Bật thông báo';
    }
}

function checkForNewPosts(source, posts) {
    const lastId = lastPostIds[source];
    if (!lastId || posts.length === 0) {
        lastPostIds[source] = posts[0]?.id;
        lastPostIds[source + '_date'] = posts[0]?.date;
        localStorage.setItem('hsk_last_posts', JSON.stringify(lastPostIds));
        return;
    }
    
    const newPosts = [];
    for (const post of posts) {
        if (post.id === lastId) break;
        newPosts.push(post);
    }
    
    if (newPosts.length > 0) {
        // Browser notification
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            const feed = RSS_FEEDS[source];
            new Notification('🎓 Bài viết mới về HSK!', {
                body: `${feed.name} vừa đăng ${newPosts.length} bài viết mới`,
                icon: '/favicon.ico',
                tag: source
            });
            
            // Add visual indicator
            const btn = document.getElementById('notificationsBtn');
            btn.classList.add('has-new');
            setTimeout(() => btn.classList.remove('has-new'), 5000);
        }
        
        // Email notification
        checkForEmailNotification(source, newPosts);
        
        lastPostIds[source] = posts[0].id;
        lastPostIds[source + '_date'] = posts[0].date;
        localStorage.setItem('hsk_last_posts', JSON.stringify(lastPostIds));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Try to load settings from URL first
    const loadedFromURL = SettingsManager.loadFromURL();
    
    // Then load from cookies/localStorage
    if (!loadedFromURL) {
        SettingsManager.loadSettings();
    }
    
    initializeSources();
    initDarkMode();
    setupEventListeners();
    renderColumns();
    updateNotificationButton();
    loadAllFeeds();
});

// Copy shareable link function
function copyShareLink() {
    const link = SettingsManager.getShareableLink();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
            showMessage('✅ Đã sao chép link chia sẻ!', 'success');
        }).catch(() => {
            fallbackCopyText(link);
        });
    } else {
        fallbackCopyText(link);
    }
}

// Fallback copy method
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showMessage('✅ Đã sao chép link chia sẻ!', 'success');
    } catch (err) {
        showMessage('❌ Không thể sao chép link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterAndDisplayPosts();
    });

    // Column toggle checkboxes
    const toggles = document.querySelectorAll('.column-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const source = e.target.dataset.source;
            visibleColumns[source] = e.target.checked;
            toggleColumn(source, e.target.checked);
        });
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Bookmarks button
    document.getElementById('bookmarksBtn').addEventListener('click', showBookmarks);
    document.getElementById('closeBookmarks').addEventListener('click', () => {
        document.getElementById('bookmarksModal').style.display = 'none';
    });

    // Notifications button
    document.getElementById('notificationsBtn').addEventListener('click', requestNotificationPermission);

    // Email button
    document.getElementById('emailBtn').addEventListener('click', showEmailModal);
    document.getElementById('closeEmail').addEventListener('click', () => {
        document.getElementById('emailModal').style.display = 'none';
    });
    
    // Email form submission
    document.getElementById('emailSubscribeForm').addEventListener('submit', subscribeEmail);

    // Guide button
    document.getElementById('guideBtn').addEventListener('click', () => {
        document.getElementById('guideModal').style.display = 'block';
    });
    
    document.getElementById('closeGuide').addEventListener('click', () => {
        document.getElementById('guideModal').style.display = 'none';
    });

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'block';
    });
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });

    // Import file handler
    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            SettingsManager.importSettings(file);
        }
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', () => {
        loadAllFeeds();
    });

    // Add source button
    const addSourceBtn = document.getElementById('addSourceBtn');
    const modal = document.getElementById('addSourceModal');
    const closeBtn = document.querySelector('.close');

    addSourceBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        isPasswordVerified = false;
        document.getElementById('addSourceForm').style.display = 'none';
        document.getElementById('verifyPasswordBtn').style.display = 'block';
        document.getElementById('passwordInput').value = '';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === document.getElementById('bookmarksModal')) {
            document.getElementById('bookmarksModal').style.display = 'none';
        }
        if (e.target === document.getElementById('guideModal')) {
            document.getElementById('guideModal').style.display = 'none';
        }
        if (e.target === document.getElementById('settingsModal')) {
            document.getElementById('settingsModal').style.display = 'none';
        }
    });

    // Verify password
    const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
    verifyPasswordBtn.addEventListener('click', verifyPassword);

    // Submit new source
    const submitSourceBtn = document.getElementById('submitSourceBtn');
    submitSourceBtn.addEventListener('click', addNewSource);

    // Enter key for password
    document.getElementById('passwordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
}

// Verify password
function verifyPassword() {
    const password = document.getElementById('passwordInput').value;
    
    if (password === ADMIN_PASSWORD) {
        isPasswordVerified = true;
        document.getElementById('addSourceForm').style.display = 'block';
        document.getElementById('verifyPasswordBtn').style.display = 'none';
        showMessage('✅ Xác thực thành công!', 'success');
    } else {
        showMessage('❌ Mật khẩu không đúng!', 'error');
    }
}

// Add new source
function addNewSource() {
    const name = document.getElementById('sourceNameInput').value.trim();
    const feedUrl = document.getElementById('sourceFeedInput').value.trim();
    const color1 = document.getElementById('color1Input').value;
    const color2 = document.getElementById('color2Input').value;

    if (!name || !feedUrl) {
        showMessage('❌ Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    // Generate unique key
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (RSS_FEEDS[key]) {
        showMessage('❌ Nguồn này đã tồn tại!', 'error');
        return;
    }

    // Add new feed
    RSS_FEEDS[key] = {
        url: feedUrl,
        name: name,
        class: `source-${key}`,
        colors: [color1, color2]
    };

    // Save to localStorage
    saveFeedsToStorage();

    // Initialize for new source
    allPosts[key] = [];
    visibleColumns[key] = true;

    // Add dynamic CSS for gradient
    addDynamicStyle(key, color1, color2);

    // Re-render columns
    renderColumns();
    renderToggleButtons();

    // Load data for new source
    fetchFeed(key, feedUrl, name, `source-${key}`);

    // Close modal
    document.getElementById('addSourceModal').style.display = 'none';
    
    showMessage('✅ Đã thêm nguồn mới thành công!', 'success');
    
    // Clear form
    document.getElementById('sourceNameInput').value = '';
    document.getElementById('sourceFeedInput').value = '';
}

// Show message
function showMessage(message, type) {
    const existingMsg = document.querySelector('.temp-message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `temp-message ${type}`;
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(msgDiv);

    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Toggle column visibility
function toggleColumn(source, visible) {
    const column = document.getElementById(`column-${source}`);
    if (column) {
        if (visible) {
            column.classList.remove('hidden');
        } else {
            column.classList.add('hidden');
        }
    }
}

// Save feeds to localStorage
function saveFeedsToStorage() {
    localStorage.setItem('hsk_feeds', JSON.stringify(RSS_FEEDS));
}

// Load feeds from localStorage
function loadFeedsFromStorage() {
    const saved = localStorage.getItem('hsk_feeds');
    return saved ? JSON.parse(saved) : null;
}

// Add dynamic CSS style
function addDynamicStyle(key, color1, color2) {
    const style = document.createElement('style');
    style.textContent = `
        .source-${key} {
            background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
        }
    `;
    document.head.appendChild(style);
}

// Render columns dynamically
function renderColumns() {
    const container = document.querySelector('.columns-container');
    container.innerHTML = '';

    Object.entries(RSS_FEEDS).forEach(([key, feed]) => {
        const column = document.createElement('div');
        column.className = 'column';
        column.id = `column-${key}`;
        
        // Create header with clickable name if pageUrl exists
        const headerContent = feed.pageUrl
            ? `<h2><a href="${feed.pageUrl}" target="_blank" rel="noopener noreferrer" class="source-link">${feed.name}</a></h2>`
            : `<h2>${feed.name}</h2>`;
        
        column.innerHTML = `
            <div class="column-header ${feed.class}">
                ${headerContent}
            </div>
            <div class="column-posts" id="posts-${key}"></div>
        `;
        container.appendChild(column);

        // Add dynamic style if colors exist
        if (feed.colors) {
            addDynamicStyle(key, feed.colors[0], feed.colors[1]);
        }
    });
}

// Render toggle buttons dynamically
function renderToggleButtons() {
    const container = document.querySelector('.toggle-buttons');
    container.innerHTML = '';

    Object.entries(RSS_FEEDS).forEach(([key, feed]) => {
        const label = document.createElement('label');
        label.className = 'toggle-label';
        label.innerHTML = `
            <input type="checkbox" class="column-toggle" data-source="${key}" checked>
            <span class="toggle-text">${feed.name.split('-')[0].trim()}</span>
        `;
        container.appendChild(label);

        // Add event listener
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            visibleColumns[key] = e.target.checked;
            toggleColumn(key, e.target.checked);
        });
    });
}

// Load all RSS feeds
async function loadAllFeeds() {
    showLoading(true);
    hideError();
    
    // Reset all posts
    allPosts = {
        ulis: [],
        hanu: [],
        hnue: []
    };

    try {
        const promises = Object.entries(RSS_FEEDS).map(([key, feed]) =>
            fetchFeed(key, feed.url, feed.name, feed.class)
        );

        await Promise.all(promises);

        const totalPosts = Object.values(allPosts).reduce((sum, arr) => sum + arr.length, 0);
        
        if (totalPosts === 0) {
            showError();
        } else {
            // Sort posts in each column by date (newest first)
            Object.keys(allPosts).forEach(source => {
                allPosts[source].sort((a, b) => new Date(b.date) - new Date(a.date));
            });
            filterAndDisplayPosts();
            updateLastUpdateTime();
        }
    } catch (error) {
        console.error('Error loading feeds:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

// Fetch individual feed
async function fetchFeed(source, url, sourceName, sourceClass) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Update pageUrl from feed data if available and not already set
        if (data.home_page_url && (!RSS_FEEDS[source].pageUrl || RSS_FEEDS[source].pageUrl === '')) {
            RSS_FEEDS[source].pageUrl = data.home_page_url;
            saveFeedsToStorage();
            // Re-render columns to update the link
            renderColumns();
        }
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
                allPosts[source].push({
                    id: item.id,
                    source: source,
                    sourceName: sourceName,
                    sourceClass: sourceClass,
                    title: item.title || 'Không có tiêu đề',
                    content: item.content_text || item.content_html || '',
                    url: item.url,
                    image: item.image || (item.attachments && item.attachments[0]?.url),
                    date: item.date_published || new Date().toISOString()
                });
            });
            
            // Check for new posts and notify
            checkForNewPosts(source, allPosts[source]);
        }
    } catch (error) {
        console.error(`Error fetching ${sourceName}:`, error);
    }
}

// Filter and display posts
function filterAndDisplayPosts() {
    Object.keys(allPosts).forEach(source => {
        displayPostsInColumn(source, allPosts[source]);
    });
}

// Display posts in a specific column
function displayPostsInColumn(source, posts) {
    const columnPosts = document.getElementById(`posts-${source}`);
    if (!columnPosts) return;

    // Apply search filter
    let filteredPosts = posts;
    if (searchQuery) {
        filteredPosts = posts.filter(post => {
            const searchText = `${post.title} ${post.content}`.toLowerCase();
            return searchText.includes(searchQuery);
        });
    }

    if (filteredPosts.length === 0) {
        columnPosts.innerHTML = `
            <div class="no-posts">
                ${searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có bài viết'}
            </div>
        `;
        return;
    }

    columnPosts.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    updateBookmarkButtons();
}

// Create post card HTML
function createPostCard(post) {
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Truncate content if too long
    let displayContent = post.content;
    const maxLength = 300;
    if (displayContent.length > maxLength) {
        displayContent = displayContent.substring(0, maxLength) + '...';
    }

    // Remove HTML tags from content for display
    displayContent = displayContent.replace(/<[^>]*>/g, '');

    const bookmarked = isBookmarked(post.id);

    return `
        <div class="post-card" data-source="${post.source}">
            <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}"
                    data-post-id="${post.id}"
                    onclick='toggleBookmark("${post.id}", ${JSON.stringify(post).replace(/'/g, "'")})'>
                ${bookmarked ? '⭐' : '☆'}
            </button>
            <div class="post-header">
                <span class="post-date">📅 ${formattedDate}</span>
            </div>
            <h2 class="post-title">${escapeHtml(post.title)}</h2>
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" onerror="this.style.display='none'">` : ''}
            <div class="post-content">${escapeHtml(displayContent)}</div>
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="post-link">
                📖 Xem chi tiết
            </a>
        </div>
    `;
}

// Utility functions
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

function showError() {
    const error = document.getElementById('error');
    error.style.display = 'block';
}

function hideError() {
    const error = document.getElementById('error');
    error.style.display = 'none';
}

function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    const now = new Date();
    lastUpdate.textContent = now.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// EMAIL NOTIFICATION FUNCTIONS
// ============================================

// Initialize EmailJS
function initEmailJS() {
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}

// Show email modal
function showEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.style.display = 'block';
    updateEmailStatus();
}

// Update email status display
function updateEmailStatus() {
    const statusDiv = document.getElementById('emailStatus');
    const emailBtn = document.getElementById('emailBtn');
    
    if (emailSubscription) {
        statusDiv.className = 'email-status subscribed';
        statusDiv.innerHTML = `
            <p>✅ Đã đăng ký nhận email</p>
            <p style="font-size: 0.9em; margin-top: 5px;">
                Email: <strong>${emailSubscription.email}</strong><br>
                Tần suất: <strong>${getFrequencyText(emailSubscription.frequency)}</strong>
            </p>
        `;
        emailBtn.style.background = 'var(--success-color)';
        emailBtn.style.color = 'white';
    } else {
        statusDiv.className = 'email-status';
        statusDiv.innerHTML = '<p>Đăng ký email để nhận thông báo khi có bài viết mới về lịch thi HSK</p>';
        emailBtn.style.background = '';
        emailBtn.style.color = '';
    }
}

// Get frequency text
function getFrequencyText(frequency) {
    const texts = {
        'immediate': 'Ngay lập tức',
        'daily': 'Hàng ngày',
        'weekly': 'Hàng tuần'
    };
    return texts[frequency] || frequency;
}

// Subscribe email
async function subscribeEmail(e) {
    e.preventDefault();
    
    const name = document.getElementById('subscriberName').value.trim();
    const email = document.getElementById('subscriberEmail').value.trim();
    const frequency = document.getElementById('emailFrequency').value;
    const consent = document.getElementById('emailConsent').checked;
    
    if (!name || !email || !consent) {
        showMessage('❌ Vui lòng điền đầy đủ thông tin và đồng ý điều khoản', 'error');
        return;
    }
    
    // Check if EmailJS is configured
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        showMessage('⚠️ EmailJS chưa được cấu hình. Vui lòng xem hướng dẫn trong README.md', 'error');
        return;
    }
    
    // Save subscription
    emailSubscription = {
        name: name,
        email: email,
        frequency: frequency,
        subscribedAt: new Date().toISOString()
    };
    
    localStorage.setItem('hsk_email_subscription', JSON.stringify(emailSubscription));
    
    // Send welcome email
    try {
        await sendWelcomeEmail(name, email);
        showMessage('✅ Đăng ký thành công! Kiểm tra email của bạn.', 'success');
        updateEmailStatus();
        
        // Clear form
        document.getElementById('emailSubscribeForm').reset();
    } catch (error) {
        console.error('Error sending welcome email:', error);
        showMessage('✅ Đăng ký thành công! (Email xác nhận có thể gửi sau)', 'success');
        updateEmailStatus();
    }
}

// Unsubscribe email
function unsubscribeEmail() {
    if (!emailSubscription) {
        showMessage('❌ Bạn chưa đăng ký nhận email', 'error');
        return;
    }
    
    if (confirm('Bạn có chắc muốn hủy đăng ký nhận email?')) {
        emailSubscription = null;
        pendingEmailPosts = [];
        localStorage.removeItem('hsk_email_subscription');
        localStorage.removeItem('hsk_pending_email_posts');
        updateEmailStatus();
        showMessage('✅ Đã hủy đăng ký nhận email', 'success');
    }
}

// Send welcome email
async function sendWelcomeEmail(name, email) {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        throw new Error('EmailJS not configured');
    }
    
    const templateParams = {
        to_name: name,
        to_email: email,
        subject: 'Chào mừng đến với HSK Check!',
        message: `Xin chào ${name},\n\nCảm ơn bạn đã đăng ký nhận thông báo về lịch thi HSK.\n\nBạn sẽ nhận được email khi có thông tin mới từ các điểm thi.\n\nTrân trọng,\nHSK Check Team`
    };
    
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

// Check for new posts and add to pending email list
function checkForEmailNotification(source, posts) {
    if (!emailSubscription || posts.length === 0) return;
    
    const lastId = lastPostIds[source];
    const newPosts = lastId ? posts.filter(post => post.id !== lastId && new Date(post.date) > new Date(lastPostIds[source + '_date'] || 0)) : [];
    
    if (newPosts.length > 0) {
        // Add to pending posts
        newPosts.forEach(post => {
            if (!pendingEmailPosts.find(p => p.id === post.id)) {
                pendingEmailPosts.push({
                    id: post.id,
                    title: post.title,
                    source: post.sourceName,
                    url: post.url,
                    date: post.date
                });
            }
        });
        
        localStorage.setItem('hsk_pending_email_posts', JSON.stringify(pendingEmailPosts));
        
        // Send email based on frequency
        if (emailSubscription.frequency === 'immediate') {
            sendNewPostsEmail(newPosts);
        }
    }
}

// Send email with new posts
async function sendNewPostsEmail(posts) {
    if (!emailSubscription || posts.length === 0) return;
    
    try {
        const postsList = posts.map(post =>
            `- ${post.title}\n  Nguồn: ${post.sourceName}\n  Link: ${post.url}\n`
        ).join('\n');
        
        const templateParams = {
            to_name: emailSubscription.name,
            to_email: emailSubscription.email,
            subject: `🎓 ${posts.length} bài viết mới về lịch thi HSK`,
            message: `Xin chào ${emailSubscription.name},\n\nCó ${posts.length} bài viết mới về lịch thi HSK:\n\n${postsList}\n\nTruy cập web để xem chi tiết: ${window.location.href}\n\nTrân trọng,\nHSK Check Team`
        };
        
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        
        // Clear pending posts after sending
        pendingEmailPosts = [];
        localStorage.setItem('hsk_pending_email_posts', JSON.stringify(pendingEmailPosts));
        
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Send daily/weekly digest
function sendDigestEmail() {
    if (!emailSubscription || pendingEmailPosts.length === 0) return;
    
    const now = new Date();
    const lastSent = new Date(localStorage.getItem('hsk_last_email_sent') || 0);
    
    let shouldSend = false;
    
    if (emailSubscription.frequency === 'daily') {
        // Send if more than 24 hours since last email
        shouldSend = (now - lastSent) > 24 * 60 * 60 * 1000;
    } else if (emailSubscription.frequency === 'weekly') {
        // Send if more than 7 days since last email
        shouldSend = (now - lastSent) > 7 * 24 * 60 * 60 * 1000;
    }
    
    if (shouldSend) {
        sendNewPostsEmail(pendingEmailPosts);
        localStorage.setItem('hsk_last_email_sent', now.toISOString());
    }
}

// Initialize EmailJS on page load
initEmailJS();

// Check for digest emails periodically (every hour)
setInterval(sendDigestEmail, 60 * 60 * 1000);

// Auto-refresh every 5 minutes
setInterval(() => {
    loadAllFeeds();
}, 5 * 60 * 1000);

// Made with Bob
