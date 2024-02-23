import {
  AutomaticSpeechRecognitionPipeline,
  env,
  pipeline,
} from '@xenova/transformers';
import { ChunkCallbackItem } from '@xenova/transformers/types/pipelines';

import { InitPipelineEvent, WorkerRequest, WorkerResponse } from './types.ts';

env.allowLocalModels = false;

const showLog = false;
const log = (...e: Array<any>) =>
  showLog ? console.log('[WORKER]', ...e) : null;

const postMessage = (e: WorkerResponse) => self.postMessage(e);
const onMessage = (cb: (e: MessageEvent<WorkerRequest>) => void) =>
  self.addEventListener('message', cb);

class PipelineInstance {
  private model: string = null;
  private quantized: boolean = null;
  private static instance: PipelineInstance = null;
  public pipeline: AutomaticSpeechRecognitionPipeline = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PipelineInstance();
    }
    return this.instance;
  }

  public async loadPipeline(
    model: string,
    quantized: boolean,
    progress_callback: (e: any) => void
  ) {
    log('this.pipeline', {
      pipeline: this.pipeline,
      model,
      thisModel: this.model,
    });
    if (this.pipeline && model === this.model && quantized === this.quantized) {
      log('pipeline already ready');
      return this.pipeline;
    } else if (this.pipeline) {
      log('pipeline dispose');
      await this.pipeline.dispose();
    }
    this.model = model;
    this.quantized = quantized;
    this.pipeline = await pipeline<'automatic-speech-recognition'>(
      'automatic-speech-recognition',
      this.model,
      {
        quantized: this.quantized,
        progress_callback,
        revision: this.model.includes('/whisper-medium')
          ? 'no_attentions'
          : 'main',
      }
    );
    log('new pipeline', this.pipeline);
    return this.pipeline;
  }
}

onMessage(async (event) => {
  const instance = PipelineInstance.getInstance();

  const transcriber = await instance.loadPipeline(
    event.data.model,
    event.data.quantized,
    (x: InitPipelineEvent) => {
      postMessage({ ...x, id: event.data.id });
    }
  );

  if (!event.data.audio) {
    postMessage({
      status: 'complete',
      id: event.data.id,
    });
    return;
  }

  const isDistilWhisper = event.data.model.startsWith('distil-whisper/');

  const time_precision =
    transcriber.processor.feature_extractor.config.chunk_length /
    transcriber.model.config.max_source_positions;

  const chunks_to_process: Array<{ tokens: Array<any>; finalised: boolean }> = [
    {
      tokens: [],
      finalised: false,
    },
  ];

  const chunk_callback = (chunk: ChunkCallbackItem) => {
    log('chunk_callback', chunk);

    const last = chunks_to_process[chunks_to_process.length - 1];

    Object.assign(last, chunk);
    last.finalised = true;

    if (!chunk.is_last) {
      chunks_to_process.push({
        tokens: [],
        finalised: false,
      });
    }
  };

  function callback_function(item: any) {
    log('callback_function', item);
    const last = chunks_to_process[chunks_to_process.length - 1];
    last.tokens = [...item[0].output_token_ids];
    // @ts-ignore
    const data = transcriber.tokenizer._decode_asr(chunks_to_process, {
      time_precision: time_precision,
      return_timestamps: true,
      force_full_sequences: false,
    });
    log('callback_function data', data);

    postMessage({
      status: 'update',
      data: data,
      id: event.data.id,
    });
  }

  const output = await transcriber(event.data.audio, {
    top_k: 0,
    do_sample: false,
    chunk_length_s: isDistilWhisper ? 20 : 30,
    stride_length_s: isDistilWhisper ? 3 : 5,
    language: event.data.language,
    task: 'transcribe',
    return_timestamps: true,
    force_full_sequences: false,

    // @ts-ignore
    callback_function,
    chunk_callback,
  }).catch((error) => {
    postMessage({
      status: 'error',
      data: error,
      id: event.data.id,
    });
    return null;
  });

  postMessage({
    status: 'complete',
    data: output,
    id: event.data.id,
  });
});
