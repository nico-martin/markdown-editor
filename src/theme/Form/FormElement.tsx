import React from 'react';
import { useController } from 'react-hook-form';

import cn from '@utils/classnames.tsx';

import styles from './FormElement.module.css';

const FormElement: React.FC<{
  form?: any;
  label?: string;
  name: string;
  rules?: any;
  Input?: any;
  Description?: any;
  className?: string;
  inputClassName?: string;
  labelContainerClassName?: string;
  sanitizeValue?: () => string;
  stacked?: boolean;
  min?: number;
  max?: number;
  [key: string]: any;
}> = ({
  form,
  label,
  name,
  rules = {},
  Input,
  Description,
  className = '',
  inputClassName = '',
  labelContainerClassName = '',
  sanitizeValue = (value: any) => value,
  stacked = false,
  ...inputProps
}) => {
  const { field } = useController({
    control: form.control,
    name,
    rules,
  });

  const error = form?.formState?.errors ? form?.formState?.errors[name] : null;

  return (
    <div
      className={cn(styles.container, className, {
        [styles.containerStacked]: stacked,
        [styles.containerIsCheckBox]: Input.displayName === 'InputCheckbox',
      })}
    >
      <div className={cn(styles.labelContainer, labelContainerClassName)}>
        <label htmlFor={name} className={styles.label}>
          {label}
          {'required' in rules && '*'}
        </label>
        {Description && <div className={styles.description}>{Description}</div>}
      </div>
      <div className={styles.content}>
        <Input
          className={cn(styles.input, inputClassName)}
          {...field}
          {...inputProps}
          onBlur={(e: { target: { value: any } }) =>
            e && field.onChange(sanitizeValue(e.target.value))
          }
        />
        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    </div>
  );
};

export default FormElement;
