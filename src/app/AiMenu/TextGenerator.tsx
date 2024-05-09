import { useMatomo } from '@datapunt/matomo-tracker-react';
import { FieldTextarea, Form, FormControls, FormElement } from '@theme';
import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';
import React from 'react';
import { useForm } from 'react-hook-form';
import showdown from 'showdown';

import cn from '@utils/classnames.tsx';
import { QuillSelection, getAttributesFromElement } from '@utils/editor.ts';
import { getFirstXChars, round } from '@utils/helpers.ts';

import { CallbackData } from '@store/ai/llm/llmContext.ts';
import useLlm from '@store/ai/llm/useLlm.ts';

import styles from './TextGenerator.module.css';

const showdownConverter = new showdown.Converter();

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

          try {
            await generate(
              data.prompt + '\n\n' + editorContext.text,
              (data: CallbackData) => {
                setLlmFeedback(data.feedback);
                if (!data.output) return;
                if (!content) {
                  editor.deleteText(selection.index, selection.length);
                  content = editor.getContents();
                }

                if (data.stats) {
                  console.log('stats', {
                    inputTokens: data.stats.prefillTotalTokens,
                    inputTokensPerSecond: round(
                      data.stats.prefillTokensPerSec,
                      2
                    ),
                    inputTokenTime: `${round(
                      60 / data.stats.prefillTokensPerSec,
                      2
                    )} ms`,
                    outputTokens: data.stats.decodingTotalTokens,
                    outputTokensPerSecond: round(
                      data.stats.decodingTokensPerSec,
                      2
                    ),
                    outputTokenTime: `${round(
                      60 / data.stats.decodingTokensPerSec,
                      2
                    )} ms`,
                  });
                  /*trackEvent({
                    category: 'llm-stats',
                    action: 'text-generator',
                    name: 'output-tps',
                    value: data.stats.decodingTokensPerSec,
                  });
                  trackEvent({
                    category: 'llm-stats',
                    action: 'text-generator',
                    name: 'input-tps',
                    value: data.stats.prefillTokensPerSec,
                  });*/
                }

                editor.setContents(content);

                const delta = new Delta().insert(editorContext.text, {
                  strike: true,
                  ...getAttributesFromElement(editorContext.element),
                });
                delta.insert('\n');
                //delta.insert(data.output);
                const deltaContent = delta.concat(
                  editor.clipboard.convert(
                    // @ts-ignore
                    showdownConverter.makeHtml(data.output)
                  )
                );

                editorContext.text !== '' &&
                  deltaContent.insert(
                    '\n',
                    getAttributesFromElement(editorContext.element || 'p')
                  );

                editor.updateContents(
                  new Delta().retain(selection.index).concat(deltaContent),
                  Quill.sources.USER
                );
              }
            );
          } catch (e) {
            alert(`Error: ${e}`);
          }
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
          focusOnMount
        />
        <FormControls
          align="right"
          value="Generate"
          loading={busy}
          data-status={llmFeedback}
        />
      </Form>
    </div>
  );
};

export default TextGenerator;
