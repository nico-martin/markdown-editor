import React from 'react';

import cn from '@utils/classnames';
import { MAX_OPEN_FILES } from '@utils/constants';

import { useFileContext } from '@store/FileContext.tsx';
import { File } from '@store/types';

import styles from './FileMenu.module.css';

const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { files, setActiveFileIndex, activeFileIndex, closeFileByIndex } =
    useFileContext();
  return (
    <div className={cn(className, styles.root)}>
      {files.map((file: File, index) => (
        <div
          className={cn(styles.element, {
            [styles.elementActive]: index === activeFileIndex,
            [styles.elementToSave]: file.content !== file.savedContent,
          })}
          key={index}
        >
          <button
            onClick={() => setActiveFileIndex(index)}
            className={cn(styles.button)}
          >
            {file.title}
          </button>
          <button
            onClick={() => closeFileByIndex(index)}
            className={cn(styles.delete)}
          >
            delete
          </button>
        </div>
      ))}
      {activeFileIndex !== 'new' &&
        files.length < MAX_OPEN_FILES &&
        files.length !== 0 && (
          <div className={cn(styles.element, styles.elementNew)}>
            <button
              onClick={() => setActiveFileIndex('new')}
              className={cn(styles.buttonNew)}
            >
              new File
            </button>
          </div>
        )}
    </div>
  );
};

export default Footer;
