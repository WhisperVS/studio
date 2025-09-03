
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/types";
import { format } from "date-fns";

interface AssetInfoDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DetailItem = ({ label, value }: { label: string; value?: string | null | Date }) => {
  if (!value) return null;
  
  const displayValue = value instanceof Date ? format(new Date(value), 'PPP') : value;

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{displayValue}</p>
    </div>
  );
};


export function AssetInfoDialog({ asset, isOpen, onOpenChange }: AssetInfoDialogProps) {
  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Viewing details for {asset.machineName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
          <DetailItem label="Machine Name" value={asset.machineName} />
          <DetailItem label="Category" value={asset.category} />
          <DetailItem label="Manufacturer" value={asset.manufacturer} />
          <DetailItem label="Location" value={asset.location} />
          <DetailItem label="Model Number" value={asset.modelNumber} />
          <DetailItem label="Part Number" value={asset.partNumber} />
          <DetailItem label="Serial Number" value={asset.serialNumber} />
          <DetailItem label="Status" value={asset.status} />
          <DetailItem label="Assigned User" value={asset.assignedUser} />
          <DetailItem label="User Type" value={asset.userType} />
          <DetailItem label="System OS" value={asset.systemOS} />
          <DetailItem label="Type" value={asset.type} />
          <DetailItem label="Toner" value={asset.toner} />
          <DetailItem label="Owner" value={asset.owner} />
          <DetailItem label="Purchase Date" value={asset.purchaseDate} />
          <DetailItem label="Warranty Expiration" value={asset.warrantyExpirationDate} />
        </div>
        <div className="space-y-1">
             <p className="text-sm font-medium text-muted-foreground">Notes</p>
             <p className="text-base p-3 bg-muted rounded-md min-h-[60px]">
                {asset.notes || 'No notes for this asset.'}
            </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
