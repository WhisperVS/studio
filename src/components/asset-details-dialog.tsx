
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
import { APP_CONFIG, getStatusVariant } from "@/lib/config";
import { ExternalLink } from "lucide-react";

interface AssetDetailsDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AssetDetailsDialog({ asset, isOpen, onOpenChange }: AssetDetailsDialogProps) {
  if (!asset) return null;

  const getCategoryName = (categoryId: string) => {
    const category = APP_CONFIG.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base">{value || 'N/A'}</div>
    </div>
  )

  const handleConnect = () => {
    if (asset?.webui) {
      window.open(asset.webui, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Viewing details for asset: <strong>{asset.machineName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 py-4">
          <DetailItem label={APP_CONFIG.labels.machineName} value={asset.machineName} />
          <DetailItem label={APP_CONFIG.labels.category} value={getCategoryName(asset.category)} />
          <DetailItem label={APP_CONFIG.labels.manufacturer} value={asset.manufacturer} />
          <DetailItem label={APP_CONFIG.labels.location} value={asset.location} />
          <DetailItem label={APP_CONFIG.labels.status} value={<Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>} />
          <DetailItem label={APP_CONFIG.labels.assignedUser} value={asset.assignedUser} />
          <DetailItem label={APP_CONFIG.labels.userId} value={asset.userId} />
          <DetailItem label={APP_CONFIG.labels.os} value={asset.os} />
          <DetailItem label={APP_CONFIG.labels.modelNumber} value={asset.modelNumber} />
          <DetailItem label={APP_CONFIG.labels.partNumber} value={asset.partNumber} />
          <DetailItem label={APP_CONFIG.labels.serialNumber} value={asset.serialNumber} />
          {(asset.category === 'systems' || asset.category === 'servers') && (
            <DetailItem label={APP_CONFIG.labels.type} value={asset.type} />
          )}
          {asset.webui && (
            <DetailItem 
              label={APP_CONFIG.labels.webui} 
              value={
                <a href={asset.webui} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
                  {asset.webui}
                </a>
              } 
            />
          )}
          <DetailItem label={APP_CONFIG.labels.purchaseDate} value={asset.purchaseDate ? format(asset.purchaseDate, 'PPP') : 'N/A'} />
          <DetailItem label={APP_CONFIG.labels.warrantyExpirationDate} value={asset.warrantyExpirationDate ? format(asset.warrantyExpirationDate, 'PPP') : 'N/A'} />
          <DetailItem label={APP_CONFIG.labels.createdBy} value={asset.createdBy} />
          <DetailItem label={APP_CONFIG.labels.updatedBy} value={asset.updatedBy} />
          <DetailItem label={APP_CONFIG.labels.owner} value={asset.owner} />
          <div className="md:col-span-2">
            <DetailItem label={APP_CONFIG.labels.notes} value={asset.notes} />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div>
            {asset.webui && (
              <Button onClick={handleConnect} variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
