import electron, { IpcRenderer } from 'electron';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Xarrow from 'react-xarrows';
import GitCommitComponent, { GitCommit } from '../components/git-commit';

const colors = [
  '#dc2626', //red-600
  '#22c55e', //green-500
  '#f97316', // orange-500
  '#2563eb', // blue-600
  '#fde047', // yellow-300
  '#a855f7', // purple-500
];

function Home() {
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
  const [parents2, setParents2] = React.useState<string[]>([]);
  const [el2, setEl2] = React.useState<JSX.Element[]>([]);

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  React.useEffect(() => {
    const history_1 = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/multigit' });
    setHistory1(history_1);

    const history2: GitHistory = ipcRenderer.sendSync('git:log', { cwd: '/Users/jschelli/git/know-client' });

    let stack = [...parents2];
    const newEl2 = history2?.commits?.map((commit, i) => {
      let popMessage = '';

      const index = stack.indexOf(commit.abbreviatedCommit);
      if (index > -1) {
        const stemp = stack;
        stack = stack.filter((c) => c !== commit.abbreviatedCommit);
        popMessage = `stack:[${stemp}] pops [${index}]"${commit.abbreviatedCommit}"`;
      }

      commit.abbreviatedParent?.split(' ').forEach((parent) => stack.push(parent));

      let includeArrows = true;
      commit.abbreviatedParent?.split(' ').forEach((parent) => {
        if (!history2.commits.map((commit) => commit.abbreviatedCommit).includes(parent)) {
          includeArrows = false;
        }
      });

      const commitHash = commit.abbreviatedCommit;
      const parentHashes = commit.abbreviatedParent.split(' ');

      return (
        <li key={i} className='w-full flex mx-px' onContextMenu={handleContextMenu}>
          <GitCommitComponent
            commit={commit}
            graphIndent={index}
            totalIndents={stack.length}
            color={colors[i]}></GitCommitComponent>
          <div className='flex items-center'>
            <span className='flex-none text-sm mx-1'>parents:[{parentHashes.join(',')}]</span>
            <span className='flex-none text-sm mx-1'>{popMessage}</span>
            <span className='flex-none text-sm mx-1'>new stack:[{stack.join(',')}]</span>
          </div>
          {includeArrows &&
            stack.map((parent: string, i: number) => {
              return (
                <li key={i} className='text-xs'>
                  <Xarrow
                    key={i}
                    start={commitHash}
                    end={parent}
                    // labels={{ start: commitHash, end: parent }}
                    strokeWidth={2}
                    showHead={true}
                    showTail={false}
                    color={colors[i]}
                  />
                </li>
              );
            })}
        </li>
      );
    });

    setEl2(newEl2);
  }, []);

  const handleContextMenu = () => {
    // TODO
  };

  return (
    <React.Fragment>
      <Head>
        <title>MultiGit</title>
      </Head>

      <div className='grid grid-cols-1 w-full pl-20'>
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

export default Home;

interface GitHistory {
  cwd: string;
  commits: GitCommit[];
}
