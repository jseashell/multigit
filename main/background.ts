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

simpleGit().clean(CleanOptions.FORCE);

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

ipcMain.on('git:log', async (event, args) => {
  const pretty =
    '--pretty=format:{"commit":"%H","abbreviatedCommit":"%h","tree":"%T","abbreviatedTree":"%t","parent":"%P","abbreviatedParent":"%p","refs":"%D","sanitizedSubject":"%f","author":{"name":"%aN","email":"%aE","date":"%aI"},"commiter":{"name":"%cN","email":"%cE","date":"%cI"}},';
  // TODO Body and subject do not escape non-whitespace characters
  // '"body":"%b",' +
  // '"subject":"%s",' +

  console.log(`initializing git for ${args.cwd}`);
  const git = simpleGit({
    baseDir: args.cwd,
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
  });

  const gitLog = await git.log({
    '--max-count': '22',
    // '--all': null,
    [pretty]: null,
  });

  const data = `[${gitLog.all[0].hash.substring(0, gitLog.all[0].hash.length - 1)}]`;
  const commits = JSON.parse(data);

  const returnValue = {
    cwd: args.cwd,
    commits: commits,
  };

  event.returnValue = returnValue;
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
