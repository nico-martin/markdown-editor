import React from 'react';

import { TranslateModel } from './static/types.ts';

export interface AiSettings {
  translateModal: string;
  translateFrom: string;
  translateTo: string;
}

interface Context {
  activeTranslateModel: TranslateModel;
  setActiveTranslateModel: (model: TranslateModel) => void;
  aiSettings: AiSettings;
  setAiSettings: (settings: Partial<AiSettings>) => void;
}

export const context = React.createContext<Context>({
  activeTranslateModel: null,
  setActiveTranslateModel: () => {},
  aiSettings: { translateModal: null, translateFrom: null, translateTo: null },
  setAiSettings: () => {},
});
