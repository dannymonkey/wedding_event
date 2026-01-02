// Google Apps Script API URL (Gallery)
// 自動化相簿設定教學 (Auto Gallery Setup Instructions):
// 1. 在 Google Drive 建立一個資料夾，放入所有婚禮照片
// 2. 建立一個新的 Google Apps Script (跟座位表的可以分開，或是寫在一起用參數判斷)
// 3. 貼上以下程式碼 (Copy & Paste code below):
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
// 4. 部署為網頁應用程式 (權限設定同座位表：Execute as Me, Access: Anyone)
// 5. 將網址貼入下方的 galleryApiUrl

const galleryApiUrl = "YOUR_GALLERY_SCRIPT_URL"; // 如果為空，則使用下方的靜態清單

// 備用靜態清單 (Fallback Static List)
const staticGalleryImages = [
    // "YOUR_IMAGE_ID_1",
];

document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    let imagesToDisplay = staticGalleryImages;

    // 嘗試從 API 抓取照片清單
    if (galleryApiUrl && galleryApiUrl !== "YOUR_GALLERY_SCRIPT_URL") {
        try {
            const response = await fetch(galleryApiUrl);
            if (response.ok) {
                imagesToDisplay = await response.json();
                console.log(`Loaded ${imagesToDisplay.length} images from Drive.`);
            }
        } catch (error) {
            console.error("Failed to load images from API, falling back to static list.", error);
        }
    }

    // 如果沒有照片，顯示敬請期待
    if (imagesToDisplay.length === 0) {
        galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666; font-size: 1.2rem;">敬請期待 (Stay Tuned)</p>';
        return;
    }

    // 清空容器 (避免重複)
    galleryContainer.innerHTML = '';

    imagesToDisplay.forEach(id => {
        const img = document.createElement('img');
        img.src = `https://drive.google.com/uc?export=view&id=${id}`;
        img.alt = "Wedding Photo";
        img.loading = "lazy";
        
        img.onerror = function() {
            this.style.display = 'none';
        };

        galleryContainer.appendChild(img);
    });
});

