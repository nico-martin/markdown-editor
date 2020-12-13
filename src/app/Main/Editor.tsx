import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { Button, Icon } from '@theme';

import EditorMarkdown from './EditorMarkdown';
import EditorHtml from './EditorHtml';

import './Editor.css';
import EditorNew from '@app/Main/EditorNew';

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
    <ScrollSync>
      <div className={cn(className, 'editor')}>
        {files.length === 0 ? (
          <EditorNew className="editor__new" />
        ) : (
          <React.Fragment>
            <div
              className="editor__column"
              style={{ width: `${markupWidth}%` }}
            >
              <ScrollSyncPane>
                <EditorMarkdown
                  className="editor__editor"
                  activeFile={activeFile}
                  updateActiveFile={updateActiveFile}
                />
              </ScrollSyncPane>
            </div>
            <div className="editor__column" style={{ width: `${htmlWidth}%` }}>
              <ScrollSyncPane>
                <EditorHtml
                  className="editor__editor"
                  activeFile={activeFile}
                  updateActiveFile={updateActiveFile}
                />
              </ScrollSyncPane>
            </div>
          </React.Fragment>
        )}
      </div>
    </ScrollSync>
  );
};

export default Editor;
