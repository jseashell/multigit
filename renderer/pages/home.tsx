import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitHistory from '../components/git-history';

function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const [currentBranch, setCurrentBranch] = React.useState({
    data: '',
  });
  const [cwd, setCwd] = React.useState('');
  const [history, setHistory] = React.useState({
    data: null,
  });

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  React.useEffect(() => {
    const cwd = ipcRenderer.sendSync('cwd');
    setCwd(cwd);

    const currentBranch = ipcRenderer.sendSync('git:current-branch');
    setCurrentBranch(currentBranch);

    const history = ipcRenderer.sendSync('git:log');
    setHistory(history);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>
      <GitHistory cwd={cwd} history={history}></GitHistory>
      <div className='mt-1 w-full flex-wrap flex justify-center'>
        <Link href='/next'>
          <a className='btn-blue'>Go to next page</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Home;
