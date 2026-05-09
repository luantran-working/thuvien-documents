---
title: Sơ đồ thư viện
slug: /giao-dien/so-do-thu-vien
description: Sơ đồ trực quan vị trí kệ sách trong thư viện.
---

# Sơ đồ thư viện

## Tổng quan

Hiển thị sơ đồ trực quan vị trí các kệ sách trong thư viện, giúp dễ dàng tìm kiếm và quản lý.

## Chức năng

### 1. Hiển thị sơ đồ
- Sơ đồ 2D của thư viện
- Các kệ sách được đánh số
- Màu sắc theo tình trạng:
  - **Xanh**: Còn nhiều chỗ (< 50% đầy)
  - **Vàng**: Vừa (50-80% đầy)
  - **Đỏ**: Gần đầy (> 80% đầy)

### 2. Quản lý kệ sách
- Thêm/Xóa/Sửa kệ
- Drag & drop để sắp xếp
- Đặt tên và mô tả kệ
- Gán thể loại sách cho kệ

### 3. Tìm sách trên sơ đồ
- Click vào kệ để xem danh sách sách
- Highlight kệ chứa sách đang tìm
- Hiển thị đường dẫn đến kệ

### 4. In sơ đồ
- In sơ đồ thư viện
- Dán ở cửa vào thư viện

## Database Schema

`sql
CREATE TABLE library_map (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shelves (
  id TEXT PRIMARY KEY,
  map_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  capacity INTEGER DEFAULT 100,
  category_id TEXT,
  FOREIGN KEY (map_id) REFERENCES library_map(id)
);
`

## Giao diện

`
┌─────────────────────────────────────────────────────────────┐
│ Sơ đồ Thư viện                              [Chỉnh sửa] [In]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐                         │
│    │ A1 │  │ A2 │  │ A3 │  │ A4 │  Kệ A: Toán - Lý       │
│    └────┘  └────┘  └────┘  └────┘                         │
│                                                              │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐                         │
│    │ B1 │  │ B2 │  │ B3 │  │ B4 │  Kệ B: Văn - Sử        │
│    └────┘  └────┘  └────┘  └────┘                         │
│                                                              │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐                         │
│    │ C1 │  │ C2 │  │ C3 │  │ C4 │  Kệ C: Ngoại ngữ       │
│    └────┘  └────┘  └────┘  └────┘                         │
│                                                              │
│ Chú thích: ■ Còn trống  ■ Vừa  ■ Gần đầy                  │
└─────────────────────────────────────────────────────────────┘
`

## Tài liệu liên quan

- [Quản lý sách](../chuc-nang/quan-ly-sach.md)
- [Tìm kiếm](../chuc-nang/tim-kiem.md)
