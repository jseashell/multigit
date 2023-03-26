import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import simpleGit from 'simple-git';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const git = simpleGit(undefined, {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
});

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('gitLog', (event, args) => {
  console.debug('gitLog');

  const history = git.log();

  event.returnValue = JSON.stringify({
    data: history,
  });
});

ipcMain.on('pingPongAsync', (event, args) => {
  console.debug('pingPongAsync');
  event.sender.send('pingPongAsync', `IPC: "${args}"`);
});

ipcMain.on('pingPong', (event, args) => {
  console.debug('pingPong');
  event.returnValue = `IPC: "${args}"`;
});
