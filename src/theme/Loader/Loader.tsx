import React from 'react';

import cn from '@utils/classnames.tsx';

import styles from './Loader.module.css';

const Loader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={cn(className, styles.root)} />
);

export default Loader;
