import { FLORES_200_CODES } from '@store/ai/static/constants.ts';

import { SpeechRecognitionModel, TranslateModel } from './types.ts';

export const TRANSLATION_MODELS: Array<TranslateModel> = [
  {
    name: 'nllb-200-distilled-600M',
    path: 'Xenova/nllb-200-distilled-600M',
    size: 419120483,
    inputLanguages: FLORES_200_CODES,
    outputLanguages: FLORES_200_CODES,
  },
  {
    name: 'opus-mt-de-en',
    path: 'Xenova/opus-mt-de-en',
    size: 49366942,
    inputLanguages: { deu_Latn: 'German' },
    outputLanguages: { eng_Latn: 'English' },
  },
  {
    name: 'opus-mt-en-de',
    path: 'Xenova/opus-mt-en-de',
    size: 56652404,
    inputLanguages: { eng_Latn: 'English' },
    outputLanguages: { deu_Latn: 'German' },
  },
  {
    name: 'opus-mt-fr-en',
    path: 'Xenova/opus-mt-fr-en',
    size: 57381512,
    inputLanguages: { fra_Latn: 'French' },
    outputLanguages: { eng_Latn: 'English' },
  },
  {
    name: 'opus-mt-en-fr',
    path: 'Xenova/opus-mt-en-fr',
    size: 57381512,
    inputLanguages: { eng_Latn: 'English' },
    outputLanguages: { fra_Latn: 'French' },
  },
];

export const SPEECH_RECOGNITION_MODELS: Array<SpeechRecognitionModel> = [
  {
    key: 'Xenova-whisper-tiny-quantized',
    name: 'whisper-tiny',
    path: 'Xenova/whisper-tiny',
    size: 43120515,
    quantized: true,
  },
  {
    key: 'Xenova-whisper-tiny',
    name: 'whisper-tiny',
    path: 'Xenova/whisper-tiny',
    size: 151667488,
    quantized: false,
  },
  {
    key: 'Xenova-whisper-base-quantized',
    name: 'whisper-base',
    path: 'Xenova/whisper-base',
    size: 77002795,
    quantized: true,
  },
  {
    key: 'Xenova-whisper-base',
    name: 'whisper-base',
    path: 'Xenova/whisper-base',
    size: 293589457,
    quantized: false,
  },
  {
    key: 'Xenova-whisper-small-quantized',
    name: 'whisper-small',
    path: 'Xenova/whisper-small',
    size: 251613279,
    quantized: true,
  },
  {
    key: 'Xenova-whisper-medium-quantized',
    name: 'whisper-medium',
    path: 'Xenova/whisper-medium',
    size: 750874576,
    quantized: true,
  },
];
