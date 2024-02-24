import React from 'react';

import { SpeechRecognitionModel } from '../static/types.ts';

export const context = React.createContext<{
  activeModel: SpeechRecognitionModel;
  initialize: (model: SpeechRecognitionModel) => Promise<boolean>;
  transcribe: (
    language: string,
    multilingual: boolean,
    blob: Blob,
    cb?: (output: string) => void
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
  progressItems: Array<{
    file: string;
    progress: number;
  }>;
}>({
  activeModel: null,
  initialize: async () => true,
  transcribe: async () => '',
  ready: false,
  busy: false,
  progressItems: [],
});
