---
title: Thông báo
slug: /chuc-nang/thong-bao
description: Hệ thống thông báo tự động qua app và email.
---

# Thông báo

## Các loại thông báo

### 1. Sách sắp đến hạn
- Gửi trước 3 ngày
- Nhắc nhở trả sách đúng hạn

### 2. Sách quá hạn
- Gửi ngay khi quá hạn
- Thông báo phí phạt

### 3. Sách đặt trước có sẵn
- Thông báo khi sách được trả
- Nhắc đến lấy trong 3 ngày

### 4. Thông báo từ thủ thư
- Thông báo chung cho tất cả
- Thông báo riêng cho từng người

## Kênh thông báo

- **Trong app**: Hiển thị trong ứng dụng
- **Email**: Gửi qua email (nếu có cấu hình)

## Cấu hình

`typescript
interface NotificationSettings {
  enableInApp: boolean;
  enableEmail: boolean;
  dueDateReminderDays: number; // Mặc định: 3 ngày
  overdueReminderFrequency: 'daily' | 'weekly';
}
`

## Tài liệu liên quan

- [Đặt trước sách](./dat-truoc.md)
- [Mượn/Trả sách](./muon-tra-sach.md)
