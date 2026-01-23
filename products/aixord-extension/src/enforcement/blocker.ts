import type { Violation } from "./violations";

/**
 * UI-level decision helper: should we block the send action?
 */
export function shouldBlock(violations: Violation[]): boolean {
  return violations.some(v => v.severity === "BLOCK");
}
