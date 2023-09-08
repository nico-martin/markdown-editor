import React from 'react';

import cn from '@utils/classnames.tsx';

import styles from './CloseButton.module.css';

const CloseButton: React.FC<{
  className?: string;
  onClick: Function;
}> = ({ className = '', onClick }) => (
  <button className={cn(styles.button, className)} onClick={() => onClick()}>
    close
  </button>
);

export default CloseButton;
