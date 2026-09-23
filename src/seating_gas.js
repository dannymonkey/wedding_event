// 快取設定：避免每次查詢都重新讀整張 Google Sheet，大幅縮短回應時間
var CACHE_KEY = "seatingMap_v1";
var CACHE_TTL_SECONDS = 21600; // 6 小時（CacheService 上限），實際異動由 onEdit 觸發即時清快取

// 簡易觸發器：手動編輯 Google Sheet 時自動清除快取，讓下次查詢立即反映最新座位資料
function onEdit(e) {
  clearSeatingCache();
}

function doGet(e) {
  var query = (e && e.parameter && e.parameter.query) ? e.parameter.query.toString().trim() : "";
  if (!query) {
    return ContentService.createTextOutput(JSON.stringify({ found: false, error: "No query provided" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var seatingMap = getSeatingMap_();

  function normalizeKey(value) {
    if (value === null || value === undefined) return "";
    return value.toString().trim().replace(/[\s\u3000]+/g, "").toLowerCase();
  }

  var searchKey = normalizeKey(query);
  var result = { found: false, table: "", tb_number: "", tb_name: "", guest: "", query: query };

  if (seatingMap.hasOwnProperty(searchKey)) {
    var matched = seatingMap[searchKey];
    result.found = true;
    result.table = matched.table;
    result.tb_number = matched.tb_number;
    result.tb_name = matched.tb_name;
    result.guest = matched.guest || query;
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// 讀取座位對照表：優先從快取取得，快取不存在或過期才重新讀取 Sheet 並寫回快取
function getSeatingMap_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  var seatingMap = buildSeatingMap_();

  try {
    cache.put(CACHE_KEY, JSON.stringify(seatingMap), CACHE_TTL_SECONDS);
  } catch (err) {
    // 若資料量過大超過快取上限(100KB)，忽略快取寫入錯誤，仍回傳查詢結果
  }

  return seatingMap;
}

// 清除快取：修改 Google Sheet 座位資料後，可在 Apps Script 編輯器手動執行這個函式讓查詢立即生效
function clearSeatingCache() {
  CacheService.getScriptCache().remove(CACHE_KEY);
}

function buildSeatingMap_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();

  if (!data || data.length === 0) return {};

  // 自動偵測欄位：支援「桌位 / 賓客」兩欄格式，並兼容舊版「姓名 / 桌位 / Email」格式
  var tableCol = -1;
  var guestCol = -1;
  var emailCol = -1;

  var headerRow = data[0] || [];
  for (var c = 0; c < headerRow.length; c++) {
    var header = String(headerRow[c] || "").trim().toLowerCase();
    var normalizedHeader = header.replace(/[\s\u3000]+/g, "");

    if (tableCol === -1 && (
      normalizedHeader.indexOf("桌位") !== -1 ||
      normalizedHeader === "table" ||
      normalizedHeader === "seat" ||
      normalizedHeader === "桌號"
    )) {
      tableCol = c;
    }

    if (guestCol === -1 && (
      normalizedHeader.indexOf("賓客") !== -1 ||
      normalizedHeader.indexOf("guest") !== -1 ||
      normalizedHeader.indexOf("name") !== -1 ||
      normalizedHeader.indexOf("姓名") !== -1
    )) {
      guestCol = c;
    }

    if (emailCol === -1 && (
      normalizedHeader.indexOf("email") !== -1 ||
      normalizedHeader.indexOf("電子郵件") !== -1
    )) {
      emailCol = c;
    }
  }

  // fallback：若表頭沒有辨識到，直接用常見的欄位順序
  if (tableCol === -1) tableCol = 0;
  if (guestCol === -1) guestCol = 1;

  function normalizeKey(value) {
    if (value === null || value === undefined) return "";
    return value.toString().trim().replace(/[\s\u3000]+/g, "").toLowerCase();
  }

  function splitTableValue(rawTableValue) {
    var value = (rawTableValue === null || rawTableValue === undefined) ? "" : rawTableValue.toString().trim();
    var result = { tb_number: "", tb_name: "", table: value };

    if (!value) return result;

    var slashIndex = value.indexOf("/");
    if (slashIndex !== -1) {
      result.tb_number = value.substring(0, slashIndex).trim();
      result.tb_name = value.substring(slashIndex + 1).trim();
    } else {
      result.tb_number = value;
      result.tb_name = "";
    }

    result.table = result.tb_number && result.tb_name ? result.tb_number + "/" + result.tb_name : value;
    return result;
  }

  var seatingMap = {};

  for (var i = 1; i < data.length; i++) {
    var rowTable = data[i][tableCol];
    var rowGuest = data[i][guestCol];
    var rowEmail = (emailCol !== -1) ? data[i][emailCol] : "";

    if (!rowTable) continue;

    var tableInfo = splitTableValue(rowTable);
    var tableValue = tableInfo.table;

    if (rowGuest) {
      var guestKey = normalizeKey(rowGuest);
      if (guestKey) {
        seatingMap[guestKey] = {
          table: tableValue,
          tb_number: tableInfo.tb_number,
          tb_name: tableInfo.tb_name,
          guest: rowGuest.toString().trim()
        };
      }
    }

    if (rowEmail) {
      var emailKey = normalizeKey(rowEmail);
      if (emailKey) {
        seatingMap[emailKey] = {
          table: tableValue,
          tb_number: tableInfo.tb_number,
          tb_name: tableInfo.tb_name,
          guest: rowGuest ? rowGuest.toString().trim() : ""
        };
      }
    }
  }

  return seatingMap;
}

function testDoGet() {
  var e = {
    parameter: {
      query: "鄭東濬"
    }
  };
  Logger.log(doGet(e).getContent());
}
