import React from 'react';
import MarkdownView from 'react-showdown';
import { useStoreState } from 'unistore-hooks';

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
  const { activeFile } = useStoreState<State>(['activeFile']);

  return (
    <div className={cn(className, 'editor-html')} {...props}>
      <MarkdownView
        markdown={activeFile.content}
        options={{ tables: true, emoji: true }}
      />
    </div>
  );
};

export default EditorHtml;
