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

  const openFile = async () => {
    const file = await openFileFromSystem();
    createNewFile(file);
  };

  const newFile = () => {
    createNewFile();
  };

  return (
    <div className={cn(className, 'editor-new')} style={style}>
      <button className="editor-new__button" onClick={openFile}>
        <Icon icon="mdi/open" className="editor-new__icon" />
        Open .md File
      </button>
      <span className="editor-new__spacer">or</span>

      <button className="editor-new__button" onClick={newFile}>
        <Icon icon="mdi/new" className="editor-new__icon" />
        Create .md File
      </button>
    </div>
  );
};

export default EditorNew;
