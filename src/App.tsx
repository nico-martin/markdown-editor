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
import { IS_DEV, MATOMO_SITE_ID, MATOMO_URL } from '@utils/constants';
import { featureCheck } from '@utils/helpers';

import { FileContextProvider } from '@store/FileContext.tsx';
import { FontAccessContextProvider } from '@store/FontAccessContext.tsx';
import { SettingsContextProvider } from '@store/SettingsContext.tsx';

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
    trackEvent({
      category: 'feature-check',
      action: 'fileAPI',
      name: featureCheck ? 'supported' : 'not-supported',
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
            <App />
          </FileContextProvider>
        </SettingsContextProvider>
      </FontAccessContextProvider>
    </MaybeMatomo>
  );
