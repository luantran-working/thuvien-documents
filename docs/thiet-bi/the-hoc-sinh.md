# Quản lý Thẻ Thư viện Học sinh

## Tổng quan

Thẻ thư viện là công cụ quan trọng để:
- Xác định học sinh khi mượn/trả sách
- Quản lý quyền truy cập thư viện
- Theo dõi lịch sử mượn sách
- Tạo trải nghiệm chuyên nghiệp

## Thiết kế thẻ

### Thông tin trên thẻ

**Mặt trước:**
- Logo trường
- Tên trường
- Tiêu đề "THẺ THƯ VIỆN"
- Ảnh học sinh (3x4cm)
- Họ tên học sinh
- Lớp
- Mã học sinh
- Ngày cấp
- Ngày hết hạn
- Mã vạch (Code 128)

**Mặt sau (tùy chọn):**
- Quy định sử dụng thư viện
- Số điện thoại liên hệ
- Website thư viện
- QR code (link đến hồ sơ online)

### Kích thước chuẩn

**Thẻ nhựa PVC:** 85.6mm x 53.98mm (kích thước thẻ ATM)
- Độ dày: 0.76mm (30 mil)
- Chất liệu: PVC, PET, hoặc Composite
- Có thể ép plastic hoặc laminate

**Thẻ giấy:** 85.6mm x 53.98mm
- Giấy cứng 250-300gsm
- Ép plastic bóng/mờ
- Giá rẻ hơn thẻ nhựa

### Mã vạch trên thẻ

**Format:** HS + Năm + Số thứ tự
- **Ví dụ:** HS20260001, HS20260002
- **Barcode type:** Code 128
- **Kích thước:** 40mm x 15mm
- **Vị trí:** Góc dưới bên phải

```javascript
function generateStudentCardId(year, sequence) {
  const yearStr = year.toString();
  const seqStr = sequence.toString().padStart(4, '0');
  return `HS${yearStr}${seqStr}`;
}

// Ví dụ
generateStudentCardId(2026, 1);    // HS20260001
generateStudentCardId(2026, 123);  // HS20260123
```

## Cơ sở dữ liệu thẻ

### Schema

```sql
CREATE TABLE library_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT UNIQUE NOT NULL,           -- HS20260001
  student_id INTEGER NOT NULL,            -- FK to students
  issue_date DATE NOT NULL,               -- Ngày cấp
  expiry_date DATE NOT NULL,              -- Ngày hết hạn
  status TEXT DEFAULT 'active',           -- active, blocked, lost, expired
  block_reason TEXT,                      -- Lý do khóa thẻ
  lost_date DATE,                         -- Ngày báo mất
  replacement_fee DECIMAL(10,2),          -- Phí làm lại thẻ
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE INDEX idx_card_id ON library_cards(card_id);
CREATE INDEX idx_student_id ON library_cards(student_id);
CREATE INDEX idx_status ON library_cards(status);

-- Lịch sử thẻ
CREATE TABLE card_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL,
  action TEXT NOT NULL,                   -- issued, blocked, unblocked, lost, replaced
  reason TEXT,
  performed_by TEXT,                      -- Người thực hiện
  performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES library_cards(card_id)
);
```

### Model

