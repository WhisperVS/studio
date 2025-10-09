"use client";

import { useEffect } from 'react';
import { platformUtils } from '@/lib/platform-utils';

/**
 * Hook to apply platform-specific CSS classes to the document body
 */
export function usePlatformClasses() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get platform info
    const os = platformUtils.getOS();
    
    // Remove any existing platform classes
    document.body.classList.remove('platform-macos', 'platform-windows', 'platform-linux', 'platform-unknown');
    document.body.classList.remove('os-macos', 'os-windows', 'os-linux', 'os-unknown');
    
    // Add the current platform classes
    document.body.classList.add(`platform-${os}`);
    document.body.classList.add(`os-${os}`);
    
    // Apply additional platform-specific optimizations
    if (os === 'macos') {
      // macOS-specific optimizations
      document.body.style.setProperty('--scrollbar-width', `${platformUtils.getScrollbarWidth()}px`);
      document.body.style.setProperty('--button-height', '36px');
    } else if (os === 'windows') {
      // Windows-specific optimizations
      document.body.style.setProperty('--scrollbar-width', `${platformUtils.getScrollbarWidth()}px`);
      document.body.style.setProperty('--button-height', '40px');
    }

    // Cleanup function to remove classes
    return () => {
      document.body.classList.remove(`platform-${os}`, `os-${os}`);
    };
  }, []);
}

export default usePlatformClasses;