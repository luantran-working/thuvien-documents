# API Reference - H? Th?ng Qu?n Lý Thu Vi?n

## T?ng Quan

Tài li?u này mô t? các API du?c s? d?ng trong h? th?ng qu?n lý thu vi?n, bao g?m:
- **IPC API**: Giao ti?p gi?a Main Process và Renderer Process (Electron)
- **Database API**: Truy v?n co s? d? li?u SQLite
- **REST API**: Các endpoint cho tích h?p bên ngoài (tùy ch?n)

## Ki?n Trúc API

```
+-----------------+
¦  Renderer       ¦
¦  (React UI)     ¦
+-----------------+
         ¦ IPC
         ?
+-----------------+
¦  Main Process   ¦
¦  (Electron)     ¦
+-----------------+
         ¦ SQL
         ?
+-----------------+
¦  SQLite DB      ¦
+-----------------+
```

## IPC API

### C?u Trúc Request/Response

**Request Format:**
```typescript
interface IPCRequest {
  channel: string;
  data?: any;
}
```

**Response Format:**
```typescript
interface IPCResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Books API

#### 1. L?y Danh Sách Sách

**Channel:** `books:getAll`

**Request:**
```typescript
interface GetBooksRequest {
  page?: number;        // Trang hi?n t?i (m?c d?nh: 1)
  limit?: number;       // S? sách m?i trang (m?c d?nh: 50)
  search?: string;      // Tìm ki?m theo tên, tác gi?, ISBN
  category?: string;    // L?c theo danh m?c
  status?: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  sortBy?: 'title' | 'author' | 'publishYear' | 'addedDate';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```typescript
interface GetBooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: string;
  deweyDecimal: string;
  quantity: number;
  available: number;
  location: string;
  coverImage?: string;
  description?: string;
  language: string;
  pages?: number;
  price?: number;
  addedDate: string;
  updatedDate: string;
}
```

**Example:**
```typescript
// Renderer
const result = await window.electron.ipcRenderer.invoke('books:getAll', {
  page: 1,
  limit: 20,
  search: 'toán h?c',
  category: 'Khoa h?c',
  status: 'available'
});

if (result.success) {
  console.log(result.data.books);
}
```

#### 2. L?y Thông Tin Sách

**Channel:** `books:getById`

**Request:**
```typescript
interface GetBookRequest {
  id: number;
}
```

**Response:**
```typescript
interface GetBookResponse {
  book: Book;
  borrowHistory: BorrowRecord[];
  reservations: Reservation[];
}
```

**Example:**
```typescript
const result = await window.electron.ipcRenderer.invoke('books:getById', {
  id: 123
});
```

#### 3. Thêm Sách M?i

**Channel:** `books:create`

**Request:**
```typescript
interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: string;
  deweyDecimal?: string;
  quantity: number;
  location: string;
  coverImage?: string;
  description?: string;
  language: string;
  pages?: number;
  price?: number;
}
```

**Response:**
```typescript
interface CreateBookResponse {
  book: Book;
}
```

**Example:**
```typescript
const result = await window.electron.ipcRenderer.invoke('books:create', {
  isbn: '978-604-0-00000-0',
  title: 'Toán H?c Vui',
  author: 'Nguy?n Van A',
  publisher: 'NXB Giáo D?c',
  publishYear: 2024,
  category: 'Khoa h?c',
  deweyDecimal: '510.76',
  quantity: 10,
  location: 'A-01-05',
  language: 'vi'
});
```

#### 4. C?p Nh?t Sách

**Channel:** `books:update`

**Request:**
```typescript
interface UpdateBookRequest {
  id: number;
  data: Partial<CreateBookRequest>;
}
```

**Response:**
```typescript
interface UpdateBookResponse {
  book: Book;
}
```

#### 5. Xóa Sách

**Channel:** `books:delete`

**Request:**
```typescript
interface DeleteBookRequest {
  id: number;
  force?: boolean;  // Xóa ngay c? khi có l?ch s? mu?n
}
```

**Response:**
```typescript
interface DeleteBookResponse {
  success: boolean;
}
```

#### 6. Tìm Ki?m Sách Theo Barcode

**Channel:** `books:findByBarcode`

**Request:**
```typescript
interface FindByBarcodeRequest {
  barcode: string;
}
```

**Response:**
```typescript
interface FindByBarcodeResponse {
  book: Book;
}
```

### Users API

#### 1. L?y Danh Sách Ngu?i Dùng

**Channel:** `users:getAll`

**Request:**
```typescript
interface GetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'librarian' | 'student' | 'teacher';
  status?: 'active' | 'inactive' | 'suspended';
}
```

**Response:**
```typescript
interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'librarian' | 'student' | 'teacher';
  studentId?: string;
  class?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  maxBorrowBooks: number;
  maxBorrowDays: number;
  createdDate: string;
  lastLogin?: string;
}
```

#### 2. Ðang Nh?p

**Channel:** `auth:login`

**Request:**
```typescript
interface LoginRequest {
  username: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}
```

**Example:**
```typescript
const result = await window.electron.ipcRenderer.invoke('auth:login', {
  username: 'admin',
  password: 'password123'
});

if (result.success) {
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('user', JSON.stringify(result.data.user));
}
```

#### 3. Ðang Xu?t

**Channel:** `auth:logout`

**Request:**
```typescript
interface LogoutRequest {
  userId: number;
}
```

#### 4. Thêm Ngu?i Dùng

**Channel:** `users:create`

**Request:**
```typescript
interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: 'admin' | 'librarian' | 'student' | 'teacher';
  studentId?: string;
  class?: string;
  phone?: string;
  address?: string;
}
```

#### 5. C?p Nh?t Ngu?i Dùng

**Channel:** `users:update`

**Request:**
```typescript
interface UpdateUserRequest {
  id: number;
  data: Partial<CreateUserRequest>;
}
```

#### 6. Ð?i M?t Kh?u

**Channel:** `users:changePassword`

**Request:**
```typescript
interface ChangePasswordRequest {
  userId: number;
  oldPassword: string;
  newPassword: string;
}
```

### Borrowings API

#### 1. Mu?n Sách

**Channel:** `borrowings:create`

**Request:**
```typescript
interface CreateBorrowingRequest {
  userId: number;
  bookId: number;
  dueDate?: string;  // ISO date string, m?c d?nh: +14 ngày
  notes?: string;
}
```

**Response:**
```typescript
interface CreateBorrowingResponse {
  borrowing: Borrowing;
  receipt: string;  // HTML receipt for printing
}

interface Borrowing {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue' | 'lost';
  renewCount: number;
  fine?: number;
  notes?: string;
  librarianId: number;
}
```

**Example:**
```typescript
const result = await window.electron.ipcRenderer.invoke('borrowings:create', {
  userId: 456,
  bookId: 123,
  dueDate: '2024-06-01'
});

if (result.success) {
  // In phi?u mu?n
  window.electron.ipcRenderer.send('print:receipt', {
    html: result.data.receipt
  });
}
```

#### 2. Tr? Sách

**Channel:** `borrowings:return`

**Request:**
```typescript
interface ReturnBorrowingRequest {
  borrowingId: number;
  condition?: 'good' | 'damaged' | 'lost';
  notes?: string;
}
```

**Response:**
```typescript
interface ReturnBorrowingResponse {
  borrowing: Borrowing;
  fine?: number;
  receipt: string;
}
```

#### 3. Gia H?n Sách

**Channel:** `borrowings:renew`

**Request:**
```typescript
interface RenewBorrowingRequest {
  borrowingId: number;
  additionalDays?: number;  // M?c d?nh: 14 ngày
}
```

**Response:**
```typescript
interface RenewBorrowingResponse {
  borrowing: Borrowing;
  newDueDate: string;
}
```

#### 4. L?y Danh Sách Mu?n

**Channel:** `borrowings:getAll`

**Request:**
```typescript
interface GetBorrowingsRequest {
  page?: number;
  limit?: number;
  userId?: number;
  bookId?: number;
  status?: 'borrowed' | 'returned' | 'overdue' | 'lost';
  fromDate?: string;
  toDate?: string;
}
```

**Response:**
```typescript
interface GetBorrowingsResponse {
  borrowings: BorrowingDetail[];
  total: number;
  page: number;
  totalPages: number;
}

interface BorrowingDetail extends Borrowing {
  user: User;
  book: Book;
  librarian: User;
}
```

#### 5. L?y Sách Quá H?n

**Channel:** `borrowings:getOverdue`

**Request:**
```typescript
interface GetOverdueRequest {
  page?: number;
  limit?: number;
}
```

**Response:**
```typescript
interface GetOverdueResponse {
  borrowings: BorrowingDetail[];
  total: number;
}
```

### Reports API

#### 1. Báo Cáo T?ng Quan

**Channel:** `reports:overview`

**Request:**
```typescript
interface OverviewReportRequest {
  fromDate?: string;
  toDate?: string;
}
```

**Response:**
```typescript
interface OverviewReportResponse {
  totalBooks: number;
  totalUsers: number;
  totalBorrowings: number;
  activeBorrowings: number;
  overdueBorrowings: number;
  totalFines: number;
  popularBooks: Array<{
    book: Book;
    borrowCount: number;
  }>;
  activeUsers: Array<{
    user: User;
    borrowCount: number;
  }>;
}
```

#### 2. Báo Cáo Mu?n Tr?

**Channel:** `reports:borrowings`

**Request:**
```typescript
interface BorrowingsReportRequest {
  fromDate: string;
  toDate: string;
  groupBy?: 'day' | 'week' | 'month';
  format?: 'json' | 'csv' | 'pdf';
}
```

**Response:**
```typescript
interface BorrowingsReportResponse {
  data: Array<{
    date: string;
    borrowed: number;
    returned: number;
    overdue: number;
  }>;
  summary: {
    totalBorrowed: number;
    totalReturned: number;
    totalOverdue: number;
  };
  file?: string;  // File path n?u format là csv ho?c pdf
}
```

#### 3. Báo Cáo Sách Ph? Bi?n

**Channel:** `reports:popularBooks`

**Request:**
```typescript
interface PopularBooksReportRequest {
  fromDate?: string;
  toDate?: string;
  limit?: number;
  category?: string;
}
```

**Response:**
```typescript
interface PopularBooksReportResponse {
  books: Array<{
    book: Book;
    borrowCount: number;
    uniqueUsers: number;
    averageRating?: number;
  }>;
}
```

#### 4. Báo Cáo Ngu?i Dùng Ho?t Ð?ng

**Channel:** `reports:activeUsers`

**Request:**
```typescript
interface ActiveUsersReportRequest {
  fromDate?: string;
  toDate?: string;
  limit?: number;
  role?: string;
}
```

**Response:**
```typescript
interface ActiveUsersReportResponse {
  users: Array<{
    user: User;
    borrowCount: number;
    overdueCount: number;
    totalFines: number;
  }>;
}
```

### Settings API

#### 1. L?y C?u Hình

**Channel:** `settings:get`

**Request:**
```typescript
interface GetSettingsRequest {
  key?: string;  // L?y m?t setting c? th?, b? tr?ng d? l?y t?t c?
}
```

**Response:**
```typescript
interface GetSettingsResponse {
  settings: Record<string, any>;
}
```

#### 2. C?p Nh?t C?u Hình

**Channel:** `settings:update`

**Request:**
```typescript
interface UpdateSettingsRequest {
  settings: {
    libraryName?: string;
    maxBorrowBooks?: number;
    maxBorrowDays?: number;
    maxRenewTimes?: number;
    finePerDay?: number;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    autoBackup?: boolean;
    backupInterval?: number;
    theme?: 'light' | 'dark' | 'auto';
    language?: 'vi' | 'en';
  };
}
```

#### 3. Backup Database

**Channel:** `database:backup`

**Request:**
```typescript
interface BackupRequest {
  path?: string;  // Ðu?ng d?n luu file backup
}
```

**Response:**
```typescript
interface BackupResponse {
  path: string;
  size: number;
  timestamp: string;
}
```

#### 4. Restore Database

**Channel:** `database:restore`

**Request:**
```typescript
interface RestoreRequest {
  path: string;  // Ðu?ng d?n file backup
}
```

**Response:**
```typescript
interface RestoreResponse {
  success: boolean;
  recordsRestored: number;
}
```

## Database API

### Schema

#### Books Table
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  publish_year INTEGER,
  category TEXT,
  dewey_decimal TEXT,
  quantity INTEGER DEFAULT 1,
  available INTEGER DEFAULT 1,
  location TEXT,
  cover_image TEXT,
  description TEXT,
  language TEXT DEFAULT 'vi',
  pages INTEGER,
  price REAL,
  added_date TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_date TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'librarian', 'student', 'teacher')),
  student_id TEXT,
  class TEXT,
  phone TEXT,
  address TEXT,
  avatar TEXT,
  status TEXT DEFAULT 'active',
  max_borrow_books INTEGER DEFAULT 5,
  max_borrow_days INTEGER DEFAULT 14,
  created_date TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT
);
```

#### Borrowings Table
```sql
CREATE TABLE borrowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  borrow_date TEXT DEFAULT CURRENT_TIMESTAMP,
  due_date TEXT NOT NULL,
  return_date TEXT,
  status TEXT DEFAULT 'borrowed',
  renew_count INTEGER DEFAULT 0,
  fine REAL DEFAULT 0,
  notes TEXT,
  librarian_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (librarian_id) REFERENCES users(id)
);
```

### Common Queries

#### Tìm Sách Có S?n
```sql
SELECT * FROM books 
WHERE available > 0 
  AND title LIKE '%keyword%'
