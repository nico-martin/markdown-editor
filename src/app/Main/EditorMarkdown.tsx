import React from 'react';

import { File } from '@store/types';
import cn from '@utils/classnames';

import './EditorMarkdown.css';

const EditorMarkup = ({
  className = '',
  activeFile,
  updateActiveFile,
}: {
  className?: string;
  activeFile: File;
  updateActiveFile: Function;
}) => (
  <textarea
    className={cn(className, 'editor-markdown')}
    onKeyUp={e =>
      updateActiveFile({ content: (e.target as HTMLTextAreaElement).value })
    }
    placeholder="start typing.."
    value={activeFile.content}
  />
);

export default EditorMarkup;
