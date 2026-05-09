# Tìm Kiếm

## Tổng Quan

Chức năng tìm kiếm giúp người dùng nhanh chóng tìm thấy sách trong hệ thống thư viện. Hệ thống hỗ trợ cả tìm kiếm cơ bản và nâng cao với nhiều tiêu chí lọc.

## Tìm Kiếm Cơ Bản

### Các Trường Tìm Kiếm

1. **Tên sách**
   - Tìm kiếm theo tiêu đề đầy đủ hoặc một phần
   - Không phân biệt hoa thường
   - Hỗ trợ tìm kiếm có dấu và không dấu

2. **Tác giả**
   - Tìm theo tên tác giả
   - Hỗ trợ tìm kiếm một phần tên
   - Tìm được cả họ hoặc tên riêng

3. **ISBN**
   - Tìm kiếm chính xác theo mã ISBN
   - Hỗ trợ cả ISBN-10 và ISBN-13
   - Tự động loại bỏ dấu gạch ngang

### Giao Diện Tìm Kiếm

```
┌─────────────────────────────────────────────┐
│  🔍 Tìm kiếm sách...                        │
│  [Tên sách / Tác giả / ISBN]               │
└─────────────────────────────────────────────┘
```

## Tìm Kiếm Nâng Cao

### Bộ Lọc

1. **Thể loại**
   - Chọn một hoặc nhiều thể loại
   - Danh sách: Văn học, Khoa học, Lịch sử, Toán học, v.v.

2. **Năm xuất bản**
   - Lọc theo khoảng năm (từ năm - đến năm)
   - Hoặc chọn năm cụ thể

3. **Tình trạng**
   - Có sẵn
   - Đang được mượn
   - Đang bảo trì
   - Đã hỏng/mất

4. **Vị trí**
   - Lọc theo kệ sách
   - Lọc theo khu vực trong thư viện
   - Ví dụ: Kệ A1, Kệ B2, Phòng đọc 1

### Giao Diện Tìm Kiếm Nâng Cao

```
┌─────────────────────────────────────────────┐
│  Tìm kiếm nâng cao                          │
├─────────────────────────────────────────────┤
│  Thể loại:     [☐ Văn học] [☐ Khoa học]   │
│                [☐ Lịch sử] [☐ Toán học]    │
│                                              │
│  Năm XB:       Từ [____] đến [____]        │
│                                              │
│  Tình trạng:   [☐ Có sẵn] [☐ Đang mượn]   │
│                [☐ Bảo trì] [☐ Hỏng/mất]    │
│                                              │
│  Vị trí:       [Chọn kệ sách ▼]            │
│                                              │
│  [Tìm kiếm]  [Đặt lại]                     │
└─────────────────────────────────────────────┘
```

## Gợi Ý Tự Động (Autocomplete)

### Cơ Chế Hoạt Động

- Hiển thị gợi ý sau khi gõ 2 ký tự trở lên
- Tối đa 10 gợi ý
- Sắp xếp theo độ phù hợp
- Hiển thị cả tên sách và tác giả trong gợi ý

### Ví Dụ

```
Người dùng gõ: "harry"

Gợi ý:
┌─────────────────────────────────────────────┐
│  📚 Harry Potter và Hòn đá Phù thủy         │
│     Tác giả: J.K. Rowling                   │
│                                              │
│  📚 Harry Potter và Phòng chứa Bí mật       │
│     Tác giả: J.K. Rowling                   │
│                                              │
│  📚 Harry Potter và Tên tù nhân ngục Azkaban│
│     Tác giả: J.K. Rowling                   │
└─────────────────────────────────────────────┘
```

## Gợi Ý Sách Dựa Trên Lịch Sử Mượn

### Thuật Toán Gợi Ý

1. **Dựa trên thể loại**
   - Phân tích thể loại sách đã mượn
   - Gợi ý sách cùng thể loại chưa mượn

2. **Dựa trên tác giả**
   - Gợi ý sách khác của tác giả đã từng mượn

