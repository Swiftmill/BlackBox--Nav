import React, { useState, useEffect } from 'react';
import { useTabs } from '../context/TabsContext';
import { useSettings } from '../context/SettingsContext';

/**
 * NavigationBar - URL bar and navigation controls
 */
function NavigationBar() {
  const { activeTab, updateTab } = useTabs();
  const { settings } = useSettings();
  const [urlInput, setUrlInput] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Update URL input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab]);

  /**
   * Handle URL submission
   */
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;

    let url = urlInput.trim();

    // Check if input is a URL or search query
    if (isValidUrl(url)) {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
    } else {
      // Treat as search query
      url = getSearchUrl(url);
    }

    updateTab(activeTab.id, { url });
  };

  /**
   * Check if string is a valid URL
   */
  const isValidUrl = (str: string): boolean => {
    // Simple URL validation
    return str.includes('.') && !str.includes(' ') || str.startsWith('http');
  };

  /**
   * Get search URL based on settings
   */
  const getSearchUrl = (query: string): string => {
    const encodedQuery = encodeURIComponent(query);
    
    switch (settings.general.searchEngine) {
      case 'google':
        return `https://www.google.com/search?q=${encodedQuery}`;
      case 'duckduckgo':
        return `https://duckduckgo.com/?q=${encodedQuery}`;
      case 'custom':
        return settings.general.customSearchUrl?.replace('%s', encodedQuery) || `https://www.google.com/search?q=${encodedQuery}`;
      default:
        return `https://www.google.com/search?q=${encodedQuery}`;
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    // In a real implementation, this would use webview's goBack()
    console.log('Navigate back');
  };

  /**
   * Handle forward navigation
   */
  const handleForward = () => {
    // In a real implementation, this would use webview's goForward()
    console.log('Navigate forward');
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    if (activeTab) {
      // Force re-render by updating URL
      updateTab(activeTab.id, { url: activeTab.url });
    }
  };

  /**
   * Toggle bookmark
   */
  const handleToggleBookmark = async () => {
    if (!activeTab) return;

    if (isBookmarked) {
      // Remove bookmark
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const bookmark = {
        id: Date.now().toString(),
        title: activeTab.title,
        url: activeTab.url,
        favicon: activeTab.favicon,
        folder: 'default'
      };
      await window.electronAPI.addBookmark(bookmark);
      setIsBookmarked(true);
    }
  };

  return (
    <div className="navigation-bar">
      <div className="nav-controls">
        <button
          className="nav-button"
          onClick={handleBack}
          title="Back"
        >
          ←
        </button>
        
        <button
          className="nav-button"
          onClick={handleForward}
          title="Forward"
        >
          →
        </button>
        
        <button
          className="nav-button"
          onClick={handleRefresh}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      <form className="url-bar" onSubmit={handleUrlSubmit}>
        <input
          type="text"
          className="url-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Search or enter URL..."
        />
        
        <button
          type="button"
          className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleToggleBookmark}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </form>
    </div>
  );
}

export default NavigationBar;
