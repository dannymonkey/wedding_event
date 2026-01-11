// Google Apps Script API URL
// 安全性升級設定教學 (Security Setup Instructions):
// 請參考 src/seating_gas.js 檔案中的說明

document.addEventListener('DOMContentLoaded', () => {
    // Load Seating Chart Images from config
    if (typeof loadGoogleDriveImages === 'function' && config.seating && config.seating.chartImages) {
        loadGoogleDriveImages('seating-chart-container', config.seating.chartImages);
    }

    const searchBtn = document.getElementById('search-btn');
    const guestInput = document.getElementById('guest-name'); // 變數名稱微調
    const resultDiv = document.getElementById('search-result');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (guestInput) {
        guestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    async function handleSearch() {
        const query = guestInput.value.trim();
        if (!query) {
            resultDiv.innerHTML = '<p style="color: red;">請輸入姓名或 Email (Please enter Name or Email)</p>';
            return;
        }

        resultDiv.innerHTML = '<p>查詢中... (Searching...)</p>';

        try {
            // 優先使用 config 中的設定，若無則使用預設值 (這裡假設使用者可能還沒設定 config.seating.apiUrl)
            // 為了保持一致性，建議也將 seatingApiUrl 移至 config.js
            const seatingApiUrl = (config.seating && config.seating.apiUrl) ? config.seating.apiUrl : "YOUR_GOOGLE_APPS_SCRIPT_URL";

            if (seatingApiUrl === "YOUR_GOOGLE_APPS_SCRIPT_URL" || seatingApiUrl === "") {
                 resultDiv.innerHTML = '<p>系統設定中，請稍後再試。</p>';
                 console.warn("請在 js/config.js 或 js/seating.js 中設定 seatingApiUrl");
                 return;
            }

            // 改用 query 參數傳送
            const response = await fetch(`${seatingApiUrl}?query=${encodeURIComponent(query)}`, {
                method: "GET",
                redirect: "follow",
            });
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            if (data.found) {
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <h3>${sanitizeHTML(query)}</h3>
                        <p>您的桌位在：</p>
                        <div class="table-number">${sanitizeHTML(data.table)}</div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<p>找不到 "<strong>${sanitizeHTML(query)}</strong>" 的桌位資訊。<br>請確認輸入正確，或直接聯繫新人。</p>`;
            }

        } catch (error) {
            console.error('Error fetching seating data:', error);
            resultDiv.innerHTML = '<p style="color: red;">查詢失敗，請檢查網路連線或稍後再試。</p>';
        }
    }
});
