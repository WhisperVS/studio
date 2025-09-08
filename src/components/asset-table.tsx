
"use client";

import { useMemo, useState, useEffect } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil, Info } from "lucide-react";
import { MoreHorizontal, Trash2, Pencil, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';

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

  const handleDelete = async (assetId: string) => {
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
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
    }
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

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold tracking-tight font-headline">Loading Assets...</h3>
        <p className="text-muted-foreground mt-2">
          Please wait while we load your inventory.
        </p>
      </div>
    );
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
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('machineName')} className="cursor-pointer">Machine Name</TableHead>
            <TableHead onClick={() => handleSort('category')} className="cursor-pointer">Category</TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status</TableHead>
            <TableHead onClick={() => handleSort('assignedUser')} className="cursor-pointer">Assigned User</TableHead>
            <TableHead onClick={() => handleSort('location')} className="cursor-pointer hidden md:table-cell">Location</TableHead>
            <TableHead onClick={() => handleSort('purchaseDate')} className="cursor-pointer hidden lg:table-cell">Purchase Date</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.machineName}</TableCell>
              <TableCell className="capitalize">{asset.category}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
              </TableCell>
              <TableCell>{asset.assignedUser || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">{asset.location}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {asset.purchaseDate ? format(new Date(asset.purchaseDate), 'PPP') : 'N/A'}
              </TableCell>
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      onClick={() => handleDelete(asset.id)}
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
  );
}