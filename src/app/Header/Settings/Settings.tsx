import React from 'react';

import cn from '@utils/classnames';

import './Settings.css';

const Settings = ({
  className = '',
  elements,
  values,
  setValues,
}: {
  className?: string;
  elements: Record<string, any>;
  values: Record<string, any>;
  setValues: Function;
}) => (
  <ul className={cn(className, 'settings')}>
    {Object.entries(elements).map(([key, Component]) => (
      <li className="settings__element">
        <Component
          value={values[key] || null}
          setValue={value => setValues({ ...values, [key]: value })}
          settingsKey={key}
        />
      </li>
    ))}
  </ul>
);

export default Settings;
