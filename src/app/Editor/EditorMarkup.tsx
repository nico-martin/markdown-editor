import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';

import './EditorMarkup.css';

const EditorMarkup = ({
  className = '',
  ...props
}: {
  className?: string;
  [k: string]: any;
}) => {
  const { updateActiveFile } = useActions(actions);
  const { activeFileIndex, files } = useStoreState<State>([
    'activeFileIndex',
    'files',
  ]);

  const activeFile = React.useMemo(
    () => files[activeFileIndex] || defaultFile,
    [files, activeFileIndex]
  );

  return (
    <div className={cn(className, 'editor-markup')} {...props}>
      <textarea
        className="editor-markup__textarea"
        onKeyUp={e =>
          updateActiveFile({ content: (e.target as HTMLTextAreaElement).value })
        }
        placeholder="start typing.."
        value={activeFile.content}
      />
    </div>
  );
};

export default EditorMarkup;
