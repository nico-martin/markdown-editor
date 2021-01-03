import React from 'react';

import cn from '@utils/classnames';

import './FieldSelect.css';

const FieldSelect = ({
  className = '',
  value,
  onChange,
  name,
  id,
  options,
  ...props
}: {
  className?: string;
  value: string;
  onChange: Function;
  name: string;
  id: string;
  options: Record<string, { name: string; [key: string]: any }>;
  [key: string]: any;
}) => (
  <select
    className={cn(className, 'field-select')}
    value={value}
    onChange={e => onChange(e)}
    name={name}
    id={id}
    {...props}
  >
    {Object.entries(options).map(([value, { name, ...atts }]) => (
      <option value={value} {...atts}>
        {name}
      </option>
    ))}
  </select>
);

export default FieldSelect;
