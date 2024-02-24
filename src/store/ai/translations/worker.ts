// based on https://github.com/xenova/transformers.js/blob/main/examples/react-translator/src/worker.js
import { TranslationPipeline, env, pipeline } from '@xenova/transformers';

import { InitPipelineEvent, WorkerRequest, WorkerResponse } from './types.ts';

env.allowLocalModels = false;

const showLog = false;
const log = (...e: Array<any>) =>
  showLog ? console.log('[WORKER]', ...e) : null;

const postMessage = (e: WorkerResponse) => self.postMessage(e);
const onMessage = (cb: (e: MessageEvent<WorkerRequest>) => void) =>
  self.addEventListener('message', cb);

class PipelineInstance {
  private model = '';
  private task = '';
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
    progress_callback: (e: any) => void,
    task: string = 'translation'
  ) {
    log('this.pipeline', {
      pipeline: this.pipeline,
      model,
      thisModel: this.model,
    });
    if (this.pipeline && model === this.model && task === this.task) {
      return this.pipeline;
    } else if (this.pipeline) {
      await this.pipeline.dispose();
    }
    this.model = model;
    this.task = task;
    // @ts-ignore
    this.pipeline = await pipeline<'translation'>(task, this.model, {
      progress_callback,
    });
    return this.pipeline;
  }
}

onMessage(async (event) => {
  const instance = PipelineInstance.getInstance();
  log('event.data', event.data);
  const translator = await instance.loadPipeline(
    event.data.model,
    (x: InitPipelineEvent) => {
      postMessage({ ...x, id: event.data.id });
    },
    event.data.model === 'Xenova/t5-small'
      ? `translation_${event.data.src_lang}_to_${event.data.tgt_lang}`
      : 'translation'
  );

  if (!event.data.text) {
    postMessage({
      status: 'complete',
      id: event.data.id,
    });
    return;
  }

  const output = await translator(event.data.text, {
    // @ts-ignore
    tgt_lang: event.data.tgt_lang,
    src_lang: event.data.src_lang,
    max_new_tokens: 10000,
    callback_function: (x: any) => {
      log('translation cb', x);
      postMessage({
        status: 'update',
        output: translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
        id: event.data.id,
      });
    },
  });

  log('translation complete', output);

  postMessage({
    status: 'complete',
    output:
      // @ts-ignore
      typeof output === 'string' ? output : output[0]?.translation_text || '',
    id: event.data.id,
  });
});
