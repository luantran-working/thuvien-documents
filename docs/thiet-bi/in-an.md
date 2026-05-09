# Hệ thống In ấn Thư viện

## Tổng quan

Hệ thống in ấn phục vụ các nhu cầu:
- In phiếu mượn sách
- In phiếu trả sách
- In thẻ thư viện (có mã vạch)
- In nhãn mã vạch dán sách
- In báo cáo thống kê

## Công nghệ sử dụng

### Electron Print API
Electron cung cấp API in ấn mạnh mẽ, không cần plugin:

```javascript
const { BrowserWindow } = require('electron');

async function printDocument(htmlContent, options = {}) {
  // Tạo cửa sổ ẩn để render nội dung
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Load nội dung HTML
  await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  
  // Cấu hình in
  const printOptions = {
    silent: options.silent || false, // true = in ngay, false = hiện dialog
    printBackground: true,
    color: options.color || false,
    margins: {
      marginType: 'custom',
      top: 0.5,
      bottom: 0.5,
      left: 0.5,
      right: 0.5
    },
    pageSize: options.pageSize || 'A4',
    ...options
  };
  
  try {
    await printWindow.webContents.print(printOptions);
    printWindow.close();
    return { success: true };
  } catch (error) {
    printWindow.close();
    return { success: false, error: error.message };
  }
}
```

### Web Print API (Fallback)
Cho phiên bản web không dùng Electron:

```javascript
function printWeb(elementId) {
  const printContent = document.getElementById(elementId);
  const windowPrint = window.open('', '', 'width=800,height=600');
  
  windowPrint.document.write(`
    <html>
      <head>
        <title>In ấn</title>
        <link rel="stylesheet" href="/print.css">
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  
  windowPrint.document.close();
  windowPrint.focus();
  windowPrint.print();
  windowPrint.close();
}
```

## Templates In ấn

### 1. Phiếu mượn sách

**Template HTML:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A5;
      margin: 1cm;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }
    
    .school-name {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .title {
      font-size: 16pt;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    
    .info-row {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    
    .label {
      font-weight: bold;
      width: 150px;
    }
    
    .value {
      flex: 1;
      border-bottom: 1px dotted #000;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature {
      text-align: center;
      width: 45%;
    }
    
    .signature-line {
      margin-top: 60px;
      border-top: 1px solid #000;
      padding-top: 5px;
    }
    
    .barcode {
      text-align: center;
      margin: 10px 0;
    }
    
    .barcode img {
      height: 50px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="school-name">{{schoolName}}</div>
    <div>Thư viện trường</div>
  </div>
  
  <div class="title">PHIẾU MƯỢN SÁCH</div>
  
  <div class="barcode">
    <img src="{{barcodeImage}}" alt="Mã phiếu">
    <div>{{borrowId}}</div>
  </div>
  
  <div class="info-row">
    <span class="label">Họ và tên:</span>
    <span class="value">{{studentName}}</span>
  </div>
  
  <div class="info-row">
    <span class="label">Lớp:</span>
    <span class="value">{{studentClass}}</span>
  </div>
  
  <div class="info-row">
    <span class="label">Mã học sinh:</span>
    <span class="value">{{studentId}}</span>
  </div>
  
  <div class="info-row">
    <span class="label">Ngày mượn:</span>
    <span class="value">{{borrowDate}}</span>
  </div>
  
  <div class="info-row">
    <span class="label">Hạn trả:</span>
    <span class="value">{{dueDate}}</span>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Tên sách</th>
        <th>Mã sách</th>
        <th>Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      {{#each books}}
      <tr>
        <td>{{@index}}</td>
        <td>{{title}}</td>
        <td>{{bookId}}</td>
        <td>{{condition}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  
  <div class="footer">
    <div class="signature">
      <div>Người mượn</div>
      <div class="signature-line">{{studentName}}</div>
    </div>
    <div class="signature">
      <div>Thủ thư</div>
      <div class="signature-line">{{librarianName}}</div>
    </div>
  </div>
</body>
</html>
```

