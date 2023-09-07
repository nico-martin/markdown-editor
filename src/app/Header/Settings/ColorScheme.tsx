import { FieldRadio } from '@theme';
import React from 'react';

import cn from '@utils/classnames';

import './ColorScheme.module.css';

const ColorScheme: React.FC<{
  className?: string;
  titleClassName?: string;
  settingsKey: string;
  value: string;
  setValue: (value: string) => void;
}> = ({
  className = '',
  titleClassName = '',
  settingsKey,
  value,
  setValue,
}) => (
  <div className={cn(className)}>
    <p className={cn(titleClassName)}>Color Preference</p>
    <div className="color-scheme__elements">
      {Object.entries({
        system: 'Default',
        dark: 'Dark',
        light: 'Light',
      }).map(([color, title], i) => (
        <FieldRadio
          label={title}
          onChange={() => setValue(color)}
          className="color-scheme__input"
          value={color}
          name={settingsKey}
          id={`${settingsKey}-${color}`}
          checked={value === color || (!value && color === 'system')}
          key={i}
        />
      ))}
    </div>
  </div>
);

export default ColorScheme;
