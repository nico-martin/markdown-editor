export interface ActiveFile {
  title: string;
  path: string;
  content: string;
  savedContent: string;
  handle: any;
  saved: boolean;
}

export interface State {
  offline: boolean;
  recentFiles: Record<string, string>;
  activeFile: ActiveFile;
}

export interface Actions {}
