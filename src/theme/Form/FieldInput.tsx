import React from 'react';

import cn from '@utils/classnames';

import './FieldInput.css';

const FieldInput = ({
  className = '',
  value,
  onChange,
  name,
  id,
  type = 'text',
  ...props
}: {
  className?: string;
  value: string;
  onChange: Function;
  name: string;
  id: string;
  type?: string;
  [key: string]: any;
}) => (
  <input
    className={cn(className, 'field-input')}
    value={value}
    type={type}
    onChange={e => onChange(e)}
    name={name}
    id={id}
    {...props}
  />
);

export default FieldInput;
