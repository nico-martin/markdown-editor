import React from 'react';
import ReactDOM from 'react-dom';

import { ShadowBox } from '../index';
import { SHADOW_BOX_SIZES } from './constants.ts';

const Portal = ({ children }: { children?: React.JSX.Element }) =>
  ReactDOM.createPortal(children, document.querySelector('#shadowbox'));

export default ({
  children,
  show,
  setShow,
  size,
  ...props
}: {
  children?: React.ReactElement | Array<React.ReactElement | string> | string;
  show: boolean;
  setShow: (show: boolean) => void;
  size?: SHADOW_BOX_SIZES;
  [key: string]: any;
}) => (
  <Portal>
    <ShadowBox
      children={children}
      show={show}
      setShow={setShow}
      size={size}
      {...props}
    />
  </Portal>
);
