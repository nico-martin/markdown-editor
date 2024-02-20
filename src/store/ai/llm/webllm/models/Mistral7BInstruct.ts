import Model from '../Model';

const model = new Model({
  title: 'Mistral-7b-instruct',
  url: 'https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/resolve/main/',
  size: 4083348237,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
});

export default model;
