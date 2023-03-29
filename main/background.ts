import { app, ipcMain, Menu, MenuItem } from 'electron';
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
  const pretty =
    '--pretty=format:{' +
    '"commit":"%H",' +
    '"abbreviatedCommit":"%h",' +
    '"tree":"%T",' +
    '"abbreviatedTree":"%t",' +
    '"parent":"%P",' +
    '"abbreviatedParent":"%p",' +
    '"refs":"%D",' +
    // TODO Body and subject do not escape non-whitespace characters
    // '"body":"%b",' +
    // '"subject":"%s",' +
    '"sanitizedSubject":"%f",' +
    '"author":{"name":"%aN","email":"%aE","date":"%aI"},' +
    '"commiter":{"name":"%cN","email":"%cE","date":"%cI"}},';

  const gitLog = await git.log({
    // '--max-count': '5',
    [pretty]: null,
  });

  const data = `[${gitLog.all[0].hash.substring(0, gitLog.all[0].hash.length - 1)}]`;
  const history = JSON.parse(data);

  event.returnValue = {
    data: history,
  };
});

ipcMain.on('context-menu', (_, props) => {
  const menu = new Menu();
  if (props.isEditable) {
    menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
    menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
    menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
  }

  menu.popup();
});
