
"use client";

import { APP_CONFIG } from "@/lib/config";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import React from "react";

interface CategoryCountsProps {
  counts: Record<string, number>;
  isLoading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryCounts({ counts, isLoading, selectedCategory, onSelectCategory }: CategoryCountsProps) {

  if (isLoading) {
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
            </SidebarMenuButton>
            <SidebarMenuBadge className="text-xs px-1.5 py-0.5">{category.id === 'all' ? totalCount : (counts[category.id] || 0)}</SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
