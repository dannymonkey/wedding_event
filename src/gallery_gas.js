/*
    function doGet(e) {
      // 請將此處換成您存放照片的 Google Drive 資料夾 ID
      var folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; 
      var folder = DriveApp.getFolderById(folderId);
      var files = folder.getFiles();
      var images = [];
      
      while (files.hasNext()) {
        var file = files.next();
        // 只抓取圖片檔案
        if (file.getMimeType().indexOf("image") > -1) {
          images.push(file.getId());
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify(images))
        .setMimeType(ContentService.MimeType.JSON);
    }
*/
