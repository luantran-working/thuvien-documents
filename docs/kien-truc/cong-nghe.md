---
title: Công nghệ sử dụng
slug: /kien-truc/cong-nghe
description: Stack công nghệ chi tiết cho hệ thống quản lý thư viện Electron.
---

# Công nghệ sử dụng

## Stack tổng quan

| Lớp | Công nghệ | Phiên bản đề xuất |
|:----|:----------|:------------------|
| Desktop Framework | Electron | 28.x hoặc mới hơn |
| Frontend Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | 3.x |
| Routing | React Router | 6.x |
| State Management | Redux Toolkit hoặc Zustand | Latest |
| Database | Better-SQLite3 | 9.x |
| Build Tool | Vite | 5.x |
| Packaging | Electron Builder | 24.x |

## Frontend Stack

### React 18

**Lý do chọn:**
- Component-based architecture dễ bảo trì
- Hooks API mạnh mẽ cho state và side effects
- Virtual DOM hiệu năng cao
- Ecosystem phong phú

**Sử dụng:**
```typescript
// Functional components với TypeScript
interface BookListProps {
  books: Book[];
  onSelect: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {books.map(book => (
        <BookCard key={book.id} book={book} onClick={() => onSelect(book)} />
      ))}
    </div>
  );
};
```

### TypeScript

**Lý do chọn:**
- Type safety giảm bugs
- IntelliSense tốt hơn
- Refactoring an toàn
- Self-documenting code

**Cấu hình:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### TailwindCSS

**Lý do chọn:**
- Utility-first CSS nhanh chóng
- Responsive design dễ dàng
- Customizable theme
- Không cần viết CSS riêng

**Ví dụ:**
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:bg-gray-400 transition-colors">
  Mượn sách
</button>
```

### React Router 6

**Lý do chọn:**
- Routing declarative
- Nested routes
- Data loading integration
- Type-safe với TypeScript

**Cấu trúc routes:**
```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'books', element: <BookManagement /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'readers', element: <ReaderManagement /> },
      { path: 'borrowings', element: <BorrowingManagement /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
```

## State Management

### Lựa chọn: Redux Toolkit hoặc Zustand

#### Redux Toolkit (cho ứng dụng phức tạp)

**Ưu điểm:**
- DevTools mạnh mẽ
- Middleware ecosystem
- Time-travel debugging
- Chuẩn hóa state structure

**Ví dụ:**
```typescript
// store/slices/borrowingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBorrowings = createAsyncThunk(
  'borrowings/fetch',
  async () => {
    return await window.electronAPI.getBorrowings();
  }
);

const borrowingSlice = createSlice({
  name: 'borrowings',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBorrowings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBorrowings.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});
```

#### Zustand (cho ứng dụng đơn giản hơn)

**Ưu điểm:**
- API đơn giản, ít boilerplate
- Không cần Provider wrapper
- TypeScript support tốt
- Bundle size nhỏ

**Ví dụ:**
```typescript
// store/useBorrowingStore.ts
import create from 'zustand';

interface BorrowingStore {
  borrowings: Borrowing[];
  loading: boolean;
  fetchBorrowings: () => Promise<void>;
  addBorrowing: (borrowing: Borrowing) => void;
}

export const useBorrowingStore = create<BorrowingStore>((set) => ({
  borrowings: [],
  loading: false,
  fetchBorrowings: async () => {
    set({ loading: true });
    const data = await window.electronAPI.getBorrowings();
    set({ borrowings: data, loading: false });
  },
  addBorrowing: (borrowing) => 
    set((state) => ({ borrowings: [...state.borrowings, borrowing] })),
}));
```

## Backend Stack (Main Process)

### Better-SQLite3

**Lý do chọn:**
- Synchronous API phù hợp với Electron
- Hiệu năng cao hơn node-sqlite3
- Không cần callback hell
- Transaction support tốt

**Ví dụ:**
```typescript
// database/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'library.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Prepared statements
export const statements = {
  getBorrowings: db.prepare(`
    SELECT b.*, bc.barcode, bk.title, r.full_name as reader_name
    FROM borrowings b
    JOIN book_copies bc ON b.book_copy_id = bc.id
    JOIN books bk ON bc.book_id = bk.id
    JOIN readers r ON b.reader_id = r.id
    WHERE b.status = ?
  `),
  
  createBorrowing: db.prepare(`
    INSERT INTO borrowings (reader_id, book_copy_id, borrow_date, due_date, status)
    VALUES (?, ?, ?, ?, 'active')
  `),
};
```

### Node.js Built-in Modules

| Module | Mục đích |
|:-------|:---------|
| `fs/promises` | File system operations (backup, export) |
| `path` | Path manipulation cross-platform |
| `crypto` | Hash passwords, generate tokens |
| `os` | System information |

## Tính năng bổ sung

### Barcode Scanning

**Lựa chọn 1: QuaggaJS** (Web-based)
```typescript
import Quagga from 'quagga';

Quagga.init({
  inputStream: {
    type: 'LiveStream',
    target: document.querySelector('#scanner'),
  },
  decoder: {
    readers: ['code_128_reader', 'ean_reader'],
  },
}, (err) => {
  if (!err) Quagga.start();
});

Quagga.onDetected((result) => {
  const code = result.codeResult.code;
  console.log('Barcode detected:', code);
});
```

**Lựa chọn 2: ZXing** (Native)
- Tích hợp qua native module
- Hiệu năng tốt hơn
- Hỗ trợ nhiều định dạng barcode

### Printing

**Electron Print API:**
```typescript
import { BrowserWindow } from 'electron';

async function printBorrowingReceipt(borrowingId: number) {
  const printWindow = new BrowserWindow({ show: false });
  
  // Load HTML template
  await printWindow.loadFile('templates/borrowing-receipt.html');
  
  // Inject data
  await printWindow.webContents.executeJavaScript(`
    window.borrowingData = ${JSON.stringify(getBorrowingData(borrowingId))};
    renderReceipt();
  `);
  
  // Print
  printWindow.webContents.print({
    silent: false,
    printBackground: true,
  });
}
```

### Email Notifications (Optional)

**Nodemailer:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOverdueNotification(reader: Reader, borrowing: Borrowing) {
  await transporter.sendMail({
    from: '"Thư viện" <library@example.com>',
    to: reader.email,
    subject: 'Nhắc nhở trả sách',
    html: `
      <p>Xin chào ${reader.full_name},</p>
      <p>Sách "${borrowing.book_title}" đã quá hạn trả.</p>
      <p>Vui lòng trả sách sớm để tránh phí phạt.</p>
    `,
  });
}
```

## Build và Packaging

### Vite

**Cấu hình cho Electron:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-renderer',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Electron Builder

**Cấu hình packaging:**
```json
{
  "build": {
    "appId": "com.library.management",
    "productName": "Quản lý thư viện",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist-main/**/*",
      "dist-renderer/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "assets/icon.png"
    }
  }
}
```

## Development Tools

| Tool | Mục đích |
|:-----|:---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Electron DevTools | Debugging |
| React DevTools | React debugging |
| Redux DevTools | State debugging (nếu dùng Redux) |

## Tài liệu liên quan

- [Tổng quan kiến trúc](./tong-quan-kien-truc.md)
- [Thiết kế database](./database-design.md)
- [Hướng dẫn phát triển](../huong-dan-phat-trien/cai-dat-moi-truong.md)
