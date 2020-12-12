export interface File {
  title: string;
  content: string;
  savedContent: string;
  handle: any;
  saved: boolean;
}

export type EditModes = 'markdown' | 'html';

export interface State {
  offline: boolean;
  files: Array<File>;
  activeFileIndex: number;
  editMode: EditModes;
}

export interface Actions {}
