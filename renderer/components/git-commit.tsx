import electron, { IpcRenderer } from 'electron';
import React from 'react';
import Xarrow from 'react-xarrows';
import GitRefComponent from './git-ref';
import InitialsAvatar from './initials-avatar';

function GitCommitComponent(props: GitCommitProps) {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const handleContextMenu = () => {};

  const id = 'graph-' + props.commit?.abbreviatedCommit;
  let parents: string[] = [];
  if (props.commit?.abbreviatedParent?.includes(' ')) {
    parents = props.commit?.abbreviatedParent.split(' ').map((parent) => 'graph-' + parent);
  } else if (props.commit?.abbreviatedParent) {
    parents = ['graph-' + props.commit?.abbreviatedParent];
  }

  return (
    <React.Fragment>
      <div
        className='flex w-full items-center select-none cursor-pointer overflow-hidden'
        onContextMenu={handleContextMenu}>
        {props.commit?.abbreviatedParent?.includes(' ') && getIndents(props.graphIndent)}
        <span
          id={id}
          className='w-2 h-2 flex flex-none justify-center items-center rounded-full bg-purple-700 mx-1'></span>
        {sortRefs(props.commit?.refs).map((ref: string) => {
          return <GitRefComponent gitRef={ref}></GitRefComponent>;
        })}
        <span className='flex grow text-sm truncate'>{formatSubject(props.commit?.sanitizedSubject)}</span>
        <InitialsAvatar name={props.commit?.author?.name}></InitialsAvatar>
        <span className='flex-none truncate text-sm pl-2 pr-2'>{props.commit?.author?.name}</span>
        <span className='flex-none text-sm pl-2 pr-2'>{props.commit?.abbreviatedCommit}</span>
        <span className='flex-none text-sm pl-2 pr-2'>{formatAuthorDate(props.commit?.author?.date)}</span>
        {parents?.length == 1 ? (
          <Xarrow start={id} end={parents[0]} strokeWidth={2} showHead={false} showTail={false} color={'#7e22ce'} />
        ) : (
          parents?.map((parent) => (
            <Xarrow start={id} end={parent} strokeWidth={2} showHead={false} showTail={false} color={'red'} />
          ))
        )}
      </div>
    </React.Fragment>
  );
}

export default GitCommitComponent;

export interface GitCommitProps {
  commit: GitCommit;
  previousCommit: GitCommit;
  graphIndent: number;
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

function getIndents(graphIndent: number): any {
  const indents = [];
  for (let i = 0; i < graphIndent; i++) {
    indents.push(<span className='w-2 h-2 flex flex-none mx-1'></span>);
  }
  return indents;
}

function sortRefs(refs?: string): string[] {
  let secondSort = [];

  if (refs && refs != '') {
    // first, sort remote branches to the front of the array
    const firstSort = [];
    refs
      .split(',')
      .map((ref) => ref.trim())
      .sort((a, b) => a.replace(/origin\//g, '').localeCompare(b.replace(/origin\//g, '')))
      .forEach((ref) => {
        if (ref.includes('origin')) {
          firstSort.unshift(ref);
        } else {
          firstSort.push(ref);
        }
      });

    // next, co-mingle local branches to their remote counterpart
    for (const ref of firstSort) {
      if (ref === 'origin/HEAD') {
        // Remote HEAD
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

    const thirdSort = secondSort;
    for (let ref of thirdSort) {
      if (ref.includes('tag:')) {
        thirdSort.splice(thirdSort.indexOf(ref), 1);
        thirdSort.push(ref);
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
