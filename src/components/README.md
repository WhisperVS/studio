# Components Directory

This directory contains all React components for the GAIM Studio application, organized by feature and purpose.

## 📁 Directory Structure

```
components/
├── features/          # Feature-specific components
│   ├── assets/       # Asset management features
│   ├── dashboard/    # Dashboard features
│   └── theme/        # Theme-related features
├── layout/           # Layout components (Logo, etc.)
├── providers/        # Context providers
└── ui/               # Reusable UI primitives (shadcn/ui)
```

## 📦 Feature Components

### Assets (`features/assets/`)

Asset management functionality including tables, dialogs, and forms.

**Components:**

- `AssetTable` - Main data table for displaying assets
- `AssetDetailsDialog` - View detailed asset information
- `AddAssetDialog` - Create new assets
- `EditAssetDialog` - Edit existing assets

**Usage:**

```typescript
import { AssetTable, AddAssetDialog } from "@/components/features/assets";

function MyPage() {
  return (
    <>
      <AssetTable assets={assets} onEdit={handleEdit} />
      <AddAssetDialog isOpen={isOpen} onAssetAdded={handleAdd} />
    </>
  );
}
```

### Dashboard (`features/dashboard/`)

Dashboard page and related statistics components.

**Components:**

- `DashboardPage` - Main dashboard layout
- `CategoryCounts` - Display category statistics

**Usage:**

```typescript
import { DashboardPage } from "@/components/features/dashboard";

// DashboardPage is a complete page component
<DashboardPage />;
```

### Theme (`features/theme/`)

Theme switching and customization components.

**Components:**

- `ThemeToggle` - Full-featured theme toggle button
- `SimpleThemeToggle` - Minimal theme toggle

**Usage:**

```typescript
import { ThemeToggle } from "@/components/features/theme";

<ThemeToggle />;
```

## 🏗️ Layout Components (`layout/`)

Structural layout components used across the application.

**Components:**

- `Logo` - Application logo component

**Usage:**

```typescript
import { Logo } from "@/components/layout";

<Logo />;
```

## 🔌 Providers (`providers/`)

React Context providers for global state management.

**Components:**

- `Providers` - Root provider wrapper (combines all providers)
- `ThemeProvider` - Theme context and management
- `PlatformProvider` - Platform detection (macOS, Windows, etc.)
- `UserProvider` - User context and authentication

**Usage:**

```typescript
import { Providers } from "@/components/providers";

// In your root layout:
<Providers>
  <App />
</Providers>;
```

**Individual Providers:**

```typescript
import { ThemeProvider, useTheme } from "@/components/providers";

// Use the theme hook
function MyComponent() {
  const { theme, setTheme } = useTheme();

  return <button onClick={() => setTheme("dark")}>Dark Mode</button>;
}
```

## 🎨 UI Components (`ui/`)

Reusable UI primitives built with Radix UI and styled with Tailwind CSS.
These are base components from shadcn/ui that can be composed into features.

### Form Controls

- `button` - Button component with variants
- `input` - Text input field
- `textarea` - Multi-line text input
- `select` - Dropdown select
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `switch` - Toggle switch
- `slider` - Range slider
- `combobox` - Searchable select
- `datepicker` - Date selection
- `calendar` - Calendar widget
- `form` - Form wrapper with validation

### Layout & Navigation

- `sidebar` - Sidebar navigation
- `tabs` - Tabbed navigation
- `menubar` - Menu bar
- `dropdown-menu` - Dropdown menu
- `command` - Command palette
- `scroll-area` - Custom scrollbar area
- `separator` - Visual separator

### Feedback & Overlays

- `dialog` - Modal dialog
- `alert-dialog` - Confirmation dialog
- `sheet` - Side panel
- `popover` - Floating popover
- `tooltip` - Hover tooltip
- `alert` - Alert message
- `toast` / `toaster` - Toast notifications
- `progress` - Progress indicator
- `skeleton` - Loading skeleton

### Display

- `card` - Card container
- `badge` - Label badge
- `avatar` - User avatar
- `table` - Data table
- `accordion` - Collapsible sections
- `collapsible` - Collapsible content

### Utilities

- `error-boundary` - Error catching wrapper
- `label` - Form label
- `slot-fallback` - Fallback component

**Usage:**

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

<Dialog>
  <Input placeholder="Enter name" />
  <Button>Submit</Button>
</Dialog>;
```

## 📝 Component Guidelines

### Naming Conventions

**Files:**

- PascalCase for component files: `AssetTable.tsx`, `ThemeToggle.tsx`
- Match the component name exactly
- One component per file

**Folders:**

- lowercase for folders: `assets/`, `dashboard/`, `theme/`
- Plural for collections: `features/`, `providers/`
- Singular for specific purpose: `layout/`

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

### Import Patterns

```typescript
// ✅ GOOD: Use barrel exports
import { AssetTable, AddAssetDialog } from "@/components/features/assets";
import { ThemeToggle } from "@/components/features/theme";
import { Button, Dialog } from "@/components/ui";

// ❌ AVOID: Direct file imports (except for ui components)
import { AssetTable } from "@/components/features/assets/AssetTable";
```

### File Organization

Each feature folder should have:

```
features/my-feature/
├── MyMainComponent.tsx        # Main feature component
├── MyDialog.tsx               # Related dialog
├── MyForm.tsx                 # Related form
├── index.ts                   # Barrel export
└── README.md                  # (Optional) Feature docs
```

## 🔄 Adding New Components

### 1. Determine Component Type

**Is it feature-specific?** → `features/[feature-name]/`
**Is it a UI primitive?** → `ui/`
**Is it a layout component?** → `layout/`
**Is it a context provider?** → `providers/`

### 2. Create the Component

```bash
# Example: Adding a new asset filter component
cd src/components/features/assets
touch AssetFilter.tsx
```

### 3. Add to Barrel Export

Update `features/assets/index.ts`:

```typescript
export { AssetFilter } from "./AssetFilter";
```

### 4. Document Usage

Add usage example to this README or create feature-specific README.

## 🧪 Testing

Components should be tested with:

- Unit tests for logic
- Integration tests for user flows
- Visual regression tests for UI

```typescript
// Example test structure
describe("AssetTable", () => {
  it("renders assets correctly", () => {
    // Test implementation
  });

  it("handles selection changes", () => {
    // Test implementation
  });
});
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

When adding or modifying components:

1. Follow the naming conventions
2. Update barrel exports
3. Add TypeScript types
4. Document props and usage
5. Keep components focused and single-purpose
6. Update this README if needed
