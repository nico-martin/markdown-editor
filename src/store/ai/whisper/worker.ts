import {
  AutomaticSpeechRecognitionPipeline,
  env,
  pipeline,
} from '@xenova/transformers';

env.allowLocalModels = false;

const showLog = true;
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
  output: string;
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
      return this.pipeline;
    } else if (this.pipeline) {
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
    return this.pipeline;
  }
}

self.addEventListener('message', async (event) => {
  const instance = PipelineInstance.getInstance();
  log('event.data.text', event.data.text);

  const transcriber = await instance.loadPipeline(
    event.data.model,
    event.data.quantized,
    (x: PipelineEvent) => {
      log(x);
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
});
