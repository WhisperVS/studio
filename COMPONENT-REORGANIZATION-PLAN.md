# Component Reorganization Plan

## 📂 Current Structure Issues

- All feature components mixed together in `/components`
- No clear separation between features, layouts, and utilities
- UI components are properly organized in `/ui` but lack documentation
- Provider components scattered
- No clear naming conventions

## 🎯 Proposed New Structure

```
src/components/
├── README.md                          # Component documentation & guidelines
│
├── features/                          # Feature-specific components
│   ├── assets/                        # Asset management features
│   │   ├── AssetTable.tsx            # Main asset table
│   │   ├── AssetDetailsDialog.tsx    # View asset details
│   │   ├── AddAssetDialog.tsx        # Create new asset
│   │   ├── EditAssetDialog.tsx       # Edit existing asset
│   │   └── index.ts                  # Export barrel
│   │
│   ├── dashboard/                     # Dashboard features
│   │   ├── DashboardPage.tsx         # Main dashboard
│   │   ├── CategoryCounts.tsx        # Category statistics
│   │   └── index.ts
│   │
│   └── theme/                         # Theme-related features
│       ├── ThemeToggle.tsx           # Full theme toggle
│       ├── SimpleThemeToggle.tsx     # Minimal theme toggle
│       └── index.ts
│
├── layout/                            # Layout components
│   ├── Logo.tsx                      # App logo
│   └── index.ts
│
├── providers/                         # Context providers
│   ├── Providers.tsx                 # Root provider wrapper
│   ├── ThemeProvider.tsx             # Theme context
│   ├── PlatformProvider.tsx          # Platform detection
│   ├── UserProvider.tsx              # User context
│   └── index.ts
│
└── ui/                                # Reusable UI primitives (shadcn/ui)
    ├── accordion.tsx
    ├── alert-dialog.tsx
    ├── alert.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── collapsible.tsx
    ├── combobox.tsx
    ├── command.tsx
    ├── datepicker.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── error-boundary.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── menubar.tsx
    ├── popover.tsx
    ├── progress.tsx
    ├── radio-group.tsx
    ├── scroll-area.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── sidebar.tsx
    ├── skeleton.tsx
    ├── slider.tsx
    ├── slot-fallback.tsx
    ├── switch.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    ├── toast.tsx
    ├── toaster.tsx
    ├── tooltip.tsx
    └── index.ts                       # Export all UI components
```

## 📋 Benefits

### 1. Clear Feature Boundaries

- **Asset management** components grouped together
- **Dashboard** components in their own space
- **Theme** components isolated

### 2. Better Import Paths

```typescript
// Before
import { AssetTable } from "@/components/asset-table";
import { AddAssetDialog } from "@/components/add-asset-dialog";
import { EditAssetDialog } from "@/components/edit-asset-dialog";

// After
import {
  AssetTable,
  AddAssetDialog,
  EditAssetDialog,
} from "@/components/features/assets";
```

### 3. Easier Navigation

- Developers know where to find components
- Related components are co-located
- Consistent naming conventions

### 4. Scalability

- Easy to add new feature folders
- Each feature can have its own tests, hooks, types
- Clear boundaries prevent cross-contamination

## 🔄 Migration Steps

1. Create new folder structure
2. Move files to appropriate locations
3. Update import paths
4. Create barrel exports (index.ts files)
5. Update documentation
6. Test all imports

## 📝 Naming Conventions

### Component Files

- **PascalCase** for files: `AssetTable.tsx`, `DashboardPage.tsx`
- Match component name exactly
- One component per file

### Folders

- **lowercase** for feature folders: `assets/`, `dashboard/`, `theme/`
- Plural names for collections: `features/`, `providers/`
- Singular for single-purpose: `layout/`

### Barrel Exports

- Each feature folder gets an `index.ts`
- Export all public components
- Hide internal/private components

## 🎨 Future Enhancements

### Could add later:

```
src/components/
├── hooks/                    # Shared component hooks
│   ├── useAssetForm.ts
│   └── useTableSelection.ts
│
├── types/                    # Shared component types
│   ├── asset.types.ts
│   └── dialog.types.ts
│
└── utils/                    # Component utilities
    ├── formatters.ts
    └── validators.ts
```

## ✅ Implementation Checklist

- [ ] Create new folder structure
- [ ] Move asset-related components
- [ ] Move dashboard components
- [ ] Move theme components
- [ ] Move layout components
- [ ] Move provider components
- [ ] Create barrel exports
- [ ] Update all imports
- [ ] Create component README
- [ ] Test the application
- [ ] Remove old files
