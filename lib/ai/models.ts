export const DEFAULT_CHAT_MODEL = "dots-studio/dots-3-note-preview:free";

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  context?: string;
  gatewayOrder?: string[];
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

// === Провайдер: ASI1 ===
const ASI1_MODELS: ChatModel[] = [
  {
    id: "asi1",
    name: "ASI1",
    provider: "asi1",
    description: "ASI1 agentic model (550K context)",
    context: "550K",
  },
];

// === Провайдер: OpenRouter (бесплатные модели, нужен ключ) ===
const OPENROUTER_MODELS: ChatModel[] = [
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    name: "Nemotron 3.5 Lightning",
    provider: "openrouter",
    description: "Open mixture-of-experts (free)",
    context: "1000K",
  },
  {
    id: "nvidia/nemotron-3.5-content-safety:free",
    name: "Nemotron 3.5 Content Safety",
    provider: "openrouter",
    description: "Compact 4B safety model (free)",
    context: "128K",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "Nemotron 3 Ultra 550B",
    provider: "openrouter",
    description: "Open frontier reasoning MoE (free)",
    context: "1000K",
  },
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    name: "Nemotron 3 Nano Omni",
    provider: "openrouter",
    description: "30B-A3B multimodal reasoning (free)",
    context: "256K",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super 120B",
    provider: "openrouter",
    description: "120B hybrid MoE (free)",
    context: "262K",
  },
  {
    id: "inclusionai/ling-3.0-flash-fin:free",
    name: "Ling 3.0 Flash Fin",
    provider: "openrouter",
    description: "Finance-focused MoE (free)",
    context: "262K",
  },
  {
    id: "dots-studio/dots-3-note-preview:free",
    name: "Dots3 Note Preview",
    provider: "openrouter",
    description: "Open-weight MoE (free)",
    context: "512K",
  },
  {
    id: "liquid/lfm-2.5-2.6b:free",
    name: "LFM 2.5 2.6B",
    provider: "openrouter",
    description: "Compact reasoning model (free)",
    context: "65K",
  },
  {
    id: "thinkingmachines/inkling-small:free",
    name: "Inkling Small",
    provider: "openrouter",
    description: "Open-weight multimodal MoE (free)",
    context: "1048K",
  },
  {
    id: "poolside/laguna-s-2.1:free",
    name: "Laguna S 2.1",
    provider: "openrouter",
    description: "Coding agent model (free)",
    context: "262K",
  },
  {
    id: "thinkingmachines/inkling:free",
    name: "Inkling",
    provider: "openrouter",
    description: "Open-weight multimodal MoE (free)",
    context: "1048K",
  },
  {
    id: "poolside/laguna-xs-2.1:free",
    name: "Laguna XS 2.1",
    provider: "openrouter",
    description: "33B-A3B coding model (free)",
    context: "262K",
  },
  {
    id: "cohere/north-mini-code:free",
    name: "North Mini Code",
    provider: "openrouter",
    description: "Agentic coding model (free)",
    context: "256K",
  },
  {
    id: "z-ai/glm-5.2:free",
    name: "GLM 5.2",
    provider: "openrouter",
    description: "Large-scale reasoning model (free)",
    context: "256K",
  },
  {
    id: "minimax/minimax-m3:free",
    name: "MiniMax-M3",
    provider: "openrouter",
    description: "Multimodal foundation model (free)",
    context: "1048K",
  },
  {
    id: "google/gemma-4-26b-a4b-it:free",
    name: "Gemma 4 26B A4B",
    provider: "openrouter",
    description: "Instruction-tuned MoE (free)",
    context: "262K",
  },
  {
    id: "google/gemma-4-31b-it:free",
    name: "Gemma 4 31B",
    provider: "openrouter",
    description: "30.7B dense multimodal (free)",
    context: "262K",
  },
  {
    id: "minimax/minimax-m2.7:free",
    name: "MiniMax-M2.7",
    provider: "openrouter",
    description: "Next-gen LLM (free)",
    context: "196K",
  },
];

export const chatModels: ChatModel[] = [...ASI1_MODELS, ...OPENROUTER_MODELS];

export const titleModel: ChatModel = {
  description: "Fast model for title generation",
  id: "dots-studio/dots-3-note-preview:free",
  name: "Dots3 Note Preview",
  provider: "openrouter",
};

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  // Все наши модели поддерживают tools. Reasoning/vision — по списку.
  const result: Record<string, ModelCapabilities> = {};
  for (const model of chatModels) {
    const id = model.id.toLowerCase();
    result[model.id] = {
      reasoning: /reasoning|ultra|glm|nemotron|inkling|dots/.test(id),
      tools: true,
      vision: /omni|gemma|inkling|ultra/.test(id),
    };
  }
  return result;
}

export const isDemo = process.env.IS_DEMO === "1";

type GatewayModel = {
  id: string;
  name: string;
  type?: string;
  tags?: string[];
};

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export async function getAllGatewayModels(): Promise<
  GatewayModelWithCapabilities[]
> {
  return chatModels.map((model) => ({
    ...model,
    capabilities: {
      reasoning: false,
      tools: true,
      vision: false,
    },
  }));
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);

export type ModelAvailability = "healthy" | "impacted" | "unknown";

export async function getModelAvailability(
  modelId: string
): Promise<ModelAvailability> {
  const model = chatModels.find((item) => item.id === modelId);
  if (!model) {
    return "unknown";
  }
  // No gateway health endpoint for these providers — always report healthy.
  return "healthy";
}