// Cookie Management Functions
const CookieManager = {
    // Set cookie with expiration
    set: function(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/;SameSite=Lax";
    },

    // Get cookie value
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                try {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                } catch(e) {
                    return null;
                }
            }
        }
        return null;
    },

    // Delete cookie
    delete: function(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

    // Check if cookie exists
    exists: function(name) {
        return this.get(name) !== null;
    }
};

// Settings Manager
const SettingsManager = {
    // Save all settings to cookies
    saveSettings: function() {
        const settings = {
            darkMode: document.body.classList.contains('dark-mode'),
            feeds: RSS_FEEDS,
            bookmarks: bookmarks,
            notifications: notificationsEnabled,
            lastPostIds: lastPostIds,
            visibleColumns: visibleColumns,
            timestamp: new Date().toISOString()
        };
        
        CookieManager.set('hsk_settings', settings);
        
        // Also save to localStorage as backup
        localStorage.setItem('hsk_settings_backup', JSON.stringify(settings));
        
        return settings;
    },

    // Load settings from cookies
    loadSettings: function() {
        let settings = CookieManager.get('hsk_settings');
        
        // Fallback to localStorage if cookie not found
        if (!settings) {
            const backup = localStorage.getItem('hsk_settings_backup');
            if (backup) {
                settings = JSON.parse(backup);
            }
        }
        
        if (settings) {
            // Apply dark mode
            if (settings.darkMode) {
                document.body.classList.add('dark-mode');
                updateDarkModeButton(true);
            }
            
            // Restore feeds
            if (settings.feeds) {
                RSS_FEEDS = settings.feeds;
            }
            
            // Restore bookmarks
            if (settings.bookmarks) {
                bookmarks = settings.bookmarks;
            }
            
            // Restore notifications
            if (settings.notifications !== undefined) {
                notificationsEnabled = settings.notifications;
            }
            
            // Restore last post IDs
            if (settings.lastPostIds) {
                lastPostIds = settings.lastPostIds;
            }
            
            // Restore visible columns
            if (settings.visibleColumns) {
                visibleColumns = settings.visibleColumns;
            }
            
            return true;
        }
        
        return false;
    },

    // Export settings as JSON file
    exportSettings: function() {
        const settings = this.saveSettings();
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hsk-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showMessage('✅ Đã xuất cài đặt thành công!', 'success');
    },

    // Import settings from JSON file
    importSettings: function(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                // Validate settings
                if (!settings.timestamp) {
                    throw new Error('Invalid settings file');
                }
                
                // Save to cookie
                CookieManager.set('hsk_settings', settings);
                
                // Save to localStorage as backup
                localStorage.setItem('hsk_settings_backup', JSON.stringify(settings));
                
                showMessage('✅ Đã nhập cài đặt thành công! Đang tải lại trang...', 'success');
                
                // Reload page to apply settings
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } catch (error) {
                console.error('Import error:', error);
                showMessage('❌ File cài đặt không hợp lệ!', 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Get shareable link with settings
    getShareableLink: function() {
        const settings = this.saveSettings();
        const compressed = btoa(JSON.stringify(settings));
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?settings=${compressed}`;
    },

    // Load settings from URL
    loadFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const settingsParam = urlParams.get('settings');
        
        if (settingsParam) {
            try {
                const settings = JSON.parse(atob(settingsParam));
                CookieManager.set('hsk_settings', settings);
                localStorage.setItem('hsk_settings_backup', JSON.stringify(settings));
                
                // Remove settings from URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                return true;
            } catch (error) {
                console.error('Error loading settings from URL:', error);
            }
        }
        
        return false;
    },

    // Clear all settings
    clearSettings: function() {
        if (confirm('Bạn có chắc muốn xóa tất cả cài đặt?')) {
            CookieManager.delete('hsk_settings');
            localStorage.clear();
            showMessage('✅ Đã xóa tất cả cài đặt!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
};

// Auto-save settings when changes occur
function autoSaveSettings() {
    SettingsManager.saveSettings();
}

// Save settings periodically (every 30 seconds)
setInterval(autoSaveSettings, 30000);

// Save settings before page unload
window.addEventListener('beforeunload', autoSaveSettings);

// Made with Bob
