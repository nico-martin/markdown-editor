import { FieldSelect, Form, FormControls, FormElement } from '@theme';
import Quill from 'quill';
import React from 'react';
import { useForm } from 'react-hook-form';

import cn from '@utils/classnames.tsx';
import { getSelectionHtml } from '@utils/editor.ts';

import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './Translate.module.css';

const Translate: React.FC<{ className?: string; editor: Quill }> = ({
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
          const { html, isParagraph } = getSelectionHtml();
          const selection = editor.getSelection();
          let content: any = null;

          await translate(data.from, data.to, html, (output) => {
            if (!content) {
              editor.deleteText(selection.index, selection.length);
              content = editor.getContents();
            }

            editor.setContents(content);
            if (isParagraph) {
              const newLine = '\n';
              editor.insertText(selection.index - 1, newLine);
            }
            editor.clipboard.dangerouslyPasteHTML(selection.index, output);
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
