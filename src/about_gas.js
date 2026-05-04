function doGet(e) {
  try {
    // Google Drive About 資料夾 ID (新郎新娘照片資料夾)
    var folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var result = { groom: null, bride: null, status: "success" };

    while (files.hasNext()) {
      var file = files.next();
      if (file.getMimeType().indexOf("image") === -1) continue;

      var name = file.getName().toLowerCase();
      // 檔名包含 "groom" 或 "新郎" 視為新郎照片
      // 檔名包含 "bride" 或 "新娘" 視為新娘照片
      if (name.indexOf("groom") > -1 || name.indexOf("新郎") > -1) {
        result.groom = file.getId();
      } else if (name.indexOf("bride") > -1 || name.indexOf("新娘") > -1) {
        result.bride = file.getId();
      }
    }

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
