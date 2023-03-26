import React from 'react';

function GitRemoteBranch(props: any) {
  return (
    <React.Fragment>
      <div className='w-fit border-red-500 bg-red-900 rounded-lg pl-2 pr-2'>{props.children}</div>
    </React.Fragment>
  );
}

export default GitRemoteBranch;
