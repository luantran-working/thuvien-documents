---
title: Sao lưu và phục hồi
slug: /chuc-nang/sao-luu
description: Backup tự động và thủ công, restore dữ liệu.
---

# Sao lưu và phục hồi

## Tổng quan

Hệ thống hỗ trợ backup tự động hàng ngày và backup thủ công khi cần. Dữ liệu được lưu dưới dạng file SQLite.

## Chức năng

### 1. Backup tự động
- Chạy mỗi ngày vào 2:00 AM
- Lưu tại: `C:\LibraryBackups\auto\`
- Giữ lại 30 bản backup gần nhất

### 2. Backup thủ công
- Thủ thư/Admin có thể backup bất kỳ lúc nào
- Lưu tại: `C:\LibraryBackups\manual\`
- Đặt tên file: `library_backup_YYYYMMDD_HHmmss.db`

### 3. Restore
- Chọn file backup
- Xác nhận restore (cảnh báo mất dữ liệu hiện tại)
- Khôi phục database

## Quy trình backup

`mermaid
flowchart LR
    A[Trigger] --> B[Copy SQLite file]
    B --> C[Compress]
    C --> D[Save to backup folder]
    D --> E[Clean old backups]
`

## Cảnh báo

- Cảnh báo nếu > 7 ngày không backup
- Thông báo khi backup thất bại

## Tài liệu liên quan

- [Database Design](../kien-truc/database-design.md)
- [Triển khai](../trien-khai/cai-dat-lan-dau.md)
