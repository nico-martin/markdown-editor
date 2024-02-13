import React from 'react';

import { round } from '@utils/helpers.ts';
import Generator from '@utils/webLLM/Generator.ts';
import { ConvTemplateConfig } from '@utils/webLLM/static/types.ts';

import { LLM_STATE, LlmModel } from '../static/types.ts';
import useAiSettings from '../useAiSettings.ts';
import { context } from './llmContext.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { activeLlmModel } = useAiSettings();
  const [busy, setBusy] = React.useState<boolean>(false);
  const generator = React.useMemo(
    () => (activeLlmModel ? new Generator(activeLlmModel) : null),
    [activeLlmModel]
  );

  const initialize = async (
    model: LlmModel,
    progressCallback: (progress: number) => void,
    conversationConfig: Partial<ConvTemplateConfig> = {}
  ): Promise<boolean> =>
    new Promise((resolve) => {
      setBusy(true);
      const g = new Generator(model, conversationConfig);
      g.setInitProgressCallback((report) => {
        progressCallback && progressCallback(report.progress);
      });
      g.load().then(() => {
        setBusy(false);
        resolve(true);
      });
    });

  const generate = async (
    prompt: string,
    cb: (feedback: string, output: string) => void = null
  ): Promise<string> => {
    setBusy(true);
    if (!generator.modelLoaded) {
      cb && cb(LLM_STATE.INITIALIZING, '');
      generator.setInitProgressCallback((report) => {
        cb &&
          cb(
            `${LLM_STATE.INITIALIZING} (${round(report.progress * 100)}%)`,
            ''
          );
        console.log(report.progress);
      });
      await generator.load();
    }
    cb && cb(LLM_STATE.PROCESSING, '');
    const output = await generator.generate(
      prompt,
      (_step: number, output: string) => cb && cb(LLM_STATE.ANSWERING, output)
    );
    cb(LLM_STATE.DONE, output);
    setBusy(false);
    return output;
  };

  return (
    <context.Provider
      value={{
        ready: generator?.modelLoaded || false,
        busy,
        initialize,
        generate,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
