import React from 'react';
import { v4 as uuidv4 } from 'uuid';

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

import {
  CompleteEvent,
  InitPipelineDoneEvent,
  InitPipelineProgressEvent,
  TranscribeUpdateEvent,
  WorkerRequest,
  WorkerResponse,
} from './types.ts';
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

  const dispatchTranscribeEvent = (
    text: string,
    id: string,
    done: boolean = false
  ) => {
    const event = new CustomEvent(transcribeEventKeyRequestKey(id), {
      detail: { text, done },
    });
    document.dispatchEvent(event);
  };

  const worker = React.useRef(null);

  const postWorkerMessage = (payload: WorkerRequest) =>
    worker.current.postMessage(payload);

  const transcribeEventKeyRequestKey = (requestId: string) =>
    `${transcribeEventKey}-${requestId}`;

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
    }

    const onMessageReceived = (e: MessageEvent<WorkerResponse>) => {
      switch (e.data.status) {
        case 'initiate': {
          setReady(false);
          setProgressItems([]);
          break;
        }
        case 'progress': {
          const data = e.data as InitPipelineProgressEvent;
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === data.file) {
                return { ...item, progress: data.progress };
              }
              return item;
            })
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
          const data = e.data as TranscribeUpdateEvent;
          dispatchTranscribeEvent(data.data[0], data.id, false);
          break;
        }
        case 'complete': {
          const data = e.data as CompleteEvent;
          setBusy(false);
          Boolean(data.data) &&
            dispatchTranscribeEvent(data.data.text, data.id, true);
          dispatchWorkerEvent(WHISPER_WORKER_STATUS.COMPLETE);
          break;
        }
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
      const requestId = uuidv4();
      postWorkerMessage({
        model: model.path,
        quantized: model.quantized,
        id: requestId,
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
      const requestId = uuidv4();
      dispatchTranscribeEvent('', requestId);
      getAudioFromRecording(blob).then((audioData) => {
        postWorkerMessage({
          model: activeSpeechRecognitionModel.path,
          language,
          multilingual,
          quantized: activeSpeechRecognitionModel.quantized,
          audio: getFloat32FromAudioBuffer(audioData.buffer),
          id: requestId,
        });
        document.addEventListener(
          transcribeEventKeyRequestKey(requestId),
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
