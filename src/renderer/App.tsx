import React from 'react';
import { TabsProvider } from './context/TabsContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import AppShell from './components/AppShell';

/**
 * Main App component - wraps everything with context providers
 */
function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <TabsProvider>
          <AppShell />
        </TabsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
