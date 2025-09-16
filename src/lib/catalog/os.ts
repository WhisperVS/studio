
export const osCatalog = {
  os: {
      keywords: [
        // Windows Client
        "Windows 10", "Windows 10 Pro", "Windows 10 Enterprise", "Windows 10 Education", "Windows 10 Home",
        "Windows 11", "Windows 11 Pro", "Windows 11 Enterprise", "Windows 11 Education", "Windows 11 Home",

        // Windows Server (2016–2025)
        "Windows Server 2016", "Windows Server 2016 Standard", "Windows Server 2016 Datacenter",
        "Windows Server 2019", "Windows Server 2019 Standard", "Windows Server 2019 Datacenter",
        "Windows Server 2022", "Windows Server 2022 Standard", "Windows Server 2022 Datacenter",
        "Windows Server 2025", "Windows Server 2025 Standard", "Windows Server 2025 Datacenter",

        // Ubuntu LTS releases (popular in enterprise & dev)
        "Ubuntu 16.04 LTS", "Ubuntu 18.04 LTS", "Ubuntu 20.04 LTS", "Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS",
        "Ubuntu Desktop", "Ubuntu Server",

        // macOS (major releases 2015–2025)
        "macOS Sierra", "macOS High Sierra", "macOS Mojave", "macOS Catalina",
        "macOS Big Sur", "macOS Monterey", "macOS Ventura", "macOS Sonoma", "macOS Sequoia"
      ],
      types: {
        "Windows Client": ["Windows 10", "Windows 11"],
        "Windows Server": ["Windows Server"],
        "Linux": ["Ubuntu"],
        "macOS": ["macOS"]
      }
    }
};
