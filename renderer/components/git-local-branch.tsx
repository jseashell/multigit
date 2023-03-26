import React from 'react';

function GitLocalBranch(props: any) {
  return (
    <React.Fragment>
      <div className='w-fit border-green-600 bg-green-900 rounded-lg pl-2 pr-2'>{props.children}</div>
    </React.Fragment>
  );
}

export default GitLocalBranch;
