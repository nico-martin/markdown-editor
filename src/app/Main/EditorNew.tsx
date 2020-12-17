import React from 'react';
import { useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import cn from '@utils/classnames';
import { openFileFromSystem } from '@utils/fileAccess';

import { Icon } from '@theme';

import './EditorNew.css';

const EditorNew = ({
  className = '',
  style,
}: {
  className?: string;
  style: Object;
}) => {
  const { createNewFile } = useActions(actions);

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
    } else if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'c') {
      e.preventDefault();
      createNewFile();
      return;
    }
  };

  const openFile = async () => {
    const file = await openFileFromSystem();
    createNewFile(file);
  };

  const newFile = () => {
    createNewFile();
  };

  return (
    <div className={cn(className, 'editor-new')} style={style}>
      <button className="editor-new__button" onClick={openFile} title="ctrl+o">
        <Icon icon="mdi/open" className="editor-new__icon" />
        Open .md File
      </button>
      <span className="editor-new__spacer">or</span>

      <button className="editor-new__button" onClick={newFile} title="ctrl+c">
        <Icon icon="mdi/new" className="editor-new__icon" />
        Create .md File
      </button>
    </div>
  );
};

export default EditorNew;
