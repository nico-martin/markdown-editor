import React from 'react';
import { useActions } from 'unistore-hooks';
import { useMatomo } from '@datapunt/matomo-tracker-react';

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
  const { trackEvent } = useMatomo();

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
    } else if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'i') {
      e.preventDefault();
      newFile();
      return;
    }
  };

  const openFile = async () => {
    const file = await openFileFromSystem();
    trackEvent({ category: 'file-action', action: 'open' });
    createNewFile(file);
  };

  const newFile = () => {
    trackEvent({ category: 'file-action', action: 'create-new' });
    createNewFile();
  };

  return (
    <div className={cn(className, 'editor-new')} style={style}>
      <button className="editor-new__button" onClick={openFile} title="ctrl+o">
        <Icon icon="mdi/open" className="editor-new__icon" />
        Open .md File
      </button>
      <span className="editor-new__spacer">or</span>

      <button className="editor-new__button" onClick={newFile} title="ctrl+i">
        <Icon icon="mdi/new" className="editor-new__icon" />
        Create .md File
      </button>
    </div>
  );
};

export default EditorNew;
