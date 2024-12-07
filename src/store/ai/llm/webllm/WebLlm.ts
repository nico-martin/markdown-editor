import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';

import Model from '@store/ai/llm/models/Model.ts';
import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/ai/llm/types.ts';

class WebLlm implements LlmInterface {
  private systemPrompt: string;
  private engine: MLCEngine = null;
  private model: Model = null;
  constructor(systemPrompt: string, model: Model) {
    this.systemPrompt = systemPrompt;
    this.model = model;
  }

  public initialize = async (
    callback: (data: InitializeCallbackData) => void
  ): Promise<boolean> => {
    this.engine = await CreateMLCEngine(this.model.id, {
      initProgressCallback: callback,
      appConfig: {
        model_list: [
          {
            model: this.model.url,
            model_id: this.model.id,
            model_lib: this.model.libUrl,
          },
        ],
      },
    });

    return true;
  };

  public generate = async (
    text: string,
    callback: (data: GenerateCallbackData) => void
  ): Promise<string> => {
    const chunks = await this.engine.chat.completions.create({
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 1,
      stream: true,
      stream_options: { include_usage: true },
    });

    let reply = '';
    for await (const chunk of chunks) {
      reply += chunk.choices[0]?.delta.content || '';
      callback({ output: reply, stats: chunk.usage || null });
    }

    return await this.engine.getMessage();
  };
}

export default WebLlm;
