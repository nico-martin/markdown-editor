import React from 'react';

import cn from '@utils/classnames';
import { Button, ShadowBox } from '@theme';

import './FooterNav.css';

type Menu = 'credits';

const NAVIGATION: Record<Menu, string> = {
  credits: 'CREDITS',
};

const FooterNav = ({ className = '' }: { className?: string }) => {
  const [activeBox, setActiveBox] = React.useState<Menu>(null);

  return (
    <React.Fragment>
      <nav className={cn(className, 'footer-nav')}>
        {Object.entries(NAVIGATION).map(([key, title]) => (
          <Button
            className={cn('footer-nav__element', `footer-nav__element--${key}`)}
            layout="empty"
            // @ts-ignore
            onClick={() => setActiveBox(key)}
          >
            {title}
          </Button>
        ))}
        {activeBox == 'credits' ? (
          <ShadowBox
            close={() => setActiveBox(null)}
            title="Credits"
            size="small"
          >
            Credits
          </ShadowBox>
        ) : null}
      </nav>
    </React.Fragment>
  );
};

export default FooterNav;
