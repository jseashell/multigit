import React from 'react';
import GitRefComponent from './git-ref.component';

export interface GitCommitProps {
  commit: GitCommit;
  currentBranch: string;
}

export interface GitCommit {
  commit?: string;
  abbreviated_commit?: string;
  tree?: string;
  abbreviated_tree?: string;
  parent?: string;
  abbreviated_parent?: string;
  refs?: string;
  sanitized_subject_line?: string;
  subject?: string;
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

function GitCommitComponent(props: GitCommitProps) {
  const date = new Date(props.commit?.author?.date);
  const formattedDate = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;
  return (
    <React.Fragment>
      {props.commit?.refs?.split(',').map((ref: string) => {
        return <GitRefComponent gitRef={ref} currentBranch={props.currentBranch}></GitRefComponent>;
      })}
      <span className='flex grow text-ellipsis'>{props.commit?.subject}</span>
      <span className='flex-none text-ellipsis pl-2 pr-2'>{props.commit?.author?.name}</span>
      <span className='flex-none pl-2 pr-2'>{props.commit?.abbreviated_commit}</span>
      <span className='flex-none pl-2 pr-2'>{formattedDate}</span>
    </React.Fragment>
  );
}

export default GitCommitComponent;
