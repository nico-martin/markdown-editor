import { Icon, OutsideClickHandler } from '@theme';
import React from 'react';

import ColorScheme from '@app/Header/Settings/ColorScheme';
import PickFont from '@app/Header/Settings/PickFont';
import Settings from '@app/Header/Settings/Settings';

import cn from '@utils/classnames';
import { fontAccessAPI } from '@utils/helpers';

import { useAppSettings } from '@store/SettingsContext.tsx';

import styles from './HeaderSettings.module.css';

export interface SettingProps {
  value: string;
  setValue: (value: string) => void;
  settingsKey: string;
}

const HeaderSettings: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [appSettings, setAppSettings] = useAppSettings();

  React.useEffect(() => {
    appSettings['font-editor-wysiwyg'] &&
      document.body.style.setProperty(
        '--font-editor-wysiwyg',
        appSettings['font-editor-wysiwyg']
      );
  }, [appSettings['font-editor-wysiwyg']]);

  React.useEffect(() => {
    appSettings['font-editor-md'] &&
      document.body.style.setProperty(
        '--font-editor-md',
        appSettings['font-editor-md']
      );
  }, [appSettings['font-editor-md']]);

  React.useEffect(() => {
    document.body.setAttribute('color-scheme', appSettings.colorScheme);
  }, [appSettings.colorScheme]);

  const elements: Record<string, (props: SettingProps) => React.ReactElement> =
    {
      ...(fontAccessAPI
        ? {
            'font-editor-md': ({ value, setValue, settingsKey }) => (
              <PickFont
                title="Markdown Font"
                settingsKey={settingsKey}
                value={value}
                setValue={setValue}
                titleClassName={styles.title}
              />
            ),
            'font-editor-wysiwyg': ({ value, setValue, settingsKey }) => (
              <PickFont
                title="WYSIWYG Font"
                settingsKey={settingsKey}
                value={value}
                setValue={setValue}
                titleClassName={styles.title}
              />
            ),
          }
        : {}),
      colorScheme: ({ value, setValue, settingsKey }) => (
        <ColorScheme
          settingsKey={settingsKey}
          value={value}
          setValue={setValue}
          titleClassName={styles.title}
        />
      ),
    };

  return Object.keys(elements).length === 0 ? null : (
    <div className={cn(className, styles.root)}>
      <button
        className={styles.button}
        onMouseDown={open ? null : () => setOpen(true)}
        ref={buttonRef}
      >
        <Icon className={cn(styles.buttonIcon)} icon="settings" />
      </button>
      {open && (
        <OutsideClickHandler
          className={styles.panel}
          outsideClick={() => {
            setOpen(false);
          }}
        >
          <Settings
            elements={elements}
            values={appSettings}
            setValues={setAppSettings}
          />
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default HeaderSettings;
