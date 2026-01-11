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
