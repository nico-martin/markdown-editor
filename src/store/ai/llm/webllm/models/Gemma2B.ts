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
  cardLink: 'https://huggingface.co/google/gemma-2b',
  about:
    "Gemma-2B, developed by Google Deepmind, is a lightweight large language model (LLM) built on the same research and technology as the powerful Gemini models. This means it inherits some of Gemini's capabilities while being designed for efficient operation on small devices.",
});

export default model;
