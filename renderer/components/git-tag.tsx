import React from 'react';

function GitTag(props: any) {
  return (
    <React.Fragment>
      <div className='w-fit border-blue-600 bg-blue-900 rounded-lg pl-2 pr-2'>{props.children}</div>
    </React.Fragment>
  );
}

export default GitTag;
