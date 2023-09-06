import React from 'react';

import cn from '@utils/classnames';

import styles from './SVG.module.css';
import icons, { IconType } from './icons.ts';

const SVG = ({
  icon,
  className = '',
  inline = false,
  ...props
}: {
  icon: IconType;
  className?: string;
  inline?: boolean;
  [key: string]: any;
}) => {
  const LoadedIcon = React.useMemo(
    () => (icon in icons ? icons[icon] : null),
    [icon]
  );

  return LoadedIcon ? (
    <figure
      className={cn(className, styles.root, {
        [styles.in]: inline,
      })}
      {...props}
    >
      <LoadedIcon />
    </figure>
  ) : null;
};

export default SVG;
