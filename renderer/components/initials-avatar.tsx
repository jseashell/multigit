import React from 'react';

function InitialsAvatar(props: InitialsAvatarProps) {
  const initials = props.name?.split(' ')[0].charAt(0) + props.name?.split(' ')[1].charAt(0);

  const seededColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
  };

  const color = seededColor(props.name);

  return (
    <React.Fragment>
      <span className='w-fit rounded-full p-1' style={{ backgroundColor: color }}>
        {initials}
      </span>
    </React.Fragment>
  );
}

export default InitialsAvatar;

export interface InitialsAvatarProps {
  name: string;
}
