import React from 'react';

import Generator from './Generator';
import Model from './Model';
import {
  ConvTemplateConfig,
  FullStats,
  GenerationState,
  InitProgressCallback,
  InitProgressCallbackReport,
} from './static/types';
import hasModelInCache from './utils/hasModelInCache';

const useWebLLM = (
  model: Model,
  conversationConfig: Partial<ConvTemplateConfig> = {}
): {
  modelLoaded: boolean;
  modelLoading: boolean;
  modelCached: boolean;
  generatorInitialized: boolean;
  loadModel: () => Promise<void>;
  report: InitProgressCallbackReport;
  error: string;
  generationState: GenerationState;
  generate: (
    prompt: string,
    rememberPreviousConversation: boolean
  ) => Promise<string>;
  answer: string;
  stats: FullStats;
} => {
  const [generatorInitialized, setGeneratorInitialized] =
    React.useState<boolean>(false);
  const [modelLoading, setModelLoading] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<boolean>(false);
  const [modelCached, setModelCached] = React.useState<boolean>(false);
  const [report, setReport] = React.useState<InitProgressCallbackReport>({
    progress: 0,
    timeElapsed: 0,
    text: '',
  });
  const [generationState, setGenerationState] = React.useState<GenerationState>(
    GenerationState.IDLE
  );
  const [answer, setAnswer] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [stats, setStats] = React.useState<FullStats>(null);
  const generator = React.useMemo(() => {
    const g = new Generator(model, conversationConfig);
    setModelLoaded(g.modelLoaded);
    hasModelInCache(model).then((cached) => {
      setModelCached(cached);
      setGeneratorInitialized(true);
    });

    return g;
  }, []);

  const loadModel = async (progressCallback: InitProgressCallback = null) => {
    setError('');
    setModelLoading(true);
    try {
      generator.setInitProgressCallback((report) => {
        progressCallback && progressCallback(report);
        setReport(report);
      });
      await generator.load();
      setModelLoading(false);
      setModelLoaded(generator.modelLoaded);
      setModelCached(generator.modelInCache);
    } catch (e) {
      setError(e.toString());
    }
  };

  const generate = async (
    prompt: string,
    rememberPreviousConversation: boolean = true
  ) => {
    setGenerationState(GenerationState.THINKING);
    setAnswer('');
    const response = await generator.generate(
      prompt,
      (_step: number, message) => {
        setStats({
          ...generator.getRuntimeStats(),
          gpuAdapter: generator.gpuDeviceAdapter,
        });
        setGenerationState(GenerationState.ANSWERING);
        setAnswer(message);
      },
      rememberPreviousConversation
    );
    setGenerationState(GenerationState.IDLE);
    setStats({
      ...generator.getRuntimeStats(),
      gpuAdapter: generator.gpuDeviceAdapter,
    });
    setAnswer(response);
    return response;
  };

  return {
    modelLoaded,
    modelLoading,
    modelCached,
    generatorInitialized,
    loadModel,
    report,
    error,
    generationState,
    generate,
    answer,
    stats,
  };
};

export default useWebLLM;
