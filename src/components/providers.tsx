
"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/components/user-provider";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="gaim-theme">
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}
