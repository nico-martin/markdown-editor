import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, useActions, useStoreState } from 'unistore-hooks';
import { actions, store } from '@store/index';
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
    const activeIndex = await settingsDB.get('activeFileIndex');
    const files = await settingsDB.get('files');
    if (files) {
      // todo: set actual file content instead if idb content
      setFiles(files, activeIndex);
    }
  };

  React.useEffect(() => {
    setFromDB().then(() => setInit(true));
  }, []);

  React.useEffect(() => {
    if (init) {
      settingsDB.set('activeFileIndex', activeFileIndex);
      settingsDB.set('files', files);
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
