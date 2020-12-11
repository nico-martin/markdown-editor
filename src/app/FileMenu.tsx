import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { File, State } from '@store/types';
import cn from '@utils/classnames';

import './FileMenu.css';

const Footer = ({ className = '' }: { className?: string }) => {
  const { activeFileIndex, files } = useStoreState<State>([
    'activeFileIndex',
    'files',
  ]);
  const { setActiveFileIndex, deleteFileByIndex, createNewFile } = useActions(
    actions
  );

  return (
    <div className={cn(className, 'file-menu')}>
      {files.map((file: File, index) => (
        <div
          className={cn('file-menu__element', {
            'file-menu__element--active': index === activeFileIndex,
          })}
        >
          <button
            onClick={() => setActiveFileIndex(index)}
            className={cn('file-menu__button')}
          >
            {file.title}
          </button>
          {files.length > 1 && (
            <button
              onClick={() => deleteFileByIndex(index)}
              className={cn('file-menu__delete')}
            >
              delete
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => createNewFile()}
        className={cn('file-menu__button')}
      >
        +
      </button>
    </div>
  );
};

export default Footer;
