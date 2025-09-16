
import type { AssetCategory } from "./types";
import { dellCatalog } from './catalog/dell';
import { hpCatalog } from './catalog/hp';
import { lenovoCatalog } from './catalog/lenovo';
import { microsoftCatalog } from './catalog/microsoft';
import { appleCatalog } from './catalog/apple';
import { asusCatalog } from './catalog/asus';
import { acerCatalog } from './catalog/acer';
import { msiCatalog } from './catalog/msi';
import { samsungCatalog } from './catalog/samsung';
import { ciscoCatalog } from './catalog/cisco';
import { supermicroCatalog } from './catalog/supermicro';
import { canonCatalog } from './catalog/canon';
import { epsonCatalog } from './catalog/epson';
import { brotherCatalog } from './catalog/brother';
import { lexmarkCatalog } from './catalog/lexmark';
import { netgearCatalog } from './catalog/netgear';
import { sonicwallCatalog } from './catalog/sonicwall';
import { ubiquitiCatalog } from './catalog/ubiquiti';
import { juniperCatalog } from './catalog/juniper';
import { fortinetCatalog } from './catalog/fortinet';
import { tplinkCatalog } from './catalog/tplink';
import { mikrotikCatalog } from './catalog/mikrotik';
import { arubaCatalog } from "./catalog/aruba";
import { osCatalog as os } from './catalog/os';

export const manufacturerCatalog: Record<string, Partial<Record<AssetCategory, {
  keywords: string[];
  types?: Record<string, string[]>;
}>>> = {
  Dell: dellCatalog,
  HP: hpCatalog,
  Lenovo: lenovoCatalog,
  Microsoft: microsoftCatalog,
  Apple: appleCatalog,
  Asus: asusCatalog,
  Acer: acerCatalog,
  MSI: msiCatalog,
  Samsung: samsungCatalog,
  Cisco: ciscoCatalog,
  Supermicro: supermicroCatalog,
  Canon: canonCatalog,
  Epson: epsonCatalog,
  Brother: brotherCatalog,
  Lexmark: lexmarkCatalog,
  Netgear: netgearCatalog,
  SonicWall: sonicwallCatalog,
  Ubiquiti: ubiquitiCatalog,
  Juniper: juniperCatalog,
  Fortinet: fortinetCatalog,
  'TP-Link': tplinkCatalog,
  MikroTik: mikrotikCatalog,
  Aruba: arubaCatalog,
};

export const osCatalog = os;
