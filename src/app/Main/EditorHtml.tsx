import React from 'react';
import showdown from 'showdown';
import TurndownService from 'turndown';
import { Editor } from '@tinymce/tinymce-react';

import { File } from '@store/types';
import { tinymceKey } from '@utils/constants';

import './EditorHtml.css';

const showdownConverter = new showdown.Converter();
const turndownConverter = new TurndownService({
  headingStyle: 'atx',
});

const EditorHtml = ({
  activeFile,
  updateActiveFile,
}: {
  activeFile: File;
  updateActiveFile: Function;
}) => {
  const [editor, setEditor] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState(false);

  const html = React.useMemo(
    () => showdownConverter.makeHtml(activeFile.content),
    [activeFile.content]
  );

  React.useEffect(() => {
    editor && !isEdit && editor.setContent(html);
  }, [editor, html]);

  React.useEffect(() => {
    window.setTimeout(() => updateActiveFile({ saved: false }), 1000);
  }, [activeFile.saved]);

  return (
    <Editor
      initialValue={html}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'formatselect | bold italic | link | bullist numlist | removeformat |',
        inline: true,
        block_formats:
          'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Preformatted=code',
        setup: e => setEditor(e),
      }}
      onFocus={() => setIsEdit(true)}
      onFocusOut={() => setIsEdit(false)}
      onEditorChange={markup => {
        isEdit &&
          updateActiveFile({ content: turndownConverter.turndown(markup) });
      }}
      apiKey={tinymceKey}
    />
  );
};

export default EditorHtml;
