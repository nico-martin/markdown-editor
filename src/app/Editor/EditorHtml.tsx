import React from 'react';
import showdown from 'showdown';
import TurndownService from 'turndown';
import { Editor } from '@tinymce/tinymce-react';

import { useStoreState, useActions } from 'unistore-hooks';

import { actions, defaultFile } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { tinymceKey } from '@utils/constants';

import './EditorHtml.css';

const showdownConverter = new showdown.Converter();
const turndownConverter = new TurndownService();

const EditorHtml = ({
  className = '',
  ...props
}: {
  className?: string;
  [k: string]: any;
}) => {
  const [editor, setEditor] = React.useState(null);
  const { updateActiveFile, setEditMode } = useActions(actions);
  const { activeFileIndex, files, editMode } = useStoreState<State>([
    'activeFileIndex',
    'files',
    'editMode',
  ]);

  const activeFile = React.useMemo(
    () => files[activeFileIndex] || defaultFile,
    [files, activeFileIndex]
  );

  const html = React.useMemo(
    () => showdownConverter.makeHtml(activeFile.content),
    [activeFile.content]
  );

  React.useEffect(() => {
    editor && editMode === 'markdown' && editor.setContent(html);
  }, [editor, html]);

  React.useEffect(() => {
    window.setTimeout(() => updateActiveFile({ saved: false }), 1000);
  }, [activeFile.saved]);

  return (
    <div className={cn(className, 'editor-html')} {...props}>
      <p className="editor-html__saved" aria-hidden={!activeFile.saved}>
        SAVED
      </p>
      <Editor
        initialValue={html}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
          inline: true,
          setup: e => setEditor(e),
        }}
        onFocus={() => setEditMode('html')}
        onEditorChange={markup => {
          editMode === 'html' &&
            updateActiveFile({ content: turndownConverter.turndown(markup) });
        }}
        apiKey={tinymceKey}
      />
    </div>
  );
};

export default EditorHtml;
