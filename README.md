# Wedding Website Template (Serverless & Configurable)

這是一個高度參數化、響應式設計的婚禮資訊網站模板，專為 GitHub Pages 託管設計。
透過 `js/config.js` 集中管理所有資訊，無需修改 HTML 程式碼即可完成大部分客製化。

## ✨ 主要功能 (Key Features)

*   **全站參數化 (Fully Configurable)**: 所有文字、日期、地點、連結皆透過 `js/config.js` 設定。
*   **響應式設計 (Responsive Design)**: 完美支援手機、平板與桌機瀏覽。
*   **Serverless 整合**:
    *   **RSVP**: 嵌入 Google Forms，資料直接存入 Google Sheets。
    *   **座位查詢**: 透過 Google Apps Script (GAS) 查詢 Google Sheets 資料。
    *   **Line 官方帳號**: 整合 Line ID 與自動生成 QR Code。
*   **隱私保護**: 預設開啟 `noindex` 防止搜尋引擎索引。
*   **多頁面架構**:
    *   `index.html`: 首頁 (倒數計時、Line 加入好友)。
    *   `about.html`: 關於我們 (左右分割視覺設計)。
    *   `rsvp.html`: 電子喜帖與報名表單。
    *   `gallery.html`: 婚紗照相簿 (整合 Google Drive 或是外部圖床)。
    *   `seating.html`: 賓客座位查詢系統。

## 📂 專案結構 (Project Structure)

```
wedding_event/
├── index.html      # 首頁
├── about.html      # 關於我們 (New!)
├── rsvp.html       # 報名頁面
├── gallery.html    # 相簿頁面
├── seating.html    # 座位查詢頁面
├── css/
│   └── style.css   # 全站樣式
├── js/
│   ├── config.js   # [核心] 全站設定檔
│   ├── script.js   # 通用邏輯 (DOM 操作、倒數計時)
│   ├── rsvp.js     # 報名相關邏輯
│   ├── gallery.js  # 相簿載入邏輯
│   └── seating.js  # 座位查詢邏輯
└── images/         # 本地圖片資源
```

## ⚙️ 設定指南 (Configuration Guide)

請開啟 `js/config.js` 進行設定：

```javascript
const config = {
    // 新人資訊
    groomName: "Danny",
    brideName: "Vivian",
    
    // 婚禮時間
    weddingDate: "2026-09-27",
    weddingTimeDisplay: "12:00 午宴 (Lunch Banquet)",
    
    // 婚禮地點
    weddingLocation: "茹曦酒店 (Illume Taipei)",
    weddingLocationUrl: "https://maps.app.goo.gl/...",
    
    // About Us 內容與圖片
    groomBio: "...",
    brideBio: "...",
    groomImage: "URL_TO_IMAGE",
    brideImage: "URL_TO_IMAGE",
    
    // Line 官方帳號 (自動生成 QR Code)
    lineUrl: "https://line.me/R/ti/p/@yourid"
};
```

## 🚀 快速開始 (Quick Start)

1.  **修改設定**: 編輯 `js/config.js` 填入您的婚禮資訊。
2.  **設定表單**: 在 `rsvp.html` 中替換 Google Form 的 `iframe` 連結。
3.  **設定相簿**: 在 `js/gallery.js` 中設定照片來源。
4.  **部署**: 將程式碼推送到 GitHub，並開啟 GitHub Pages 功能。

## 📅 最近更新 (Recent Updates - 2026/01/02)

*   **架構重構**: 建立 `js/config.js`，將 HTML 中的硬編碼資訊 (Hardcoded Info) 全部替換為動態載入。
*   **新增頁面**: 完成 `about.html`，採用左右分割與背景透明度設計。
*   **功能新增**: 首頁新增 Line 官方帳號區塊，支援自動生成 QR Code。
*   **安全性**: 確認嵌入式表單的運作模式 (免登入) 與隱私設定。
*   **樣式優化**: 修正 CSS 編碼問題，優化手機版顯示體驗。

---
*Happy Wedding Planning!*
