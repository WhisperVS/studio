import { platformUtils } from './platform-utils';

export interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export function normalizeShortcut(shortcut: KeyboardShortcut): KeyboardShortcut {
  const platform = platformUtils.getOS();
  
  // On macOS, use Cmd (metaKey) instead of Ctrl for primary shortcuts
  if (platform === 'macos' && shortcut.ctrlKey && !shortcut.metaKey) {
    return {
      ...shortcut,
      ctrlKey: false,
      metaKey: true,
    };
  }
  
  // On Windows/Linux, use Ctrl instead of Cmd for primary shortcuts
  if (platform === 'windows' && shortcut.metaKey && !shortcut.ctrlKey) {
    return {
      ...shortcut,
      metaKey: false,
      ctrlKey: true,
    };
  }
  
  return shortcut;
}

export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const normalized = normalizeShortcut(shortcut);
  
  return (
    event.key === normalized.key &&
    !!event.metaKey === !!normalized.metaKey &&
    !!event.ctrlKey === !!normalized.ctrlKey &&
    !!event.shiftKey === !!normalized.shiftKey &&
    !!event.altKey === !!normalized.altKey
  );
}

export function formatShortcutDisplay(shortcut: KeyboardShortcut): string {
  const platform = platformUtils.getOS();
  const normalized = normalizeShortcut(shortcut);
  
  const parts: string[] = [];
  
  if (normalized.ctrlKey) {
    parts.push(platform === 'macos' ? '⌃' : 'Ctrl');
  }
  
  if (normalized.metaKey) {
    parts.push(platform === 'macos' ? '⌘' : 'Win');
  }
  
  if (normalized.shiftKey) {
    parts.push(platform === 'macos' ? '⇧' : 'Shift');
  }
  
  if (normalized.altKey) {
    parts.push(platform === 'macos' ? '⌥' : 'Alt');
  }
  
  parts.push(normalized.key.toUpperCase());
  
  return parts.join(platform === 'macos' ? '' : '+');
}

// Common shortcuts
export const SHORTCUTS = {
  SAVE: { key: 's', ctrlKey: true },
  COPY: { key: 'c', ctrlKey: true },
  PASTE: { key: 'v', ctrlKey: true },
  CUT: { key: 'x', ctrlKey: true },
  UNDO: { key: 'z', ctrlKey: true },
  REDO: { key: 'z', ctrlKey: true, shiftKey: true },
  SELECT_ALL: { key: 'a', ctrlKey: true },
  FIND: { key: 'f', ctrlKey: true },
  NEW: { key: 'n', ctrlKey: true },
  REFRESH: { key: 'r', ctrlKey: true },
  CLOSE: { key: 'w', ctrlKey: true },
} as const;