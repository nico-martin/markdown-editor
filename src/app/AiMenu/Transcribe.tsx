import { Button, FieldSelect, Form, FormControls, FormElement } from '@theme';
import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';
import React from 'react';
import { useForm } from 'react-hook-form';

import useAudioRecorder from '@app/hooks/useAudioRecorder.ts';

import cn from '@utils/classnames.tsx';
import { formatAudioTimestamp } from '@utils/helpers.ts';

import { TRANSCRIPTION_SOURCE_LANGUAGES } from '@store/ai/static/constants.ts';
import useAiSettings from '@store/ai/useAiSettings.ts';
import useWhisper from '@store/ai/whisper/useWhisper.ts';

import styles from './Transcribe.module.css';

const Transcribe: React.FC<{
  className?: string;
  editor: Quill;
  selection: RangeStatic;
}> = ({ className = '', editor, selection }) => {
  const { activeTranslateModel, aiSettings, setAiSettings } = useAiSettings();
  const { busy, transcribe } = useWhisper();
  const {
    startRecording,
    stopRecording,
    recording,
    recordedBlob,
    clear,
    duration,
  } = useAudioRecorder();

  const [audioPlaying, setAudioPlaying] = React.useState<boolean>(false);
  const [audioTime, setAudioTime] = React.useState<number>(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const form = useForm<{ sourceLanguage: string }>({
    defaultValues: {
      sourceLanguage: aiSettings.transcribeSourceLanguage || 'en',
    },
  });

  const values = form.watch();

  React.useEffect(() => {
    if (values.sourceLanguage !== aiSettings.transcribeSourceLanguage) {
      setAiSettings({ transcribeSourceLanguage: values.sourceLanguage });
    }
  }, [values]);

  return !activeTranslateModel ? null : (
    <div className={cn(className, styles.root)}>
      <h3>Transcribe</h3>
      <Form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          let content: any = null;

          await transcribe(
            data.sourceLanguage,
            true,
            recordedBlob,
            (output: string) => {
              if (!content) {
                editor.deleteText(selection.index, selection.length);
                content = editor.getContents();
              }

              editor.setContents(content);
              const newDelta = new Delta().insert(output);
              const delta = new Delta()
                .retain(selection.index)
                .concat(newDelta);
              editor.updateContents(delta, Quill.sources.USER);
            }
          );
        })}
      >
        <div className={styles.recorder}>
          {recordedBlob ? (
            <div className={styles.recorderResult}>
              <audio
                controls
                className={styles.recorderAudio}
                ref={audioRef}
                onTimeUpdate={(e) =>
                  setAudioTime((e.target as HTMLAudioElement).currentTime)
                }
                onEnded={() => {
                  setAudioPlaying(false);
                  setAudioTime(0);
                }}
              >
                <source
                  src={URL.createObjectURL(recordedBlob)}
                  type={recordedBlob.type}
                />
              </audio>
              {audioPlaying ? (
                <Button
                  icon="pause"
                  round
                  type="button"
                  color="primary"
                  onClick={() => {
                    audioRef?.current?.pause();
                    setAudioPlaying(false);
                  }}
                />
              ) : (
                <Button
                  icon="play"
                  round
                  type="button"
                  color="primary"
                  onClick={() => {
                    audioRef?.current?.play();
                    setAudioPlaying(true);
                  }}
                />
              )}{' '}
              <span className={styles.audioTime}>
                {formatAudioTimestamp(audioPlaying ? audioTime : duration)}
              </span>
              <Button
                layout="outline"
                type="button"
                icon="close"
                round
                size="small"
                onClick={() => {
                  setAudioPlaying(false);
                  setAudioTime(0);
                  clear();
                }}
              />
            </div>
          ) : recording ? (
            <Button
              layout="outline"
              type="button"
              icon="stop"
              round
              className={styles.recordButton}
              onClick={() => stopRecording()}
            >
              stop recording ({formatAudioTimestamp(duration)})
            </Button>
          ) : (
            <Button
              layout="outline"
              type="button"
              icon="microphone"
              round
              className={styles.recordButton}
              onClick={async () => {
                try {
                  await startRecording();
                } catch (e) {
                  console.error(e);
                  alert('unable to record');
                }
              }}
            >
              start recording
            </Button>
          )}
        </div>
        <FormElement
          name="sourceLanguage"
          label="Select the source language"
          Input={FieldSelect}
          form={form}
          options={TRANSCRIPTION_SOURCE_LANGUAGES.sort((a, b) =>
            a.label < b.label ? -1 : 1
          )}
          labelContainerClassName={styles.labelContainer}
          stacked
          className={styles.sourceLanguage}
        />
        <FormControls
          align="right"
          value="Transcribe"
          loading={busy}
          disabled={!recordedBlob}
        />
      </Form>
    </div>
  );
};

export default Transcribe;
