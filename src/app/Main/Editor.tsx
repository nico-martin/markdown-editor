import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import { EDITOR_VIEWS } from '@utils/constants';
import cn from '@utils/classnames';
import { getFileFromHandle } from '@utils/fileAccess';

import useWindowSize from '@app/hooks/useWindowSize';
import useMobile from '@app/hooks/useMobile';

import EditorMarkdown from './EditorMarkdown';
import EditorHtml from './EditorHtml';
import EditorNew from '@app/Main/EditorNew';

import './Editor.css';

const Editor = ({ className = '' }: { className?: string }) => {
  const { trackEvent } = useMatomo();
  const editorRef = React.useRef(null);
  const [editorWidth, setEditorWidth] = React.useState<number | '100%'>(0);
  const { updateActiveFile, createNewFile, setActiveFileIndex } = useActions(
    actions
  );
  const { activeFileIndex, files, editorView } = useStoreState<State>([
    'activeFileIndex',
    'files',
    'editorView',
  ]);
  const windowSize = useWindowSize();
  const { isMobile } = useMobile();

  const activeFile = React.useMemo(
    () => files[activeFileIndex] || defaultFile,
    [files, activeFileIndex]
  );

  React.useEffect(() => {
    if ('launchQueue' in window) {
      // @ts-ignore
      window.launchQueue.setConsumer(async launchParams => {
        if (launchParams.files.length) {
          const fileHandle = launchParams.files[0];
          const file = await getFileFromHandle(fileHandle);
          trackEvent({ category: 'file-action', action: 'create-from-queue' });
          createNewFile(file);
        }
      });
    }
  }, []);

  const loadActiveFile = async () => {
    if (!activeFile.handleLoaded) {
      const updatedFile = await getFileFromHandle(activeFile.handle);
      if (updatedFile) {
        updateActiveFile(updatedFile);
      } else {
        setActiveFileIndex('new');
      }
    }
  };

  React.useEffect(() => {
    loadActiveFile();
  }, [activeFile]);

  React.useEffect(() => {
    setTimeout(() => {
      if (editorRef.current) {
        document.documentElement.style.setProperty(
          '--fs-base-editor',
          editorRef.current.clientHeight * (isMobile ? 0.022 : 0.018) + 'px'
        );
        setEditorWidth(
          isMobile
            ? '100%'
            : editorRef.current
            ? editorRef.current.clientHeight * 0.7
            : 0
        );
      }
    }, 1);
  }, [editorRef.current, activeFileIndex, editorView, windowSize]);

  const maybePreventClose = e => {
    if (files.filter(file => file.content !== file.savedContent).length > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  React.useEffect(() => {
    window.addEventListener('beforeunload', maybePreventClose, false);
    return () =>
      window.removeEventListener('beforeunload', maybePreventClose, false);
  }, [files]);

  return (
    <ScrollSync>
      <div className={cn(className, 'editor')}>
        <EditorNew
          className="editor__new"
          style={{ display: activeFileIndex === 'new' ? 'flex' : 'none' }}
        />
        {editorView !== EDITOR_VIEWS.HTML && (
          <div className="editor__column editor__column--markup">
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
          <div className="editor__column editor__column--html" ref={editorRef}>
            <ScrollSyncPane>
              <EditorHtml
                className={cn('editor__editor', 'editor__editor--html')}
                activeFile={activeFile}
                updateActiveFile={updateActiveFile}
                style={{ width: editorWidth }}
              />
            </ScrollSyncPane>
          </div>
        )}
      </div>
    </ScrollSync>
  );
};

export default Editor;
