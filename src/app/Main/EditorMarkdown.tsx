import React from 'react';

import cn from '@utils/classnames';

import { File } from '@store/types';

import styles from './EditorMarkdown.module.css';

const EditorMarkup: React.FC<{
  className?: string;
  activeFile: File;
  updateActiveFile: (file: Partial<File>) => void;
}> = ({ className = '', activeFile, updateActiveFile }) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

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
      onFocus={() => setIsEdit(true)}
      onBlur={() => setIsEdit(false)}
    />
  );
};

export default EditorMarkup;
