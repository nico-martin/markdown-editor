import React from 'react';
import cn from '@utils/classnames';
import SVG from './SVG';

import './Icon.css';

const Icon = ({
  icon,
  className = '',
  spinning = false,
  rotate = false,
  button = false,
  round = false,
  circle = false,
  ...props
}: {
  icon: string;
  className?: string;
  rotate?: 90 | 180 | 270 | false;
  spinning?: boolean;
  button?: boolean;
  round?: boolean;
  circle?: boolean;
  [key: string]: any;
}) => {
  return (
    <SVG
      className={cn(className, 'icon', {
        [`icon--rotate-${rotate}`]: rotate !== false,
        'icon--animation-spin': spinning,
        'icon--button': button,
        'icon--round': round,
        'icon--circle': circle,
      })}
      path={`icon/${icon}.svg`}
      {...props}
    />
  );
};

export default Icon;
