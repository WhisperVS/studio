"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1000,
          boxShadow: 'var(--shadow)'
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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 1000,
        boxShadow: 'var(--shadow)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.backgroundColor = 'var(--accent)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
        e.currentTarget.style.backgroundColor = 'var(--background)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
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