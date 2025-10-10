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
      // Create a temporary container to measure natural content widths
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = 'max-content';
      document.body.appendChild(tempContainer);

      const headerTable = headerScrollEl.querySelector('table');
      const dataTable = scrollEl.querySelector('table');
      
      if (headerTable && dataTable) {
        // Create temporary table to measure natural widths
        const tempTable = document.createElement('table');
        tempTable.className = 'border-collapse';
        tempTable.style.tableLayout = 'auto';
        tempTable.style.width = 'max-content';
        
        // Clone header
        const tempHeader = headerTable.querySelector('thead')?.cloneNode(true) as HTMLElement;
        if (tempHeader) {
          // Remove width constraints from header cells for natural measurement
          const headerCells = tempHeader.querySelectorAll('th');
          headerCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.width = 'auto';
            htmlCell.style.minWidth = 'auto';
            htmlCell.style.maxWidth = 'none';
            htmlCell.style.padding = '6px 8px'; // Reduced header padding
            htmlCell.style.whiteSpace = 'nowrap'; // Prevent header text wrapping
          });
          tempTable.appendChild(tempHeader);
        }
        
        // Clone ALL data rows to get accurate width measurements
        const tempBody = document.createElement('tbody');
        const dataRows = dataTable.querySelectorAll('tbody tr');
        dataRows.forEach(row => {
          const clonedRow = row.cloneNode(true) as HTMLElement;
          // Remove width constraints from data cells
          const dataCells = clonedRow.querySelectorAll('td');
          dataCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.width = 'auto';
            htmlCell.style.minWidth = 'auto';
            htmlCell.style.maxWidth = 'none';
            htmlCell.style.padding = '4px 6px'; // Reduced padding for measurement
            htmlCell.style.whiteSpace = 'nowrap'; // Prevent wrapping for measurement
          });
          tempBody.appendChild(clonedRow);
        });
        tempTable.appendChild(tempBody);
        tempContainer.appendChild(tempTable);

        // Force layout calculation
        tempTable.offsetWidth;

        // Measure the natural column widths with extra padding for comfort
        const tempHeaderCells = tempTable.querySelectorAll('thead th');
        const realHeaderCells = headerTable.querySelectorAll('thead th');
        
        // Calculate optimal widths for each column
        const columnWidths: number[] = [];
        tempHeaderCells.forEach((tempCell, index) => {
          const headerWidth = (tempCell as HTMLElement).offsetWidth;
          
          // Find the widest data cell in this column
          let maxDataWidth = 0;
          const tempDataCells = tempTable.querySelectorAll(`tbody tr td:nth-child(${index + 1})`);
          tempDataCells.forEach(dataCell => {
            const width = (dataCell as HTMLElement).offsetWidth;
            maxDataWidth = Math.max(maxDataWidth, width);
          });
          
          // Use the larger of header or data width, plus some padding
          const optimalWidth = Math.max(headerWidth, maxDataWidth) + 8; // Reduced to 8px extra padding
          columnWidths[index] = optimalWidth;
        });

        // Apply calculated widths to header table
        realHeaderCells.forEach((headerCell, index) => {
          const htmlCell = headerCell as HTMLElement;
          const width = columnWidths[index];
          if (width) {
            htmlCell.style.width = `${width}px`;
            htmlCell.style.minWidth = `${width}px`;
            htmlCell.style.maxWidth = `${width}px`;
          }
        });

        // Apply same widths to data table by injecting CSS
        const existingStyle = dataTable.querySelector('style[data-auto-calibrate]');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.setAttribute('data-auto-calibrate', 'true');
        let css = '';
        columnWidths.forEach((width, index) => {
          css += `
            .asset-table tbody tr td:nth-child(${index + 1}) {
              width: ${width}px !important;
              min-width: ${width}px !important;
              max-width: ${width}px !important;
              padding: 4px 6px !important;
              white-space: nowrap !important;
            }
            .asset-table thead tr th:nth-child(${index + 1}) {
              padding: 6px 8px !important;
              white-space: nowrap !important;
            }
          `;
        });
        style.textContent = css;
        dataTable.appendChild(style);
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
                          className={cn("cursor-pointer whitespace-nowrap h-16 text-base font-semibold text-center align-middle", col.className)}
                        >
                          <div className="flex items-center justify-center h-full">
                            {col.label}
                            {sortKey === col.id && (
                              <span className="ml-2 inline-block">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
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
                        <TableCell className="text-center">
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
