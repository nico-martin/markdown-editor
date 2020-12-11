import React from 'react';

import cn from '@utils/classnames';
import { featureCheck } from '@utils/helpers';
import FooterNav from '@app/FooterNav';
import FileMenu from '@app/FileMenu';

import './Footer.css';

const Footer = ({
  className = '',
  init,
}: {
  className?: string;
  init: boolean;
}) => (
  <div className={cn(className, 'footer')}>
    {init && featureCheck && <FileMenu className="footer__files" />}
    <FooterNav className="footer__nav" />
  </div>
);

export default Footer;
