import React from 'react';

import { ConvTemplateConfig } from '@utils/webLLM/static/types.ts';

import { LlmModel } from '../static/types.ts';

export const context = React.createContext<{
  //activeModel: LlmModel;
  initialize: (
    model: LlmModel,
    progressCallback: (progress: number) => void,
    onversationConfig?: Partial<ConvTemplateConfig>
  ) => Promise<boolean>;
  generate: (
    prompt: string,
    cb?: (feedback: string, output: string) => void
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
}>({
  //activeModel: null,
  initialize: async () => true,
  generate: async () => '',
  ready: false,
  busy: false,
});
