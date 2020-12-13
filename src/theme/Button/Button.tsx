import React from 'react';

import cn from '@utils/classnames';
import { Loader, Icon } from '../index';

import './Button.css';

const Button = ({
  children = '',
  className = '',
  onClick = () => {},
  layout = 'solid',
  round = false,
  icon = '',
  iconRight = false,
  iconCircle = false,
  size = 'medium',
  loading = false,
  disabled = false,
  color = 'black',
  zeroPadding = false,
  fontWeight = 'bold',
  ...props
}: {
  children?: React.JSX.Element | React.JSX.Element[] | string;
  className?: string;
  onClick?: Function;
  layout?: 'solid' | 'ghost' | 'empty';
  round?: boolean;
  icon?: string;
  iconRight?: boolean;
  iconCircle?: boolean;
  size?: 'medium' | 'small' | 'large';
  loading?: boolean;
  disabled?: boolean;
  color?: 'black' | 'primary';
  zeroPadding?: boolean;
  fontWeight?: 'normal' | 'bold';
  [key: string]: any;
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        className,
        'button',
        `button--type-${layout}`,
        `button--size-${size}`,
        `button--color-${color}`,
        `button--fontWeight-${fontWeight}`,
        {
          'button--round': round,
          'button--loading': loading,
          'button--disabled': disabled,
          'button--zeropadding': zeroPadding,
          'button--notext': children === '',
        }
      )}
      onClick={() => onClick()}
    >
      <div className="button__bkg" />
      <Loader className="button__loader" />
      {icon !== '' && !iconRight && (
        <Icon
          className="button__icon button__icon--left"
          icon={icon}
          circle={iconCircle}
        />
      )}
      <span className="button__content">{children}</span>
      {icon !== '' && iconRight && (
        <Icon
          className="button__icon button__icon--right"
          icon={icon}
          circle={iconCircle}
        />
      )}
    </button>
  );
};

export default Button;
