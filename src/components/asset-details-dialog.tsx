
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asset } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

interface AssetDetailsDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AssetDetailsDialog({ asset, isOpen, onOpenChange }: AssetDetailsDialogProps) {
  if (!asset) return null;

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

  const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base">{value || 'N/A'}</div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Viewing details for asset: <strong>{asset.machineName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="Machine Name" value={asset.machineName} />
          <DetailItem label="Category" value={<span className="capitalize">{asset.category}</span>} />
          <DetailItem label="Manufacturer" value={asset.manufacturer} />
          <DetailItem label="Building Location" value={asset.location} />
          <DetailItem label="Status" value={<Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>} />
          <DetailItem label="Assigned User" value={asset.assignedUser} />
          <DetailItem label="User ID" value={asset.userId} />
          <DetailItem label="OS" value={asset.os} />
          <DetailItem label="Model Number" value={asset.modelNumber} />
          <DetailItem label="Part Number" value={asset.partNumber} />
          <DetailItem label="Serial Number" value={asset.serialNumber} />
          {(asset.category === 'systems' || asset.category === 'servers') && (
            <DetailItem label="Type" value={asset.type} />
          )}
          <DetailItem label="Purchase Date" value={asset.purchaseDate ? format(asset.purchaseDate, 'PPP') : 'N/A'} />
          <DetailItem label="Warranty Expiration" value={asset.warrantyExpirationDate ? format(asset.warrantyExpirationDate, 'PPP') : 'N/A'} />
          <DetailItem label="Created By" value={asset.createdBy} />
          <DetailItem label="Last Modified By" value={asset.updatedBy} />
          <DetailItem label="Owner" value={asset.owner} />
          <div className="md:col-span-2">
            <DetailItem label="Notes" value={asset.notes} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
