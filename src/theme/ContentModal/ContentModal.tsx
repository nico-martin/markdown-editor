import React from 'react';

import { Loader, ShadowBox } from '../index';
import cn from '@utils/classnames';

import './ContentModal.css';

const ContentModal = ({
  title,
  children,
  onClose,
  className = '',
  loading = false,
  full = true,
}: {
  title: string;
  children?: React.JSX.Element | React.JSX.Element[] | string;
  onClose: Function;
  className?: string;
  loading?: boolean;
  full?: boolean;
}) => (
  <React.Fragment>
    <ShadowBox
      title={title}
      close={onClose}
      className={cn(className, 'content-modal')}
      size={full ? 'large' : 'small'}
    >
      <div className="content-modal__content">
        {loading ? <Loader className="content-modal__loader" /> : children}
      </div>
    </ShadowBox>
  </React.Fragment>
);

export default ContentModal;
