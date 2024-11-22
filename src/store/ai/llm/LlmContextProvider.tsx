import React from 'react';

import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/ai/llm/types.ts';
import WebLlm from '@store/ai/llm/webllm/WebLlm.ts';

import useAiSettings from '../useAiSettings.ts';
import { context } from './llmContext.ts';
import models from './models';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { activeLlmModel } = useAiSettings();
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);

  const model = React.useMemo(
    () =>
      models.find((m) => m.model.id === activeLlmModel?.id)?.model ||
      models[0].model,
    [activeLlmModel]
  );

  const llmInterface: LlmInterface = React.useMemo(
    () => new WebLlm('You are a helpful AI assistant.', model),
    [model]
  );

  const initialize = (
    callback: (data: InitializeCallbackData) => void = () => {}
  ): Promise<boolean> =>
    new Promise((resolve, reject) => {
      llmInterface
        .initialize(callback)
        .then(() => {
          setModelLoaded(model.id);
          resolve(true);
        })
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });

  const generate = (
    prompt: string = '',
    callback: (data: GenerateCallbackData) => void = () => {}
  ): Promise<string> =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
      setWorkerBusy(true);
      try {
        const fullReply = await llmInterface.generate(prompt, (data) =>
          callback(data)
        );
        setWorkerBusy(false);
        resolve(fullReply);
      } catch (e) {
        setWorkerBusy(false);
        reject(e);
      }
    });

  return (
    <context.Provider
      value={{
        ready: modelLoaded === model.id,
        busy: workerBusy,
        initialize,
        generate,
        model,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
