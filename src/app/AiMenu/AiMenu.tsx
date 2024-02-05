import { Button, PortalBox, SHADOW_BOX_SIZES } from '@theme';
import React from 'react';

import cn from '@utils/classnames.tsx';

import styles from './AiMenu.module.css';

const AiMenu: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [modal, setModal] = React.useState<boolean>(false);
  return (
    <div className={cn(className, styles.root)}>
      <PortalBox
        show={modal}
        setShow={setModal}
        size={SHADOW_BOX_SIZES.MEDIUM}
        title="AI Settings"
      >
        <div className={styles.content}>
          <p>AI Settings</p>
        </div>
      </PortalBox>
      <ul className={cn(styles.list)}>
        <li className={cn(styles.item)}>
          <Button
            onClick={() => setModal(true)}
            className={styles.button}
            layout="empty"
            icon="creation"
            size=""
          />
        </li>
        <li className={cn(styles.item)}>
          <Button className={styles.button} layout="empty" icon="translate" />
        </li>
        <li className={cn(styles.item)}>
          <Button
            className={styles.button}
            layout="empty"
            icon="microphone-outline"
          />
        </li>
        <li className={cn(styles.item)}>
          <Button
            className={styles.button}
            layout="empty"
            icon="comment-text-outline"
          />
        </li>
      </ul>
    </div>
  );
};

export default AiMenu;