```javascript
class LibraryCard {
  static async create(studentId) {
    const year = new Date().getFullYear();
    const lastCard = await db.get(
      'SELECT card_id FROM library_cards WHERE card_id LIKE ? ORDER BY card_id DESC LIMIT 1',
      [`HS${year}%`]
    );
    
    let sequence = 1;
    if (lastCard) {
      const lastSeq = parseInt(lastCard.card_id.slice(-4));
      sequence = lastSeq + 1;
    }
    
    const cardId = `HS${year}${sequence.toString().padStart(4, '0')}`;
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Hiệu lực 1 năm
    
    await db.run(`
      INSERT INTO library_cards (card_id, student_id, issue_date, expiry_date, status)
      VALUES (?, ?, ?, ?, 'active')
    `, [cardId, studentId, issueDate.toISOString(), expiryDate.toISOString()]);
    
    await this.logHistory(cardId, 'issued', 'Cấp thẻ mới');
    
    return cardId;
  }
  
  static async findByCardId(cardId) {
    return await db.get(`
      SELECT c.*, s.name, s.class, s.photo_url
      FROM library_cards c
      JOIN students s ON c.student_id = s.id
      WHERE c.card_id = ?
    `, [cardId]);
  }
  
  static async findByStudentId(studentId) {
    return await db.get(`
      SELECT * FROM library_cards
      WHERE student_id = ? AND status = 'active'
      ORDER BY issue_date DESC
      LIMIT 1
    `, [studentId]);
  }
  
  static async block(cardId, reason) {
    await db.run(`
      UPDATE library_cards
      SET status = 'blocked', block_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE card_id = ?
    `, [reason, cardId]);
    
    await this.logHistory(cardId, 'blocked', reason);
  }
  
  static async unblock(cardId) {
    await db.run(`
      UPDATE library_cards
      SET status = 'active', block_reason = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE card_id = ?
    `, [cardId]);
    
    await this.logHistory(cardId, 'unblocked', 'Mở khóa thẻ');
  }
  
  static async reportLost(cardId) {
    await db.run(`
      UPDATE library_cards
      SET status = 'lost', lost_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE card_id = ?
    `, [cardId]);
    
    await this.logHistory(cardId, 'lost', 'Báo mất thẻ');
  }
  
  static async replace(oldCardId, studentId, fee = 20000) {
    // Vô hiệu hóa thẻ cũ
    await db.run(`
      UPDATE library_cards
      SET status = 'replaced', updated_at = CURRENT_TIMESTAMP
      WHERE card_id = ?
    `, [oldCardId]);
    
    // Tạo thẻ mới
    const newCardId = await this.create(studentId);
    
    // Ghi phí
    await db.run(`
      UPDATE library_cards
      SET replacement_fee = ?
      WHERE card_id = ?
    `, [fee, newCardId]);
    
    await this.logHistory(oldCardId, 'replaced', `Làm lại thẻ mới: ${newCardId}`);
    
    return newCardId;
  }
  
  static async checkExpiry(cardId) {
    const card = await this.findByCardId(cardId);
    if (!card) return { valid: false, reason: 'Thẻ không tồn tại' };
    
    if (card.status !== 'active') {
      return { valid: false, reason: `Thẻ đã bị ${card.status}` };
    }
    
    const now = new Date();
    const expiry = new Date(card.expiry_date);
    
    if (now > expiry) {
      await db.run(`
        UPDATE library_cards
        SET status = 'expired', updated_at = CURRENT_TIMESTAMP
        WHERE card_id = ?
      `, [cardId]);
      
      return { valid: false, reason: 'Thẻ đã hết hạn' };
    }
    
    return { valid: true, card };
  }
  
  static async logHistory(cardId, action, reason) {
    await db.run(`
      INSERT INTO card_history (card_id, action, reason, performed_by)
      VALUES (?, ?, ?, ?)
    `, [cardId, action, reason, 'system']); // TODO: Get current user
  }
  
  static async getHistory(cardId) {
    return await db.all(`
      SELECT * FROM card_history
      WHERE card_id = ?
      ORDER BY performed_at DESC
    `, [cardId]);
  }
}
```

## Quy trình cấp thẻ

### 1. Cấp thẻ mới cho học sinh

```javascript
async function issueNewCard(studentId) {
  // Kiểm tra học sinh đã có thẻ chưa
  const existingCard = await LibraryCard.findByStudentId(studentId);
  if (existingCard && existingCard.status === 'active') {
    throw new Error('Học sinh đã có thẻ hoạt động');
  }
  
  // Tạo thẻ mới
  const cardId = await LibraryCard.create(studentId);
  
  // Lấy thông tin đầy đủ
  const card = await LibraryCard.findByCardId(cardId);
  
  // In thẻ
  await printLibraryCard(card);
  
  return card;
}
```

### 2. Cấp thẻ hàng loạt (đầu năm học)