3. **Dựa trên độ phổ biến**
   - Sách được mượn nhiều bởi người dùng có sở thích tương tự

### Hiển Thị Gợi Ý

```
┌─────────────────────────────────────────────┐
│  💡 Gợi ý cho bạn                           │
├─────────────────────────────────────────────┤
│  Dựa trên lịch sử mượn của bạn:            │
│                                              │
│  📚 [Ảnh bìa] Tên sách 1                    │
│     Tác giả: ...                            │
│     ⭐⭐⭐⭐⭐ (125 lượt mượn)              │
│                                              │
│  📚 [Ảnh bìa] Tên sách 2                    │
│     Tác giả: ...                            │
│     ⭐⭐⭐⭐ (98 lượt mượn)                │
└─────────────────────────────────────────────┘
```

## Hiển Thị Kết Quả Tìm Kiếm

### Thông Tin Hiển Thị

Mỗi kết quả bao gồm:

1. **Ảnh bìa sách**
   - Thumbnail 150x200px
   - Ảnh mặc định nếu không có ảnh

2. **Thông tin cơ bản**
   - Tên sách (in đậm)
   - Tác giả
   - Năm xuất bản
   - Thể loại
   - ISBN

3. **Tình trạng**
   - 🟢 **Có sẵn**: Số lượng còn lại
   - 🔴 **Đang mượn**: Ngày dự kiến trả
   - 🟡 **Đang bảo trì**: Thời gian dự kiến
   - ⚫ **Hỏng/mất**: Không khả dụng

4. **Vị trí**
   - Kệ sách cụ thể
   - Khu vực trong thư viện

### Layout Kết Quả

#### Dạng Lưới (Grid View)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  [Ảnh bìa]   │  │  [Ảnh bìa]   │  │  [Ảnh bìa]   │
│              │  │              │  │              │
│  Tên sách    │  │  Tên sách    │  │  Tên sách    │
│  Tác giả     │  │  Tác giả     │  │  Tác giả     │
│  🟢 Có sẵn   │  │  🔴 Đang mượn│  │  🟢 Có sẵn   │
│  Kệ: A1      │  │  Kệ: B3      │  │  Kệ: A2      │
│  [Chi tiết]  │  │  [Chi tiết]  │  │  [Chi tiết]  │
└──────────────┘  └──────────────┘  └──────────────┘
```

#### Dạng Danh Sách (List View)

```
┌─────────────────────────────────────────────────────────┐
│  [Ảnh] Tên sách 1                          🟢 Có sẵn   │
│        Tác giả: Nguyễn Văn A                            │
│        Năm XB: 2020 | Thể loại: Văn học | Kệ: A1      │
│        ISBN: 978-604-xxx-xxx-x                          │
│        [Xem chi tiết] [Mượn sách]                       │
├─────────────────────────────────────────────────────────┤
│  [Ảnh] Tên sách 2                          🔴 Đang mượn│
│        Tác giả: Trần Thị B                              │
│        Năm XB: 2019 | Thể loại: Khoa học | Kệ: B3     │
│        ISBN: 978-604-xxx-xxx-x                          │
│        Dự kiến trả: 15/05/2026                          │
│        [Xem chi tiết] [Đặt trước]                       │
└─────────────────────────────────────────────────────────┘
```

## Sắp Xếp Kết Quả

### Các Tùy Chọn Sắp Xếp

1. **Độ phù hợp** (mặc định)
   - Dựa trên thuật toán tìm kiếm
   - Ưu tiên kết quả khớp chính xác

2. **Tên sách (A-Z)**
   - Sắp xếp theo bảng chữ cái

3. **Tên sách (Z-A)**
   - Sắp xếp ngược

4. **Năm xuất bản (mới nhất)**
   - Sách mới xuất bản trước

5. **Năm xuất bản (cũ nhất)**
   - Sách cũ trước

6. **Độ phổ biến**
   - Sách được mượn nhiều nhất

## Phân Trang

- Hiển thị 20 kết quả mỗi trang
- Nút: Trang trước | 1 2 3 ... 10 | Trang sau
- Hiển thị tổng số kết quả tìm thấy

```
Tìm thấy 156 kết quả

