import React from 'react';

import cn from '@utils/classnames';

import styles from './Notification.module.css';

export enum NOTIFICATION_TYPE {
  MESSAGE = 'MESSAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const Notification: React.FC<{
  className?: string;
  type?: NOTIFICATION_TYPE;
  children: any;
}> = ({ className = '', type = NOTIFICATION_TYPE.MESSAGE, children }) => (
  <div
    className={cn(className, styles.root, {
      [styles.typeError]: type === NOTIFICATION_TYPE.ERROR,
      [styles.typeSuccess]: type === NOTIFICATION_TYPE.SUCCESS,
    })}
  >
    <p className={styles.text}>{children}</p>
  </div>
);

export default Notification;