```javascript
async function issueBulkCards(classId) {
  const students = await db.all(`
    SELECT s.* FROM students s
    LEFT JOIN library_cards c ON s.id = c.student_id AND c.status = 'active'
    WHERE s.class_id = ? AND c.id IS NULL
  `, [classId]);
  
  const cards = [];
  
  for (const student of students) {
    try {
      const cardId = await LibraryCard.create(student.id);
      const card = await LibraryCard.findByCardId(cardId);
      cards.push(card);
    } catch (error) {
      console.error(`Lỗi cấp thẻ cho ${student.name}:`, error);
    }
  }
  
  // In hàng loạt
  await printBulkCards(cards);
  
  return cards;
}
```

### 3. Báo mất thẻ

```javascript
async function reportLostCard(cardId) {
  // Kiểm tra thẻ tồn tại
  const card = await LibraryCard.findByCardId(cardId);
  if (!card) {
    throw new Error('Thẻ không tồn tại');
  }
  
  // Kiểm tra sách đang mượn
  const borrowedBooks = await db.all(`
    SELECT * FROM borrows
    WHERE student_id = ? AND status = 'borrowed'
  `, [card.student_id]);
  
  if (borrowedBooks.length > 0) {
    throw new Error('Học sinh đang mượn sách, cần trả hết trước khi báo mất thẻ');
  }
  
  // Đánh dấu mất
  await LibraryCard.reportLost(cardId);
  
  return {
    message: 'Đã báo mất thẻ',
    replacementFee: 20000 // Phí làm lại thẻ
  };
}
```

### 4. Làm lại thẻ

```javascript
async function replaceCard(oldCardId, paymentConfirmed = false) {
  const card = await LibraryCard.findByCardId(oldCardId);
  if (!card) {
    throw new Error('Thẻ không tồn tại');
  }
  
  if (!paymentConfirmed) {
    return {
      requirePayment: true,
      fee: 20000,
      message: 'Vui lòng thanh toán phí làm lại thẻ'
    };
  }
  
  // Tạo thẻ mới
  const newCardId = await LibraryCard.replace(oldCardId, card.student_id, 20000);
  const newCard = await LibraryCard.findByCardId(newCardId);
  
  // In thẻ mới
  await printLibraryCard(newCard);
  
  return newCard;
}
```

### 5. Khóa/Mở khóa thẻ

```javascript
async function blockCard(cardId, reason) {
  await LibraryCard.block(cardId, reason);
  
  // Gửi thông báo cho học sinh (nếu có email/SMS)
  const card = await LibraryCard.findByCardId(cardId);
  await sendNotification(card.student_id, {
    title: 'Thẻ thư viện bị khóa',
    message: `Lý do: ${reason}. Vui lòng liên hệ thư viện.`
  });
}

async function unblockCard(cardId) {
  await LibraryCard.unblock(cardId);
  
  const card = await LibraryCard.findByCardId(cardId);
  await sendNotification(card.student_id, {
    title: 'Thẻ thư viện đã được mở khóa',
    message: 'Bạn có thể tiếp tục sử dụng thư viện.'
  });
}
```

## Tích hợp với hệ thống mượn/trả

### Quét thẻ khi mượn sách

```javascript
async function scanCardForBorrow(cardId) {
  // Kiểm tra thẻ hợp lệ
  const validation = await LibraryCard.checkExpiry(cardId);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.reason
    };
  }
  
  const card = validation.card;
  
  // Kiểm tra số sách đang mượn
  const borrowedCount = await db.get(`
    SELECT COUNT(*) as count FROM borrows
    WHERE student_id = ? AND status = 'borrowed'
  `, [card.student_id]);
  
  const maxBooks = 5; // Giới hạn mượn tối đa
  if (borrowedCount.count >= maxBooks) {
    return {
      success: false,
      error: `Đã mượn tối đa ${maxBooks} cuốn`
    };
  }
  
  // Kiểm tra sách quá hạn
  const overdueBooks = await db.get(`
    SELECT COUNT(*) as count FROM borrows
    WHERE student_id = ? AND status = 'borrowed' AND due_date < date('now')
  `, [card.student_id]);
  
  if (overdueBooks.count > 0) {
    return {
      success: false,
      error: `Có ${overdueBooks.count} sách quá hạn, cần trả trước khi mượn tiếp`
    };
  }
  
  // Thẻ hợp lệ
  return {
    success: true,
    student: {
      id: card.student_id,
      name: card.name,
      class: card.class,
      photoUrl: card.photo_url,
      borrowedCount: borrowedCount.count,
      maxBooks: maxBooks
    }
  };
}
```

