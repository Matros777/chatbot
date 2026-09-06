import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { customProvider, gateway, type LanguageModel } from "ai";
import { isTestEnvironment } from "../constants";
import { chatModels, titleModel } from "./models";

// Провайдер OpenRouter (нужен API ключ)
const openrouterProvider = createOpenAICompatible({
  name: "openrouter",
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "EMPTY",
});

// Провайдер OpenCode Zen (free-модели БЕЗ ключа)
const zenProvider = createOpenAICompatible({
  name: "zen",
  baseURL: process.env.ZEN_BASE_URL || "https://opencode.ai/zen/v1",
  apiKey: process.env.ZEN_API_KEY || "zen-free", // free-модели не требуют ключа
});

const gatewayProvider = gateway;

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        chatModel,
        titleModel: mockTitleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "title-model": mockTitleModel,
        },
      });
    })()
  : null;

function modelProvider(modelId: string): "zen" | "openrouter" | "gateway" {
  const model = chatModels.find((m) => m.id === modelId);
  if (model?.provider === "zen") return "zen";
  if (model?.provider === "openrouter") return "openrouter";
  return "gateway";
}

export function getLanguageModel(modelId: string): LanguageModel {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  const providerKind = modelProvider(modelId);
  if (providerKind === "zen") {
    return zenProvider(modelId);
  }
  if (providerKind === "openrouter") {
    return openrouterProvider(modelId);
  }
  return gatewayProvider.languageModel(modelId);
}

export function getTitleModel(): LanguageModel {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }

  const providerKind = modelProvider(titleModel.id);
  if (providerKind === "zen") {
    return zenProvider(titleModel.id);
  }
  if (providerKind === "openrouter") {
    return openrouterProvider(titleModel.id);
  }
  return gatewayProvider.languageModel(titleModel.id);
}