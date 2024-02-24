import { AttributeMap } from 'quill-delta';

export interface QuillSelection {
  html: string;
  text: string;
  element: 'p' | 'h1' | 'h2' | 'h3';
}

export const getSelectionHtml = (): QuillSelection => {
  let html: string = '';
  if (typeof window.getSelection === 'undefined') {
    alert('Your browser does not support this feature');
    return;
  }
  const sel: Selection | null = window.getSelection();
  if (sel && sel.rangeCount) {
    const container: HTMLDivElement = document.createElement('div');
    for (let i: number = 0, len: number = sel.rangeCount; i < len; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  }

  html = html.replace(/<[^/>][^>]*>\s*<\/[^>]+>/g, '');

  const element =
    html.startsWith('<p>') && html.endsWith('</p>')
      ? 'p'
      : html.startsWith('<h1>') && html.endsWith('</h1>')
      ? 'h1'
      : html.startsWith('<h2>') && html.endsWith('</h2>')
      ? 'h2'
      : html.startsWith('<h3>') && html.endsWith('</h3>')
      ? 'h3'
      : null;

  return { html, text: html.replace(/<\/?[^>]+(>|$)/g, ''), element };
};

export const getAttributesFromElement = (
  element: 'p' | 'h1' | 'h2' | 'h3'
): AttributeMap => {
  switch (element) {
    case 'p':
      return { block: 'paragraph' };
    case 'h1':
      return { block: 'header', header: 1 };
    case 'h2':
      return { block: 'header', header: 2 };
    case 'h3':
      return { block: 'header', header: 3 };
  }
};
