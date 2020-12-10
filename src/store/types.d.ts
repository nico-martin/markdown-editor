export interface ActiveFile {
  title: string;
  path: string;
  content: string;
}

export interface State {
  offline: boolean;
  recentFiles: Record<string, string>;
  activeFile: ActiveFile;
}

export interface Actions {}
