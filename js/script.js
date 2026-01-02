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
        if (config.groomName) {
            document.querySelectorAll('.groom-name').forEach(el => el.textContent = config.groomName);
        }
        if (config.groomBio) {
            document.querySelectorAll('.groom-bio').forEach(el => el.textContent = config.groomBio);
        }

        // 更新新娘資訊
        if (config.brideName) {
            document.querySelectorAll('.bride-name').forEach(el => el.textContent = config.brideName);
        }
        if (config.brideBio) {
            document.querySelectorAll('.bride-bio').forEach(el => el.textContent = config.brideBio);
        }

        // 更新 About Us 背景圖片
        if (config.groomImage) {
            document.querySelectorAll('.groom-bg').forEach(el => {
                el.style.backgroundImage = `url('${config.groomImage}')`;
            });
        }
        if (config.brideImage) {
            document.querySelectorAll('.bride-bg').forEach(el => {
                el.style.backgroundImage = `url('${config.brideImage}')`;
            });
        }

        // 更新 Line 官方帳號資訊
        if (config.lineUrl) {
            const lineLink = document.getElementById('line-link');
            if (lineLink) lineLink.href = config.lineUrl;
        }
        if (config.lineQRCode) {
            const lineQR = document.getElementById('line-qr-code');
            if (lineQR) lineQR.src = config.lineQRCode;
        }

        // 更新婚禮資訊 (Location & Time)
        if (config.weddingDate) {
            document.querySelectorAll('.wedding-date').forEach(el => el.textContent = config.weddingDate);
        }
        if (config.weddingTimeDisplay) {
            document.querySelectorAll('.wedding-time').forEach(el => el.textContent = config.weddingTimeDisplay);
        }
        if (config.weddingLocation) {
            document.querySelectorAll('.wedding-location').forEach(el => el.textContent = config.weddingLocation);
        }
        if (config.weddingLocationUrl) {
            document.querySelectorAll('.wedding-location-link').forEach(el => el.href = config.weddingLocationUrl);
        }
        if (config.weddingHall) {
            document.querySelectorAll('.wedding-hall').forEach(el => el.textContent = config.weddingHall);
        }
    }

    // 使用 config 中的日期，若無則使用預設值
    const targetDateStr = (typeof config !== 'undefined' && config.fullWeddingDate) 
        ? config.fullWeddingDate 
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
});
