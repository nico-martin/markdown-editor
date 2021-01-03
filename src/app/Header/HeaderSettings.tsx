import React from 'react';

import cn from '@utils/classnames';

import { Icon, OutsideClickHandler } from '@theme';
import Settings from '@app/Header/Settings/Settings';
import PickFont from '@app/Header/Settings/PickFont';

import './HeaderSettings.css';
import { fontAccessAPI } from '@utils/helpers';
import { settingsDB } from '@store/idb';

interface SettingsProps {
  value: any;
  setValue: Function;
  settingsKey: string;
}

const HeaderSettings = ({ className = '' }: { className?: string }) => {
  const [init, setInit] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    init && settingsDB.set('settings', values);
  }, [values]);

  const setFromDB = async () => {
    const initialValues = await settingsDB.get('settings');
    setValues(initialValues || {});
    return;
  };

  React.useEffect(() => {
    setFromDB()
      .then(() => setInit(true))
      .catch(() => setInit(true));
  }, []);

  React.useEffect(() => {
    values['font-editor-wysiwyg'] &&
      document.body.style.setProperty(
        '--font-editor-wysiwyg',
        values['font-editor-wysiwyg']
      );
  }, [values['font-editor-wysiwyg']]);

  React.useEffect(() => {
    values['font-editor-md'] &&
      document.body.style.setProperty(
        '--font-editor-md',
        values['font-editor-md']
      );
  }, [values['font-editor-md']]);

  const elements = {
    ...(fontAccessAPI
      ? {
          'font-editor-md': ({
            value,
            setValue,
            settingsKey,
          }: SettingsProps) => (
            <PickFont
              title="Markdown Font"
              settingsKey={settingsKey}
              value={value}
              setValue={setValue}
              inputClassName="header-settings__input header-settings__input--select"
            />
          ),
          'font-editor-wysiwyg': ({
            value,
            setValue,
            settingsKey,
          }: SettingsProps) => (
            <PickFont
              title="WYSIWYG Font"
              settingsKey={settingsKey}
              value={value}
              setValue={setValue}
              inputClassName="header-settings__input header-settings__input--select"
            />
          ),
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
          <Settings
            className="header-settings__settings"
            elements={elements}
            values={values}
            setValues={setValues}
          />
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default HeaderSettings;