### UI quét thẻ

```jsx
function CardScanner({ onCardScanned }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let buffer = '';
    let timeout;
    
    const handleKeyPress = async (e) => {
      if (!scanning) return;
      
      if (e.key === 'Enter' && buffer.length > 0) {
        // Kiểm tra định dạng thẻ
        if (buffer.startsWith('HS')) {
          try {
            const result = await window.electron.scanCard(buffer);
            if (result.success) {
              onCardScanned(result.student);
              setError(null);
            } else {
              setError(result.error);
            }
          } catch (err) {
            setError('Lỗi kết nối hệ thống');
          }
        } else {
          setError('Mã thẻ không hợp lệ');
        }
        buffer = '';
        return;
      }
      
      buffer += e.key;
      clearTimeout(timeout);
      timeout = setTimeout(() => buffer = '', 100);
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [scanning, onCardScanned]);
  
  return (
    <div className="card-scanner">
      <button 
        onClick={() => setScanning(!scanning)}
        className={scanning ? 'scanning' : ''}
      >
        {scanning ? '🟢 Đang quét thẻ...' : '⚪ Bắt đầu quét'}
      </button>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      {scanning && (
        <div className="scan-instruction">
          Vui lòng quét thẻ học sinh
        </div>
      )}
    </div>
  );
}
```

## In thẻ hàng loạt

### Template in nhiều thẻ trên 1 trang A4

