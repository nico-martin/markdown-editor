export interface WorkerRequest {
  model: string;
  text?: string;
  src_lang?: string;
  tgt_lang?: string;
  id: string;
}

export type InitPipelineProgressEvent = {
  file: string;
  loaded: number;
  name: string;
  progress: number;
  status: 'progress';
  total: number;
  id: string;
};

export type InitPipelineDoneEvent = {
  status: 'done';
  name: string;
  file: string;
  id: string;
};

export type InitPipelineReadyEvent = {
  status: 'ready';
  name: string;
  file: string;
  id: string;
};

export type InitPipelineInitiateEvent = {
  status: 'initiate';
  name: string;
  file: string;
  id: string;
};

export type TranslateUpdateEvent = {
  status: 'update';
  output: string;
  id: string;
};

export type CompleteEvent = {
  status: 'complete';
  output?: string;
  id: string;
};

export type InitPipelineEvent =
  | InitPipelineInitiateEvent
  | InitPipelineReadyEvent
  | InitPipelineDoneEvent
  | InitPipelineProgressEvent;

export type WorkerResponse =
  | InitPipelineEvent
  | TranslateUpdateEvent
  | CompleteEvent;
