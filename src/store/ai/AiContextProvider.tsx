import React from 'react';

import {
  SPEECH_RECOGNITION_MODELS,
  TRANSLATION_MODELS,
} from '@store/ai/static/models.ts';
import { settingsDB } from '@store/idb.ts';

import { AiSettings, context } from './aiContext.ts';
import { SpeechRecognitionModel, TranslateModel } from './static/types.ts';

const AiContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [activeTranslateModel, setActiveTranslateModel] =
    React.useState<TranslateModel>(null);
  const [activeSpeechRecognitionModel, setActiveSpeechRecognitionModel] =
    React.useState<SpeechRecognitionModel>(null);

  const [aiSettings, setAiSettings] = React.useState<AiSettings>({
    translateModal: null,
    speechRecognitionModel: null,
    translateFrom: null,
    translateTo: null,
    transcribeSourceLanguage: null,
  });

  React.useEffect(() => {
    settingsDB.get('aiSettings').then((settings) => {
      setAiSettings({
        translateModal: settings?.translateModal || null,
        speechRecognitionModel: settings?.speechRecognitionModel || null,
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

  return (
    <context.Provider
      value={{
        activeTranslateModel,
        setActiveTranslateModel,
        activeSpeechRecognitionModel,
        setActiveSpeechRecognitionModel,
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
