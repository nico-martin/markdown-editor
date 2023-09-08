import React from 'react';

import FileMenu from '@app/Footer/FileMenu';
import FooterNav from '@app/Footer/FooterNav';

import cn from '@utils/classnames';
import { featureCheck } from '@utils/helpers';

import styles from './Footer.module.css';

const Footer: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <footer className={cn(className, styles.root)}>
    {featureCheck && <FileMenu className={styles.fileMenu} />}
    <FooterNav className={styles.nav} />
  </footer>
);

export default Footer;
