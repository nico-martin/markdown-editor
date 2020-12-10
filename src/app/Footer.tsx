import React from 'react';
import { useStoreState } from 'unistore-hooks';

import { State } from '@store/types';
import cn from '@utils/classnames';
import FooterNav from '@app/FooterNav';

import './Footer.css';

const Footer = ({ className = '' }: { className?: string }) => {
  const { activeFile } = useStoreState<State>(['activeFile']);

  return (
    <div className={cn(className, 'footer')}>
      <p className="footer__path code">
        File: {activeFile.path || 'not yet saved'}
      </p>
      <FooterNav className="footer__nav" />
    </div>
  );
};

export default Footer;
