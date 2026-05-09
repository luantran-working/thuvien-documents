# Implementation Plan: Tối ưu hóa cấu trúc tài liệu Game Design

## Goal

Tối ưu hóa cấu trúc tài liệu game "Bảo vệ khu phố" bằng cách:

1. Gôm 6 file `plan-timelines/` thành 1 file duy nhất
2. Merge `roadmap.md` vào `ke-hoach-tong-the.md`
3. Dọn dẹp nội dung lặp trong `assets-design-spec/`
4. Cập nhật sidebar và intro

## Assumptions

1. Tất cả thông tin trong các file hiện tại đều cần được giữ lại, chỉ tổ chức lại.
2. Team đang sử dụng Docusaurus để render tài liệu.
3. Không có file nào đang được edit bởi người khác trong quá trình thực hiện.
4. Git đã được thiết lập và có thể commit backup.

## Plan

### Step 1: Backup toàn bộ thư mục docs

**Files:** `docs/`
**Change:** Tạo bản backup của toàn bộ thư mục docs để có thể rollback
**Verify:**

```bash
git status
git add -A
git commit -m "backup: before restructure docs"
```

---

### Step 2: Tạo file ke-hoach-san-xuat.md gôm 6 file plan-timelines

**Files:**

- `docs/plan-timelines/ke-hoach-san-xuat.md` (new)
- Đọc từ: `tong-quan.md`, `developer.md`, `artist.md`, `vfx.md`, `sound.md`, `game-designer.md`

**Change:** Tạo file mới gôm nội dung từ 6 file thành các sections:

- Section 1: Tổng quan Timeline (từ tong-quan.md)
- Section 2: Công việc Developer (từ developer.md)
- Section 3: Công việc Artist (từ artist.md)
- Section 4: Công việc VFX (từ vfx.md)
- Section 5: Công việc Sound (từ sound.md)
- Section 6: Công việc Game Designer (từ game-designer.md)

**Verify:**

```bash
Test-Path "docs/plan-timelines/ke-hoach-san-xuat.md"
```

---

### Step 3: Xóa 6 file plan-timelines đã gôm

**Files:**

- `docs/plan-timelines/tong-quan.md` (delete)
- `docs/plan-timelines/developer.md` (delete)
- `docs/plan-timelines/artist.md` (delete)
- `docs/plan-timelines/vfx.md` (delete)
- `docs/plan-timelines/sound.md` (delete)
- `docs/plan-timelines/game-designer.md` (delete)

**Change:** Xóa 6 file đã được gôm vào ke-hoach-san-xuat.md

**Verify:**

```bash
Get-ChildItem "docs/plan-timelines/" | Select-Object Name
```

Chỉ còn 2 file: `ke-hoach-san-xuat.md` và `quan-ly-du-an.md`

---

### Step 4: Merge roadmap.md vào ke-hoach-tong-the.md

**Files:**

- `docs/ke-hoach-tong-the.md` (edit)
- `docs/roadmap.md` (delete)

**Change:**

- Thêm section "Lộ trình thực hiện" vào cuối ke-hoach-tong-the.md với nội dung từ roadmap.md
- Xóa file roadmap.md

**Verify:**

```bash
Select-String -Path "docs/ke-hoach-tong-the.md" -Pattern "Block A"
Test-Path "docs/roadmap.md"  # Should return False
```

---

### Step 5: Dọn dẹp assets-design-spec/ky-nang.md

**Files:** `docs/assets-design-spec/ky-nang.md`

**Change:**

- Xóa bảng danh sách 20 kỹ năng (đã có đầy đủ trong he-thong-ky-nang.md)
- Thêm link reference: "Xem danh sách đầy đủ tại [Hệ thống kỹ năng](../he-thong-ky-nang.md)"
- Chỉ giữ lại phần VFX/SFX specs

**Verify:**

```bash
Select-String -Path "docs/assets-design-spec/ky-nang.md" -Pattern "he-thong-ky-nang"
```

---

### Step 6: Dọn dẹp assets-design-spec/quai-vat.md

**Files:** `docs/assets-design-spec/quai-vat.md`

**Change:**

- Xóa phần mô tả chung về quái vật (đã có trong he-thong-quai-vat.md)
- Thêm link reference đến file hệ thống
- Chỉ giữ lại phần Visual Concept, Animation, và hình ảnh mô phỏng

**Verify:**

```bash
Select-String -Path "docs/assets-design-spec/quai-vat.md" -Pattern "he-thong-quai-vat"
```

---

### Step 7: Cập nhật sidebars.ts

**Files:** `sidebars.ts`

**Change:**

- Thay đổi category "Kế hoạch và timeline" để chỉ còn 2 items: `ke-hoach-san-xuat` và `quan-ly-du-an`
- Xóa `roadmap` khỏi category "Tổng quan"

**Verify:**

```bash
Select-String -Path "sidebars.ts" -Pattern "ke-hoach-san-xuat"
```

---

### Step 8: Cập nhật intro.md

**Files:** `docs/intro.md`

**Change:**

- Cập nhật bảng "Danh sách tài liệu" để phản ánh cấu trúc mới
- Xóa roadmap.md khỏi danh sách
- Thêm ke-hoach-san-xuat.md vào danh sách

**Verify:**

```bash
Select-String -Path "docs/intro.md" -Pattern "ke-hoach-san-xuat"
```

---

### Step 9: Build và kiểm tra Docusaurus

**Files:** N/A

**Change:** Build lại site để đảm bảo không có lỗi

**Verify:**

```bash
npm run build
```

Không có lỗi, build thành công.

---

### Step 10: Commit thay đổi

**Files:** All changed files

**Change:** Commit tất cả thay đổi với message mô tả

**Verify:**

```bash
git add -A
git status
git commit -m "refactor: restructure docs - merge plan-timelines and roadmap"
```

---

## Risks & mitigations

| Rủi ro                                   | Mức độ     | Giải pháp                                                    |
| ---------------------------------------- | ---------- | ------------------------------------------------------------ |
| Link hỏng trong sidebar                  | Trung bình | Kiểm tra kỹ sidebars.ts, chạy npm run build để phát hiện lỗi |
| Mất nội dung khi merge                   | Cao        | Đã commit backup ở Step 1, có thể rollback                   |
| Cross-references trong file khác bị hỏng | Trung bình | Chạy grep để tìm tất cả references đến file bị xóa           |
| Build Docusaurus fail                    | Thấp       | Chạy npm run build sau mỗi bước quan trọng                   |

## Rollback plan

1. Nếu build fail hoặc có vấn đề nghiêm trọng:

```bash
git reset --hard HEAD~1
```

2. Nếu chỉ cần rollback một phần:

```bash
git checkout HEAD~1 -- <file-path>
```
