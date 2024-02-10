import { Button } from '@theme';
import React from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import cn from '@utils/classnames.tsx';

import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './AiMenu.module.css';
import Translate from './Translate.tsx';
import AiSettingsModal from './aiSettings/AiSettingsModal.tsx';

enum AiMenuItems {
  TRANSLATE = 'translate',
  SPEECH_TO_TEXT = 'speechToText',
  PROMPT = 'prompt',
}

const AiMenu: React.FC<{ className?: string; editor: TinyMCEEditor }> = ({
  className = '',
  editor,
}) => {
  const [modal, setModal] = React.useState<boolean>(false);
  const { activeTranslateModel } = useAiSettings();

  const [openMenu, setOpenMenu] = React.useState<AiMenuItems>(null);

  const toggleMenu = (menu: AiMenuItems) =>
    setOpenMenu((open) => (open === menu ? null : menu));

  return (
    <div className={cn(className, styles.root)}>
      <AiSettingsModal show={modal} setShow={setModal} />
      <ul className={cn(styles.list)}>
        <li className={cn(styles.item)}>
          <Button
            onClick={() => setModal(true)}
            className={styles.button}
            layout="empty"
            icon="creation"
            title="AI Settings"
          />
        </li>
        {activeTranslateModel && (
          <li className={cn(styles.item)}>
            <Button
              onClick={() => toggleMenu(AiMenuItems.TRANSLATE)}
              className={styles.button}
              layout="empty"
              icon="translate"
              title="translate"
            />
            {openMenu === AiMenuItems.TRANSLATE && (
              <Translate className={styles.menu} editor={editor} />
            )}
          </li>
        )}
        <li className={cn(styles.item)}>
          <Button
            onClick={() => toggleMenu(AiMenuItems.SPEECH_TO_TEXT)}
            className={styles.button}
            layout="empty"
            icon="microphone-outline"
          />
        </li>
        <li className={cn(styles.item)}>
          <Button
            onClick={() => toggleMenu(AiMenuItems.PROMPT)}
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
