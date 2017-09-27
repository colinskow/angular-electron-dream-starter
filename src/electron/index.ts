import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import url from 'url';
import './dev-extensions';
import { Observable } from 'rxjs';
import rxIcp from 'rx-ipc-electron/lib/main';

declare const DEV_SERVER: boolean;

const indexUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(indexUrl);

  // Open the DevTools.
  if (DEV_SERVER) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// Here is an example of utlizing observables for IPC(Inter Process Communication).
// With help from 'rx-ipc-electron' by @ColinSkow
// See https://github.com/colinskow/rx-ipc-electron for the full API.
// This listener is called from an NGRX Effect in the home component of the app module.
function listenForEffect(...args): Observable<any> {
  return Observable.from(args).map(x => x * 2);
}

rxIcp.registerListener('listen-effect', listenForEffect);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('show-dialog', (event, arg) => {
  dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['OK'],
    title: 'Native Dialog',
    message: 'I\'m a native dialog!',
    detail: 'It\'s my pleasure to make your life better.'
  });
});
