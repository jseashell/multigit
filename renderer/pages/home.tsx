import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitCommitComponent, { GitCommit } from '../components/git-commit';

function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const [graphIndent, setGraphIndent] = React.useState(1);
  const [history_1, setHistory_1] = React.useState({
    cwd: '',
    commits: [] as GitCommit[],
  } as GitHistory);

  const [history_2, setHistory_2] = React.useState({
    cwd: '',
    commits: [] as GitCommit[],
  } as GitHistory);

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  React.useEffect(() => {
    const history_1 = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/multigit' });
    setHistory_1(history_1);

    const history_2 = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/know-client' });
    setHistory_2(history_2);
  }, []);

  const handleContextMenu = () => {
    // TODO
  };

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>

      <div className='grid grid-cols-2 w-full'>
        <section className='border border-white'>
          <h1 className='text-lg text-gray-500'>{history_1?.cwd}</h1>
          <hr />
          <ul>
            {history_1?.commits?.map((commit, i) => {
              return (
                <li key={i} className='w-full flex m-px' onContextMenu={handleContextMenu}>
                  <GitCommitComponent
                    commit={commit}
                    previousCommit={i > 0 ? history_1?.commits[i] : null}
                    graphIndent={graphIndent}></GitCommitComponent>
                </li>
              );
            })}
          </ul>
        </section>
        <section className='border border-white'>
          <h1 className='text-lg text-gray-500'>{history_2?.cwd}</h1>
          <hr />
          <ul>
            {history_2?.commits?.map((commit, i) => {
              return (
                <li key={i} className='w-full flex m-px' onContextMenu={handleContextMenu}>
                  <GitCommitComponent
                    commit={commit}
                    previousCommit={i > 0 ? history_2.commits[i] : null}
                    graphIndent={graphIndent}></GitCommitComponent>
                </li>
              );
            })}
          </ul>
        </section>
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

interface GitHistory {
  cwd: string;
  commits: GitCommit[];
}
