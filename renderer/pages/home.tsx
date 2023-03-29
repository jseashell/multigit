import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitCommitComponent, { GitCommit } from '../components/git-commit';

function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const [cwd, setCwd] = React.useState('');
  const [history, setHistory] = React.useState({
    data: [] as GitCommit[],
  } as History);

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  React.useEffect(() => {
    const cwd = ipcRenderer.sendSync('cwd');
    setCwd(cwd);

    const gitLog = ipcRenderer.sendSync('git:log');
    console.log('gitLog', gitLog);
    setHistory(gitLog);
  }, []);

  const handleContextMenu = () => {
    // TODO
  };

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>

      <div className='grid grid-cols-1 w-full'>
        <h1 className='text-lg text-gray-500'>{cwd}</h1>
        <hr />
        <ul>
          {history?.data?.map((commit, i) => (
            <li key={i} className='w-full flex m-px' onContextMenu={handleContextMenu}>
              <GitCommitComponent commit={commit}></GitCommitComponent>
            </li>
          ))}
        </ul>
        <hr />
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'>
        <Link href='/next'>
          <a className='btn-blue'>Go to next page</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Home;

interface History {
  data: GitCommit[];
}
