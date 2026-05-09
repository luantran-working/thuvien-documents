# Tích hợp Máy Quét Mã Vạch

## Tổng quan

Hệ thống thư viện sử dụng máy quét mã vạch USB để:
- Quét mã ISBN trên sách (ISBN-13, EAN-13)
- Quét thẻ học sinh khi mượn/trả sách
- Quét mã vạch tự tạo cho sách không có ISBN
- Tăng tốc độ xử lý giao dịch

## Công nghệ sử dụng

### 1. QuaggaJS (Web-based)
**Ưu điểm:**
- Chạy trực tiếp trên trình duyệt
- Không cần driver thiết bị
- Hỗ trợ camera và USB scanner
- Nhẹ, dễ tích hợp

**Nhược điểm:**
- Độ chính xác thấp hơn native
- Phụ thuộc vào chất lượng camera
- Hiệu năng kém hơn với barcode mờ

**Cài đặt:**
```bash
npm install quagga
```

**Code mẫu:**
```javascript
import Quagga from 'quagga';

// Khởi tạo scanner
Quagga.init({
  inputStream: {
    name: "Live",
    type: "LiveStream",
    target: document.querySelector('#scanner-container'),
    constraints: {
      width: 640,
      height: 480,
      facingMode: "environment"
    }
  },
  decoder: {
    readers: [
      "ean_reader",      // ISBN-13
      "code_128_reader", // Thẻ học sinh
      "code_39_reader"   // Mã tự tạo
    ]
  }
}, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  Quagga.start();
});

// Xử lý kết quả quét
Quagga.onDetected(function(result) {
  const code = result.codeResult.code;
  console.log("Mã vạch:", code);
  
  // Xử lý theo loại mã
  if (code.length === 13 && code.startsWith('978')) {
    // ISBN-13
    handleBookScan(code);
  } else if (code.startsWith('HS')) {
    // Thẻ học sinh
    handleStudentCardScan(code);
  }
});
```

### 2. ZXing (Native - Electron)
**Ưu điểm:**
- Độ chính xác cao
- Xử lý nhanh
- Hỗ trợ nhiều định dạng barcode
- Hoạt động tốt với mã mờ/hỏng

**Nhược điểm:**
- Cần cài đặt native module
- Phức tạp hơn trong setup

**Cài đặt:**
```bash
npm install @zxing/library
```

**Code mẫu:**
```javascript
import { BrowserMultiFormatReader } from '@zxing/library';

const codeReader = new BrowserMultiFormatReader();

// Quét từ USB scanner (như keyboard input)
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && barcodeBuffer.length > 0) {
    processBarcodeInput(barcodeBuffer);
    barcodeBuffer = '';
  } else {
    barcodeBuffer += e.key;
  }
});

// Quét từ camera
async function startCameraScanning() {
  try {
    const result = await codeReader.decodeFromVideoDevice(
      null, // deviceId (null = default camera)
      'video',
      (result, err) => {
        if (result) {
          console.log('Quét được:', result.getText());
          handleScanResult(result.getText());
        }
      }
    );
  } catch (err) {
    console.error('Lỗi camera:', err);
  }
}
```

### 3. USB HID Scanner (Khuyến nghị)
Máy quét USB hoạt động như bàn phím (HID mode) - đơn giản nhất:

```javascript
let barcodeBuffer = '';
let scanTimeout = null;

// Lắng nghe input từ scanner
document.addEventListener('keypress', (e) => {
  // Scanner gửi Enter sau khi quét xong
  if (e.key === 'Enter') {
    if (barcodeBuffer.length > 0) {
      processScan(barcodeBuffer);
      barcodeBuffer = '';
    }
    return;
  }
  
  // Tích lũy ký tự
  barcodeBuffer += e.key;
  
  // Reset buffer nếu quá lâu (phân biệt scanner vs typing)
  clearTimeout(scanTimeout);
  scanTimeout = setTimeout(() => {
    barcodeBuffer = '';
  }, 100);
});

function processScan(barcode) {
  // Xác định loại mã
  if (barcode.length === 13 && /^\d+$/.test(barcode)) {
    // ISBN-13 hoặc EAN-13
    if (barcode.startsWith('978') || barcode.startsWith('979')) {
      searchBookByISBN(barcode);
    }
  } else if (barcode.startsWith('HS')) {
    // Thẻ học sinh
    loadStudentInfo(barcode);
  } else if (barcode.startsWith('BK')) {
    // Mã sách tự tạo
    loadBookInfo(barcode);
  } else {
    showError('Mã vạch không hợp lệ');
  }
}
```

