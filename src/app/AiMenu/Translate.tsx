import { useMatomo } from '@datapunt/matomo-tracker-react';
import { FieldSelect, Form, FormControls, FormElement } from '@theme';
import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';
import React from 'react';
import { useForm } from 'react-hook-form';

import cn from '@utils/classnames.tsx';
import { QuillSelection, getAttributesFromElement } from '@utils/editor.ts';

import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './Translate.module.css';

const Translate: React.FC<{
  className?: string;
  editor: Quill;
  editorContext: QuillSelection;
  selection: RangeStatic;
}> = ({ className = '', editor, selection, editorContext }) => {
  const { trackEvent } = useMatomo();
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
          let content: any = null;

          trackEvent({
            category: 'ai-action',
            action: 'translate',
          });

          await translate(data.from, data.to, editorContext.text, (output) => {
            if (!content) {
              editor.deleteText(selection.index, selection.length);
              content = editor.getContents();
            }
            editor.setContents(content);
            const newDelta = new Delta().insert(output);
            if (editorContext.element) {
              newDelta.insert(
                '\n',
                getAttributesFromElement(editorContext.element)
              );
            }
            const delta = new Delta().retain(selection.index).concat(newDelta);
            editor.updateContents(delta, Quill.sources.USER);
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
