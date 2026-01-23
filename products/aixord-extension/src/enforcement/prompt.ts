import type { ParsedPrompt } from "./parser";
import type { Violation } from "./violations";
import { parsePrompt } from "./parser";

/**
 * Build a structured prompt for the provider, later.
 * For now: passthrough with parsed metadata.
 */
export interface PromptBuildResult {
  parsed: ParsedPrompt;
  outbound: string;
  violations: Violation[];
}

export function buildPrompt(rawUserInput: string): PromptBuildResult {
  const parsed = parsePrompt(rawUserInput);
  return {
    parsed,
    outbound: rawUserInput,
    violations: []
  };
}
