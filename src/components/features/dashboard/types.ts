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
  
  // Handlers
  setAddAssetOpen: (open: boolean) => void;
  setEditAssetOpen: (open: boolean) => void;
  setDetailsAssetOpen: (open: boolean) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setSelectedAssetIds: (ids: string[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: DashboardFilters) => void;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  setTempColumnVisibility: (visibility: ColumnVisibility) => void;
  setIsViewDropdownOpen: (open: boolean) => void;
  setIsBulkDeleteAlertOpen: (open: boolean) => void;
  
  // Actions
  handleFilterChange: (filterName: keyof DashboardFilters) => (value: string) => void;
  handleClearFilters: () => void;
  handleExport: (selectedOnly?: boolean) => void;
  handleBulkDelete: () => Promise<void>;
  handleEdit: (asset: Asset) => void;
  handleInfo: (asset: Asset) => void;
  handleSelectAllOnPage: () => void;
  handleApplyColumnVisibility: () => void;
  handleCancelColumnVisibility: () => void;
  fetchAssets: () => Promise<void>;
}