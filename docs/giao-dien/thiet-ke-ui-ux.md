# Thiết kế UI/UX

## Nguyên tắc thiết kế

### Tính chuyên nghiệp
- Giao diện nghiêm túc, phù hợp với môi trường giáo dục
- Bố cục rõ ràng, có tổ chức
- Tránh các yếu tố giải trí, phân tâm
- Thể hiện sự đáng tin cậy và uy tín

### Tính dễ sử dụng
- Luồng thao tác đơn giản, trực quan
- Giảm thiểu số bước để hoàn thành tác vụ
- Phản hồi rõ ràng cho mọi hành động
- Hỗ trợ phím tắt cho người dùng thành thạo
- Tìm kiếm nhanh và lọc dữ liệu hiệu quả

### Tính nhất quán
- Sử dụng các pattern UI đồng nhất
- Vị trí các thành phần cố định
- Ngôn ngữ và thuật ngữ thống nhất
- Hành vi tương tác có thể dự đoán

## Color Scheme

### Màu chủ đạo
```
Primary (Xanh thư viện):
- Main: #1E3A8A (Blue 900)
- Light: #3B82F6 (Blue 500)
- Dark: #1E40AF (Blue 800)

Secondary (Xanh lá tri thức):
- Main: #059669 (Emerald 600)
- Light: #10B981 (Emerald 500)
- Dark: #047857 (Emerald 700)

Neutral (Nền và văn bản):
- Background: #FFFFFF
- Surface: #F9FAFB (Gray 50)
- Border: #E5E7EB (Gray 200)
- Text Primary: #111827 (Gray 900)
- Text Secondary: #6B7280 (Gray 500)
```

### Màu trạng thái
```
Success: #10B981 (Green 500)
Warning: #F59E0B (Amber 500)
Error: #EF4444 (Red 500)
Info: #3B82F6 (Blue 500)
```

### Màu theo vai trò
```
Admin: #7C3AED (Purple 600)
Thủ thư: #1E3A8A (Blue 900)
Giáo viên: #059669 (Emerald 600)
Học sinh: #2563EB (Blue 600)
```

## Typography

### Font chữ
```
Primary Font: 'Inter', sans-serif
- Hiện đại, dễ đọc
- Hỗ trợ tiếng Việt tốt
- Web font từ Google Fonts

Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
          'Roboto', 'Helvetica Neue', Arial, sans-serif

Monospace (cho code/ID): 'JetBrains Mono', 'Courier New', monospace
```

### Kích thước
```
Heading 1: 32px / 2rem (font-weight: 700)
Heading 2: 24px / 1.5rem (font-weight: 600)
Heading 3: 20px / 1.25rem (font-weight: 600)
Heading 4: 18px / 1.125rem (font-weight: 600)
Body Large: 16px / 1rem (font-weight: 400)
Body: 14px / 0.875rem (font-weight: 400)
Body Small: 12px / 0.75rem (font-weight: 400)
Caption: 11px / 0.6875rem (font-weight: 400)
```

### Line height
```
Headings: 1.2
Body: 1.5
Dense (tables): 1.4
```

## Layout

### Cấu trúc tổng thể
```
┌─────────────────────────────────────────────┐
│ Header (64px)                               │
│ Logo | Search | Notifications | User        │
├──────┬──────────────────────────────────────┤
│      │                                      │
│ Side │ Main Content Area                    │
│ bar  │                                      │
│      │                                      │
│ 240px│                                      │
│      │                                      │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

### Header
- Chiều cao cố định: 64px
- Logo thư viện (trái)
- Thanh tìm kiếm toàn cục (giữa)
- Thông báo, avatar người dùng (phải)
- Sticky khi scroll

### Sidebar Navigation
- Chiều rộng: 240px (có thể thu gọn về 64px)
- Menu theo vai trò
- Icon + Label
- Highlight menu đang active
- Collapsible submenu
- Fixed position

### Main Content Area
- Padding: 24px
- Max-width: 1440px (centered)
- Background: #F9FAFB
- Breadcrumb navigation
- Page title + actions

### Grid System
- 12 columns
- Gutter: 24px
- Breakpoints:
  - Desktop: 1280px+
  - Laptop: 1024px - 1279px
  - Tablet: 768px - 1023px
  - Mobile: < 768px

## Components

### Buttons

#### Primary Button
```
Background: #1E3A8A
Color: #FFFFFF
Padding: 10px 20px
Border-radius: 6px
Font-weight: 500
Height: 40px

