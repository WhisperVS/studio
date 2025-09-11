
"use client";

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
import { MoreHorizontal, Trash2, Pencil, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { APP_CONFIG } from '@/lib/config';

type SortKey = keyof Asset | '';

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onInfo: (asset: Asset) => void;
  onDelete: () => void;
}

export function AssetTable({ assets, onEdit, onInfo, onDelete }: AssetTableProps) {
  const { toast } = useToast();
  const [sortKey, setSortKey] = useState<SortKey>('machineName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

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
      const aValue = a[sortKey];
      const bValue = b[sortKey];

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

  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'In Use':
        return 'default';
      case 'Spare':
        return 'secondary';
      case 'In Repair':
        return 'destructive';
      case 'For Parts':
        return 'outline';
      default:
        return 'default';
    }
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

  return (
    <>
      <div className="rounded-lg border overflow-hidden h-full">
        <div className="relative w-full h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('category')} className="cursor-pointer">{APP_CONFIG.labels.category}</TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">{APP_CONFIG.labels.status}</TableHead>
                <TableHead onClick={() => handleSort('machineName')} className="cursor-pointer">{APP_CONFIG.labels.machineName}</TableHead>
                <TableHead onClick={() => handleSort('manufacturer')} className="cursor-pointer hidden md:table-cell">{APP_CONFIG.labels.manufacturer}</TableHead>
                <TableHead onClick={() => handleSort('modelNumber')} className="cursor-pointer hidden lg:table-cell">Model</TableHead>
                <TableHead onClick={() => handleSort('os')} className="cursor-pointer hidden xl:table-cell">{APP_CONFIG.labels.os}</TableHead>
                <TableHead onClick={() => handleSort('assignedUser')} className="cursor-pointer">{APP_CONFIG.labels.assignedUser}</TableHead>
                <TableHead onClick={() => handleSort('userId')} className="cursor-pointer hidden sm:table-cell">{APP_CONFIG.labels.userId}</TableHead>
                <TableHead onClick={() => handleSort('location')} className="cursor-pointer hidden 2xl:table-cell">{APP_CONFIG.labels.location}</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="capitalize">{asset.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{asset.machineName}</TableCell>
                  <TableCell className="hidden md:table-cell">{asset.manufacturer}</TableCell>
                  <TableCell className="hidden lg:table-cell">{asset.modelNumber}</TableCell>
                  <TableCell className="hidden xl:table-cell">{asset.os}</TableCell>
                  <TableCell>{asset.assignedUser || 'N/A'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{asset.userId || 'N/A'}</TableCell>
                  <TableCell className="hidden 2xl:table-cell">{asset.location}</TableCell>
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
              ))}
            </TableBody>
          </Table>
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
