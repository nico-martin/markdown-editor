import React from 'react';

import cn from '@utils/classnames';
import { appTitle } from '@utils/constants';
import { featureCheck } from '@utils/helpers';

import ButtonSave from './Controls/ButtonSave';
import styles from './Header.module.css';
import HeaderSettings from './HeaderSettings';
import HeaderView from './HeaderView';

const Header: React.FC<{ className?: string }> = ({ className = '' }) => (
  <header className={cn(className, styles.root)}>
    <h1 className={styles.title}>{appTitle}</h1>
    {featureCheck && (
      <React.Fragment>
        <ButtonSave className={styles.save} />
        <HeaderView className={styles.view} />
        <HeaderSettings className={styles.settings} />
      </React.Fragment>
    )}
  </header>
);

export default Header;
