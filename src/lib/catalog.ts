
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
    printers: {
        keywords: [
          "E310dw", "E514dw", "E525w",
          "B2360dn", "B2375dfw",
          "C1760nw", "C1765nfw", "C2660dn", "C2665dnf",
          "C3760dn", "C3765dnf",
          "H625cdw", "H825cdw",
          "S2830dn", "S2810dn", "S3845cdn", "S5830dn", "S5840cdn"
        ]
    },
    networks: {
        keywords: [
          "PowerSwitch S3048", "PowerSwitch S4048", "PowerSwitch S4148", "PowerSwitch S4248",
          "PowerSwitch S5048", "PowerSwitch S5248F-ON", "PowerSwitch S5296F-ON",
          "PowerSwitch S5448F-ON", "PowerSwitch S6000",
          "PowerConnect 2808", "PowerConnect 2824", "PowerConnect 2848"
        ],
        types: {
          "Switch": ["PowerSwitch", "PowerConnect"]
        }
    }
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
        keywords: [
          // ---- LaserJet Pro (Mono) ----
          "LaserJet Pro M201dw", "LaserJet Pro M402n", "LaserJet Pro M402dn", "LaserJet Pro M402dw",
          "LaserJet Pro M404n", "LaserJet Pro M404dn", "LaserJet Pro M404dw",
          "LaserJet Pro M405dn", "LaserJet Pro M405dw",
          "LaserJet Pro MFP M225dn", "LaserJet Pro MFP M227fdw",
          "LaserJet Pro MFP M426fdn", "LaserJet Pro MFP M426fdw",
          "LaserJet Pro MFP M428fdn", "LaserJet Pro MFP M428fdw",

          // ---- Color LaserJet Pro ----
          "Color LaserJet Pro M252dw", "Color LaserJet Pro M254dw",
          "Color LaserJet Pro M255dw",
          "Color LaserJet Pro MFP M277dw", "Color LaserJet Pro MFP M281fdw", "Color LaserJet Pro MFP M283fdw",

          // ---- LaserJet Enterprise (Mono) ----
          "LaserJet Enterprise M506dn", "LaserJet Enterprise M506x",
          "LaserJet Enterprise M507n", "LaserJet Enterprise M507dn", "LaserJet Enterprise M507x",
          "LaserJet Enterprise M528dn", "LaserJet Enterprise M528f",
          "LaserJet Enterprise M610dn", "LaserJet Enterprise M611dn", "LaserJet Enterprise M612dn",

          // ---- Color LaserJet Enterprise ----
          "Color LaserJet Enterprise M553n", "Color LaserJet Enterprise M553dn",
          "Color LaserJet Enterprise M554dn", "Color LaserJet Enterprise M555dn",
          "Color LaserJet Enterprise Flow MFP M577z", "Color LaserJet Enterprise MFP M578dn",

          // ---- OfficeJet Pro (Ink) ----
          "OfficeJet Pro 6960", "OfficeJet Pro 6970", "OfficeJet Pro 6978",
          "OfficeJet Pro 7740 Wide Format",
          "OfficeJet Pro 8020", "OfficeJet Pro 8022", "OfficeJet Pro 8035",
          "OfficeJet Pro 9010", "OfficeJet Pro 9015", "OfficeJet Pro 9015e", "OfficeJet Pro 9020", "OfficeJet Pro 9025e",

          // ---- PageWide (Ink Business) ----
          "PageWide Pro 352dw", "PageWide Pro 377dw",
          "PageWide Pro 452dw", "PageWide Pro 477dw",
          "PageWide Pro 552dw", "PageWide Pro 577dw",
          "PageWide Enterprise Color 556dn", "PageWide Enterprise Color 586f",

          // ---- DesignJet (Large-format) ----
          "DesignJet T120", "DesignJet T520", "DesignJet T530",
          "DesignJet T630", "DesignJet T650",
          "DesignJet T830", "DesignJet T850",
          "DesignJet Z6", "DesignJet Z9+" ,

          // ---- DeskJet / ENVY (Home ink) ----
          "DeskJet 2130", "DeskJet 3630", "DeskJet 3755",
          "DeskJet 4155e", "DeskJet 2755e",
          "ENVY 4500", "ENVY 5540", "ENVY 6055e", "ENVY 6455e",
          "ENVY Inspire 7955e"
        ]
    },
    networks: {
        keywords: [
          // Aruba switches
          "Aruba 2530", "Aruba 2540", "Aruba 2930F", "Aruba 2930M",
          "Aruba 3810", "Aruba 5400R", "Aruba 6000", "Aruba 6100",
          "Aruba 6200F", "Aruba 6300F", "Aruba 6400",
          // Wireless APs
          "Aruba AP-305", "Aruba AP-315", "Aruba AP-325",
          "Aruba AP-505", "Aruba AP-515", "Aruba AP-535", "Aruba AP-635",
          // Gateways / controllers
          "Aruba 7005", "Aruba 7010", "Aruba 7030", "Aruba 7205", "Aruba 7210",
          // Legacy HP/ProCurve
          "ProCurve 1810G", "ProCurve 2520", "ProCurve 2530", "ProCurve 2910al"
        ],
        types: {
          "Switch": ["Aruba 25", "Aruba 29", "Aruba 63", "ProCurve"],
          "Wireless": ["Aruba AP", "Aruba Instant"],
          "Controller": ["Aruba 70", "Aruba 72"]
        }
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
        "ThinkCentre M700 Tiny", "ThinkCentre M710q Tiny", "ThinkCentre M720q Tiny", "ThinkCentre M70q Gen 2", "ThinkPad M70q Gen 3", "ThinkPad M70q Gen 4", "ThinkCentre M80q Tiny", "ThinkCentre M90q Tiny",
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
    },
    printers: {
        keywords: [
          "Lenovo LJ2200", "Lenovo LJ2605d", "Lenovo LJ2650dn",
          "Lenovo M7206w", "Lenovo M7268w",
          "Lenovo M7605D", "Lenovo M7655DFW"
        ]
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
    laptops: { keywords: ["Notebook 9", "Galaxy Book", "Galaxy Book2", "Galaxy Book3"] },
    printers: {
      keywords: [
        "Xpress M2020W", "Xpress M2835DW",
        "Xpress C430W", "Xpress C480FW",
        "ProXpress M3320ND", "ProXpress M4070FR"
      ]
    }
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
        keywords: [
          // Catalyst campus switches
          "Catalyst 2960X", "Catalyst 2960XR", "Catalyst 3650", "Catalyst 3850",
          "Catalyst 9200", "Catalyst 9200L", "Catalyst 9300", "Catalyst 9300L",
          "Catalyst 9400", "Catalyst 9500",
          // Nexus (datacenter)
          "Nexus 3k", "Nexus 5k", "Nexus 7k", "Nexus 9k", "N9K-C93180", "N9K-C9364",
          // Meraki (cloud-managed)
          "Meraki MS120", "Meraki MS125", "Meraki MS210", "Meraki MS225", "Meraki MS250",
          "Meraki MS350", "Meraki MS355", "Meraki MX64", "Meraki MX67", "Meraki MX84",
          "Meraki MX95", "Meraki MX100", "Meraki MX105", "Meraki MX250", "Meraki MX450",
          "Meraki MR36", "Meraki MR46", "Meraki MR56", "Meraki MR70",
          // Security
          "ASA 5506-X", "ASA 5508-X", "ASA 5516-X", "Firepower 1010", "Firepower 1120",
          "Firepower 1140", "Firepower 2110", "Firepower 2130", "Firepower 2140",
          // Voice/Collab
          "Cisco IP Phone 7800", "Cisco IP Phone 8800"
        ],
        types: {
          "Switch": ["Catalyst", "Nexus", "Meraki MS"],
          "Router": ["ISR", "Meraki MX"],
          "Wireless": ["Meraki MR", "Catalyst 9100"],
          "Firewall": ["ASA", "Firepower"],
          "VoIP": ["Cisco IP Phone"]
        }
    },
    other: {
      keywords: ["Webex Device"]
    }
  },
  Supermicro: {
    servers: { keywords: ["SuperServer", "SYS-5019", "SYS-510P", "SYS-6029", "SYS-620P", "AS-1114S", "AS-2014S"] }
  },
  Canon: {
    printers: {
      keywords: [
        "imageCLASS LBP6230dw", "imageCLASS LBP236dw",
        "imageCLASS MF269dw", "imageCLASS MF264dw",
        "imageCLASS MF445dw", "imageCLASS MF451dw", "imageCLASS MF453dw",
        "imageRUNNER ADVANCE 4525i", "imageRUNNER ADVANCE 4545i",
        "imageRUNNER ADVANCE DX C3720", "imageRUNNER ADVANCE DX C3826",
        "imageRUNNER ADVANCE DX 4725i",
        "PIXMA TS6320", "PIXMA TS6420", "PIXMA TS8320",
        "PIXMA TR8620a",
        "PIXMA G6020",
        "MAXIFY GX4020", "MAXIFY GX7020"
      ]
    }
  },
  Epson: {
    printers: {
      keywords: [
        "EcoTank ET-2720", "EcoTank ET-2803", "EcoTank ET-2850",
        "EcoTank ET-3850", "EcoTank ET-4800", "EcoTank ET-4850",
        "EcoTank ET-15000",
        "WorkForce WF-2860", "WorkForce WF-3820", "WorkForce WF-4830",
        "WorkForce Pro WF-4720", "WorkForce Pro WF-4730",
        "WorkForce Pro WF-7820", "WorkForce Pro WF-7840",
        "SureColor P700", "SureColor P900"
      ]
    }
  },
  Brother: {
    printers: {
      keywords: [
        "HL-L2350DW", "HL-L2370DW", "HL-L2390DW", "HL-L2395DW",
        "HL-L3270CDW",
        "MFC-L2710DW", "MFC-L2750DW",
        "MFC-L3750CDW", "MFC-L3770CDW",
        "MFC-J995DW", "MFC-J4335DW", "MFC-J5855DW"
      ]
    }
  },
  Lexmark: {
    printers: {
      keywords: [
        "MS321dn", "MS421dn", "MS521dn", "MS621dn", "MS821dn",
        "MX321adw", "MX421ade", "MX521ade",
        "C3326dw", "MC3326adwe", "C4342", "XC4142"
      ]
    }
  },
  Netgear: {
    networks: {
      keywords: [
        // Smart/Managed Switches
        "GS108", "GS116", "GS724T", "GS748T",
        "GS110TP", "GS510TP", "GS728TP", "GS752TP",
        "MS510TX", "MS510TXPP", "M4300-24X", "M4300-48X",
        // Wireless
        "WAC104", "WAC124", "WAC540",
        "Orbi Pro SRK60", "Orbi Pro SXK80"
      ],
      types: {
        "Switch": ["GS", "M4300"],
        "Wireless": ["WAC", "Orbi Pro"]
      }
    }
  },
  SonicWall: {
    networks: {
      keywords: [
        // Firewalls
        "TZ300", "TZ350", "TZ370", "TZ400", "TZ470", "TZ500", "TZ570", "TZ600", "TZ670",
        "NSa 2650", "NSa 2700", "NSa 3650", "NSa 3700", "NSa 4650", "NSa 4700",
        "NSa 5650", "NSa 5700", "NSa 6650", "NSa 6700",
        "NSv 10", "NSv 50", "NSv 200", "NSv 270", "NSv 470",
        // Switches (SonicWall Switch)
        "SWS12-8", "SWS12-10", "SWS14-24", "SWS14-48",
        // Wireless
        "SonicWave 200", "SonicWave 400", "SonicWave 600"
      ],
      types: {
        "Firewall": ["TZ", "NSa", "NSv"],
        "Switch": ["SWS"],
        "Wireless": ["SonicWave"]
      }
    }
  },
  Ubiquiti: {
    networks: {
      keywords: [
        // Switches
        "UniFi Switch 8", "UniFi Switch 16", "UniFi Switch 24", "UniFi Switch 48",
        "UniFi Switch Pro 24", "UniFi Switch Pro 48", "USW-Enterprise-24", "USW-Enterprise-48",
        // Gateways
        "UniFi Security Gateway", "USG-Pro-4", "Dream Machine", "Dream Machine Pro", "UDM-SE",
        // Access Points
        "UniFi AP AC Lite", "UniFi AP AC Pro", "UniFi nanoHD",
        "UniFi 6 Lite", "UniFi 6 Long-Range", "UniFi 6 Pro", "U7 Pro"
      ],
      types: {
        "Switch": ["UniFi Switch", "USW"],
        "Router": ["USG", "UDM"],
        "Wireless": ["UniFi AP"]
      }
    }
  },
  Juniper: {
    networks: {
      keywords: [
        "EX2200", "EX2300", "EX3400", "EX4300", "EX4400",
        "QFX5100", "QFX5120",
        "Mist AP32", "Mist AP43", "Mist AP45"
      ],
      types: {
        "Switch": ["EX", "QFX"],
        "Wireless": ["Mist AP"]
      }
    }
  },
  Fortinet: {
    networks: {
      keywords: [
        // Firewalls
        "FortiGate 40F", "FortiGate 60F", "FortiGate 80F", "FortiGate 100F", "FortiGate 200F",
        "FortiGate 40G", "FortiGate 60G",
        // Switches
        "FortiSwitch 108E", "FortiSwitch 224E", "FortiSwitch 248E", "FortiSwitch 424E", "FortiSwitch 448E",
        // Wireless
        "FortiAP 221E", "FortiAP 231F", "FortiAP 431F", "FortiAP 432F"
      ],
      types: {
        "Firewall": ["FortiGate"],
        "Switch": ["FortiSwitch"],
        "Wireless": ["FortiAP"]
      }
    }
  },
  TPLink: {
    networks: {
      keywords: [
        // Switches
        "TL-SG108E", "TL-SG1016DE", "TL-SG2210", "TL-SG2218", "TL-SG2428P",
        "Omada TL-SG2008P", "Omada TL-SG3428X",
        // Wireless
        "Omada EAP225", "Omada EAP245", "Omada EAP660 HD",
        // Routers
        "ER605", "ER7206",
        // Consumer
        "Archer AX50", "Archer AXE75"
      ],
      types: {
        "Switch": ["TL-SG", "Omada TL-SG"],
        "Wireless": ["Omada EAP"],
        "Router": ["ER"],
      }
    }
  },
  MikroTik: {
    networks: {
      keywords: [
        "CCR1009", "CCR2004", "CCR2116",
        "CRS112", "CRS226", "CRS326", "CRS328",
        "hAP ac2", "hAP ax2", "hAP ax3",
        "cAP ac", "cAP ax"
      ],
      types: {
        "Router": ["CCR", "hAP"],
        "Switch": ["CRS"],
        "Wireless": ["cAP"]
      }
    }
  }
};