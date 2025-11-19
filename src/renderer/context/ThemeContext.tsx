import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme interface
 */
export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  fontFamily: string;
  blurEnabled: boolean;
}

/**
 * Theme context interface
 */
interface ThemeContextType {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  exportTheme: () => string;
  importTheme: (themeJson: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Default theme (Opera GX inspired)
 */
const defaultTheme: Theme = {
  primaryColor: '#8b5cf6', // Purple
  backgroundColor: '#0a0a0f',
  accentColor: '#ec4899', // Pink
  fontFamily: 'Inter',
  blurEnabled: true
};

/**
 * ThemeProvider - manages theme state and applies CSS variables
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme to CSS variables whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /**
   * Load theme from Electron storage
   */
  const loadTheme = async () => {
    try {
      const savedTheme = await window.electronAPI.getTheme();
      if (savedTheme && Object.keys(savedTheme).length > 0) {
        setTheme({ ...defaultTheme, ...savedTheme });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  /**
   * Apply theme to CSS custom properties
   */
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--blur-enabled', theme.blurEnabled ? '1' : '0');
  };

  /**
   * Update theme and save to storage
   */
  const updateTheme = async (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    try {
      await window.electronAPI.saveTheme(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  /**
   * Export theme as JSON string
   */
  const exportTheme = () => {
    return JSON.stringify(theme, null, 2);
  };

  /**
   * Import theme from JSON string
   */
  const importTheme = (themeJson: string) => {
    try {
      const imported = JSON.parse(themeJson);
      updateTheme(imported);
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    updateTheme,
    exportTheme,
    importTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
