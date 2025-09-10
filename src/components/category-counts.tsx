
"use client";

import { CATEGORIES } from "@/lib/constants";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { Laptop, Network, Printer, Server, HardDrive, Component, LayoutGrid } from "lucide-react";
import React from "react";

interface CategoryCountsProps {
  counts: Record<string, number>;
  isLoading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: <LayoutGrid />,
  laptops: <Laptop />,
  servers: <Server />,
  systems: <HardDrive />,
  networks: <Network />,
  printers: <Printer />,
  other: <Component />,
};

export function CategoryCounts({ counts, isLoading, selectedCategory, onSelectCategory }: CategoryCountsProps) {

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <SidebarMenuSkeleton key={i} showIcon />
          ))}
        </div>
      </SidebarGroup>
    );
  }

  const allCategories = ['all', ...CATEGORIES];
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {allCategories.map((category) => (
          <SidebarMenuItem key={category}>
            <SidebarMenuButton
              tooltip={category}
              isActive={selectedCategory === category}
              onClick={() => onSelectCategory(category)}
            >
              {categoryIcons[category]}
              <span className="capitalize">{category}</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{category === 'all' ? totalCount : (counts[category] || 0)}</SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
