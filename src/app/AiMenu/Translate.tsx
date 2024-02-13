import { FieldSelect, Form, FormControls, FormElement } from '@theme';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Editor as TinyMCEEditor } from 'tinymce';

import cn from '@utils/classnames.tsx';

import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import { Bookmark } from '../../../public/tinymce/tinymce';
import styles from './Translate.module.css';

const createEditorSnapshot = (
  editor: TinyMCEEditor
): {
  content: string;
  //cursorPosition: Array<number>;
  bookmark: Bookmark;
  /*bookmark: {
    start: number[];
    end?: number[];
    isFakeCaret?: boolean;
    forward?: boolean;
  };*/
  cursor: { node: Element; offset: number };
} => {
  const bookmark = editor.selection.bookmarkManager.getBookmark(1);

  return {
    content: editor.getContent({ format: 'raw' }),
    //cursorPosition: bookmark.forward ? bookmark.start : bookmark.end,
    cursor: {
      node: editor.selection.getNode(),
      offset: editor.selection.getRng().startOffset,
    },
    bookmark,
    /*bookmark: {
      start: bookmark.forward ? bookmark.start : bookmark.end,
    },*/
  };
};

const Translate: React.FC<{ className?: string; editor: TinyMCEEditor }> = ({
  className = '',
  editor,
}) => {
  const { activeTranslateModel, aiSettings, setAiSettings } = useAiSettings();
  const { translate, busy } = useTranslations();
  const form = useForm<{ from: string; to: string }>({
    defaultValues: {
      from:
        aiSettings.translateFrom ||
        Object.keys(activeTranslateModel.inputLanguages)[0],
      to:
        aiSettings.translateTo ||
        Object.keys(activeTranslateModel.outputLanguages)[0],
    },
  });

  const values = form.watch();

  React.useEffect(() => {
    if (
      values.to !== aiSettings.translateTo ||
      values.from !== aiSettings.translateFrom
    ) {
      setAiSettings({ translateFrom: values.from, translateTo: values.to });
    }
  }, [values]);

  const selectNode = () =>
    editor.selection.select(editor.selection.getNode(), true);

  React.useEffect(() => {
    //selectNode();
    //editor.on('click', selectNode);
    return () => {
      //editor.off('click', selectNode);
    };
  }, []);

  return !activeTranslateModel ? null : (
    <div className={cn(className, styles.root)}>
      <h3>Translate</h3>
      <Form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          const text = editor.selection.getContent({ format: 'html' });
          let content = '';
          let bookmark: Bookmark = null;
          /*
          console.log('test', text);
          editor.selection.setContent('');
          const content = editor.getContent();*/

          //const bookmark = editor.selection.getBookmark(1);
          await translate(data.from, data.to, text, (output) => {
            if (!content || !bookmark) {
              content = editor.getContent();
              bookmark = editor.selection.getBookmark(1);
            }
            editor.setContent(content);
            editor.selection.moveToBookmark(bookmark);
            editor.selection.setContent(output);
          });
        })}
      >
        <FormElement
          name="from"
          label="From"
          Input={FieldSelect}
          form={form}
          options={Object.entries(activeTranslateModel.inputLanguages)
            .sort(([, a], [, b]) => (a < b ? -1 : 1))
            .map((language) => ({
              value: language[0],
              label: language[1],
            }))}
          labelContainerClassName={styles.labelContainer}
          stacked
        />
        <FormElement
          name="to"
          label="To"
          Input={FieldSelect}
          form={form}
          options={Object.entries(activeTranslateModel.outputLanguages)
            .sort(([, a], [, b]) => (a < b ? -1 : 1))
            .map((language) => ({
              value: language[0],
              label: language[1],
            }))}
          labelContainerClassName={styles.labelContainer}
          stacked
        />
        <div contentEditable>
          <p>hello World</p>
          <p>test</p>
        </div>
        <FormControls align="right" value="Translate" loading={busy} />
      </Form>
    </div>
  );
};

export default Translate;
