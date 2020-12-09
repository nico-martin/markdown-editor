import React from 'react';
import MarkdownView from 'react-showdown';

import cn from '@utils/classnames';

import './EditorHtml.css';

const EditorHtml = ({
  className = '',
  content,
  ...props
}: {
  className?: string;
  content: string;
  [k: string]: any;
}) => (
  <div className={cn(className, 'editor-html')} {...props}>
    <MarkdownView markdown={content} options={{ tables: true, emoji: true }} />
  </div>
);

export default EditorHtml;
