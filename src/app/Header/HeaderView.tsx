import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';
import { settingsDB } from '@store/idb';
import useMobile from '@app/hooks/useMobile';

import { featureCheck } from '@utils/helpers';
import { EDITOR_VIEWS } from '@utils/constants';
import { Icon } from '@theme';

import './HeaderView.css';

const HeaderView = ({ className = '' }: { className?: string }) => {
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

  return featureCheck ? (
    <nav className={cn(className, 'header-view')}>
      {Object.values(EDITOR_VIEWS).map(view => (
        <button
          className={cn('header-view__button', {
            'header-view__button--active': view === editorView,
          })}
          onClick={() => setEditorView(view)}
        >
          <Icon className={cn('header-view__icon')} icon={`mdi/view-${view}`} />
        </button>
      ))}
    </nav>
  ) : null;
};

export default HeaderView;
