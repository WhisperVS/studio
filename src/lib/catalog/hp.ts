
export const hpCatalog = {
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
        "LaserJet M102a", "LaserJet M102w", "LaserJet M104a", "LaserJet M104w",
        "LaserJet M106w", "LaserJet M107w", "LaserJet M109a", "LaserJet M109w",
        "LaserJet M110w", "LaserJet M111w", "LaserJet M112w",
        "LaserJet M203d", "LaserJet M203dn", "LaserJet M203dw",
        "LaserJet M206dn", "LaserJet M206dw", "LaserJet M209dw", "LaserJet M209dwe",
        "LaserJet M214dw",
        "LaserJet MFP M130a", "LaserJet MFP M130fn", "LaserJet MFP M130fw", "LaserJet MFP M130nw",
        "LaserJet MFP M132a", "LaserJet MFP M132fn", "LaserJet MFP M132fw", "LaserJet MFP M132nw",
        "LaserJet MFP M135a", "LaserJet MFP M135w", "LaserJet MFP M137fnw",
        "LaserJet MFP M140w", "LaserJet MFP M140we", "LaserJet MFP M141w", "LaserJet MFP M142fw",
        "LaserJet MFP M232dw", "LaserJet MFP M232dwe", "LaserJet MFP M234d", "LaserJet MFP M234sdn", "LaserJet MFP M234sdne", "LaserJet MFP M234sdw", "LaserJet MFP M234sdwe",
        "LaserJet Pro M401n", "LaserJet Pro M401dn", "LaserJet Pro M401dw",
        "LaserJet Pro M402n", "LaserJet Pro M402dn", "LaserJet Pro M402dw",
        "LaserJet Pro M404n", "LaserJet Pro M404dn", "LaserJet Pro M404dw",
        "LaserJet Pro M405dn", "LaserJet Pro M405dw",
        "LaserJet Pro MFP M425dn", "LaserJet Pro MFP M425dw",
        "LaserJet Pro MFP M426fdn", "LaserJet Pro MFP M426fdw",
        "LaserJet Pro MFP M428fdn", "LaserJet Pro MFP M428fdw",
        "LaserJet Pro MFP M429fdn", "LaserJet Pro MFP M429fdw",
        "Color LaserJet Pro M452dn", "Color LaserJet Pro M452dw",
        "Color LaserJet Pro MFP M274n", "Color LaserJet Pro MFP M277dw",
        "Color LaserJet Pro MFP M281fdw", "Color LaserJet Pro MFP M283fdw",
        "Color LaserJet Pro MFP M479fdn", "Color LaserJet Pro MFP M479fdw",
        "LaserJet Enterprise M406dn",
        "LaserJet Enterprise MFP M430f", "LaserJet Enterprise Flow MFP M430z",
        "LaserJet Enterprise M604n", "LaserJet Enterprise M604dn",
        "LaserJet Enterprise M605n", "LaserJet Enterprise M605dn", "LaserJet Enterprise M605x",
        "LaserJet Enterprise M606dn", "LaserJet Enterprise M606x",
        "LaserJet Enterprise M607n", "LaserJet Enterprise M607dn",
        "LaserJet Enterprise M608n", "LaserJet Enterprise M608dn", "LaserJet Enterprise M608x",
        "LaserJet Enterprise M609dn", "LaserJet Enterprise M609x",
        "LaserJet Enterprise M610dn", "LaserJet Enterprise M611dn", "LaserJet Enterprise M612dn",
        "LaserJet Enterprise MFP M631dn", "LaserJet Enterprise MFP M632fht", "LaserJet Enterprise MFP M633fh",
        "LaserJet Enterprise MFP M634h", "LaserJet Enterprise MFP M635fht",
        "LaserJet Enterprise MFP M725dn", "LaserJet Enterprise MFP M725f",
        "Color Laser 150a", "Color Laser 150nw",
        "Color Laser MFP 178nw", "Color Laser MFP 178nwg", "Color Laser MFP 179fnw",
        "LaserJet Pro M118dw", "LaserJet Pro M201dw", "LaserJet Pro M203dw",
        "LaserJet Pro M501dn", "LaserJet Pro M506dn",
        "LaserJet Enterprise M506dn", "LaserJet Enterprise M506x",
        "LaserJet Enterprise M507n", "LaserJet Enterprise M507dn", "LaserJet Enterprise M507x",
        "LaserJet Enterprise M528dn", "LaserJet Enterprise M528f",
        "LaserJet Enterprise M633fh", "LaserJet Enterprise M635fht",
        "Color LaserJet Enterprise M553n", "Color LaserJet Enterprise M553dn",
        "Color LaserJet Enterprise M554dn", "Color LaserJet Enterprise M555dn",
        "Color LaserJet Enterprise M651dn", "Color LaserJet Enterprise M652dn", "Color LaserJet Enterprise M653x",
        "Color LaserJet Enterprise Flow MFP M577z", "Color LaserJet Enterprise MFP M578dn",
        "Color LaserJet Enterprise MFP M681f", "Color LaserJet Enterprise MFP M682z",
        "Color LaserJet Enterprise M751dn", "Color LaserJet Enterprise M776dn",
        "Neverstop Laser 1000a", "Neverstop Laser 1000w",
        "Neverstop Laser MFP 1200a", "Neverstop Laser MFP 1200w", "Neverstop Laser MFP 1202w", "Neverstop Laser MFP 1202nw",
        "LaserJet Tank 1502w", "LaserJet Tank 2504dw",
        "LaserJet Tank MFP 1602w", "LaserJet Tank MFP 2502dw", "LaserJet Tank MFP 2602sdw",
        "OfficeJet 3830", "OfficeJet 5255", "OfficeJet 6950", "OfficeJet 6970",
        "OfficeJet Pro 6230", "OfficeJet Pro 6960", "OfficeJet Pro 6978",
        "OfficeJet Pro 7720", "OfficeJet Pro 7740",
        "OfficeJet Pro 8020", "OfficeJet Pro 8022", "OfficeJet Pro 8035",
        "OfficeJet Pro 8710", "OfficeJet Pro 8720", "OfficeJet Pro 8740",
        "OfficeJet Pro 9010", "OfficeJet Pro 9015", "OfficeJet Pro 9015e",
        "OfficeJet Pro 9020", "OfficeJet Pro 9025", "OfficeJet Pro 9025e",
        "OfficeJet Pro 9120e", "OfficeJet Pro 9130e", "OfficeJet Pro 9720e", "OfficeJet Pro 9730e",
        "Smart Tank 500", "Smart Tank 510", "Smart Tank 515", "Smart Tank 530",
        "Smart Tank 600", "Smart Tank 615",
        "Smart Tank 700", "Smart Tank 720", "Smart Tank 730", "Smart Tank 7305",
        "Smart Tank 7000", "Smart Tank 7200", "Smart Tank 7300", "Smart Tank 7600",
        "PageWide Pro 352dw", "PageWide Pro 377dw",
        "PageWide Pro 452dw", "PageWide Pro 477dw",
        "PageWide Pro 552dw", "PageWide Pro 577dw",
        "PageWide Enterprise Color 556dn", "PageWide Enterprise Color 586f",
        "PageWide Enterprise Color 750", "PageWide Enterprise Color 755",
        "PageWide Enterprise Color MFP 780", "PageWide Enterprise Color MFP 785",
        "DesignJet T120", "DesignJet T130",
        "DesignJet T520", "DesignJet T530",
        "DesignJet T630", "DesignJet T650",
        "DesignJet T730", "DesignJet T830", "DesignJet T850",
        "DesignJet Z6", "DesignJet Z9+",
        "DesignJet Studio", "DesignJet XL 3600",
        "DeskJet 2130", "DeskJet 2622", "DeskJet 2636",
        "DeskJet 2700", "DeskJet 2710", "DeskJet 2720", "DeskJet 2722", "DeskJet 2723", "DeskJet 2755e",
        "DeskJet 4100e", "DeskJet 4155e",
        "ENVY 4520", "ENVY 5540", "ENVY 6055e", "ENVY 6455e",
        "ENVY Photo 7155", "ENVY Photo 7855",
        "ENVY Inspire 7200e", "ENVY Inspire 7900e", "ENVY Inspire 7955e",
        "Tango", "Tango X"
      ]
    },
    networks: {
      keywords: [
        // Legacy HP/ProCurve
        "ProCurve 1810G", "ProCurve 2520", "ProCurve 2530", "ProCurve 2910al"
      ],
      types: {
        "Switch": ["ProCurve"],
        "Wireless": [],
        "Controller": []
      }
    }
};
