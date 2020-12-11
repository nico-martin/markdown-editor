export interface File {
  title: string;
  content: string;
  savedContent: string;
  handle: any;
  saved: boolean;
}

export interface State {
  offline: boolean;
  files: Array<File>;
  activeFileIndex: number;
}

export interface Actions {}
