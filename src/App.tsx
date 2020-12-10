import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, useActions } from 'unistore-hooks';
import { actions, store } from '@store/index';

import Header from '@app/Header';
import Editor from '@app/Editor/Editor';
import Footer from '@app/Footer';

import './App.css';

const App = () => {
  const { loadRecentFiles } = useActions(actions);

  React.useEffect(() => {
    loadRecentFiles();
  }, []);

  return (
    <div className="app">
      <Header className="app__header" />
      <Editor className="app__editor" />
      <Footer className="app__footer" />
    </div>
  );
};

ReactDOM.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
