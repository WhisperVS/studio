"use client";

import { Boxes } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function Logo() {
  const { state } = useSidebar();
  
  return (
    <div className="flex items-center gap-2 p-2 justify-center">
      <Boxes className="h-8 w-8 text-primary" />
      <span className="font-bold text-xl font-headline group-data-[collapsible=icon]:hidden">
        AssetZen
      </span>
    </div>
  );
}
