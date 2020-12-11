import React from 'react';

import cn from '@utils/classnames';
import { featureCheck } from '@utils/helpers';
import { Loader } from '@theme';

import EditorMarkup from './EditorMarkup';
import EditorHtml from './EditorHtml';

import './Editor.css';

const Editor = ({
  className = '',
  init,
}: {
  className?: string;
  init: boolean;
}) => {
  const [markupWidth, setMarkupWidth] = React.useState<number>(50);
  const htmlWidth = React.useMemo(() => 100 - markupWidth, [markupWidth]);

  return (
    <main className={cn(className, 'editor')}>
      {!init ? (
        <Loader className="editor__loader" />
      ) : featureCheck ? (
        <React.Fragment>
          <EditorMarkup
            className="editor__markup"
            style={{ width: `${markupWidth}%` }}
          />
          <EditorHtml
            className="editor__html"
            style={{ width: `${htmlWidth}%` }}
          />
        </React.Fragment>
      ) : (
        <div className="editor__not-supported">
          <p>
            Your Browser does not seem to support the{' '}
            <a target="_blank" href="https://caniuse.com/native-filesystem-api">
              Native File System API
            </a>
            . This project is about demonstrating this API. Please try it with
            another browser.
          </p>
        </div>
      )}
    </main>
  );
};

export default Editor;
