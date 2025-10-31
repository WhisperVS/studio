"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "@/components/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shared/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shared/ui/alert-dialog";
import { Button } from "@/components/shared/ui/button";
import { MoreHorizontal, Trash2, Pencil, Info, ExternalLink, CheckSquare, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import type { Asset } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { APP_CONFIG, getStatusVariant } from '@/lib/config';
import { Checkbox } from '@/components/shared/ui/checkbox';
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
  tableHeight?: string;
}

export const TabletAssetTable = React.memo(function TabletAssetTable({ 
  assets, 
  onEdit, 
  onInfo, 
  onDelete, 
  selectedAssetIds, 
  onSelectedAssetIdsChange, 
  columnVisibility, 
  tableHeight = 'calc(100vh - 280px)' 
}: AssetTableProps) {
  const { toast } = useToast();
  const [sortKey, setSortKey] = useState<SortKey>('machineName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);

  const handleRowSelect = useRef((assetId: string, checked: boolean) => {
    onSelectedAssetIdsChange(
      checked
        ? [...selectedAssetIds, assetId]
        : selectedAssetIds.filter(id => id !== assetId)
    );
  });
  
  useEffect(() => {
    handleRowSelect.current = (assetId: string, checked: boolean) => {
      onSelectedAssetIdsChange(
        checked
          ? [...selectedAssetIds, assetId]
          : selectedAssetIds.filter(id => id !== assetId)
      );
    };
  }, [selectedAssetIds, onSelectedAssetIdsChange]);

  // Synchronize header and body horizontal scrolling + auto-calibrate column widths
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const headerScrollEl = headerScrollRef.current;
    if (!scrollEl || !headerScrollEl) return;

    const autoCalibrate = () => {
      const headerTable = headerScrollEl.querySelector('table');
      const dataTable = scrollEl.querySelector('table');
      
      if (!headerTable || !dataTable) return;

      // Create temporary container for measurement
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = 'max-content';
      document.body.appendChild(tempContainer);

      // Create temporary table to measure natural widths
      const tempTable = document.createElement('table');
      tempTable.className = 'border-collapse';
      tempTable.style.tableLayout = 'auto';
      tempTable.style.width = 'max-content';
      tempTable.style.borderCollapse = 'collapse';

      // Clone header
      const tempHeader = headerTable.querySelector('thead')?.cloneNode(true) as HTMLElement;
      if (tempHeader) {
        const headerCells = tempHeader.querySelectorAll('th');
        headerCells.forEach(cell => {
          const htmlCell = cell as HTMLElement;
          htmlCell.style.width = 'auto';
          htmlCell.style.minWidth = 'auto';
          htmlCell.style.maxWidth = 'none';
          htmlCell.style.padding = '1rem 0.25rem';
          htmlCell.style.whiteSpace = 'nowrap';
          htmlCell.style.borderRight = '1px solid transparent';
          htmlCell.style.boxSizing = 'border-box';
        });
        tempTable.appendChild(tempHeader);
      }

      // Clone ALL data rows
      const tempBody = document.createElement('tbody');
      const dataRows = dataTable.querySelectorAll('tbody tr');
      dataRows.forEach(row => {
        const clonedRow = row.cloneNode(true) as HTMLElement;
        const dataCells = clonedRow.querySelectorAll('td');
        dataCells.forEach(cell => {
          const htmlCell = cell as HTMLElement;
          htmlCell.style.width = 'auto';
          htmlCell.style.minWidth = 'auto';
          htmlCell.style.maxWidth = 'none';
          htmlCell.style.padding = '0.75rem 1rem';
          htmlCell.style.whiteSpace = 'nowrap';
          htmlCell.style.borderRight = '1px solid transparent';
          htmlCell.style.boxSizing = 'border-box';
        });
        tempBody.appendChild(clonedRow);
      });
      tempTable.appendChild(tempBody);
      tempContainer.appendChild(tempTable);

      // Force layout calculation
      tempTable.offsetWidth;

      // Measure optimal column widths
      const tempHeaderCells = tempTable.querySelectorAll('thead th');
      const realHeaderCells = headerTable.querySelectorAll('thead th');
      const columnWidths: number[] = [];

      tempHeaderCells.forEach((tempCell, index) => {
        const headerWidth = (tempCell as HTMLElement).offsetWidth;
        
        // Find widest data cell in this column
        let maxDataWidth = 0;
        const tempDataCells = tempTable.querySelectorAll(`tbody tr td:nth-child(${index + 1})`);
        tempDataCells.forEach(dataCell => {
          const width = (dataCell as HTMLElement).offsetWidth;
          maxDataWidth = Math.max(maxDataWidth, width);
        });
        
        // Use the larger width
        const optimalWidth = Math.max(headerWidth, maxDataWidth);
        columnWidths[index] = optimalWidth;
      });

      // Clean up temp container
      document.body.removeChild(tempContainer);

      // Apply widths to header cells
      realHeaderCells.forEach((headerCell, index) => {
        const htmlCell = headerCell as HTMLElement;
        const width = columnWidths[index];
        if (width) {
          htmlCell.style.width = `${width}px`;
          htmlCell.style.minWidth = `${width}px`;
          htmlCell.style.maxWidth = `${width}px`;
          htmlCell.style.boxSizing = 'border-box';
        }
      });

      // Apply same widths to data table cells using CSS
      const existingStyle = dataTable.querySelector('style[data-auto-calibrate]');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.setAttribute('data-auto-calibrate', 'true');
      let css = '';
      columnWidths.forEach((width, index) => {
        css += `
          table tbody tr td:nth-child(${index + 1}) {
            width: ${width}px !important;
            min-width: ${width}px !important;
            max-width: ${width}px !important;
            box-sizing: border-box;
          }
        `;
      });
      style.textContent = css;
      dataTable.appendChild(style);
    };

    const onDataScroll = () => {
      headerScrollEl.scrollLeft = scrollEl.scrollLeft;
    };

    scrollEl.addEventListener('scroll', onDataScroll, { passive: true });

    // Initial calibration
    setTimeout(() => autoCalibrate(), 0);

    // Recalibrate on resize
    const resizeObserver = new ResizeObserver(() => {
      autoCalibrate();
    });
    resizeObserver.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener('scroll', onDataScroll);
      resizeObserver.disconnect();
    };
  }, [assets, columnVisibility]);

  const handleSort = (column: SortKey) => {
    if (sortKey === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(column);
      setSortOrder('asc');
    }
  };

  const sortedAssets = useMemo(() => {
    if (!sortKey) return assets;

    return [...assets].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [assets, sortKey, sortOrder]);

  const handleDelete = async (asset: Asset) => {
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

      onDelete();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not delete asset."
      });
    } finally {
      setIsAlertOpen(false);
      setAssetToDelete(null);
    }
  };

  const handleDeleteClick = (assetId: string) => {
    setAssetToDelete(assetId);
    setIsAlertOpen(true);
  };

  const openWebUI = (webui: string) => {
    if (webui) {
      window.open(webui, '_blank', 'noopener,noreferrer');
    }
  };

  const visibleColumns = APP_CONFIG.tableColumns.filter(col => columnVisibility[col.id]);
  const hasAnyAssets = assets && assets.length > 0;

  const SortableHeader = ({ column, children }: { column: SortKey; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer select-none hover:bg-accent/50 transition-colors min-h-[44px] px-4"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{children}</span>
        <ChevronsUpDown className="ml-2 checkbox-icon-size opacity-50" />
      </div>
    </TableHead>
  );

  const isAllSelected = hasAnyAssets && selectedAssetIds.length === assets.length;
  const isIndeterminate = selectedAssetIds.length > 0 && selectedAssetIds.length < assets.length;

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden flex flex-col" style={{ height: tableHeight }}>
        
        {/* Separate Header Container - Frozen */}
        <div className="flex-shrink-0 table-header-bg border-b">
          <div ref={headerScrollRef} className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableHeaderRow>
                  <TableHead className="w-8 min-w-[2rem] max-w-[2rem] p-1 text-center">
                    <ExternalLink className="h-[17px] w-[17px] inline-block stroke-[2.5]" />
                    <span className="sr-only">Connect</span>
                  </TableHead>
                  <TableHead className="w-8 min-w-[2rem] max-w-[2rem] p-1 text-center">
                    <CheckSquare className="h-[17px] w-[17px] inline-block stroke-[2.5]" />
                    <span className="sr-only">Select</span>
                  </TableHead>
                  {visibleColumns.map((column) => (
                    <TableHead 
                      key={column.id}
                      onClick={() => handleSort(column.id as SortKey)}
                      className="cursor-pointer whitespace-nowrap h-16 text-base font-semibold text-center align-middle"
                    >
                      <div className="flex items-center justify-center h-full">
                        {column.label}
                        {sortKey === column.id && (
                          <span className="ml-2 inline-block">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-10 min-h-[44px] px-2">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableHeaderRow>
              </TableHeader>
            </Table>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div ref={scrollRef} className="flex-1 overflow-auto tablet-table-container">
          <Table>
            <TableBody>
            {sortedAssets.map((asset) => (
              <TableRow 
                key={asset.id} 
                className={cn(
                  "hover:bg-accent/50 transition-colors cursor-pointer",
                  selectedAssetIds.includes(asset.id) && "bg-accent/30"
                )}
                onClick={() => onInfo(asset)}
              >
                <TableCell className="w-8 p-1 text-center" onClick={(e) => e.stopPropagation()}>
                  {asset.webui && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-primary hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWebUI(asset.webui!);
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">Connect to {asset.machineName}</span>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="w-8 p-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      className="h-3.5 w-3.5 shrink-0"
                      checked={selectedAssetIds.includes(asset.id)}
                      onCheckedChange={(checked: boolean) => {
                        handleRowSelect.current(asset.id, !!checked);
                      }}
                    />
                  </div>
                </TableCell>
                {visibleColumns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    className="min-h-[52px] px-4"
                  >
                    {column.id === 'category' && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {APP_CONFIG.categories.find(cat => cat.id === asset.category)?.name || asset.category}
                      </Badge>
                    )}
                    {column.id === 'status' && (
                      <Badge variant={getStatusVariant(asset.status)} className="text-xs px-2 py-1">
                        {asset.status}
                      </Badge>
                    )}
                    {!['category', 'status'].includes(column.id) && (
                      <span className="text-sm">
                        {(asset as any)[column.id] || '—'}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="min-h-[52px] px-2" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="btn-size-icon p-0 hover:bg-accent"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="checkbox-icon-size" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onInfo(asset);
                        }}
                        className="flex items-center text-sm py-3 px-3"
                      >
                        <Info className="mr-3 checkbox-icon-size" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onEdit(asset);
                        }}
                        className="flex items-center text-sm py-3 px-3"
                      >
                        <Pencil className="mr-3 checkbox-icon-size" />
                        Edit Asset
                      </DropdownMenuItem>
                      {asset.webui && (
                        <DropdownMenuItem 
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            openWebUI(asset.webui!);
                          }}
                          className="flex items-center text-sm py-3 px-3"
                        >
                          <ExternalLink className="mr-3 checkbox-icon-size" />
                          Open Web UI
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDeleteClick(asset.id);
                        }}
                        className="flex items-center text-destructive text-sm py-3 px-3"
                      >
                        <Trash2 className="mr-3 checkbox-icon-size" />
                        Delete Asset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-size-lg px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                const asset = assets.find(a => a.id === assetToDelete);
                if (asset) handleDelete(asset);
              }}
              className="btn-size-lg px-6 bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

TabletAssetTable.displayName = 'TabletAssetTable';