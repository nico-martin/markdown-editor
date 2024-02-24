import Quill, { RangeStatic, TextChangeHandler } from 'quill';
import React from 'react';
import showdown from 'showdown';
import TurndownService from 'turndown';

import AiMenu from '@app/AiMenu/AiMenu.tsx';
import QuillEditor from '@app/Main/editorHtml/QuillEditor.tsx';

import cn from '@utils/classnames';
import { QuillSelection, getSelectionHtml } from '@utils/editor.ts';

import { EditMode, useEditMode } from '@store/SettingsContext.tsx';
import { File } from '@store/types';

import styles from './EditorHtml.module.css';

const showdownConverter = new showdown.Converter();
const turndownConverter = new TurndownService({
  headingStyle: 'atx',
});

const EditorHtml: React.FC<{
  className?: string;
  activeFile: File;
  updateActiveFile: (file: Partial<File>) => void;
}> = ({ className = '', activeFile, updateActiveFile }) => {
  const [editor, setEditor] = React.useState<Quill>(null);
  const [editMode, setEditMode] = useEditMode();
  const [editorContext, setEditorContext] = React.useState<QuillSelection>({
    html: '',
    text: '',
    element: null,
  });
  const [selection, setSelection] = React.useState<RangeStatic>(null);

  React.useEffect(() => {
    if (editor && editMode !== EditMode.HTML) {
      const delta = editor.clipboard.convert(
        // @ts-ignore
        showdownConverter.makeHtml(activeFile.content)
      );
      editor.setContents(delta);
    }
  }, [editor, activeFile.content, editMode]);

  const textChange: TextChangeHandler = (_delta, _oldDelta, source) => {
    if (source == 'api') {
      //An API call triggered this change.
    } else if (source == 'silent') {
      //A Silent call triggered this change.
    } else if (source == 'user') {
      setEditMode(EditMode.HTML);
      updateActiveFile({
        content: turndownConverter.turndown(editor.root.innerHTML),
      });
    }
  };

  React.useEffect(() => {
    if (editor) {
      editor.on('text-change', textChange);

      return () => {
        editor.off('text-change', textChange);
      };
    }
  }, [editor]);

  const updateSelectionHtml = () => {
    if (editor.hasFocus() || getSelectionHtml().text !== '') {
      setSelection(editor.getSelection());
      setEditorContext(getSelectionHtml());
    }
  };

  React.useEffect(() => {
    if (!editor) {
      return;
    }
    updateSelectionHtml();
    editor.on('selection-change', updateSelectionHtml);

    return () => {
      editor.off('selection-change', updateSelectionHtml);
    };
  }, [editor]);

  React.useEffect(() => {
    if (!editor || !selection) {
      return;
    }
    editor.formatText(0, 1000000000, 'background', 'transparent');
    editor.formatText(0, 1000000000, 'color', '');
    editor.formatText(
      selection.index,
      selection.length,
      'background',
      '#9f9f9f'
    );
    editor.formatText(selection.index, selection.length, 'color', '#fff');
  }, [selection, editorContext, editor]);

  return (
    <React.Fragment>
      <AiMenu
        className={styles.aiMenu}
        editor={editor}
        editorContext={editorContext}
        selection={selection}
      />
      <QuillEditor
        className={cn(className, styles.root, 'scroll-sync')}
        setup={setEditor}
      />
    </React.Fragment>
  );
};

export default EditorHtml;
