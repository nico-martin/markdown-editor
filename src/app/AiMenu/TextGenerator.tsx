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

import useLlm from '@store/ai/llm/useLlm.ts';

import styles from './TextGenerator.module.css';

const showdownConverter = new showdown.Converter();

enum GenerationState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  THINKING = 'THINKING',
  ANSWERING = 'ANSWERING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

const TextGenerator: React.FC<{
  className?: string;
  editor: Quill;
  editorContext: QuillSelection;
  selection: RangeStatic;
}> = ({ className = '', editor, editorContext, selection }) => {
  const { trackEvent } = useMatomo();
  const { generate, initialize } = useLlm();
  const [busy, setBusy] = React.useState<boolean>(false);
  const [llmFeedback, setLlmFeedback] = React.useState<GenerationState>(
    GenerationState.IDLE
  );
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
            setBusy(true);
            setLlmFeedback(GenerationState.INITIALIZING);
            await initialize();
            setLlmFeedback(GenerationState.THINKING);
            await generate(
              data.prompt + '\n\n' + editorContext.text,
              (data) => {
                setLlmFeedback(GenerationState.ANSWERING);
                if (!data.output) return;
                if (!content) {
                  editor.deleteText(selection.index, selection.length);
                  content = editor.getContents();
                }

                if (data.stats) {
                  console.log('stats', {
                    inputTokens: data.stats.prompt_tokens,
                    inputTokensPerSecond: round(
                      data.stats.extra.prefill_tokens_per_s,
                      2
                    ),
                    inputTokenTime: `${round(
                      60 / data.stats.extra.prefill_tokens_per_s,
                      2
                    )} ms`,
                    outputTokens: data.stats.extra.decode_tokens_per_s,
                    outputTokensPerSecond: round(
                      data.stats.extra.decode_tokens_per_s,
                      2
                    ),
                    outputTokenTime: `${round(
                      60 / data.stats.extra.decode_tokens_per_s,
                      2
                    )} ms`,
                  });
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
            setBusy(false);
          } catch (e) {
            console.error(e);
            setBusy(false);
            setLlmFeedback(GenerationState.ERROR);
            alert(`Error: ${e}`);
          }
          setLlmFeedback(GenerationState.COMPLETE);
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
