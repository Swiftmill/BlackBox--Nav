import { app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * StorageManager - Handles all persistent data storage
 * Uses JSON files stored in the app's userData directory
 */
export class StorageManager {
  private userDataPath: string;
  private tabsPath: string;
  private settingsPath: string;
  private bookmarksPath: string;
  private themePath: string;

  constructor() {
    // Get the user data directory (platform-specific)
    this.userDataPath = app.getPath('userData');
    
    // Define file paths
    this.tabsPath = path.join(this.userDataPath, 'tabs.json');
    this.settingsPath = path.join(this.userDataPath, 'settings.json');
    this.bookmarksPath = path.join(this.userDataPath, 'bookmarks.json');
    this.themePath = path.join(this.userDataPath, 'theme.json');

    // Ensure directory exists
    if (!fs.existsSync(this.userDataPath)) {
      fs.mkdirSync(this.userDataPath, { recursive: true });
    }

    // Initialize files if they don't exist
    this.initializeFiles();
  }

  /**
   * Initialize storage files with default values
   */
  private initializeFiles() {
    // Default tabs
    if (!fs.existsSync(this.tabsPath)) {
      this.saveTabs([
        {
          id: '1',
          url: 'https://www.google.com',
          title: 'New Tab',
          favicon: '',
          active: true
        }
      ]);
    }

    // Default settings
    if (!fs.existsSync(this.settingsPath)) {
      this.saveSettings({
        general: {
          startupBehavior: 'restore', // 'new-tab' | 'restore' | 'specific'
          startupPages: ['https://www.google.com'],
          searchEngine: 'google' // 'google' | 'duckduckgo' | 'custom'
        },
        appearance: {
          animationsEnabled: true,
          borderRadius: 8,
          showBookmarksBar: true
        },
        performance: {
          maxCpuPercent: 80,
          maxRamPercent: 70,
          autoCloseInactiveTabs: false,
          inactiveTabTimeout: 30 // minutes
        },
        privacy: {
          adBlockerEnabled: true
        }
      });
    }

    // Default bookmarks
    if (!fs.existsSync(this.bookmarksPath)) {
      this.saveBookmarks([
        {
          id: '1',
          title: 'Google',
          url: 'https://www.google.com',
          favicon: 'https://www.google.com/favicon.ico',
          folder: 'default'
        }
      ]);
    }

    // Default theme
    if (!fs.existsSync(this.themePath)) {
      this.saveTheme({
        primaryColor: '#8b5cf6', // Purple
        backgroundColor: '#0a0a0f',
        accentColor: '#ec4899', // Pink
        fontFamily: 'Inter',
        blurEnabled: true
      });
    }
  }

  /**
   * Read JSON file safely
   */
  private readJSON(filePath: string, defaultValue: any = null) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      return defaultValue;
    }
  }

  /**
   * Write JSON file safely
   */
  private writeJSON(filePath: string, data: any) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing ${filePath}:`, error);
    }
  }

  // ===== PUBLIC API =====

  getTabs() {
    return this.readJSON(this.tabsPath, []);
  }

  saveTabs(tabs: any[]) {
    this.writeJSON(this.tabsPath, tabs);
  }

  getSettings() {
    return this.readJSON(this.settingsPath, {});
  }

  saveSettings(settings: any) {
    this.writeJSON(this.settingsPath, settings);
  }

  getBookmarks() {
    return this.readJSON(this.bookmarksPath, []);
  }

  saveBookmarks(bookmarks: any[]) {
    this.writeJSON(this.bookmarksPath, bookmarks);
  }

  getTheme() {
    return this.readJSON(this.themePath, {});
  }

  saveTheme(theme: any) {
    this.writeJSON(this.themePath, theme);
  }
}
