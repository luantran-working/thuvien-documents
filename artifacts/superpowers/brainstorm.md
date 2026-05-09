# Superpowers Brainstorm: Tối ưu hóa cấu trúc tài liệu Game Design

## Goal

Tổ chức lại toàn bộ cấu trúc tài liệu thiết kế game "Bảo vệ khu phố" để loại bỏ các phần bị lặp lại giữa các bộ phận (Assets, Dev, Game Designer...), gôm gọn thành một hệ thống tài liệu nhất quán, dễ bảo trì và tra cứu.

## Constraints

1. **Không xóa thông tin:** Chỉ gôm và tổ chức lại, không được mất thông tin chi tiết đã có.
2. **Giữ liên kết:** Các link trong sidebar và cross-reference phải hoạt động sau khi tái cấu trúc.
3. **Tương thích Docusaurus:** Cấu trúc phải phù hợp với Docusaurus site hiện tại.
4. **Quy ước cũ:** Không dùng emoji, không titlecase, tiếng Việt tự nhiên.
5. **Không ảnh hưởng thời gian phát triển:** Việc tái cấu trúc không được làm trễ tiến độ dự án game.

## Known context

### Phát hiện các phần lặp lại chính:

| Chủ đề       | File hiện tại bị lặp                                                                                               | Mô tả vấn đề                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Kỹ năng**  | `he-thong-ky-nang.md` + `assets-design-spec/ky-nang.md` + `assets-design-spec/ky-nang-dong-doi.md`                 | Danh sách 20 kỹ năng Player và 60 kỹ năng đồng đội xuất hiện ở cả file hệ thống (logic/số liệu) và file assets (VFX/SFX). |
| **Quái vật** | `he-thong-quai-vat.md` + `assets-design-spec/quai-vat.md`                                                          | Danh sách 48 quái + 4 boss được mô tả lặp lại ở cả 2 nơi với thông tin gần như giống nhau.                                |
| **Đồng đội** | `he-thong-dong-doi.md` + `assets-design-spec/nhan-vat.md`                                                          | Danh sách 30 đồng đội và thông tin nhân vật lặp.                                                                          |
| **Trang bị** | `he-thong-trang-bi.md` + `assets-design-spec/trang-bi.md`                                                          | Danh sách trang bị và mô tả visual lặp lại.                                                                               |
| **Kế hoạch** | `ke-hoach-tong-the.md` + `roadmap.md` + 7 file trong `plan-timelines/`                                             | Timeline và task breakdown bị lặp: cùng một milestone/giai đoạn được mô tả ở nhiều góc nhìn khác nhau.                    |
| **Chỉ số**   | `he-thong-chi-so-va-tang-truong.md` + 9 file trong `bang-toan-chi-so/`                                             | Thông tin scaling và chi số lặp giữa file hệ thống và bảng toán.                                                          |
| **VFX**      | `chi-tiet-man-hinh-chien-dau.md` + `assets-design-spec/vfx-chien-dau.md` + `assets-design-spec/vfx-ui-he-thong.md` | Mô tả VFX lặp ở nhiều nơi.                                                                                                |

### Cấu trúc hiện tại:

```
docs/
├── Tổng quan (intro, ke-hoach-tong-the, roadmap)
├── plan-timelines/ (7 files - theo bộ phận)
├── Gameplay (5 files)
├── Hệ thống game (8 files)
├── he-thong-cong-thuc-toan-hoc/ (5 files)
├── bang-toan-chi-so/ (9 files)
└── assets-design-spec/ (10 files)
```

## Risks

| Rủi ro                      | Mức độ     | Giải pháp                                                           |
| --------------------------- | ---------- | ------------------------------------------------------------------- |
| Mất thông tin khi gôm       | Cao        | Backup toàn bộ trước khi sửa, đánh dấu rõ thông tin nào từ file nào |
| Link hỏng                   | Trung bình | Cập nhật sidebars.ts và tất cả cross-references                     |
| Team khó tìm theo thói quen | Trung bình | Thêm hướng dẫn đọc tài liệu mới vào intro.md                        |
| Conflict với ongoing work   | Thấp       | Thực hiện nhanh trong 1 sprint, merge ngay                          |

## Options (2-4)

### Option 1: Gôm theo chủ đề (Topic-centric)

Mỗi chủ đề (skill, monster, equipment...) có một file duy nhất chứa tất cả thông tin: logic, số liệu, assets, VFX/SFX.

**Cấu trúc mới:**

```
docs/
├── tong-quan/ (intro, ke-hoach)
├── ke-hoach-timeline.md (merge tất cả plan-timelines)
├── gameplay-core/
├── he-thong/
│   ├── ky-nang.md (merge logic + assets + VFX + chỉ số)
│   ├── quai-vat.md (merge logic + assets)
│   ├── dong-doi.md (merge logic + assets + chỉ số)
│   └── ...
└── cong-thuc-toan-hoc/
```

**Ưu điểm:** Một nơi duy nhất cho mỗi chủ đề.
**Nhược điểm:** File rất dài, khó cho artist đọc phần kỹ thuật.

