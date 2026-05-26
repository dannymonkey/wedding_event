// Google Apps Script API URL (RSVP Check)
// 設定教學 (Setup Instructions):
// 請參考 src/rsvp_gas.js 檔案中的說明

/**
 * 渲染電子喜帖卡片 (Render E-Invitation Card)
 * 呈現日曆風格的喜帖，包含拱形照片框、九月份日曆與誓詞
 */
function renderInvitationCard(containerId, imageIds) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const imageUrl = (imageIds && imageIds.length > 0)
        ? `https://drive.google.com/thumbnail?id=${imageIds[0]}&sz=w2000`
        : '';

    // 產生 2026 年 9 月份日曆 (9/1 = 星期二, index=2)
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const sep1 = 2; // Tuesday
    const daysInSep = 30;
    const weddingDay = 27;

    let calRows = '';
    let day = 1 - sep1;
    for (let row = 0; row < 5; row++) {
        calRows += '<tr>';
        for (let col = 0; col < 7; col++) {
            if (day < 1 || day > daysInSep) {
                calRows += '<td></td>';
            } else if (day === weddingDay) {
                calRows += `<td><span class="inv-today-circle">${day}</span></td>`;
            } else {
                calRows += `<td>${day}</td>`;
            }
            day++;
        }
        calRows += '</tr>';
        if (day > daysInSep) break;
    }

    container.innerHTML = `
        <div class="inv-card">
            <!-- 左側植物裝飾 -->
            <svg class="inv-botanical-left" width="70" height="220" viewBox="0 0 70 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 220 Q36 170 30 140 Q20 105 8 70" stroke="rgba(255,255,255,0.65)" stroke-width="1.5" fill="none"/>
                <path d="M28 140 Q12 130 3 126" stroke="rgba(255,255,255,0.55)" stroke-width="1" fill="none"/>
                <ellipse cx="2" cy="124" rx="9" ry="5" transform="rotate(-25 2 124)" fill="rgba(255,255,255,0.35)"/>
                <path d="M32 160 Q16 152 8 150" stroke="rgba(255,255,255,0.55)" stroke-width="1" fill="none"/>
                <ellipse cx="6" cy="149" rx="8" ry="4.5" transform="rotate(-15 6 149)" fill="rgba(255,255,255,0.35)"/>
                <path d="M36 180 Q22 174 14 174" stroke="rgba(255,255,255,0.55)" stroke-width="1" fill="none"/>
                <ellipse cx="12" cy="173" rx="7" ry="4" transform="rotate(-5 12 173)" fill="rgba(255,255,255,0.3)"/>
                <path d="M20 104 Q6 96 1 90" stroke="rgba(255,255,255,0.5)" stroke-width="1" fill="none"/>
                <ellipse cx="0" cy="88" rx="8" ry="4.5" transform="rotate(-35 0 88)" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <!-- 右上角裝飾 -->
            <svg class="inv-botanical-right" width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 100 Q15 70 25 50 Q38 28 55 10" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" fill="none"/>
                <path d="M30 52 Q44 44 52 42" stroke="rgba(255,255,255,0.5)" stroke-width="1" fill="none"/>
                <ellipse cx="54" cy="41" rx="7" ry="4" transform="rotate(25 54 41)" fill="rgba(255,255,255,0.3)"/>
                <path d="M22 70 Q36 64 43 62" stroke="rgba(255,255,255,0.5)" stroke-width="1" fill="none"/>
                <ellipse cx="45" cy="61" rx="7" ry="4" transform="rotate(15 45 61)" fill="rgba(255,255,255,0.3)"/>
            </svg>

            <!-- 頂部愛心裝飾 -->
            <div class="inv-top-heart">♡</div>

            <!-- 三拱形照片框：三個重疊圓角矩形 clipPath，完美呈現三聯拱門 -->
            <div class="inv-arches-wrap">
                <svg class="inv-photo-svg" viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <clipPath id="inv-arch-clip">
                            <rect x="20"  y="20" width="140" height="265" rx="70" ry="70"/>
                            <rect x="130" y="20" width="140" height="265" rx="70" ry="70"/>
                            <rect x="240" y="20" width="140" height="265" rx="70" ry="70"/>
                        </clipPath>
                    </defs>
                    ${imageUrl ? `<image href="${imageUrl}" x="0" y="0" width="400" height="340" preserveAspectRatio="xMidYMid slice" clip-path="url(#inv-arch-clip)"/>` : ''}
                    <!-- 2026 虛線弧 -->
                    <path d="M 148,285 C 165,315 235,315 252,285" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
                    <!-- 2026 徽章 -->
                    <circle cx="200" cy="270" r="50" fill="#C9D9E6" stroke="white" stroke-width="3"/>
                    <text x="200" y="279" text-anchor="middle" dominant-baseline="middle"
                          font-family="Cormorant Garamond, serif" font-size="28"
                          font-weight="300" letter-spacing="3" fill="#34526E">2026</text>
                </svg>
            </div>

            <hr class="inv-hr">

            <!-- 日曆 + 誓詞 -->
            <div class="inv-body">
                <div class="inv-calendar">
                    <div class="inv-month-label">09 : SEPTEMBER</div>
                    <table class="inv-cal-table">
                        <thead><tr>${weekdays.map(d => `<th>${d}</th>`).join('')}</tr></thead>
                        <tbody>${calRows}</tbody>
                    </table>
                </div>
                <div class="inv-vows">
                    <div class="inv-forever">FOREVER</div>
                    <ul>
                        <li><span>謝謝你成為我的選擇</span><span class="inv-heart">♡</span></li>
                        <li><span>也成為我的家人</span><span class="inv-heart">♡</span></li>
                        <li><span>未來的每一天</span><span class="inv-heart">♡</span></li>
                        <li><span>我們一起笑 一起鬧</span><span class="inv-heart">♡</span></li>
                        <li><span>一起慢慢變老</span><span class="inv-heart">♡</span></li>
                    </ul>
                </div>
            </div>

            <!-- 底部文字 -->
            <div class="inv-footer">
                <svg width="160" height="18" viewBox="0 0 160 18">
                    <line x1="0" y1="9" x2="62" y2="9" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>
                    <text x="80" y="13" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="11">♡</text>
                    <line x1="98" y1="9" x2="160" y2="9" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>
                </svg>
                <p class="inv-footer-line1">謝謝你，讓我成為最幸福的人</p>
                <p class="inv-footer-line2">— 我愛你 —</p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    // Load RSVP Form URL from config
    const rsvpIframe = document.getElementById('rsvp-form-iframe');
    if (rsvpIframe && config.rsvp && config.rsvp.formUrl) {
        rsvpIframe.src = config.rsvp.formUrl;
    }

    // 渲染電子喜帖卡片
    if (config.rsvp && config.rsvp.invitationImages) {
        renderInvitationCard('invitation-container', config.rsvp.invitationImages);
    }

    const searchBtn = document.getElementById('rsvp-search-btn');
    const guestInput = document.getElementById('rsvp-guest-name'); // 變數名稱微調
    const resultDiv = document.getElementById('rsvp-search-result');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleRsvpSearch);
    }
    
    if (guestInput) {
        guestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleRsvpSearch();
            }
        });
    }

    async function handleRsvpSearch() {
        const query = guestInput.value.trim();
        if (!query) {
            resultDiv.innerHTML = '<p style="color: red;">請輸入姓名或 Email (Please enter Name or Email)</p>';
            return;
        }

        resultDiv.innerHTML = '<p>查詢中... (Checking...)</p>';

        try {
            const rsvpApiUrl = config.rsvp ? config.rsvp.apiUrl : "";
            
            if (!rsvpApiUrl || rsvpApiUrl === "YOUR_RSVP_SCRIPT_URL" || rsvpApiUrl === "") {
                 resultDiv.innerHTML = '<p>系統設定中，請稍後再試。</p>';
                 console.warn("請在 js/config.js 中設定 rsvp.apiUrl");
                 return;
            }

            // 改用 query 參數傳送，並指定 action=check
            const response = await fetch(`${rsvpApiUrl}?action=check&query=${encodeURIComponent(query)}`, {
                method: "GET",
                redirect: "follow",
            });
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            if (data.found) {
                // 如果 API 有回傳客製化 message，就優先顯示 message，否則退回顯示原始狀態 (status)
                const displayMessage = data.message ? data.message : `報名狀態：${data.status}`;
                
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <div class="status-text">${sanitizeHTML(displayMessage).replace(/\n/g, '<br>').replace(/\\n/g, '<br>')}</div>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">(若有需要修改，請重新填寫表單即可，我們會以最新資料為準)</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<p>尚未收到 "<strong>${sanitizeHTML(query)}</strong>" 的報名資料。<br>請確認輸入正確，或填寫上方的報名表單。</p>`;
            }

        } catch (error) {
            console.error('Error fetching RSVP data:', error);
            resultDiv.innerHTML = '<p style="color: red;">查詢失敗，請檢查網路連線或稍後再試。</p>';
        }
    }
});
