// 歡迎訊息 (Welcome Message)
console.log("Welcome to Danny & Vivian's Wedding Page!");

// XSS 防護工具函數 (XSS Protection Utility)
function sanitizeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * 通用函數：從 Google Drive 載入圖片到指定容器
 * @param {string} containerId - 容器元素的 ID
 * @param {Array<string>} imageIds - Google Drive 檔案 ID 陣列
 */
function loadGoogleDriveImages(containerId, imageIds) {
    const container = document.getElementById(containerId);
    if (!container || !imageIds || imageIds.length === 0) return;

    container.innerHTML = ''; // Clear placeholder

    imageIds.forEach(id => {
        const img = document.createElement('img');
        // 改用 thumbnail endpoint，通常比較穩定且不會遇到跨域問題
        // sz=w2000 設定寬度為 2000px (高畫質)
        img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
        img.alt = "Wedding Image";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.marginBottom = "1rem";
        img.style.display = "block";
        img.style.marginLeft = "auto";
        img.style.marginRight = "auto";
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer"; // 增加這行以減少參照檢查問題
        
        img.onerror = function() {
            console.warn(`Image ${id} failed to load, trying fallback...`);
            // Fallback: 嘗試直接連結
            if (this.src.includes('thumbnail')) {
                    this.src = `https://drive.google.com/uc?export=view&id=${id}`;
            } else {
                this.style.display = 'none';
                const errorMsg = document.createElement('p');
                errorMsg.style.color = 'red';
                errorMsg.style.textAlign = 'center';
                errorMsg.innerHTML = `圖片載入失敗。<br><a href="https://drive.google.com/file/d/${id}/view" target="_blank">點此直接開啟圖片</a>`;
                container.appendChild(errorMsg);
            }
        };

        container.appendChild(img);
    });
}

// 這裡可以添加倒數計時或其他互動功能 (Add countdown or other interactive features here)
document.addEventListener('DOMContentLoaded', () => {
    // 動態更新新人姓名 (Update Couple Names)
    if (typeof config !== 'undefined') {
        // 更新 Couple Names
        if (config.coupleNames) {
            document.querySelectorAll('.couple-names').forEach(el => {
                el.textContent = config.coupleNames;
            });

            // 更新瀏覽器標籤頁標題 (Browser Tab Title)
            const separator = " - ";
            if (document.title.includes(separator)) {
                const pageName = document.title.split(separator)[0];
                document.title = `${pageName}${separator}${config.coupleNames}'s Wedding`;
            } else {
                document.title = `${config.coupleNames}'s Wedding`;
            }
        }

        // 更新新郎資訊
        if (config.groom && config.groom.name) {
            document.querySelectorAll('.groom-name').forEach(el => el.textContent = config.groom.name);
        }
        if (config.groom && config.groom.bio) {
            document.querySelectorAll('.groom-bio').forEach(el => el.textContent = config.groom.bio);
        }

        // 更新新娘資訊
        if (config.bride && config.bride.name) {
            document.querySelectorAll('.bride-name').forEach(el => el.textContent = config.bride.name);
        }
        if (config.bride && config.bride.bio) {
            document.querySelectorAll('.bride-bio').forEach(el => el.textContent = config.bride.bio);
        }

        // 更新 About Us 背景圖片
        if (config.groom && config.groom.image) {
            document.querySelectorAll('.groom-bg').forEach(el => {
                el.style.backgroundImage = `url('${config.groom.image}')`;
            });
        }
        if (config.bride && config.bride.image) {
            document.querySelectorAll('.bride-bg').forEach(el => {
                el.style.backgroundImage = `url('${config.bride.image}')`;
            });
        }

        // 更新 Line 官方帳號資訊
        if (config.line && config.line.url) {
            const lineLink = document.getElementById('line-link');
            if (lineLink) lineLink.href = config.line.url;
        }
        if (config.line && config.line.qrCode) {
            const lineQR = document.getElementById('line-qr-code');
            if (lineQR) lineQR.src = config.line.qrCode;
        }

        // 更新婚禮資訊 (Location & Time)
        if (config.wedding && config.wedding.date) {
            document.querySelectorAll('.wedding-date').forEach(el => el.textContent = config.wedding.date);
        }
        if (config.wedding && config.wedding.timeDisplay) {
            document.querySelectorAll('.wedding-time').forEach(el => el.textContent = config.wedding.timeDisplay);
        }
        if (config.wedding && config.wedding.location) {
            document.querySelectorAll('.wedding-location').forEach(el => el.textContent = config.wedding.location);
        }
        if (config.wedding && config.wedding.locationUrl) {
            document.querySelectorAll('.wedding-location-link').forEach(el => el.href = config.wedding.locationUrl);
        }
        if (config.wedding && config.wedding.hall) {
            document.querySelectorAll('.wedding-hall').forEach(el => el.textContent = config.wedding.hall);
        }
    }

    // 使用 config 中的日期，若無則使用預設值
    const targetDateStr = (typeof config !== 'undefined' && config.wedding && config.wedding.fullDate) 
        ? config.wedding.fullDate 
        : '2026-09-27T12:00:00';
        
    const weddingDate = new Date(targetDateStr).getTime();

    function updateCountdown() {
        const timerElement = document.getElementById("timer");
        if (!timerElement) return; // 如果頁面上沒有 timer 就不執行

        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            timerElement.innerHTML = "我們已經結婚了！ (We are married!)";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }

    // 立即執行一次，避免延遲
    updateCountdown();
    // 每秒更新一次
    setInterval(updateCountdown, 1000);

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('nav ul');

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }
});
