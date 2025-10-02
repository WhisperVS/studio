"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

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
        backgroundColor: theme === "dark" ? 'rgba(51, 65, 85, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: theme === "dark" ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(203, 213, 225, 0.4)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 1000,
        boxShadow: theme === "dark" 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.backgroundColor = theme === "dark" ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
        e.currentTarget.style.borderColor = theme === "dark" ? 'rgba(99, 102, 241, 0.6)' : 'rgba(99, 102, 241, 0.4)';
        e.currentTarget.style.boxShadow = theme === "dark"
          ? '0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)'
          : '0 10px 15px -3px rgba(99, 102, 241, 0.2), 0 4px 6px -2px rgba(99, 102, 241, 0.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
        e.currentTarget.style.backgroundColor = theme === "dark" ? 'rgba(51, 65, 85, 0.9)' : 'rgba(255, 255, 255, 0.95)';
        e.currentTarget.style.borderColor = theme === "dark" ? 'rgba(99, 102, 241, 0.3)' : 'rgba(203, 213, 225, 0.4)';
        e.currentTarget.style.boxShadow = theme === "dark" 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
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
          color="#fbbf24" 
          style={{ 
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))'
          }} 
        />
      ) : (
        <MoonStar 
          size={20} 
          color="#6366f1" 
          style={{ 
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))'
          }} 
        />
      )}
    </button>
  );
}