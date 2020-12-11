import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { Button } from '@theme';

import './ButtonSave.css';

const ButtonSave = ({ className = '' }: { className?: string }) => {
  const { updateActiveFile } = useActions(actions);
  const { activeFileIndex, files } = useStoreState<State>([
    'activeFileIndex',
    'files',
  ]);

  const activeFile = React.useMemo(
    () => files[activeFileIndex] || defaultFile,
    [files, activeFileIndex]
  );

  const canSave = React.useMemo(
    () => activeFile.content !== activeFile.savedContent,
    [activeFile.content, activeFile.savedContent]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, [activeFile.handle, activeFile.content, canSave]);

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 's') {
      e.preventDefault();
      await saveFile();
      return;
    }
  };

  const saveFile = async () => {
    if (!canSave) {
      return;
    }
    let handle = activeFile.handle;
    if (!handle) {
      // if no handle exists it must be a new file. So we create a new handle
      // @ts-ignore
      handle = await window.showSaveFilePicker({
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
      });
    }
    const writable = await handle.createWritable();
    await writable.write(activeFile.content);
    const file = await handle.getFile();

    updateActiveFile({
      title: file.name,
      savedContent: activeFile.content,
      handle,
      saved: true,
    });
    await writable.close();
  };

  return (
    <Button
      className={cn(className)}
      icon="mdi/save"
      onClick={saveFile}
      color="primary"
      title="CTRL+S"
      round
      disabled={!canSave}
    >
      Save
    </Button>
  );
};

export default ButtonSave;