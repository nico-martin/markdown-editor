import { FieldTextarea, Form, FormControls, FormElement } from '@theme';
import Quill, { RangeStatic } from 'quill';
import React from 'react';
import { useForm } from 'react-hook-form';

import cn from '@utils/classnames.tsx';
import { getSelectionHtml } from '@utils/editor.ts';
import { getFirstXChars } from '@utils/helpers.ts';

import { CallbackData } from '@store/ai/llm/llmContext.ts';
import useLlm from '@store/ai/llm/useLlm.ts';

import styles from './TextGenerator.module.css';

const TextGenerator: React.FC<{
  className?: string;
  editor: Quill;
}> = ({ className = '', editor }) => {
  const { busy, generate } = useLlm();
  const [llmFeedback, setLlmFeedback] = React.useState<string>('');
  const [context, setContext] = React.useState<{
    html: string;
    text: string;
    isParagraph: boolean;
  }>({ html: '', text: '', isParagraph: false });
  const [selection, setSelection] = React.useState<RangeStatic>(null);
  const form = useForm<{ prompt: string }>({
    defaultValues: {
      prompt: '',
    },
  });

  const updateSelectionHtml = () => {
    if (editor.hasFocus() || getSelectionHtml().text !== '') {
      setSelection(editor.getSelection());
      setContext(getSelectionHtml());
    }
  };

  React.useEffect(() => {
    updateSelectionHtml();
    editor.on('selection-change', updateSelectionHtml);

    return () => {
      editor.off('selection-change', updateSelectionHtml);
    };
  }, []);

  return (
    <div className={cn(className, styles.root)}>
      <h3>Text generator</h3>
      <Form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          let content: any = null;

          await generate(
            data.prompt + '\n\n' + context.text,
            (data: CallbackData) => {
              setLlmFeedback(data.feedback);
              if (!data.output) return;
              if (!content) {
                editor.deleteText(selection.index, selection.length);
                content = editor.getContents();
              }

              editor.setContents(content);

              if (context.isParagraph) {
                const newLine = '\n';
                editor.insertText(selection.index - 1, newLine);
              }
              editor.clipboard.dangerouslyPasteHTML(
                selection.index,
                `<s>${context.html}</s><span> </span>`
              );
              const newSelctionIndex = selection.index + context.html.length;

              if (context.isParagraph) {
                const newLine = '\n';
                editor.insertText(newSelctionIndex, newLine);
              }
              editor.clipboard.dangerouslyPasteHTML(
                newSelctionIndex + 1,
                data.output
              );
            }
          );
        })}
      >
        {context.text !== '' && (
          <div className={styles.contextWrapper}>
            <p>Selected Context</p>
            <p className={styles.context}>
              {getFirstXChars(context.text, 220) +
                (context.text.length > 220 ? '...' : '')}
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
