import React from 'react';
import MarkdownView from 'react-showdown';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';

import './EditorHtml.css';

const EditorHtml = ({
  className = '',
  ...props
}: {
  className?: string;
  [k: string]: any;
}) => {
  const { setActiveFile } = useActions(actions);
  const { activeFile } = useStoreState<State>(['activeFile']);

  React.useEffect(() => {
    window.setTimeout(() => setActiveFile({ saved: false }), 1000);
  }, [activeFile.saved]);

  return (
    <div className={cn(className, 'editor-html')} {...props}>
      <p className="editor-html__saved" aria-hidden={!activeFile.saved}>
        SAVED
      </p>
      <MarkdownView
        markdown={activeFile.content}
        options={{ tables: true, emoji: true }}
      />
    </div>
  );
};

export default EditorHtml;
