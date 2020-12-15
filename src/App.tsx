import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, useActions, useStoreState } from 'unistore-hooks';

import { actions, defaultFile, store } from '@store/index';
import { State } from '@store/types';
import { settingsDB } from '@store/idb';

import Header from '@app/Header/Header';
import Main from '@app/Main/Main';
import Footer from '@app/Footer/Footer';

import './App.css';

const App = () => {
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

ReactDOM.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
