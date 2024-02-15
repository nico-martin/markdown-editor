export const getSelectionHtml = (): {
  html: string;
  text: string;
  isParagraph: boolean;
} => {
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

  if (html.endsWith('<p></p>')) {
    html = html.slice(0, -7);
  }
  const isParagraph = html.startsWith('<p>') && html.endsWith('</p>');
  if (isParagraph) {
    html = html.slice(3, -4);
  }

  return { html, text: html.replace(/<\/?[^>]+(>|$)/g, ''), isParagraph };
};
