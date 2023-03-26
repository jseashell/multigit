import electron, { IpcRenderer } from 'electron';
import React from 'react';

function GitRef(props) {
  const ipcRenderer: IpcRenderer = electron.ipcRenderer;

  const [currentBranch, setCurrentBranch] = React.useState({
    data: '',
  });

  React.useEffect(() => {
    const currentBranch = ipcRenderer.sendSync('git:current-branch');
    setCurrentBranch(currentBranch);
  });

  function getElement(ref: string) {
    if (ref.includes('origin/HEAD')) {
      return null; // do not show
    } else if (ref.includes('HEAD -> ')) {
      // Local branch
      const branch = ref.match(/HEAD -> (.*)/)[1];
      return (
        <span className='whitespace-nowrap w-fit border-green-500 bg-green-900 rounded-lg pl-2 pr-2'>
          {branch} {currentBranch.data === branch && <span>{'\u2713'}</span>}
        </span>
      );
    } else if (ref.includes('origin')) {
      // Remote branch
      return <span className='w-fit border-red-500 bg-red-900 rounded-lg pl-2 pr-2 ml-1'>{ref}</span>;
      //   if (hasLocal) {
      //     return (
      //       <img
      //         className='border-red-500 bg-red-900 rounded-lg pl-2 pr-2 ml-1'
      //         width='32px'
      //         height='32px'
      //         alt='Remote branch on same ref as local branch'
      //         src='/images/git-branch.svg'
      //       />
      //     );
      //   } else {
      //     return <span className='w-fit border-red-500 bg-red-900 rounded-lg pl-2 pr-2 ml-1'>{ref}</span>;
      //   }
    } else if (ref.includes('tag')) {
      // Tag
      return (
        <span className='flex whitespace-nowrap w-fit border-blue-500 bg-blue-900 rounded-lg pl-2 pr-2 ml-1'>
          {ref.match(/tag: (.*)/)[1]}
        </span>
      );
    }
  }

  return <React.Fragment>{getElement(props.gitRef)}</React.Fragment>;
}

export default GitRef;
