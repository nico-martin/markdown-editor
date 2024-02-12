import React from 'react';

import { SpeechRecognitionModel, TranslateModel } from './static/types.ts';

export interface AiSettings {
  translateModal: string;
  speechRecognitionModel: string;
  translateFrom: string;
  translateTo: string;
  transcribeSourceLanguage: string;
}

interface Context {
  activeTranslateModel: TranslateModel;
  setActiveTranslateModel: (model: TranslateModel) => void;
  activeSpeechRecognitionModel: SpeechRecognitionModel;
  setActiveSpeechRecognitionModel: (model: SpeechRecognitionModel) => void;
  aiSettings: AiSettings;
  setAiSettings: (settings: Partial<AiSettings>) => void;
}

export const context = React.createContext<Context>({
  activeTranslateModel: null,
  setActiveTranslateModel: () => {},
  activeSpeechRecognitionModel: null,
  setActiveSpeechRecognitionModel: () => {},
  aiSettings: {
    translateModal: null,
    speechRecognitionModel: null,
    translateFrom: null,
    translateTo: null,
    transcribeSourceLanguage: null,
  },
  setAiSettings: () => {},
});
