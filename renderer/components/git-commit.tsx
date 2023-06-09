import { GitCommit } from 'renderer/types';
import GitRefComponent from './git-ref';
import InitialsAvatar from './initials-avatar';

function GitCommitComponent(props: GitCommitProps) {
  const handleContextMenu = () => {};

  return (
    // <div className='flex w-full items-center cursor-pointer overflow-hidden m-3' onContextMenu={handleContextMenu}>
    <div className='flex items-center cursor-pointer overflow-hidden m-3' onContextMenu={handleContextMenu}>
      <ul className='flex flex-none'>
        {sortRefs(props.commit?.refs).map((ref: string, i: number) => {
          return (
            <li key={i}>
              <GitRefComponent gitRef={ref}></GitRefComponent>
            </li>
          );
        })}
      </ul>
      {/* <span className='flex grow text-sm truncate'>{formatSubject(props.commit?.sanitizedSubject)}</span> */}
      <InitialsAvatar name={props.commit?.author?.name}></InitialsAvatar>
      {/* <span className='flex-none truncate text-sm pl-2 pr-2'>{props.commit?.author?.name}</span> */}
      <span className='flex-none text-sm mx-1'>{props.commit?.abbreviatedHash}</span>
      {/* <span className='flex-none text-sm pl-2 pr-2'>{formatAuthorDate(props.commit?.author?.date)}</span> */}
    </div>
  );
}

export default GitCommitComponent;

export interface GitCommitProps {
  commit: GitCommit;
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
