import React from 'react';

import cn from '@utils/classnames';
import { appTitle } from '@utils/constants';
import HeaderNav from '@app/Header/HeaderNav';

import './Header.css';

const Header = ({ className = '' }: { className?: string }) => (
  <header className={cn(className, 'header')}>
    <h1 className="header__title">{appTitle}</h1>
    <HeaderNav className="header__nav" />
  </header>
);

export default Header;
