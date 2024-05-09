import Gemma2B from '../llm/webllm/models/Gemma2B.ts';
import Mistral7BInstruct from '../llm/webllm/models/Mistral7BInstruct.ts';
//import RedPajamaINCITEChat3B from '../llm/webllm/models/RedPajamaINCITEChat3B.ts';
import {
  FLORES_200_CODES,
  M2M100_LANGUAGES,
  MBART50_LANGUAGES,
  T5_LANGUAGES_FROM,
  T5_LANGUAGES_TO,
} from './constants.ts';
import { LlmModel, SpeechRecognitionModel, TranslateModel } from './types.ts';

export const LLM_MODELS: Array<LlmModel> = [
  //RedPajamaINCITEChat3B,
  Mistral7BInstruct,
  Gemma2B,
];

export const TRANSLATION_MODELS: Array<TranslateModel> = [
  {
    name: 't5-small',
    path: 'Xenova/t5-small',
    cardLink: 'https://huggingface.co/Xenova/t5-small',
    size: 80612149,
    inputLanguages: T5_LANGUAGES_FROM,
    outputLanguages: T5_LANGUAGES_TO,
  },
  {
    name: 'nllb-200-distilled-600M',
    path: 'Xenova/nllb-200-distilled-600M',
    cardLink: 'https://huggingface.co/Xenova/nllb-200-distilled-600M',
    size: 913001578,
    inputLanguages: FLORES_200_CODES,
    outputLanguages: FLORES_200_CODES,
  },
  {
    name: 'm2m100_418M',
    path: 'Xenova/m2m100_418M',
    cardLink: 'https://huggingface.co/Xenova/m2m100_418M',
    size: 640685832,
    inputLanguages: M2M100_LANGUAGES,
    outputLanguages: M2M100_LANGUAGES,
  },
  {
    name: 'mbart-large-50-many-to-many-mmt',
    path: 'Xenova/mbart-large-50-many-to-many-mmt',
    cardLink: 'https://huggingface.co/Xenova/mbart-large-50-many-to-many-mmt',
    size: 890679704,
    inputLanguages: MBART50_LANGUAGES,
    outputLanguages: MBART50_LANGUAGES,
  },
  /*{
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
  },*/
];

export const SPEECH_RECOGNITION_MODELS: Array<SpeechRecognitionModel> = [
  {
    key: 'Xenova-whisper-tiny-quantized',
    name: 'whisper-tiny',
    path: 'Xenova/whisper-tiny',
    cardLink: 'https://huggingface.co/Xenova/whisper-tiny',
    size: 43120515,
    quantized: true,
  },
  {
    key: 'Xenova-whisper-tiny',
    name: 'whisper-tiny',
    path: 'Xenova/whisper-tiny',
    cardLink: 'https://huggingface.co/Xenova/whisper-tiny',
    size: 151667488,
    quantized: false,
  },
  {
    key: 'Xenova-whisper-base-quantized',
    name: 'whisper-base',
    path: 'Xenova/whisper-base',
    cardLink: 'https://huggingface.co/Xenova/whisper-base',
    size: 77002795,
    quantized: true,
  },
  {
    key: 'Xenova-whisper-base',
    name: 'whisper-base',
    path: 'Xenova/whisper-base',
    cardLink: 'https://huggingface.co/Xenova/whisper-base',
    size: 293589457,
    quantized: false,
  },
  /* {
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
  },*/
];
