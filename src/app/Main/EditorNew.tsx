import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Icon } from '@theme';
import React from 'react';

import cn from '@utils/classnames';
import { BROWSER_SUPPORT } from '@utils/constants.ts';
import { openFileFromSystem } from '@utils/fileAccess';

import { useFileContext } from '@store/FileContext.tsx';

import styles from './EditorNew.module.css';

const EditorNew: React.FC<{
  className?: string;
  style: React.CSSProperties;
}> = ({ className = '', style }) => {
  const { trackEvent } = useMatomo();
  const { createNewFile } = useFileContext();

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, []);

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
      e.preventDefault();
      await openFile();
      return;
    } else if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'i') {
      e.preventDefault();
      newFile();
      return;
    }
  };

  const openFile = async () => {
    if (!BROWSER_SUPPORT.fileSystem) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md';
      input.onchange = async (e) => {
        const fileReader = new FileReader();
        const file = (e.target as HTMLInputElement).files[0];

        fileReader.onload = () => {
          createNewFile({
            title: file.name.replace('.md', ''),
            content: fileReader.result as string,
          });
        };

        fileReader.readAsText(file);
      };
      input.click();
      return;
    }
    const file = await openFileFromSystem();
    trackEvent({ category: 'file-action', action: 'open' });
    createNewFile(file);
  };

  const newFile = () => {
    trackEvent({ category: 'file-action', action: 'create-new' });
    createNewFile();
  };

  return (
    <div className={cn(className, styles.root)} style={style}>
      <button className={styles.button} onClick={openFile} title="ctrl+o">
        <Icon icon="open" className={styles.icon} />
        Open .md File
      </button>
      <span className={styles.spacer}>or</span>

      <button className={styles.button} onClick={newFile} title="ctrl+i">
        <Icon icon="new-icon" className={styles.icon} />
        Create .md File
      </button>
    </div>
  );
};

export default EditorNew;
