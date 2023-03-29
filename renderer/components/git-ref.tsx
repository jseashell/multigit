import React from 'react';

function GitRef(props: GitRefProps) {
  function getElement(ref: string) {
    if (ref.includes('origin/HEAD')) {
      return null; // do not show
    } else if (ref === '$') {
      // Collapsed remote branch (has a local counterpart)
      return (
        <span className='flex h-full border border-green-300 bg-green-900 rounded px-2 mr-1'>
          <img width='16px' height='16px' src='/images/git-branch.svg' />
        </span>
      );
    } else if (ref.includes('origin')) {
      // Remote branch
      return (
        <span className='whitespace-nowrap w-fit border border-green-300 bg-green-900 rounded text-sm px-2 mr-1'>
          {ref}
        </span>
      );
    } else if (ref.includes('HEAD ->')) {
      // Local HEAD
      const branch = '\u2713 ' + ref.match(/HEAD -> (.*)/)[1];
      console.log('HEAD', branch);
      return (
        <span className='whitespace-nowrap w-fit border border-red-300 bg-red-900 rounded text-sm px-2 mr-1'>
          {branch}
        </span>
      );
    } else if (ref.includes('tag')) {
      // Tag
      return (
        <span className='whitespace-nowrap w-fit border border-blue-300 bg-blue-900 rounded text-sm px-2 mr-1'>
          {ref.match(/tag: (.*)/)[1]}
        </span>
      );
    } else if (ref != '') {
      // Local branch
      return (
        <span className='whitespace-nowrap w-fit border border-red-300 bg-red-900 rounded text-sm px-2 mr-1'>
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
  gitRef: string;
}
