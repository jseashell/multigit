import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Button from '../components/button';

function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const [isAsyncChecked, setIsAsyncChecked] = React.useState(false);
  const [data, setData] = React.useState('');

  const handleAsyncChange = () => {
    setIsAsyncChecked(!isAsyncChecked);
  };

  const onClickPingPong = () => {
    if (isAsyncChecked) {
      ipcRenderer.send('pingPongAsync', 'Hello async world!');
    } else {
      const data = ipcRenderer.sendSync('pingPong', 'Hello world!');
      setData(data);
    }
  };

  const onClickWithGitLog = () => {
    const data = ipcRenderer.sendSync('gitLog');
    setData(data);
  };

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  React.useEffect(() => {
    ipcRenderer.on('pingPongAsync', (event, data) => {
      setData(data);
    });

    return () => {
      ipcRenderer.removeAllListeners('pingPongAsync');
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>
      <div className='grid grid-col-1 w-full'>
        <img className='ml-auto mr-auto' src='/images/logo.png' />
        <h1>MultiGit</h1>
        <h2>Manage multiple git repositories in one dashboard</h2>
        <hr />
        <div>
          <Button onClick={onClickPingPong}>Ping pong</Button>
          <label>
            <input type='checkbox' className='ml-1 mr-1' checked={isAsyncChecked} onChange={handleAsyncChange} />
            async
          </label>
        </div>
        <Button onClick={onClickWithGitLog}>Git Log</Button>
        <pre>
          <code>{data}</code>
        </pre>
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
