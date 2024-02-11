import {
  MatomoProvider,
  createInstance,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import Footer from '@app/Footer/Footer';
import Header from '@app/Header/Header';
import Main from '@app/Main/Main';

import cn from '@utils/classnames.tsx';
import {
  BROWSER_SUPPORT,
  IS_DEV,
  MATOMO_SITE_ID,
  MATOMO_URL,
} from '@utils/constants';

import { FileContextProvider } from '@store/FileContext.tsx';
import { FontAccessContextProvider } from '@store/FontAccessContext.tsx';
import { SettingsContextProvider } from '@store/SettingsContext.tsx';
import AiContextProvider from '@store/ai/AiContextProvider.tsx';
import TranslationsContextProvider from '@store/ai/translations/TranslationsContextProvider.tsx';
import WhisperContextProvider from '@store/ai/whisper/WhisperContextProvider.tsx';

import styles from './App.module.css';

const matomoInstance = createInstance({
  urlBase: MATOMO_URL,
  siteId: MATOMO_SITE_ID,
  linkTracking: true,
  configurations: {
    disableCookies: true,
  },
});

const App = () => {
  const { trackEvent } = useMatomo();

  React.useEffect(() => {
    Object.entries(BROWSER_SUPPORT).map(([action, supported]) => {
      trackEvent({
        category: 'feature-check',
        action,
        name: supported ? 'supported' : 'not-supported',
      });
    });
  }, []);

  return (
    <div className={cn(styles.app)}>
      <Header className={styles.header} />
      <Main className={cn(styles.main)} />
      <Footer className={styles.footer} />
    </div>
  );
};

const MaybeMatomo: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) =>
  !IS_DEV && MATOMO_SITE_ID && MATOMO_URL ? (
    // @ts-ignore
    <MatomoProvider value={matomoInstance}>{children}</MatomoProvider>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );

const root = document.getElementById('app');

root &&
  ReactDOM.createRoot(root).render(
    <MaybeMatomo>
      <FontAccessContextProvider>
        <SettingsContextProvider>
          <FileContextProvider>
            <AiContextProvider>
              <TranslationsContextProvider>
                <WhisperContextProvider>
                  <App />
                </WhisperContextProvider>
              </TranslationsContextProvider>
            </AiContextProvider>
          </FileContextProvider>
        </SettingsContextProvider>
      </FontAccessContextProvider>
    </MaybeMatomo>
  );
