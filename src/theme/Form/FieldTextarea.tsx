import React from 'react';

import cn from '@utils/classnames';

import styles from './FieldInput.module.css';

const FieldTextarea: React.FC<{
  className?: string;
  value: string;
  onChange: Function;
  name: string;
  id: string;
  type?: string;
  [key: string]: any;
}> = ({ className = '', value, onChange, name, id, ...props }) => (
  <textarea
    className={cn(className, styles.root)}
    value={value}
    onChange={(e) => onChange(e)}
    name={name}
    id={id}
    {...props}
  />
);

export default FieldTextarea;
