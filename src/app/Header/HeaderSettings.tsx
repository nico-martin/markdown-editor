import {
  Button,
  Icon,
  Notification,
  OutsideClickHandler,
  PortalBox,
  SHADOW_BOX_SIZES,
} from '@theme';
import React from 'react';

import cn from '@utils/classnames';
import { BROWSER_SUPPORT } from '@utils/constants.ts';

import { useFontAccessContext } from '@store/FontAccessContext.tsx';
import { useAppSettings } from '@store/SettingsContext.tsx';

import { NOTIFICATION_TYPE } from '../../theme/Misc/Notification.tsx';
import styles from './HeaderSettings.module.css';
import ColorScheme from './Settings/ColorScheme';
import PickFont from './Settings/PickFont';

const HeaderSettings: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [fontSupportedModal, setFontSupportedModal] =
    React.useState<boolean>(false);
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
      {fontSupportedModal && (
        <PortalBox
          title="Browser support"
          setShow={setFontSupportedModal}
          show={fontSupportedModal}
          size={SHADOW_BOX_SIZES.SMALL}
        >
          <Notification type={NOTIFICATION_TYPE.ERROR}>
            <p>
              The{' '}
              <a
                href="https://developer.chrome.com/articles/local-fonts/"
                target="_blank"
              >
                Local Font Access API
              </a>{' '}
              is not supported in your browser
            </p>
          </Notification>
        </PortalBox>
      )}
      {open && (
        <OutsideClickHandler
          className={styles.panel}
          outsideClick={() => {
            setOpen(false);
          }}
        >
          <ul className={cn(className, styles.settings)}>
            {queried ? (
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
                  onClick={() =>
                    BROWSER_SUPPORT.queryFonts
                      ? queryFonts()
                      : setFontSupportedModal(true)
                  }
                  loading={isQuerying}
                >
                  query Fonts
                </Button>
              </li>
            )}

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
