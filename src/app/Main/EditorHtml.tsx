import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import showdown from 'showdown';
import { Editor as TinyMCEEditor } from 'tinymce';
import TurndownService from 'turndown';

import AiMenu from '@app/AiMenu/AiMenu.tsx';

import cn from '@utils/classnames';
import { TINYMCE_URL } from '@utils/constants';

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
  const [editor, setEditor] = React.useState<TinyMCEEditor>(null);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [html, setHtml] = React.useState<string>('');

  React.useEffect(() => {
    editor &&
      !isEdit &&
      setHtml(showdownConverter.makeHtml(activeFile.content));
  }, [editor, activeFile.content, isEdit]);

  React.useEffect(() => {
    editor && editor.on('focus', () => setIsEdit(true));
    editor && editor.on('blur', () => setIsEdit(false));
  }, [editor]);

  // todo: inline controls wrong position

  return (
    <React.Fragment>
      <AiMenu className={styles.aiMenu} />
      <div
        className={cn(className, styles.root, 'scroll-sync')}
        data-focus={isEdit}
      >
        <Editor
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
        />
      </div>
    </React.Fragment>
  );
};

export default EditorHtml;
