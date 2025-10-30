"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from "@/components/mobile/layouts/MobileDashboard";
import { DesktopDashboard } from "@/components/desktop/layouts/DesktopDashboard";
import { type Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { APP_CONFIG } from "@/lib/config";
import { format } from "date-fns";
import { type ColumnVisibility, type DashboardFilters } from "@/components/features/dashboard/types";

/**
 * Main Dashboard App component that routes to platform-specific implementations
 * This component manages all the dashboard state and passes it to the platform components
 */
export default function DashboardApp() {
  // State management
  const [isAddAssetOpen, setAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setEditAssetOpen] = useState(false);
  const [isDetailsAssetOpen, setDetailsAssetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DashboardFilters>({
    category: 'all',
    status: 'all',
    location: 'all',
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    const initialVisibility: ColumnVisibility = {};
    APP_CONFIG.tableColumns.forEach(col => {
      initialVisibility[col.id] = col.defaultVisible;
    });
    return initialVisibility;
  });
  const [tempColumnVisibility, setTempColumnVisibility] = useState(columnVisibility);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Column visibility management
  useEffect(() => {
    setTempColumnVisibility(columnVisibility);
  }, [isViewDropdownOpen, columnVisibility]);

  const handleApplyColumnVisibility = () => {
    setColumnVisibility(tempColumnVisibility);
    setIsViewDropdownOpen(false);
  };

  const handleCancelColumnVisibility = () => {
    setTempColumnVisibility(columnVisibility);
    setIsViewDropdownOpen(false);
  };

  // Data fetching
  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not fetch asset data."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    return assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [assets]);

  // Filter handlers
  const handleFilterChange = (filterName: keyof DashboardFilters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setSelectedAssetIds([]);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      location: 'all',
    });
    setSelectedAssetIds([]);
  };

  // Asset filtering
  const filteredAssets = useMemo(() => {
    try {
      const q = (searchQuery || '').trim().toLowerCase();

      const matches = assets.filter(asset => {
        try {
          if (!asset || !asset.id) {
            console.warn('Asset missing required properties:', asset);
            return false;
          }

          const searchMatch = !q || Object.values(asset).some(val => {
            try {
              if (val === null || val === undefined) return false;
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                return String(val).toLowerCase().includes(q);
              }
              return JSON.stringify(val).toLowerCase().includes(q);
            } catch (err) {
              return false;
            }
          });

          const categoryMatch = filters.category === 'all' || asset.category === filters.category;
          const statusMatch = filters.status === 'all' || asset.status === filters.status;
          const locationMatch = filters.location === 'all' || asset.location === filters.location;

          return searchMatch && categoryMatch && statusMatch && locationMatch;
        } catch (err) {
          console.warn('Error filtering asset:', asset.id, err);
          return false;
        }
      });

      return matches.sort((a, b) => {
        try {
          return (a.machineName || '').localeCompare(b.machineName || '');
        } catch (err) {
          console.warn('Error sorting assets:', err);
          return 0;
        }
      });
    } catch (err) {
      console.error('Error in asset filtering:', err);
      return [];
    }
  }, [assets, searchQuery, filters]);

  // Asset management handlers
  const handleAssetAdded = () => {
    fetchAssets();
    setAddAssetOpen(false);
  };

  const handleAssetUpdated = () => {
    fetchAssets();
    setEditAssetOpen(false);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditAssetOpen(true);
  };

  const handleInfoAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsAssetOpen(true);
  };

  const handleDeleteAsset = async (asset: Asset) => {
    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      toast({
        title: "Success",
        description: `Asset "${asset.machineName}" has been deleted.`
      });

      fetchAssets();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not delete asset."
      });
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers: (keyof Omit<Asset, 'id'>)[] = [
      'machineName', 'category', 'status', 'assignedUser', 'userId', 'location',
      'manufacturer', 'modelNumber', 'partNumber', 'serialNumber', 'os', 'type',
      'userType', 'owner', 'purchaseDate', 'warrantyExpirationDate', 'notes',
      'createdAt', 'updatedAt'
    ];

    const csvContent = [
      headers.join(','),
      ...assets.map(row =>
        headers.map(header => {
          let value = (row as any)[header];

          if (value === null || value === undefined) {
            return '';
          }

          if (['purchaseDate', 'warrantyExpirationDate', 'createdAt', 'updatedAt'].includes(header) && value) {
            value = format(new Date(value), 'MM/dd/yyyy');
          }

          const stringValue = String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk delete handlers
  const handleBulkDelete = () => {
    if (selectedAssetIds.length === 0) return;
    setIsBulkDeleteAlertOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const promises = selectedAssetIds.map(id =>
        fetch(`/api/assets/${id}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(promises);
      const failures = results.filter(result => result.status === 'rejected').length;

      if (failures > 0) {
        toast({
          variant: 'destructive',
          title: "Partial failure",
          description: `${failures} assets could not be deleted.`
        });
      } else {
        toast({
          title: "Success",
          description: `${selectedAssetIds.length} assets have been deleted.`
        });
      }

      setSelectedAssetIds([]);
      setIsBulkDeleteAlertOpen(false);
      fetchAssets();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not delete selected assets."
      });
    }
  };

  // Select all handler for table
  const handleSelectAllOnPage = () => {
    const pageAssetIds = filteredAssets.map(asset => asset.id);
    if (selectedAssetIds.length === pageAssetIds.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(pageAssetIds);
    }
  };

  // Export handler with selected-only option
  const handleExport = (selectedOnly = false) => {
    const assetsToExport = selectedOnly
      ? assets.filter(asset => selectedAssetIds.includes(asset.id))
      : filteredAssets;

    if (assetsToExport.length === 0) {
      toast({
        variant: 'destructive',
        title: "Export Failed",
        description: selectedOnly ? "No assets selected to export." : "There are no assets to export."
      });
      return;
    }

    const headers: (keyof Omit<Asset, 'id'>)[] = [
      'machineName', 'category', 'status', 'assignedUser', 'userId', 'location',
      'manufacturer', 'modelNumber', 'partNumber', 'serialNumber', 'os', 'type',
      'userType', 'owner', 'purchaseDate', 'warrantyExpirationDate', 'notes',
      'createdAt', 'updatedAt'
    ];

    const csvContent = [
      headers.join(','),
      ...assetsToExport.map(row =>
        headers.map(header => {
          let value = (row as any)[header];

          if (value === null || value === undefined) {
            return '';
          }

          if (['purchaseDate', 'warrantyExpirationDate', 'createdAt', 'updatedAt'].includes(header) && value) {
            value = format(new Date(value), 'MM/dd/yyyy');
          }

          const stringValue = String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = selectedOnly 
      ? `assets_selected_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
      : `assets_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Set selected asset for edit/details
  const setSelectedAssetHandler = (asset: Asset | null) => {
    setSelectedAsset(asset);
  };

  // Set filters handler
  const setFiltersHandler = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  // Set column visibility handler
  const setColumnVisibilityHandler = (visibility: ColumnVisibility) => {
    setColumnVisibility(visibility);
  };

  // Alias handlers for backward compatibility
  const handleEdit = handleEditAsset;
  const handleInfo = handleInfoAsset;
  const fetchAssetsHandler = fetchAssets;

  // Dashboard props to pass to platform components
  const dashboardProps = {
    assets,
    filteredAssets,
    selectedAsset,
    selectedAssetIds,
    searchQuery,
    filters,
    columnVisibility,
    tempColumnVisibility,
    categoryCounts,
    isLoading,
    isClient,
    isAddAssetOpen,
    isEditAssetOpen,
    isDetailsAssetOpen,
    isBulkDeleteAlertOpen,
    isViewDropdownOpen,
    setSearchQuery,
    setSelectedAssetIds,
    setAddAssetOpen,
    setEditAssetOpen,
    setDetailsAssetOpen,
    setIsBulkDeleteAlertOpen,
    setIsViewDropdownOpen,
    setTempColumnVisibility,
    setSelectedAsset: setSelectedAssetHandler,
    setFilters: setFiltersHandler,
    setColumnVisibility: setColumnVisibilityHandler,
    handleFilterChange,
    handleClearFilters,
    handleApplyColumnVisibility,
    handleCancelColumnVisibility,
    handleAssetAdded,
    handleAssetUpdated,
    handleEditAsset,
    handleInfoAsset,
    handleDeleteAsset,
    handleExportCSV,
    handleBulkDelete,
    confirmBulkDelete,
    handleSelectAllOnPage,
    handleExport,
    handleEdit,
    handleInfo,
    fetchAssets: fetchAssetsHandler,
  };

  // Show loading state during initial render to avoid hydration issues
  if (isMobile === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isMobile ? <MobileDashboard {...dashboardProps} /> : <DesktopDashboard {...dashboardProps} />;
}