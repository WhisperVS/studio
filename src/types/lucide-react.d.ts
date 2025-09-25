declare module 'lucide-react' {
  // Minimal declarations for the icons used by the project.
  const Icon: any;
  export const Laptop: any;
  export const Network: any;
  export const Printer: any;
  export const Server: any;
  export const HardDrive: any;
  export const LayoutGrid: any;
  export const ExternalLink: any;
  export const CheckSquare: any;
  export const MoreHorizontal: any;
  export const Trash2: any;
  export const Pencil: any;
  export const Info: any;
  export const Download: any;
  export const PlusCircle: any;
  export const Search: any;
  export const X: any;
  export const Check: any;
  export const User: any;
  export const Settings2: any;
  export const Boxes: any;
  export const MoonStar: any;
  export const SunMedium: any;
  export const ChevronDown: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const ChevronsUpDown: any;
  export const Calendar: any;
  export const Circle: any;
  export const ChevronUp: any;
  export const PanelLeft: any;
  export const ClipboardCopy: any;
  export const FileJson: any;
  export const RotateCcw: any;

  export default Icon;
}

// Minimal Radix Tabs declaration to satisfy tsc when radix types are not installed.
declare module '@radix-ui/react-tabs' {
  import * as React from 'react';
  export const Root: React.ComponentType<any>;
  export const List: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export default Root;
}
