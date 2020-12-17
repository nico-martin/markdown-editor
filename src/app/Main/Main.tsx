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
            <p>Hi there,</p>
            <p>
              I am sorry to have to greet you directly with an error message.
              However, this project is just a test to play around with the{' '}
              <a
                target="_blank"
                href="https://wicg.github.io/file-system-access/"
              >
                File System Access API
              </a>
              . And it looks like your browser does not support this API (yet).
              I would be very happy if you would try it again with{' '}
              <a
                target="_blank"
                href="https://caniuse.com/native-filesystem-api"
              >
                a different browser
              </a>{' '}
              - Thanks!
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
