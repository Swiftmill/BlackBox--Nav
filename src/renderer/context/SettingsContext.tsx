import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Settings interface
 */
export interface Settings {
  general: {
    startupBehavior: 'new-tab' | 'restore' | 'specific';
    startupPages: string[];
    searchEngine: 'google' | 'duckduckgo' | 'custom';
    customSearchUrl?: string;
  };
  appearance: {
    animationsEnabled: boolean;
    borderRadius: number;
    showBookmarksBar: boolean;
  };
  performance: {
    maxCpuPercent: number;
    maxRamPercent: number;
    autoCloseInactiveTabs: boolean;
    inactiveTabTimeout: number;
  };
  privacy: {
    adBlockerEnabled: boolean;
  };
}

/**
 * Settings context interface
 */
interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  clearCache: () => Promise<void>;
  clearCookies: () => Promise<void>;
  toggleAdblocker: (enabled: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Default settings
 */
const defaultSettings: Settings = {
  general: {
    startupBehavior: 'restore',
    startupPages: ['https://www.google.com'],
    searchEngine: 'google'
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
    inactiveTabTimeout: 30
  },
  privacy: {
    adBlockerEnabled: true
  }
};

/**
 * SettingsProvider - manages application settings
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Load settings from Electron storage
   */
  const loadSettings = async () => {
    try {
      const savedSettings = await window.electronAPI.getSettings();
      if (savedSettings && Object.keys(savedSettings).length > 0) {
        setSettings({ ...defaultSettings, ...savedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  /**
   * Update settings and save to storage
   */
  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = {
      ...settings,
      ...updates,
      // Deep merge nested objects
      general: { ...settings.general, ...(updates.general || {}) },
      appearance: { ...settings.appearance, ...(updates.appearance || {}) },
      performance: { ...settings.performance, ...(updates.performance || {}) },
      privacy: { ...settings.privacy, ...(updates.privacy || {}) }
    };
    
    setSettings(newSettings);
    
    try {
      await window.electronAPI.saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  /**
   * Clear browser cache
   */
  const clearCache = async () => {
    try {
      await window.electronAPI.clearCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  /**
   * Clear browser cookies
   */
  const clearCookies = async () => {
    try {
      await window.electronAPI.clearCookies();
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  };

  /**
   * Toggle adblocker
   */
  const toggleAdblocker = async (enabled: boolean) => {
    try {
      await window.electronAPI.toggleAdblocker(enabled);
      updateSettings({
        privacy: { ...settings.privacy, adBlockerEnabled: enabled }
      });
    } catch (error) {
      console.error('Failed to toggle adblocker:', error);
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    clearCache,
    clearCookies,
    toggleAdblocker
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/**
 * Hook to use settings context
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
