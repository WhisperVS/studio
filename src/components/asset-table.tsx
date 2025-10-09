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
import { Checkbox } from './ui/checkbox';
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
      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold tracking-tight font-headline">No Assets Found</h3>
        <p className="text-muted-foreground mt-2">
          Get started by adding your first asset to the inventory or try a different search.
        </p>
      </div>
    )
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);
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
    const ribbonEl = ribbonRef.current;
    if (!scrollEl || !ribbonEl) return;

    const onScroll = () => {
      // keep ribbon in sync with table scroll
      ribbonEl.scrollLeft = scrollEl.scrollLeft;
    };
    const onRibbonScroll = () => {
      // allow user to drag the ribbon to scroll the table
      scrollEl.scrollLeft = ribbonEl.scrollLeft;
    };

    scrollEl.addEventListener('scroll', onScroll);
    ribbonEl.addEventListener('scroll', onRibbonScroll);

    const setSpacerWidth = () => {
      const inner = ribbonEl.querySelector('.ribbon-spacer') as HTMLDivElement | null;
      if (inner) inner.style.width = `${scrollEl.scrollWidth}px`;
      // Show ribbon only when table is wider than its visible area
      if (scrollEl.scrollWidth > scrollEl.clientWidth) {
        ribbonEl.style.display = 'block';
      } else {
        ribbonEl.style.display = 'none';
      }
    };

    setSpacerWidth();

    const resizeObserver = new ResizeObserver(() => setSpacerWidth());
    resizeObserver.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      ribbonEl.removeEventListener('scroll', onRibbonScroll);
      resizeObserver.disconnect();
    };
  }, []);

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
      <div className="rounded-md border overflow-hidden flex-1 isolate">
        <div className="relative w-full h-full flex flex-col">
          {/* Scrollable table area - fixed height so table content scrolls internally */}
          <div ref={scrollRef} className="w-full overflow-auto relative scrollbar-neon" style={{ height: tableHeight ?? '98%', paddingBottom: '1.5rem', paddingRight: '1rem' }}>
            <Table style={ forceHorizontal ? { minWidth: `${tableMinWidthPx}px` } : undefined }>
              <TableHeader>
                <TableHeaderRow>
                  <TableHead className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0 text-center sticky top-0 z-20">
                    <ExternalLink className="h-4 w-4 inline-block" />
                    <span className="sr-only">Connect</span>
                  </TableHead>
                  <TableHead className="w-10 min-w-[2.5rem] max-w-[2.5rem] p-0 text-center sticky top-0 z-20">
                    <CheckSquare className="h-4 w-4 inline-block" />
                    <span className="sr-only">Select</span>
                  </TableHead>
                  {APP_CONFIG.tableColumns.map(col => columnVisibility[col.id] && (
                      <TableHead 
                        key={col.id}
                        onClick={() => handleSort(col.id as keyof Asset)}
                        className={cn("cursor-pointer sticky top-0 z-10", col.className)}
                      >
                        {col.label}
                      </TableHead>
                  ))}
                  <TableHead className="w-12 sticky top-0 z-10"><span className="sr-only">Actions</span></TableHead>
                </TableHeaderRow>
              </TableHeader>
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
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
