// Google Apps Script API URL
// 安全性升級設定教學 (Security Setup Instructions):
// 請參考 src/seating_gas.js 檔案中的說明

document.addEventListener('DOMContentLoaded', () => {
    // Load Seating Chart Images from config
    if (typeof loadGoogleDriveImages === 'function' && config.seating && config.seating.chartImages) {
        loadGoogleDriveImages('seating-chart-container', config.seating.chartImages);
    }

    const searchBtn = document.getElementById('search-btn');
    const guestInput = document.getElementById('guest-name'); // 變數名稱微調
    const resultDiv = document.getElementById('search-result');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (guestInput) {
        guestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    async function handleSearch() {
        const query = guestInput.value.trim();
        if (!query) {
            resultDiv.innerHTML = '<p style="color: red;">請輸入姓名或 Email (Please enter Name or Email)</p>';
            return;
        }

        // --- Prepare Dynamic Data from config.js ---
        // Date Formatting: e.g. "2026-09-27" -> "27 SEP"
        const dateParts = config.wedding.date.split('-'); // [2026, 09, 27]
        const year = dateParts[0];
        const monthIndex = parseInt(dateParts[1]) - 1;
        const day = dateParts[2];
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const dateStr = `${day} ${monthNames[monthIndex]}`;
        
        // Flight Code Logic: Use centralized logic from config.js
        const flightCode = config.flightCode;
        
        // Time: HH:mm (First 5 chars)
        const timeStr = config.wedding.time.substring(0, 5);
        
        // Gate: Use Hall Name (but keep it concise if possible, here using full hall)
        // Taking first 10 chars to prevent layout break if too long? No, Hall name is important.
        const gateStr = config.wedding.hall; 
        // ------------------------------------------

        resultDiv.innerHTML = '<p>查詢中... (Searching...)</p>';

        // --- PREVIEW / DEMO MODE (預覽模式) ---
        if (query.toLowerCase() === 'demo' || query === '預覽') {
            setTimeout(() => {
                const passengerName = "貴賓 (GUEST)";
                const seatNumber = "VIP";
                
                resultDiv.innerHTML = renderBoardingPassHTML(passengerName, seatNumber, "", flightCode, dateStr, timeStr, gateStr);
                // Generate Barcode
                generateBPBarcode(`${flightCode}-${seatNumber}`);
                // Setup Download Button
                setupDownloadButton(`BoardingPass_Demo.png`);
            }, 600);
            return;
        }
        // --------------------------------------

        try {
            // 優先使用 config 中的設定，若無則使用預設值
            const seatingApiUrl = (config.seating && config.seating.apiUrl) ? config.seating.apiUrl : "YOUR_GOOGLE_APPS_SCRIPT_URL";

            if (seatingApiUrl === "YOUR_GOOGLE_APPS_SCRIPT_URL" || seatingApiUrl === "") {
                 resultDiv.innerHTML = '<p>系統設定中，請稍後再試。</p>';
                 console.warn("請在 js/config.js 或 js/seating.js 中設定 seatingApiUrl");
                 return;
            }

            // 改用 query 參數傳送
            const response = await fetch(`${seatingApiUrl}?query=${encodeURIComponent(query)}`, {
                method: "GET",
                redirect: "follow",
            });
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            if (data.found) {
                const guestName = (data.guest && data.guest.trim()) ? data.guest.trim() : query;
                const tbNumber = data.tb_number || data.table || "";
                const tbName = data.tb_name || "";

                const passengerName = sanitizeHTML(guestName.toUpperCase());
                const seatNumberLabel = sanitizeHTML(tbNumber);
                const seatNameLabel = sanitizeHTML(tbName);

                resultDiv.innerHTML = renderBoardingPassHTML(passengerName, seatNumberLabel, seatNameLabel, flightCode, dateStr, timeStr, gateStr);
                // CODE128 不支援中文，barcode 只用桌號（ASCII），避免桌名含中文導致產生失敗
                generateBPBarcode(`${flightCode}-${tbNumber}`);
                setupDownloadButton(`BoardingPass_${passengerName}.png`);
            } else {
                resultDiv.innerHTML = `<p>找不到 "<strong>${sanitizeHTML(query)}</strong>" 的桌位資訊。<br>請確認輸入正確，或直接聯繫新人。</p>`;
            }

        } catch (error) {
            console.error('Error fetching seating data:', error);
            resultDiv.innerHTML = '<p style="color: red;">查詢失敗，請檢查網路連線或稍後再試。</p>';
        }
    }

    function renderBoardingPassHTML(passengerName, seatNumber, seatName, flightCode, dateStr, timeStr, gateStr) {
        return `
            <div id="bp-container" style="padding: 10px; background-color: transparent;"> <!-- Container for capture -->
                <div class="boarding-pass-result animate-in">
                    <!-- Main Ticket -->
                    <div class="bp-main">
                        <div class="bp-header">
                            <div class="bp-logo">
                                <span>✈</span> LOVE AIRLINES
                            </div>
                            <div class="bp-title">BOARDING PASS</div>
                        </div>

                        <div class="bp-route">
                            <div class="bp-city">YOU</div>
                            <div class="bp-plane-icon">✈</div>
                            <div class="bp-city">US</div>
                        </div>
                        
                        <div class="bp-flight-info">
                            <div class="bp-group">
                                <label>FLIGHT</label>
                                <span>${flightCode}</span>
                            </div>
                            <div class="bp-group">
                                <label>DATE</label>
                                <span>${dateStr}</span>
                            </div>
                            <div class="bp-group">
                                <label>TIME</label>
                                <span>${timeStr}</span>
                            </div>
                            <div class="bp-group" style="grid-column: span 3;">
                                <label>GATE</label>
                                <span>${gateStr}</span>
                            </div>
                        </div>

                        <div class="bp-passenger">
                            <label>PASSENGER NAME</label>
                            <div class="bp-passenger-name">${passengerName}</div>
                        </div>
                    </div>
                    
                    <!-- Stub (Right Side) -->
                    <div class="bp-stub">
                        <div class="bp-header">
                            <div class="bp-city">US</div>
                        </div>
                        
                        <div class="bp-passenger">
                            <label>PASSENGER</label>
                            <div class="bp-passenger-name" style="font-size: 1rem;">${passengerName}</div>
                        </div>
                        
                        <div class="bp-seat-large">
                            <label>SEAT NO.</label>
                            <span class="bp-seat-number">${seatNumber}</span>
                            ${seatName ? `<span class="bp-seat-table-name">${seatName}</span>` : ''}
                        </div>

                        <img class="bp-barcode" />
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button id="download-bp-btn" class="btn" style="background-color: var(--color-navy); color: white;">
                    <span style="font-size: 1.2rem; margin-right: 5px;">📥</span> 下載登機證 (Download)
                </button>
            </div>
        `;
    }

    function setupDownloadButton(fileName) {
        const downloadBtn = document.getElementById('download-bp-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const element = document.getElementById('bp-container'); // Capture the wrapper
                if (typeof html2canvas === 'function' && element) {
                    // Show loading state
                    const originalText = downloadBtn.innerHTML;
                    downloadBtn.innerText = "處理中... (Processing...)";
                    downloadBtn.disabled = true;

                    html2canvas(element, {
                        backgroundColor: null, // Transparent background if possible, or use computed
                        scale: 2, // Retain high quality
                        useCORS: true, // Attempt to load external images if any
                        logging: false
                    }).then(canvas => {
                        // Create download link
                        const link = document.createElement('a');
                        link.download = fileName || 'boarding-pass.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();

                        // Restore button
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                    }).catch(err => {
                        console.error("Screenshot failed:", err);
                        downloadBtn.innerText = "下載失敗 (Failed)";
                        setTimeout(() => {
                            downloadBtn.innerHTML = originalText;
                            downloadBtn.disabled = false;
                        }, 3000);
                    });
                } else {
                    console.error("html2canvas library not loaded or element missing");
                    alert("無法下載，請稍後再試 (Download unavailable)");
                }
            });
        }
    }

    function generateBPBarcode(text) {
        if (typeof JsBarcode === 'function') {
            try {
                // Ensure the element exists before calling
                if (document.querySelector(".bp-barcode")) {
                    JsBarcode(".bp-barcode", text, {
                        format: "CODE128",
                        width: 2,
                        height: 30,
                        displayValue: false,
                        margin: 0,
                        background: "transparent",
                        lineColor: "#333"
                    });
                }
            } catch (e) {
                console.warn("Barcode generation failed:", e);
            }
        }
    }
});
