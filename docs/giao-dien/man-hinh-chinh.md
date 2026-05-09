# Màn hình chính (Dashboard)

## Tổng quan

Dashboard là màn hình đầu tiên người dùng thấy sau khi đăng nhập. Nội dung và chức năng hiển thị tùy thuộc vào vai trò người dùng.

## Dashboard theo vai trò

### Admin Dashboard

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Tổng quan hệ thống                                      │
├──────────────┬──────────────┬──────────────┬───────────┤
│ Tổng số sách │ Người dùng   │ Mượn hôm nay │ Quá hạn   │
│ 2,450        │ 1,234        │ 45           │ 12        │
│ +15 tháng này│ +23 tuần này │              │ ⚠️        │
└──────────────┴──────────────┴──────────────┴───────────┘

┌─────────────────────────────────────────────────────────┐
│ Biểu đồ hoạt động (30 ngày)                             │
│ [Line chart: Mượn/Trả theo ngày]                        │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────┐
│ Hoạt động gần đây        │ Cảnh báo hệ thống            │
│ • User123 mượn 3 sách    │ ⚠️ 12 sách quá hạn           │
│ • User456 trả 2 sách     │ ⚠️ 5 yêu cầu chờ duyệt       │
│ • Thêm 10 sách mới       │ ℹ️ Backup lần cuối: 2h trước │
│ [Xem tất cả]             │ [Xem chi tiết]               │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Quick Actions                                            │
│ [+ Thêm sách] [+ Thêm người dùng] [⚙️ Cấu hình]         │
└─────────────────────────────────────────────────────────┘
```

#### Thống kê tổng quan
1. **Tổng số sách**
   - Số lượng đầu sách
   - Số lượng bản sao
   - Thay đổi so với tháng trước
   - Click để xem chi tiết kho sách

2. **Người dùng**
   - Tổng số người dùng active
   - Người dùng mới trong tuần
   - Phân bố theo vai trò (pie chart nhỏ)
   - Click để xem quản lý người dùng

3. **Mượn hôm nay**
   - Số giao dịch mượn trong ngày
   - Số giao dịch trả trong ngày
   - So sánh với trung bình

4. **Quá hạn**
   - Số sách đang quá hạn
   - Số người dùng có sách quá hạn
   - Cảnh báo màu đỏ nếu > 10
   - Click để xem danh sách chi tiết

#### Biểu đồ hoạt động
- **Line chart**: Xu hướng mượn/trả 30 ngày gần nhất
- **Bar chart**: Top 10 sách được mượn nhiều nhất
- **Pie chart**: Phân bố sách theo thể loại
- Toggle giữa các loại biểu đồ
- Export dữ liệu (CSV, Excel)

#### Hoạt động gần đây
- 10 hoạt động mới nhất
- Loại: Mượn, Trả, Thêm sách, Thêm người dùng
- Timestamp
- User thực hiện
- Link đến chi tiết
- Auto-refresh mỗi 30s

#### Cảnh báo hệ thống
- Sách quá hạn (priority cao)
- Yêu cầu chờ duyệt
- Sách sắp hết
- Lỗi hệ thống
- Thông tin backup
- Màu sắc theo mức độ: Đỏ (error), Vàng (warning), Xanh (info)

### Thủ thư Dashboard

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Công việc hôm nay                                        │
├──────────────┬──────────────┬──────────────┬───────────┤
│ Cần trả      │ Quá hạn      │ Đặt trước    │ Mượn mới  │
│ 23           │ 8            │ 15           │ 12        │
│ [Xử lý]      │ [Nhắc nhở]   │ [Xem]        │           │
└──────────────┴──────────────┴──────────────┴───────────┘

┌─────────────────────────────────────────────────────────┐
│ Mượn/Trả nhanh                                           │
│ [Quét mã vạch hoặc nhập mã]                             │
│ 📷 Quét    🔍 Tìm kiếm                                   │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────┐
│ Sách quá hạn cần xử lý   │ Đặt trước chờ lấy            │
│ 1. Nguyễn Văn A          │ 1. Trần Thị B                │
│    "Toán 12" - 3 ngày    │    "Văn 11" - Sẵn sàng       │
│    [Nhắc nhở] [Chi tiết] │    [Thông báo] [Cho mượn]    │
│ 2. Lê Văn C              │ 2. Phạm Văn D                │
│    "Lý 11" - 7 ngày      │    "Anh 10" - Chờ về         │
│ [Xem tất cả 8]           │ [Xem tất cả 15]              │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Lịch sử giao dịch hôm nay                                │
│ 09:15 - Nguyễn Văn A mượn "Toán 12"                     │
│ 10:30 - Trần Thị B trả "Văn 11"                         │
│ [Xem tất cả]                                             │
└─────────────────────────────────────────────────────────┘
```

