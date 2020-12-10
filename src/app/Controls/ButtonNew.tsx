import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { Button } from '@theme';

import './ButtonNew.css';

const ButtonNew = ({ className = '' }: { className?: string }) => {
  const { setActiveFile } = useActions(actions);
  const { activeFile } = useStoreState<State>(['activeFile']);
  const hasChanges = React.useMemo(
    () => activeFile.content !== activeFile.savedContent,
    [activeFile.content, activeFile.savedContent]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, []);

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'c') {
      e.preventDefault();
      await createFile();
      return;
    }
  };

  const createFile = async () => {
    if (
      hasChanges &&
      confirm(
        'Are you sure you want to create a new file? Changes not yet saved are lost.'
      )
    ) {
      setActiveFile({
        content: '',
        savedContent: '',
        handle: null,
        path: null,
      });
    }
  };

  return (
    <Button
      className={cn(className)}
      icon="mdi/new"
      layout="empty"
      onClick={createFile}
      title="CTRL+C"
    >
      Create
    </Button>
  );
};

export default ButtonNew;
