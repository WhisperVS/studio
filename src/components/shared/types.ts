import { type Asset } from "@/lib/types";

export type ColumnVisibility = Record<string, boolean>;

export interface DashboardFilters {
  category: string;
  status: string;
  location: string;
}

export interface DashboardProps {
  // State
  assets: Asset[];
  filteredAssets: Asset[];
  selectedAsset: Asset | null;
  selectedAssetIds: string[];
  searchQuery: string;
  filters: DashboardFilters;
  columnVisibility: ColumnVisibility;
  tempColumnVisibility: ColumnVisibility;
  categoryCounts: Record<string, number>;
  
  // Loading states
  isLoading: boolean;
  isClient: boolean;
  isAddAssetOpen: boolean;
  isEditAssetOpen: boolean;
  isDetailsAssetOpen: boolean;
  isViewDropdownOpen: boolean;
  isBulkDeleteAlertOpen: boolean;
  
  // Setters
  setSearchQuery: (query: string) => void;
  setSelectedAssetIds: (ids: string[]) => void;
  setAddAssetOpen: (open: boolean) => void;
  setEditAssetOpen: (open: boolean) => void;
  setDetailsAssetOpen: (open: boolean) => void;
  setIsBulkDeleteAlertOpen: (open: boolean) => void;
  setIsViewDropdownOpen: (open: boolean) => void;
  setTempColumnVisibility: (visibility: ColumnVisibility) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setFilters: (filters: DashboardFilters) => void;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  
  // Actions
  handleFilterChange: (filterName: keyof DashboardFilters) => (value: string) => void;
  handleClearFilters: () => void;
  handleApplyColumnVisibility: () => void;
  handleCancelColumnVisibility: () => void;
  handleAssetAdded: () => void;
  handleAssetUpdated: () => void;
  handleEditAsset: (asset: Asset) => void;
  handleInfoAsset: (asset: Asset) => void;
  handleDeleteAsset: (asset: Asset) => Promise<void>;
  handleExportCSV: () => void;
  handleBulkDelete: () => void;
  confirmBulkDelete: () => Promise<void>;
  handleSelectAllOnPage: () => void;
  handleExport: (selectedOnly?: boolean) => void;
  handleEdit: (asset: Asset) => void;
  handleInfo: (asset: Asset) => void;
  fetchAssets: () => Promise<void>;
}

export interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onView: (asset: Asset) => void;
  searchQuery: string;
  filters: {
    category: string;
    status: string;
    location: string;
  };
}

export interface AddAssetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetAdded: () => void;
}

export interface EditAssetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onAssetUpdated: () => void;
}

export interface AssetDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}