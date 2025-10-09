"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/providers";
import { useEffect, useState } from "react";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="theme-toggle-btn"
        style={{
          width: '28px',
          height: '28px',
          border: 'none',
          borderRadius: '50%',
          background: 'var(--theme-toggle-bg)',
          color: 'var(--theme-toggle-text)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--theme-toggle-shadow)'
        }}
      >
        {/* Placeholder icon during SSR */}
        <div className="theme-toggle-placeholder-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1000,
        boxShadow: 'var(--shadow)'
      }}
    >
      {theme === "dark" ? (
        <SunMedium 
          size={20} 
          className="theme-toggle-sun-icon"
        />
      ) : (
        <MoonStar 
          size={20} 
          className="theme-toggle-moon-icon"
        />
      )}
    </button>
  );
}