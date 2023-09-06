import React from 'react';

import { SettingProps } from '@app/Header/HeaderSettings.tsx';

import cn from '@utils/classnames';

import styles from './Settings.module.css';

const Settings: React.FC<{
  className?: string;
  elements: Record<string, (props: SettingProps) => React.ReactElement>;
  values: Record<string, string>;
  setValues: (value: Record<string, string>) => void;
}> = ({ className = '', elements, values, setValues }) => (
  <ul className={cn(className, styles.root)}>
    {Object.entries(elements).map(([key, Component]) => (
      <li className={styles.element}>
        <Component
          // @ts-ignore
          value={values[key] || null}
          setValue={(value) => setValues({ ...values, [key]: value })}
          settingsKey={key}
        />
      </li>
    ))}
  </ul>
);

export default Settings;