ORDER BY title;
```

#### L?y Sách Quá H?n
```sql
SELECT b.*, u.full_name, bk.title
FROM borrowings b
JOIN users u ON b.user_id = u.id
JOIN books bk ON b.book_id = bk.id
WHERE b.status = 'borrowed'
  AND b.due_date < date('now')
ORDER BY b.due_date;
```

#### Th?ng Kê Sách Theo Danh M?c
```sql
SELECT category, COUNT(*) as count, SUM(quantity) as total_books
FROM books
GROUP BY category
ORDER BY count DESC;
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_001` | Invalid credentials | Sai tên dang nh?p ho?c m?t kh?u |
| `AUTH_002` | Token expired | Token h?t h?n |
| `AUTH_003` | Insufficient permissions | Không d? quy?n truy c?p |
| `BOOK_001` | Book not found | Không tìm th?y sách |
| `BOOK_002` | ISBN already exists | ISBN dã t?n t?i |
| `BOOK_003` | No copies available | Không còn b?n sao |
| `USER_001` | User not found | Không tìm th?y ngu?i dùng |
| `USER_002` | Username already exists | Tên dang nh?p dã t?n t?i |
| `USER_003` | Email already exists | Email dã t?n t?i |
| `BORROW_001` | Borrowing limit exceeded | Vu?t quá s? sách du?c mu?n |
| `BORROW_002` | Book already borrowed | Sách dã du?c mu?n |
| `BORROW_003` | Cannot renew | Không th? gia h?n |
| `BORROW_004` | Overdue books | Có sách quá h?n |
| `DB_001` | Database error | L?i co s? d? li?u |
| `DB_002` | Connection failed | K?t n?i th?t b?i |
| `VALIDATION_001` | Invalid input | D? li?u d?u vào không h?p l? |

## Code Examples

### TypeScript - Renderer Process

```typescript
// services/api.ts
class LibraryAPI {
  async getBooks(params: GetBooksRequest): Promise<GetBooksResponse> {
    const result = await window.electron.ipcRenderer.invoke('books:getAll', params);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async borrowBook(userId: number, bookId: number): Promise<Borrowing> {
    const result = await window.electron.ipcRenderer.invoke('borrowings:create', {
      userId,
      bookId
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data.borrowing;
  }

  async searchBooks(query: string): Promise<Book[]> {
    const result = await this.getBooks({
      search: query,
      limit: 20
    });
    return result.books;
  }
}

export const api = new LibraryAPI();
```

### TypeScript - Main Process

```typescript
// main/ipc-handlers.ts
import { ipcMain } from 'electron';
import { Database } from './database';

export function registerIPCHandlers(db: Database) {
  // Books handlers
  ipcMain.handle('books:getAll', async (event, params: GetBooksRequest) => {
    try {
      const books = await db.getBooks(params);
      return { success: true, data: books };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DB_001',
          message: error.message
        }
      };
    }
  });

  ipcMain.handle('books:create', async (event, data: CreateBookRequest) => {
    try {
      const book = await db.createBook(data);
      return { success: true, data: { book } };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOK_002',
          message: error.message
        }
      };
    }
  });

  // Borrowings handlers
  ipcMain.handle('borrowings:create', async (event, data: CreateBorrowingRequest) => {
    try {
      // Check if user has overdue books
      const overdueBooks = await db.getOverdueBorrowings(data.userId);
      if (overdueBooks.length > 0) {
        throw new Error('User has overdue books');
      }

      // Check if book is available
      const book = await db.getBookById(data.bookId);
      if (book.available === 0) {
        throw new Error('No copies available');
      }

      // Create borrowing
      const borrowing = await db.createBorrowing(data);
      
      // Generate receipt
      const receipt = generateReceipt(borrowing);

      return {
        success: true,
        data: { borrowing, receipt }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BORROW_001',
          message: error.message
        }
      };
    }
  });
}
```

### React Component Example

```typescript
// components/BookList.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const result = await api.getBooks({ page: 1, limit: 50 });
      setBooks(result.books);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      const userId = getCurrentUserId();
      await api.borrowBook(userId, bookId);
      alert('Mu?n sách thành công!');
      loadBooks(); // Reload to update availability
    } catch (err) {
      alert(`L?i: ${err.message}`);
    }
  };

  if (loading) return <div>Ðang t?i...</div>;
  if (error) return <div>L?i: {error}</div>;

  return (
    <div className="book-list">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <h3>{book.title}</h3>
          <p>Tác gi?: {book.author}</p>
          <p>Còn l?i: {book.available}/{book.quantity}</p>
          <button 
            onClick={() => handleBorrow(book.id)}
            disabled={book.available === 0}
          >
            Mu?n sách
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Testing

### Unit Test Example

```typescript
// __tests__/api.test.ts
import { api } from '../services/api';

describe('Library API', () => {
  test('should get books', async () => {
    const result = await api.getBooks({ page: 1, limit: 10 });
    expect(result.books).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  test('should search books by title', async () => {
    const books = await api.searchBooks('toán h?c');
    expect(books.every(b => b.title.toLowerCase().includes('toán h?c'))).toBe(true);
  });

  test('should handle borrow book error', async () => {
    await expect(api.borrowBook(999, 999)).rejects.toThrow();
  });
});
```

## Rate Limiting

Ð? tránh quá t?i, các API có gi?i h?n:
- **Books API**: 100 requests/phút
- **Borrowings API**: 50 requests/phút
- **Reports API**: 20 requests/phút

## Versioning

API version hi?n t?i: **v1.0.0**

Khi có thay d?i breaking changes, version s? du?c tang lên.

---

**Luu ý:** Tài li?u này du?c c?p nh?t thu?ng xuyên. Ki?m tra phiên b?n m?i nh?t t?i repository.
