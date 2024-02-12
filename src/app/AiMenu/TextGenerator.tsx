import { FieldTextarea, Form, FormControls, FormElement } from '@theme';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Editor as TinyMCEEditor } from 'tinymce';

import styles from '@app/AiMenu/Transcribe.module.css';

import cn from '@utils/classnames.tsx';

const TextGenerator: React.FC<{
  className?: string;
  editor: TinyMCEEditor;
}> = ({ className = '', editor }) => {
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
          console.log(data);
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
        />
        <FormControls
          align="right"
          value="Generate"
          //loading={busy}
          //disabled={!recordedBlob}
        />
      </Form>
    </div>
  );
};

export default TextGenerator;
