
"use client";

import { Boxes } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3 p-2 justify-center">
      <Boxes className="h-8 w-8 text-primary shrink-0" />
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="font-bold text-xl font-headline leading-tight">
          G.A.I.M.
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          Group Administrator Inventory Manager
        </span>
      </div>
    </div>
  );
}
