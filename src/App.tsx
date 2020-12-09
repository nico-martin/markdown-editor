import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';

const App = () => {
  return (
    <React.Fragment>
      <p>APP</p>
    </React.Fragment>
  );
};

ReactDOM.render(
      <App />,
  document.querySelector('#app')
);
