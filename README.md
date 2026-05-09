# Hệ thống Quản lý Thư viện Trường học

Website này được xây dựng bằng Docusaurus và đóng vai trò là cổng tài liệu kỹ thuật chính thức cho `Hệ thống Quản lý Thư viện Trường học`.

## Nội dung chính

- Tổng quan hệ thống, vai trò người dùng và quy định nghiệp vụ
- Kiến trúc kỹ thuật cho Desktop Application dùng `ElectronJS`, `React`, `TypeScript`, `Better-SQLite3`
- Thiết kế cơ sở dữ liệu và API nội bộ
- Chức năng quản lý sách, mượn/trả, đặt trước, phạt, báo cáo
- Tích hợp thiết bị: Máy quét mã vạch, máy in
- Hướng dẫn phát triển và triển khai

## Đặc điểm hệ thống

- **Desktop Application**: Chạy hoàn toàn offline, không cần internet
- **Dành cho 1 trường**: Quản lý tập trung cho một trường học
- **Quy mô**: Hỗ trợ < 500 học sinh, 1,000-5,000 cuốn sách
- **Đa vai trò**: Admin, Thủ thư, Giáo viên, Học sinh
- **Đa ngôn ngữ**: Tiếng Việt + Tiếng Anh

## Cài đặt

```bash
npm install
```

## Chạy local

```bash
npm run start
```

## Kiểm tra kiểu dữ liệu

```bash
npm run typecheck
```

## Kiểm tra contract rewrite

```bash
npm test
```

## Build production

```bash
npm run build
```
