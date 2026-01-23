import type { ProviderAdapter, ProviderId } from "./interface";
import { claudeAdapter } from "./claude";
import { chatgptAdapter } from "./chatgpt";
import { geminiAdapter } from "./gemini";

const adapters: ProviderAdapter[] = [claudeAdapter, chatgptAdapter, geminiAdapter];

export function detectProvider(location: Location = window.location): ProviderAdapter {
  for (const a of adapters) {
    if (a.matches(location)) return a;
  }
  return {
    id: "unknown" as ProviderId,
    matches: () => false,
    findUi: () => ({ input: null, sendButton: null })
  };
}
