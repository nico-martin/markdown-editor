import React from 'react';

import cn from '@utils/classnames';

import styles from './FieldSelect.module.css';

const FieldSelect: React.FC<{
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  id: string;
  options: Record<string, { name: string; style: React.CSSProperties }>;
  onMouseDown?: React.MouseEventHandler<HTMLSelectElement>;
}> = ({
  className = '',
  value,
  onChange,
  name,
  id,
  options,
  onMouseDown = null,
}) => (
  <select
    className={cn(className, styles.root)}
    value={value}
    onChange={onChange}
    name={name}
    id={id}
    onMouseDown={onMouseDown}
  >
    {Object.entries(options).map(([value, { name, style = {} }]) => (
      <option value={value} style={style}>
        {name}
      </option>
    ))}
  </select>
);

export default FieldSelect;
