import React from 'react';

import cn from '@utils/classnames';
import { featureCheck } from '@utils/helpers';

import ButtonSave from '../Controls/ButtonSave';
import ButtonOpen from '../Controls/ButtonOpen';

import './HeaderNav.css';

const HeaderNav = ({ className = '' }: { className?: string }) => {
  return featureCheck ? (
    <nav className={cn(className, 'header-nav')}>
      <ButtonOpen className="header-nav__element" />
      <ButtonSave className="header-nav__element" />
    </nav>
  ) : null;
};

export default HeaderNav;
