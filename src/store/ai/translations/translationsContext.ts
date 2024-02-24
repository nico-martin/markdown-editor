import React from 'react';

import { TranslateModel } from '../static/types.ts';

export const context = React.createContext<{
  activeModel: TranslateModel;
  initialize: (model: TranslateModel) => Promise<boolean>;
  translate: (
    src_lang: string,
    tgt_lang: string,
    text: string,
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
  translate: async () => '',
  ready: false,
  busy: false,
  progressItems: [],
});
