import type { GateState } from "./gates";
import type { Violation } from "./violations";
import { checkMinimumGates } from "./gates";
import { buildPrompt } from "./prompt";

export interface EnforcementInput {
  userText: string;
  gateState: GateState;
}

export interface EnforcementOutput {
  outboundPrompt: string;
  violations: Violation[];
}

/**
 * Core enforcement orchestrator (placeholder).
 * Later: integrate @aixord/core formula + full gate chain.
 */
export function enforce(input: EnforcementInput): EnforcementOutput {
  const gateCheck = checkMinimumGates(input.gateState);
  const promptBuild = buildPrompt(input.userText);

  const violations = [...gateCheck.violations, ...promptBuild.violations];

  return {
    outboundPrompt: promptBuild.outbound,
    violations
  };
}
