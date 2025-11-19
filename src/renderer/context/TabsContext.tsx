import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Tab interface
 */
export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  active: boolean;
}

/**
 * Tabs context interface
 */
interface TabsContextType {
  tabs: Tab[];
  activeTab: Tab | null;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  duplicateTab: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

/**
 * TabsProvider - manages all tab state and operations
 */
export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTabState] = useState<Tab | null>(null);

  // Load tabs from storage on mount
  useEffect(() => {
    loadTabs();
  }, []);

  // Save tabs whenever they change
  useEffect(() => {
    if (tabs.length > 0) {
      saveTabs();
    }
  }, [tabs]);

  // Update active tab when tabs change
  useEffect(() => {
    const active = tabs.find(tab => tab.active);
    setActiveTabState(active || null);
  }, [tabs]);

  /**
   * Load tabs from Electron storage
   */
  const loadTabs = async () => {
    try {
      const savedTabs = await window.electronAPI.getTabs();
      if (savedTabs && savedTabs.length > 0) {
        setTabs(savedTabs);
      } else {
        // Create default tab if none exist
        setTabs([{
          id: Date.now().toString(),
          url: 'https://www.google.com',
          title: 'New Tab',
          favicon: '',
          active: true
        }]);
      }
    } catch (error) {
      console.error('Failed to load tabs:', error);
    }
  };

  /**
   * Save tabs to Electron storage
   */
  const saveTabs = async () => {
    try {
      await window.electronAPI.saveTabs(tabs);
    } catch (error) {
      console.error('Failed to save tabs:', error);
    }
  };

  /**
   * Add a new tab
   */
  const addTab = useCallback((url: string = 'https://www.google.com') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      url,
      title: 'New Tab',
      favicon: '',
      active: true
    };

    setTabs(prevTabs => {
      // Deactivate all other tabs
      const updatedTabs = prevTabs.map(tab => ({ ...tab, active: false }));
      return [...updatedTabs, newTab];
    });
  }, []);

  /**
   * Close a tab
   */
  const closeTab = useCallback((id: string) => {
    setTabs(prevTabs => {
      const filtered = prevTabs.filter(tab => tab.id !== id);
      
      // If we closed the active tab, activate another one
      if (filtered.length > 0 && !filtered.some(tab => tab.active)) {
        filtered[filtered.length - 1].active = true;
      }
      
      // If no tabs left, create a new one
      if (filtered.length === 0) {
        return [{
          id: Date.now().toString(),
          url: 'https://www.google.com',
          title: 'New Tab',
          favicon: '',
          active: true
        }];
      }
      
      return filtered;
    });
  }, []);

  /**
   * Set active tab
   */
  const setActiveTab = useCallback((id: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        active: tab.id === id
      }))
    );
  }, []);

  /**
   * Update tab properties
   */
  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === id ? { ...tab, ...updates } : tab
      )
    );
  }, []);

  /**
   * Duplicate a tab
   */
  const duplicateTab = useCallback((id: string) => {
    setTabs(prevTabs => {
      const tabToDuplicate = prevTabs.find(tab => tab.id === id);
      if (!tabToDuplicate) return prevTabs;

      const newTab: Tab = {
        ...tabToDuplicate,
        id: Date.now().toString(),
        active: true
      };

      const updatedTabs = prevTabs.map(tab => ({ ...tab, active: false }));
      return [...updatedTabs, newTab];
    });
  }, []);

  /**
   * Reorder tabs (for drag and drop)
   */
  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const [removed] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, removed);
      return newTabs;
    });
  }, []);

  const value: TabsContextType = {
    tabs,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    updateTab,
    duplicateTab,
    reorderTabs
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

/**
 * Hook to use tabs context
 */
export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within TabsProvider');
  }
  return context;
}
