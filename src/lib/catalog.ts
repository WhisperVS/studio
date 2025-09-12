
import type { AssetCategory } from "./types";

// Manufacturer catalog expanded across ALL listed vendors with representative models from ~2015–2025.
// Notes:
// - Keep keywords broad (series) + many concrete models for better matching.
// - This is not exhaustive; it’s a curated, reasonably sized span per brand and year range.
// - Structure unchanged: manufacturer -> AssetCategory -> { keywords, types? }

export const manufacturerCatalog: Record<string, Partial<Record<AssetCategory, {
  keywords: string[];
  types?: Record<string, string[]>;
}>>> = {
  Dell: {
    laptops: {
      keywords: [
        // Latitude
        "Latitude",
        "Latitude E5250", "Latitude E5450", "Latitude E5470", "Latitude E5570",
        "Latitude 3380", "Latitude 3390 2-in-1",
        "Latitude 5280", "Latitude 5290", "Latitude 5300", "Latitude 5310",
        "Latitude 5410", "Latitude 5420", "Latitude 5430", "Latitude 5440", "Latitude 5450",
        "Latitude 5520", "Latitude 5530", "Latitude 5540", "Latitude 5550",
        "Latitude 7280", "Latitude 7290", "Latitude 7300", "Latitude 7310", "Latitude 7320", "Latitude 7330", "Latitude 7340", "Latitude 7350",
        "Latitude 7400", "Latitude 7410", "Latitude 7420", "Latitude 7430", "Latitude 7440", "Latitude 7450",
        "Latitude 9430", "Latitude 9440", "Latitude 9450",
        // Precision Mobile
        "Precision",
        "Precision 3510", "Precision 3520", "Precision 3530", "Precision 3540", "Precision 3550", "Precision 3560", "Precision 3570", "Precision 3580", "Precision 3590",
        "Precision 5510", "Precision 5520", "Precision 5530", "Precision 5540", "Precision 5550", "Precision 5560", "Precision 5570", "Precision 5680", "Precision 5690",
        "Precision 7510", "Precision 7520", "Precision 7530", "Precision 7540", "Precision 7550", "Precision 7560", "Precision 7670", "Precision 7680",
        // XPS
        "XPS",
        "XPS 13 9350", "XPS 13 9360", "XPS 13 9370", "XPS 13 9380", "XPS 13 9300", "XPS 13 9310", "XPS 13 Plus",
        "XPS 14",
        "XPS 15 9550", "XPS 15 9560", "XPS 15 9570", "XPS 15 7590", "XPS 15 9500", "XPS 15 9510", "XPS 15 9520", "XPS 15 9530",
        "XPS 17 9700", "XPS 17 9710", "XPS 17 9720", "XPS 17 9730",
        // Consumer
        "Inspiron", "Vostro", "Alienware"
      ]
    },
    systems: {
      keywords: [
        // OptiPlex (SFF/Micro/Tower/AIO)
        "OptiPlex",
        "OptiPlex 3040", "OptiPlex 3050", "OptiPlex 3060", "OptiPlex 3070", "OptiPlex 3080", "OptiPlex 3090", "OptiPlex 3000",
        "OptiPlex 5040", "OptiPlex 5050", "OptiPlex 5060", "OptiPlex 5070", "OptiPlex 5080", "OptiPlex 5090", "OptiPlex 5000", "OptiPlex 5480",
        "OptiPlex 7040", "OptiPlex 7050", "OptiPlex 7060", "OptiPlex 7070", "OptiPlex 7080", "OptiPlex 7090", "OptiPlex 7000", "OptiPlex 7010", "OptiPlex 7020",
        // OptiPlex AIO
        "OptiPlex 7440 AIO", "OptiPlex 7450 AIO", "OptiPlex 7460 AIO", "OptiPlex 7470 AIO", "OptiPlex 7480 AIO", "OptiPlex 7400 AIO", "OptiPlex 7410 AIO",
        // Precision Towers/Workstations
        "Precision",
        "Precision Tower 3620", "Precision Tower 3630", "Precision Tower 3640", "Precision 3660", "Precision 7875"
      ],
      types: {
        "Tower": ["Precision Tower", "OptiPlex 5000 Tower", "OptiPlex 7000 Tower", "OptiPlex 7010 Tower", "OptiPlex 7020 Tower", "3620", "3630", "3640", "3660", "7875"],
        "SFF": ["SFF"],
        "MFF": ["Micro", "MFF"],
        "AIO": ["AIO", "All-in-One"]
      }
    },
    servers: {
      keywords: [
        // PowerEdge 13G–16G
        "PowerEdge",
        "PowerEdge R250", "PowerEdge R330", "PowerEdge R340", "PowerEdge R350",
        "PowerEdge R430", "PowerEdge R440", "PowerEdge R450",
        "PowerEdge R530", "PowerEdge R540", "PowerEdge R550",
        "PowerEdge R630", "PowerEdge R640", "PowerEdge R650", "PowerEdge R650xs",
        "PowerEdge R730", "PowerEdge R740", "PowerEdge R750", "PowerEdge R750xs", "PowerEdge R760", "PowerEdge R760xa",
        "PowerEdge T130", "PowerEdge T140", "PowerEdge T150", "PowerEdge T330", "PowerEdge T340", "PowerEdge T350"
      ],
      types: {
        "Rack": ["R250", "R330", "R340", "R350", "R430", "R440", "R450", "R530", "R540", "R550", "R630", "R640", "R650", "R650xs", "R730", "R740", "R750", "R750xs", "R760", "R760xa"],
        "Tower": ["T130", "T140", "T150", "T330", "T340", "T350"]
      }
    },
    networks: {
      keywords: ['PowerSwitch', 'PowerConnect', 'Networking']
    },
  },

  HP: {
    laptops: {
      keywords: [
        // EliteBook
        "EliteBook",
        "EliteBook 820 G3", "EliteBook 820 G4", "EliteBook 830 G5", "EliteBook 830 G6", "EliteBook 830 G7", "EliteBook 830 G8", "EliteBook 830 G9", "EliteBook 830 G10",
        "EliteBook 840 G3", "EliteBook 840 G4", "EliteBook 840 G5", "EliteBook 840 G6", "EliteBook 840 G7", "EliteBook 840 G8", "EliteBook 840 G9", "EliteBook 840 G10",
        "EliteBook 850 G3", "EliteBook 850 G4", "EliteBook 850 G5", "EliteBook 850 G6", "EliteBook 855 G7", "EliteBook 855 G8",
        "EliteBook 1040 G4", "EliteBook 1040 G5", "EliteBook 1040 G6", "EliteBook 1040 G9", "EliteBook 1040 G10",
        // ProBook
        "ProBook",
        "ProBook 430 G3", "ProBook 430 G4", "ProBook 440 G5", "ProBook 440 G6", "ProBook 440 G7", "ProBook 440 G8", "ProBook 440 G9", "ProBook 440 G10",
        "ProBook 450 G3", "ProBook 450 G4", "ProBook 450 G5", "ProBook 450 G6", "ProBook 450 G7", "ProBook 450 G8", "ProBook 450 G9", "ProBook 450 G10",
        // ZBook mobile workstations
        "ZBook",
        "ZBook 15 G3", "ZBook 15 G4", "ZBook 15 G5", "ZBook 15 G6", "ZBook 15v G5",
        "ZBook Studio G3", "ZBook Studio G4", "ZBook Studio G5", "ZBook Studio G7", "ZBook Studio G8", "ZBook Studio G9",
        "ZBook Firefly G7", "ZBook Firefly G8", "ZBook Firefly G9", "ZBook Firefly G10",
        "ZBook Power G7", "ZBook Power G8", "ZBook Power G9", "ZBook Power G10",
        // Consumer
        "Spectre", "Envy", "OMEN", "Pavilion"
      ]
    },
    systems: {
      keywords: [
        // EliteDesk / ProDesk
        "EliteDesk", "ProDesk",
        "EliteDesk 800 G2", "EliteDesk 800 G3", "EliteDesk 800 G4", "EliteDesk 800 G5", "EliteDesk 800 G6", "EliteDesk 800 G8", "EliteDesk 800 G9",
        "ProDesk 400 G3", "ProDesk 400 G4", "ProDesk 400 G5", "ProDesk 400 G6", "ProDesk 400 G9",
        // Z series workstations
        "Z Workstation",
        "Z2 Tower G3", "Z2 Tower G4", "Z2 Tower G5", "Z4 G4", "Z4 G5", "Z6 G4", "Z8 G4", "Z8 G5",
        "ProOne", "All-in-One"
      ],
      types: {
        "Tower": ["Z2 Tower", "Z4", "Z6", "Z8", "MT"],
        "SFF": ["SFF"],
        "MFF": ["Mini", "DM"],
        "AIO": ["ProOne", "All-in-One", "AIO"]
      }
    },
    servers: {
      keywords: [
        // ProLiant Gen9–Gen11
        "ProLiant",
        "ProLiant DL20 Gen9", "ProLiant DL20 Gen10", "ProLiant DL20 Gen11",
        "ProLiant DL360 Gen9", "ProLiant DL360 Gen10", "ProLiant DL360 Gen11",
        "ProLiant DL380 Gen9", "ProLiant DL380 Gen10", "ProLiant DL380 Gen11",
        "ProLiant DL385 Gen10", "ProLiant DL385 Gen11",
        "ProLiant ML350 Gen9", "ProLiant ML350 Gen10", "ProLiant ML350 Gen11"
      ],
      types: {
        "Rack": ["DL20", "DL360", "DL380", "DL385"],
        "Tower": ["ML350"]
      }
    },
    printers: {
      keywords: ['LaserJet', 'OfficeJet', 'PageWide', 'DesignJet'],
    },
    networks: {
      keywords: ['Aruba', 'ProCurve']
    }
  },

  Lenovo: {
    laptops: {
      keywords: [
        // ThinkPad T/X/L series (2015–2025)
        "ThinkPad",
        "ThinkPad T450", "ThinkPad T460", "ThinkPad T470", "ThinkPad T480", "ThinkPad T490", "ThinkPad T14 Gen 1", "ThinkPad T14 Gen 2", "ThinkPad T14 Gen 3", "ThinkPad T14 Gen 4",
        "ThinkPad T14s Gen 1", "ThinkPad T14s Gen 2", "ThinkPad T14s Gen 3", "ThinkPad T14s Gen 4",
        "ThinkPad X1 Carbon Gen 3", "ThinkPad X1 Carbon Gen 4", "ThinkPad X1 Carbon Gen 5", "ThinkPad X1 Carbon Gen 6", "ThinkPad X1 Carbon Gen 7", "ThinkPad X1 Carbon Gen 8", "ThinkPad X1 Carbon Gen 9", "ThinkPad X1 Carbon Gen 10", "ThinkPad X1 Carbon Gen 11",
        "ThinkPad X1 Nano Gen 1", "ThinkPad X1 Nano Gen 2", "ThinkPad X1 Nano Gen 3",
        "ThinkPad X13 Gen 1", "ThinkPad X13 Gen 2", "ThinkPad X13 Gen 3", "ThinkPad X13 Gen 4",
        "ThinkPad L480", "ThinkPad L490", "ThinkPad L14 Gen 1", "ThinkPad L14 Gen 2", "ThinkPad L14 Gen 3", "ThinkPad L14 Gen 4",
        // Mobile workstations
        "ThinkPad P50", "ThinkPad P51", "ThinkPad P52", "ThinkPad P53", "ThinkPad P1 Gen 1", "ThinkPad P1 Gen 2", "ThinkPad P1 Gen 3", "ThinkPad P1 Gen 4", "ThinkPad P1 Gen 5", "ThinkPad P1 Gen 6",
        // Consumer
        "Yoga", "IdeaPad", "Legion"
      ]
    },
    systems: {
      keywords: [
        "ThinkCentre",
        "ThinkCentre M700", "ThinkCentre M710", "ThinkCentre M720", "ThinkCentre M70s", "ThinkCentre M80s", "ThinkCentre M90s",
        "ThinkCentre M700 Tiny", "ThinkCentre M710q Tiny", "ThinkCentre M720q Tiny", "ThinkCentre M70q Gen 2", "ThinkCentre M70q Gen 3", "ThinkCentre M70q Gen 4", "ThinkCentre M80q Tiny", "ThinkCentre M90q Tiny",
        "ThinkStation",
        "ThinkStation P320", "ThinkStation P330", "ThinkStation P340", "ThinkStation P360", "ThinkStation P3", "ThinkStation P5"
      ],
      types: {
        "Tower": ["Tower", "t"],
        "SFF": ["SFF", "s"],
        "MFF": ["Tiny", "q"]
      }
    },
    servers: {
      keywords: [
        "ThinkSystem",
        "ThinkSystem SR250", "ThinkSystem SR530", "ThinkSystem SR550", "ThinkSystem SR630", "ThinkSystem SR650", "ThinkSystem SR650 V2", "ThinkSystem SR655"
      ],
      types: {
        "Rack": ["SR"],
        "Tower": ["ST"]
      }
    }
  },

  Microsoft: {
    laptops: {
      keywords: [
        "Surface",
        "Surface Pro 4", "Surface Pro 5", "Surface Pro 6", "Surface Pro 7", "Surface Pro 7+", "Surface Pro 8", "Surface Pro 9", "Surface Pro 10",
        "Surface Laptop 1", "Surface Laptop 2", "Surface Laptop 3", "Surface Laptop 4", "Surface Laptop 5", "Surface Laptop 6",
        "Surface Laptop Studio", "Surface Go 2", "Surface Go 3", "Surface Go 4"
      ]
    },
    systems: { keywords: ["Surface Studio", "Surface Hub 2S"] }
  },

  Apple: {
    laptops: {
      keywords: [
        "MacBook",
        "MacBook Pro 13 (2015)", "MacBook Pro 15 (2015)", "MacBook (2015)",
        "MacBook Pro 13 (2016)", "MacBook Pro 15 (2016)", "MacBook Pro 13 (2017)", "MacBook Pro 15 (2017)",
        "MacBook Air (2018)", "MacBook Air (2020 M1)", "MacBook Air (2022 M2)", "MacBook Air (2024 M3)",
        "MacBook Pro 13 (M1)", "MacBook Pro 14 (M1/M2/M3)", "MacBook Pro 16 (M1/M2/M3)"
      ]
    },
    systems: { keywords: ["iMac", "iMac 24", "Mac mini", "Mac Studio", "Mac Pro"] }
  },

  Asus: {
    laptops: { keywords: ["ZenBook", "ZenBook UX305", "UX330", "UX433", "UX425", "ZenBook 14", "VivoBook", "ROG Zephyrus", "TUF Gaming"] },
    systems: { keywords: ["ExpertCenter", "ProArt Station", "All-in-One"] }
  },

  Acer: {
    laptops: { keywords: ["Swift", "Swift 3", "Swift 5", "Aspire", "Aspire E", "Aspire 5", "Aspire 7", "Nitro", "Predator"] },
    systems: { keywords: ["Veriton", "Aspire Desktop", "All-in-One"] }
  },

  MSI: {
    laptops: { keywords: ["Prestige", "Summit", "Modern", "Creator", "Katana", "Raider", "Stealth"] },
    systems: { keywords: ["PRO DP", "Creator P"] }
  },

  Samsung: {
    laptops: { keywords: ["Notebook 9", "Galaxy Book", "Galaxy Book2", "Galaxy Book3"] }
  },

  Cisco: {
    servers: {
      keywords: ["UCS", "UCS C220 M4", "UCS C240 M4", "UCS C220 M5", "UCS C240 M5", "UCS C220 M6", "UCS C240 M6", "UCS B200 M5"],
      types: {
        "Rack": ["C220", "C240"],
        "Blade": ["B200"]
      }
    },
    networks: {
      keywords: ["Catalyst", "Nexus", "Meraki", "ASA", "Firepower", "IP Phone"]
    },
    other: {
      keywords: ["Webex Device"]
    }
  },

  Supermicro: {
    servers: { keywords: ["SuperServer", "SYS-5019", "SYS-510P", "SYS-6029", "SYS-620P", "AS-1114S", "AS-2014S"] }
  }
};

    