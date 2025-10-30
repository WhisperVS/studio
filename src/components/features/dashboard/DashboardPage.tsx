"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { type Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { APP_CONFIG } from "@/lib/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";
import { type ColumnVisibility, type DashboardFilters } from "./types";

export default function DashboardPage() {
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
      console.error('Error in filteredAssets:', err);
      return [];
    }
  }, [assets, searchQuery, filters]);

  // Export functionality
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
    
    const columns = [
      { label: 'Product Family', key: 'category' },
      { label: 'Status', key: 'status' },
      { label: 'Machine Name', key: 'machineName' },
      { label: 'Manufacturer', key: 'manufacturer' },
      { label: 'Part Number', key: 'partNumber' },
      { label: 'Model Number', key: 'modelNumber' },
      { label: 'Serial Number', key: 'serialNumber' },
      { label: 'Type', key: 'type' },
      { label: 'OS', key: 'os' },
      { label: 'Assigned User', key: 'assignedUser' },
      { label: 'User ID', key: 'userId' },
      { label: 'User Type', key: 'userType' },
      { label: 'Location', key: 'location' },
      { label: 'Owner', key: 'owner' },
      { label: 'Purchase Date', key: 'purchaseDate' },
      { label: 'Warranty Expiration Date', key: 'warrantyExpirationDate' },
      { label: 'Created By', key: 'createdBy' },
      { label: 'Updated By', key: 'updatedBy' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' },
    ] as const;

    const csvContent = [
      columns.map(c => c.label).join(','),
      ...assetsToExport.map(row =>
        columns.map(col => {
          const key = col.key as keyof Asset;
          let value = row[key];

          if (value === null || value === undefined) {
            return '';
          }

          if (['purchaseDate', 'warrantyExpirationDate', 'createdAt', 'updatedAt'].includes(col.key) && value) {
            value = format(new Date(value), 'MM/dd/yyyy');
          }

          const stringValue = String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `gaim_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${assetsToExport.length} asset(s) have been exported as a CSV file.`
    })
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedAssetIds.length === 0) return;

    try {
      const response = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedAssetIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete selected assets');
      }

      toast({
        title: "Assets Deleted",
        description: `${selectedAssetIds.length} asset(s) have been removed.`,
      });
      setSelectedAssetIds([]);
      fetchAssets();
    } catch (error) {
      console.error("Failed to delete assets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the selected assets.",
      });
    } finally {
      setIsBulkDeleteAlertOpen(false);
    }
  };

  // Asset handlers
  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditAssetOpen(true);
  };

  const handleInfo = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsAssetOpen(true);
  };
  
  const handleSelectAllOnPage = () => {
    const pageAssetIds = filteredAssets.map(a => a.id);
    setSelectedAssetIds(pageAssetIds);
  };

  // Props for child components
  const dashboardProps = {
    // State
    assets,
    filteredAssets,
    selectedAsset,
    selectedAssetIds,
    searchQuery,
    filters,
    columnVisibility,
    tempColumnVisibility,
    categoryCounts,
    
    // Loading states
    isLoading,
    isClient,
    isAddAssetOpen,
    isEditAssetOpen,
    isDetailsAssetOpen,
    isViewDropdownOpen,
    isBulkDeleteAlertOpen,
    
    // Handlers
    setAddAssetOpen,
    setEditAssetOpen,
    setDetailsAssetOpen,
    setSelectedAsset,
    setSelectedAssetIds,
    setSearchQuery,
    setFilters,
    setColumnVisibility,
    setTempColumnVisibility,
    setIsViewDropdownOpen,
    setIsBulkDeleteAlertOpen,
    
    // Actions
    handleFilterChange,
    handleClearFilters,
    handleExport,
    handleBulkDelete,
    handleEdit,
    handleInfo,
    handleSelectAllOnPage,
    handleApplyColumnVisibility,
    handleCancelColumnVisibility,
    fetchAssets,
  };

  // Render appropriate component based on screen size
  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isMobile ? (
    <MobileDashboard {...dashboardProps} />
  ) : (
    <DesktopDashboard {...dashboardProps} />
  );
}
