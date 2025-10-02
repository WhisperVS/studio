
"use client";

import { Boxes } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3 p-2 justify-center">
      <Boxes 
        className="h-8 w-8 shrink-0" 
        style={{ color: 'var(--logo-icon-color)' }}
      />
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span 
          className="font-bold text-xl font-headline leading-tight"
          style={{ color: 'var(--logo-title-color)' }}
        >
          G.A.I.M.
        </span>
        <span 
          className="text-xs leading-tight"
          style={{ color: 'var(--logo-subtitle-color)' }}
        >
          Group Administrators Inventory Manager
        </span>
      </div>
    </div>
  );
}