import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { settingsDB } from '@store/idb';
import useMobile from '@app/hooks/useMobile';

import { EDITOR_VIEWS } from '@utils/constants';
import { Icon } from '@theme';

import './HeaderView.css';

const HeaderView = ({ className = '' }: { className?: string }) => {
  const { trackEvent } = useMatomo();
  const { setEditorView } = useActions(actions);
  const { editorView } = useStoreState<State>(['editorView']);
  const [firstRender, setFirstRender] = React.useState<boolean>(true);
  const { isMobile } = useMobile();

  React.useEffect(() => {
    isMobile &&
      editorView === EDITOR_VIEWS.SPLIT &&
      setEditorView(EDITOR_VIEWS.HTML);
  }, [isMobile, editorView]);

  React.useEffect(() => {
    if (firstRender) {
      settingsDB.get('editorView').then(view => view && setEditorView(view));
      setFirstRender(false);
    }
    settingsDB.set('editorView', editorView);
  }, [editorView]);

  const setTrackedEditorView = view => {
    trackEvent({ category: 'editor-view', action: 'set', name: view });
    setEditorView(view);
  };

  return (
    <nav className={cn(className, 'header-view')}>
      {Object.values(EDITOR_VIEWS).map(view => (
        <button
          className={cn('header-view__button', {
            'header-view__button--active': view === editorView,
          })}
          onClick={() => setTrackedEditorView(view)}
        >
          <Icon className={cn('header-view__icon')} icon={`mdi/view-${view}`} />
        </button>
      ))}
    </nav>
  );
};

export default HeaderView;
