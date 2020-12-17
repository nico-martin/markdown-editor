import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, useActions, useStoreState } from 'unistore-hooks';
import {
  MatomoProvider,
  createInstance,
  useMatomo,
} from '@datapunt/matomo-tracker-react';

import { actions, defaultFile, store } from '@store/index';
import { State } from '@store/types';
import { settingsDB } from '@store/idb';
import { matomoSiteID, matomoURL } from '@utils/constants';
import { featureCheck } from '@utils/helpers';

import Header from '@app/Header/Header';
import Main from '@app/Main/Main';
import Footer from '@app/Footer/Footer';

import './App.css';

const matomoInstance = createInstance({
  urlBase: matomoURL,
  siteId: matomoSiteID,
  linkTracking: true,
  configurations: {
    disableCookies: true,
  },
});

const App = () => {
  const { trackEvent } = useMatomo();
  const [init, setInit] = React.useState<boolean>(false);
  const { activeFileIndex, files } = useStoreState<State>([
    'activeFileIndex',
    'files',
  ]);
  const { setFiles } = useActions(actions);

  const setFromDB = async () => {
    const fileHandles = await settingsDB.get('files');
    if (fileHandles) {
      setFiles(
        fileHandles.map(handle => ({
          ...defaultFile,
          handle,
          title: handle.name,
          handleLoaded: false,
        })),
        'new'
      );
    }
  };

  React.useEffect(() => {
    trackEvent({
      category: 'feature-check',
      action: 'fileAPI',
      name: featureCheck ? 'supported' : 'not-supported',
    });
    setFromDB()
      .then(() => setInit(true))
      .catch(() => setInit(true));
  }, []);

  React.useEffect(() => {
    if (init) {
      settingsDB.set('activeFileIndex', activeFileIndex);
      settingsDB.set(
        'files',
        files.map(({ handle }) => handle).filter(handle => !!handle)
      );
    }
  }, [activeFileIndex, files]);

  return (
    <div className="app">
      <Header className="app__header" />
      <Main className="app__main" init={init} />
      <Footer className="app__footer" init={init} />
    </div>
  );
};

const MaybeMatomo = ({ children }) =>
  !IS_DEV && matomoSiteID && matomoURL ? (
    <MatomoProvider value={matomoInstance}>{children}</MatomoProvider>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );

ReactDOM.render(
  <MaybeMatomo>
    <Provider value={store}>
      <App />
    </Provider>
  </MaybeMatomo>,
  document.querySelector('#app')
);
