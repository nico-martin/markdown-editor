import React from 'react';

import Model from '@store/ai/llm/models/Model.ts';
import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/ai/llm/types.ts';
import WebLlm from '@store/ai/llm/webllm/WebLlm.ts';
import { LLM_MODELS } from '@store/ai/static/models.ts';

import useAiSettings from '../useAiSettings.ts';
import { context } from './llmContext.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { activeLlmModel } = useAiSettings();
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);

  const activeModel = React.useMemo(
    () =>
      LLM_MODELS.find((model) => model.id === activeLlmModel?.id) ||
      LLM_MODELS[0],
    [activeLlmModel]
  );

  const llmInstances: Record<string, LlmInterface> = React.useMemo(() => {
    return LLM_MODELS.reduce((acc: Record<string, LlmInterface>, model) => {
      acc[model.id] = new WebLlm('You are a helpful AI assistant.', model);
      return acc;
    }, {});
  }, []);

  const getInstance = (model: Model) =>
    llmInstances[model?.id] || llmInstances[activeModel.id];

  const initialize = (
    callback: (data: InitializeCallbackData) => void = () => {},
    model: Model = null
  ): Promise<boolean> =>
    new Promise((resolve, reject) => {
      const modelInstance = getInstance(model);
      if (!modelInstance) return;

      modelInstance
        .initialize(callback)
        .then(() => {
          setModelLoaded(model?.id || activeModel.id);
          resolve(true);
        })
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });

  const generate = async (
    prompt: string = '',
    callback: (data: GenerateCallbackData) => void = () => {},
    model: Model = null
  ): Promise<string> => {
    const modelInstance = getInstance(model);
    if (!modelInstance) return;

    setWorkerBusy(true);
    const fullReply = await getInstance(model).generate(prompt, (data) =>
      callback(data)
    );
    setWorkerBusy(false);
    return fullReply;
  };

  return (
    <context.Provider
      value={{
        ready: modelLoaded === activeModel.id,
        busy: workerBusy,
        initialize,
        generate,
        model: activeModel,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
