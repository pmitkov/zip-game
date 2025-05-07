import { app, BrowserWindow } from "electron";
import path from 'path';

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  const startURL = app.isPackaged ? `file://${path.join(__dirname, 'zip-game','index.html')}` : `http://localhost:4200`;
  mainWindow.loadURL(startURL);

};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
