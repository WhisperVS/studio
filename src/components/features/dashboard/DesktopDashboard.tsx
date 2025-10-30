"use client";

import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, PlusCircle, Search, Trash2, User, X, Check, Settings2 } from "lucide-react";
import { AssetTable, AddAssetDialog, EditAssetDialog, AssetDetailsDialog } from "@/components/features/assets";
import { SimpleThemeToggle } from "@/components/features/theme";
import { Logo } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_CONFIG } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CategoryCounts } from "./CategoryCounts";
import { DashboardProps } from "./types";
import { useUser } from "@/components/providers";

export function DesktopDashboard(props: DashboardProps) {
  const {
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
    isViewDropdownOpen,
    isBulkDeleteAlertOpen,
    setAddAssetOpen,
    setEditAssetOpen,
    setDetailsAssetOpen,
    setSelectedAsset,
    setSelectedAssetIds,
    setSearchQuery,
    setColumnVisibility,
    setTempColumnVisibility,
    setIsViewDropdownOpen,
    setIsBulkDeleteAlertOpen,
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
  } = props;
  
  const { currentUser, setCurrentUser } = useUser();

  return (
    <SidebarProvider>
      <div className="desktop-dashboard flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
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
          <div className="sidebar-footer flex-shrink-0 border-t p-4 flex items-center justify-center min-h-[80px] bg-sidebar-background">
            <SimpleThemeToggle />
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="page-header flex items-center justify-between p-4 lg:p-6 border-b gap-4 flex-wrap shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight font-headline">
                Inventory Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="w-full max-w-[200px]">
                <Select value={currentUser} onValueChange={setCurrentUser}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select user..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CONFIG.users.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" variant="export" onClick={() => handleExport()}>
                <Download className="h-4 w-4" />
                <span>Export All</span>
              </Button>
              <Button size="sm" variant="primary" onClick={() => setAddAssetOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                <span>Add Asset</span>
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-h-0 p-4 lg:p-6">
            {/* Search and Filters Row - Single horizontal row like v1.5 */}
            <div className="top-controls flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4 shrink-0">
              <div className="relative w-full lg:flex-1 max-w-full lg:max-w-md search-container">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 search-icon text-muted-foreground" />
                <Input
                  placeholder="Search all fields..."
                  className="pl-10 pr-10 h-10 w-full search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 flex-1 justify-end w-full lg:w-auto flex-wrap">
                <Select value={filters.category} onValueChange={handleFilterChange('category')}>
                  <SelectTrigger className="h-10 w-[160px]">
                    <SelectValue placeholder="Product family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Product Families</SelectItem>
                    {APP_CONFIG.categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={handleFilterChange('status')}>
                  <SelectTrigger className="h-10 w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {APP_CONFIG.statuses.map(s => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.location} onValueChange={handleFilterChange('location')}>
                  <SelectTrigger className="h-10 w-[160px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {APP_CONFIG.locations.map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-shrink-0">
                  <Button className="h-10" variant="clear-filters" onClick={handleClearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Selection Controls Card - Exact v1.5 layout */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-4 mb-4 rounded-lg border bg-card shrink-0">
              <div className="flex items-center gap-4 flex-wrap">
                <Button size="sm" variant="select-all" onClick={handleSelectAllOnPage} disabled={isLoading || filteredAssets.length === 0}>
                  <Check className="h-4 w-4" />
                  <span>Select all</span>
                </Button>
                <Button size="sm" variant="clear-selection" onClick={() => setSelectedAssetIds([])} disabled={selectedAssetIds.length === 0}>
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                {selectedAssetIds.length > 0
                  ? `${selectedAssetIds.length} of ${filteredAssets.length} selected`
                  : `${filteredAssets.length} items`
                }
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <DropdownMenu open={isViewDropdownOpen} onOpenChange={setIsViewDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="view-settings">
                      <Settings2 className="h-4 w-4" />
                      <span>View</span>
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
                        onCheckedChange={(value: boolean | 'indeterminate') => {
                          const newVisibility = {
                            ...tempColumnVisibility,
                            [column.id]: !!value,
                          };
                          setTempColumnVisibility(newVisibility);
                        }}
                        onSelect={(e: React.SyntheticEvent) => e.preventDefault()}
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
                  <Download className="h-4 w-4" />
                  <span>Export Selected</span>
                </Button>
                <Button size="sm" variant="delete" onClick={() => setIsBulkDeleteAlertOpen(true)} disabled={selectedAssetIds.length === 0}>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected</span>
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="table-container">
              {!isClient || !assets.length ? (
                <div className="overflow-auto h-full flex-1 max-h-[calc(100vh-300px)]">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-semibold bg-muted w-[40px]">
                          <Skeleton className="h-5 w-5" />
                        </th>
                        {APP_CONFIG.tableColumns.map(col => (
                          <th key={col.id} className="h-12 px-4 text-left align-middle font-semibold bg-muted border-r last:border-r-0">
                            {col.label}
                          </th>
                        ))}
                        <th className="h-12 w-12 bg-muted">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b h-9">
                          <td className="p-4 align-middle border-r">
                            <Skeleton className="h-5 w-5" />
                          </td>
                          <td className="p-4 align-middle border-r">
                            <Skeleton className="h-5 w-[80px]" />
                          </td>
                          <td className="p-4 align-middle border-r">
                            <Skeleton className="h-8 w-[100px]" />
                          </td>
                          <td className="p-4 align-middle border-r">
                            <Skeleton className="h-5 w-[150px]" />
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell border-r">
                            <Skeleton className="h-5 w-[100px]" />
                          </td>
                          <td className="p-4 align-middle hidden lg:table-cell border-r">
                            <Skeleton className="h-5 w-[100px]" />
                          </td>
                          <td className="p-4 align-middle">
                            <Skeleton className="h-5 w-[120px]" />
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell border-r">
                            <Skeleton className="h-5 w-[80px]" />
                          </td>
                          <td className="p-4 align-middle border-r">
                            <Skeleton className="h-8 w-8" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ErrorBoundary key={`desktop-${searchQuery}-${filters.category}-${filters.status}-${filters.location}-${filteredAssets.length}`}>
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
          </main>
        </div>

        {/* Dialogs */}
        <AddAssetDialog 
          isOpen={isAddAssetOpen} 
          onOpenChange={setAddAssetOpen} 
          onAssetAdded={fetchAssets} 
        />
        {selectedAsset && (
          <EditAssetDialog 
            asset={selectedAsset} 
            isOpen={isEditAssetOpen} 
            onOpenChange={setEditAssetOpen} 
            onAssetUpdated={fetchAssets} 
          />
        )}
        {selectedAsset && (
          <AssetDetailsDialog 
            asset={selectedAsset} 
            isOpen={isDetailsAssetOpen} 
            onOpenChange={setDetailsAssetOpen} 
          />
        )}
        
        <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedAssetIds.length} Asset{selectedAssetIds.length !== 1 ? 's' : ''}
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently <span className="font-bold text-destructive">DELETE</span> {selectedAssetIds.length} selected asset{selectedAssetIds.length !== 1 ? 's' : ''} from your inventory. This action cannot be undone.
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