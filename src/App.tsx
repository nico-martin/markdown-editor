import React from 'react';
import ReactDOM from 'react-dom';

import Header from '@app/Header';
import Editor from '@app/Editor/Editor';

import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header className="app__header" />
      <Editor className="app__editor" />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
