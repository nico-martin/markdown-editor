import React from 'react';

import cn from '@utils/classnames.tsx';

import { Button, ButtonGroup, IconType } from '../index';
import styles from './FormControls.module.css';

interface Props {
  value?: string;
  className?: string;
  align?: 'right' | 'left' | 'center';
  loading?: boolean;
  resetText?: string;
  resetFunction?: () => void;
  customSubmit?: {
    text: string;
    icon: IconType;
    onClick: () => void;
  };
  [key: string]: any;
}

const FormControls = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      value = 'Submit',
      className = '',
      align = 'left',
      loading = false,
      resetText = 'Reset',
      resetFunction = null,
      customSubmit = null,
      ...buttonProps
    },
    ref
  ) => (
    <ButtonGroup align={align} className={cn(styles.controls, className)}>
      {resetFunction && align === 'right' && (
        <Button round onClick={resetFunction} appearance="none" type="button">
          {resetText}
        </Button>
      )}
      {customSubmit ? (
        <Button
          round
          type="button"
          icon={customSubmit.icon}
          onClick={() => customSubmit.onClick()}
          loading={loading}
        >
          {customSubmit.text}
        </Button>
      ) : (
        <Button
          round
          {...buttonProps}
          loading={loading}
          type="submit"
          ref={ref}
        >
          {value}
        </Button>
      )}
      {resetFunction && align !== 'right' && (
        <Button round onClick={resetFunction} appearance="none" type="button">
          {resetText}
        </Button>
      )}
    </ButtonGroup>
  )
);

export default FormControls;
