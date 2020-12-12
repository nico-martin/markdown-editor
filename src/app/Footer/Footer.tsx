import React from 'react';

import cn from '@utils/classnames';
import { featureCheck } from '@utils/helpers';
import FooterNav from '@app/Footer/FooterNav';
import FileMenu from '@app/Footer/FileMenu';

import './Footer.css';

const Footer = ({
  className = '',
  init,
}: {
  className?: string;
  init: boolean;
}) => (
  <footer className={cn(className, 'footer')}>
    {init && featureCheck && <FileMenu className="footer__files" />}
    <FooterNav className="footer__nav" />
  </footer>
);

export default Footer;