**Code in phiếu mượn:**
```javascript
const Handlebars = require('handlebars');
const JsBarcode = require('jsbarcode');
const { Canvas } = require('canvas');

async function printBorrowReceipt(borrowData) {
  // Tạo mã vạch
  const canvas = new Canvas();
  JsBarcode(canvas, borrowData.borrowId, {
    format: 'CODE128',
    width: 2,
    height: 50,
    displayValue: false
  });
  const barcodeImage = canvas.toDataURL();
  
  // Load template
  const templateSource = await fs.readFile('./templates/borrow-receipt.html', 'utf-8');
  const template = Handlebars.compile(templateSource);
  
  // Render HTML
  const html = template({
    ...borrowData,
    barcodeImage,
    borrowDate: formatDate(borrowData.borrowDate),
    dueDate: formatDate(borrowData.dueDate)
  });
  
  // In
  await printDocument(html, {
    pageSize: 'A5',
    silent: false // Hiện dialog chọn máy in
  });
}
```

### 2. Phiếu trả sách

**Template tương tự phiếu mượn, thêm:**
```html
<div class="info-row">
  <span class="label">Ngày trả:</span>
  <span class="value">{{returnDate}}</span>
</div>

<div class="info-row">
  <span class="label">Trạng thái:</span>
  <span class="value">{{status}}</span>
</div>

{{#if lateDays}}
<div class="info-row" style="color: red;">
  <span class="label">Số ngày trễ:</span>
  <span class="value">{{lateDays}} ngày</span>
</div>
{{/if}}

{{#if fine}}
<div class="info-row" style="color: red;">
  <span class="label">Phí phạt:</span>
  <span class="value">{{fine}} VNĐ</span>
</div>
{{/if}}
```

### 3. Thẻ thư viện

