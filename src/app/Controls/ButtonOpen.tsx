import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { Button } from '@theme';

import './ButtonOpen.css';

const ButtonOpen = ({ className = '' }: { className?: string }) => {
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
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
      e.preventDefault();
      await openFile();
      return;
    }
  };

  const openFile = async () => {
    if (
      hasChanges &&
      !confirm(
        'Are you sure you want to open a new file? Changes not yet saved are lost.'
      )
    ) {
      return;
    }
    // @ts-ignore
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Markdown Files',
          accept: {
            'text/markdown': ['.md'],
          },
        },
      ],
    });

    const file = await handle.getFile();

    const content = await file.text();
    setActiveFile({
      content,
      savedContent: content,
      handle,
      path: file.name,
    });
  };

  return (
    <Button
      className={cn(className)}
      icon="mdi/open"
      layout="empty"
      onClick={openFile}
      title="CTRL+O"
    >
      Open File
    </Button>
  );
};

export default ButtonOpen;
