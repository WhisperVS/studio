"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, PlusCircle, Search, Trash2, User, X, Check, Settings2 } from "lucide-react";
import { AssetTable } from "@/components/asset-table";
import { AddAssetDialog } from "@/components/add-asset-dialog";
import { EditAssetDialog } from "@/components/edit-asset-dialog";
import { AssetDetailsDialog } from "@/components/asset-details-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { type Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { APP_CONFIG } from "@/lib/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { useUser } from "@/components/user-provider";
import { CategoryCounts } from "./category-counts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ErrorBoundary } from "./ui/error-boundary";

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
  // isMobile not used yet; keep hook for future responsive tweaks
  useIsMobile();
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
  }

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      location: 'all',
    });
  }
  
  const filteredAssets = useMemo(() => {
    try {
      const q = (searchQuery || '').trim().toLowerCase();

      const matches = assets.filter(asset => {
        try {
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
        <Sidebar collapsible="icon" className="border-r flex flex-col h-screen">
          <SidebarHeader className="flex-shrink-0">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-visible py-2">
            <CategoryCounts
              counts={categoryCounts}
              isLoading={isLoading}
              selectedCategory={filters.category}
              onSelectCategory={handleFilterChange('category')}
            />
          </SidebarContent>
          <div className="sidebar-footer-manual flex-shrink-0 border-t p-4 bg-background" style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--border)' }}>
            <ThemeToggle />
          </div>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="page-header flex items-center justify-between p-4 border-b gap-4 flex-wrap shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold tracking-tight font-headline">
                Inventory Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="w-full max-w-[180px]">
                <Select value={currentUser} onValueChange={setCurrentUser}>
                  <SelectTrigger className="h-9">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select user..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CONFIG.users.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="btn-export" onClick={() => handleExport()}>
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export All</span>
              </Button>
              <Button size="sm" className="btn-add-asset" onClick={() => setAddAssetOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Asset</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 flex flex-col min-h-0 p-4 md:p-6 lg:p-4 max-h-[calc(100vh-80px)] overflow-hidden">
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <div className="top-controls flex items-center gap-2 mb-4 h-[58px] shrink-0">
                <div className="relative w-80 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search all fields..."
                      className="pl-10 pr-10 h-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <Select value={filters.category} onValueChange={handleFilterChange('category')}>
                    <SelectTrigger className="h-9 w-[180px]">
                      <SelectValue placeholder="Filter by product family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Product Families</SelectItem>
                      {APP_CONFIG.categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.status} onValueChange={handleFilterChange('status')}>
                    <SelectTrigger className="h-9 w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {APP_CONFIG.statuses.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.location} onValueChange={handleFilterChange('location')}>
                    <SelectTrigger className="h-9 w-[180px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {APP_CONFIG.locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="h-9 btn-clear-filters" onClick={handleClearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 mb-4 rounded-lg border bg-card h-[58px] shrink-0">
                <div className="flex items-center gap-2">
                  <Button size="sm" className="btn-select-all" onClick={handleSelectAllOnPage} disabled={isLoading || filteredAssets.length === 0}>
                    <Check className="mr-2 h-4 w-4" />
                    Select all on page
                  </Button>
                  <Button size="sm" className="btn-clear-selection" onClick={() => setSelectedAssetIds([])} disabled={selectedAssetIds.length === 0}>
                    <X className="mr-2 h-4 w-4" />
                    Clear selection
                  </Button>
                </div>

                <div className="text-sm font-medium text-muted-foreground">
                  {selectedAssetIds.length > 0
                      ? `${selectedAssetIds.length} of ${filteredAssets.length} item(s) selected.`
                      : `${filteredAssets.length} items.`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu open={isViewDropdownOpen} onOpenChange={setIsViewDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" className="btn-view-settings">
                            <Settings2 className="mr-2 h-4 w-4" />
                            View
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
                          <Button size="sm" className="btn-cancel" onClick={handleCancelColumnVisibility}>Cancel</Button>
                          <Button size="sm" className="btn-apply" onClick={handleApplyColumnVisibility}>Apply</Button>
                        </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" className="btn-export" onClick={() => handleExport(true)} disabled={selectedAssetIds.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </Button>
                  <Button size="sm" className="btn-delete" onClick={() => setIsBulkDeleteAlertOpen(true)} disabled={selectedAssetIds.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </div>

              <div className="table-container flex-1 min-h-0 overflow-auto flex max-h-[calc(100vh-300px)] border rounded-lg">
                {!isClient || isInitialLoad ? (
                  <div className="rounded-lg border overflow-auto h-full flex-1 max-h-[calc(100vh-300px)]">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                          <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-9">
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
                  <ErrorBoundary key={`${searchQuery}-${filters.category}-${filters.status}-${filters.location}`}>
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
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the selected {selectedAssetIds.length} asset(s)
                        from your inventory. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
}
