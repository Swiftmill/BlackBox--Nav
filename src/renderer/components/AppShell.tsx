import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import NavigationBar from './NavigationBar';
import WebViewContainer from './WebViewContainer';
import BookmarksBar from './BookmarksBar';
import GXControlPanel from './GXControlPanel';
import SettingsPanel from './SettingsPanel';
import MusicPlayerPanel from './MusicPlayerPanel';
import TitleBar from './TitleBar';
import { useSettings } from '../context/SettingsContext';

/**
 * Panel types that can be opened from sidebar
 */
type PanelType = 'gx-control' | 'music' | 'settings' | null;

/**
 * AppShell - Main layout component that contains all UI elements
 */
function AppShell() {
  const { settings } = useSettings();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * Toggle panel open/close
   */
  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="app-shell">
      {/* Custom title bar for window controls */}
      <TitleBar />

      <div className="app-content">
        {/* Left sidebar with navigation icons */}
        <Sidebar
          activePanel={activePanel}
          onPanelSelect={togglePanel}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main browser area */}
        <div className="browser-area">
          {/* Tab bar */}
          <TabBar />

          {/* Navigation bar (back/forward/URL) */}
          <NavigationBar />

          {/* Bookmarks bar (optional) */}
          {settings.appearance.showBookmarksBar && <BookmarksBar />}

          {/* WebView container for displaying websites */}
          <WebViewContainer />
        </div>

        {/* Side panels that slide in from right */}
        {activePanel === 'gx-control' && (
          <GXControlPanel onClose={() => setActivePanel(null)} />
        )}
        {activePanel === 'settings' && (
          <SettingsPanel onClose={() => setActivePanel(null)} />
        )}
        {activePanel === 'music' && (
          <MusicPlayerPanel onClose={() => setActivePanel(null)} />
        )}
      </div>
    </div>
  );
}

export default AppShell;
