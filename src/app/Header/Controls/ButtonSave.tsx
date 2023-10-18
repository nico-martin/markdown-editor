import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Button, PortalBox, SHADOW_BOX_SIZES } from '@theme';
import React from 'react';

import useMobile from '@app/hooks/useMobile';

import cn from '@utils/classnames';
import { BROWSER_SUPPORT } from '@utils/constants.ts';
import { saveFileToSystem, stringToFileName } from '@utils/fileAccess';

import { useFileContext } from '@store/FileContext.tsx';

import styles from './ButtonSave.module.css';

const ButtonSave: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { trackEvent } = useMatomo();
  const { isMobile } = useMobile();
  const {
    activeFile,
    updateActiveFile,
    closeFileByIndex,
    activeFileIndex,
    setActiveFileIndex,
  } = useFileContext();
  const [downloadModal, setDownloadModal] = React.useState<boolean>(false);
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
    if (!BROWSER_SUPPORT.fileSystem) {
      setDownloadModal(true);
      return;
    }
    if (!canSave) {
      return;
    }
    trackEvent({ category: 'file-action', action: 'save' });
    const file = await saveFileToSystem(activeFile);
    updateActiveFile(file);
  };

  const downloadFile = async () => {
    const title =
      activeFile.title !== 'untitled'
        ? activeFile.title
        : stringToFileName(window.prompt('Enter a title for the file'));

    const blob = new Blob([activeFile.content], {
      type: 'markdown/plain;charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = title + '.md';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setDownloadModal(false);
  };

  return (
    <div className={cn(className, styles.root)}>
      <PortalBox
        show={downloadModal}
        setShow={setDownloadModal}
        title="Download File"
        size={SHADOW_BOX_SIZES.SMALL}
      >
        <p>
          Your browser does not support the{' '}
          <a target="_blank" href="https://wicg.github.io/file-system-access/">
            File System Access API
          </a>
          .
        </p>
        <p>But you could still download the file through the browser.</p>
        <br />
        <Button round onClick={downloadFile}>
          Download
        </Button>
      </PortalBox>
      {!BROWSER_SUPPORT.fileSystem && activeFileIndex !== 'new' && (
        <Button
          className={cn(styles.clearButton)}
          onClick={() => {
            closeFileByIndex(activeFileIndex);
            setActiveFileIndex('new');
          }}
          round
          layout="empty"
          icon="vacuum"
        >
          clear
        </Button>
      )}
      <Button
        className={cn(styles.saveButton)}
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
    </div>
  );
};

export default ButtonSave;
