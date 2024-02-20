import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { LlmModel } from '../static/types.ts';
import useAiSettings from '../useAiSettings.ts';
import { CallbackData, context } from './llmContext.ts';
import { GenerationState } from './webllm/static/types.ts';
import { dispatchWorkerEvent, onWorkerEvent } from './worker/client.ts';
import { WorkerRequest, WorkerResponse } from './worker/types.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { activeLlmModel } = useAiSettings();
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<boolean>(false);

  const worker = React.useRef(null);

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL('./worker/worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    const onMessageReceived = (e: MessageEvent<WorkerResponse>) =>
      dispatchWorkerEvent(e.data);

    worker.current.addEventListener('message', onMessageReceived);
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  React.useEffect(() => {
    setModelLoaded(false);
  }, [activeLlmModel]);

  const postWorkerMessage = (
    payload: WorkerRequest,
    cb: (data: WorkerResponse) => void
  ) => {
    worker.current.postMessage(payload);
    onWorkerEvent(payload.requestId, (data: WorkerResponse) => cb(data));
  };

  const initialize = (
    model: LlmModel,
    callback: (data: CallbackData) => void = null
  ): Promise<boolean> =>
    new Promise((resolve, reject) => {
      modelLoaded && resolve(true);
      generate('', callback, model)
        .then(() => resolve(true))
        .catch(reject);
    });

  const generate = (
    prompt: string = '',
    callback: (data: CallbackData) => void = null,
    model: LlmModel = activeLlmModel
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      setWorkerBusy(true);
      const requestId = uuidv4();
      postWorkerMessage(
        {
          model,
          prompt,
          rememberPreviousConversation: false,
          conversationConfig: {},
          requestId,
        },
        (data: WorkerResponse) => {
          switch (data.status) {
            case 'progress': {
              callback({
                feedback: GenerationState.INITIALIZING,
                output: '',
                progress: data.progress,
              });
              break;
            }
            case 'initDone': {
              callback({
                feedback: GenerationState.THINKING,
                output: '',
                progress: 100,
              });
              setModelLoaded(true);
              break;
            }
            case 'update': {
              callback({
                feedback: GenerationState.ANSWERING,
                output: data.output || '',
                progress: 100,
              });
              break;
            }
            case 'complete': {
              callback({
                feedback: GenerationState.COMPLETE,
                output: data.output || '',
                progress: 100,
              });
              setWorkerBusy(false);
              setModelLoaded(true);
              resolve(data.output);
              break;
            }
            case 'error': {
              setWorkerBusy(false);
              reject(data.error);
              break;
            }
          }
        }
      );
    });

  return (
    <context.Provider
      value={{
        ready: modelLoaded,
        busy: workerBusy,
        initialize,
        generate,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
