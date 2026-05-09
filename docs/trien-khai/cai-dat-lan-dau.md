# Cài Đặt Lần Đầu

Hướng dẫn cài đặt và cấu hình hệ thống Quản Lý Thư Viện lần đầu tiên.

## Yêu Cầu Hệ Thống

### Phần cứng tối thiểu

- **CPU:** Intel Core i3 hoặc tương đương
- **RAM:** 4GB (khuyến nghị 8GB)
- **Ổ cứng:** 500MB dung lượng trống (khuyến nghị 2GB cho dữ liệu)
- **Màn hình:** Độ phân giải 1366x768 trở lên
- **Kết nối:** Cổng USB (cho máy quét mã vạch, máy in)

### Hệ điều hành

- **Windows 10** (64-bit) trở lên
- **Windows 11** (khuyến nghị)
- Windows Server 2016/2019/2022 (cho server)

### Phần mềm bổ sung

- **.NET Framework 4.7.2** trở lên (thường đã có sẵn)
- **Visual C++ Redistributable** (tự động cài khi cần)
- **Microsoft Edge WebView2** (tự động cài khi cần)

### Thiết bị ngoại vi (tùy chọn)

- Máy quét mã vạch USB/Bluetooth
- Máy in thẻ thư viện
- Máy in hóa đơn/biên lai
- Webcam (cho chụp ảnh thẻ)

## Download Installer

### Tải từ website chính thức

1. Truy cập: https://thuvien.example.com/download
2. Chọn phiên bản phù hợp:
   - **Windows 64-bit** (khuyến nghị)
   - **Windows 32-bit** (máy cũ)
3. Click **Download** và lưu file

### Tải từ GitHub Releases

1. Truy cập: https://github.com/your-org/thuvien-app/releases
2. Chọn phiên bản mới nhất (Latest)
3. Download file `.exe`:
   - `Quản-Lý-Thư-Viện-1.0.0-x64.exe` (64-bit)
   - `Quản-Lý-Thư-Viện-1.0.0-ia32.exe` (32-bit)

### Kiểm tra file tải về

Kiểm tra checksum để đảm bảo file không bị lỗi:

```powershell
# Tính SHA256 checksum
Get-FileHash "Quản-Lý-Thư-Viện-1.0.0-x64.exe" -Algorithm SHA256

# So sánh với checksum trên website
```

## Chạy Installer

### Bước 1: Khởi chạy installer

1. Double-click file `.exe` đã tải
2. Nếu Windows SmartScreen cảnh báo:
   - Click **More info**
   - Click **Run anyway**
3. Click **Yes** khi UAC hỏi quyền Administrator

### Bước 2: Chọn ngôn ngữ

- Chọn **Tiếng Việt** hoặc **English**
- Click **OK**

### Bước 3: Đọc License Agreement

- Đọc điều khoản sử dụng
- Check **I accept the agreement**
- Click **Next**

### Bước 4: Chọn thư mục cài đặt

- Mặc định: `C:\Program Files\Quản Lý Thư Viện`
- Hoặc click **Browse** để chọn thư mục khác
- Click **Next**

### Bước 5: Chọn components

- [x] **Ứng dụng chính** (bắt buộc)
- [x] **Desktop shortcut** (khuyến nghị)
- [x] **Start Menu shortcut** (khuyến nghị)
- [ ] **Dữ liệu mẫu** (cho demo/test)
- Click **Next**

### Bước 6: Cài đặt

- Click **Install**
- Đợi quá trình cài đặt (1-2 phút)
- Click **Finish** để hoàn tất

### Bước 7: Khởi động ứng dụng

- Check **Launch Quản Lý Thư Viện**
- Click **Finish**

## Cấu Hình Lần Đầu

### Màn hình chào mừng

Khi khởi động lần đầu, wizard cấu hình sẽ xuất hiện.

### Bước 1: Tạo tài khoản Admin

