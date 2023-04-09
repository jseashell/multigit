import { GitCommit, GitHistory } from '@types';
import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import GitCommitComponent from '../components/git-commit';

const colors = [
  '#dc2626', //red-600
  '#22c55e', //green-500
  '#f97316', // orange-500
  '#2563eb', // blue-600
  '#fde047', // yellow-300
  '#a855f7', // purple-500
];

export default function Home() {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;
  const [assignedColors, setAssignedColors] = React.useState([]);
  const [colorIndex, setColorIndex] = React.useState(0);

  const [branchStack1, setBranchStack1] = React.useState<string[]>([]);
  const [history1, setHistory1] = React.useState<GitHistory>({
    cwd: '',
    commits: [] as GitCommit[],
  });

  const [history2, setHistory2] = React.useState<GitHistory>({
    cwd: '',
    commits: [] as GitCommit[],
  });
  const [el2, setEl2] = React.useState<JSX.Element[]>([]);

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  const handleContextMenu = () => {
    // TODO
  };

  React.useEffect(() => {
    const history_1 = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/multigit' });
    setHistory1(history_1);

    const history2: GitHistory = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/know-client' });

    let branches2: string[] = [];
    const el2 = history2?.commits?.map((commit, i) => {
      const elements = [];

      // always add parent commits to "branches"
      const parents = commit.parent?.split(' ');
      console.log('parents', parents);

      parents?.forEach((parentHash) => branches2.push(parentHash));
      console.log('branches', branches2);

      // draw empty columns
      if (branches2.length > 0) {
        const branchIndex = branches2.indexOf(commit.hash);
        if (branchIndex > -1) {
          console.log('completed branch', commit.hash);
          branches2 = branches2?.splice(branchIndex, 1);
        }

        console.log('drawing columns (# branches)', branches2.length);
        for (let j = 0; j < branches2.length; j++) {
          if (j == 0 && branches2.length == 1) {
            elements.push(
              <span
                key={`${commit.hash}-commit`}
                id={`${commit.hash}-commit`}
                className='w-2 h-2 flex justify-center align-center rounded-full m-4'
                style={{ backgroundColor: colors[j] }}></span>,
            );
          } else if (j == branches2.length - 1) {
            elements.push(
              <span
                key={`${commit.hash}-commit`}
                id={`${commit.hash}-commit`}
                className='w-2 h-2 flex justify-center align-center rounded-full m-4'
                style={{ backgroundColor: colors[j] }}></span>,
            );
          } else if (j == 0) {
            elements.push(
              <span
                key={`${commit.hash}-root`}
                id={`${commit.hash}-root`}
                className='w-2 h-2 flex justify-center align-center rounded-full m-4'
                style={{ backgroundColor: colors[j] }}></span>,
            );
          } else {
            elements.push(
              <span
                key={`${commit.hash}-column-${j}`}
                id={`${commit.hash}-column-${j}`}
                className='w-2 h-2 flex justify-center align-center rounded-full m-4'
                style={{ backgroundColor: colors[j] }}></span>,
            );
          }
        }
      }

      return (
        <li key={i} className='w-full flex mx-px' onContextMenu={handleContextMenu}>
          <div className='w-100 flex justify-center items-center'>{elements}</div>
          {/* <div className='w-100 flex justify-center items-center'>{getDots(index++, commit, previousCommit)}</div> */}

          <GitCommitComponent commit={commit}></GitCommitComponent>

          <div className='flex items-center'>
            <span className='flex-none text-sm mx-1'>parents:[{commit.abbreviatedParent.split(' ').join(',')}]</span>
          </div>
        </li>
      );
    });

    setEl2(el2);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>

      <div className='grid grid-cols-1 w-full'>
        {/* <section className='border border-white'>
          <h1 className='text-lg text-gray-500'>{history1?.cwd}</h1>
          <hr />
          <ul>
            {history1?.commits?.map((commit, i) => {
              return (
                <li key={i} className='w-full flex m-px' onContextMenu={handleContextMenu}>
                  <GitCommitComponent
                    commit={commit}
                    previousCommit={i > 0 ? history1?.commits[i] : null}
                    graphIndent={branchStack1.length + 1}></GitCommitComponent>
                </li>
              );
            })}
          </ul>
        </section> */}
        <section className='border border-white'>
          <h1 className='text-lg text-gray-500'>{history2?.cwd}</h1>
          <hr />
          <ul>{el2}</ul>
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
