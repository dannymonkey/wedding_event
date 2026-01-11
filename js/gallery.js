// Google Apps Script API URL (Gallery)
// 自動化相簿設定教學 (Auto Gallery Setup Instructions):
// 請參考 src/gallery_gas.js 檔案中的說明

document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    // 優先使用 config 中的靜態清單作為預設值
    let imagesToDisplay = (config.gallery && config.gallery.images && config.gallery.images.length > 0) 
        ? config.gallery.images 
        : [];

    // 嘗試從 API 抓取照片清單
    let fetchError = null;
    if (config.gallery && config.gallery.apiUrl && config.gallery.apiUrl !== "YOUR_GALLERY_SCRIPT_URL") {
        try {
            // 顯示載入中
            if (imagesToDisplay.length === 0) {
                galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">載入中 (Loading)...</p>';
            }

            const response = await fetch(config.gallery.apiUrl, {
                method: 'GET',
                redirect: 'follow'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    imagesToDisplay = data;
                    console.log(`Loaded ${imagesToDisplay.length} images from Drive API.`);
                } else {
                    console.warn("API returned empty list or invalid format.");
                    // 如果 API 回傳空陣列，不視為錯誤，但會導致顯示「敬請期待」
                }
            } else {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Failed to load images from API.", error);
            fetchError = error;
        }
    }

    // 如果沒有照片，顯示敬請期待
    if (imagesToDisplay.length === 0) {
        // 如果是因為 API 錯誤導致沒有照片，顯示錯誤訊息
        if (fetchError) {
            const errorContainer = document.createElement('div');
            errorContainer.style.gridColumn = "1 / -1";
            errorContainer.style.color = "red";
            errorContainer.style.textAlign = "center";
            errorContainer.style.padding = "1rem";
            errorContainer.style.border = "1px dashed red";
            errorContainer.style.margin = "1rem 0";
            
            let errorHint = "";
            errorContainer.innerHTML = `⚠️ 無法讀取相簿 (Failed to load gallery)<br><small>請稍後再試 (Please try again later)</small>`;
            
            galleryContainer.innerHTML = ''; // 清空「載入中」
            galleryContainer.appendChild(errorContainer);
        } else {
            // 真的沒有照片 (API 成功但回傳空，或是沒設定 API 且沒靜態照片)
            galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666; font-size: 1.2rem;">敬請期待 (Stay Tuned)</p>';
        }
        return;
    }

    // 使用共用函數載入圖片 (支援 thumbnail 與 fallback)
    if (typeof loadGoogleDriveImages === 'function') {
        loadGoogleDriveImages('gallery-container', imagesToDisplay);
    } else {
        // Fallback if loadGoogleDriveImages is not defined
        galleryContainer.innerHTML = '';
        imagesToDisplay.forEach(id => {
            const img = document.createElement('img');
            img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
            img.alt = "Wedding Photo";
            img.loading = "lazy";
            img.style.width = "100%";
            img.style.height = "auto";
            galleryContainer.appendChild(img);
        });
    }
});

