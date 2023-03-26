import React from 'react';

function Button(props: any) {
  return (
    <React.Fragment>
      <button className='border border-white rounded p-2 m-2' onClick={props.onClick}>
        {props.children}
      </button>
    </React.Fragment>
  );
}

export default Button;
