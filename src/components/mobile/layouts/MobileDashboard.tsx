"use client";

import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Download, PlusCircle, Search, Trash2, User, X, Check, Settings2 } from "lucide-react";
import { MobileAssetTable } from "../tables/MobileAssetTable";
import { MobileAddAssetDialog } from "../dialogs/MobileAddAssetDialog";
import { EditAssetDialog, AssetDetailsDialog } from "@/components/features/assets";
import { SimpleThemeToggle } from "@/components/features/theme";
import { Logo } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select";
import { APP_CONFIG, DESIGN_TOKENS } from "@/lib/config";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shared/ui/alert-dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/shared/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/shared/ui/error-boundary";
import { CategoryCounts } from "../../features/dashboard/CategoryCounts";
import { DashboardProps } from "../../shared/types";
import { useUser } from "@/components/shared/providers";

export function MobileDashboard(props: DashboardProps) {
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
    <div className="mobile-dashboard flex flex-col min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="mobile-header flex flex-col bg-background border-b">
        {/* Top row with logo and theme toggle */}
        <div className={`flex items-center justify-between ${DESIGN_TOKENS.spacing.sm} pb-2`}>
          <Logo />
          <SimpleThemeToggle />
        </div>
        
        {/* Title and user selection */}
        <div className="px-4 pb-3">
          <h1 className="text-lg font-bold tracking-tight font-headline mb-3">
            Inventory Dashboard
          </h1>
          <Select value={currentUser} onValueChange={setCurrentUser}>
            <SelectTrigger className={`${DESIGN_TOKENS.height.control} ${DESIGN_TOKENS.width.full}`}>
              <div className={`flex items-center ${DESIGN_TOKENS.gap.xs}`}>
                <User className={`${DESIGN_TOKENS.icon.sm} text-muted-foreground`} />
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

        {/* Quick Actions */}
        <div className={`flex ${DESIGN_TOKENS.gap.xs} px-4 pb-4`}>
          <Button 
            className={`flex-1 ${DESIGN_TOKENS.height.button}`} 
            variant="export" 
            onClick={() => handleExport()}
          >
            <Download className={`mr-2 ${DESIGN_TOKENS.icon.sm}`} />
            Export
          </Button>
          <Button 
            className={`flex-1 ${DESIGN_TOKENS.height.button}`} 
            variant="primary" 
            onClick={() => setAddAssetOpen(true)}
          >
            <PlusCircle className={`mr-2 ${DESIGN_TOKENS.icon.sm}`} />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-card border-b">
        <div className={DESIGN_TOKENS.spacing.sm}>
          <CategoryCounts
            counts={categoryCounts}
            isLoading={isLoading}
            selectedCategory={filters.category}
            onSelectCategory={handleFilterChange('category')}
            isMobile={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search and Filters */}
        <div className="search-filters-section bg-background border-b">
          <div className={`${DESIGN_TOKENS.spacing.sm} space-y-4`}>
            {/* Search */}
            <div className="relative search-container">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${DESIGN_TOKENS.icon.sm} text-muted-foreground search-icon`} />
              <Input
                placeholder="Search all fields..."
                className={`${DESIGN_TOKENS.height.input} ${DESIGN_TOKENS.width.full} search-input`}
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
                  <X className={DESIGN_TOKENS.icon.sm} />
                </button>
              )}
            </div>

            {/* Filters Grid */}
            <div className={`grid grid-cols-1 gap-y-3`}>
              <Select value={filters.status} onValueChange={handleFilterChange('status')}>
                <SelectTrigger className="h-10">
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
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {APP_CONFIG.locations.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                className="h-10" 
                variant="clear-filters" 
                onClick={handleClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="selection-controls bg-card border-b">
          <div className="p-4 space-y-4">
            {/* Selection Actions */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 h-10" 
                variant="select-all" 
                onClick={handleSelectAllOnPage} 
                disabled={isLoading || filteredAssets.length === 0}
              >
                <Check className="mr-2 h-4 w-4" />
                Select All
              </Button>
              <Button 
                className="flex-1 h-10" 
                variant="clear-selection" 
                onClick={() => setSelectedAssetIds([])} 
                disabled={selectedAssetIds.length === 0}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* Status Text */}
            <div className="text-sm font-medium text-muted-foreground text-center">
              {selectedAssetIds.length > 0
                ? `${selectedAssetIds.length} of ${filteredAssets.length} selected`
                : `${filteredAssets.length} items`
              }
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <DropdownMenu open={isViewDropdownOpen} onOpenChange={setIsViewDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button className="h-10 w-full" variant="view-settings">
                    <Settings2 className="mr-2 h-4 w-4" />
                    View Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-[280px] max-w-[90vw] max-h-[60vh] overflow-hidden flex flex-col"
                >
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex-1 overflow-y-auto max-h-[40vh] px-1">
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
                  </div>
                  <DropdownMenuSeparator />
                  <div className="flex justify-end gap-2 p-2 bg-background border-t">
                    <Button size="sm" variant="cancel" onClick={handleCancelColumnVisibility}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="apply" onClick={handleApplyColumnVisibility}>
                      Apply
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                className="h-10 w-full" 
                variant="export" 
                onClick={() => handleExport(true)} 
                disabled={selectedAssetIds.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              
              <Button 
                className="h-10 w-full" 
                variant="delete" 
                onClick={() => setIsBulkDeleteAlertOpen(true)} 
                disabled={selectedAssetIds.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-hidden">
          {!isClient || !assets.length ? (
            <div className="p-4">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full">
              <ErrorBoundary key={`mobile-${searchQuery}-${filters.category}-${filters.status}-${filters.location}-${filteredAssets.length}`}>
                <MobileAssetTable
                  assets={filteredAssets}
                  onEdit={handleEdit}
                  onInfo={handleInfo}
                  onDelete={fetchAssets}
                  selectedAssetIds={selectedAssetIds}
                  onSelectedAssetIdsChange={setSelectedAssetIds}
                  columnVisibility={columnVisibility}
                  tableHeight="100%"
                  isMobile={true}
                />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <MobileAddAssetDialog 
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
  );
}