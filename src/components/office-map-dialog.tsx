"use client";

import Image from "next/image";
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
import { OFFICE_SEAT_LOCATIONS } from "@/lib/constants";
import { Badge } from "./ui/badge";

interface OfficeMapDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function OfficeMapDialog({ asset, isOpen, onOpenChange }: OfficeMapDialogProps) {
  if (!asset) return null;

  const locationKey = asset.officeLocation || '';
  const coordinates = OFFICE_SEAT_LOCATIONS[locationKey as keyof typeof OFFICE_SEAT_LOCATIONS];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Office Location: {asset.officeLocation}</DialogTitle>
          <DialogDescription>
            Showing location for asset <strong>{asset.machineName}</strong> assigned to <strong>{asset.assignedUser || 'N/A'}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full overflow-hidden border rounded-lg bg-muted">
           <div className="relative w-full" style={{aspectRatio: '16/9'}}>
            <Image
              src="/floor-plan.jpg"
              alt="Office Floor Plan"
              fill
              className="object-contain"
              data-ai-hint="office floor plan"
            />
            {coordinates && (
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-primary-foreground animate-pulse"
                style={{
                  left: `${coordinates.x}%`,
                  top: `${coordinates.y}%`,
                }}
                title={`Location: ${asset.officeLocation}`}
              />
            )}
           </div>
           {!coordinates && asset.officeLocation && (
             <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Badge variant="destructive">Location {asset.officeLocation} not found on map</Badge>
             </div>
            )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
