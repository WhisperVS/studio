# Theme Base CSS - Structure Guide

## 📁 File Location

`/src/styles/themes/theme-base.css`

## 📖 Table of Contents

### 1. Global Styles & Browser Resets (Lines ~1-40)

- Scrollbar visibility settings
- Focus ring styles
- Touch device optimizations

### 2. CSS Variables & Design Tokens (Lines ~41-55)

- `--radius-sm` (12px): Buttons, inputs, badges
- `--radius-md` (16px): Cards, panels
- `--radius-lg` (20px): Modals, containers
- `--radius-round` (50%): Avatars, icons
- `--radius` (0.75rem): Tailwind compatibility

### 3. Base Components

#### 3.1 Buttons (Lines ~56-210)

- **Base styles**: `button`, `.btn`, `[role="button"]`
- **States**: `:disabled`, `:focus-visible`
- **Sizes**: `.btn-sm`, `.btn-lg`
- **Variants**: `.btn-icon`
- **Themes**: `.btn-primary`, `.btn-outline`, `.btn-destructive`
- **Groups**: `.btn-group`
- **Loading**: `.btn-loading`

#### 3.2 Forms & Inputs (Lines ~211-310)

- **Base inputs**: `input`, `select`, `textarea`
- **Search input**: `.search-input`, `.search-container`, `.search-icon`
- **Clear button**: `.search-clear-btn`
- **Toggle switches**: `.toggle-switch`

#### 3.3 Dropdowns & Selects (Lines ~311-420)

- **Dropdown buttons**: `button[role="combobox"]`, `.dropdown-trigger`
- **Dropdown content**: `.dropdown-content`, `[data-radix-select-content]`
- **Dropdown items**: `[data-radix-select-item]`, `.dropdown-item`
- **Select trigger**: `[data-radix-select-trigger]`

### 4. Layout Components

#### 4.1 Sidebar (Lines ~421-640)

- **Structure**: `[data-sidebar="sidebar"]`, `[data-sidebar="content"]`, `[data-sidebar="footer"]`
- **Navigation**: `.sidebar-nav`
- **Active states**: `[data-sidebar="menu-button"][data-active="true"]`
- **Groups**: `.sidebar-group`, `.sidebar-menu`
- **Collapsed**: `[data-collapsible="icon"]`

#### 4.2 Tables (Lines ~641-720)

- **Table base**: `.asset-table`, `table`
- **Headers**: `.table-header-bg`, `.static-header-row`
- **Cells**: `th`, `td`
- **Borders**: `.table-border-r`, `.table-border-b`
- **Container**: `.table-container`

#### 4.3 Search & Filters (Lines ~721-810)

- **Top controls**: `.top-controls`
- **Search container**: `.search-container`
- **Filter chips**: `.filter-chip`

### 5. UI Elements

#### 5.1 Badges & Status (Lines ~811-835)

- `.badge`
- `.status-badge`

#### 5.2 Theme Toggle (Lines ~836-920)

- `.theme-toggle`, `.theme-toggle-btn`
- `.theme-toggle-sun-icon`, `.theme-toggle-moon-icon`
- `.theme-toggle-container`

#### 5.3 Cards & Panels (Lines ~921-970)

- `.card`, `.panel`
- `.dashboard-page`
- `.stats-card`, `.stats-value`, `.stats-label`

#### 5.4 Action Menus (Lines ~971-985)

- `.action-menu-item`

#### 5.5 Scrollbars (Lines ~986-1020)

- `.scrollbar-neon`
- `::-webkit-scrollbar` styling

### 6. Platform-Specific Overrides (Lines ~1021-1090)

- **macOS**: `.platform-macos`
- **Windows**: `.platform-windows`
- **Browser-specific**: `@supports` queries
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)`

### 7. Layout & Viewport (Lines ~1091-1100)

- `.main-layout`

---

## 🎯 Quick Find Guide

### Need to change button styles?

→ **Section 3.1 Buttons** (Lines ~56-210)

### Need to modify search bar?

→ **Section 3.2 Forms & Inputs** (Lines ~211-310)

### Need to adjust dropdown menus?

→ **Section 3.3 Dropdowns & Selects** (Lines ~311-420)

### Need to change sidebar appearance?

→ **Section 4.1 Sidebar** (Lines ~421-640)

### Need to modify tables?

→ **Section 4.2 Tables** (Lines ~641-720)

### Need to adjust theme toggle?

→ **Section 5.2 Theme Toggle** (Lines ~836-920)

### Need to fix platform-specific issues?

→ **Section 6 Platform-Specific** (Lines ~1021-1090)

---

## 🔧 Common Tasks

### Add a new button variant

1. Go to Section 3.1 Buttons (~Line 150)
2. Add your class after existing button theme variants
3. Follow the pattern of `.btn-primary`, `.btn-outline`, etc.

### Modify border radius

1. Go to Section 2 CSS Variables (~Line 45)
2. Update the `--radius-*` variables

### Change scrollbar appearance

1. Go to Section 5.5 Scrollbars (~Line 986)
2. Modify `.scrollbar-neon` styles

### Add sidebar styling

1. Go to Section 4.1 Sidebar (~Line 421)
2. Add your styles near related sidebar components

---

## ✅ Benefits of This Structure

1. **Clear organization** - Easy to find components by category
2. **Logical grouping** - Related styles are together
3. **Numbered sections** - Quick navigation via line numbers
4. **Table of contents** - Overview at the top of file
5. **No redundancy** - Removed duplicate/orphaned styles
6. **Clean comments** - Descriptive section headers
7. **Maintainable** - Future changes are easier to locate

---

## 📝 Notes

- **Backup available**: `theme-base-OLD-BACKUP.css` contains the previous version
- **No hover effects**: All hover, active, and transition effects have been removed
- **No liquid glass**: All pseudo-element effects have been removed
- **Color variables**: Actual colors are defined in `light-theme.css` and `dark-theme.css`
