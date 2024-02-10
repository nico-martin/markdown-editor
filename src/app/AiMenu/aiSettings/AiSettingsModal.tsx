import { PortalBox, SHADOW_BOX_SIZES } from '@theme';
import React from 'react';

import {
  getFirstXChars,
  removeBracketsAndWordsInside,
} from '@utils/helpers.ts';

import { TRANSLATION_MODELS } from '@store/ai/static/models.ts';
import { TranslateModel } from '@store/ai/static/types.ts';
import useTranslations from '@store/ai/translations/useTranslations.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';

import styles from './AiSettingsModal.module.css';
import ModelOption from './ModelOption.tsx';

const TranslationModelOption: React.FC<{ model: TranslateModel }> = ({
  model,
}) => {
  const { activeTranslateModel, setActiveTranslateModel } = useAiSettings();
  const { busy, initialize } = useTranslations();
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
      downloadProgress={downloading}
      downloadModel={download}
      downloadDisabled={busy}
      checked={activeTranslateModel?.path === model.path}
      onCheck={() => setActiveTranslateModel(model)}
      content={
        <div className={styles.translationModelOptionContent}>
          <p>
            <b>Input Language(s):</b>
            <br />{' '}
            {Object.values(model.inputLanguages).length >= 3
              ? getFirstXChars(
                  removeBracketsAndWordsInside(
                    Object.values(model.inputLanguages).join(', ')
                  ),
                  100
                ) + `... (${Object.values(model.inputLanguages).length})`
              : Object.values(model.inputLanguages).join(', ')}
          </p>
          <p>
            <b>Output Language(s):</b>
            <br />{' '}
            {Object.values(model.outputLanguages).length >= 3
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

const AiSettingsModal: React.FC<{
  show: boolean;
  setShow: (show: boolean) => void;
}> = ({ show, setShow }) => {
  const { activeTranslateModel, setActiveTranslateModel } = useAiSettings();
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
      <h3 className={styles.sectionTitle}>Text generation</h3>
      <div className={styles.content}></div>
    </PortalBox>
  );
};

export default AiSettingsModal;
