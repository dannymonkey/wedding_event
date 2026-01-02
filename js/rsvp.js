// Google Apps Script API URL (RSVP Check)
// 設定教學 (Setup Instructions):
// 1. 建立 Google 表單，並連結到 Google Sheet (回應會自動存入 Sheet)
// 2. 開啟該 Google Sheet
// 3. 點選「擴充功能」>「Apps Script」
// 4. 貼上以下程式碼 (支援姓名或 Email 查詢):
/*
    function doGet(e) {
      // 接收查詢參數 (query)
      var query = e.parameter.query;
      if (!query) return ContentService.createTextOutput("Error: No query provided");
      
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var data = sheet.getDataRange().getValues();
      
      // 建立 Hash Map (同時索引姓名和 Email)
      // 假設欄位索引 (請依實際狀況修改)：
      // Column A (0): Timestamp
      // Column B (1): 姓名 (Name)
      // Column C (2): 出席意願 (Status)
      // Column D (3): Email (假設您有收集 Email)
      
      var rsvpMap = {};
      var nameColIndex = 1; 
      var statusColIndex = 2;
      var emailColIndex = 3; // 請確認 Email 在第幾欄
      
      for (var i = 1; i < data.length; i++) {
        var rowName = data[i][nameColIndex];
        var rowStatus = data[i][statusColIndex];
        var rowEmail = data[i][emailColIndex];
        
        if (rowStatus) {
          // 索引姓名
          if (rowName) {
            rsvpMap[rowName.toString().trim().toLowerCase()] = rowStatus;
          }
          // 索引 Email (如果有填寫)
          if (rowEmail) {
            rsvpMap[rowEmail.toString().trim().toLowerCase()] = rowStatus;
          }
        }
      }
      
      var searchQuery = query.toString().trim().toLowerCase();
      var result = { found: false, status: "" };
      
      if (rsvpMap.hasOwnProperty(searchQuery)) {
        result.found = true;
        result.status = rsvpMap[searchQuery];
      }
      
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
*/
// 5. 部署為網頁應用程式 (Execute as Me, Access: Anyone)
// 6. 將網址貼入下方

const rsvpApiUrl = "YOUR_RSVP_SCRIPT_URL";

document.addEventListener('DOMContentLoaded', () => {
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
            if (rsvpApiUrl === "YOUR_RSVP_SCRIPT_URL" || rsvpApiUrl === "") {
                 resultDiv.innerHTML = '<p>系統設定中，請稍後再試。</p>';
                 console.warn("請在 js/rsvp.js 中設定 rsvpApiUrl");
                 return;
            }

            // 改用 query 參數傳送
            const response = await fetch(`${rsvpApiUrl}?query=${encodeURIComponent(query)}`);
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