#### Công việc hôm nay
1. **Cần trả hôm nay**
   - Danh sách sách đến hạn trả
   - Thông tin người mượn
   - Button xử lý nhanh

2. **Quá hạn**
   - Danh sách ưu tiên xử lý
   - Số ngày quá hạn
   - Gửi nhắc nhở tự động

3. **Đặt trước**
   - Sách đã về, chờ người dùng lấy
   - Sách chưa về
   - Thông báo cho người đặt

4. **Mượn mới**
   - Số giao dịch mượn trong ngày
   - Thống kê nhanh

#### Mượn/Trả nhanh
- Input lớn, dễ thấy
- Hỗ trợ quét mã vạch
- Tìm kiếm theo: Mã sách, Tên sách, Mã người dùng
- Autocomplete suggestions
- Xử lý nhanh không cần nhiều click

#### Danh sách ưu tiên
- **Sách quá hạn**: Sắp xếp theo số ngày quá hạn
- **Đặt trước**: Sách sẵn sàng ở đầu
- Actions nhanh trên từng item
- Pagination hoặc infinite scroll

### Giáo viên Dashboard

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Sách của tôi                                             │
├──────────────┬──────────────┬──────────────────────────┤
│ Đang mượn    │ Sắp đến hạn  │ Lịch sử                  │
│ 3            │ 1            │ 45 lượt                  │
└──────────────┴──────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Tìm kiếm sách                                            │
│ [Tìm theo tên, tác giả, thể loại...]                    │
│ 🔍 Tìm kiếm    📚 Duyệt theo thể loại                    │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────┐
│ Sách đang mượn           │ Sách đề xuất                 │
│ 1. "Toán 12"             │ 1. "Phương pháp giải toán"   │
│    Đến hạn: 5 ngày       │    ⭐ 4.5/5 (23 đánh giá)    │
│    [Gia hạn] [Trả]       │    [Xem] [Đặt trước]         │
│ 2. "Văn 11"              │ 2. "Giáo án Văn 11"          │
│    Đến hạn: 12 ngày      │    ⭐ 4.8/5 (15 đánh giá)    │
│ [Xem tất cả]             │ [Xem thêm]                   │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Sách mới về thư viện                                     │
│ [Carousel: 5 sách mới nhất với ảnh bìa]                 │
└─────────────────────────────────────────────────────────┘
```

#### Sách của tôi
1. **Đang mượn**
   - Danh sách sách đang mượn
   - Ngày đến hạn
   - Gia hạn nhanh (nếu được phép)

2. **Sắp đến hạn**
   - Cảnh báo sách đến hạn trong 3 ngày
   - Nhắc nhở trả hoặc gia hạn

3. **Lịch sử**
   - Tổng số lượt mượn
   - Link đến lịch sử chi tiết

#### Tìm kiếm sách
- Search bar nổi bật
- Filters: Thể loại, Tác giả, Năm xuất bản
- Tìm kiếm nâng cao
- Lưu tìm kiếm thường dùng

#### Sách đề xuất
- Dựa trên lịch sử mượn
- Sách cùng thể loại
- Sách được đánh giá cao
- Sách mới về

### Học sinh Dashboard

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Xin chào, [Tên học sinh]!                                │
│ Bạn đang mượn 2 sách, 1 sách sắp đến hạn                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Tìm sách                                                 │
│ [Tìm theo tên sách, tác giả...]                         │
│ 🔍 Tìm kiếm    📚 Thể loại    ⭐ Sách hay                │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────┐
│ Sách đang mượn           │ Sách đặt trước               │
│ 1. "Toán 10"             │ 1. "Harry Potter"            │
│    ⏰ Còn 2 ngày          │    📅 Dự kiến: 15/05         │
│    [Gia hạn]             │    [Hủy đặt]                 │
│ 2. "Văn 10"              │                              │
│    ⏰ Còn 10 ngày         │                              │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Sách phổ biến trong tuần                                 │
│ [Grid: 6 sách với ảnh bìa, rating, số lượt mượn]        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Sách mới về                                              │
│ [Carousel: Sách mới với ảnh bìa đẹp]                    │
└─────────────────────────────────────────────────────────┘
```

#### Thông tin cá nhân
- Lời chào thân thiện
- Tóm tắt trạng thái (số sách mượn, cảnh báo)
- Avatar và điểm thành viên (nếu có)

#### Tìm sách
- Giao diện đơn giản, thân thiện
- Quick filters: Thể loại phổ biến
- Sách hay (rating cao)
- Sách mới về

#### Sách của tôi
1. **Đang mượn**
   - Hiển thị rõ thời gian còn lại
   - Cảnh báo màu đỏ nếu sắp đến hạn
   - Gia hạn 1-click (nếu được phép)

2. **Đặt trước**
   - Sách đã đặt
   - Thời gian dự kiến có sách
   - Hủy đặt nếu không cần nữa

