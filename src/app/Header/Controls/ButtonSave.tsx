import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Button } from '@theme';
import React from 'react';

import useMobile from '@app/hooks/useMobile';

import cn from '@utils/classnames';
import { saveFileToSystem } from '@utils/fileAccess';

import { useFileContext } from '@store/FileContext.tsx';

import styles from './ButtonSave.module.css';

const ButtonSave: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { trackEvent } = useMatomo();
  const { isMobile } = useMobile();
  const { activeFile, updateActiveFile } = useFileContext();
  const canSave = React.useMemo(
    () => activeFile.content !== activeFile.savedContent,
    [activeFile.content, activeFile.savedContent]
  );

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 's') {
      e.preventDefault();
      await saveFile();
      return;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, [activeFile.handle, activeFile.content, canSave]);

  const saveFile = async () => {
    if (!canSave) {
      return;
    }
    trackEvent({ category: 'file-action', action: 'save' });
    const file = await saveFileToSystem(activeFile);
    updateActiveFile(file);
  };

  return (
    <Button
      className={cn(className, styles.root)}
      icon="save"
      onClick={saveFile}
      color={canSave ? 'primary' : 'black'}
      title="ctrl+s"
      round
      layout={canSave ? 'solid' : 'empty'}
      disabled={!canSave}
    >
      {isMobile ? '' : 'Save'}
    </Button>
  );
};

export default ButtonSave;
