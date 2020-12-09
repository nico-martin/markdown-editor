import React from 'react';

import cn from '@utils/classnames';

import './EditorMarkup.css';

const EditorMarkup = ({
  className = '',
  content,
  setContent,
  ...props
}: {
  className?: string;
  content: string;
  setContent: Function;
  [k: string]: any;
}) => (
  <div className={cn(className, 'editor-markup')} {...props}>
    <textarea
      className="editor-markup__textarea"
      onKeyUp={e => setContent((e.target as HTMLTextAreaElement).value)}
      placeholder="start typing.."
    >
      {content}
    </textarea>
  </div>
);

export default EditorMarkup;
