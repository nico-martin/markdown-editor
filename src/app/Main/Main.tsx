import { Loader } from '@theme';
import React from 'react';

import cn from '@utils/classnames';

import { useFileContext } from '@store/FileContext.tsx';

import Editor from './Editor';
import styles from './Main.module.css';

const Main: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { init } = useFileContext();
  return (
    <main className={cn(className, styles.root)}>
      {!init ? (
        <Loader className={styles.loader} /> /*: !featureCheck ? (
        <div className={styles.error}>
          <div className={styles.error__inner}>
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
      )*/
      ) : (
        <Editor className={styles.editor} />
      )}
    </main>
  );
};

export default Main;
