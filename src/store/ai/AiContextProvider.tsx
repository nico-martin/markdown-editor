import React from 'react';

import { TRANSLATION_MODELS } from '@store/ai/static/models.ts';
import { settingsDB } from '@store/idb.ts';

import { AiSettings, context } from './aiContext.ts';
import { TranslateModel } from './static/types.ts';

const AiContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [activeTranslateModel, setActiveTranslateModel] =
    React.useState<TranslateModel>(null);

  const [aiSettings, setAiSettings] = React.useState<AiSettings>({
    translateModal: null,
    translateFrom: null,
    translateTo: null,
  });

  React.useEffect(() => {
    settingsDB.get('aiSettings').then((settings) => {
      setAiSettings({
        translateModal: settings?.translateModal || null,
        translateFrom: settings?.translateFrom || null,
        translateTo: settings?.translateTo || null,
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
  }, [aiSettings]);

  React.useEffect(() => {
    setAiSettings((settings) => ({
      ...settings,
      translateModal: activeTranslateModel?.path,
    }));
  }, [activeTranslateModel]);

  return (
    <context.Provider
      value={{
        activeTranslateModel,
        setActiveTranslateModel,
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
