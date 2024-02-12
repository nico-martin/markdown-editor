import React from 'react';

import cn from '@utils/classnames';

import { IconType } from '../SVG/icons.ts';
import { Icon, Loader } from '../index';
import styles from './Button.module.css';

const Button = React.forwardRef<
  HTMLButtonElement,
  {
    children?: React.JSX.Element | React.JSX.Element[] | string;
    className?: string;
    classNameIcon?: string;
    onClick?: () => void;
    layout?: 'solid' | 'empty' | 'outline';
    round?: boolean;
    icon?: IconType;
    iconRight?: boolean;
    iconCircle?: boolean;
    loading?: boolean;
    disabled?: boolean;
    color?: 'black' | 'primary';
    onlyIconMobile?: boolean;
    progress?: number;
    noPadding?: boolean;
    size?: 'small' | 'medium';
    [key: string]: any;
  }
>(
  (
    {
      children = '',
      className = '',
      classNameIcon = '',
      onClick = () => {},
      layout = 'solid',
      round = false,
      icon = null,
      iconRight = false,
      iconCircle = false,
      loading = false,
      progress = null,
      disabled = false,
      color = 'black',
      onlyIconMobile = false,
      noPadding = false,
      size = 'medium',
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        disabled={disabled || loading || progress !== null}
        className={cn(className, styles.button, `button--color-${color}`, {
          [styles.buttonLayoutEmpty]: layout === 'empty',
          [styles.buttonLayoutOutline]: layout === 'outline',
          [styles.buttonIsRound]: round,
          [styles.buttonIsDisabled]: disabled,
          [styles.buttonIsLoading]: loading || progress !== null,
          [styles.buttonHasNoText]: children === '',
          [styles.buttonColorPrimary]: color === 'primary',
          [styles.buttonOnlyIconMobile]: onlyIconMobile,
          [styles.buttonHasIcon]: Boolean(icon),
          [styles.buttonIconRight]: Boolean(iconRight),
          [styles.buttonNoPadding]: noPadding,
          [styles.buttonSizeSmall]: size === 'small',
        })}
        onClick={() => onClick()}
        ref={ref}
      >
        <div className={styles.bkg} />
        <div className={styles.loader}>
          <Loader className={styles.loaderIcon} />
          {progress && <span className={styles.progress}>{progress}%</span>}
        </div>

        {Boolean(icon) && !iconRight && (
          <Icon
            className={cn(styles.icon, styles.iconLeft, classNameIcon)}
            icon={icon}
            circle={iconCircle}
          />
        )}
        <span className={styles.content}>{children}</span>
        {Boolean(icon) && iconRight && (
          <Icon
            className={cn(styles.icon, styles.iconRight, classNameIcon)}
            icon={icon}
            circle={iconCircle}
          />
        )}
      </button>
    );
  }
);

export default Button;
