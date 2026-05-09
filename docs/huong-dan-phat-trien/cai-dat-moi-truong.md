# Cài Đặt Môi Trường Phát Triển

## Yêu Cầu Hệ Thống

### Phần Mềm Bắt Buộc

- **Node.js**: Phiên bản 18.0.0 trở lên
- **npm**: Phiên bản 9.0.0 trở lên (hoặc yarn 1.22.0+)
- **Git**: Phiên bản 2.30.0 trở lên
- **Visual Studio Code**: Khuyến nghị (hoặc IDE tương tự)

### Kiểm Tra Phiên Bản

```bash
node --version  # v18.0.0 hoặc cao hơn
npm --version   # 9.0.0 hoặc cao hơn
git --version   # 2.30.0 hoặc cao hơn
```

## Bước 1: Clone Repository

```bash
# Clone repository từ GitHub
git clone https://github.com/your-org/thuvien-documents.git

# Di chuyển vào thư mục project
cd thuvien-documents
```

## Bước 2: Cài Đặt Dependencies

### Sử dụng npm

```bash
npm install
```

### Sử dụng yarn (tùy chọn)

```bash
yarn install
```

**Lưu ý**: Quá trình cài đặt có thể mất 3-5 phút tùy thuộc vào tốc độ mạng.

## Bước 3: Cấu Hình Môi Trường

### Tạo File .env

Tạo file `.env` trong thư mục gốc của project:

```bash
# Copy file .env.example
cp .env.example .env
```

### Cấu Hình Biến Môi Trường

Chỉnh sửa file `.env` với các thông tin sau:

```env
# Database
DATABASE_PATH=./data/library.db
DATABASE_BACKUP_PATH=./data/backups

# Application
APP_NAME=Thư Viện Tài Liệu
APP_VERSION=1.0.0
NODE_ENV=development

# Logging
LOG_LEVEL=debug
LOG_PATH=./logs

# Window Settings
WINDOW_WIDTH=1200
WINDOW_HEIGHT=800
WINDOW_MIN_WIDTH=800
WINDOW_MIN_HEIGHT=600

# Development
DEV_TOOLS=true
HOT_RELOAD=true
```

## Bước 4: Khởi Tạo Database

```bash
# Tạo database và chạy migrations
npm run db:migrate

# (Tùy chọn) Seed dữ liệu mẫu
npm run db:seed
```

## Bước 5: Chạy Development Server

```bash
# Chạy ứng dụng ở chế độ development
npm run dev
```

Ứng dụng sẽ tự động mở cửa sổ Electron với hot-reload được bật.

### Các Lệnh Development Khác

```bash
# Chạy renderer process riêng (React app)
npm run dev:renderer

# Chạy main process riêng (Electron)
npm run dev:main

# Chạy với debug mode
npm run dev:debug
```

## Cấu Trúc Project

```
thuvien-documents/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   ├── shared/         # Shared code (types, utils)
│   ├── database/       # Database schemas & migrations
│   └── ipc/            # IPC handlers
├── public/             # Static assets
├── dist/               # Build output
├── data/               # Database files
├── logs/               # Application logs
├── docs/               # Documentation
├── tests/              # Test files
├── .env                # Environment variables
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript config
```

## Troubleshooting

### Lỗi: "Cannot find module"

**Nguyên nhân**: Dependencies chưa được cài đặt đầy đủ.

**Giải pháp**:
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install
```

### Lỗi: "Port already in use"

**Nguyên nhân**: Port 3000 hoặc 5173 đang được sử dụng.

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Lỗi: "SQLite database locked"

**Nguyên nhân**: Database đang được sử dụng bởi process khác.

**Giải pháp**:
```bash
# Đóng tất cả instances của ứng dụng
# Xóa file lock
rm data/library.db-journal
```

### Lỗi: "Electron failed to install correctly"

**Nguyên nhân**: Electron binary không tải về đúng.

**Giải pháp**:
```bash
# Cài đặt lại Electron
npm install electron --force

# Hoặc sử dụng mirror (nếu ở Việt Nam)
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install electron
```

### Lỗi: "TypeScript compilation failed"

**Nguyên nhân**: Lỗi type checking.

**Giải pháp**:
```bash
# Kiểm tra lỗi TypeScript
npm run type-check

# Xem chi tiết lỗi
npx tsc --noEmit
```

### Lỗi: "EACCES: permission denied"

**Nguyên nhân**: Không có quyền ghi file.

**Giải pháp**:
```bash
# Linux/Mac: Cấp quyền cho thư mục
sudo chown -R $USER:$USER .

# Windows: Chạy terminal với quyền Administrator
```

## Extensions VS Code Khuyến Nghị

Cài đặt các extensions sau để tăng hiệu quả phát triển:

- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Code formatting
- **TypeScript Vue Plugin (Volar)**: TypeScript support
- **SQLite Viewer**: Xem database SQLite
- **GitLens**: Git integration
- **Error Lens**: Hiển thị lỗi inline
- **Path Intellisense**: Autocomplete đường dẫn file

## Cấu Hình VS Code

Tạo file `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.css": "css"
  }
}
```

## Bước Tiếp Theo

Sau khi cài đặt thành công:

1. Đọc [Cấu Trúc Dự Án](./cau-truc-du-an.md)
2. Tìm hiểu [Quy Tắc Code](./quy-tac-code.md)
3. Xem hướng dẫn [Testing](./testing.md)
4. Bắt đầu phát triển tính năng đầu tiên

## Hỗ Trợ

Nếu gặp vấn đề không được liệt kê ở trên:

1. Kiểm tra [Issues trên GitHub](https://github.com/your-org/thuvien-documents/issues)
2. Tạo issue mới với thông tin chi tiết
3. Liên hệ team qua Slack/Discord
