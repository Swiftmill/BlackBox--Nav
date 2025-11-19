import React, { useState } from 'react';
import { useTabs } from '../context/TabsContext';

/**
 * TabBar - Chrome-style tab management
 */
function TabBar() {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useTabs();
  const [draggedTab, setDraggedTab] = useState<string | null>(null);

  /**
   * Handle tab click
   */
  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  /**
   * Handle tab close (middle click or close button)
   */
  const handleTabClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  /**
   * Handle middle mouse button click to close tab
   */
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      closeTab(id);
    }
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTab(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Handle drop
   */
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedTab && draggedTab !== targetId) {
      // Reorder logic would go here
      // For simplicity, we'll skip the full implementation
    }
    setDraggedTab(null);
  };

  /**
   * Truncate long titles
   */
  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.active ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            onMouseDown={(e) => handleMouseDown(e, tab.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tab.id)}
          >
            <div className="tab-favicon">
              {tab.favicon ? (
                <img src={tab.favicon} alt="" width="16" height="16" />
              ) : (
                <span className="tab-favicon-placeholder">🌐</span>
              )}
            </div>
            
            <div className="tab-title">
              {truncateTitle(tab.title)}
            </div>
            
            <button
              className="tab-close"
              onClick={(e) => handleTabClose(e, tab.id)}
              title="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        className="new-tab-button"
        onClick={() => addTab()}
        title="New tab (Ctrl+T)"
      >
        +
      </button>
    </div>
  );
}

export default TabBar;
