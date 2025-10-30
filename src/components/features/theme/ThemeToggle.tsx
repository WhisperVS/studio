
"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { useTheme } from "@/components/shared/providers";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle text-sidebar-foreground"
      style={{
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        width: '60px',
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
            <SunMedium data-theme-icon className="absolute h-5 w-5 dark:block hidden" style={{ width: '20px', height: '20px' }} />
      <MoonStar data-theme-icon className="h-5 w-5 dark:hidden block" style={{ width: '20px', height: '20px' }} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
