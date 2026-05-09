---
title: Nâng cấp hệ thống
slug: /trien-khai/nang-cap
description: Hướng dẫn nâng cấp phiên bản mới.
---

# Nâng cấp hệ thống

## Quy trình nâng cấp

### 1. Kiểm tra phiên bản mới
- Tự động kiểm tra khi khởi động
- Hoặc vào Help > Check for Updates

### 2. Backup dữ liệu
**QUAN TRỌNG**: Luôn backup trước khi nâng cấp

`bash
# Backup tự động được tạo tại
C:\LibraryBackups\before_upgrade\
`

### 3. Download bản cập nhật
- Download từ website chính thức
- Hoặc tự động download trong app

### 4. Cài đặt
1. Đóng ứng dụng đang chạy
2. Chạy installer mới
3. Chọn "Upgrade" (giữ nguyên dữ liệu)
4. Đợi quá trình cài đặt

### 5. Database Migration
- Tự động chạy khi khởi động lần đầu
- Không tắt ứng dụng trong quá trình migration

### 6. Kiểm tra sau nâng cấp
- Đăng nhập thành công
- Dữ liệu còn nguyên
- Các chức năng hoạt động bình thường

## Rollback

Nếu có lỗi sau nâng cấp:

1. Gỡ phiên bản mới
2. Cài lại phiên bản cũ
3. Restore từ backup

## Auto-update

Cấu hình tự động cập nhật:

`typescript
interface AutoUpdateSettings {
  enabled: boolean;
  checkFrequency: 'daily' | 'weekly' | 'monthly';
  autoDownload: boolean;
  autoInstall: boolean;
}
`

## Migration Scripts

`sql
-- Example migration v1.0.0 to v1.1.0
ALTER TABLE books ADD COLUMN isbn13 TEXT;
CREATE INDEX idx_books_isbn13 ON books(isbn13);
`

## Changelog

Xem chi tiết thay đổi tại: `CHANGELOG.md`

## Tài liệu liên quan

- [Cài đặt lần đầu](./cai-dat-lan-dau.md)
- [Sao lưu](../chuc-nang/sao-luu.md)
