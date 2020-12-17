import React from 'react';

import cn from '@utils/classnames';
import { Loader } from '@theme';
import { featureCheck } from '@utils/helpers';
import useMobile from '@app/hooks/useMobile';

import Editor from './Editor';

import './Main.css';

const Main = ({
  className = '',
  init,
}: {
  className?: string;
  init: boolean;
}) => {
  const { isMobile } = useMobile();

  return (
    <main className={cn(className, 'main')}>
      {!init ? (
        <Loader className="main__loader" />
      ) : !featureCheck ? (
        <div className="main__error">
          <div className="main__error-inner">
            <p>
              Your Browser does not support the{' '}
              <a
                target="_blank"
                href="https://caniuse.com/native-filesystem-api"
              >
                File System Access API
              </a>
              . This project is about demonstrating this API. Please try it with
              another browser.
            </p>
          </div>
        </div>
      ) : (
        <Editor className="main__editor" />
      )}
    </main>
  );
};

export default Main;
