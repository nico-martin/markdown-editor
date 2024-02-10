import React from 'react';

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
  //const [progressItems, setProgressItems] = React.useState([]);
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

  const dispatchTranslationEvent = (output: string, done: boolean = false) => {
    const event = new CustomEvent(translationEventKey, {
      detail: { output, done },
    });
    document.dispatchEvent(event);
  };

  // Inputs and outputs

  const worker = React.useRef(null);

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          //setProgressItems((prev) => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          /*setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );*/
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          /*setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file)
          );*/
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          dispatchTranslationEvent(e.data.output, false);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setBusy(false);
          Boolean(e.data.output) &&
            dispatchTranslationEvent(e.data.output[0].translation_text, true);
          dispatchWorkerEvent(TRANSLATIONS_WORKER_STATUS.COMPLETE);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const initialize = (model: TranslateModel): Promise<boolean> =>
    new Promise((resolve) => {
      setBusy(true);
      dispatchWorkerEvent(TRANSLATIONS_WORKER_STATUS.LOADING);
      worker.current.postMessage({
        model: model.path,
      });
      document.addEventListener(
        workerEventKey,
        (e) => {
          const status = (e as CustomEvent<TRANSLATIONS_WORKER_STATUS>).detail;
          if (status === TRANSLATIONS_WORKER_STATUS.COMPLETE) {
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
      dispatchTranslationEvent('');
      worker.current.postMessage({
        model: activeTranslateModel.path,
        text,
        src_lang,
        tgt_lang,
      });
      document.addEventListener(
        translationEventKey,
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
      }}
    >
      {children}
    </context.Provider>
  );
};

export default TranslationsContextProvider;
