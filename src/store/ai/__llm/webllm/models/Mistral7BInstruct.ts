import Model from '../Model';

const model = new Model({
  title: 'Mistral-7b-instruct',
  url: 'https://uploads.nico.dev/mlc-llm-libs/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/',
  size: 4083348237,
  libUrl:
    'https://uploads.nico.dev/mlc-llm-libs/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/lib/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2',
  about: `Mistral-7B-Instruct is a 7.3B parameter large language model by Mistral AI. It is released under the Apache 2.0 license and outperforms most of the existing LLMs of the same size.`,
});

export default model;
