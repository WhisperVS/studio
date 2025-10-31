"use client";

import { APP_CONFIG } from "@/lib/config";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Skeleton } from "@/components/shared/ui/skeleton";
import React from "react";

interface TabletCategoryCountsProps {
  counts: Record<string, number>;
  isLoading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function TabletCategoryCounts({ 
  counts, 
  isLoading, 
  selectedCategory, 
  onSelectCategory 
}: TabletCategoryCountsProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Product Families</h3>
        <div className="grid grid-cols-1 gap-1">
          {Array.from({ length: APP_CONFIG.categories.length + 1 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  const allCategories = [APP_CONFIG.allCategory, ...APP_CONFIG.categories];
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Product Families</h3>
      <div className="grid grid-cols-1 gap-1">
        {allCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className="h-10 w-full justify-between p-3 text-left hover:bg-accent transition-colors category-button"
          >
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 text-sm">
                {category.icon}
              </div>
              <span className="text-sm font-medium truncate">{category.name}</span>
            </div>
            <Badge 
              variant={selectedCategory === category.id ? "secondary" : "outline"} 
              className="text-xs px-1.5 py-0.5 ml-1 flex-shrink-0"
            >
              {category.id === 'all' ? totalCount : (counts[category.id] || 0)}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}