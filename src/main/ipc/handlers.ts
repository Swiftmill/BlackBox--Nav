import { IpcMain, session } from 'electron';
import { StorageManager } from '../storage/StorageManager';

/**
 * Setup all IPC handlers for communication between main and renderer processes
 */
export function setupIpcHandlers(
  ipcMain: IpcMain,
  storage: StorageManager,
  toggleAdblocker: (enabled: boolean) => void
) {
  // ===== TABS MANAGEMENT =====
  
  ipcMain.handle('tabs:get', async () => {
    return storage.getTabs();
  });

  ipcMain.handle('tabs:save', async (_event, tabs) => {
    storage.saveTabs(tabs);
  });

  // ===== SETTINGS MANAGEMENT =====
  
  ipcMain.handle('settings:get', async () => {
    return storage.getSettings();
  });

  ipcMain.handle('settings:save', async (_event, settings) => {
    storage.saveSettings(settings);
  });

  // ===== BOOKMARKS MANAGEMENT =====
  
  ipcMain.handle('bookmarks:get', async () => {
    return storage.getBookmarks();
  });

  ipcMain.handle('bookmarks:save', async (_event, bookmarks) => {
    storage.saveBookmarks(bookmarks);
  });

  ipcMain.handle('bookmarks:add', async (_event, bookmark) => {
    const bookmarks = storage.getBookmarks();
    bookmarks.push(bookmark);
    storage.saveBookmarks(bookmarks);
  });

  ipcMain.handle('bookmarks:remove', async (_event, id) => {
    const bookmarks = storage.getBookmarks();
    const filtered = bookmarks.filter((b: any) => b.id !== id);
    storage.saveBookmarks(filtered);
  });

  // ===== THEME MANAGEMENT =====
  
  ipcMain.handle('theme:get', async () => {
    return storage.getTheme();
  });

  ipcMain.handle('theme:save', async (_event, theme) => {
    storage.saveTheme(theme);
  });

  // ===== PRIVACY & CACHE =====
  
  ipcMain.handle('privacy:clear-cache', async () => {
    try {
      await session.defaultSession.clearCache();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return { success: false, error };
    }
  });

  ipcMain.handle('privacy:clear-cookies', async () => {
    try {
      await session.defaultSession.clearStorageData({
        storages: ['cookies']
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cookies:', error);
      return { success: false, error };
    }
  });

  // ===== ADBLOCKER =====
  
  ipcMain.handle('adblocker:toggle', async (_event, enabled) => {
    toggleAdblocker(enabled);
    const settings = storage.getSettings();
    settings.privacy.adBlockerEnabled = enabled;
    storage.saveSettings(settings);
  });
}
