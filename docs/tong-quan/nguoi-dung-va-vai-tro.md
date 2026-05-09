---
title: Người dùng và Vai trò
description: Phân loại người dùng và phân quyền trong hệ thống quản lý thư viện
author: Team Development
date: 2026-05-07
version: 1.0
tags: [users, roles, permissions]
---

# Người dùng và Vai trò

## Tổng quan

Hệ thống quản lý thư viện phục vụ 4 nhóm người dùng chính với các quyền hạn và chức năng khác nhau:

1. **Admin** - Quản trị viên hệ thống
2. **Thủ thư** - Nhân viên thư viện
3. **Giáo viên** - Giảng viên/Giáo viên
4. **Học sinh** - Học sinh/Sinh viên

## Chi tiết vai trò

### 1. Admin (Quản trị viên)

#### Mô tả

Người quản lý toàn bộ hệ thống, có quyền cao nhất, chịu trách nhiệm cấu hình và giám sát hoạt động.

#### Trách nhiệm

- Quản lý cấu hình hệ thống
- Quản lý tài khoản người dùng
- Giám sát hoạt động hệ thống
- Xử lý sự cố kỹ thuật
- Phân quyền và bảo mật

#### Chức năng chính

##### Quản lý Hệ thống

- Cấu hình tham số hệ thống (thời hạn mượn, phí phạt, giới hạn)
- Quản lý danh mục (thể loại sách, nhà xuất bản)
- Sao lưu và phục hồi dữ liệu
- Xem log hệ thống

##### Quản lý Người dùng

- Tạo, sửa, xóa tài khoản
- Phân quyền vai trò
- Khóa/mở khóa tài khoản
- Reset mật khẩu
- Xem lịch sử hoạt động người dùng

##### Báo cáo và Thống kê

- Truy cập tất cả báo cáo
- Xuất dữ liệu hệ thống
- Phân tích xu hướng
- Dashboard tổng quan

#### Giới hạn

- Không can thiệp trực tiếp vào nghiệp vụ thư viện (mượn/trả)
- Cần xác thực 2 lớp cho các thao tác nhạy cảm

---

### 2. Thủ thư (Librarian)

#### Mô tả

Nhân viên thư viện, xử lý các nghiệp vụ hàng ngày, tương tác trực tiếp với người mượn sách.

#### Trách nhiệm

- Quản lý kho sách
- Xử lý mượn/trả sách
- Hỗ trợ người dùng
- Bảo trì sách
- Báo cáo định kỳ

#### Chức năng chính

##### Quản lý Sách

- Thêm sách mới vào hệ thống
- Cập nhật thông tin sách
- Quản lý bản sao
- Đánh dấu sách hỏng/mất
- In mã vạch/QR code

##### Xử lý Mượn/Trả

- Cho mượn sách
- Nhận trả sách
- Gia hạn sách
- Xử lý đặt trước
- Tính phí phạt

##### Quản lý Phạt

- Xem danh sách nợ phạt
- Xử lý thanh toán
- Miễn giảm phạt (có lý do)
- In biên lai

##### Báo cáo

- Báo cáo mượn/trả hàng ngày
- Báo cáo sách quá hạn
- Báo cáo tồn kho
- Báo cáo sách hỏng/mất

#### Giới hạn

- Không thể xóa sách có lịch sử mượn
- Không thể sửa đổi cấu hình hệ thống
- Cần phê duyệt khi miễn giảm phạt > 50%

---

### 3. Giáo viên (Teacher)

#### Mô tả

Giảng viên/Giáo viên của trường, có quyền lợi đặc biệt trong việc mượn sách.

#### Trách nhiệm

- Sử dụng tài liệu phục vụ giảng dạy
- Trả sách đúng hạn
- Đánh giá chất lượng sách

#### Chức năng chính

##### Mượn Sách

- Tra cứu sách
- Mượn sách (giới hạn cao hơn học sinh)
- Gia hạn không giới hạn
- Đặt trước sách
- Xem lịch sử mượn

##### Đặc quyền

