
import { Laptop, Network, Printer, Server, HardDrive, LayoutGrid } from "lucide-react";
import React from "react";
import type { BadgeProps } from "@/components/ui/badge";


export const APP_CONFIG = {
  categories: [
    { 
      id: 'laptops', 
      name: 'Laptops', 
      description: 'Portable computers for mobile use.',
      icon: React.createElement(Laptop)
    },
    { 
      id: 'servers', 
      name: 'Servers', 
      description: 'Machines that provide services to other computers.',
      icon: React.createElement(Server)
    },
    { 
      id: 'systems', 
      name: 'Systems', 
      description: 'Desktop computers and workstations.',
      icon: React.createElement(HardDrive)
    },
    { 
      id: 'networks', 
      name: 'Networks', 
      description: 'Networking equipment like routers and switches.',
      icon: React.createElement(Network)
    },
    { 
      id: 'printers', 
      name: 'Printers', 
      description: 'Devices for printing documents.',
      icon: React.createElement(Printer)
    },
    { 
      id: 'misc', 
      name: 'Misc Items', 
      description: 'Miscellaneous hardware and peripherals.',
      icon: React.createElement(LayoutGrid)
    },
  ],
  allCategory: {
    id: 'all',
    name: 'All Assets',
    description: 'View all product families.',
    icon: React.createElement(LayoutGrid)
  },
  locations: ['Schaumburg IL', 'Rockford IL'] as const,
  statuses: [
    { name: 'In Use', variant: 'default' },
    { name: 'Spare', variant: 'secondary' },
    { name: 'For Repair', variant: 'destructive' },
    { name: 'For Parts', variant: 'outline' },
    { name: 'For Recycle', variant: 'destructive' },
  ] as const,
  systemTypes: ['MFF', 'SFF', 'Tower', 'AIO', 'Desktop'] as const,
  serverTypes: ['Rack', 'Tower', 'Blade'] as const,
  manufacturers: [
    'Acer', 'Apple', 'Aruba', 'Asus', 'Brother', 'Canon', 'Cisco', 'Dell', 'Epson', 'Fortinet', 'HP', 'Juniper', 'Lenovo', 'Lexmark', 'Microsoft', 'MikroTik', 'MSI', 'Netgear', 'Samsung', 'SonicWall', 'Supermicro', 'TP-Link', 'Ubiquiti'
  ] as const,
  userTypes: ['local', 'remote'] as const,
  users: ['V.Shtohryn', 'J.Darling'] as const,
  labels: {
    machineName: 'Machine Name',
    category: 'Product Family',
    os: 'OS',
    location: 'Location',
  manufacturer: 'Manufacturer',
    partNumber: 'Part Number',
    modelNumber: 'Model',
    serialNumber: 'Serial Number',
    type: 'Type',
    webui: 'WebUI',
    assignedUser: 'Assigned User',
    userId: 'User ID',
    userType: 'User Type',
    owner: 'Owner',
    status: 'Status',
    notes: 'Notes',
    purchaseDate: 'Purchase Date',
    warrantyExpirationDate: 'Warranty Expiration',
    createdBy: 'Created By',
    updatedBy: 'Last Modified By',
  },
  tableColumns: [
    { id: 'category', label: 'Product Family', defaultVisible: true, className: "" },
    { id: 'status', label: 'Status', defaultVisible: true, className: "" },
    { id: 'machineName', label: 'Machine Name', defaultVisible: true, className: "" },
    { id: 'manufacturer', label: 'Manufacturer', defaultVisible: true, className: "hidden md:table-cell" },
    { id: 'modelNumber', label: 'Model', defaultVisible: true, className: "hidden lg:table-cell" },
    { id: 'type', label: 'Type', defaultVisible: false, className: "hidden lg:table-cell" },
    { id: 'partNumber', label: 'Part Number', defaultVisible: false, className: "hidden lg:table-cell" },
    { id: 'serialNumber', label: 'Serial Number', defaultVisible: false, className: "hidden xl:table-cell" },
    { id: 'os', label: 'OS', defaultVisible: false, className: "hidden xl:table-cell" },
    { id: 'assignedUser', label: 'Assigned User', defaultVisible: true, className: "" },
    { id: 'userId', label: 'User ID', defaultVisible: true, className: "hidden sm:table-cell" },
    { id: 'location', label: 'Location', defaultVisible: false, className: "hidden 2xl:table-cell" },
  ] as const,
} as const;

export const CATEGORY_IDS = APP_CONFIG.categories.map(c => c.id);

export const STATUS_NAMES = [
  APP_CONFIG.statuses[0].name, 
  ...APP_CONFIG.statuses.slice(1).map(s => s.name)
] as const;

export function getStatusVariant(statusName: (typeof STATUS_NAMES)[number]): BadgeProps['variant'] {
  const status = APP_CONFIG.statuses.find(s => s.name === statusName);
  return status ? status.variant : 'default';
}
