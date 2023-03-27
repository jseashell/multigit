import GitRef from './git-ref';

function GitHistory(props) {
  return (
    <div className='grid grid-cols-1 w-full'>
      <h1 className='text-lg text-gray-500'>{props.cwd}</h1>
      <hr />
      <ul>
        {props.history?.data?.all?.map((item) => (
          <li className='flex w-full p-2'>
            <span className=''>
              {item.refs.split(',').map((ref: string) => {
                return <GitRef gitRef={ref}></GitRef>;
              })}
            </span>
            <span className='flex grow text-ellipsis'>{item.message}</span>
            <span className='flex-none text-ellipsis pl-2 pr-2'>{item.author_name}</span>
            <span className='flex-none pl-2 pr-2'>{item.hash.substring(0, 8)}</span>
            <span className='flex-none pl-2 pr-2'>
              {new Date(item.date).toLocaleDateString('en-US')} @ {new Date(item.date).toLocaleTimeString('en-US')}
            </span>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}

export default GitHistory;