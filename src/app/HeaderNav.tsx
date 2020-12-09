import React from 'react';

import cn from '@utils/classnames';
import { Button } from '@theme';

import './HeaderNav.css';

const HeaderNav = ({ className = '' }: { className?: string }) => {
  React.useEffect(() => {
    console.log('key listener');
  });

  return (
    <nav className={cn(className, 'header-nav')}>
      <Button className="header-nav__element" icon="mdi/open" layout="empty">
        Open File
      </Button>
      <Button className="header-nav__element" icon="mdi/save" layout="empty">
        Save
      </Button>
    </nav>
  );
};

export default HeaderNav;
