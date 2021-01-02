import React from 'react';

const OutsideClickHandler = ({
  tag = 'div',
  outsideClick,
  children,
  ...props
}: {
  tag?: string;
  outsideClick: Function;
  children: any;
  [key: string]: any;
}) => {
  const node = React.useRef(null);

  const handleClick = e => {
    // @ts-ignore
    if (node.current && node.current.contains(e.target)) {
      return;
    }

    outsideClick();
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return React.createElement(tag, { ...props, ref: node }, children);
};

export default OutsideClickHandler;
