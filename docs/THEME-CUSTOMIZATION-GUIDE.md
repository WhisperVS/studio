# Theme Customization Guide

## Overview

Both light and dark themes now have comprehensive CSS variable coverage for **every UI component** in the application. This means you can easily customize any visual element by simply changing the corresponding CSS variable.

## Theme Structure

### Light Theme (`src/styles/themes/light-theme.css`)

- **Primary Colors**: Peachy coral palette with rgb(251, 146, 60) as main accent
- **Background**: Clean white with warm coral undertones
- **Style**: Modern, warm, and inviting coral paradise theme

### Dark Theme (`src/styles/themes/dark-theme.css`)

- **Primary Colors**: Professional dark with purple/blue accents rgb(99, 102, 241)
- **Background**: Deep slate with Discord-style aesthetics
- **Style**: Professional, modern, and sleek dark interface

## Complete UI Component Coverage

### Navigation & Layout

- **Sidebar**: `--sidebar-*` variables for all sidebar elements
- **Header**: `--header-*` variables for top navigation
- **Card**: `--card-*` variables for card containers
- **Sheet**: `--sheet-*` variables for slide-out panels

### Form Controls

- **Button**: `--btn-*` variables for all button variants
- **Input**: Complete input styling variables
- **Textarea**: `--textarea-*` variables for text areas
- **Select**: `--select-*` and dropdown variables
- **Checkbox**: Checkbox styling variables
- **Radio**: `--radio-*` variables for radio groups
- **Switch**: `--switch-*` variables for toggle switches
- **Slider**: `--slider-*` variables for range sliders

### Interactive Components

- **Dropdown**: `--dropdown-*` variables for all dropdown menus
- **Combobox**: `--combobox-*` variables for searchable selects
- **Command**: `--command-*` variables for command palettes
- **MenuBar**: `--menubar-*` variables for menu systems
- **Tabs**: `--tabs-*` variables for tabbed interfaces
- **Accordion**: `--accordion-*` variables for collapsible content
- **Collapsible**: `--collapsible-*` variables for expand/collapse

### Feedback & Status

- **Toast**: `--toast-*` variables for notifications
- **Alert**: `--alert-*` variables for alert messages
- **Badge**: `--badge-*` variables for status indicators
- **Tooltip**: `--tooltip-*` variables for hover help
- **Progress**: `--progress-*` variables for progress bars
- **Skeleton**: `--skeleton-*` variables for loading states

### Utility Components

- **Avatar**: `--avatar-*` variables for user avatars
- **Separator**: `--separator-*` variables for dividers
- **Popover**: `--popover-*` variables for popup content
- **Dialog**: `--dialog-*` variables for modal dialogs
- **Calendar**: `--calendar-*` variables for date pickers
- **Scrollbar**: `--scrollbar-*` variables for custom scrollbars

### Universal Variables

- **Text Colors**: `--text-primary`, `--text-secondary`, etc.
- **Border Colors**: `--border`, `--border-subtle`, etc.
- **Background Colors**: `--background`, `--background-subtle`, etc.
- **Form Labels**: `--form-label-color`, `--form-error-color`, etc.

## How to Customize

### Example 1: Change Primary Color in Light Theme

```css
.light {
  /* Change from coral to blue */
  --page-primary: rgb(59, 130, 246);
  --btn-primary-bg: linear-gradient(
    135deg,
    rgb(59, 130, 246) 0%,
    rgb(37, 99, 235) 100%
  );
  --sidebar-primary: rgb(59, 130, 246);
}
```

### Example 2: Customize Card Appearance

```css
.light {
  --card-bg: rgba(248, 250, 252, 0.95);
  --card-border: rgba(59, 130, 246, 0.3);
  --card-shadow: 0 8px 32px -8px rgba(59, 130, 246, 0.3);
}
```

### Example 3: Modify Button Styles

```css
.dark {
  --btn-primary-bg: linear-gradient(
    135deg,
    rgb(16, 185, 129) 0%,
    rgb(5, 150, 105) 100%
  );
  --btn-primary-hover: linear-gradient(
    135deg,
    rgb(5, 150, 105) 0%,
    rgb(4, 120, 87) 100%
  );
}
```

## Architecture Benefits

### 1. **Easy Maintenance**

- No `!important` declarations
- No complex selectors
- Clean variable organization

### 2. **Complete Coverage**

- Every UI element is customizable
- Consistent theming across all components
- No hardcoded colors anywhere

### 3. **Theme Switching**

- Smooth transitions between themes
- Proper variable scoping (`.light` and `.dark`)
- No theme conflicts or overwrites

### 4. **Developer Friendly**

- Clear variable naming conventions
- Logical grouping by component type
- Easy to find and modify specific elements

## File Organization

```
src/styles/themes/
├── light-theme.css    # Complete light theme variables (~1,800 lines)
└── dark-theme.css     # Complete dark theme variables (~1,700 lines)
```

All CSS files are now clean and maintainable with comprehensive variable coverage for every UI component in the application.
