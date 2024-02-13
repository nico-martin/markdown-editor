import React from 'react';

import {
  LLM_MODELS,
  SPEECH_RECOGNITION_MODELS,
  TRANSLATION_MODELS,
} from '@store/ai/static/models.ts';
import { settingsDB } from '@store/idb.ts';

import { AiSettings, context } from './aiContext.ts';
import {
  LlmModel,
  SpeechRecognitionModel,
  TranslateModel,
} from './static/types.ts';

const AiContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [activeTranslateModel, setActiveTranslateModel] =
    React.useState<TranslateModel>(null);
  const [activeSpeechRecognitionModel, setActiveSpeechRecognitionModel] =
    React.useState<SpeechRecognitionModel>(null);
  const [activeLlmModel, setActiveLlmModel] = React.useState<LlmModel>(null);

  const [aiSettings, setAiSettings] = React.useState<AiSettings>({
    translateModal: null,
    speechRecognitionModel: null,
    llmModel: null,
    translateFrom: null,
    translateTo: null,
    transcribeSourceLanguage: null,
  });

  React.useEffect(() => {
    settingsDB.get('aiSettings').then((settings) => {
      setAiSettings({
        translateModal: settings?.translateModal || null,
        speechRecognitionModel: settings?.speechRecognitionModel || null,
        llmModel: settings?.llmModel || null,
        translateFrom: settings?.translateFrom || null,
        translateTo: settings?.translateTo || null,
        transcribeSourceLanguage: settings?.transcribeSourceLanguage || null,
      });
    });
  }, []);

  React.useEffect(() => {
    settingsDB.set('aiSettings', aiSettings);
    setActiveTranslateModel(
      TRANSLATION_MODELS.find(
        (model) => model.path === aiSettings.translateModal
      ) || null
    );
    setActiveSpeechRecognitionModel(
      SPEECH_RECOGNITION_MODELS.find(
        (model) => model.key === aiSettings.speechRecognitionModel
      ) || null
    );
    setActiveLlmModel(
      LLM_MODELS.find((model) => model.id === aiSettings.llmModel) || null
    );
  }, [aiSettings]);

  React.useEffect(() => {
    setAiSettings((settings) => ({
      ...settings,
      translateModal: activeTranslateModel?.path,
    }));
  }, [activeTranslateModel]);

  React.useEffect(() => {
    setAiSettings((settings) => ({
      ...settings,
      speechRecognitionModel: activeSpeechRecognitionModel?.key,
    }));
  }, [activeSpeechRecognitionModel]);

  React.useEffect(() => {
    setAiSettings((settings) => ({
      ...settings,
      llmModel: activeLlmModel?.id,
    }));
  }, [activeLlmModel]);

  return (
    <context.Provider
      value={{
        activeTranslateModel,
        setActiveTranslateModel,
        activeSpeechRecognitionModel,
        setActiveSpeechRecognitionModel,
        activeLlmModel,
        setActiveLlmModel,
        aiSettings,
        setAiSettings: (newSettings: Partial<AiSettings>) =>
          setAiSettings((settings) => ({ ...settings, ...newSettings })),
      }}
    >
      {children}
    </context.Provider>
  );
};

export default AiContextProvider;
