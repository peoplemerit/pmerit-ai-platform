import type { Violation } from "./violations";
import { block } from "./violations";

/**
 * Minimal gate status snapshot.
 * This mirrors Claude’s concept of "blocking gates" without importing core yet.
 */
export type GateId = "LIC" | "DIS" | "TIR" | "ENV" | "FLD" | "CIT" | "CON" | "OBJ" | "RA" | "FX" | "PD" | "PR" | "BP" | "MS" | "VA" | "HO";

export interface GateState {
  [key: string]: 0 | 1;
}

export interface GateCheckResult {
  ok: boolean;
  violations: Violation[];
  state: GateState;
}

/**
 * Placeholder: until we integrate @aixord/core, we enforce only a simple minimum:
 * - LIC and DIS must be passed (1) before proceeding.
 */
export function checkMinimumGates(state: GateState): GateCheckResult {
  const violations: Violation[] = [];
  const lic = state["LIC"] ?? 0;
  const dis = state["DIS"] ?? 0;

  if (lic !== 1) violations.push(block("GATE_LIC", "License gate not passed"));
  if (dis !== 1) violations.push(block("GATE_DIS", "Disclaimer gate not accepted"));

  return {
    ok: violations.filter(v => v.severity === "BLOCK").length === 0,
    violations,
    state
  };
}
