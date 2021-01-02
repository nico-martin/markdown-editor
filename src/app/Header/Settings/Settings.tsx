import React from 'react';

import cn from '@utils/classnames';

import './Settings.css';

const Settings = ({
  className = '',
  elements,
}: {
  className?: string;
  elements: Record<string, any>;
}) => (
  <ul className={cn(className, 'settings')}>
    {Object.values(elements).map(Component => (
      <li className="settings__element">
        <Component />
      </li>
    ))}
  </ul>
);

export default Settings;
