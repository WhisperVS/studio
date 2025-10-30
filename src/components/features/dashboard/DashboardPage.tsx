"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, PlusCircle, Search, Trash2, User, X, Check, Settings2 } from "lucide-react";
import { AssetTable, AddAssetDialog, EditAssetDialog, AssetDetailsDialog } from "@/components/features/assets";
import { ThemeToggle, SimpleThemeToggle } from "@/components/features/theme";
import { Logo } from "@/components/layout";
import { useUser } from "@/components/providers";
import { CategoryCounts } from "./CategoryCounts";
import { type Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_CONFIG } from "@/lib/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/ui/error-boundary";

type ColumnVisibility = Record<string, boolean>;

export default function DashboardPage() {
  const [isAddAssetOpen, setAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setEditAssetOpen] = useState(false);
  const [isDetailsAssetOpen, setDetailsAssetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    location: 'all',
  });
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { currentUser, setCurrentUser } = useUser();

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    const initialVisibility: ColumnVisibility = {};
    APP_CONFIG.tableColumns.forEach(col => {
      initialVisibility[col.id] = col.defaultVisible;
    });
    return initialVisibility;
  });

  const [tempColumnVisibility, setTempColumnVisibility] = useState(columnVisibility);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

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


  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      try {
        const saved = localStorage.getItem(`columnVisibility_${currentUser}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setColumnVisibility(parsed);
          setTempColumnVisibility(parsed);
        } else {
          const initialVisibility: ColumnVisibility = {};
          APP_CONFIG.tableColumns.forEach(col => {
            initialVisibility[col.id] = col.defaultVisible;
          });
          setColumnVisibility(initialVisibility);
          setTempColumnVisibility(initialVisibility);
        }
      } catch (error) {
        console.warn("Failed to read column visibility from localStorage", error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`columnVisibility_${currentUser}`, JSON.stringify(columnVisibility));
      } catch (error) {
        console.warn("Failed to write column visibility to localStorage", error);
      }
    }
  }, [columnVisibility, currentUser]);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  // rowHeights intentionally unused for now


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
      if (isInitialLoad) setIsInitialLoad(false);
    }
  }, [toast, isInitialLoad]);

  useEffect(() => {
    setIsClient(true);
    fetchAssets();
  }, [fetchAssets]);

  const categoryCounts = useMemo(() => {
    return assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [assets]);

  const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Clear selections when filters change to prevent issues with stale IDs
    setSelectedAssetIds([]);
  }

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      location: 'all',
    });
    // Clear selections when clearing filters
    setSelectedAssetIds([]);
  }
  
  const filteredAssets = useMemo(() => {
    try {
      const q = (searchQuery || '').trim().toLowerCase();

      const matches = assets.filter(asset => {
        try {
          // Ensure asset has required properties
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
              // fallback for objects/dates — stringify safely
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

      // safe sort — guard against missing machineName
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
      return []; // Return empty array if filtering fails
    }
  }, [assets, searchQuery, filters]);


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

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditAssetOpen(true);
  }

  const handleInfo = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsAssetOpen(true);
  }
  
  const handleSelectAllOnPage = () => {
    const pageAssetIds = filteredAssets.map(a => a.id);
    setSelectedAssetIds(pageAssetIds);
  }

  return (
    <SidebarProvider>
      <div className="main-layout flex h-screen bg-background overflow-hidden">
        <Sidebar collapsible="icon" className="border-r flex flex-col sidebar-responsive" style={{ height: '100vh', maxHeight: '100vh' }}>
          <SidebarHeader className="flex-shrink-0">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-visible spacing-responsive-sm" style={{ flex: '1 1 auto', minHeight: 0 }}>
            <CategoryCounts
              counts={categoryCounts}
              isLoading={isLoading}
              selectedCategory={filters.category}
              onSelectCategory={handleFilterChange('category')}
            />
          </SidebarContent>
          <div className="sidebar-footer-manual flex-shrink-0 border-t spacing-responsive" style={{ 
            minHeight: 'clamp(60px, 8vh, 100px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderTop: '1px solid var(--sidebar-border)',
            backgroundColor: 'var(--sidebar-background)',
            position: 'relative',
            zIndex: 1000,
            flexShrink: 0
          }}>
            <SimpleThemeToggle />
          </div>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="page-header flex items-center justify-between spacing-responsive-sm border-b gap-responsive flex-wrap shrink-0">
            <div className="flex items-center gap-responsive">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-responsive-lg font-bold tracking-tight font-headline">
                Inventory Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-responsive flex-1 justify-end">
              <div className="w-full container-responsive">
                <Select value={currentUser} onValueChange={setCurrentUser}>
                  <SelectTrigger className="input-responsive">
                    <div className="flex items-center gap-responsive">
                      <User className="icon-responsive text-muted-foreground" />
                      <SelectValue placeholder="Select user..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CONFIG.users.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" variant="export" onClick={() => handleExport()}>
                <Download className="icon-responsive" />
                <span className="text-responsive-sm">Export All</span>
              </Button>
              <Button size="sm" variant="primary" onClick={() => setAddAssetOpen(true)}>
                <PlusCircle className="icon-responsive" />
                <span className="text-responsive-sm">Add Asset</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 flex flex-col min-h-0 spacing-responsive max-h-[calc(100vh-80px)] overflow-hidden">
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <div className="top-controls flex flex-col lg:flex-row items-start lg:items-center gap-responsive mb-4 shrink-0">
                <div className="relative w-full lg:flex-1 max-w-full lg:max-w-md search-container">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 icon-responsive search-icon" />
                  <Input
                      placeholder="Search all fields..."
                      className="pl-10 pr-10 input-responsive w-full search-input text-responsive-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="icon-responsive" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-responsive flex-1 justify-end w-full lg:w-auto flex-wrap">
                  <Select value={filters.category} onValueChange={handleFilterChange('category')}>
                    <SelectTrigger className="input-responsive container-responsive">
                      <SelectValue placeholder="Product family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Product Families</SelectItem>
                      {APP_CONFIG.categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.status} onValueChange={handleFilterChange('status')}>
                    <SelectTrigger className="input-responsive container-responsive">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {APP_CONFIG.statuses.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.location} onValueChange={handleFilterChange('location')}>
                    <SelectTrigger className="input-responsive container-responsive">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {APP_CONFIG.locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex-shrink-0">
                    <Button size="sm" variant="clear-filters" onClick={handleClearFilters}>
                      <X className="icon-responsive" />
                      <span className="text-responsive-sm">Clear Filters</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-responsive spacing-responsive-sm mb-4 rounded-lg border bg-card shrink-0">
                <div className="flex items-center gap-responsive flex-wrap">
                  <Button size="sm" variant="select-all" onClick={handleSelectAllOnPage} disabled={isLoading || filteredAssets.length === 0}>
                    <Check className="icon-responsive" />
                    <span className="text-responsive-sm">Select all</span>
                  </Button>
                  <Button size="sm" variant="clear-selection" onClick={() => setSelectedAssetIds([])} disabled={selectedAssetIds.length === 0}>
                    <X className="icon-responsive" />
                    <span className="text-responsive-sm">Clear</span>
                  </Button>
                </div>

                <div className="text-responsive-sm font-medium text-muted-foreground">
                  {selectedAssetIds.length > 0
                      ? `${selectedAssetIds.length} of ${filteredAssets.length} selected`
                      : `${filteredAssets.length} items`
                  }
                </div>
                <div className="flex items-center gap-responsive flex-wrap">
                  <DropdownMenu open={isViewDropdownOpen} onOpenChange={setIsViewDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="view-settings">
                            <Settings2 className="icon-responsive" />
                            <span className="text-responsive-sm">View</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {APP_CONFIG.tableColumns.map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={tempColumnVisibility[column.id]}
                    onCheckedChange={(value: boolean | 'indeterminate') =>
                      setTempColumnVisibility(prev => ({
                        ...prev,
                        [column.id]: !!value,
                      }))
                    }
                    onSelect={(e: React.SyntheticEvent) => e.preventDefault()} // Prevent closing
                            >
                                {column.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <div className="flex justify-end gap-2 p-2">
                          <Button size="sm" variant="cancel" onClick={handleCancelColumnVisibility}>Cancel</Button>
                          <Button size="sm" variant="apply" onClick={handleApplyColumnVisibility}>Apply</Button>
                        </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="export" onClick={() => handleExport(true)} disabled={selectedAssetIds.length === 0}>
                    <Download className="icon-responsive" />
                    <span className="text-responsive-sm">Export Selected</span>
                  </Button>
                  <Button size="sm" variant="delete" onClick={() => setIsBulkDeleteAlertOpen(true)} disabled={selectedAssetIds.length === 0}>
                    <Trash2 className="icon-responsive" />
                    <span className="text-responsive-sm">Delete Selected</span>
                  </Button>
                </div>
              </div>

              <div className="table-container">
                {!isClient || isInitialLoad ? (
                  <div className="overflow-auto h-full flex-1 max-h-[calc(100vh-300px)]">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-semibold text-foreground bg-muted [&:has([role=checkbox])]:pr-0 border-r-0 first:border-r-0 w-[40px]"><Skeleton className="h-5 w-5" /></th>
                          {APP_CONFIG.tableColumns.map(col => (
                            <th key={col.id} className="h-12 px-4 text-left align-middle font-semibold text-foreground bg-muted [&:has([role=checkbox])]:pr-0 border-r last:border-r-0">
                              {col.label}
                            </th>
                          ))}
                          <th className="h-12 w-12 bg-muted"><span className="sr-only">Actions</span></th>
                        </tr>
                      </thead>
                       <tbody className="[&_tr:last-child]:border-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b data-[state=selected]:bg-muted h-9">
                            <td className="p-4 align-middle border-r last:border-r-0"><Skeleton className="h-5 w-5" /></td>
                            <td className="p-4 align-middle border-r last:border-r-0"><Skeleton className="h-5 w-[80px]" /></td>
                            <td className="p-4 align-middle border-r last:border-r-0"><Skeleton className="h-8 w-[100px]" /></td>
                            <td className="p-4 align-middle border-r last:border-r-0"><Skeleton className="h-5 w-[150px]" /></td>
                            <td className="p-4 align-middle hidden md:table-cell border-r last:border-r-0"><Skeleton className="h-5 w-[100px]" /></td>
                            <td className="p-4 align-middle hidden lg:table-cell border-r last:border-r-0"><Skeleton className="h-5 w-[100px]" /></td>
                            <td className="p-4 align-middle"><Skeleton className="h-5 w-[120px]" /></td>
                            <td className="p-4 align-middle hidden sm:table-cell border-r last:border-r-0"><Skeleton className="h-5 w-[80px]" /></td>
                            <td className="p-4 align-middle border-r last:border-r-0"><Skeleton className="h-8 w-8" /></td>
                          </tr>
                        ))}
                      </tbody>
                     </table>
                  </div>
                ) : (
                  <ErrorBoundary key={`${searchQuery}-${filters.category}-${filters.status}-${filters.location}-${filteredAssets.length}`}>
                    <AssetTable
                      assets={filteredAssets}
                      onEdit={handleEdit}
                      onInfo={handleInfo}
                      onDelete={fetchAssets}
                      selectedAssetIds={selectedAssetIds}
                      onSelectedAssetIdsChange={setSelectedAssetIds}
                      columnVisibility={columnVisibility}
                      tableHeight="calc(100vh - 300px)"
                    />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          </main>
        </div>
        <AddAssetDialog isOpen={isAddAssetOpen} onOpenChange={setAddAssetOpen} onAssetAdded={fetchAssets} />
        {selectedAsset && <EditAssetDialog asset={selectedAsset} isOpen={isEditAssetOpen} onOpenChange={setEditAssetOpen} onAssetUpdated={fetchAssets} />}
        {selectedAsset && <AssetDetailsDialog asset={selectedAsset} isOpen={isDetailsAssetOpen} onOpenChange={setDetailsAssetOpen} />}
        
        <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedAssetIds.length} Asset{selectedAssetIds.length !== 1 ? 's' : ''}</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently <span className="font-bold" style={{ color: 'var(--destructive)' }}>DELETE</span> {selectedAssetIds.length} selected asset{selectedAssetIds.length !== 1 ? 's' : ''} from your inventory. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="btn-cancel">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="btn-delete">
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
}
