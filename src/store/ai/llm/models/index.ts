import Model from '@store/ai/llm/models/Model.ts';

import gemma2_2b from './Gemma2-2B.ts';
import gemma2_9b from './Gemma2-9B.ts';

const models: Array<{ model: Model; available: boolean }> = [
  { model: gemma2_2b, available: true },
  { model: gemma2_9b, available: true },
].filter((m) => m.available);

export default models;
