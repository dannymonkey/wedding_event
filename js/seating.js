// Google Apps Script API URL
// 安全性升級設定教學 (Security Setup Instructions):
// 1. 開啟您的 Google Sheet (含姓名、桌號)
//    *** 注意：您的 Google Sheet 不需要「發布到網路」，請保持「私人」狀態即可！ ***
//    (Note: Keep your Google Sheet PRIVATE. Do NOT publish it to the web.)
// 2. 點選「擴充功能」>「Apps Script」
// 3. 貼上以下程式碼 (支援姓名或 Email 查詢):
/*
    function doGet(e) {
      // 接收查詢參數 (query)
      var query = e.parameter.query;
      if (!query) return ContentService.createTextOutput("Error: No query provided");
      
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var data = sheet.getDataRange().getValues();
      
      // 優化：建立 Hash Map (物件) 來加速查詢
      // 假設欄位索引 (請依實際狀況修改)：
      // Column A (0): 姓名 (Name)
      // Column B (1): 桌號 (Table)
      // Column C (2): Email (假設您有收集 Email)
      
      var seatingMap = {};
      var nameColIndex = 0; 
      var tableColIndex = 1;
      var emailColIndex = 2; // 請確認 Email 在第幾欄
      
      for (var i = 1; i < data.length; i++) {
        var rowName = data[i][nameColIndex];
        var rowTable = data[i][tableColIndex];
        var rowEmail = data[i][emailColIndex];
        
        if (rowTable) {
          // 索引姓名
          if (rowName) {
            seatingMap[rowName.toString().trim().toLowerCase()] = rowTable;
          }
          // 索引 Email (如果有填寫)
          if (rowEmail) {
            seatingMap[rowEmail.toString().trim().toLowerCase()] = rowTable;
          }
        }
      }
      
      var searchQuery = query.toString().trim().toLowerCase();
      var result = { found: false, table: "" };
      
      if (seatingMap.hasOwnProperty(searchQuery)) {
        result.found = true;
        result.table = seatingMap[searchQuery];
      }
      
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
*/
// 4. 點選「部署」>「新增部署作業」
// 5. 執行身分 (Execute as) 選擇「我」(Me) -> 這樣程式才有權限讀取您的私人試算表
// 6. 誰可以存取 (Who has access) 選擇「所有人」(Anyone) -> 這樣網頁才能呼叫此 API
// 7. 點擊「部署」，複製產生的「網頁應用程式網址」
// 8. 將網址貼入下方的 seatingApiUrl 變數中

const seatingApiUrl = "YOUR_GOOGLE_APPS_SCRIPT_URL";

document.addEventListener('DOMContentLoaded', () => {
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
            if (seatingApiUrl === "YOUR_GOOGLE_APPS_SCRIPT_URL" || seatingApiUrl === "") {
                 resultDiv.innerHTML = '<p>系統設定中，請稍後再試。</p>';
                 console.warn("請在 js/seating.js 中設定 seatingApiUrl");
                 return;
            }

            // 改用 query 參數傳送
            const response = await fetch(`${seatingApiUrl}?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            if (data.found) {
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <h3>${sanitizeHTML(query)}</h3>
                        <p>您的座位在：</p>
                        <div class="table-number">${sanitizeHTML(data.table)}</div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<p>找不到 "<strong>${sanitizeHTML(query)}</strong>" 的座位資訊。<br>請確認輸入正確，或直接聯繫新人。</p>`;
            }

        } catch (error) {
            console.error('Error fetching seating data:', error);
            resultDiv.innerHTML = '<p style="color: red;">查詢失敗，請檢查網路連線或稍後再試。</p>';
        }
    }
});
