
export const fortinetCatalog = {
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
};
