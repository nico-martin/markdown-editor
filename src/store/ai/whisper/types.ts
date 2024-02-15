export interface WorkerRequest {
  model: string;
  quantized: boolean;
  language?: string;
  multilingual?: boolean;
  audio?: Float32Array;
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

export type TranscribeUpdateEvent = {
  status: 'update';
  data: [string, { chunks: Array<{ text: string; timestamp: Array<number> }> }];
  id: string;
};

export type TranscribeErrorEvent = {
  status: 'error';
  data: any;
  id: string;
};

export type CompleteEvent = {
  status: 'complete';
  data?: { text: string };
  id: string;
};

export type InitPipelineEvent =
  | InitPipelineInitiateEvent
  | InitPipelineReadyEvent
  | InitPipelineDoneEvent
  | InitPipelineProgressEvent;

export type WorkerResponse =
  | InitPipelineEvent
  | TranscribeUpdateEvent
  | TranscribeErrorEvent
  | CompleteEvent;
