
"use client";

import { APP_CONFIG } from "@/lib/config";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/shared/ui/sidebar";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Skeleton } from "@/components/shared/ui/skeleton";
import React from "react";

interface CategoryCountsProps {
  counts: Record<string, number>;
  isLoading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isMobile?: boolean;
}

export function CategoryCounts({ counts, isLoading, selectedCategory, onSelectCategory, isMobile = false }: CategoryCountsProps) {

  if (isLoading) {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Families</h3>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: APP_CONFIG.categories.length + 1 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Product Families</SidebarGroupLabel>
        <div className="flex flex-col gap-1">
          {Array.from({ length: APP_CONFIG.categories.length + 1 }).map((_, i) => (
            <SidebarMenuSkeleton key={i} showIcon />
          ))}
        </div>
      </SidebarGroup>
    );
  }
  
  const allCategories = [APP_CONFIG.allCategory, ...APP_CONFIG.categories];
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  if (isMobile) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Families</h3>
        <div className="grid grid-cols-2 gap-2">
          {allCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className="h-auto p-3 flex flex-col items-center gap-1 text-center"
            >
              <div className="flex items-center gap-1">
                {category.icon}
                <span className="text-xs truncate">{category.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.id === 'all' ? totalCount : (counts[category.id] || 0)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <SidebarGroup className="sidebar-group">
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-1">Product Families</SidebarGroupLabel>
      <SidebarMenu className="sidebar-menu space-y-1">
        {allCategories.map((category) => (
          <SidebarMenuItem key={category.id} className="sidebar-menu-item">
            <SidebarMenuButton
              tooltip={category.name}
              isActive={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
              className="w-full justify-between px-2 py-1.5 text-sm"
            >
              <div className="flex items-center gap-2">
                {category.icon}
                <span className="capitalize truncate">{category.name}</span>
              </div>
              <SidebarMenuBadge className="text-xs px-1.5 py-0.5 ml-auto">
                {category.id === 'all' ? totalCount : (counts[category.id] || 0)}
              </SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
