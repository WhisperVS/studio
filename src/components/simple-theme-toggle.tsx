"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        zIndex: 1000
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.borderColor = '#d1d5db';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#ffffff';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {theme === "dark" ? (
        <SunMedium size={20} color="#374151" />
      ) : (
        <MoonStar size={20} color="#374151" />
      )}
    </button>
  );
}