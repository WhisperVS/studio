
import type { AssetCategory } from "./types";

export const manufacturerCatalog: Record<string, Partial<Record<AssetCategory, {
    keywords: string[];
    types?: Record<string, string[]>;
  }>>> = {
    Dell: {
      laptops: {
        keywords: [
          'Latitude', 'Latitude 3330', 'Latitude 5420', 'Latitude 5430', 'Latitude 5440', 'Latitude 7420', 'Latitude 7430', 'Latitude 7440', 'Latitude 9430', 'Latitude 9440',
          'Precision', 'Precision 3570', 'Precision 5570', 'Precision 7560',
          'XPS', 'XPS 13', 'XPS 15', 'XPS 17',
          'Inspiron', 'Vostro', 'Alienware'
        ],
      },
      systems: {
        keywords: [
          'OptiPlex', 'OptiPlex 3080', 'OptiPlex 5080', 'OptiPlex 5090', 'OptiPlex 7080', 'OptiPlex 7090', 'OptiPlex 7010',
          'Precision', 'Precision 3460', 'Precision 3660',
          'Vostro', 'XPS', 'Alienware'
        ],
        types: {
          'MFF': ['MFF', 'Micro'],
          'SFF': ['SFF'],
          'Tower': ['Tower', 'MT'],
          'AIO': ['AIO', 'All-in-One'],
        }
      },
      servers: {
        keywords: [
          'PowerEdge',
          'PowerEdge R250', 'PowerEdge R350', 'PowerEdge R450', 'PowerEdge R550', 'PowerEdge R650', 'PowerEdge R750', 'PowerEdge R640', 'PowerEdge R740',
          'PowerEdge T150', 'PowerEdge T350', 'PowerEdge T550',
          'PowerEdge M640', 'PowerEdge MX750c'
        ],
        types: {
          'Rack': ['R'],
          'Tower': ['T'],
          'Blade': ['M', 'MX'],
        }
      },
      networks: {
        keywords: ['PowerSwitch', 'PowerConnect', 'Networking']
      },
    },
    HP: {
      laptops: {
        keywords: [
          'EliteBook', 'EliteBook 840 G8', 'EliteBook 840 G9', 'EliteBook 1040 G9',
          'ProBook', 'ProBook 440 G9', 'ProBook 450 G9',
          'ZBook', 'ZBook Firefly', 'ZBook Studio',
          'Spectre', 'Envy', 'OMEN'
        ],
      },
      systems: {
        keywords: [
          'EliteDesk', 'EliteDesk 800 G8', 'EliteDesk 800 G9',
          'ProDesk', 'ProDesk 400 G9',
          'Z', 'Z2 Mini', 'Z4 G4', 'OMEN'
        ],
        types: {
          'MFF': ['Mini', 'DM'],
          'SFF': ['SFF'],
          'Tower': ['Tower', 'MT'],
          'AIO': ['AIO', 'All-in-One'],
        }
      },
      servers: {
        keywords: [
          'ProLiant',
          'ProLiant DL360 Gen10', 'ProLiant DL380 Gen10', 'ProLiant DL360 Gen11', 'ProLiant DL380 Gen11',
          'ProLiant ML350 Gen10', 'ProLiant ML350 Gen11',
          'ProLiant BL460c Gen10'
        ],
        types: {
          'Rack': ['DL'],
          'Tower': ['ML'],
          'Blade': ['BL'],
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
          'ThinkPad', 'ThinkPad T14', 'ThinkPad X1 Carbon', 'ThinkPad P1',
          'Yoga', 'IdeaPad', 'Legion'
        ],
      },
      systems: {
        keywords: [
          'ThinkCentre', 'ThinkCentre M70q', 'ThinkCentre M90q',
          'IdeaCentre', 'ThinkStation', 'Legion'
        ],
        types: {
            'MFF': ['Tiny'],
            'SFF': ['SFF'],
            'Tower': ['Tower'],
            'AIO': ['AIO'],
        }
      },
      servers: {
        keywords: [
          'ThinkSystem',
          'ThinkSystem SR630', 'ThinkSystem SR650',
          'ThinkSystem ST250', 'ThinkSystem ST550'
        ],
        types: {
          'Rack': ['SR'],
          'Tower': ['ST']
        }
      }
    },
    Apple: {
      laptops: {
        keywords: ['MacBook Air', 'MacBook Pro'],
      },
      systems: {
        keywords: ['iMac', 'Mac mini', 'Mac Studio', 'Mac Pro'],
      }
    },
    Cisco: {
      networks: {
        keywords: [
          'Catalyst', 'Catalyst 9200', 'Catalyst 9300',
          'Nexus', 'Nexus 9000',
          'Meraki', 'Meraki MR', 'Meraki MS', 'Meraki MX',
          'ASA', 'ISR'
        ]
      },
      servers: {
        keywords: [
          'UCS', 'UCS C220 M5', 'UCS C240 M5',
          'UCS B200 M5'
        ],
        types: {
          'Rack': ['C-Series'],
          'Blade': ['B-Series']
        }
      },
      other: {
        keywords: ['IP Phone']
      }
    }
  };
