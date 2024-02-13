import React from 'react';

import {
  getAudioFromRecording,
  getFloat32FromAudioBuffer,
} from '@utils/helpers.ts';

import {
  SPEECHRECOGNITION_MODEL_WORKER_EVENT,
  SPEECHRECOGNITION_TRANSCRIBE_WORKER_EVENT,
} from '@store/ai/static/constants.ts';
import {
  SpeechRecognitionModel,
  WHISPER_WORKER_STATUS,
} from '@store/ai/static/types.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import { context } from './whisperContext';

let instance = 0;

const WhisperContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [ready, setReady] = React.useState<boolean>(null);
  const [busy, setBusy] = React.useState(false);
  const { activeSpeechRecognitionModel } = useAiSettings();
  const [progressItems, setProgressItems] = React.useState<
    Array<{
      file: string;
      name: string;
      progress: number;
      status: string;
    }>
  >([]);

  const workerEventKey = React.useMemo(() => {
    instance++;
    return `${SPEECHRECOGNITION_MODEL_WORKER_EVENT}-${instance}`;
  }, []);
  const transcribeEventKey = React.useMemo(() => {
    instance++;
    return `${SPEECHRECOGNITION_TRANSCRIBE_WORKER_EVENT}-${instance}`;
  }, []);

  const dispatchWorkerEvent = (state: WHISPER_WORKER_STATUS) => {
    const event = new CustomEvent(workerEventKey, {
      detail: state,
    });
    document.dispatchEvent(event);
  };

  const dispatchTranscribeEvent = (text: string, done: boolean = false) => {
    const event = new CustomEvent(transcribeEventKey, {
      detail: { text, done },
    });
    document.dispatchEvent(event);
  };

  const worker = React.useRef(null);

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
    }

    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          dispatchTranscribeEvent(e.data.data[0], false);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setBusy(false);
          Boolean(e.data.data) &&
            dispatchTranscribeEvent(e.data.data.text, true);
          dispatchWorkerEvent(WHISPER_WORKER_STATUS.COMPLETE);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const initialize = (model: SpeechRecognitionModel): Promise<boolean> =>
    new Promise((resolve) => {
      setBusy(true);
      dispatchWorkerEvent(WHISPER_WORKER_STATUS.LOADING);
      worker.current.postMessage({
        model: model.path,
        quantized: model.quantized,
      });
      document.addEventListener(
        workerEventKey,
        (e) => {
          const status = (e as CustomEvent<WHISPER_WORKER_STATUS>).detail;
          if (status === WHISPER_WORKER_STATUS.COMPLETE) {
            setBusy(false);
            resolve(true);
          }
        },
        false
      );
    });

  const transcribe = (
    language: string,
    multilingual: boolean,
    blob: Blob,
    cb?: (text: string) => void
  ): Promise<string> =>
    new Promise((resolve) => {
      setBusy(true);
      dispatchWorkerEvent(WHISPER_WORKER_STATUS.LOADING);
      dispatchTranscribeEvent('');
      getAudioFromRecording(blob).then((audioData) => {
        worker.current.postMessage({
          model: activeSpeechRecognitionModel.path,
          language,
          multilingual,
          quantized: activeSpeechRecognitionModel.quantized,
          audio: getFloat32FromAudioBuffer(audioData.buffer),
        });
        document.addEventListener(
          transcribeEventKey,
          (e) => {
            const { text, done } = (
              e as CustomEvent<{
                text: string;
                done: boolean;
              }>
            ).detail;
            cb && cb(text);
            if (done) {
              resolve(text);
            }
          },
          false
        );
      });
    });

  return (
    <context.Provider
      value={{
        ready,
        busy,
        progressItems,
        initialize,
        transcribe,
        activeModel: activeSpeechRecognitionModel,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default WhisperContextProvider;
