
export const sonicwallCatalog = {
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
};
