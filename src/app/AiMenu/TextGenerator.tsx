import { FieldTextarea, Form, FormControls, FormElement } from '@theme';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Editor as TinyMCEEditor } from 'tinymce';

import styles from '@app/AiMenu/Transcribe.module.css';

import cn from '@utils/classnames.tsx';

import useLlm from '@store/ai/llm/useLlm.ts';

const TextGenerator: React.FC<{
  className?: string;
  editor: TinyMCEEditor;
}> = ({ className = '', editor }) => {
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
          const output = await generate(data.prompt, (feedback, message) => {
            setLlmFeedback(feedback);
            console.log(message);
          });
          console.log('DONE', output);
        })}
      >
        <FormElement
          name="prompt"
          label="Prompt"
          Input={FieldTextarea}
          form={form}
          labelContainerClassName={styles.labelContainer}
          stacked
          className={styles.sourceLanguage}
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
