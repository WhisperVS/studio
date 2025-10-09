"use client";

import React from "react";
import { usePlatformClasses } from "@/hooks/use-platform";

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  usePlatformClasses();
  return <>{children}</>;
}