import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script - exposes safe IPC APIs to renderer process
 * This creates a bridge between the main process and renderer
 */

// Define the API interface
export interface ElectronAPI {
  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // Tabs management
  getTabs: () => Promise<any[]>;
  saveTabs: (tabs: any[]) => Promise<void>;

  // Settings management
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<void>;

  // Bookmarks management
  getBookmarks: () => Promise<any[]>;
  saveBookmarks: (bookmarks: any[]) => Promise<void>;
  addBookmark: (bookmark: any) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;

  // Theme management
  getTheme: () => Promise<any>;
  saveTheme: (theme: any) => Promise<void>;

  // Performance monitoring
  getPerformanceStats: () => Promise<{ cpu: string; memory: string; totalMemory: string }>;

  // Cache and privacy
  clearCache: () => Promise<void>;
  clearCookies: () => Promise<void>;

  // Adblocker
  toggleAdblocker: (enabled: boolean) => Promise<void>;
}

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Tabs management
  getTabs: () => ipcRenderer.invoke('tabs:get'),
  saveTabs: (tabs: any[]) => ipcRenderer.invoke('tabs:save', tabs),

  // Settings management
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),

  // Bookmarks management
  getBookmarks: () => ipcRenderer.invoke('bookmarks:get'),
  saveBookmarks: (bookmarks: any[]) => ipcRenderer.invoke('bookmarks:save', bookmarks),
  addBookmark: (bookmark: any) => ipcRenderer.invoke('bookmarks:add', bookmark),
  removeBookmark: (id: string) => ipcRenderer.invoke('bookmarks:remove', id),

  // Theme management
  getTheme: () => ipcRenderer.invoke('theme:get'),
  saveTheme: (theme: any) => ipcRenderer.invoke('theme:save', theme),

  // Performance monitoring
  getPerformanceStats: () => ipcRenderer.invoke('performance:get-stats'),

  // Cache and privacy
  clearCache: () => ipcRenderer.invoke('privacy:clear-cache'),
  clearCookies: () => ipcRenderer.invoke('privacy:clear-cookies'),

  // Adblocker
  toggleAdblocker: (enabled: boolean) => ipcRenderer.invoke('adblocker:toggle', enabled)
} as ElectronAPI);

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
