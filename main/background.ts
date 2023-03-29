import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import simpleGit, { CleanOptions } from 'simple-git';
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
    // mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('cwd', (event, args) => {
  event.returnValue = baseDir;
});

ipcMain.on('git:log', async (event, args) => {
  // const history = await git.log({
  //   '--all': null,
  //   '--decorate': null,
  //   '--oneline': null,
  //   '--graph': null,
  // });

  const history = await git.log({
    // '--max-count': '5',
    // "body":"%b"
    '--pretty=format:{"commit":"%H","abbreviated_commit":"%h","tree":"%T","abbreviated_tree":"%t","parent":"%P","abbreviated_parent":"%p","refs":"%D","sanitized_subject_line":"%f","subject":"%s","author":{"name":"%aN","email":"%aE","date":"%aI"},"commiter":{"name":"%cN","email":"%cE","date":"%cI"}},':
      null,
  });

  // convert the history data to a valid JSON string: strip the trailing comma and adding array brackets around it
  const json = JSON.parse(`[${history.all[0].hash.substring(0, history.all[0].hash.length - 1)}]`);
  console.log('history', json);

  event.returnValue = {
    data: json,
  };
});

ipcMain.on('git:current-branch', async (event, args) => {
  const currentBranch = (await git.branch()).current;
  console.debug('git:current-branch', currentBranch);
  event.returnValue = {
    data: currentBranch,
  };
});
