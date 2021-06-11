export interface File {
  title: string;
  content: string;
  savedContent: string;
  handle: any;
  handleLoaded: boolean;
}

export interface State {
  offline: boolean;
  files: Array<File>;
  activeFileIndex: number | 'new';
  editorView: string;
  fontFamilies: Array<string>;
}

export interface Actions {}
