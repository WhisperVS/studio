
export const ciscoCatalog = {
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
};
