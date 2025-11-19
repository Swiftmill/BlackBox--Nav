import React, { useEffect, useRef } from 'react';
import { useTabs } from '../context/TabsContext';

/**
 * WebViewContainer - Displays the active tab's website using Electron webview
 */
function WebViewContainer() {
  const { tabs, activeTab, updateTab } = useTabs();
  const webviewRefs = useRef<{ [key: string]: HTMLWebViewElement | null }>({});

  /**
   * Setup webview event listeners
   */
  useEffect(() => {
    tabs.forEach(tab => {
      const webview = webviewRefs.current[tab.id];
      if (!webview) return;

      // Update title when page loads
      const handlePageTitleUpdated = (e: any) => {
        updateTab(tab.id, { title: e.title });
      };

      // Update favicon
      const handlePageFaviconUpdated = (e: any) => {
        if (e.favicons && e.favicons.length > 0) {
          updateTab(tab.id, { favicon: e.favicons[0] });
        }
      };

      // Handle navigation
      const handleDidNavigate = (e: any) => {
        updateTab(tab.id, { url: e.url });
      };

      // Add event listeners
      webview.addEventListener('page-title-updated', handlePageTitleUpdated);
      webview.addEventListener('page-favicon-updated', handlePageFaviconUpdated);
      webview.addEventListener('did-navigate', handleDidNavigate);

      // Cleanup
      return () => {
        webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
        webview.removeEventListener('page-favicon-updated', handlePageFaviconUpdated);
        webview.removeEventListener('did-navigate', handleDidNavigate);
      };
    });
  }, [tabs, updateTab]);

  return (
    <div className="webview-container">
      {tabs.map(tab => (
        <webview
          key={tab.id}
          ref={(el) => {
            webviewRefs.current[tab.id] = el;
          }}
          src={tab.url}
          className={`webview ${tab.active ? 'active' : 'hidden'}`}
          // @ts-ignore - webview is a custom Electron element
          allowpopups="true"
          // @ts-ignore
          useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 GXBrowser/1.0"
        />
      ))}
    </div>
  );
}

export default WebViewContainer;
