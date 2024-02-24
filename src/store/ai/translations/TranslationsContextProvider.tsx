import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  CompleteEvent,
  InitPipelineDoneEvent,
  InitPipelineProgressEvent,
  TranslateUpdateEvent,
  WorkerRequest,
  WorkerResponse,
} from '@store/ai/translations/types.ts';

import {
  TRANSLATIONS_MODEL_WORKER_EVENT,
  TRANSLATIONS_TRANSLATION_WORKER_EVENT,
} from '../static/constants.ts';
import { TranslateModel } from '../static/types.ts';
import { TRANSLATIONS_WORKER_STATUS } from '../static/types.ts';
import useAiSettings from '../useAiSettings.ts';
import { context } from './translationsContext';

let instance = 0;

const TranslationsContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [ready, setReady] = React.useState<boolean>(null);
  const [busy, setBusy] = React.useState(false);
  const { activeTranslateModel } = useAiSettings();
  const [progressItems, setProgressItems] = React.useState<
    Array<{
      file: string;
      progress: number;
    }>
  >([]);
  const workerEventKey = React.useMemo(() => {
    instance++;
    return `${TRANSLATIONS_MODEL_WORKER_EVENT}-${instance}`;
  }, []);
  const translationEventKey = React.useMemo(() => {
    instance++;
    return `${TRANSLATIONS_TRANSLATION_WORKER_EVENT}-${instance}`;
  }, []);

  const dispatchWorkerEvent = (state: TRANSLATIONS_WORKER_STATUS) => {
    const event = new CustomEvent(workerEventKey, {
      detail: state,
    });
    document.dispatchEvent(event);
  };

  const dispatchTranslationEvent = (
    output: string,
    id: string,
    done: boolean = false
  ) => {
    const event = new CustomEvent(translationEventKeyRequestKey(id), {
      detail: { output, done },
    });
    document.dispatchEvent(event);
  };

  const worker = React.useRef(null);

  const postWorkerMessage = (payload: WorkerRequest) =>
    worker.current.postMessage(payload);

  const translationEventKeyRequestKey = (requestId: string) =>
    `${translationEventKey}-${requestId}`;

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
    }

    const onMessageReceived = (e: MessageEvent<WorkerResponse>) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          setProgressItems([]);
          break;
        case 'progress': {
          const data = e.data as InitPipelineProgressEvent;
          setProgressItems((prev) =>
            prev.findIndex((item) => item.file === data.file) === -1
              ? [...prev, { file: data.file, progress: data.progress }]
              : prev.map((item) =>
                  item.file === data.file
                    ? {
                        ...item,
                        progress: data.progress,
                      }
                    : { file: item.file, progress: item.progress }
                )
          );
          break;
        }
        case 'done': {
          const data = e.data as InitPipelineDoneEvent;
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== data.file)
          );
          break;
        }
        case 'ready': {
          setReady(true);
          break;
        }
        case 'update': {
          const data = e.data as TranslateUpdateEvent;
          dispatchTranslationEvent(data.output, data.id, false);
          break;
        }
        case 'complete': {
          const data = e.data as CompleteEvent;
          setBusy(false);
          Boolean(data.output) &&
            dispatchTranslationEvent(data.output, data.id, true);
          dispatchWorkerEvent(TRANSLATIONS_WORKER_STATUS.COMPLETE);
          break;
        }
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const initialize = (model: TranslateModel): Promise<boolean> =>
    new Promise((resolve) => {
      setBusy(true);
      dispatchWorkerEvent(TRANSLATIONS_WORKER_STATUS.LOADING);
      const requestId = uuidv4();
      postWorkerMessage({
        model: model.path,
        id: requestId,
      });
      document.addEventListener(
        workerEventKey,
        (e) => {
          const status = (e as CustomEvent<TRANSLATIONS_WORKER_STATUS>).detail;
          if (status === TRANSLATIONS_WORKER_STATUS.COMPLETE) {
            setBusy(false);
            resolve(true);
          }
        },
        false
      );
    });

  const translate = (
    src_lang: string,
    tgt_lang: string,
    text: string,
    cb: (output: string) => void = null
  ): Promise<string> =>
    new Promise((resolve) => {
      setBusy(true);
      dispatchWorkerEvent(TRANSLATIONS_WORKER_STATUS.LOADING);
      const requestId = uuidv4();
      dispatchTranslationEvent('', requestId);
      postWorkerMessage({
        model: activeTranslateModel.path,
        text,
        src_lang,
        tgt_lang,
        id: requestId,
      });
      document.addEventListener(
        translationEventKeyRequestKey(requestId),
        (e) => {
          const { output, done } = (
            e as CustomEvent<{
              output: string;
              done: boolean;
            }>
          ).detail;
          cb && cb(output);
          if (done) {
            resolve(output);
          }
        },
        false
      );
    });

  return (
    <context.Provider
      value={{
        activeModel: activeTranslateModel,
        initialize,
        translate,
        ready,
        busy,
        progressItems,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default TranslationsContextProvider;
