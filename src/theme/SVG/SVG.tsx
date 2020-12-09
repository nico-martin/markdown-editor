import React from 'react';
import cn from '@utils/classnames';

import './SVG.css';

const SVG = ({
  path,
  className = '',
  inline = false,
  ...props
}: {
  path: string;
  className?: string;
  inline?: boolean;
  [key: string]: any;
}) => {
  const [loadedIcon, setLoadedIcon] = React.useState('');

  React.useEffect(() => {
    async function loadIcon() {
      return await import(
        /* webpackMode: "eager" */ `../../assets/static/${path}`
      );
    }
    loadIcon().then(loaded => setLoadedIcon(loaded.default));
  }, [path]);

  return (
    <figure
      className={cn(className, 'svg', {
        'svg--inline': inline,
      })}
      dangerouslySetInnerHTML={{ __html: loadedIcon }}
      {...props}
    />
  );
};

export default SVG;
