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
  var query = (e && e.parameter) ? e.parameter.query : null;
  if (!query) return ContentService.createTextOutput("Error: No query provided");
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  // 第一階段：整合相同聯絡人的「最新資料」與「所有用過的歷史名字」
  var contacts = {};
  
  for (var i = 1; i < data.length; i++) {
    var rowEmail = data[i][1] ? data[i][1].toString().trim().toLowerCase() : "";
    var rowName = data[i][2] ? data[i][2].toString().trim() : "";
    var rowPhone = data[i][3] ? data[i][3].toString().trim() : ""; // D欄: 聯絡電話
    var rowStatus = data[i][5] ? data[i][5].toString() : "";
    
    // 優先用 Email，其次電話，最後姓名
    var contactKey = rowEmail || rowPhone || rowName.toLowerCase();
    
    if (rowStatus && contactKey) {
      if (!contacts[contactKey]) {
        contacts[contactKey] = {
          latestRecord: null,
          allNames: [] // 記住他用過的所有名字
        };
      }
      
      // 把新名字加進歷史紀錄 (轉小寫方便搜尋)
      if (rowName && contacts[contactKey].allNames.indexOf(rowName.toLowerCase()) === -1) {
        contacts[contactKey].allNames.push(rowName.toLowerCase());
      }
      
      // 不管怎樣，覆蓋為最新的設定與最新填的顯示名字
      contacts[contactKey].latestRecord = {
        email: rowEmail,
        name: rowName,       // 回覆時稱呼他最新的名字
        phone: rowPhone,
        status: rowStatus,
        adults: Number(data[i][6]) || 0,
        kids: Number(data[i][7]) || 0
      };
    }
  }

  // 第二階段：重建搜尋目錄，將「歷史用過的所有名字」都指向他的「最新資料」
  var searchMap = {};
  for (var key in contacts) {
    var contact = contacts[key];
    var record = contact.latestRecord;
    
    // 將最新 Email, 電話 加入搜尋 Key
    var searchKeys = [record.email, record.phone];
    
    // 將所有歷史名字加入搜尋 Key
    contact.allNames.forEach(function(n) {
      searchKeys.push(n);
    });
    
    // 建立索引
    searchKeys.forEach(function(sKey) {
      if (sKey) {
        if (!searchMap[sKey]) searchMap[sKey] = [];
        // 避免將同一個人重複推進陣列中
        if (searchMap[sKey].indexOf(record) === -1) {
          searchMap[sKey].push(record);
        }
      }
    });
  }
  
  var searchQuery = query.toString().trim().toLowerCase();
  var result = { found: false, status: "", message: "" };
  
  if (searchMap.hasOwnProperty(searchQuery)) {
    var matchedRecords = searchMap[searchQuery];
    result.found = true;
    
    // 如果這個搜尋詞，查到了「兩個人」以上 (比如遇到同名)
    if (matchedRecords.length > 1) {
      result.status = "❓ 需進一步確認";
      result.message = "我們找到了 " + matchedRecords.length + " 筆關鍵字為「" + query + "」的資料。\n\n為確保資料精準，請改輸入您當時填寫的「Email 或聯絡電話」來進行查詢喔！";
      
    } else {
      // 正常情況：只查到一個人
      var pData = matchedRecords[0];
      result.status = pData.status;

      var isAttending = pData.status.indexOf("我要參加") > -1 || pData.status.indexOf("會") > -1;
      var totalPeople = pData.adults + pData.kids;
      var companionCount = totalPeople > 1 ? (totalPeople - 1) : 0;

      if (isAttending) {
        if (companionCount > 0) {
           result.message = "Hi, " + pData.name + "！太棒了，我們知道你會參加！而且還帶了 " + companionCount + " 位親友，期待見到你們！";
        } else {
           result.message = "Hi, " + pData.name + "！太棒了，我們知道你會參加！非常期待當天見到你！";
        }
      } else {
        result.message = "Hi, " + pData.name + "！太可惜了，雖然這次無法前來，但我們已經收到你的心意了！謝謝你的祝福！";
      }
    }
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
      query: "鄭東濬" // 請將此處改成您 Google Sheet 中實際存在的姓名做測試
    }
  };
  Logger.log(doGet(e).getContent());
}
