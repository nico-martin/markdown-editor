import Model from '@utils/webLLM/Model.ts';

export interface TranslateModel {
  name: string;
  path: string;
  size: number;
  inputLanguages: Record<string, string>;
  outputLanguages: Record<string, string>;
}

export type LlmModel = Model;

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

export enum LLM_STATE {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  PROCESSING = 'processing',
  ANSWERING = 'answering',
  DONE = 'done',
}
