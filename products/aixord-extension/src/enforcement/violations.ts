export type ViolationSeverity = "INFO" | "WARN" | "BLOCK";

export interface Violation {
  code: string;               // e.g. "GATE_LIC"
  severity: ViolationSeverity;
  message: string;
  detail?: Record<string, unknown>;
}

export function block(code: string, message: string, detail?: Record<string, unknown>): Violation {
  return { code, severity: "BLOCK", message, detail };
}

export function warn(code: string, message: string, detail?: Record<string, unknown>): Violation {
  return { code, severity: "WARN", message, detail };
}

export function info(code: string, message: string, detail?: Record<string, unknown>): Violation {
  return { code, severity: "INFO", message, detail };
}
