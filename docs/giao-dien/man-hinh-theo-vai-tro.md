---
title: Màn hình theo vai trò
slug: /giao-dien/man-hinh-theo-vai-tro
description: Giao diện và chức năng theo từng vai trò người dùng.
---

# Màn hình theo vai trò

## Admin

### Dashboard Admin
- Quản lý hệ thống
- Cấu hình tham số
- Quản lý người dùng
- Xem báo cáo tổng hợp

### Menu chính
- Quản lý người dùng
- Cấu hình hệ thống
- Quy định mượn/phạt
- Sao lưu/Phục hồi
- Nhật ký hệ thống

## Thủ thư

### Dashboard Thủ thư
- Mượn/Trả sách nhanh
- Danh sách sách quá hạn
- Đặt trước cần xử lý
- Thống kê hôm nay

### Menu chính
- Mượn sách
- Trả sách
- Quản lý sách
- Quản lý độc giả
- Báo cáo
- Đặt trước

## Giáo viên

### Dashboard Giáo viên
- Sách đang mượn
- Tìm kiếm sách
- Đặt trước của tôi

### Menu chính
- Tìm kiếm sách
- Sách của tôi
- Lịch sử mượn
- Đặt trước

## Học sinh

### Dashboard Học sinh
- Sách đang mượn
- Sách đề xuất
- Sách phổ biến

### Menu chính
- Tìm kiếm sách
- Sách của tôi
- Đặt trước
- Đánh giá sách

## Navigation Flow

`mermaid
graph TD
    A[Đăng nhập] --> B{Vai trò}
    B -->|Admin| C[Dashboard Admin]
    B -->|Thủ thư| D[Dashboard Thủ thư]
    B -->|Giáo viên| E[Dashboard Giáo viên]
    B -->|Học sinh| F[Dashboard Học sinh]
`

## Tài liệu liên quan

- [Vai trò người dùng](../tong-quan/nguoi-dung-va-vai-tro.md)
- [Thiết kế UI/UX](./thiet-ke-ui-ux.md)
