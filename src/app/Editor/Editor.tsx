import React from 'react';

import cn from '@utils/classnames';

import EditorMarkup from './EditorMarkup';
import EditorHtml from './EditorHtml';

import './Editor.css';

const Editor = ({ className = '' }: { className?: string }) => {
  const [content, setContent] = React.useState<string>('');
  const [markupWidth, setMarkupWidth] = React.useState<number>(50);
  const htmlWidth = React.useMemo(() => 100 - markupWidth, [markupWidth]);

  return (
    <main className={cn(className, 'editor')}>
      <EditorMarkup
        className="editor__markup"
        content={content}
        setContent={setContent}
        style={{ width: `${markupWidth}%` }}
      />
      <EditorHtml
        className="editor__html"
        content={content}
        style={{ width: `${htmlWidth}%` }}
      />
    </main>
  );
};

export default Editor;
