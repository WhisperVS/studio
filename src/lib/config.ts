
import { Laptop, Network, Printer, Server, HardDrive, Component, LayoutGrid } from "lucide-react";
import React from "react";

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
      id: 'other', 
      name: 'Other', 
      description: 'Miscellaneous hardware and peripherals.',
      icon: React.createElement(Component)
    },
  ],
  allCategory: {
    id: 'all',
    name: 'All Assets',
    description: 'View all asset categories.',
    icon: React.createElement(LayoutGrid)
  },
  locations: ['Schaumburg IL', 'Rockford IL'] as const,
  statuses: ['In Use', 'For Repair', 'Spare', 'For Parts', 'For Recycle'] as const,
  systemTypes: ['MFF', 'Tower', 'AIO', 'Desktop'] as const,
  serverTypes: ['Rack', 'Tower', 'Blade'] as const,
  manufacturers: [
    'Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Asus', 'Acer', 'MSI', 'Samsung', 'Cisco'
  ] as const,
  userTypes: ['local', 'remote'] as const,
  users: ['V.Shtohryn', 'J.Darling'] as const,
  labels: {
    machineName: 'Machine Name',
    category: 'Category',
    os: 'OS',
    location: 'Location',
    manufacturer: 'Manufacture',
    partNumber: 'Part Number',
    modelNumber: 'Model Number',
    serialNumber: 'Serial Number',
    type: 'Type',
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
} as const;

export const CATEGORY_IDS = APP_CONFIG.categories.map(c => c.id);
