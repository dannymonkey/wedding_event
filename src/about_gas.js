function doGet(e) {
  try {
    // Google Drive About 資料夾 ID (新郎新娘照片資料夾)
    var folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();

    // 回傳格式與 gallery_gas.js 相同：ID 陣列
    // 陣列順序：第 1 個 = 新郎 (Groom)，第 2 個 = 新娘 (Bride)
    // 優先依檔名判斷：包含 "groom"/"新郎" 的排第 1，包含 "bride"/"新娘" 的排第 2
    // 若無法依名稱判斷，則依資料夾順序取前兩張
    var groom = null;
    var bride = null;
    var others = [];

    while (files.hasNext()) {
      var file = files.next();
      if (file.getMimeType().indexOf("image") === -1) continue;

      var name = file.getName().toLowerCase();
      if (name.indexOf("groom") > -1 || name.indexOf("新郎") > -1) {
        groom = file.getId();
      } else if (name.indexOf("bride") > -1 || name.indexOf("新娘") > -1) {
        bride = file.getId();
      } else {
        others.push(file.getId());
      }
    }

    // Fallback：若名稱無法對應，以資料夾第 1 張圖 = 新郎、第 2 張圖 = 新娘
    if (!groom && others.length > 0) groom = others[0];
    if (!bride && others.length > 1) bride = others[1];

    var result = [];
    if (groom) result.push(groom);
    if (bride) result.push(bride);

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
