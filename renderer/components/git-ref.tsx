import React from 'react';

function GitRef(props: GitRefProps) {
  function getElement(ref: string) {
    if (ref.includes('origin/HEAD')) {
      return null; // do not show
    } else if (ref.includes('origin')) {
      // Remote branch
      // TODO collapse remote branches to an icon when there is also a local version
      return (
        <span className='whitespace-nowrap w-fit border-red-500 bg-red-900 rounded-full text-sm px-2 mr-px'>{ref}</span>
      );
    } else if (ref.includes('HEAD ->')) {
      // Local HEAD
      const branch = ref.match(/HEAD -> (.*)/)[1];
      return (
        <span className='whitespace-nowrap w-fit border-green-500 bg-green-900 rounded-full text-sm px-2 mr-px'>
          {branch} {props.currentBranch === branch && <span>{'\u2713'}</span>}
        </span>
      );
    } else if (ref.includes('tag')) {
      // Tag
      return (
        <span className='whitespace-nowrap w-fit border-blue-500 bg-blue-900 rounded-full text-sm px-2 mr-px'>
          {ref.match(/tag: (.*)/)[1]}
        </span>
      );
    } else if (ref != '') {
      // Local branch
      return (
        <span className='whitespace-nowrap w-fit border-green-500 bg-green-900 rounded-full text-sm px-2 mr-px'>
          {ref}
        </span>
      );
    } else {
      // no ref
      return null;
    }
  }

  return <React.Fragment>{getElement(props.gitRef)}</React.Fragment>;
}

export default GitRef;

export interface GitRefProps {
  currentBranch: string;
  gitRef: string;
}
