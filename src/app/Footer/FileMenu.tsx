import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { File, State } from '@store/types';

import cn from '@utils/classnames';
import { maxOpenFiles } from '@utils/constants';

import useMobile from '@app/hooks/useMobile';

import './FileMenu.css';

const Footer = ({ className = '' }: { className?: string }) => {
  const { activeFileIndex, files } = useStoreState<State>([
    'activeFileIndex',
    'files',
  ]);
  const { setActiveFileIndex, closeFileByIndex, openFileSelect } = useActions(
    actions
  );
  const { isMobile } = useMobile();

  if (isMobile) {
    //return;
  }

  return (
    <div className={cn(className, 'file-menu')}>
      {files.map((file: File, index) => (
        <button
          onClick={() => setActiveFileIndex(index)}
          className={cn('file-menu__element', {
            'file-menu__element--active': index === activeFileIndex,
            'file-menu__element--tosave': file.content !== file.savedContent,
          })}
        >
          <span className={cn('file-menu__text')}>{file.title}</span>
          <button
            onClick={() => closeFileByIndex(index)}
            className={cn('file-menu__delete')}
          >
            delete
          </button>
        </button>
      ))}
      {activeFileIndex !== 'new' &&
        files.length < maxOpenFiles &&
        files.length !== 0 && (
          <div className={cn('file-menu__element', 'file-menu__element--new')}>
            <button
              onClick={() => openFileSelect()}
              className={cn('file-menu__button', 'file-menu__button--new')}
            >
              new File
            </button>
          </div>
        )}
    </div>
  );
};

export default Footer;
