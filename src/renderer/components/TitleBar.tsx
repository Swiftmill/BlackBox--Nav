import React from 'react';

/**
 * TitleBar - Custom window controls for frameless window
 */
function TitleBar() {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag">
        <div className="title-bar-logo">
          <span className="logo-text">GX</span>
        </div>
        <div className="title-bar-title">GX Browser</div>
      </div>
      
      <div className="title-bar-controls">
        <button
          className="title-bar-button minimize"
          onClick={handleMinimize}
          title="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="0" y="5" width="12" height="2" fill="currentColor" />
          </svg>
        </button>
        
        <button
          className="title-bar-button maximize"
          onClick={handleMaximize}
          title="Maximize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="0" y="0" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        
        <button
          className="title-bar-button close"
          onClick={handleClose}
          title="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M0 0 L12 12 M12 0 L0 12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
