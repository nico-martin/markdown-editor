import { FLORES_200_CODES } from '@store/ai/static/constants.ts';

import { TranslateModel } from './types.ts';

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
