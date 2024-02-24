import Model from '../Model';

const model = new Model({
  title: 'Gemma-2B',
  url: 'https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/',
  size: 1429128056,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/gemma-2b-it/gemma-2b-it-q4f16_1-ctx1k_cs1k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  //vram_required_MB: 1476.52,
  //low_resource_required: true,
});

export default model;
