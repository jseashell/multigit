import electron, { IpcRenderer } from 'electron';
import React from 'react';
import GitRefComponent from './git-ref';
import InitialsAvatar from './initials-avatar';

function GitCommitComponent(props: GitCommitProps) {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const handleContextMenu = () => {};

  return (
    <React.Fragment>
      <div className='flex w-full select-none cursor-pointer overflow-hidden' onContextMenu={handleContextMenu}>
        {sortRefs(props.commit?.refs).map((ref: string) => {
          return <GitRefComponent gitRef={ref} currentBranch={props.currentBranch}></GitRefComponent>;
        })}
        <p className='flex grow truncate'>{formatSubject(props.commit?.sanitizedSubject)}</p>
        <InitialsAvatar name={props.commit?.author?.name}></InitialsAvatar>
        <span className='flex-none text-ellipsis pl-2 pr-2'>{props.commit?.author?.name}</span>
        <p className='flex-none pl-2 pr-2'>{props.commit?.abbreviatedCommit}</p>
        <p className='flex-none pl-2 pr-2'>{formatAuthorDate(props.commit?.author?.date)}</p>
      </div>
    </React.Fragment>
  );
}

export default GitCommitComponent;

export interface GitCommitProps {
  commit: GitCommit;
  currentBranch: string;
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
  let ret = [];

  if (refs && refs != '') {
    const raw = refs?.split(',');
    for (const ref of raw) {
      if (ref.includes('tag')) {
        ret.push(ref);
      } else if (ref.includes('origin')) {
        ret.unshift(ref);
      } else if (ref != '') {
        const index = ret.indexOf(`origin/${ref}`);
        if (index >= 0) {
          ret = ret.splice(index, 0, ref);
        }
      }
    }
  }

  return ret;
}

function formatSubject(sanitizedSubjectLine: string): string {
  return sanitizedSubjectLine.replace(/-/g, ' ');
}

function formatAuthorDate(authorDate: string): string {
  const date = new Date(authorDate);
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;
}
