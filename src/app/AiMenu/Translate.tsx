import { FieldSelect, Form, FormControls, FormElement } from '@theme';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Editor as TinyMCEEditor } from 'tinymce';

import cn from '@utils/classnames.tsx';

import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './Translate.module.css';

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

  return !activeTranslateModel ? null : (
    <div className={cn(className, styles.root)}>
      <h3>Translate</h3>
      <Form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          const text = editor.selection.getContent({ format: 'raw' });
          editor.selection.setContent('');
          const startUndoLevel = editor.undoManager.add();
          await translate(data.from, data.to, text, (output) => {
            editor.setContent(startUndoLevel.content);
            editor.selection.moveToBookmark(startUndoLevel.bookmark);
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
        <FormControls align="right" value="Translate" loading={busy} />
      </Form>
    </div>
  );
};

export default Translate;
