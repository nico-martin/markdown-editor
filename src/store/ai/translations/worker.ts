import { TranslationPipeline, pipeline } from '@xenova/transformers';

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

// based on https://github.com/xenova/transformers.js/blob/main/examples/react-translator/src/worker.js
class PipelineInstance {
  private model = '';
  private static instance: PipelineInstance = null;
  public pipeline: TranslationPipeline = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PipelineInstance();
    }
    return this.instance;
  }

  public async loadPipeline(
    model: string,
    progress_callback: (e: any) => void
  ) {
    log('this.pipeline', {
      pipeline: this.pipeline,
      model,
      thisModel: this.model,
    });
    if (this.pipeline && model === this.model) {
      return this.pipeline;
    }
    this.model = model;
    this.pipeline = await pipeline<'translation'>('translation', this.model, {
      progress_callback,
    });
    return this.pipeline;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const instance = PipelineInstance.getInstance();
  log('event.data.text', event.data.text);
  const translator = await instance.loadPipeline(
    event.data.model,
    (x: PipelineEvent) => self.postMessage(x)
  );

  if (!event.data.text) {
    // if there is no text, we don't need to translate and we're done
    self.postMessage({
      status: 'complete',
    });
    return;
  }

  // Actually perform the translation
  const output = await translator(event.data.text, {
    // @ts-ignore
    tgt_lang: event.data.tgt_lang,
    //src_lang: event.data.src_lang,
    callback_function: (x: any) => {
      log('translation cb', x);
      self.postMessage({
        status: 'update',
        output: translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  });

  log('translation complete', output);

  // Send the output back to the main thread
  self.postMessage({
    status: 'complete',
    output: output,
  });
});
