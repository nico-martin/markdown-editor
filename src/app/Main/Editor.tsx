import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import { EDITOR_VIEWS } from '@utils/constants';
import cn from '@utils/classnames';

import EditorMarkdown from './EditorMarkdown';
import EditorHtml from './EditorHtml';
import EditorNew from '@app/Main/EditorNew';

import './Editor.css';

const Editor = ({ className = '' }: { className?: string }) => {
  const [markupWidth, setMarkupWidth] = React.useState<number>(50);
  const htmlWidth = React.useMemo(() => 100 - markupWidth, [markupWidth]);
  const { updateActiveFile } = useActions(actions);
  const { activeFileIndex, files, editorView } = useStoreState<State>([
    'activeFileIndex',
    'files',
    'editorView',
  ]);

  const activeFile = React.useMemo(
    () => files[activeFileIndex] || defaultFile,
    [files, activeFileIndex]
  );

  return (
    <ScrollSync>
      <div className={cn(className, 'editor')}>
        {activeFileIndex === 'new' ? (
          <EditorNew className="editor__new" />
        ) : (
          <React.Fragment>
            {editorView !== EDITOR_VIEWS.HTML && (
              <div
                className="editor__column"
                style={{ width: `${markupWidth}%` }}
              >
                <ScrollSyncPane>
                  <EditorMarkdown
                    className={cn('editor__editor', 'editor__editor--markdown')}
                    activeFile={activeFile}
                    updateActiveFile={updateActiveFile}
                  />
                </ScrollSyncPane>
              </div>
            )}
            {editorView !== EDITOR_VIEWS.MD && (
              <div
                className="editor__column"
                style={{ width: `${htmlWidth}%` }}
              >
                <ScrollSyncPane>
                  <EditorHtml
                    className={cn('editor__editor', 'editor__editor--html')}
                    activeFile={activeFile}
                    updateActiveFile={updateActiveFile}
                  />
                </ScrollSyncPane>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </ScrollSync>
  );
};

export default Editor;
