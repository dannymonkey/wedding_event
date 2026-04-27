function doGet(e) {
  // Google Drive About 資料夾 ID (新郎新娘照片資料夾)
  // 資料夾連結: https://drive.google.com/drive/folders/1ou3CzdOKi6y68j5_7ZswYgwCJ9bo65RC
  var folderId = "1ou3CzdOKi6y68j5_7ZswYgwCJ9bo65RC";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var result = { groom: null, bride: null };

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
}
