"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil, Info, ExternalLink, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { APP_CONFIG, getStatusVariant } from '@/lib/config';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type SortKey = keyof Asset | '';

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onInfo: (asset: Asset) => void;
  onDelete: () => void;
  selectedAssetIds: string[];
  onSelectedAssetIdsChange: (ids: string[]) => void;
  columnVisibility: Record<string, boolean>;
  tableHeight?: string; // CSS height (e.g. '600px' or 'calc(100vh - 260px)')
}

export function AssetTable({ assets, onEdit, onInfo, onDelete, selectedAssetIds, onSelectedAssetIdsChange, columnVisibility, tableHeight }: AssetTableProps) {
  const { toast } = useToast();
  const [sortKey, setSortKey] = useState<SortKey>('machineName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleRowSelect = (assetId: string, checked: boolean) => {
    onSelectedAssetIdsChange(
      checked
        ? [...selectedAssetIds, assetId]
        : selectedAssetIds.filter(id => id !== assetId)
    );
  };


  const handleDelete = async () => {
    if (!assetToDelete) return;

    try {
      const response = await fetch(`/api/assets/${assetToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      toast({
        title: "Asset Deleted",
        description: "The asset has been removed from the inventory.",
      });
      onDelete(); // Refetch assets
    } catch (error) {
      console.error("Failed to delete asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the asset.",
      });
    } finally {
      setAssetToDelete(null);
      setIsAlertOpen(false);
    }
  };

  const openDeleteDialog = (assetId: string) => {
    setAssetToDelete(assetId);
    setIsAlertOpen(true);
  };

  const sortedAssets = useMemo(() => {
    if (!sortKey) return assets;

    return [...assets].sort((a, b) => {
      const aValue = a[sortKey as keyof Asset];
      const bValue = b[sortKey as keyof Asset];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [assets, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = APP_CONFIG.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }
  
  const handleConnect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (assets.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center text-center p-12 border rounded-md flex-1 min-h-0 max-h-[calc(100vh-300px)]"
        style={{
          borderColor: 'var(--card-border)',
          background: 'var(--card-background)'
        }}
      >
        <h3 className="text-xl font-semibold tracking-tight font-headline">No Assets Found</h3>
        <p className="text-muted-foreground mt-2">
          Get started by adding your first asset to the inventory or try a different search.
        </p>
      </div>
    )
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  // compute how many dynamic columns are visible (used to set min-width so horizontal scroll appears)
  const visibleDynamicColumns = APP_CONFIG.tableColumns.filter(col => columnVisibility[col.id]).length;
  const totalColumns = visibleDynamicColumns + 3; // connect, select, actions
  // set a per-column width (px) — tweak as needed; if many columns are visible this will force horizontal scrolling
  const perColumnPx = 120; // Restored to original value
  const tableMinWidthPx = Math.max(totalColumns * perColumnPx, 760);
  const forceHorizontal = visibleDynamicColumns >= 9; // force horizontal scrollbar when user enabled 9 or more columns

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const headerScrollEl = headerScrollRef.current;
    const ribbonEl = ribbonRef.current;
    if (!scrollEl || !headerScrollEl || !ribbonEl) return;

    const autoCalibrate = () => {
      // Create a temporary single table to measure natural column widths
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Clone both header and data table structures into temp container
      const headerTable = headerScrollEl.querySelector('table');
      const dataTable = scrollEl.querySelector('table');
      
      if (headerTable && dataTable) {
        const tempTable = document.createElement('table');
        tempTable.className = 'border-collapse';
        tempTable.style.tableLayout = 'auto'; // Let browser calculate natural widths
        
        // Clone header
        const tempHeader = headerTable.querySelector('thead')?.cloneNode(true);
        if (tempHeader) tempTable.appendChild(tempHeader);
        
        // Clone a few data rows for measurement
        const tempBody = document.createElement('tbody');
        const dataRows = dataTable.querySelectorAll('tbody tr');
        for (let i = 0; i < Math.min(3, dataRows.length); i++) {
          const clonedRow = dataRows[i].cloneNode(true);
          tempBody.appendChild(clonedRow);
        }
        tempTable.appendChild(tempBody);
        tempContainer.appendChild(tempTable);

        // Force layout calculation
        tempTable.offsetWidth;

        // Measure the natural column widths
        const tempHeaderCells = tempTable.querySelectorAll('thead th');
        const realHeaderCells = headerTable.querySelectorAll('thead th');
        const realDataTable = scrollEl.querySelector('table');

        // Apply measured widths to both header and data tables
        tempHeaderCells.forEach((tempCell, index) => {
          const width = (tempCell as HTMLElement).offsetWidth;
          const headerCell = realHeaderCells[index] as HTMLElement;
          if (headerCell) {
            headerCell.style.width = `${width}px`;
            headerCell.style.minWidth = `${width}px`;
            headerCell.style.maxWidth = `${width}px`;
          }
        });

        // Apply same widths to data table using CSS variables or direct styling
        if (realDataTable) {
          const style = document.createElement('style');
          let css = '';
          tempHeaderCells.forEach((tempCell, index) => {
            const width = (tempCell as HTMLElement).offsetWidth;
            css += `
              .asset-table tbody tr td:nth-child(${index + 1}) {
                width: ${width}px !important;
                min-width: ${width}px !important;
                max-width: ${width}px !important;
              }
            `;
          });
          style.textContent = css;
          realDataTable.appendChild(style);
        }
      }

      // Clean up
      document.body.removeChild(tempContainer);
    };

    const onDataScroll = () => {
      // sync header position with data scroll
      const headerTable = headerScrollEl.querySelector('table');
      if (headerTable) {
        headerTable.style.transform = `translateX(-${scrollEl.scrollLeft}px)`;
      }
      ribbonEl.scrollLeft = scrollEl.scrollLeft;
    };
    
    const onRibbonScroll = () => {
      scrollEl.scrollLeft = ribbonEl.scrollLeft;
    };

    scrollEl.addEventListener('scroll', onDataScroll);
    ribbonEl.addEventListener('scroll', onRibbonScroll);

    const setSpacerWidth = () => {
      const inner = ribbonEl.querySelector('.ribbon-spacer') as HTMLDivElement | null;
      if (inner) inner.style.width = `${scrollEl.scrollWidth}px`;
      if (scrollEl.scrollWidth > scrollEl.clientWidth) {
        ribbonEl.style.display = 'block';
      } else {
        ribbonEl.style.display = 'none';
      }
    };

    // Initial calibration and setup
    autoCalibrate();
    setSpacerWidth();

    const resizeObserver = new ResizeObserver(() => {
      autoCalibrate();
      setSpacerWidth();
    });
    resizeObserver.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener('scroll', onDataScroll);
      ribbonEl.removeEventListener('scroll', onRibbonScroll);
      resizeObserver.disconnect();
    };
  }, [assets, columnVisibility]);

  // when visible columns change, recalc the ribbon spacer to match new scrollWidth
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const ribbonEl = ribbonRef.current;
    if (!scrollEl || !ribbonEl) return;
    const inner = ribbonEl.querySelector('.ribbon-spacer') as HTMLDivElement | null;
    if (inner) (inner as HTMLDivElement).style.width = `${scrollEl.scrollWidth}px`;
    if (scrollEl.scrollWidth <= scrollEl.clientWidth) {
      ribbonEl.style.display = 'none';
    } else {
      ribbonEl.style.display = 'block';
    }
  }, [visibleDynamicColumns, assets.length]);

  return (
    <>
      {/* create an isolated stacking context so the table's sticky elements can't escape and overlap higher-level UI like the sidebar */}
      <div className="overflow-hidden flex-1 isolate h-full">
        <div className="relative w-full h-full flex flex-col">
          
          {/* Separate header container - syncs with data table column widths */}
          <div className="flex-shrink-0 border-b">
            <div ref={headerScrollRef} className="w-full overflow-hidden">
              <Table className="border-collapse" style={ forceHorizontal ? { minWidth: `${tableMinWidthPx}px` } : undefined }>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHead className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0 text-center">
                      <ExternalLink className="h-4 w-4 inline-block" />
                      <span className="sr-only">Connect</span>
                    </TableHead>
                    <TableHead className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0 text-center">
                      <CheckSquare className="h-4 w-4 inline-block" />
                      <span className="sr-only">Select</span>
                    </TableHead>
                    {APP_CONFIG.tableColumns.map(col => columnVisibility[col.id] && (
                        <TableHead 
                          key={col.id}
                          onClick={() => handleSort(col.id as keyof Asset)}
                          className={cn("cursor-pointer", col.className)}
                        >
                          {col.label}
                          {sortKey === col.id && (
                            <span className="ml-2 inline-block">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                    ))}
                    <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                  </TableHeaderRow>
                </TableHeader>
              </Table>
            </div>
          </div>
          
          {/* Data container - auto-calibrates column widths based on content */}
          <div ref={scrollRef} className="flex-1 overflow-auto relative scrollbar-neon pb-3">
            <Table className="border-collapse asset-table" style={ forceHorizontal ? { minWidth: `${tableMinWidthPx}px` } : undefined }>
              <TableBody>
                {(() => {
                  try {
                    return sortedAssets.map((asset) => (
                      <TableRow key={asset.id} data-state={selectedAssetIds.includes(asset.id) ? "selected" : ""}>
                        {asset.webui ? (
                          <TableCell className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0 text-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleConnect(asset.webui!)}
                              aria-label={`Connect to ${asset.machineName}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0" />
                        )}
                        <TableCell className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedAssetIds.includes(asset.id)}
                              onCheckedChange={(checked: boolean | 'indeterminate') => handleRowSelect(asset.id, !!checked)}
                              aria-label={`Select row for ${asset.machineName}`}
                            />
                          </div>
                        </TableCell>
                        {columnVisibility.category && <TableCell>{getCategoryName(asset.category)}</TableCell>}
                        {columnVisibility.status && <TableCell><Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge></TableCell>}
                        {columnVisibility.machineName && <TableCell className="font-medium">{asset.machineName}</TableCell>}
                        {columnVisibility.manufacturer && <TableCell className="hidden md:table-cell">{asset.manufacturer}</TableCell>}
                        {columnVisibility.modelNumber && <TableCell className="hidden lg:table-cell">{asset.modelNumber}</TableCell>}
                        {columnVisibility.type && <TableCell className="hidden lg:table-cell">{asset.type}</TableCell>}
                        {columnVisibility.partNumber && <TableCell className="hidden lg:table-cell">{asset.partNumber}</TableCell>}
                        {columnVisibility.serialNumber && <TableCell className="hidden xl:table-cell">{asset.serialNumber}</TableCell>}
                        {columnVisibility.os && <TableCell className="hidden xl:table-cell">{asset.os}</TableCell>}
                        {columnVisibility.assignedUser && <TableCell>{asset.assignedUser || 'N/A'}</TableCell>}
                        {columnVisibility.userId && <TableCell className="hidden sm:table-cell">{asset.userId || 'N/A'}</TableCell>}
                        {columnVisibility.location && <TableCell className="hidden 2xl:table-cell">{asset.location}</TableCell>}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onInfo(asset)}>
                                <Info className="mr-2 h-4 w-4" />
                                <span>Info</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(asset)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive  "
                                onClick={() => openDeleteDialog(asset.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ));
                  } catch (err) {
                    console.error('Error rendering table rows:', err);
                    return (
                      <TableRow>
                        <TableCell colSpan={totalColumns}>
                          <div className="p-4 text-sm text-destructive">An error occurred rendering rows. Try clearing the search or refresh the page.</div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })()}
                
              </TableBody>
            </Table>
          </div>
          {/* Bottom horizontal scroll ribbon that mirrors the table's scrollWidth (overlay, doesn't add layout height) */}
          <div ref={ribbonRef} className="absolute bottom-0 left-0 right-4 h-5 overflow-x-auto overflow-y-hidden scrollbar-neon z-20 ribbon" style={{ display: 'none' }}>
            {/* spacer provides the scrollable width and a tiny height so browsers render the horizontal scrollbar */}
            <div className="ribbon-spacer h-px" />
          </div>
        </div>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
