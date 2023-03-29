import electron, { IpcRenderer } from 'electron';
import React from 'react';
import GitRefComponent from './git-ref';
import InitialsAvatar from './initials-avatar';

function GitCommitComponent(props: GitCommitProps) {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const handleContextMenu = () => {};

  return (
    <React.Fragment>
      <div
        className='flex w-full items-center select-none cursor-pointer overflow-hidden'
        onContextMenu={handleContextMenu}>
        <span className='w-2 h-2 flex flex-none justify-center items-center rounded-full bg-purple-700 mx-1'></span>
        {sortRefs(props.commit?.refs).map((ref: string) => {
          return <GitRefComponent gitRef={ref}></GitRefComponent>;
        })}
        <span className='flex grow text-sm truncate'>{formatSubject(props.commit?.sanitizedSubject)}</span>
        <InitialsAvatar name={props.commit?.author?.name}></InitialsAvatar>
        <span className='flex-none truncate text-sm pl-2 pr-2'>{props.commit?.author?.name}</span>
        <span className='flex-none text-sm pl-2 pr-2'>{props.commit?.abbreviatedCommit}</span>
        <span className='flex-none text-sm pl-2 pr-2'>{formatAuthorDate(props.commit?.author?.date)}</span>
      </div>
    </React.Fragment>
  );
}

export default GitCommitComponent;

export interface GitCommitProps {
  commit: GitCommit;
}

export interface GitCommit {
  commit?: string;
  abbreviatedCommit?: string;
  tree?: string;
  abbreviatedTree?: string;
  parent?: string;
  abbreviatedParent?: string;
  refs?: string;
  sanitizedSubject?: string;
  author?: {
    name?: string;
    email: string;
    date?: string;
  };
  commiter?: {
    name?: string;
    email?: string;
    date?: string;
  };
}

function sortRefs(refs?: string): string[] {
  let secondSort = [];

  if (refs && refs != '') {
    // first, sort remote branches to the front of the array
    const firstSort = [];
    refs
      .split(',')
      .map((ref) => ref.trim())
      .forEach((ref) => {
        if (ref.includes('origin')) {
          firstSort.unshift(ref);
        } else {
          firstSort.push(ref);
        }
      });

    if (firstSort.length > 1) {
      // next, co-mingle local branches to their remote counterpart
      for (const ref of firstSort) {
        console.log('handling', ref);
        if (ref === 'origin/HEAD') {
          // Remote HEAD
          console.log('igonred', ref);
          continue;
        } else if (ref.includes('origin')) {
          // Remote branch
          // always place origins at the beginning
          secondSort.unshift(ref);
        } else if (ref.includes('HEAD ->')) {
          // Local HEAD
          const branch = ref.match(/HEAD -> (.*)/)[1];
          const index = secondSort.indexOf(`origin/${branch}`);
          // always use the ref during this sorting
          if (index >= 0) {
            const firstHalf = secondSort.slice(0, index);
            const secondHalf = secondSort.slice(index + 1, secondSort.length);
            secondSort = [...firstHalf, ref, ...secondHalf];
          } else {
            secondSort.push(ref);
          }
        } else if (ref != '') {
          // Local branch
          const remoteIndex = secondSort.indexOf(`origin/${ref}`);
          if (remoteIndex >= 0) {
            const firstHalf = secondSort.slice(0, remoteIndex); // up to, but excluding, the remote counterpart to this local branch
            const collapsedRemote = '$';
            const secondHalf = secondSort.slice(remoteIndex + 1, secondSort.length);
            secondSort = [...firstHalf, collapsedRemote, ref, ...secondHalf];
          } else {
            secondSort.unshift(ref);
          }
        } else if (ref.includes('tag')) {
          // Tag
          // always place tags at the end
          secondSort.push(ref);
        }
      }
    }
  }

  return secondSort;
}

function formatSubject(sanitizedSubjectLine: string): string {
  return sanitizedSubjectLine.replace(/-/g, ' ');
}

function formatAuthorDate(authorDate: string): string {
  const date = new Date(authorDate);
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;
}
