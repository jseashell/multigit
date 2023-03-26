import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitLocalBranch from '../components/git-local-branch';
import GitRemoteBranch from '../components/git-remote-branch';
import GitTag from '../components/git-tag';

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

  const getRefs = (refs) => {
    const split = refs.split(',');
    let hasLocal = false;
    let hasRemote = false;

    return split
      ?.map((ref: string) => {
        if (ref.includes('HEAD -> ')) {
          hasLocal = true;
          const branch = ref.match(/HEAD -> (.*)/)[1];
          return (
            <GitLocalBranch>
              {branch} {currentBranch.data === branch && <span>{'\u2713'}</span>}
            </GitLocalBranch>
          );
        } else if (ref.includes('origin/HEAD')) {
          // TODO handle dynamic remote names
          return null;
        } else if (ref.includes('tag')) {
          return <GitTag>{ref.match(/tag: (.*)/)[1]}</GitTag>;
        } else if (ref.includes('origin')) {
          if (hasLocal) {
            return (
              <GitRemoteBranch>
                <img className='ml-auto mr-auto' width='32px' height='32px' src='/images/git-branch.svg' />
              </GitRemoteBranch>
            );
          } else {
            return <GitRemoteBranch>{ref}</GitRemoteBranch>;
          }
        }
      })
      .filter((item: string) => !!item);
  };

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>
      <div className='grid grid-cols-1 w-full'>
        <img className='ml-auto mr-auto' src='/images/logo.png' />
        <h1 className='text-2xl'>MultiGit</h1>
        <h2 className='text-lg text-gray-500'>{cwd}</h2>
        <hr />
        <ul>
          {history?.data?.all?.map((item) => (
            <li className='flex w-full p-2'>
              <span className='flex grow'>
                {getRefs(item.refs)} {item.message}
              </span>
              <span className='flex-none pl-2 pr-2'>{item.author_name}</span>
              <span className='flex-none pl-2 pr-2'>{item.hash.substring(0, 8)}</span>
              <span className='flex-none pl-2 pr-2'>
                {new Date(item.date).toLocaleDateString('en-US')} @ {new Date(item.date).toLocaleTimeString('en-US')}
              </span>
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
