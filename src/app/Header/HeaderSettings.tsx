import React from 'react';

import cn from '@utils/classnames';

import { Icon, OutsideClickHandler } from '@theme';

import './HeaderSettings.css';

const HeaderSettings = ({ className = '' }: { className?: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <div className={cn(className, 'header-settings')}>
      <button
        className="header-settings__button"
        onMouseDown={open ? null : () => setOpen(true)}
      >
        <Icon
          className={cn('header-settings__button-icon')}
          icon="mdi/settings"
        />
      </button>
      {open && (
        <OutsideClickHandler
          className="header-settings__panel"
          outsideClick={() => setOpen(false)}
        >
          SETTINGS
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default HeaderSettings;
