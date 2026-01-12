// 全域設定檔 (Global Configuration)
const config = {
    groom: {
        name: "Danny",
        bio: "大家好，我是 Danny。這是我關於新郎的自我介紹...",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    bride: {
        name: "Vivian",
        bio: "大家好，我是 Vivian。這是我關於新娘的自我介紹...",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    
    // 自動組合 coupleNames (例如: "Danny & Vivian")
    get coupleNames() {
        return `${this.groom.name} & ${this.bride.name}`;
    },

    // 自動生成航班編號 (例如: "DV2026")
    get flightCode() {
        if (this.groom && this.groom.name && this.bride && this.bride.name && this.wedding && this.wedding.date) {
            const groomInitial = this.groom.name.charAt(0).toUpperCase();
            const brideInitial = this.bride.name.charAt(0).toUpperCase();
            const year = this.wedding.date.split('-')[0];
            return `${groomInitial}${brideInitial}${year}`;
        }
        return "WED2026"; // Fallback
    },

    wedding: {
        date: "2026-09-27",
        time: "12:00:00",
        timeDisplay: "12:00 午宴 (Lunch Banquet)", // 顯示在頁面上的時間文字
        fullDate: "2026-09-27T12:00:00",
        flightStart: "2025-11-23", // 飛行起飛日期 (作為進度條起點，例如求婚日或一年前) / Flight Departure Date for Progress Bar
        location: "茹曦酒店 (Illume Taipei)",
        locationUrl: "https://maps.app.goo.gl/1r8dfQSAZFKQgdfW7",
        hall: "5F 斯賓諾莎廳"
    },

    line: {
        url: "https://line.me/R/ti/p/@351smqji",
        // 使用 QR Code API 將 Line ID 連結轉為圖片
        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/R/ti/p/@351smqji"
    },

    rsvp: {
        // Google Apps Script API URL (RSVP Check)
        apiUrl: "https://script.google.com/macros/s/AKfycby8ExQzxXaVjA8QThNBzUTVT_AAgFhqUZ1lauR4VI4G90JUTcxFVm3pzNfpr64zh8n88g/exec",
        formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeH0zboPi8YmVt5gppc2ASGOl4pCF_1HGrzCGJliUvtdj0ajQ/viewform?embedded=true",
        // 電子喜帖圖片 (E-Invitation Images)
        // 請填入 Google Drive 檔案 ID (File IDs)
        invitationImages: [
            "1yP_uDZx97sRtIM_QhG-Nh3ivMWjNfZ4g"
            // "YOUR_IMAGE_ID_1", 
            // "YOUR_IMAGE_ID_2"
        ]
    },

    seating: {
        // 桌位表圖片 (Seating Chart Images)
        // 若有桌位表圖片，請填入 Google Drive 檔案 ID
        chartImages: [
            // "YOUR_SEATING_CHART_IMAGE_ID"
        ]
    },

    gallery: {
        // 相簿設定 (Gallery Settings)
        // 方式一：使用 Google Apps Script 自動抓取 (推薦)
        apiUrl: "https://script.google.com/macros/s/AKfycbz9wfK_2KlPwSYlvTGb4pcJYkOVjbLdl0PTb12kyqN1sVvv0t5_6FjREH6eC9NqmIVo/exec",
        
        // 方式二：手動填入照片 ID (若不使用 API，或 API 失敗時的備案)
        images: [
            // "IMAGE_ID_1",
            // "IMAGE_ID_2"
        ]
    }
};
