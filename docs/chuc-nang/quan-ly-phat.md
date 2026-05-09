---
title: Quản lý phí phạt
slug: /chuc-nang/quan-ly-phat
description: Tính toán, theo dõi và thanh toán phí phạt quá hạn và bồi thường.
---

# Quản lý phí phạt

## Tổng quan

Hệ thống tự động tính phí phạt khi trả sách quá hạn hoặc sách bị hỏng/mất. Hỗ trợ thanh toán và theo dõi công nợ.

## Loại phí phạt

### 1. Phí phạt quá hạn
- Tính theo số ngày quá hạn
- Mức phạt: **Mặc định 5,000đ/ngày**, có thể cấu hình theo loại sách
- Công thức: `Phí phạt = Số ngày quá hạn × Mức phạt/ngày`

### 2. Phí bồi thường
- Sách mất: **100% giá sách**
- Sách hỏng nặng: **50% giá sách** (có thể cấu hình)

## Quy trình xử lý

1. Tính phí tự động khi trả sách
2. Hiển thị cho thủ thư xác nhận
3. Lựa chọn: Thanh toán ngay hoặc ghi nợ
4. Khóa mượn sách nếu có nợ chưa thanh toán

## Database Schema

`sql
CREATE TABLE fines (
  id TEXT PRIMARY KEY,
  borrowing_item_id TEXT NOT NULL,
  reader_id TEXT NOT NULL,
  overdue_fine REAL DEFAULT 0,
  compensation_fee REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  status TEXT CHECK(status IN ('unpaid', 'partial', 'paid')),
  payment_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fine_rules (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  fine_per_day REAL NOT NULL DEFAULT 5000,
  compensation_rate REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

## Tài liệu liên quan

- [Mượn/Trả sách](./muon-tra-sach.md)
- [Quy định nghiệp vụ](../tong-quan/quy-dinh-nghiep-vu.md)
