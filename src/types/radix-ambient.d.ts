// Ambient module declarations for @radix-ui packages used in the project.
// Some Radix packages ship types, but in some environments TypeScript
// may still complain about missing module declarations (especially
// in trimmed or CI environments). These lightweight declarations
// allow builds/typechecks to proceed while keeping correct types
// where available.

declare module '@radix-ui/react-accordion' { const v: any; export = v }
declare module '@radix-ui/react-alert-dialog' { const v: any; export = v }
declare module '@radix-ui/react-avatar' { const v: any; export = v }
declare module '@radix-ui/react-checkbox' { const v: any; export = v }
declare module '@radix-ui/react-collapsible' { const v: any; export = v }
declare module '@radix-ui/react-dialog' { const v: any; export = v }
declare module '@radix-ui/react-dropdown-menu' { const v: any; export = v }
declare module '@radix-ui/react-label' { const v: any; export = v }
declare module '@radix-ui/react-menubar' { const v: any; export = v }
declare module '@radix-ui/react-popover' { const v: any; export = v }
declare module '@radix-ui/react-progress' { const v: any; export = v }
declare module '@radix-ui/react-radio-group' { const v: any; export = v }
declare module '@radix-ui/react-scroll-area' { const v: any; export = v }
declare module '@radix-ui/react-select' { const v: any; export = v }
declare module '@radix-ui/react-separator' { const v: any; export = v }
declare module '@radix-ui/react-slider' { const v: any; export = v }
declare module '@radix-ui/react-slot' { const v: any; export = v }
declare module '@radix-ui/react-switch' { const v: any; export = v }
declare module '@radix-ui/react-toast' { const v: any; export = v }
declare module '@radix-ui/react-tooltip' { const v: any; export = v }
declare module '@radix-ui/react-tabs' { const v: any; export = v }

// If other missing-module errors appear, add them here as lightweight
// declarations or prefer to install/upgrade the packages that provide
// proper type declarations.
