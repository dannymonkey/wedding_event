function doGet(e) {
  try {
    // Google Drive About 資料夾 ID (新郎新娘照片資料夾)
    var folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var result = { groom: null, bride: null, status: "success" };
    var allImages = []; // 收集所有圖片，作為 fallback 用

    while (files.hasNext()) {
      var file = files.next();
      if (file.getMimeType().indexOf("image") === -1) continue;

      allImages.push(file.getId());

      var name = file.getName().toLowerCase();
      // 檔名包含 "groom" 或 "新郎" 視為新郎照片
      // 檔名包含 "bride" 或 "新娘" 視為新娘照片
      if (name.indexOf("groom") > -1 || name.indexOf("新郎") > -1) {
        result.groom = file.getId();
      } else if (name.indexOf("bride") > -1 || name.indexOf("新娘") > -1) {
        result.bride = file.getId();
      }
    }

    // Fallback：若名稱無法對應，以資料夾第 1 張圖 = 新郎、第 2 張圖 = 新娘
    if (!result.groom && allImages.length > 0) result.groom = allImages[0];
    if (!result.bride && allImages.length > 1) result.bride = allImages[1];

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 發生錯誤時也回傳 JSON，避免前端解析 HTML 發生語法錯誤 (CORS / 302 後錯誤)
    var errorResult = { 
      status: "error", 
      message: error.toString(),
      groom: null, 
      bride: null
    };
    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
