import React from 'react';

interface SidebarProps {
  activePanel: string | null;
  onPanelSelect: (panel: any) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar - Vertical navigation bar (Opera GX style)
 */
function Sidebar({ activePanel, onPanelSelect, collapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home', action: () => {} },
    { id: 'gx-control', icon: '⚡', label: 'GX Control', action: () => onPanelSelect('gx-control') },
    { id: 'music', icon: '🎵', label: 'Music Player', action: () => onPanelSelect('music') },
    { id: 'discord', icon: '💬', label: 'Social', action: () => {} },
    { id: 'settings', icon: '⚙️', label: 'Settings', action: () => onPanelSelect('settings') }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-items">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={item.action}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </div>

      <button
        className="sidebar-toggle"
        onClick={onToggleCollapse}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="sidebar-icon">{collapsed ? '→' : '←'}</span>
      </button>
    </div>
  );
}

export default Sidebar;