- **Thời hạn mượn dài hơn**: 60 ngày (so với 30 ngày của học sinh)
- **Giới hạn mượn cao hơn**: 10 cuốn (so với 5 cuốn của học sinh)
- **Không bị phạt quá hạn**: Chỉ nhắc nhở, không tính phí
- **Ưu tiên đặt trước**: Được ưu tiên cao hơn học sinh

##### Tương tác

- Đánh giá và nhận xét sách
- Đề xuất sách mới
- Báo cáo sách lỗi

#### Giới hạn

- Vẫn phải bồi thường nếu làm mất/hỏng sách
- Không được chuyển nhượng quyền mượn
- Tài khoản bị khóa nếu giữ sách quá 180 ngày

---

### 4. Học sinh (Student)

#### Mô tả

Học sinh/Sinh viên của trường, người dùng chính của thư viện.

#### Trách nhiệm

- Sử dụng sách đúng mục đích
- Trả sách đúng hạn
- Giữ gìn sách cẩn thận
- Thanh toán phạt khi vi phạm

#### Chức năng chính

##### Tra cứu Sách

- Tìm kiếm sách theo tên, tác giả, thể loại
- Xem thông tin chi tiết sách
- Xem đánh giá của người khác
- Lưu sách yêu thích

##### Mượn/Trả Sách

- Mượn sách (tối đa 5 cuốn)
- Trả sách
- Gia hạn (nếu không ai đặt trước)
- Xem sách đang mượn
- Xem lịch sử mượn

##### Đặt trước

- Đặt trước sách đang được mượn
- Xem hàng đợi đặt trước
- Hủy đặt trước
- Nhận thông báo khi sách có sẵn

##### Quản lý Phạt

- Xem công nợ phạt
- Thanh toán phạt
- Xem lịch sử thanh toán

##### Tương tác

- Đánh giá sách (1-5 sao)
- Viết nhận xét
- Báo cáo sách lỗi

#### Giới hạn

- Tối đa 5 cuốn cùng lúc
- Thời hạn mượn 30 ngày
- Gia hạn tối đa 2 lần
- Không được mượn thêm nếu có nợ phạt > 100,000đ
- Tài khoản bị khóa nếu quá hạn > 90 ngày

---

## Ma trận phân quyền

### Quản lý Sách

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Xem danh sách sách | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết sách | ✅ | ✅ | ✅ | ✅ |
| Thêm sách mới | ✅ | ✅ | ❌ | ❌ |
| Sửa thông tin sách | ✅ | ✅ | ❌ | ❌ |
| Xóa sách | ✅ | ⚠️ | ❌ | ❌ |
| Quản lý bản sao | ✅ | ✅ | ❌ | ❌ |
| Đánh giá sách | ❌ | ❌ | ✅ | ✅ |

> ⚠️ Thủ thư chỉ xóa được sách không có lịch sử mượn

### Quản lý Mượn/Trả

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Mượn sách | ❌ | ✅ | ✅ | ✅ |
| Trả sách | ❌ | ✅ | ✅ | ✅ |
| Gia hạn sách | ❌ | ✅ | ✅ | ✅ |
| Xem lịch sử mượn | ✅ | ✅ | ✅ (của mình) | ✅ (của mình) |
| Xử lý mượn cho người khác | ❌ | ✅ | ❌ | ❌ |
| Xử lý trả cho người khác | ❌ | ✅ | ❌ | ❌ |

### Quản lý Đặt trước

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Đặt trước sách | ❌ | ❌ | ✅ | ✅ |
| Hủy đặt trước | ✅ | ✅ | ✅ (của mình) | ✅ (của mình) |
| Xem hàng đợi | ✅ | ✅ | ✅ | ✅ |
| Xử lý đặt trước | ❌ | ✅ | ❌ | ❌ |

### Quản lý Phạt

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Xem phạt của mình | ❌ | ❌ | ✅ | ✅ |
| Xem tất cả phạt | ✅ | ✅ | ❌ | ❌ |
| Thanh toán phạt | ❌ | ✅ | ✅ | ✅ |
| Miễn giảm phạt | ✅ | ⚠️ | ❌ | ❌ |
| Xuất biên lai | ❌ | ✅ | ❌ | ❌ |