1. **Thông tin tài khoản:**
   - Username: `admin` (mặc định, có thể đổi)
   - Password: Nhập mật khẩu mạnh (tối thiểu 8 ký tự)
   - Confirm Password: Nhập lại mật khẩu
   - Email: admin@thuvien.example.com

2. **Thông tin cá nhân:**
   - Họ và tên: Nguyễn Văn A
   - Số điện thoại: 0123456789
   - Chức vụ: Quản trị viên

3. Click **Tiếp tục**

### Bước 2: Cấu hình thông tin trường

1. **Thông tin cơ bản:**
   - Tên trường: Trường THPT ABC
   - Mã trường: THPT-ABC-001
   - Địa chỉ: 123 Đường XYZ, Quận 1, TP.HCM
   - Điện thoại: (028) 1234 5678
   - Email: thuvien@thptabc.edu.vn
   - Website: https://thptabc.edu.vn

2. **Logo trường:**
   - Click **Chọn file** để upload logo
   - Định dạng: PNG, JPG (khuyến nghị PNG trong suốt)
   - Kích thước: 200x200px đến 500x500px

3. **Cấu hình thư viện:**
   - Tên thư viện: Thư viện THPT ABC
   - Giờ mở cửa: 7:00 - 17:00
   - Ngày làm việc: Thứ 2 - Thứ 6
   - Số lượng sách tối đa/độc giả: 5
   - Thời gian mượn tối đa: 14 ngày

4. Click **Tiếp tục**

### Bước 3: Import dữ liệu mẫu (tùy chọn)

Chọn một trong các tùy chọn:

#### Option 1: Bắt đầu với dữ liệu trống

- Chọn **Bắt đầu mới**
- Database trống, tự nhập dữ liệu sau

#### Option 2: Import dữ liệu mẫu

- Chọn **Import dữ liệu mẫu**
- Bao gồm:
  - 100 sách mẫu
  - 50 độc giả mẫu
  - 20 giao dịch mẫu
  - Các danh mục chuẩn
- Dùng để test và làm quen hệ thống

#### Option 3: Import từ file Excel

- Chọn **Import từ Excel**
- Chọn file Excel chứa dữ liệu
- Map các cột với trường trong hệ thống
- Xem preview và xác nhận

#### Option 4: Import từ hệ thống cũ

- Chọn **Import từ hệ thống cũ**
- Chọn loại hệ thống: OPAC, Koha, v.v.
- Chọn file backup/export
- Chuyển đổi và import dữ liệu

Click **Tiếp tục**

### Bước 4: Hoàn tất cấu hình

- Xem lại thông tin đã cấu hình
- Click **Hoàn tất** để lưu
- Hệ thống khởi tạo database và cấu hình

## Kết Nối Thiết Bị

### Máy quét mã vạch

#### Kết nối USB

1. Cắm máy quét vào cổng USB
2. Windows tự động cài driver
3. Vào **Cài đặt > Thiết bị > Máy quét**
4. Click **Tìm kiếm thiết bị**
5. Chọn máy quét từ danh sách
6. Click **Kết nối**
7. Test bằng cách quét mã vạch thử

#### Kết nối Bluetooth

1. Bật Bluetooth trên máy quét
2. Vào **Windows Settings > Bluetooth & devices**
3. Click **Add device**
4. Chọn máy quét từ danh sách
5. Nhập PIN nếu yêu cầu (thường là 0000 hoặc 1234)
6. Vào **Cài đặt > Thiết bị > Máy quét** trong app
7. Chọn máy quét Bluetooth
8. Click **Kết nối**

#### Cấu hình máy quét

- **Chế độ quét:** Continuous / Single scan
- **Beep sound:** Bật/Tắt
- **Prefix/Suffix:** Cấu hình ký tự đầu/cuối
- **Enter key:** Tự động Enter sau khi quét

### Máy in thẻ thư viện

#### Cài đặt driver

1. Download driver từ website nhà sản xuất
2. Cài đặt driver
3. Kết nối máy in qua USB
4. Test print từ Windows

#### Cấu hình trong app

