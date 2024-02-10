import React from 'react';

import cn from '@utils/classnames.tsx';

import styles from './ButtonGroup.module.css';

const ButtonGroup: React.FC<{
  className?: string;
  children?: any;
  align?: 'left' | 'center' | 'right';
}> = ({ className = '', children, align = 'left' }) => (
  <div
    className={cn(
      className,
      styles.group,
      align === 'right'
        ? styles.alignRight
        : align === 'center'
        ? styles.alignCenter
        : styles.alignLeft
    )}
  >
    {children}
  </div>
);

export default ButtonGroup;
