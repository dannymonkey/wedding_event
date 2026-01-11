// Google Apps Script API URL (RSVP Check)
// 設定教學 (Setup Instructions):
// 請參考 src/rsvp_gas.js 檔案中的說明

document.addEventListener('DOMContentLoaded', () => {
    // Load RSVP Form URL from config
    const rsvpIframe = document.getElementById('rsvp-form-iframe');
    if (rsvpIframe && config.rsvp && config.rsvp.formUrl) {
        rsvpIframe.src = config.rsvp.formUrl;
    }

    // Load Invitation Images from config
    if (typeof loadGoogleDriveImages === 'function' && config.rsvp && config.rsvp.invitationImages) {
        loadGoogleDriveImages('invitation-container', config.rsvp.invitationImages);
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
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <h3>${sanitizeHTML(query)}</h3>
                        <p>報名狀態：</p>
                        <div class="status-text">${sanitizeHTML(data.status)}</div>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">(若有需要修改，請重新填寫表單即可)</p>
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
