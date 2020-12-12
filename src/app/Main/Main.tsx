import React from 'react';

import cn from '@utils/classnames';
import { Loader } from '@theme';
import { featureCheck } from '@utils/helpers';

import Editor from './Editor';

import './Main.css';

const Main = ({
  className = '',
  init,
}: {
  className?: string;
  init: boolean;
}) => (
  <main className={cn(className, 'main')}>
    {!init ? (
      <Loader className="main__loader" />
    ) : featureCheck ? (
      <Editor className="main__editor" />
    ) : (
      <div className="main__not-supported">
        <p>
          Your Browser does not support the{' '}
          <a target="_blank" href="https://caniuse.com/native-filesystem-api">
            Native File System API
          </a>
          . This project is about demonstrating this API. Please try it with
          another browser.
        </p>
      </div>
    )}
  </main>
);

export default Main;
