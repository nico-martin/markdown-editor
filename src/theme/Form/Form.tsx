import React from 'react';

import cn from '@utils/classnames.tsx';

const Form: React.FC<{
  className?: string;
  children?: any;
  onSubmit?: (data: React.FormEvent<HTMLFormElement>) => void;
  [key: string]: any;
}> = ({ className = '', children, onSubmit, ...rest }) => (
  <form
    className={cn(className)}
    onSubmit={onSubmit ? (data) => onSubmit(data) : null}
    {...rest}
  >
    {children}
  </form>
);

export default Form;