Hover: Background #1E40AF
Active: Background #1E3A8A + scale(0.98)
Disabled: Background #E5E7EB, Color #9CA3AF
```

#### Secondary Button
```
Background: #FFFFFF
Color: #1E3A8A
Border: 1px solid #1E3A8A
Padding: 10px 20px
Border-radius: 6px

Hover: Background #F3F4F6
```

#### Ghost Button
```
Background: transparent
Color: #1E3A8A
Padding: 10px 20px

Hover: Background #F3F4F6
```

#### Icon Button
```
Size: 40x40px
Border-radius: 6px
Icon: 20x20px

Hover: Background #F3F4F6
```

### Forms

#### Input Field
```
Height: 40px
Padding: 10px 12px
Border: 1px solid #D1D5DB
Border-radius: 6px
Font-size: 14px

Focus: Border #1E3A8A, Box-shadow 0 0 0 3px rgba(30,58,138,0.1)
Error: Border #EF4444
Disabled: Background #F3F4F6
```

#### Label
```
Font-size: 14px
Font-weight: 500
Color: #374151
Margin-bottom: 6px
```

#### Helper Text
```
Font-size: 12px
Color: #6B7280
Margin-top: 4px
```

#### Error Message
```
Font-size: 12px
Color: #EF4444
Margin-top: 4px
Icon: Alert circle
```

#### Select Dropdown
```
Height: 40px
Chevron icon (right)
Max-height dropdown: 300px
Search trong dropdown cho nhiều options
```

#### Checkbox / Radio
```
Size: 20x20px
Border: 2px solid #D1D5DB
Border-radius: 4px (checkbox) / 50% (radio)
Checked: Background #1E3A8A, Checkmark white
```

#### Date Picker
```
Calendar popup
Quick selections: Hôm nay, Tuần này, Tháng này
Range selection support
```

### Tables

#### Structure
```
Header: Background #F9FAFB, Font-weight 600
Row height: 56px
Border: 1px solid #E5E7EB (horizontal only)
Hover: Background #F9FAFB
Selected: Background #EFF6FF
```

#### Features
- Sortable columns (icon indicator)
- Resizable columns
- Fixed header khi scroll
- Pagination (10, 25, 50, 100 rows)
- Bulk actions (checkbox column)
- Row actions (menu icon)
- Empty state với illustration

#### Responsive
- Horizontal scroll trên mobile
- Card view option cho mobile

### Cards

#### Standard Card
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 8px
Padding: 20px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover: Box-shadow 0 4px 6px rgba(0,0,0,0.1)
```

#### Stat Card
```
Icon (top-left, colored background)
Value (large, bold)
Label (small, gray)
Change indicator (+/- percentage)
```

### Modals

#### Structure
```
Overlay: rgba(0,0,0,0.5)
Container: Background #FFFFFF
Max-width: 600px (small), 800px (medium), 1000px (large)
Border-radius: 12px
Padding: 24px
Box-shadow: 0 20px 25px rgba(0,0,0,0.15)
```

#### Header
```
Title (H3)
Close button (top-right)
Border-bottom: 1px solid #E5E7EB
```

#### Footer
```
Actions (right-aligned)
Cancel + Primary action
Border-top: 1px solid #E5E7EB
```

### Notifications

#### Toast
```
Position: Top-right
Width: 360px
Padding: 16px
Border-radius: 8px
Box-shadow: 0 10px 15px rgba(0,0,0,0.1)
Auto-dismiss: 5s (configurable)

Success: Border-left 4px solid #10B981
Error: Border-left 4px solid #EF4444
Warning: Border-left 4px solid #F59E0B
Info: Border-left 4px solid #3B82F6
```

#### Badge
```
Height: 20px
Padding: 0 8px
Border-radius: 10px
Font-size: 11px
Font-weight: 600
```

### Loading States