**Template (kích thước thẻ ATM: 85.6mm x 53.98mm):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: 85.6mm 53.98mm;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }
    
    .card {
      width: 85.6mm;
      height: 53.98mm;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8mm;
      box-sizing: border-box;
      position: relative;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 5mm;
    }
    
    .logo {
      width: 12mm;
      height: 12mm;
      margin-right: 3mm;
    }
    
    .school-info {
      flex: 1;
    }
    
    .school-name {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .card-title {
      font-size: 8pt;
    }
    
    .card-body {
      display: flex;
      gap: 3mm;
    }
    
    .photo {
      width: 20mm;
      height: 25mm;
      background: white;
      border: 1px solid #ccc;
    }
    
    .photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .info {
      flex: 1;
      font-size: 8pt;
    }
    
    .info-row {
      margin: 2mm 0;
    }
    
    .label {
      font-weight: bold;
      display: inline-block;
      width: 15mm;
    }
    
    .barcode {
      position: absolute;
      bottom: 3mm;
      right: 8mm;
      text-align: center;
    }
    
    .barcode img {
      height: 12mm;
      background: white;
      padding: 1mm;
    }
    
    .card-id {
      font-size: 7pt;
      margin-top: 1mm;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <img src="{{logoUrl}}" class="logo" alt="Logo">
      <div class="school-info">
        <div class="school-name">{{schoolName}}</div>
        <div class="card-title">Thẻ thư viện</div>
      </div>
    </div>
    
    <div class="card-body">
      <div class="photo">
        <img src="{{photoUrl}}" alt="Ảnh">
      </div>
      
      <div class="info">
        <div class="info-row">
          <span class="label">Họ tên:</span>
          <span>{{studentName}}</span>
        </div>
        <div class="info-row">
          <span class="label">Lớp:</span>
          <span>{{studentClass}}</span>
        </div>
        <div class="info-row">
          <span class="label">Ngày cấp:</span>
          <span>{{issueDate}}</span>
        </div>
        <div class="info-row">
          <span class="label">Hiệu lực:</span>
          <span>{{expiryDate}}</span>
        </div>
      </div>
    </div>
    
    <div class="barcode">
      <img src="{{barcodeImage}}" alt="Mã vạch">
      <div class="card-id">{{cardId}}</div>
    </div>
  </div>
</body>
</html>
```

**Code in thẻ:**
```javascript
async function printLibraryCard(studentData) {
  const canvas = new Canvas();
  JsBarcode(canvas, studentData.cardId, {
    format: 'CODE128',
    width: 1.5,
    height: 40
  });
  
  const html = template({
    ...studentData,
    barcodeImage: canvas.toDataURL(),
    issueDate: formatDate(new Date()),
    expiryDate: formatDate(addYears(new Date(), 1))
  });
  
  await printDocument(html, {
    pageSize: { width: 85600, height: 53980 }, // micrometers
    margins: { marginType: 'none' }
  });
}
```

### 4. Nhãn mã vạch dán sách

**Template (40mm x 20mm):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    @page {
      size: 40mm 20mm;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 2mm;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    
    .barcode img {
      width: 36mm;
      height: 12mm;
    }
    
    .code-text {
      font-size: 8pt;
      margin-top: 1mm;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="barcode">
    <img src="{{barcodeImage}}" alt="{{bookId}}">
  </div>
  <div class="code-text">{{bookId}}</div>
</body>
</html>
```

**In hàng loạt nhãn:**
```javascript
async function printBookLabels(books) {
  // In nhiều nhãn trên 1 trang A4
  const labelsPerRow = 5;
  const labelsPerColumn = 13;
  const labelsPerPage = labelsPerRow * labelsPerColumn;
  
  const pages = [];
  for (let i = 0; i < books.length; i += labelsPerPage) {
    const pageBooks = books.slice(i, i + labelsPerPage);
    pages.push(generateLabelPage(pageBooks));
  }
  
  for (const pageHtml of pages) {
    await printDocument(pageHtml, {
      pageSize: 'A4',
      silent: true
    });
  }
}

function generateLabelPage(books) {
  const labels = books.map(book => {
    const canvas = new Canvas();
    JsBarcode(canvas, book.bookId, {
      format: 'CODE128',
      width: 1,
      height: 30
    });
    
    return `
      <div class="label">
        <img src="${canvas.toDataURL()}" alt="${book.bookId}">
        <div class="code">${book.bookId}</div>
      </div>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: A4; margin: 5mm; }
        body { margin: 0; padding: 0; }
        .label-grid {
          display: grid;
          grid-template-columns: repeat(5, 40mm);
          grid-template-rows: repeat(13, 20mm);
          gap: 2mm;
        }
        .label {
          border: 1px dashed #ccc;
          text-align: center;
          padding: 2mm;
        }
        .label img { width: 36mm; height: 12mm; }
        .code { font-size: 8pt; margin-top: 1mm; }
      </style>
    </head>
    <body>
      <div class="label-grid">
        ${labels}
      </div>
    </body>
    </html>
  `;
}
```

## Cấu hình máy in

### Máy in thường (Inkjet/Laser)
**Khuyến nghị:** HP LaserJet, Canon Pixma

**Cấu hình:**
```javascript
const printerSettings = {
  regular: {
    pageSize: 'A4',
    color: false, // In đen trắng tiết kiệm mực
    duplex: 'simplex', // In 1 mặt
    quality: 'normal',
    margins: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  }
};
```

**Ưu điểm:**
- In được nhiều loại giấy
- Chất lượng cao
- Giá mực rẻ (laser)

**Nhược điểm:**
- Chậm hơn máy in nhiệt
- Tốn giấy

### Máy in nhiệt (Thermal Printer)
**Khuyến nghị:** Xprinter XP-365B, HPRT TP809

**Cấu hình:**
```javascript
const thermalSettings = {
  pageSize: { width: 80000, height: 200000 }, // 80mm width
  margins: { marginType: 'none' },
  silent: true,
  deviceName: 'XP-365B' // Tên máy in
};
```

**Ưu điểm:**
- In nhanh
- Không cần mực
- Tiết kiệm chi phí
- Nhỏ gọn

**Nhược điểm:**
- Chỉ in đen trắng
- Giấy nhiệt phai màu theo thời gian
- Kích thước giấy cố định (58mm, 80mm)

**Sử dụng cho:**
- Phiếu mượn/trả nhanh
- Biên lai
- Nhãn tạm thời

### Máy in thẻ nhựa (Card Printer)
**Khuyến nghị:** Evolis Zenius, Fargo DTC1250e

**Giá:** 15-30 triệu VNĐ

**Ưu điểm:**
- In trực tiếp lên thẻ nhựa
- Bền, đẹp, chuyên nghiệp
- Có thể in mã vạch, mã QR

**Nhược điểm:**
- Đắt
- Chỉ dùng cho thẻ

**Thay thế:** In thẻ giấy cứng + ép plastic (rẻ hơn)

## Quản lý máy in

### Lấy danh sách máy in
```javascript
const { webContents } = require('electron');

async function getPrinters() {
  const printers = await webContents.getPrintersAsync();
  return printers.map(p => ({
    name: p.name,
    displayName: p.displayName,
    description: p.description,
    status: p.status,
    isDefault: p.isDefault,
    options: p.options
  }));
}
```

### Chọn máy in mặc định
```javascript
const Store = require('electron-store');
const store = new Store();

function setDefaultPrinter(printerName, type = 'regular') {
  store.set(`printer.${type}`, printerName);
}

function getDefaultPrinter(type = 'regular') {
  return store.get(`printer.${type}`);
}

// Sử dụng
async function print(html, type = 'regular') {
  const printerName = getDefaultPrinter(type);
  
  await printDocument(html, {
    deviceName: printerName,
    ...printerSettings[type]
  });
}
```

### UI cấu hình máy in
```jsx
function PrinterSettings() {
  const [printers, setPrinters] = useState([]);
  const [selected, setSelected] = useState({
    regular: '',
    thermal: '',
    card: ''
  });
  
  useEffect(() => {
    loadPrinters();
  }, []);
  
  async function loadPrinters() {
    const list = await window.electron.getPrinters();
    setPrinters(list);
    
    // Load saved settings
    const saved = await window.electron.getPrinterSettings();
    setSelected(saved);
  }
  
  async function handleSave() {
    await window.electron.savePrinterSettings(selected);
    alert('Đã lưu cấu hình');
  }
  
  return (
    <div className="printer-settings">
      <h2>Cấu hình máy in</h2>
      
      <div className="setting-group">
        <label>Máy in thường (phiếu, báo cáo):</label>
        <select 
          value={selected.regular}
          onChange={e => setSelected({...selected, regular: e.target.value})}
        >
          <option value="">-- Chọn máy in --</option>
          {printers.map(p => (
            <option key={p.name} value={p.name}>
              {p.displayName} {p.isDefault ? '(Mặc định)' : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div className="setting-group">
        <label>Máy in nhiệt (phiếu nhanh):</label>
        <select 
          value={selected.thermal}
          onChange={e => setSelected({...selected, thermal: e.target.value})}
        >
          <option value="">-- Không sử dụng --</option>
          {printers.map(p => (
            <option key={p.name} value={p.name}>{p.displayName}</option>
          ))}
        </select>
      </div>
      
      <div className="setting-group">
        <label>Máy in thẻ:</label>
        <select 
          value={selected.card}
          onChange={e => setSelected({...selected, card: e.target.value})}
        >
          <option value="">-- Không sử dụng --</option>
          {printers.map(p => (
            <option key={p.name} value={p.name}>{p.displayName}</option>
          ))}
        </select>
      </div>
      
      <button onClick={handleSave}>Lưu cấu hình</button>
      <button onClick={() => testPrint('regular')}>Test in thường</button>
      <button onClick={() => testPrint('thermal')}>Test in nhiệt</button>
    </div>
  );
}
```

## Best Practices

1. **Preview trước khi in** - Cho phép xem trước và chỉnh sửa
2. **Lưu lịch sử in** - Tracking để in lại nếu cần
3. **Xử lý lỗi in** - Thông báo rõ ràng khi máy in lỗi
4. **Tối ưu template** - Sử dụng CSS print-friendly
5. **Batch printing** - In nhiều phiếu cùng lúc
6. **Backup template** - Lưu template dạng file riêng
7. **Test trên giấy thật** - Đảm bảo layout chính xác
8. **Hỗ trợ nhiều kích thước** - A4, A5, thermal roll

## Troubleshooting

### Không tìm thấy máy in
- Kiểm tra kết nối USB/Network
- Cài đặt driver máy in
- Restart Print Spooler service (Windows)

### Layout bị lệch
- Kiểm tra margins trong CSS
- Đảm bảo page size đúng
- Test với PDF trước

### Chữ bị mờ/nhòe
- Tăng font-weight
- Sử dụng font rõ ràng (Arial, Times New Roman)
- Kiểm tra mực/toner

### In chậm
- Giảm chất lượng in (draft mode)
- Sử dụng máy in nhiệt cho phiếu nhanh
- Tối ưu HTML (bỏ ảnh nặng)

### Mã vạch không quét được
- Tăng kích thước barcode
- Sử dụng độ phân giải cao hơn
- Đảm bảo contrast đủ (đen trên trắng)
- Kiểm tra định dạng barcode đúng
