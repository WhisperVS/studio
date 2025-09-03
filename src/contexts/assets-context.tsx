"use client";

import { createContext, useContext, ReactNode } from "react";
import { z } from 'zod';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Asset, AssetSchema } from "@/lib/types";

const StoredAssetSchema = AssetSchema.extend({
  purchaseDate: z.string().optional(),
  warrantyExpirationDate: z.string().optional(),
});

type StoredAsset = z.infer<typeof StoredAssetSchema>;

interface AssetsContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

const toStoredAsset = (asset: Asset): StoredAsset => ({
    ...asset,
    purchaseDate: asset.purchaseDate?.toISOString(),
    warrantyExpirationDate: asset.warrantyExpirationDate?.toISOString(),
});

const fromStoredAsset = (storedAsset: StoredAsset): Asset => ({
    ...storedAsset,
    purchaseDate: storedAsset.purchaseDate ? new Date(storedAsset.purchaseDate) : undefined,
    warrantyExpirationDate: storedAsset.warrantyExpirationDate ? new Date(storedAsset.warrantyExpirationDate) : undefined,
});


export function AssetProvider({ children }: { children: ReactNode }) {
  const [storedAssets, setStoredAssets] = useLocalStorage<StoredAsset[]>("assets", []);

  const assets = storedAssets.map(fromStoredAsset);

  const addAsset = (asset: Asset) => {
    const newStoredAssets = [...storedAssets, toStoredAsset(asset)];
    setStoredAssets(newStoredAssets);
  };

  const updateAsset = (id: string, updatedAsset: Partial<Asset>) => {
    const newStoredAssets = storedAssets.map((asset) =>
      asset.id === id ? toStoredAsset({ ...fromStoredAsset(asset), ...updatedAsset }) : asset
    );
    setStoredAssets(newStoredAssets);
  };

  const deleteAsset = (id: string) => {
    const newStoredAssets = storedAssets.filter((asset) => asset.id !== id);
    setStoredAssets(newStoredAssets);
  };

  return (
    <AssetsContext.Provider value={{ assets, addAsset, updateAsset, deleteAsset }}>
      {children}
    </AssetsContext.Provider>
  );
}

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};
