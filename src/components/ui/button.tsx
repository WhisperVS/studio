import * as React from "react"
import { Slot } from "./slot-fallback"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 border border-[var(--primary)]",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 border border-[var(--destructive)]",
        outline:
          "border border-[var(--input-border)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] text-[var(--page-text)]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80 border border-[var(--secondary)]",
        ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] text-[var(--page-text)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        // Clean button variants using CSS variables
        "add-asset": "bg-[var(--btn-add-asset-bg)] text-[var(--btn-add-asset-text)] hover:bg-[var(--btn-add-asset-hover)] border border-[var(--btn-add-asset-bg)] hover:border-[var(--btn-add-asset-hover)]",
        "export": "bg-[var(--btn-export-bg)] text-[var(--btn-export-text)] hover:bg-[var(--btn-export-hover)] border border-[var(--btn-export-bg)] hover:border-[var(--btn-export-hover)]", 
        "view-settings": "bg-[var(--btn-view-settings-bg)] text-[var(--btn-view-settings-text)] hover:bg-[var(--btn-view-settings-hover)] border border-[var(--input-border)]",
        "clear-filters": "bg-[var(--btn-clear-filters-bg)] text-[var(--btn-clear-filters-text)] hover:bg-[var(--btn-clear-filters-hover)] border border-[var(--input-border)]",
        "select-all": "bg-[var(--btn-select-all-bg)] text-[var(--btn-select-all-text)] hover:bg-[var(--btn-select-all-hover)] border border-[var(--btn-select-all-bg)] hover:border-[var(--btn-select-all-hover)]",
        "clear-selection": "bg-[var(--btn-clear-selection-bg)] text-[var(--btn-clear-selection-text)] hover:bg-[var(--btn-clear-selection-hover)] border border-[var(--input-border)]",
        "apply": "bg-[var(--btn-apply-bg)] text-[var(--btn-apply-text)] hover:bg-[var(--btn-apply-hover)] border border-[var(--btn-apply-bg)] hover:border-[var(--btn-apply-hover)]",
        "cancel": "bg-[var(--btn-cancel-bg)] text-[var(--btn-cancel-text)] hover:bg-[var(--btn-cancel-hover)] border border-[var(--btn-cancel-bg)] hover:border-[var(--btn-cancel-hover)]",
        "delete": "bg-[var(--btn-delete-bg)] text-[var(--btn-delete-text)] hover:bg-[var(--btn-delete-hover)] border border-[var(--btn-delete-bg)] hover:border-[var(--btn-delete-hover)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