---

### Option 2: Giữ tách biệt nhưng loại bỏ lặp (DRY Principle)

Giữ phân chia logic/design vs assets, nhưng loại bỏ nội dung lặp bằng cách reference.

**Cách làm:**

- File `he-thong-ky-nang.md` chứa đầy đủ danh sách kỹ năng với logic/số liệu.
- File `assets-design-spec/ky-nang.md` chỉ chứa VFX/SFX spec, reference đến file hệ thống cho danh sách.
- Thêm bảng link rõ ràng.

**Ưu điểm:** Phù hợp workflow team (Dev đọc file A, Artist đọc file B).
**Nhược điểm:** Vẫn cần nhảy giữa các file.

---

### Option 3: Master Document + View Files (Matrix Approach)

Tạo một bộ "master data" chứa tất cả danh sách (skills, monsters, teammates...), các file khác chỉ là "views" lọc thông tin theo góc nhìn.

**Cấu trúc:**

```
docs/
├── tong-quan/
├── ke-hoach/ (merge all timelines thành 1 file tổng + sections)
├── master-data/
│   ├── danh-sach-ky-nang.md (20 player + 60 teammate skills - full info)
│   ├── danh-sach-quai-vat.md (52 enemies - full info)
│   ├── danh-sach-dong-doi.md (30 characters - full info)
│   └── ...
├── gameplay-systems/ (logic references to master-data)
└── assets-specs/ (visual specs references to master-data)
```

**Ưu điểm:** Single source of truth, mỗi cột của bảng có đủ thông tin.
**Nhược điểm:** Thay đổi lớn, cần chỉnh lại nhiều file.

---

### Option 4: Kế hoạch hợp nhất + Hệ thống giữ nguyên

Chỉ gôm phần lặp nhiều nhất (plan-timelines), giữ nguyên các hệ thống game vì chúng hữu ích theo cách phân chia hiện tại.

**Thay đổi:**

- Merge 7 file `plan-timelines/` thành 1 file `ke-hoach-san-xuat.md` với các sections cho từng bộ phận.
- Merge `ke-hoach-tong-the.md` + `roadmap.md` thành 1 file.
- Loại bỏ danh sách kỹ năng lặp trong `assets-design-spec/ky-nang.md` (chỉ giữ VFX spec).
- Loại bỏ danh sách quái lặp trong `assets-design-spec/quai-vat.md` (chỉ giữ visual spec).

**Ưu điểm:** Thay đổi vừa phải, ít rủi ro, nhanh chóng.
**Nhược điểm:** Không triệt để xử lý tất cả vấn đề lặp.

## Recommendation

**Đề xuất: Option 4 (Kế hoạch hợp nhất + Hệ thống giữ nguyên)** kết hợp với một số cải tiến từ Option 2.

**Lý do:**

1. **Ít rủi ro nhất:** Thay đổi tập trung vào vùng lặp nhiều nhất (`plan-timelines`).
2. **Nhanh thực hiện:** Có thể hoàn thành trong 1-2 ngày.
3. **Phù hợp workflow:** Dev, Artist, Sound vẫn có section riêng trong file kế hoạch hợp nhất.
4. **Dễ bảo trì:** Một file kế hoạch dễ cập nhật hơn 7 file rải rác.

**Hành động cụ thể:**

1. **Merge plan-timelines:**
   - Tạo file mới `ke-hoach-san-xuat.md` gôm: `tong-quan.md`, `developer.md`, `artist.md`, `vfx.md`, `sound.md`, `game-designer.md`.
   - Giữ `quan-ly-du-an.md` riêng vì nó về quy trình quản lý, không phải task list.

2. **Merge roadmap vào kế hoạch tổng thể:**
   - Merge nội dung `roadmap.md` vào `ke-hoach-tong-the.md`.

3. **Dọn dẹp assets-design-spec:**
   - Trong `assets-design-spec/ky-nang.md`: Bỏ bảng danh sách 20 kỹ năng (đã có trong `he-thong-ky-nang.md`), chỉ giữ VFX/SFX specs và reference đến file gốc.
   - Tương tự cho `quai-vat.md`, `nhan-vat.md`, `trang-bi.md`.

4. **Cập nhật sidebars.ts** theo cấu trúc mới.

5. **Cập nhật intro.md** với hướng dẫn mới.

## Acceptance criteria

- [ ] Số lượng file giảm từ ~47 xuống còn ~35-40.
- [ ] Không còn danh sách kỹ năng/quái vật lặp lại ở nhiều file.
- [ ] Timeline và task breakdown nằm trong 1-2 file thay vì 7 file.
- [ ] Sidebar Docusaurus hoạt động đúng, không có link hỏng.
- [ ] Không mất thông tin nào so với phiên bản cũ.
- [ ] Team dev có thể tìm thông tin nhanh như trước hoặc nhanh hơn.
- [ ] Build Docusaurus (`npm run build`) thành công không lỗi.
