"use client";

import { useMemo, useState } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, PlusCircle, Search } from "lucide-react";
import { AssetTable } from "@/components/asset-table";
import { AddAssetDialog } from "@/components/add-asset-dialog";
import { EditAssetDialog } from "@/components/edit-asset-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useAssets } from "@/contexts/assets-context";
import { type Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [isAddAssetOpen, setAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setEditAssetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { assets } = useAssets();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    if (assets.length === 0) {
      toast({
        variant: 'destructive',
        title: "Export Failed",
        description: "There are no assets to export."
      });
      return;
    }
    const headers = Object.keys(assets[0]);
    const csvContent = [
      headers.join(','),
      ...assets.map(row => 
        headers.map(header => {
            const value = (row as any)[header];
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `assetzen_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: "Export Successful",
        description: "Your asset inventory has been exported as a CSV file."
    })
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditAssetOpen(true);
  }

  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    return assets.filter(asset =>
      asset.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedUser?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            {/* Navigation items can go here if more pages are added */}
          </SidebarContent>
          <SidebarFooter className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold tracking-tight font-headline">
                Inventory Dashboard
              </h1>
            </div>
             <div className="flex items-center gap-2 flex-1 max-w-sm">
               <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search assets..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
               </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
              <Button size="sm" onClick={() => setAddAssetOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </div>
          </header>
          <main className="p-4">
            <AssetTable assets={filteredAssets} onEdit={handleEdit} />
          </main>
        </SidebarInset>
        <AddAssetDialog isOpen={isAddAssetOpen} onOpenChange={setAddAssetOpen} />
        <EditAssetDialog asset={selectedAsset} isOpen={isEditAssetOpen} onOpenChange={setEditAssetOpen} />
      </div>
    </SidebarProvider>
  );
}
