---
title: Xử lý sự cố
slug: /phu-luc/troubleshooting
description: Các lỗi thường gặp và cách khắc phục.
---

# Xử lý sự cố

## Lỗi Database

### Database locked
**Triệu chứng**: Lỗi `database is locked`

**Nguyên nhân**: Có process khác đang truy cập database

**Giải pháp**:
1. Đóng tất cả cửa sổ ứng dụng
2. Khởi động lại ứng dụng
3. Nếu vẫn lỗi, restart máy tính

### Database corrupted
**Triệu chứng**: Không mở được database

**Giải pháp**:
1. Restore từ backup gần nhất
2. Liên hệ hỗ trợ kỹ thuật

## Lỗi thiết bị

### Máy quét mã vạch không hoạt động
**Kiểm tra**:
- Kết nối USB
- Driver đã cài đặt
- Thử quét trên Notepad

**Giải pháp**:
1. Rút và cắm lại USB
2. Cài đặt lại driver
3. Thử cổng USB khác

### Máy in không kết nối
**Kiểm tra**:
- Máy in đã bật
- Kết nối USB/Network
- Có giấy và mực

**Giải pháp**:
1. Kiểm tra kết nối
2. Set làm máy in mặc định
3. Cài đặt lại driver

## Lỗi Email

### Không gửi được email
**Kiểm tra**:
- Cấu hình SMTP
- Kết nối internet
- Username/Password

**Giải pháp**:
1. Kiểm tra cấu hình email
2. Test kết nối SMTP
3. Kiểm tra firewall

## Lỗi Import

### Import Excel thất bại
**Nguyên nhân**:
- File không đúng format
- Dữ liệu không hợp lệ
- Trùng mã

**Giải pháp**:
1. Tải file mẫu
2. Kiểm tra format
3. Xem log lỗi chi tiết

## Lỗi hiệu năng

### Ứng dụng chạy chậm
**Giải pháp**:
1. Đóng các ứng dụng khác
2. Tăng RAM
3. Chạy Vacuum database
4. Xóa log cũ

## Debug Mode

Bật debug mode:
1. Mở Settings
2. Chọn Advanced
3. Bật Debug Mode
4. Xem log tại: `C:\Users\{user}\AppData\Roaming\LibraryApp\logs`

## Liên hệ hỗ trợ

- Email: support@library.edu.vn
- Hotline: 1900-xxxx
- Gửi log file khi báo lỗi

## Tài liệu liên quan

- [Cài đặt](../trien-khai/cai-dat-lan-dau.md)
- [Sao lưu](../chuc-nang/sao-luu.md)
