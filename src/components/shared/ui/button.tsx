import * as React from "react"
import { Slot } from "./slot-fallback"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        destructive: "btn-destructive",
        outline: "btn-outline", 
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        link: "btn-link",
        // Action-specific button variants
        "export": "btn-export", 
        "view-settings": "btn-view-settings",
        "clear-filters": "btn-clear-filters",
        "select-all": "btn-select-all",
        "clear-selection": "btn-clear-selection",
        "apply": "btn-apply",
        "cancel": "btn-cancel",
        "delete": "btn-delete",
        "connect": "btn-connect",
      },
      size: {
        default: "btn-size-default",
        sm: "btn-size-sm", 
        lg: "btn-size-lg",
        icon: "btn-size-icon",
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
