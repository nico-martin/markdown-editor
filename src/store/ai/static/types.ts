export interface TranslateModel {
  name: string;
  path: string;
  size: number;
  inputLanguages: Record<string, string>;
  outputLanguages: Record<string, string>;
}

export interface SpeechRecognitionModel {
  key: string;
  name: string;
  path: string;
  quantized: boolean;
  size: number;
}

export enum TRANSLATIONS_WORKER_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  COMPLETE = 'complete',
}

export enum WHISPER_WORKER_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  COMPLETE = 'complete',
}
