import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { maxOpenFiles } from '@utils/constants';
import { openFileFromSystem } from '@utils/fileAccess';

import { Button } from '@theme';

import './ButtonOpen.css';

const ButtonOpen = ({ className = '' }: { className?: string }) => {
  const { createNewFile } = useActions(actions);
  const { files } = useStoreState<State>(['files']);

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, []);

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
      e.preventDefault();
      await openFile();
      return;
    }
  };

  const openFile = async () => {
    const file = await openFileFromSystem();
    createNewFile(file);
  };

  return (
    <Button
      className={cn(className)}
      icon="mdi/open"
      layout="empty"
      onClick={openFile}
      title="CTRL+O"
      disabled={files.length >= maxOpenFiles}
    >
      Open File
    </Button>
  );
};

export default ButtonOpen;
