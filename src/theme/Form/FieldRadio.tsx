import React from 'react';

import cn from '@utils/classnames';

import './FieldRadio.css';

const FieldRadio = ({
  className = '',
  value,
  label,
  checked = false,
  onChange,
  name,
  id,
}: {
  className?: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange: Function;
  name: string;
  id: string;
}) => (
  <div className={cn(className, 'field-radio')}>
    <input
      type="radio"
      checked={checked}
      onChange={e => onChange(e)}
      name={name}
      id={id}
      className="field-radio__input"
      value={value}
    />
    <label className="field-radio__label" for={id}>
      {label}
    </label>
  </div>
);

export default FieldRadio;
