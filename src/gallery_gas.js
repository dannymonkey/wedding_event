function doGet(e) {
  // Google Drive 相簿資料夾 ID (Gallery Folder ID)
  // 資料夾連結: https://drive.google.com/drive/folders/1ou3CzdOKi6y68j5_7ZswYgwCJ9bo65RC
  var folderId = "1ou3CzdOKi6y68j5_7ZswYgwCJ9bo65RC";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var images = [];

  while (files.hasNext()) {
    var file = files.next();
    // 只抓取圖片檔案 (Only image files)
    if (file.getMimeType().indexOf("image") > -1) {
      images.push(file.getId());
    }
  }

  return ContentService.createTextOutput(JSON.stringify(images))
    .setMimeType(ContentService.MimeType.JSON);
}
