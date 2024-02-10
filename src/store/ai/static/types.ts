export interface TranslateModel {
  name: string;
  path: string;
  size: number;
  inputLanguages: Record<string, string>;
  outputLanguages: Record<string, string>;
}

export enum TRANSLATIONS_WORKER_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  COMPLETE = 'complete',
}