#### Sách phổ biến
- Top sách được mượn nhiều
- Rating và reviews
- Ảnh bìa hấp dẫn
- Click để xem chi tiết và đặt trước

#### Sách mới về
- Carousel với ảnh đẹp
- Thông tin ngắn gọn
- Nút đặt trước nhanh

## Thống kê tổng quan (Shared Components)

### Stat Card Component
```
┌──────────────────────┐
│ 📚                   │
│ 2,450                │ ← Value (large, bold)
│ Tổng số sách         │ ← Label
│ +15 tháng này        │ ← Change indicator
└──────────────────────┘
```

**Variants:**
- Success: Green icon background, green change
- Warning: Yellow icon background, yellow change
- Error: Red icon background, red change
- Neutral: Blue icon background, gray change

**Props:**
- icon: Icon component
- value: Number or string
- label: String
- change: Number (percentage)
- trend: 'up' | 'down' | 'neutral'
- onClick: Optional click handler

### Chart Component

#### Line Chart (Xu hướng)
- X-axis: Thời gian (ngày, tuần, tháng)
- Y-axis: Số lượng
- Multiple lines: Mượn (blue), Trả (green)
- Tooltip on hover
- Legend
- Responsive

#### Bar Chart (So sánh)
- Horizontal hoặc vertical
- Top 10 items
- Màu gradient
- Label values
- Sortable

#### Pie Chart (Phân bố)
- Thể loại sách
- Vai trò người dùng
- Percentage labels
- Legend
- Interactive (click to filter)

**Library:** Chart.js hoặc Recharts

## Hoạt động gần đây

### Activity Feed Component
```
┌─────────────────────────────────────────┐
│ 🔵 Nguyễn Văn A mượn "Toán 12"          │
│    2 phút trước                          │
├─────────────────────────────────────────┤
│ 🟢 Trần Thị B trả "Văn 11"              │
│    15 phút trước                         │
├─────────────────────────────────────────┤
│ 🟡 Thêm 10 sách mới vào kho             │
│    1 giờ trước                           │
└─────────────────────────────────────────┘
```

**Activity Types:**
- Mượn sách: Blue dot
- Trả sách: Green dot
- Thêm sách: Yellow dot
- Thêm người dùng: Purple dot
- Cảnh báo: Red dot

**Features:**
- Real-time updates (WebSocket)
- Relative timestamps
- Click to view details
- Filter by type
- Load more / Infinite scroll

## Quick Actions

### Action Buttons
- **Admin**: Thêm sách, Thêm người dùng, Cấu hình, Báo cáo
- **Thủ thư**: Mượn sách, Trả sách, Tìm kiếm, Báo cáo
- **Giáo viên**: Tìm sách, Lịch sử của tôi, Đề xuất
- **Học sinh**: Tìm sách, Sách của tôi

**Design:**
- Large, prominent buttons
- Icon + Label
- Primary color
- Hover effect
- Keyboard shortcut hint

## Thông báo nổi bật

### Notification Banner
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Bạn có 1 sách sắp đến hạn trong 2 ngày               │
│ "Toán 12" - Đến hạn: 09/05/2026                         │
│ [Gia hạn] [Xem chi tiết] [Đóng]                         │
└─────────────────────────────────────────────────────────┘
```

**Types:**
- Error: Quá hạn (red)
- Warning: Sắp đến hạn (yellow)
- Info: Sách đặt trước đã về (blue)
- Success: Gia hạn thành công (green)

**Features:**
- Dismissible
- Action buttons
- Auto-hide after action
- Persistent until dismissed

## Responsive Behavior

### Desktop (1280px+)
- Full layout như mô tả
- 2-3 columns
- Sidebar visible

### Laptop (1024px - 1279px)
- Slightly condensed
- 2 columns
- Sidebar collapsible

### Tablet (768px - 1023px)
- 1-2 columns
- Sidebar hidden (hamburger menu)
- Stat cards 2x2 grid

### Mobile (< 768px)
- Single column
- Stat cards stacked
- Charts simplified
- Bottom navigation
- Swipeable cards

## Loading States

### Initial Load
- Skeleton screens cho stat cards
- Skeleton cho charts
- Skeleton cho activity feed
- Smooth fade-in khi data loaded

### Refresh
- Spinner nhỏ ở góc component
- Không block UI
- Toast notification khi complete

## Empty States

### No Data
- Illustration
- Helpful message
- Call-to-action button
- Example: "Chưa có hoạt động nào. Bắt đầu bằng cách mượn sách đầu tiên!"

### Error State
- Error icon
- Error message
- Retry button
- Contact support link

## Performance

### Optimization
- Lazy load charts
- Paginate activity feed
- Cache dashboard data (5 minutes)
- Debounce search inputs
- Virtual scrolling cho long lists

### Metrics
- Initial load: < 2s
- Time to interactive: < 3s
- Smooth 60fps animations
- Lighthouse score: > 90
