
"use client";

import { APP_CONFIG, CATEGORY_IDS } from "@/lib/config";
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
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
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
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {allCategories.map((category) => (
          <SidebarMenuItem key={category.id}>
            <SidebarMenuButton
              tooltip={category.name}
              isActive={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.icon}
              <span className="capitalize">{category.name}</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{category.id === 'all' ? totalCount : (counts[category.id] || 0)}</SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
