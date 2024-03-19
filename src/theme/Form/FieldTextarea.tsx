import React from 'react';

import cn from '@utils/classnames';

import styles from './FieldInput.module.css';

const FieldTextarea: React.FC<{
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  id: string;
  type?: string;
  autogrow?: boolean;
  [key: string]: any;
  focusOnMount?: boolean;
}> = ({
  className = '',
  value,
  onChange,
  name,
  id,
  autogrow = false,
  focusOnMount = false,
  ...props
}) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const onInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  React.useEffect(() => {
    if (focusOnMount && ref.current) ref.current?.focus();
  }, [ref]);

  React.useEffect(() => {
    if (ref?.current && autogrow) {
      ref.current.setAttribute(
        'style',
        'height:' + ref.current.scrollHeight + 'px;overflow-y:hidden;'
      );
      ref.current.addEventListener('input', onInput, false);
      return () => {
        ref?.current?.removeEventListener('input', onInput, false);
      };
    }
  }, [ref.current]);

  return (
    <textarea
      className={cn(className, styles.root)}
      value={value}
      onChange={(e) => onChange(e)}
      name={name}
      id={id}
      ref={ref}
      {...props}
    />
  );
};

export default FieldTextarea;