## Định dạng mã vạch

### ISBN-13 (Sách xuất bản)
- **Format:** 13 chữ số
- **Prefix:** 978 hoặc 979
- **Ví dụ:** 9780134685991
- **Barcode type:** EAN-13

### Thẻ học sinh
- **Format:** HS + 8 chữ số
- **Ví dụ:** HS20240001
- **Barcode type:** Code 128
- **Cấu trúc:** HS + năm (4) + số thứ tự (4)

### Mã sách tự tạo
- **Format:** BK + 8 chữ số
- **Ví dụ:** BK00001234
- **Barcode type:** Code 128
- **Dùng cho:** Sách không có ISBN, tài liệu nội bộ

## Xử lý lỗi quét

```javascript
class BarcodeScanner {
  constructor() {
    this.lastScan = null;
    this.duplicateThreshold = 2000; // ms
  }
  
  processScan(barcode) {
    // Kiểm tra quét trùng
    if (this.isDuplicate(barcode)) {
      console.log('Bỏ qua quét trùng');
      return;
    }
    
    // Validate mã vạch
    if (!this.validateBarcode(barcode)) {
      this.showError('Mã vạch không hợp lệ: ' + barcode);
      this.playErrorSound();
      return;
    }
    
    // Xử lý theo loại
    this.handleBarcodeType(barcode);
    this.playSuccessSound();
    
    // Lưu lịch sử
    this.lastScan = {
      code: barcode,
      timestamp: Date.now()
    };
  }
  
  isDuplicate(barcode) {
    if (!this.lastScan) return false;
    
    const timeDiff = Date.now() - this.lastScan.timestamp;
    return this.lastScan.code === barcode && 
           timeDiff < this.duplicateThreshold;
  }
  
  validateBarcode(barcode) {
    // ISBN-13
    if (/^97[89]\d{10}$/.test(barcode)) {
      return this.validateISBN13(barcode);
    }
    
    // Thẻ học sinh
    if (/^HS\d{8}$/.test(barcode)) {
      return true;
    }
    
    // Mã sách
    if (/^BK\d{8}$/.test(barcode)) {
      return true;
    }
    
    return false;
  }
  
  validateISBN13(isbn) {
    // Kiểm tra checksum ISBN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(isbn[12]);
  }
  
  playSuccessSound() {
    const audio = new Audio('/sounds/beep-success.mp3');
    audio.play();
  }
  
  playErrorSound() {
    const audio = new Audio('/sounds/beep-error.mp3');
    audio.play();
  }
  
  showError(message) {
    // Hiển thị thông báo lỗi
    const notification = document.createElement('div');
    notification.className = 'scan-error';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
}
```

## Cấu hình thiết bị

### Cài đặt máy quét USB
1. Cắm máy quét vào cổng USB
2. Windows tự động cài driver (HID keyboard)
3. Không cần cài đặt thêm phần mềm

### Cấu hình scanner
Sử dụng barcode cấu hình từ nhà sản xuất:

**Cài đặt khuyến nghị:**
- **Mode:** USB HID Keyboard
- **Suffix:** Enter (CR)
- **Prefix:** None
- **Beep:** On (có tiếng beep khi quét)
- **LED:** On (đèn sáng khi quét thành công)
- **Scan mode:** Continuous (quét liên tục)

### Test scanner
```javascript
// Trang test đơn giản
function testScanner() {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Quét mã vạch vào đây...';
  input.style.fontSize = '24px';
  input.style.padding = '20px';
  
  input.addEventListener('change', (e) => {
    console.log('Quét được:', e.target.value);
    alert('Mã vạch: ' + e.target.value);
    e.target.value = '';
  });
  
  document.body.appendChild(input);
  input.focus();
}
```

## Danh sách thiết bị tương thích

### Máy quét khuyến nghị

#### 1. **Honeywell Voyager 1200g** (Tầm trung)
- **Giá:** ~1.500.000 VNĐ
- **Loại:** Laser scanner
- **Kết nối:** USB
- **Ưu điểm:** Bền, quét nhanh, đọc được mã mờ
- **Nhược điểm:** Cần giữ ổn định

