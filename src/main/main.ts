import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupIpcHandlers } from './ipc/handlers';
import { StorageManager } from './storage/StorageManager';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let adblocker: ElectronBlocker | null = null;

// Storage manager instance
const storageManager = new StorageManager();

/**
 * Create the main browser window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    frame: false, // Custom title bar for gaming aesthetic
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Enable webview for browser tabs
      sandbox: false
    },
    show: false // Don't show until ready
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Initialize adblocker
 */
async function initializeAdblocker() {
  try {
    const settings = storageManager.getSettings();
    if (settings.privacy.adBlockerEnabled) {
      adblocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
      adblocker.enableBlockingInSession(session.defaultSession);
      console.log('Adblocker initialized');
    }
  } catch (error) {
    console.error('Failed to initialize adblocker:', error);
  }
}

/**
 * Toggle adblocker on/off
 */
function toggleAdblocker(enabled: boolean) {
  if (enabled && !adblocker) {
    initializeAdblocker();
  } else if (!enabled && adblocker) {
    adblocker.disableBlockingInSession(session.defaultSession);
    adblocker = null;
  }
}

// App lifecycle
app.whenReady().then(async () => {
  createWindow();
  await initializeAdblocker();
  setupIpcHandlers(ipcMain, storageManager, toggleAdblocker);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle window controls
ipcMain.on('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window:close', () => {
  mainWindow?.close();
});

// Performance monitoring
ipcMain.handle('performance:get-stats', async () => {
  const cpuUsage = process.getCPUUsage();
  const memoryUsage = process.memoryUsage();
  
  return {
    cpu: cpuUsage.percentCPUUsage.toFixed(1),
    memory: (memoryUsage.heapUsed / 1024 / 1024).toFixed(0), // MB
    totalMemory: (memoryUsage.heapTotal / 1024 / 1024).toFixed(0)
  };
});
