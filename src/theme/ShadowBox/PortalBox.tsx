import React from 'react';
import ReactDOM from 'react-dom';
import { ShadowBox } from '../index';

const Portal = ({ children }: { children?: React.JSX.Element }) =>
  ReactDOM.createPortal(children, document.querySelector('#shadowbox'));

export default ({
  children,
  close,
  size,
  ...props
}: {
  children?: React.JSX.Element | React.JSX.Element[] | string;
  close: Function;
  size?: 'large' | 'small';
  [key: string]: any;
}) => (
  <Portal>
    <ShadowBox children={children} close={close} size={size} {...props} />
  </Portal>
);
