
"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(203, 213, 225, 0.3)',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: 'visible',
        opacity: 1,
        position: 'relative',
        zIndex: 999
      }}
    >
      <SunMedium data-theme-icon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ width: '20px', height: '20px' }} />
      <MoonStar data-theme-icon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" style={{ width: '20px', height: '20px' }} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
