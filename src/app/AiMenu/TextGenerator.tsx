import { useMatomo } from '@datapunt/matomo-tracker-react';
import { FieldTextarea, Form, FormControls, FormElement } from '@theme';
import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';
import React from 'react';
import { useForm } from 'react-hook-form';

import cn from '@utils/classnames.tsx';
import { QuillSelection, getAttributesFromElement } from '@utils/editor.ts';
import { getFirstXChars } from '@utils/helpers.ts';

import { CallbackData } from '@store/ai/llm/llmContext.ts';
import useLlm from '@store/ai/llm/useLlm.ts';

import styles from './TextGenerator.module.css';

const TextGenerator: React.FC<{
  className?: string;
  editor: Quill;
  editorContext: QuillSelection;
  selection: RangeStatic;
}> = ({ className = '', editor, editorContext, selection }) => {
  const { trackEvent } = useMatomo();
  const { busy, generate } = useLlm();
  const [llmFeedback, setLlmFeedback] = React.useState<string>('');
  const form = useForm<{ prompt: string }>({
    defaultValues: {
      prompt: '',
    },
  });

  return (
    <div className={cn(className, styles.root)}>
      <h3>Text generator</h3>
      <Form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          let content: any = null;

          trackEvent({
            category: 'ai-action',
            action: 'text-generator',
          });

          await generate(
            data.prompt + '\n\n' + editorContext.text,
            (data: CallbackData) => {
              setLlmFeedback(data.feedback);
              if (!data.output) return;
              if (!content) {
                editor.deleteText(selection.index, selection.length);
                content = editor.getContents();
              }

              editor.setContents(content);
              const newDelta = new Delta().insert(editorContext.text, {
                strike: true,
                ...getAttributesFromElement(editorContext.element),
              });
              newDelta.insert('\n');
              newDelta.insert(data.output);
              editorContext.text !== '' &&
                newDelta.insert(
                  '\n',
                  getAttributesFromElement(editorContext.element || 'p')
                );
              const delta = new Delta()
                .retain(selection.index)
                .concat(newDelta);
              editor.updateContents(delta, Quill.sources.USER);
            }
          );
        })}
      >
        {editorContext.text !== '' && (
          <div className={styles.contextWrapper}>
            <p>Selected Context</p>
            <p className={styles.context}>
              {getFirstXChars(editorContext.text, 220) +
                (editorContext.text.length > 220 ? '...' : '')}
            </p>
          </div>
        )}
        <FormElement
          name="prompt"
          label="Instruction"
          Input={FieldTextarea}
          form={form}
          labelContainerClassName={styles.labelContainer}
          stacked
          className={styles.prompt}
          autogrow
        />
        <FormControls
          align="right"
          value="Generate"
          loading={busy}
          feedback={<p className={styles.feedback}>{llmFeedback}</p>}
        />
      </Form>
    </div>
  );
};

export default TextGenerator;
