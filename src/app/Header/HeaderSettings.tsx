import { Button, Icon, OutsideClickHandler } from '@theme';
import React from 'react';

import ColorScheme from '@app/Header/Settings/ColorScheme';
import PickFont from '@app/Header/Settings/PickFont';

import cn from '@utils/classnames';

import { useFontAccessContext } from '@store/FontAccessContext.tsx';
import { useAppSettings } from '@store/SettingsContext.tsx';

import styles from './HeaderSettings.module.css';

const HeaderSettings: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [appSettings, setAppSettings] = useAppSettings();
  const { queried, queryFonts, isQuerying, checkPermission } =
    useFontAccessContext();
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

  React.useEffect(() => {
    checkPermission().then(
      (state) => state === 'granted' && !queried && queryFonts()
    );
  }, []);

  return (
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
          <ul className={cn(className, styles.settings)}>
            {'queryLocalFonts' in window ? (
              queried ? (
                <React.Fragment>
                  <li className={styles.settingsElement} key="font-editor-md">
                    <PickFont
                      title="Markdown Font"
                      settingsKey="font-editor-md"
                      value={appSettings['font-editor-md'] || null}
                      setValue={(value) =>
                        setAppSettings({ 'font-editor-md': value })
                      }
                      titleClassName={styles.title}
                    />
                  </li>
                  <li
                    className={styles.settingsElement}
                    key="font-editor-wysiwyg"
                  >
                    <PickFont
                      title="WYSIWYG Font"
                      settingsKey="font-editor-wysiwyg"
                      value={appSettings['font-editor-wysiwyg'] || null}
                      setValue={(value) =>
                        setAppSettings({ 'font-editor-wysiwyg': value })
                      }
                      titleClassName={styles.title}
                    />
                  </li>
                </React.Fragment>
              ) : (
                <li className={styles.settingsElement} key="queryFonts">
                  <p className={styles.title}>Fonts</p>
                  <Button
                    round
                    layout="outline"
                    color="black"
                    icon="formatFont"
                    onClick={() => queryFonts()}
                    loading={isQuerying}
                  >
                    query Fonts
                  </Button>
                </li>
              )
            ) : null}

            <li className={styles.settingsElement} key="colorScheme">
              <ColorScheme
                settingsKey="colorScheme"
                value={appSettings['colorScheme'] || null}
                setValue={(value) => setAppSettings({ colorScheme: value })}
                titleClassName={styles.title}
              />
            </li>
          </ul>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default HeaderSettings;
