import { Button } from '@theme';
import React from 'react';

import AiSettingsModal from '@app/AiMenu/aiSettings/AiSettingsModal.tsx';
import useMobile from '@app/hooks/useMobile.tsx';

import cn from '@utils/classnames.tsx';

import styles from './HeaderAiSettings.module.css';

const HeaderAiSettings: React.FC<{ className?: string }> = ({ className }) => {
  const { isMobile } = useMobile();
  const [modal, setModal] = React.useState<boolean>(false);
  return (
    <div className={cn(className)}>
      <AiSettingsModal show={modal} setShow={setModal} />
      <Button
        className={cn(styles.button)}
        classNameIcon={cn(styles.buttonIcon)}
        icon="creation"
        onClick={() => setModal(true)}
        color="black"
        title="AI Settings"
        round
        layout={isMobile ? 'empty' : 'empty'}
        onlyIconMobile
      >
        {isMobile ? '' : 'AI Settings'}
      </Button>
    </div>
  );
};

export default HeaderAiSettings;
