import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
import React from 'react';

import cn from '@utils/classnames.tsx';

import styles from './QuillEditor.module.css';

const QuillEditor: React.FC<{
  className?: string;
  setup?: (editor: Quill) => void;
}> = ({ className = '', setup = null }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            [
              {
                header: [1, 2, 3, false],
              },
            ],
            ['bold', 'italic', 'underline', 'strike', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ],
        },
        theme: 'bubble',
      });

      setup && setup(quill);
    }
  }, [editorRef.current]);

  return <div ref={editorRef} className={cn(className, styles.root)} />;
};

export default QuillEditor;
