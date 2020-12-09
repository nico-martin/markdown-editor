import React from 'react';
import cn from '@utils/classnames';

import './ShadowBox.css';
import { CloseButton } from '../index';

export default ({
  title,
  children,
  close,
  size = 'large',
  className = '',
}: {
  title?: string;
  children?: React.JSX.Element | React.JSX.Element[] | string;
  close: Function;
  size?: 'large' | 'small';
  className?: string;
}) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [shadow, setShadow] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShow(true);
    return () => {
      setShow(false);
    };
  }, []);

  const onClose = () => {
    setShow(false);
    window.setTimeout(() => {
      close();
    }, 200);
  };

  return (
    <div
      className={cn(className, 'shadowbox', `shadowbox--${size}`)}
      data-visible={show}
    >
      <div className="shadowbox__shadow" onClick={onClose} />
      <article className="shadowbox__box">
        <header
          className={cn('shadowbox__header', {
            'shadowbox__header--shadow': shadow,
          })}
        >
          {title !== null && <h1 className="shadowbox__title">{title}</h1>}{' '}
          <CloseButton className="shadowbox__close" onClick={onClose} />
        </header>
        <div className="shadowbox__content">{children}</div>
      </article>
    </div>
  );
};