#### Spinner
```
Size: 20px (small), 32px (medium), 48px (large)
Color: #1E3A8A
Animation: Rotate 1s linear infinite
```

#### Skeleton
```
Background: Linear gradient animation
Border-radius: Match component
Pulse effect
```

#### Progress Bar
```
Height: 8px
Border-radius: 4px
Background: #E5E7EB
Fill: #1E3A8A
Animated stripe (optional)
```

## Responsive Design

### Desktop First
- Thiết kế chính cho màn hình desktop (1280px+)
- Tối ưu cho laptop (1024px+)
- Hỗ trợ tablet và mobile (optional)

### Breakpoints
```css
/* Desktop Large */
@media (min-width: 1440px) {
  /* Max content width, larger spacing */
}

/* Desktop */
@media (min-width: 1280px) {
  /* Standard layout */
}

/* Laptop */
@media (min-width: 1024px) and (max-width: 1279px) {
  /* Slightly condensed */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Sidebar collapsible, adjusted grid */
}

/* Mobile */
@media (max-width: 767px) {
  /* Bottom navigation, stacked layout */
}
```

### Adaptive Components
- Sidebar: Full → Collapsed → Hidden (mobile menu)
- Tables: Full → Horizontal scroll → Card view
- Forms: 2 columns → 1 column
- Modals: Full width on mobile
- Font sizes: Slightly smaller on mobile

## Accessibility (WCAG 2.1 AA)

### Contrast Ratios
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

### Keyboard Navigation
- Tab order logical
- Focus indicators visible (outline)
- Skip to main content link
- Escape to close modals
- Arrow keys for dropdowns/menus

### Screen Readers
- Semantic HTML (header, nav, main, aside)
- ARIA labels cho icons
- ARIA live regions cho notifications
- Alt text cho images
- Form labels properly associated

### Focus Management
- Focus trap trong modals
- Focus return sau khi đóng modal
- Focus visible state: 2px solid #1E3A8A, offset 2px

### Error Handling
- Error messages announced
- Required fields marked
- Validation on blur and submit
- Clear error recovery instructions

## Dark Mode Support

### Color Palette
```
Dark Background: #111827 (Gray 900)
Dark Surface: #1F2937 (Gray 800)
Dark Border: #374151 (Gray 700)
Dark Text Primary: #F9FAFB (Gray 50)
Dark Text Secondary: #D1D5DB (Gray 300)

Primary: #3B82F6 (brighter blue)
Secondary: #10B981 (brighter green)
```

### Implementation
- CSS custom properties
- Toggle trong user settings
- Persist preference (localStorage)
- System preference detection (prefers-color-scheme)
- Smooth transition between modes

### Adjustments
- Reduce box-shadows intensity
- Adjust image brightness/contrast
- Invert icons if needed
- Maintain contrast ratios

## Animation & Transitions

### Principles
- Subtle and purposeful
- Enhance usability, not distract
- Consistent timing
- Respect prefers-reduced-motion

### Timing
```
Fast: 150ms (hover, focus)
Medium: 250ms (dropdown, tooltip)
Slow: 350ms (modal, drawer)
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Animations
- Fade in/out: opacity
- Slide in: transform translateY
- Scale: transform scale (buttons)
- Skeleton pulse: background-position
- Loading spinner: rotate

## Icons

### Icon Library
- Heroicons (recommended)
- Lucide Icons (alternative)
- Consistent stroke-width: 2px
- Sizes: 16px, 20px, 24px

### Usage
- Always with accessible label
- Consistent meaning across app
- Color matches text color
- Hover state for interactive icons

## Spacing System

### Scale (8px base)
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Application
- Component padding: md (16px)
- Section spacing: lg (24px)
- Page margins: xl (32px)
- Element gaps: sm (8px)

## Elevation (Box Shadows)

```
Level 1: 0 1px 3px rgba(0,0,0,0.1)
Level 2: 0 4px 6px rgba(0,0,0,0.1)
Level 3: 0 10px 15px rgba(0,0,0,0.1)
Level 4: 0 20px 25px rgba(0,0,0,0.15)
```

Usage:
- Cards: Level 1
- Dropdowns: Level 2
- Modals: Level 4
- Floating buttons: Level 3
