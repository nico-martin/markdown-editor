import { PortalBox, SHADOW_BOX_SIZES } from '@theme';
import React from 'react';

import {
  getFirstXChars,
  removeBracketsAndWordsInside,
  round,
} from '@utils/helpers.ts';

import useLlm from '@store/ai/llm/useLlm.ts';
import {
  LLM_MODELS,
  SPEECH_RECOGNITION_MODELS,
  TRANSLATION_MODELS,
} from '@store/ai/static/models.ts';
import {
  LlmModel,
  SpeechRecognitionModel,
  TranslateModel,
} from '@store/ai/static/types.ts';
import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';
import useWhisper from '@store/ai/whisper/useWhisper.ts';

import styles from './AiSettingsModal.module.css';
import ModelOption from './ModelOption.tsx';

const TranslationModelOption: React.FC<{ model: TranslateModel }> = ({
  model,
}) => {
  const { activeTranslateModel, setActiveTranslateModel } = useAiSettings();
  const { busy, initialize, progressItems } = useTranslations();
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const download = async () => {
    setDownloading(true);
    await initialize(model);
    setDownloading(false);
  };

  return (
    <ModelOption
      className={styles.option}
      title={model.name}
      name="translations"
      value={model.path}
      size={model.size}
      cardLink={model.cardLink}
      downloadProgress={downloading}
      downloadModel={download}
      downloadDisabled={busy}
      progressItems={downloading ? progressItems : []}
      checked={activeTranslateModel?.path === model.path}
      onCheck={() => setActiveTranslateModel(model)}
      content={
        <div className={styles.translationModelOptionContent}>
          <p>
            <b>
              Input{' '}
              {Object.values(model.inputLanguages).length > 1
                ? 'Languages'
                : 'Language'}
              :
            </b>
            <br />{' '}
            {Object.values(model.inputLanguages).length >= 4
              ? getFirstXChars(
                  removeBracketsAndWordsInside(
                    Object.values(model.inputLanguages).join(', ')
                  ),
                  100
                ) + `... (${Object.values(model.inputLanguages).length})`
              : Object.values(model.inputLanguages).join(', ')}
          </p>
          <p>
            <b>
              Output{' '}
              {Object.values(model.outputLanguages).length > 1
                ? 'Languages'
                : 'Language'}
              :
            </b>
            <br />{' '}
            {Object.values(model.outputLanguages).length >= 4
              ? getFirstXChars(
                  removeBracketsAndWordsInside(
                    Object.values(model.outputLanguages).join(', ')
                  ),
                  100
                ) + `... (${Object.values(model.outputLanguages).length})`
              : Object.values(model.outputLanguages).join(', ')}
          </p>
        </div>
      }
    />
  );
};

const SpeechRecognitionModelOption: React.FC<{
  model: SpeechRecognitionModel;
}> = ({ model }) => {
  const { activeSpeechRecognitionModel, setActiveSpeechRecognitionModel } =
    useAiSettings();
  const { busy, initialize, progressItems } = useWhisper();
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const download = async () => {
    setDownloading(true);
    await initialize(model);
    setDownloading(false);
  };

  return (
    <ModelOption
      className={styles.option}
      title={model.name + (model.quantized ? ' (quantized*)' : '')}
      name="speechRecognition"
      value={model.path}
      size={model.size}
      cardLink={model.cardLink}
      downloadProgress={downloading}
      downloadModel={download}
      downloadDisabled={busy}
      progressItems={downloading ? progressItems : []}
      checked={activeSpeechRecognitionModel?.key === model.key}
      onCheck={() => setActiveSpeechRecognitionModel(model)}
    />
  );
};

const LlmModelOption: React.FC<{
  model: LlmModel;
}> = ({ model }) => {
  const { activeLlmModel, setActiveLlmModel } = useAiSettings();
  const { busy, initialize } = useLlm();
  const [downloadProgress, setDownloadProgress] = React.useState<number>(null);
  const download = async () =>
    await initialize(model, (data) =>
      setDownloadProgress(round(data.progress * 100))
    );

  return (
    <ModelOption
      className={styles.option}
      title={model.title}
      name="llm"
      value={model.id}
      size={model.size}
      downloadProgress={downloadProgress}
      downloadModel={download}
      downloadDisabled={busy}
      checked={activeLlmModel?.id === model.id}
      onCheck={() => setActiveLlmModel(model)}
    />
  );
};

const AiSettingsModal: React.FC<{
  show: boolean;
  setShow: (show: boolean) => void;
}> = ({ show, setShow }) => {
  const {
    activeTranslateModel,
    setActiveTranslateModel,
    activeSpeechRecognitionModel,
    setActiveSpeechRecognitionModel,
    activeLlmModel,
    setActiveLlmModel,
  } = useAiSettings();
  return (
    <PortalBox
      show={show}
      setShow={setShow}
      size={SHADOW_BOX_SIZES.MEDIUM}
      title="AI Settings"
    >
      <h3 className={styles.sectionTitle}>Translations</h3>
      <div className={styles.optionList}>
        <ModelOption
          className={styles.option}
          name="translations"
          value="none"
          title="Not activated"
          checked={activeTranslateModel === null}
          onCheck={() => setActiveTranslateModel(null)}
        />
        <React.Fragment>
          {TRANSLATION_MODELS.map((model, i) => (
            <TranslationModelOption key={i} model={model} />
          ))}
        </React.Fragment>
      </div>
      <h3 className={styles.sectionTitle}>Speech recognition</h3>
      <div className={styles.optionList}>
        <ModelOption
          className={styles.option}
          name="speechRecognition"
          value="none"
          title="Not activated"
          checked={activeSpeechRecognitionModel === null}
          onCheck={() => setActiveSpeechRecognitionModel(null)}
        />
        <React.Fragment>
          {SPEECH_RECOGNITION_MODELS.map((model, i) => (
            <SpeechRecognitionModelOption key={i} model={model} />
          ))}
        </React.Fragment>
        <p className={styles.optionListAdd}>
          * quantized models are lighter and faster to run, but can potentially
          be less accurate.
        </p>
      </div>

      <h3 className={styles.sectionTitle}>Text generation</h3>
      <div className={styles.optionList}>
        <ModelOption
          className={styles.option}
          name="llm"
          value="none"
          title="Not activated"
          checked={activeLlmModel === null}
          onCheck={() => setActiveLlmModel(null)}
        />
        <React.Fragment>
          {LLM_MODELS.map((model, i) => (
            <LlmModelOption key={i} model={model} />
          ))}
        </React.Fragment>
      </div>
    </PortalBox>
  );
};

export default AiSettingsModal;
