import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import showdown from 'showdown';
import { Editor as TinyMCEEditor } from 'tinymce';
import TurndownService from 'turndown';

import cn from '@utils/classnames';
import { TINYMCE_KEY } from '@utils/constants';

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
  style: React.CSSProperties;
}> = ({ className = '', activeFile, updateActiveFile, style }) => {
  const [editor, setEditor] = React.useState<TinyMCEEditor>(null);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

  const html: string = React.useMemo(
    () => showdownConverter.makeHtml(activeFile.content),
    [activeFile.content]
  );

  React.useEffect(() => {
    editor && !isEdit && editor.setContent(html);
  }, [editor, html, isEdit]);

  React.useEffect(() => {
    editor && editor.on('focus', () => setIsEdit(true));
    editor && editor.on('blur', () => setIsEdit(false));
  }, [editor]);

  // todo: inline controls wrong position

  return (
    <div
      className={cn(className, styles.root)}
      data-focus={isEdit}
      style={style}
    >
      <Editor
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
        apiKey={TINYMCE_KEY}
      />
    </div>
  );
};

export default EditorHtml;