#### 2. **Datalogic QuickScan QD2430** (Cao cấp)
- **Giá:** ~2.500.000 VNĐ
- **Loại:** 2D imager
- **Kết nối:** USB
- **Ưu điểm:** Quét 2D, QR code, màn hình điện thoại
- **Nhược điểm:** Đắt hơn

#### 3. **Symcode MJ-2877** (Giá rẻ)
- **Giá:** ~300.000 VNĐ
- **Loại:** CCD scanner
- **Kết nối:** USB
- **Ưu điểm:** Rẻ, đủ dùng cho thư viện nhỏ
- **Nhược điểm:** Kém bền, phải đưa sát mã vạch

#### 4. **Zebra DS2208** (Chuyên nghiệp)
- **Giá:** ~3.000.000 VNĐ
- **Loại:** 2D imager
- **Kết nối:** USB
- **Ưu điểm:** Rất bền, quét mọi loại mã, quét từ xa
- **Nhược điểm:** Giá cao

### Yêu cầu tối thiểu
- Kết nối USB (HID keyboard mode)
- Hỗ trợ EAN-13, Code 128
- Tốc độ quét: ≥100 scans/giây
- Độ chính xác: ≥99%

## Tích hợp vào ứng dụng

### Component React
```jsx
import { useState, useEffect } from 'react';

function BarcodeInput({ onScan, placeholder = "Quét mã vạch..." }) {
  const [buffer, setBuffer] = useState('');
  
  useEffect(() => {
    let timeout;
    
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && buffer.length > 0) {
        onScan(buffer);
        setBuffer('');
        return;
      }
      
      setBuffer(prev => prev + e.key);
      
      clearTimeout(timeout);
      timeout = setTimeout(() => setBuffer(''), 100);
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [buffer, onScan]);
  
  return (
    <div className="barcode-input">
      <input
        type="text"
        value={buffer}
        placeholder={placeholder}
        readOnly
        className="barcode-display"
      />
      <span className="scan-icon">📷</span>
    </div>
  );
}

export default BarcodeInput;
```

### Sử dụng trong form mượn sách
```jsx
function BorrowForm() {
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  
  const handleScan = async (barcode) => {
    if (barcode.startsWith('HS')) {
      // Quét thẻ học sinh
      const studentData = await fetchStudent(barcode);
      setStudent(studentData);
    } else if (barcode.startsWith('BK') || /^97[89]/.test(barcode)) {
      // Quét sách
      const bookData = await fetchBook(barcode);
      setBooks(prev => [...prev, bookData]);
    }
  };
  
  return (
    <div>
      <h2>Mượn sách</h2>
      <BarcodeInput onScan={handleScan} />
      
      {student && (
        <div className="student-info">
          <h3>{student.name}</h3>
          <p>Lớp: {student.class}</p>
        </div>
      )}
      
      <ul className="book-list">
        {books.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

1. **Luôn validate mã vạch** trước khi xử lý
2. **Phát âm thanh** để xác nhận quét thành công/thất bại
3. **Tránh quét trùng** trong khoảng thời gian ngắn
4. **Focus vào input ẩn** để nhận dữ liệu từ scanner
5. **Xử lý timeout** để phân biệt scanner và typing thủ công
6. **Log lịch sử quét** để debug và thống kê
7. **Hỗ trợ nhập tay** khi scanner hỏng
8. **Test với mã mờ/hỏng** để đảm bảo độ tin cậy

## Troubleshooting

### Scanner không hoạt động
- Kiểm tra kết nối USB
- Thử cổng USB khác
- Kiểm tra driver trong Device Manager
- Test với Notepad (mở Notepad và quét)

### Quét sai ký tự
- Cấu hình lại scanner (keyboard layout)
- Kiểm tra encoding (UTF-8)
- Đảm bảo không có phím tắt xung đột

### Quét chậm
- Giảm độ phân giải camera (nếu dùng camera)
- Sử dụng USB 2.0/3.0 thay vì hub
- Tối ưu code xử lý barcode

### Không đọc được mã mờ
- Nâng cấp lên 2D imager
- Tăng độ nhạy scanner (nếu có)
- In lại mã vạch với chất lượng cao hơn
