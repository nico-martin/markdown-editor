import React from 'react';

import Model from '@store/ai/llm/models/Model.ts';
import {
  GenerateCallbackData,
  InitializeCallbackData,
} from '@store/ai/llm/types.ts';

export interface Context {
  initialize: (
    callback?: (data: InitializeCallbackData) => void,
    model?: Model
  ) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: GenerateCallbackData) => void,
    model?: Model
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
  model: Model;
}

export const context = React.createContext<Context>({
  initialize: async () => true,
  generate: async () => '',
  ready: false,
  busy: false,
  model: null,
});
