/*
    // 1. 主入口：根據 action 參數分發到不同函式
    function doGet(e) {
      var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "check";
      
      if (action === "check") {
        return checkRsvpStatus(e);
      }
      
      return ContentService.createTextOutput("Error: Unknown action");
    }

    // 2. 核心功能：查詢報名狀態
    function checkRsvpStatus(e) {
      // 接收查詢參數 (query)
      var query = (e && e.parameter) ? e.parameter.query : null;
      if (!query) return ContentService.createTextOutput("Error: No query provided");
      
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var data = sheet.getDataRange().getValues();
      
      // 建立 Hash Map (同時索引姓名和 Email)
      // 根據您的截圖，欄位索引如下：
      // Column A (0): 時間戳記
      // Column B (1): 電子郵件地址 (Email)
      // Column C (2): 您的大名 (Name)
      // Column F (5): 是否可以參加婚禮呢 (Status)
      
      var rsvpMap = {};
      var emailColIndex = 1; 
      var nameColIndex = 2; 
      var statusColIndex = 5; 
      
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

    // ★★★ 測試用函式 (請在 GAS 編輯器上方選單選擇此函式執行) ★★★
    function testDoGet() {
      // 模擬網頁傳來的參數 (加入 action)
      var e = {
        parameter: {
          action: "check",
          query: "測試姓名" // 請將此處改成您 Google Sheet 中實際存在的姓名
        }
      };
      Logger.log(doGet(e).getContent());
    }
*/
