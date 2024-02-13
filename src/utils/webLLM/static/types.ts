import { round } from '@common/functions';

export interface ConvTemplateConfig {
  system: string;
  roles: Array<string>;
  seps: Array<string>;
  separator_style: string;
  offset: number;
  stop_str: string;
  add_bos: boolean;
  stop_tokens: Array<number>;
}

export interface ChatConfig {
  tokenizer_files: Array<string>;
  conv_config?: Partial<ConvTemplateConfig>;
  conv_template: string;
  // additional metadata
  mean_gen_len: number;
  shift_fill_factor: number;
  repetition_penalty: number;
  top_p: number;
  temperature: number;
}

export interface ChatConfig {
  tokenizer_files: Array<string>;
  conv_config?: Partial<ConvTemplateConfig>;
  conv_template: string;
  // additional metadata
  mean_gen_len: number;
  shift_fill_factor: number;
  repetition_penalty: number;
  top_p: number;
  temperature: number;
}

export type InitProgressCallback = (report: InitProgressCallbackReport) => void;

export type InitProgressCallbackReport = {
  progress: number;
  timeElapsed: number;
  text: string;
};

export type GenerateProgressCallback = (
  step: number,
  currentMessage: string
) => void;

export enum GenerationState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  ANSWERING = 'ANSWERING',
}

export interface RuntimeStats {
  prefillTotalTokens: number;
  prefillTotalTime: number;
  prefillTokensPerSec: number;
  decodingTotalTokens: number;
  decodingTotalTime: number;
  decodingTokensPerSec: number;
}

export interface FullStats extends RuntimeStats {
  gpuAdapter: GPUAdapterInfo;
}
