import React from 'react';

import { LlmModel } from '../static/types.ts';

export interface CallbackData {
  feedback: string;
  progress: number;
  output: string;
}

export interface Context {
  initialize: (
    model: LlmModel,
    callback: (data: CallbackData) => void
  ) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: CallbackData) => void
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
}

export const context = React.createContext<Context>({
  initialize: async () => true,
  generate: async () => '',
  ready: false,
  busy: false,
});
