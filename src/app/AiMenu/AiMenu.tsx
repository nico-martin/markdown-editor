import { Button, Icon } from '@theme';
import React from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import TextGenerator from '@app/AiMenu/TextGenerator.tsx';
import Transcribe from '@app/AiMenu/Transcribe.tsx';
import useWindowSize from '@app/hooks/useWindowSize.tsx';

import cn from '@utils/classnames.tsx';

import { useFileContext } from '@store/FileContext.tsx';
import { EDITOR_VIEWS, useEditorView } from '@store/SettingsContext.tsx';
import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './AiMenu.module.css';
import Translate from './Translate.tsx';

enum AiMenuItems {
  TRANSLATE = 'translate',
  TRANSCRIPTION = 'transcription',
  PROMPT = 'prompt',
}

const AiMenu: React.FC<{ className?: string; editor: TinyMCEEditor }> = ({
  className = '',
  editor,
}) => {
  const { activeTranslateModel, activeSpeechRecognitionModel } =
    useAiSettings();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [editorView] = useEditorView();
  const [openMenu, setOpenMenu] = React.useState<AiMenuItems>(null);
  const [menuLeft, setMenuLeft] = React.useState<boolean>(false);
  const { activeFileIndex } = useFileContext();
  const toggleMenu = (menu: AiMenuItems) =>
    setOpenMenu((open) => (open === menu ? null : menu));

  React.useEffect(() => {
    window.setTimeout(() => {
      if (!menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      const right = window.innerWidth - rect.left - rect.width;
      setMenuLeft(right < 270);
    }, 50);
  }, [menuRef, width, editorView]);

  return (
    (editorView === EDITOR_VIEWS.SPLIT || editorView === EDITOR_VIEWS.HTML) &&
    activeFileIndex !== 'new' &&
    (activeTranslateModel || activeSpeechRecognitionModel) && (
      <div className={cn(className, styles.root)} ref={menuRef}>
        <ul className={cn(styles.list)}>
          <li className={cn(styles.item)}>
            <Icon icon="creation" className={styles.headingIcon} />
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
                <Translate
                  className={cn(styles.menu, { [styles.menuLeft]: menuLeft })}
                  editor={editor}
                />
              )}
            </li>
          )}
          {activeSpeechRecognitionModel && (
            <li className={cn(styles.item)}>
              <Button
                onClick={() => toggleMenu(AiMenuItems.TRANSCRIPTION)}
                className={styles.button}
                layout="empty"
                icon="microphone-outline"
              />
              {openMenu === AiMenuItems.TRANSCRIPTION && (
                <Transcribe
                  className={cn(styles.menu, { [styles.menuLeft]: menuLeft })}
                  editor={editor}
                />
              )}
            </li>
          )}
          <li className={cn(styles.item)}>
            <Button
              onClick={() => toggleMenu(AiMenuItems.PROMPT)}
              className={styles.button}
              layout="empty"
              icon="comment-text-outline"
            />
            {openMenu === AiMenuItems.PROMPT && (
              <TextGenerator
                className={cn(styles.menu, { [styles.menuLeft]: menuLeft })}
                editor={editor}
              />
            )}
          </li>
        </ul>
      </div>
    )
  );
};

export default AiMenu;
