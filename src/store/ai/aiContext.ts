import React from 'react';

import {
  LlmModel,
  SpeechRecognitionModel,
  TranslateModel,
} from './static/types.ts';

export interface AiSettings {
  translateModal: string;
  speechRecognitionModel: string;
  llmModel: string;
  translateFrom: string;
  translateTo: string;
  transcribeSourceLanguage: string;
}

interface Context {
  activeTranslateModel: TranslateModel;
  setActiveTranslateModel: (model: TranslateModel) => void;
  activeSpeechRecognitionModel: SpeechRecognitionModel;
  setActiveSpeechRecognitionModel: (model: SpeechRecognitionModel) => void;
  activeLlmModel: LlmModel;
  setActiveLlmModel: (model: LlmModel) => void;
  aiSettings: AiSettings;
  setAiSettings: (settings: Partial<AiSettings>) => void;
}

export const context = React.createContext<Context>({
  activeTranslateModel: null,
  setActiveTranslateModel: () => {},
  activeSpeechRecognitionModel: null,
  setActiveSpeechRecognitionModel: () => {},
  activeLlmModel: null,
  setActiveLlmModel: () => {},
  aiSettings: {
    translateModal: null,
    speechRecognitionModel: null,
    llmModel: null,
    translateFrom: null,
    translateTo: null,
    transcribeSourceLanguage: null,
  },
  setAiSettings: () => {},
});