```javascript
function generateBulkCardPage(cards) {
  // 10 thẻ trên 1 trang A4 (2 cột x 5 hàng)
  const cardsPerPage = 10;
  
  const cardHtml = cards.map(card => {
    const canvas = new Canvas();
    JsBarcode(canvas, card.card_id, {
      format: 'CODE128',
      width: 1.5,
      height: 40
    });
    
    return `
      <div class="card-wrapper">
        <div class="card">
          <div class="card-header">
            <img src="${card.school_logo}" class="logo">
            <div class="school-info">
              <div class="school-name">${card.school_name}</div>
              <div class="card-title">Thẻ thư viện</div>
            </div>
          </div>
          
          <div class="card-body">
            <div class="photo">
              <img src="${card.photo_url || '/default-avatar.png'}">
            </div>
            <div class="info">
              <div><strong>Họ tên:</strong> ${card.name}</div>
              <div><strong>Lớp:</strong> ${card.class}</div>
              <div><strong>Ngày cấp:</strong> ${formatDate(card.issue_date)}</div>
              <div><strong>Hiệu lực:</strong> ${formatDate(card.expiry_date)}</div>
            </div>
          </div>
          
          <div class="barcode">
            <img src="${canvas.toDataURL()}">
            <div class="card-id">${card.card_id}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 10mm; }
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 85.6mm);
          grid-template-rows: repeat(5, 53.98mm);
          gap: 5mm;
        }
        
        .card-wrapper {
          page-break-inside: avoid;
        }
        
        .card {
          width: 85.6mm;
          height: 53.98mm;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3mm;
          box-sizing: border-box;
          position: relative;
          border: 1px dashed #ccc;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 2mm;
        }
        
        .logo {
          width: 10mm;
          height: 10mm;
          margin-right: 2mm;
        }
        
        .school-name {
          font-size: 9pt;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .card-title {
          font-size: 7pt;
        }
        
        .card-body {
          display: flex;
          gap: 2mm;
        }
        
        .photo {
          width: 18mm;
          height: 23mm;
          background: white;
        }
        
        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .info {
          flex: 1;
          font-size: 7pt;
        }
        
        .info div {
          margin: 1mm 0;
        }
        
        .barcode {
          position: absolute;
          bottom: 2mm;
          right: 3mm;
          text-align: center;
        }
        
        .barcode img {
          height: 10mm;
          background: white;
          padding: 0.5mm;
        }
        
        .card-id {
          font-size: 6pt;
          margin-top: 0.5mm;
        }
      </style>
    </head>
    <body>
      <div class="card-grid">
        ${cardHtml}
      </div>
    </body>
    </html>
  `;
}

async function printBulkCards(cards) {
  const cardsPerPage = 10;
  
  for (let i = 0; i < cards.length; i += cardsPerPage) {
    const pageCards = cards.slice(i, i + cardsPerPage);
    const html = generateBulkCardPage(pageCards);
    
    await printDocument(html, {
      pageSize: 'A4',
      silent: false,
      margins: { marginType: 'custom', top: 10, bottom: 10, left: 10, right: 10 }
    });
  }
}
```

## Quản lý thẻ - UI

```jsx
function CardManagement() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    loadCards();
  }, [filter, search]);
  
  async function loadCards() {
    const result = await window.electron.getCards({ filter, search });
    setCards(result);
  }
  
  async function handleBlock(cardId) {
    const reason = prompt('Lý do khóa thẻ:');
    if (!reason) return;
    
    await window.electron.blockCard(cardId, reason);
    loadCards();
  }
  
  async function handleReplace(cardId) {
    if (!confirm('Làm lại thẻ sẽ tính phí 20.000đ. Tiếp tục?')) return;
    
    await window.electron.replaceCard(cardId, true);
    loadCards();
  }
  
  return (
    <div className="card-management">
      <h2>Quản lý thẻ thư viện</h2>
      
      <div className="toolbar">
        <input
          type="text"
          placeholder="Tìm theo tên, lớp, mã thẻ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="blocked">Bị khóa</option>
          <option value="lost">Mất thẻ</option>
          <option value="expired">Hết hạn</option>
        </select>
        
        <button onClick={() => window.location.href = '/cards/issue-bulk'}>
          Cấp thẻ hàng loạt
        </button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Mã thẻ</th>
            <th>Học sinh</th>
            <th>Lớp</th>
            <th>Ngày cấp</th>
            <th>Hết hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.card_id}>
              <td>{card.card_id}</td>
              <td>{card.name}</td>
              <td>{card.class}</td>
              <td>{formatDate(card.issue_date)}</td>
              <td>{formatDate(card.expiry_date)}</td>
              <td>
                <span className={`status-${card.status}`}>
                  {getStatusText(card.status)}
                </span>
              </td>
              <td>
                {card.status === 'active' && (
                  <>
                    <button onClick={() => handleBlock(card.card_id)}>Khóa</button>
                    <button onClick={() => printLibraryCard(card)}>In lại</button>
                  </>
                )}
                {card.status === 'blocked' && (
                  <button onClick={() => window.electron.unblockCard(card.card_id)}>
                    Mở khóa
                  </button>
                )}
                {(card.status === 'lost' || card.status === 'expired') && (
                  <button onClick={() => handleReplace(card.card_id)}>Làm lại</button>
                )}
                <button onClick={() => viewHistory(card.card_id)}>Lịch sử</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Best Practices

1. **Mã hóa mã vạch** - Sử dụng format chuẩn, dễ quét
2. **Kiểm tra hợp lệ** - Luôn validate thẻ trước khi cho mượn
3. **Backup dữ liệu** - Lưu thông tin thẻ an toàn
4. **Chất lượng in** - Đảm bảo mã vạch rõ nét, dễ quét
5. **Quy trình rõ ràng** - Hướng dẫn học sinh cách sử dụng thẻ
6. **Theo dõi thẻ mất** - Ngăn chặn lạm dụng
7. **Gia hạn tự động** - Nhắc nhở trước khi hết hạn
8. **Bảo mật** - Không để lộ thông tin cá nhân

## Troubleshooting

### Thẻ không quét được
- Kiểm tra mã vạch có bị mờ/hỏng
- Làm sạch đầu đọc scanner
- In lại thẻ với chất lượng cao hơn

### Thẻ bị trùng mã
- Kiểm tra logic tạo mã thẻ
- Đảm bảo UNIQUE constraint trong database
- Xử lý race condition khi tạo hàng loạt

### Học sinh quên thẻ
- Cho phép tra cứu bằng tên/lớp
- Nhập mã thẻ thủ công
- Sử dụng ảnh/CMND để xác minh

### Thẻ hết hạn
- Tự động gia hạn nếu học sinh còn học
- Thông báo trước 1 tháng
- Cho phép gia hạn online
