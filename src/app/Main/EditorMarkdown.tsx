import React from 'react';

import cn from '@utils/classnames';

import { EditMode, useEditMode } from '@store/SettingsContext.tsx';
import { File } from '@store/types';

import styles from './EditorMarkdown.module.css';

const EditorMarkup: React.FC<{
  className?: string;
  activeFile: File;
  updateActiveFile: (file: Partial<File>) => void;
}> = ({ className = '', activeFile, updateActiveFile }) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [editMode, setEditMode] = useEditMode();
  const isEdit = editMode === EditMode.MD;

  React.useEffect(() => {
    if (!isEdit && ref.current) {
      ref.current.value = activeFile.content;
    }
  }, [isEdit, ref, activeFile.content]);

  return (
    <textarea
      ref={ref}
      className={cn(className, styles.root, 'scroll-sync')}
      onKeyUp={(e) =>
        updateActiveFile({
          content: (e.target as HTMLTextAreaElement).value,
        })
      }
      placeholder="start typing.."
      defaultValue={activeFile.content}
      onFocus={() => {
        console.log('focus');
        setEditMode(EditMode.MD);
      }}
      onBlur={() => setEditMode(EditMode.NONE)}
    />
  );
};

export default EditorMarkup;
