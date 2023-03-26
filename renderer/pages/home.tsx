import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitLocalBranch from '../components/git-local-branch';
import GitRemoteBranch from '../components/git-remote-branch';
import GitTag from '../components/git-tag';

function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

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

    const history = ipcRenderer.sendSync('git:log');
    setHistory(history);
  }, []);

  const getRefs = (refs) => {
    const split = refs.split(',');
    return split
      ?.map((ref: string) => {
        if (ref.includes('HEAD -> ')) {
          return <GitLocalBranch>{ref.match(/HEAD -> (.*)/)[1]}</GitLocalBranch>;
        } else if (ref === 'origin/HEAD') {
          // TODO handle dynamic remote names
          return null;
        } else if (ref.includes('tag')) {
          return <GitTag>{ref.match(/tag: (.*)/)[1]}</GitTag>;
        } else if (ref.includes('origin')) {
          return <GitRemoteBranch>{ref}</GitRemoteBranch>;
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
        <h2 className='text-xl'>Manage multiple git repositories in one dashboard</h2>
        <h3>{cwd}</h3>
        <hr />
        <li className='grid grid-cols-4 w-full p-2'>
          <span className='grow'>Message</span>
          <span className='flex-none'>Author</span>
          <span className='flex-none'>Commit</span>
          <span className='flex-none'>Date</span>
        </li>
        <ul>
          {history?.data?.all?.map((item) => (
            <li className='grid grid-cols-4 w-full p-2'>
              <span>
                {getRefs(item.refs)} {item.message}
              </span>
              <span>{item.author_name}</span>
              <span>{item.hash.substring(0, 8)}</span>
              <span>
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
