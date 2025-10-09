
"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";
import { PlatformProvider } from "./PlatformProvider";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="gaim-theme">
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}