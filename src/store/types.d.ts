export interface File {
  title: string;
  content: string;
  savedContent: string;
  handle: any;
}

export interface State {
  offline: boolean;
  files: Array<File>;
  activeFileIndex: number;
  editorView: string;
}

export interface Actions {}