1. Vào **Cài đặt > Thiết bị > Máy in thẻ**
2. Click **Chọn máy in**
3. Chọn máy in từ danh sách
4. Cấu hình:
   - Kích thước thẻ: 85.6mm x 54mm (CR80)
   - Orientation: Landscape
   - Print quality: High
   - Color mode: Color/Monochrome
5. Click **Test Print** để kiểm tra

#### Thiết kế mẫu thẻ

1. Vào **Quản lý > Mẫu thẻ**
2. Click **Tạo mẫu mới**
3. Kéo thả các trường:
   - Logo trường
   - Ảnh độc giả
   - Họ tên
   - Mã độc giả
   - Lớp
   - Mã vạch
   - Ngày hết hạn
4. Điều chỉnh vị trí, font, màu sắc
5. Click **Lưu mẫu**

### Máy in hóa đơn

#### Máy in nhiệt (thermal printer)

1. Kết nối máy in qua USB hoặc Ethernet
2. Cài đặt driver
3. Vào **Cài đặt > Thiết bị > Máy in hóa đơn**
4. Chọn máy in
5. Cấu hình:
   - Khổ giấy: 80mm hoặc 58mm
   - Tự động cắt giấy: Bật/Tắt
   - Số bản in: 1 hoặc 2 (bản chính + bản lưu)

#### Thiết kế mẫu hóa đơn

1. Vào **Quản lý > Mẫu hóa đơn**
2. Chỉnh sửa template:
   - Header: Logo, tên trường
   - Thông tin giao dịch
   - Danh sách sách mượn/trả
   - Footer: Chữ ký, lưu ý
3. Preview và test print

### Webcam (chụp ảnh thẻ)

1. Kết nối webcam qua USB
2. Windows tự động nhận diện
3. Vào **Cài đặt > Thiết bị > Camera**
4. Chọn camera từ danh sách
5. Cấu hình:
   - Resolution: 640x480 hoặc cao hơn
   - Auto focus: Bật
   - Brightness/Contrast: Tự động
6. Test bằng cách chụp ảnh thử

## Kiểm Tra Hoạt Động

### Checklist kiểm tra

- [ ] **Đăng nhập:** Đăng nhập với tài khoản admin
- [ ] **Thêm sách:** Thêm 1 cuốn sách thử
- [ ] **Thêm độc giả:** Thêm 1 độc giả thử
- [ ] **Quét mã vạch:** Quét mã vạch sách
- [ ] **Mượn sách:** Tạo giao dịch mượn sách
- [ ] **Trả sách:** Tạo giao dịch trả sách
- [ ] **In thẻ:** In thẻ độc giả thử
- [ ] **In hóa đơn:** In hóa đơn mượn/trả
- [ ] **Tìm kiếm:** Tìm kiếm sách, độc giả
- [ ] **Báo cáo:** Xem báo cáo thống kê
- [ ] **Backup:** Tạo backup thử

### Test các chức năng chính

#### 1. Quản lý sách

```
1. Vào menu Sách > Thêm sách mới
2. Nhập thông tin sách
3. Quét mã vạch hoặc nhập thủ công
4. Upload ảnh bìa
5. Lưu
6. Tìm kiếm sách vừa thêm
7. Chỉnh sửa thông tin
8. Xóa sách (nếu cần)
```

#### 2. Quản lý độc giả

```
1. Vào menu Độc giả > Thêm độc giả
2. Nhập thông tin cá nhân
3. Chụp ảnh hoặc upload ảnh
4. Tạo mã độc giả tự động
5. In thẻ thư viện
6. Lưu
```

#### 3. Mượn/Trả sách

```
1. Vào menu Giao dịch > Mượn sách
2. Quét thẻ độc giả
3. Quét mã vạch sách (có thể quét nhiều cuốn)
4. Xác nhận mượn
5. In hóa đơn
6. Vào Giao dịch > Trả sách
7. Quét thẻ độc giả hoặc mã sách
8. Xác nhận trả
9. Tính phí phạt (nếu trễ hạn)
```

