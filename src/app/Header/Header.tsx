import React from 'react';

import cn from '@utils/classnames';
import { appTitle } from '@utils/constants';
import { featureCheck } from '@utils/helpers';

import HeaderView from '@app/Header/HeaderView';
import ButtonSave from '@app/Header/Controls/ButtonSave';

import './Header.css';

const Header = ({ className = '' }: { className?: string }) => (
  <header className={cn(className, 'header')}>
    <h1 className="header__title">{appTitle}</h1>
    {featureCheck && <ButtonSave className="header__save" />}
    {featureCheck && <HeaderView className="header__view" />}
  </header>
);

export default Header;