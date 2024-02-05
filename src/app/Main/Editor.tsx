import React from 'react';

import EditorNew from '@app/Main/EditorNew';
import useMobile from '@app/hooks/useMobile';
import useWindowSize from '@app/hooks/useWindowSize';

import cn from '@utils/classnames';
import { getFileFromHandle } from '@utils/fileAccess';
import scrollSync from '@utils/scrollSync';

import { useFileContext } from '@store/FileContext.tsx';
import { EDITOR_VIEWS, useEditorView } from '@store/SettingsContext.tsx';

import styles from './Editor.module.css';
import EditorHtml from './EditorHtml';
import EditorMarkdown from './EditorMarkdown';

const Editor = ({ className = '' }: { className?: string }) => {
  const editorRef = React.useRef(null);
  const [editorWidth, setEditorWidth] = React.useState<number | '100%'>(0);
  const {
    activeFileIndex,
    setActiveFileIndex,
    updateActiveFile,
    activeFile,
    files,
  } = useFileContext();
  const windowSize = useWindowSize();
  const { isMobile } = useMobile();

  const [editorView] = useEditorView();

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
    scrollSync();
  }, [editorView]);

  React.useEffect(() => {
    loadActiveFile();
  }, [activeFile]);

  const maybePreventClose = (e: BeforeUnloadEvent) => {
    if (files.filter((file) => file.content !== file.savedContent).length > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  React.useEffect(() => {
    window.addEventListener('beforeunload', maybePreventClose, false);
    return () =>
      window.removeEventListener('beforeunload', maybePreventClose, false);
  }, [files]);

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

  return (
    <div className={cn(className, styles.root)}>
      <EditorNew
        className={styles.new}
        style={{ display: activeFileIndex === 'new' ? 'flex' : 'none' }}
      />
      {editorView !== EDITOR_VIEWS.HTML && (
        <div className={cn(styles.column, styles.columnMarkup)}>
          <EditorMarkdown
            className={cn(styles.editor)}
            activeFile={activeFile}
            updateActiveFile={updateActiveFile}
          />
        </div>
      )}
      {editorView !== EDITOR_VIEWS.MD && (
        <div
          className={cn(styles.column, styles.columnHtml)}
          ref={editorRef}
          style={{ width: editorWidth, flex: `0 1 ${editorWidth}px` }}
        >
          <EditorHtml
            className={cn(styles.editor)}
            activeFile={activeFile}
            updateActiveFile={updateActiveFile}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;
