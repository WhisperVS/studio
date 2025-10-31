"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/shared/ui/sidebar";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Download, PlusCircle, Search, Trash2, User, X, Check, Settings2 } from "lucide-react";
import { TabletAssetTable } from "../tables/TabletAssetTable";
import { TabletAddAssetDialog } from "../dialogs/TabletAddAssetDialog";
import { EditAssetDialog, AssetDetailsDialog } from "@/components/features/assets";
import { SimpleThemeToggle } from "@/components/features/theme";
import { Logo } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select";
import { APP_CONFIG, DESIGN_TOKENS } from "@/lib/config";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shared/ui/alert-dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/shared/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/shared/ui/error-boundary";
import { TabletCategoryCounts } from "../navigation/TabletCategoryCounts";
import { DashboardProps } from "../../shared/types";
import { useUser } from "@/components/shared/providers";

export function IpadDashboard(props: DashboardProps) {
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
    <SidebarProvider defaultOpen={true}>
      <div className="ipad-dashboard flex h-screen bg-background overflow-hidden">
        {/* Sidebar - Enhanced with smooth transitions */}
        <Sidebar 
          collapsible="icon" 
          className="border-r flex flex-col h-screen transition-all duration-300 ease-in-out"
        >
          <SidebarHeader className="flex-shrink-0 transition-opacity duration-200">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-visible py-2 transition-opacity duration-200">
            <TabletCategoryCounts
              counts={categoryCounts}
              isLoading={isLoading}
              selectedCategory={filters.category}
              onSelectCategory={handleFilterChange('category')}
            />
          </SidebarContent>
          <div className={`sidebar-footer flex-shrink-0 border-t ${DESIGN_TOKENS.spacing.sm} flex items-center justify-center ${DESIGN_TOKENS.height.sidebar} bg-sidebar-background transition-opacity duration-200`}>
            <SimpleThemeToggle />
          </div>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header - Not scrollable */}
          <header className="page-header flex items-center justify-between p-4 border-b gap-4 flex-wrap shrink-0 bg-background z-10">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <SidebarTrigger className="h-9 w-9 rounded-md hover:bg-accent transition-colors shadow-sm border" />
                <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Toggle Menu
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight font-headline">
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
                <Download className="h-4 w-4 mr-2" />
                <span>Export All</span>
              </Button>
              <Button size="sm" variant="primary" onClick={() => setAddAssetOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Add Asset</span>
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-h-0 p-4">
            {/* Search and Filters Row - Single horizontal row like desktop */}
            <div className="search-filters-row flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                <Input
                  placeholder="Search assets..."
                  className="h-10 pl-12 pr-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="filter-controls flex items-center gap-4 flex-wrap">
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

            {/* Selection Actions and View Controls */}
            <div className="selection-and-controls flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="selection-info flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedAssetIds.length > 0
                    ? `${selectedAssetIds.length} of ${filteredAssets.length} selected`
                    : `${filteredAssets.length} items`
                  }
                </span>
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
                  size="sm" 
                  variant="select-all" 
                  onClick={handleSelectAllOnPage} 
                  disabled={isLoading || filteredAssets.length === 0}
                >
                  <Check className="h-4 w-4" />
                  <span>Select All</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="export" 
                  onClick={() => handleExport(true)} 
                  disabled={selectedAssetIds.length === 0}
                >
                  <Download className="h-4 w-4" />
                  <span>Export Selected</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="delete" 
                  onClick={() => setIsBulkDeleteAlertOpen(true)} 
                  disabled={selectedAssetIds.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected</span>
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {filteredAssets.length === 0 && !isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No assets found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || filters.category !== 'all' || filters.status !== 'all' || filters.location !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Get started by adding your first asset'
                      }
                    </p>
                    {(!searchQuery && filters.category === 'all' && filters.status === 'all' && filters.location === 'all') && (
                      <Button variant="primary" onClick={() => setAddAssetOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Asset
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <ErrorBoundary key={`ipad-optimized-${searchQuery}-${filters.category}-${filters.status}-${filters.location}-${filteredAssets.length}`}>
                    <TabletAssetTable
                      assets={filteredAssets}
                      onEdit={handleEdit}
                      onInfo={handleInfo}
                      onDelete={fetchAssets}
                      selectedAssetIds={selectedAssetIds}
                      onSelectedAssetIdsChange={setSelectedAssetIds}
                      columnVisibility={columnVisibility}
                      tableHeight="100%"
                    />
                  </ErrorBoundary>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>

        {/* Dialogs */}
        <TabletAddAssetDialog 
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
        
        {/* Bulk Delete Confirmation */}
        <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Selected Assets</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedAssetIds.length} selected assets? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { handleBulkDelete(); setIsBulkDeleteAlertOpen(false); }} className="bg-destructive hover:bg-destructive/90">
                Delete Assets
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
}