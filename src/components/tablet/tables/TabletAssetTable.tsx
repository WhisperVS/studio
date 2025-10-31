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
      <div 
        className="rounded-md border bg-card overflow-auto tablet-table-container"
        style={{ height: tableHeight }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 border-b">
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