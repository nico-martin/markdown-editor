import React from 'react';
import { useStoreState, useActions } from 'unistore-hooks';

import { actions } from '@store/index';
import { State } from '@store/types';
import cn from '@utils/classnames';

import './EditorMarkup.css';

const EditorMarkup = ({
  className = '',
  ...props
}: {
  className?: string;
  [k: string]: any;
}) => {
  const { setActiveFile } = useActions(actions);
  const { activeFile } = useStoreState<State>(['activeFile']);

  return (
    <div className={cn(className, 'editor-markup')} {...props}>
      <textarea
        className="editor-markup__textarea"
        onKeyUp={e =>
          setActiveFile({ content: (e.target as HTMLTextAreaElement).value })
        }
        placeholder="start typing.."
      >
        {activeFile.content}
      </textarea>
    </div>
  );
};

export default EditorMarkup;