[<] [1] [2] [3] ... [8] [>]

Hiển thị 1-20 trong 156 kết quả
```

## Lưu Lịch Sử Tìm Kiếm

### Chức Năng

- Lưu 10 tìm kiếm gần nhất
- Hiển thị khi click vào ô tìm kiếm
- Xóa từng mục hoặc xóa tất cả
- Tìm kiếm lại nhanh bằng 1 click

### Giao Diện

```
┌─────────────────────────────────────────────┐
│  🔍 Tìm kiếm sách...                        │
├─────────────────────────────────────────────┤
│  Tìm kiếm gần đây:                          │
│  🕐 Harry Potter              [×]           │
│  🕐 Toán học lớp 10           [×]           │
│  🕐 Nguyễn Nhật Ánh           [×]           │
│                                              │
│  [Xóa tất cả lịch sử]                       │
└─────────────────────────────────────────────┘
```

## Tìm Kiếm Nâng Cao - Toán Tử

### Hỗ Trợ Toán Tử Boolean

- **AND**: Tìm sách có cả hai từ khóa
  - Ví dụ: `harry AND potter`

- **OR**: Tìm sách có một trong hai từ khóa
  - Ví dụ: `toán OR vật lý`

- **NOT**: Loại trừ từ khóa
  - Ví dụ: `văn học NOT thơ`

- **Dấu ngoặc kép**: Tìm cụm từ chính xác
  - Ví dụ: `"Harry Potter và Hòn đá Phù thủy"`

## Xuất Kết Quả Tìm Kiếm

### Định Dạng Xuất

- **PDF**: Danh sách có định dạng
- **Excel**: Bảng dữ liệu chi tiết
- **CSV**: Dữ liệu thô

### Thông Tin Xuất

- Tất cả thông tin sách trong kết quả
- Tiêu chí tìm kiếm đã sử dụng
- Ngày giờ xuất báo cáo
- Tổng số kết quả

## Tối Ưu Hiệu Suất

### Caching

- Cache kết quả tìm kiếm phổ biến
- Thời gian cache: 5 phút
- Tự động làm mới khi có thay đổi dữ liệu

### Indexing

- Index trên các trường: Tên sách, Tác giả, ISBN
- Full-text search index
- Cập nhật index khi thêm/sửa/xóa sách

## Quyền Truy Cập

### Học Sinh

- Tìm kiếm tất cả sách
- Xem tình trạng sách
- Không xem được sách đã xóa/ẩn

### Thủ Thư

- Tìm kiếm tất cả sách (kể cả đã xóa/ẩn)
- Xem thông tin chi tiết hơn
- Xuất báo cáo kết quả tìm kiếm

## Thông Báo Lỗi

### Không Tìm Thấy Kết Quả

```
┌─────────────────────────────────────────────┐
│  😔 Không tìm thấy kết quả                  │
│                                              │
│  Gợi ý:                                      │
│  • Kiểm tra lại chính tả                    │
│  • Thử từ khóa khác                         │
│  • Sử dụng ít từ khóa hơn                   │
│  • Thử tìm kiếm nâng cao                    │
└─────────────────────────────────────────────┘
```

### Lỗi Hệ Thống

```
┌─────────────────────────────────────────────┐
│  ⚠️ Có lỗi xảy ra khi tìm kiếm              │
│                                              │
│  Vui lòng thử lại sau hoặc liên hệ          │
│  thủ thư để được hỗ trợ.                    │
│                                              │
│  [Thử lại]                                   │
└─────────────────────────────────────────────┘
```

## Tích Hợp

- Tích hợp với module Quản lý sách
- Tích hợp với module Mượn/Trả sách
- Tích hợp với module Đặt trước
- Tích hợp với module Thông báo
