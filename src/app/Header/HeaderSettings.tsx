import React from 'react';

import cn from '@utils/classnames';

import { Icon, OutsideClickHandler } from '@theme';
import Settings from '@app/Header/Settings/Settings';
import PickFont from '@app/Header/Settings/PickFont';

import './HeaderSettings.css';
import { fontAccessAPI } from '@utils/helpers';

const HeaderSettings = ({ className = '' }: { className?: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const elements = {
    ...(fontAccessAPI
      ? {
          fontWysiwyg: () => <PickFont title="WYSIWYG Font" key="wysiwyg" />,
          fontMd: () => <PickFont title="Markdown Font" key="md" />,
        }
      : {}),
  };

  return Object.keys(elements).length === 0 ? null : (
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
          <Settings className="header-settings__settings" elements={elements} />
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default HeaderSettings;
