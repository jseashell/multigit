import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import simpleGit, { CleanOptions, TaskOptions } from 'simple-git';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const baseDir = '/Users/jschelli/git/know-client'; // process.cwd();

simpleGit().clean(CleanOptions.FORCE);
const git = simpleGit({
  baseDir: baseDir,
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

ipcMain.on('cwd', (event, args) => {
  event.returnValue = baseDir;
});

ipcMain.on('git:log', async (event, args) => {
  console.debug('git:log');

  const history = await git.log();

  event.returnValue = {
    data: history,
  };
});

ipcMain.on('git:current-branch', async (event, args) => {
  const currentBranch = await git.branch({
    '--show-current': null,
  } as TaskOptions);

  console.debug('git:current-branch', currentBranch);
  event.returnValue = {
    data: currentBranch,
  };
});
