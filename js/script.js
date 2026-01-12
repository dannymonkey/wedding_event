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

        // 更新航班編號 (Flight No.) - 使用 config.flightCode
        if (config.flightCode) {
            document.querySelectorAll('.wedding-flight-no').forEach(el => el.textContent = config.flightCode);
        }
    }

    // 使用 config 中的日期，若無則使用預設值
    const targetDateStr = (typeof config !== 'undefined' && config.wedding && config.wedding.fullDate) 
        ? config.wedding.fullDate 
        : '2026-09-27T12:00:00';
        
    const weddingDate = new Date(targetDateStr).getTime();

    // 飛行路徑視覺化邏輯 / Flight Path Visualization Logic (Parabola)
    function updateFlightProgress() {
        if (!config.wedding.flightStart) return;

        const plane = document.getElementById('route-plane');
        const pathSolid = document.getElementById('path-solid'); // Get the solid path element
        const svgDepDate = document.getElementById('svg-dep-date');
        const svgWeddingDate = document.getElementById('svg-wedding-date');

        if (!plane || !pathSolid) return;

        const startDate = new Date(config.wedding.flightStart).getTime();
        const endDate = new Date(config.wedding.fullDate).getTime();
        const now = new Date().getTime();

        // Update Dates Text in SVG
        if (config.wedding.flightStart) {
            const d = new Date(config.wedding.flightStart);
            if (svgDepDate) svgDepDate.textContent = `${d.getFullYear()} ${d.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
        }
        if (config.wedding.date) {
            const d = new Date(config.wedding.date);
            if (svgWeddingDate) svgWeddingDate.textContent = `${d.getFullYear()} ${d.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
        }

        // Calculate progress percentage (0.0 to 1.0)
        let t = 0;
        if (now >= endDate) {
            t = 1;
        } else if (now <= startDate) {
            t = 0;
        } else {
            t = (now - startDate) / (endDate - startDate);
        }
        
        // Use SVG Path methods to calculate position and draw the line
        const pathLen = pathSolid.getTotalLength();
        
        // 1. Draw the Solid Line (Progress)
        // Set stroke-dasharray to total length (so it can be fully solid)
        pathSolid.style.strokeDasharray = pathLen;
        // Set stroke-dashoffset to hide the part not yet flown
        // offset = length * (1 - t). 
        // If t=0, offset=len (fully hidden). If t=1, offset=0 (fully visible).
        pathSolid.style.strokeDashoffset = pathLen * (1 - t);

        // 2. Position the Plane
        // Get point at current length
        const currentLen = pathLen * t;
        const point = pathSolid.getPointAtLength(currentLen);
        
        const x = point.x;
        const y = point.y;

        // 3. Calculate Rotation (Tangent)
        // Get a point slightly before and after to determine the angle
        const lookAhead = 1.0; // 1px
        const pBefore = pathSolid.getPointAtLength(Math.max(0, currentLen - lookAhead));
        const pAfter = pathSolid.getPointAtLength(Math.min(pathLen, currentLen + lookAhead));
        
        const dx = pAfter.x - pBefore.x;
        const dy = pAfter.y - pBefore.y;
        
        let rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        // Correct for SVG icon initial orientation (Upright 0deg) -> Needs to point Right (90deg in CSS terms usually?)
        // Actually, atan2(0,1) = 0 (Right). atan2(1,0) = 90 (Down).
        // Our SVG Plane points UP.
        // If we want it to point RIGHT (0deg), we need +90deg rotation?
        // Let's verify: 
        // Plane UP. rotate(90) -> Plane RIGHT.
        // atan2 results: Right=0, Down=90, Up=-90, Left=180.
        // So if direction is Right (0), we want Plane RIGHT (which is rotate(90)).
        rotation += 90;

        // Position the plane using CSS percentage relative to the wrapper
        // The SVG viewBox is 0 0 1000 250.
        // x percent = x / 1000 * 100
        // y percent = y / 250 * 100
        
        plane.style.left = `${(x / 1000) * 100}%`;
        plane.style.top = `${(y / 250) * 100}%`;
        plane.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        plane.style.opacity = 1; // Show plane
    }
    
    // 初始化進度條
    // Wait slightly for SVG to be rendered properly if needed, but usually fine
    updateFlightProgress();
    // Update every minute just in case
    setInterval(updateFlightProgress, 60000);

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
