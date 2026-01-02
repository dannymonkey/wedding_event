// 全域設定檔 (Global Configuration)
const config = {
    groomName: "Danny",
    brideName: "Vivian",
    
    // 自動組合 coupleNames (例如: "Danny & Vivian")
    get coupleNames() {
        return `${this.groomName} & ${this.brideName}`;
    },

    weddingDate: "2026-09-27",
    weddingTime: "12:00:00",
    weddingTimeDisplay: "12:00 午宴 (Lunch Banquet)", // 顯示在頁面上的時間文字
    fullWeddingDate: "2026-09-27T12:00:00",

    // 婚禮地點資訊 (Location Info)
    weddingLocation: "茹曦酒店 (Illume Taipei)",
    weddingLocationUrl: "https://maps.app.goo.gl/1r8dfQSAZFKQgdfW7",
    weddingHall: "5F 斯賓諾莎廳",

    // About Us 頁面內容
    groomBio: "大家好，我是 Danny。這是我關於新郎的自我介紹...",
    brideBio: "大家好，我是 Vivian。這是我關於新娘的自我介紹...",
    
    // About Us 照片 (可使用 URL 或相對路徑)
    groomImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // 範例圖片
    brideImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",  // 範例圖片

    // Line Official Account
    lineUrl: "https://line.me/R/ti/p/@351smqji", 
    // 使用 QR Code API 將 Line ID 連結轉為圖片
    lineQRCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/R/ti/p/@351smqji" 
};
