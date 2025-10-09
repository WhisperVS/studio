/**
 * Cross-platform utilities for macOS and Windows compatibility
 */

export const platformUtils = {
  /**
   * Detect the user's operating system
   */
  getOS(): 'macos' | 'windows' | 'linux' | 'unknown' {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('linux')) return 'linux';
    
    return 'unknown';
  },

  /**
   * Check if running on macOS
   */
  isMacOS(): boolean {
    return this.getOS() === 'macos';
  },

  /**
   * Check if running on Windows
   */
  isWindows(): boolean {
    return this.getOS() === 'windows';
  },

  /**
   * Get the appropriate modifier key for keyboard shortcuts
   */
  getModifierKey(): 'metaKey' | 'ctrlKey' {
    return this.isMacOS() ? 'metaKey' : 'ctrlKey';
  },

  /**
   * Get platform-appropriate keyboard shortcut text
   */
  getKeyboardShortcutText(key: string): string {
    const modifier = this.isMacOS() ? '⌘' : 'Ctrl+';
    return `${modifier}${key}`;
  },

  /**
   * Check if the browser supports backdrop-filter
   */
  supportsBackdropFilter(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      'backdropFilter' in document.documentElement.style ||
      'webkitBackdropFilter' in document.documentElement.style
    );
  },

  /**
   * Get appropriate scrollbar width for the platform
   */
  getScrollbarWidth(): number {
    return this.isMacOS() ? 12 : 16;
  },

  /**
   * Apply platform-specific styles
   */
  getPlatformClasses(): string {
    const os = this.getOS();
    return `platform-${os}`;
  }
};

export default platformUtils;