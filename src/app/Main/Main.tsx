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
      ) : true ? (
        <Loader className="main__loader" />
      ) : !featureCheck ? (
        <div className="main__error">
          <div className="main__error-inner">
            <p>
              Your Browser does not support the{' '}
              <a
                target="_blank"
                href="https://wicg.github.io/file-system-access/"
              >
                File System Access API
              </a>
              . This project is about demonstrating this API. Please try it with
              a{' '}
              <a
                target="_blank"
                href="https://caniuse.com/native-filesystem-api"
              >
                different browser
              </a>
              .
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
