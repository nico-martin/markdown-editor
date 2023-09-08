import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Icon } from '@theme';
import React from 'react';

import useMobile from '@app/hooks/useMobile';

import cn from '@utils/classnames';

import { EDITOR_VIEWS, useEditorView } from '@store/SettingsContext.tsx';

import styles from './HeaderView.module.css';

const HeaderView: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { trackEvent } = useMatomo();
  const [editorView, setEditorView] = useEditorView();
  const { isMobile } = useMobile();

  React.useEffect(() => {
    isMobile &&
      editorView === EDITOR_VIEWS.SPLIT &&
      setEditorView(EDITOR_VIEWS.HTML);
  }, [isMobile, editorView]);

  const setTrackedEditorView = (view: EDITOR_VIEWS) => {
    trackEvent({ category: 'editor-view', action: 'set', name: view });
    setEditorView(view);
  };

  return (
    <nav className={cn(className, styles.root)}>
      {Object.values(EDITOR_VIEWS).map((view) => (
        <button
          className={cn(styles.button, {
            [styles.buttonActive]: view === editorView,
          })}
          onClick={() => setTrackedEditorView(view)}
          key={view}
        >
          <Icon className={cn(styles.icon)} icon={`view-${view}`} />
        </button>
      ))}
    </nav>
  );
};

export default HeaderView;