> ⚠️ Thủ thư chỉ miễn giảm được tối đa 50%, cần Admin duyệt nếu > 50%

### Quản lý Người dùng

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Xem hồ sơ của mình | ✅ | ✅ | ✅ | ✅ |
| Sửa hồ sơ của mình | ✅ | ✅ | ✅ | ✅ |
| Xem danh sách người dùng | ✅ | ✅ | ❌ | ❌ |
| Tạo tài khoản | ✅ | ⚠️ | ❌ | ❌ |
| Sửa tài khoản | ✅ | ❌ | ❌ | ❌ |
| Xóa tài khoản | ✅ | ❌ | ❌ | ❌ |
| Phân quyền | ✅ | ❌ | ❌ | ❌ |
| Khóa/Mở khóa | ✅ | ⚠️ | ❌ | ❌ |

> ⚠️ Thủ thư chỉ tạo được tài khoản học sinh, chỉ khóa được tài khoản vi phạm

### Báo cáo và Thống kê

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Báo cáo mượn/trả | ✅ | ✅ | ❌ | ❌ |
| Báo cáo quá hạn | ✅ | ✅ | ❌ | ❌ |
| Báo cáo tồn kho | ✅ | ✅ | ❌ | ❌ |
| Báo cáo phạt | ✅ | ✅ | ❌ | ❌ |
| Thống kê sách phổ biến | ✅ | ✅ | ✅ | ✅ |
| Dashboard tổng quan | ✅ | ✅ | ❌ | ❌ |
| Xuất báo cáo | ✅ | ✅ | ❌ | ❌ |

### Cấu hình Hệ thống

| Chức năng | Admin | Thủ thư | Giáo viên | Học sinh |
|-----------|-------|---------|-----------|----------|
| Cấu hình tham số | ✅ | ❌ | ❌ | ❌ |
| Quản lý danh mục | ✅ | ⚠️ | ❌ | ❌ |
| Sao lưu dữ liệu | ✅ | ❌ | ❌ | ❌ |
| Xem log hệ thống | ✅ | ❌ | ❌ | ❌ |

> ⚠️ Thủ thư chỉ thêm được danh mục mới, không sửa/xóa

## Quy trình đăng ký và phân quyền

### Học sinh

1. Thủ thư/Admin tạo tài khoản với mã học sinh
2. Học sinh đăng nhập lần đầu và đổi mật khẩu
3. Hoàn thiện hồ sơ cá nhân
4. Bắt đầu sử dụng

### Giáo viên

1. Admin tạo tài khoản với mã giáo viên
2. Giáo viên đăng nhập và đổi mật khẩu
3. Hoàn thiện hồ sơ
4. Được kích hoạt đặc quyền tự động

### Thủ thư

1. Admin tạo tài khoản và phân quyền Thủ thư
2. Thủ thư nhận email kích hoạt
3. Đăng nhập và đổi mật khẩu
4. Được đào tạo sử dụng hệ thống

### Admin

1. Admin chính tạo tài khoản Admin phụ
2. Phân quyền cụ thể (có thể giới hạn)
3. Xác thực 2 lớp bắt buộc
4. Ghi log mọi thao tác

## Chính sách bảo mật

### Mật khẩu

- Tối thiểu 8 ký tự
- Bắt buộc có chữ hoa, chữ thường, số
- Đổi mật khẩu định kỳ 6 tháng (Admin/Thủ thư)
- Không được dùng lại 5 mật khẩu gần nhất

### Phiên đăng nhập

- Timeout sau 30 phút không hoạt động
- Đăng xuất tự động khi đóng trình duyệt
- Chỉ 1 phiên đăng nhập cùng lúc (Admin/Thủ thư)

### Audit Log

- Ghi log tất cả thao tác nhạy cảm
- Lưu trữ log tối thiểu 1 năm
- Admin có thể xem log của tất cả người dùng
