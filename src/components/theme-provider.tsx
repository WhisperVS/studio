"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

function applyThemeWithNoTransition(theme: Theme) {
  const root = document.documentElement;
  // Add the guard class to disable transitions
  root.classList.add("theme-changing");

  // Apply the theme class on the next frame for reliability
  requestAnimationFrame(() => {
    applyThemeClass(theme);
    // Remove the guard after a tiny delay so variables have settled
    setTimeout(() => {
      root.classList.remove("theme-changing");
    }, 150);
  });
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "gaim-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Apply on mount (without a transition flash)
  useEffect(() => {
    if (typeof window === "undefined") return;
    applyThemeClass(theme);
    // Keep system theme reactive if user changes OS theme
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") applyThemeWithNoTransition("system");
    };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply on theme updates (disable transitions briefly)
  useEffect(() => {
    if (typeof window === "undefined") return;
    applyThemeWithNoTransition(theme);
  }, [theme]);

  const value = useMemo<ThemeProviderState>(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {}
      setThemeState(newTheme);
    },
  }), [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
