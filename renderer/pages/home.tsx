import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitRef from '../components/git-ref';

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

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>
      <div className='grid grid-cols-1 w-full'>
        <h1 className='text-lg text-gray-500'>{cwd}</h1>
        <hr />
        <ul>
          {history?.data?.all?.map((item) => (
            <li className='flex w-full p-2'>
              <span className=''>
                {item.refs.split(',').map((ref: string) => {
                  return <GitRef gitRef={ref}></GitRef>;
                })}
              </span>
              <span className='flex grow text-ellipsis'>{item.message}</span>
              <span className='flex-none text-ellipsis pl-2 pr-2'>{item.author_name}</span>
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
