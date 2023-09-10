import React from 'react';

const OutsideClickHandler: React.FC<{
  tag?: string;
  outsideClick: () => void;
  children: React.ReactElement | Array<React.ReactElement>;
  className?: string;
}> = ({ tag = 'div', outsideClick, children, className = '' }) => {
  const node = React.useRef(null);

  const handleClick = (e: Event) => {
    if (node.current && node.current.contains(e.target)) {
      return;
    }

    outsideClick();
  };

  React.useEffect(() => {
    window.setTimeout(
      () => document.addEventListener('mousedown', handleClick),
      10
    );
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return React.createElement(tag, { className, ref: node }, children);
};

export default OutsideClickHandler;
