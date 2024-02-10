import React from 'react';

import cn from '@utils/classnames.tsx';

import { CloseButton } from '../index';
import styles from './ShadowBox.module.css';
import { SHADOW_BOX_SIZES } from './constants.ts';

const ShadowBox: React.FC<{
  title?: string;
  subtitle?: string;
  children?: React.ReactElement | Array<React.ReactElement | string> | string;
  size?: SHADOW_BOX_SIZES;
  className?: string;
  classNameBox?: string;
  show: boolean;
  setShow: (show: boolean) => void;
  preventClose?: boolean;
}> = ({
  title,
  subtitle = '',
  children,
  size = SHADOW_BOX_SIZES.LARGE,
  className = '',
  classNameBox = '',
  show,
  setShow,
  preventClose = false,
}) => {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (show) {
      setMounted(true);
      window.setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      window.setTimeout(() => setMounted(false), 150);
    }
  }, [show]);

  const close = () => (preventClose ? {} : setShow(false));

  return mounted ? (
    <div
      className={cn(className, styles.root, {
        [styles.isSmall]: size === SHADOW_BOX_SIZES.SMALL,
        [styles.isMedium]: size === SHADOW_BOX_SIZES.MEDIUM,
      })}
      data-visible={visible}
    >
      <div
        className={cn(styles.shadow, {
          [styles.shadowNoPointer]: preventClose,
        })}
        onClick={close}
      />
      <article className={cn(styles.box, classNameBox)}>
        <header className={cn(styles.header)}>
          {title !== null && (
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>{title}</h2>
              {subtitle !== '' && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}{' '}
          {!preventClose && (
            <CloseButton className={styles.close} onClick={close} />
          )}
        </header>
        <div className={styles.content}>{children}</div>
      </article>
    </div>
  ) : null;
};

export default ShadowBox;
