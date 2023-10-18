import React from 'react';

import FileMenu from '@app/Footer/FileMenu';
import FooterNav from '@app/Footer/FooterNav';

import cn from '@utils/classnames';
import { BROWSER_SUPPORT } from '@utils/constants.ts';

import styles from './Footer.module.css';

const Footer: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <footer className={cn(className, styles.root)}>
    {BROWSER_SUPPORT.fileSystem && <FileMenu className={styles.fileMenu} />}
    <FooterNav className={styles.nav} />
  </footer>
);

export default Footer;
