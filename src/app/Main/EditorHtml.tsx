import Quill, { TextChangeHandler } from 'quill';
import React from 'react';
import showdown from 'showdown';
import TurndownService from 'turndown';

import AiMenu from '@app/AiMenu/AiMenu.tsx';
import QuillEditor from '@app/Main/editorHtml/QuillEditor.tsx';

import cn from '@utils/classnames';

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

  return (
    <React.Fragment>
      <AiMenu className={styles.aiMenu} editor={editor} />
      <QuillEditor
        className={cn(className, styles.root, 'scroll-sync')}
        setup={setEditor}
      />
      {/*<Editor
          tinymceScriptSrc={TINYMCE_URL}
          initialValue={html}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'formatselect | bold italic | link | bullist numlist | removeformat |',
            inline: true,
            block_formats:
              'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Preformatted=code',
            setup: (e) => setEditor(e),
          }}
          onEditorChange={(markup: string) => {
            isEdit &&
              updateActiveFile({ content: turndownConverter.turndown(markup) });
          }}
        />*/}
    </React.Fragment>
  );
};

export default EditorHtml;
