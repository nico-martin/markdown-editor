import React from 'react';

import cn from '@utils/classnames';

import styles from './FieldRadio.module.css';

const FieldRadio: React.FC<{
  className?: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: Function;
  name: string;
  id: string;
}> = ({
  className = '',
  value,
  label,
  checked = false,
  onChange,
  name,
  id,
}) => (
  <div className={cn(className, styles.root)}>
    <input
      type="radio"
      checked={checked}
      onChange={(e) => onChange(e)}
      name={name}
      id={id}
      className={styles.input}
      value={value}
    />
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
  </div>
);

export default FieldRadio;
