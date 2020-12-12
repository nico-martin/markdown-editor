import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';

import EditorMarkdown from './EditorMarkdown';
import EditorHtml from './EditorHtml';

import './Editor.css';

const Editor = ({ className = '' }: { className?: string }) => {
  const [markupWidth, setMarkupWidth] = React.useState<number>(50);
  const htmlWidth = React.useMemo(() => 100 - markupWidth, [markupWidth]);
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
    <div className={cn(className, 'editor')}>
      <div className="editor__column" style={{ width: `${markupWidth}%` }}>
        <EditorMarkdown
          activeFile={activeFile}
          updateActiveFile={updateActiveFile}
        />
      </div>
      <div className="editor__column" style={{ width: `${htmlWidth}%` }}>
        <EditorHtml
          activeFile={activeFile}
          updateActiveFile={updateActiveFile}
        />
      </div>
    </div>
  );
};

export default Editor;
