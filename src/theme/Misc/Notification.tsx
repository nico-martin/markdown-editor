import React from 'react';
import cn from '@utils/classnames';

import './Notification.css';

const Notification = ({
  className = '',
  type = 'message',
  children,
}: {
  className?: string;
  type?: 'message' | 'success' | 'error';
  children: any;
}) => (
  <div className={cn(className, 'notification', `notification--type-${type}`)}>
    <p className="notification__text">{children}</p>
  </div>
);

export default Notification;
