import React from 'react';

import cn from '@utils/classnames';
import { appTitle } from '@utils/constants';
import { featureCheck } from '@utils/helpers';

import HeaderView from '@app/Header/HeaderView';
import ButtonSave from '@app/Header/Controls/ButtonSave';
import HeaderSettings from '@app/Header/HeaderSettings';

import './Header.css';

const Header = ({ className = '' }: { className?: string }) => (
  <header className={cn(className, 'header')}>
    <h1 className="header__title">{appTitle}</h1>
    {featureCheck && (
      <React.Fragment>
        <ButtonSave className="header__save" />
        <HeaderView className="header__view" />
        <HeaderSettings className="header__settings" />
      </React.Fragment>
    )}
  </header>
);

export default Header;
