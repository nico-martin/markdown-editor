import {
  AutomaticSpeechRecognitionPipeline,
  env,
  pipeline,
} from '@xenova/transformers';
import { ChunkCallbackItem } from '@xenova/transformers/types/pipelines';

env.allowLocalModels = false;

const showLog = false;
const log = (...e: Array<any>) =>
  showLog ? console.log('[WORKER]', ...e) : null;

type InitPipelineProgressEvent = {
  file: string;
  loaded: number;
  name: string;
  progress: number;
  status: 'progress';
  total: number;
};

type InitPipelineDoneEvent = {
  status: 'done';
  name: string;
  file: string;
};

type InitPipelineReadyEvent = {
  status: 'ready';
  name: string;
  file: string;
};

type InitPipelineInitiateEvent = {
  status: 'initiate';
  name: string;
  file: string;
};

type TranslateUpdateEvent = {
  status: 'update';
  data: any;
};

type CompleteEvent = {
  status: 'complete';
  output?: string;
};

type PipelineEvent =
  | InitPipelineInitiateEvent
  | InitPipelineReadyEvent
  | InitPipelineDoneEvent
  | InitPipelineProgressEvent
  | TranslateUpdateEvent
  | CompleteEvent;

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
    if (this.pipeline && model === this.model) {
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
        // For medium models, we need to load the `no_attentions` revision to avoid running out of memory
        revision: this.model.includes('/whisper-medium')
          ? 'no_attentions'
          : 'main',
      }
    );
    log('new pipeline', this.pipeline);

    return this.pipeline;
  }
}

self.addEventListener('message', async (event) => {
  const instance = PipelineInstance.getInstance();

  const transcriber = await instance.loadPipeline(
    event.data.model,
    event.data.quantized,
    (x: PipelineEvent) => {
      //log(x);
      self.postMessage(x);
    }
  );

  if (!event.data.audio) {
    // if there is no audio, we don't need to translate and we're done
    self.postMessage({
      status: 'complete',
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

    // Overwrite last chunk with new info
    Object.assign(last, chunk);
    last.finalised = true;

    // Create an empty chunk after, if it not the last chunk
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

    // Update tokens of last chunk
    last.tokens = [...item[0].output_token_ids];

    // Merge text chunks
    // TODO optimise so we don't have to decode all chunks every time
    // @ts-ignore
    const data = transcriber.tokenizer._decode_asr(chunks_to_process, {
      time_precision: time_precision,
      return_timestamps: true,
      force_full_sequences: false,
    });
    log('callback_function data', data);

    self.postMessage({
      status: 'update',
      data: data,
    });
  }

  // Actually run transcription
  const output = await transcriber(event.data.audio, {
    // Greedy
    top_k: 0,
    do_sample: false,

    // Sliding window
    chunk_length_s: isDistilWhisper ? 20 : 30,
    stride_length_s: isDistilWhisper ? 3 : 5,

    // Language and task
    language: event.data.language,
    task: 'transcribe',

    // Return timestamps
    return_timestamps: true,
    force_full_sequences: false,

    // Callback functions
    // @ts-ignore
    callback_function, // after each generation step
    chunk_callback, // after each chunk is processed
  }).catch((error) => {
    self.postMessage({
      status: 'error',
      data: error,
    });
    return null;
  });

  self.postMessage({
    status: 'complete',
    data: output,
  });
});
