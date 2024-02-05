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
        <Loader className={styles.loader} />
      ) : (
        <Editor className={styles.editor} />
      )}
    </main>
  );
};

export default Main;
