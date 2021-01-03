import React from 'react';

import cn from '@utils/classnames';

import './ColorScheme.css';
import { FieldRadio } from '@theme';

const ColorScheme = ({
  className = '',
  inputClassName = '',
  titleClassName = '',
  settingsKey,
  value,
  setValue,
}: {
  className?: string;
  inputClassName?: string;
  titleClassName?: string;
  settingsKey: string;
  value: string;
  setValue: Function;
}) => (
  <div className={cn(className, 'color-scheme')}>
    <p className={cn(titleClassName)}>Color Preference</p>
    <div className="color-scheme__elements">
      {Object.entries({
        system: 'Default',
        dark: 'Dark',
        light: 'Light',
      }).map(([color, title]) => (
        <FieldRadio
          label={title}
          onChange={() => setValue(color)}
          className="color-scheme__input"
          value={color}
          name={settingsKey}
          id={`${settingsKey}-${color}`}
          checked={value === color || (!value && color === 'system')}
        />
      ))}
    </div>
  </div>
);

export default ColorScheme;