#### 4. Báo cáo

```
1. Vào menu Báo cáo
2. Chọn loại báo cáo:
   - Thống kê mượn/trả
   - Top sách được mượn nhiều
   - Độc giả tích cực
   - Sách quá hạn
3. Chọn khoảng thời gian
4. Xem báo cáo
5. Export Excel/PDF
```

## Troubleshooting Cài Đặt

### Lỗi: "Installation failed"

**Nguyên nhân:**
- Không đủ quyền Administrator
- Antivirus chặn
- Ổ cứng đầy

**Giải pháp:**
1. Chạy installer với quyền Administrator (Right-click > Run as administrator)
2. Tạm tắt antivirus trong lúc cài
3. Giải phóng dung lượng ổ cứng
4. Thử cài vào thư mục khác

### Lỗi: "Cannot create database"

**Nguyên nhân:**
- Không có quyền ghi vào thư mục AppData
- Ổ cứng bị lỗi

**Giải pháp:**
1. Kiểm tra quyền thư mục: `%APPDATA%\ThuVien`
2. Chạy app với quyền Administrator
3. Chạy `chkdsk` để kiểm tra ổ cứng
4. Thử tạo database ở vị trí khác (Cài đặt > Database > Đổi vị trí)

### Lỗi: "Port already in use"

**Nguyên nhân:**
- Cổng mạng đã được ứng dụng khác sử dụng

**Giải pháp:**
1. Vào Cài đặt > Mạng
2. Đổi port sang số khác (ví dụ: 3001, 8080)
3. Khởi động lại ứng dụng

### Lỗi: Máy quét không hoạt động

**Nguyên nhân:**
- Driver chưa cài
- Cổng USB lỗi
- Máy quét chưa được cấu hình

**Giải pháp:**
1. Kiểm tra Device Manager xem máy quét có được nhận diện không
2. Cài đặt driver từ nhà sản xuất
3. Thử cổng USB khác
4. Vào Cài đặt > Thiết bị > Tìm kiếm lại
5. Test máy quét với Notepad trước

### Lỗi: Máy in không in được

**Nguyên nhân:**
- Driver chưa cài
- Máy in offline
- Hết giấy/mực

**Giải pháp:**
1. Kiểm tra máy in trong Windows Settings
2. Set máy in làm default printer
3. Test print từ Windows trước
4. Kiểm tra giấy, mực
5. Khởi động lại máy in
6. Cài đặt lại driver

### Lỗi: Ứng dụng chạy chậm

**Nguyên nhân:**
- RAM không đủ
- Database quá lớn
- Nhiều ứng dụng chạy nền

**Giải pháp:**
1. Đóng các ứng dụng không cần thiết
2. Tăng RAM nếu có thể
3. Optimize database: Cài đặt > Bảo trì > Tối ưu database
4. Xóa dữ liệu cũ không cần thiết
5. Backup và restore database

### Lỗi: Không kết nối được mạng

**Nguyên nhân:**
- Firewall chặn
- Cấu hình mạng sai

**Giải pháp:**
1. Thêm exception cho app trong Windows Firewall
2. Kiểm tra IP address và port
3. Ping server để test kết nối
4. Kiểm tra router/switch
5. Tắt VPN nếu có

## Hỗ Trợ

### Tài liệu

- **Hướng dẫn sử dụng:** https://docs.thuvien.example.com
- **Video tutorials:** https://youtube.com/thuvien-tutorials
- **FAQ:** https://thuvien.example.com/faq

### Liên hệ

- **Email:** support@thuvien.example.com
- **Hotline:** 1900-xxxx (8:00 - 17:00, T2-T6)
- **Forum:** https://forum.thuvien.example.com
- **Facebook:** fb.com/thuvien.support

### Remote support

Nếu cần hỗ trợ từ xa:
1. Cài đặt TeamViewer hoặc AnyDesk
2. Liên hệ hotline để được hướng dẫn
3. Cung cấp ID và password cho kỹ thuật viên
