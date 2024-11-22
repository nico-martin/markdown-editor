import Model from '../llm/models/Model';

export interface TranslateModel {
  name: string;
  path: string;
  cardLink: string;
  size: number;
  inputLanguages: Record<string, string>;
  outputLanguages: Record<string, string>;
}

export type LlmModel = Model;

export interface SpeechRecognitionModel {
  key: string;
  name: string;
  path: string;
  cardLink: string;
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
