import type { GateState } from "../enforcement/gates";

export type MessageRequest =
  | { type: "PING"; payload?: unknown }
  | { type: "AUTH_GET_TOKEN" }
  | { type: "AUTH_SET_TOKEN"; token: string }
  | { type: "AUTH_CLEAR_TOKEN" }
  | { type: "GATE_GET_STATE" }
  | { type: "GATE_SET_STATE"; state: GateState }
  | { type: "GATE_UPDATE"; gateId: string; value: 0 | 1 };

export type MessageResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };

const TOKEN_KEY = "aixord_auth_token";
const GATE_STATE_KEY = "aixord_gate_state";

/**
 * Storage helpers (MV3 service worker safe).
 */
export async function getToken(): Promise<string | null> {
  const result = await chrome.storage.local.get([TOKEN_KEY]);
  return (result[TOKEN_KEY] as string) ?? null;
}

export async function setToken(token: string): Promise<void> {
  await chrome.storage.local.set({ [TOKEN_KEY]: token });
}

export async function clearToken(): Promise<void> {
  await chrome.storage.local.remove([TOKEN_KEY]);
}

/**
 * Gate state storage helpers.
 */
export async function getGateState(): Promise<GateState> {
  const result = await chrome.storage.local.get([GATE_STATE_KEY]);
  return (result[GATE_STATE_KEY] as GateState) ?? {};
}

export async function setGateState(state: GateState): Promise<void> {
  await chrome.storage.local.set({ [GATE_STATE_KEY]: state });
}

export async function updateGate(gateId: string, value: 0 | 1): Promise<GateState> {
  const current = await getGateState();
  const updated = { ...current, [gateId]: value };
  await setGateState(updated);
  return updated;
}

/**
 * Main message router for background.
 */
export async function handleMessage(
  req: MessageRequest
): Promise<MessageResponse> {
  try {
    switch (req.type) {
      case "PING":
        return { ok: true, data: { pong: true } };

      case "AUTH_GET_TOKEN": {
        const token = await getToken();
        return { ok: true, data: { token } };
      }

      case "AUTH_SET_TOKEN": {
        if (!req.token || typeof req.token !== "string") {
          return { ok: false, error: "Missing token" };
        }
        await setToken(req.token);
        return { ok: true };
      }

      case "AUTH_CLEAR_TOKEN":
        await clearToken();
        return { ok: true };

      case "GATE_GET_STATE": {
        const state = await getGateState();
        return { ok: true, data: { state } };
      }

      case "GATE_SET_STATE": {
        if (!req.state || typeof req.state !== "object") {
          return { ok: false, error: "Missing gate state" };
        }
        await setGateState(req.state);
        return { ok: true };
      }

      case "GATE_UPDATE": {
        if (!req.gateId || typeof req.gateId !== "string") {
          return { ok: false, error: "Missing gateId" };
        }
        if (req.value !== 0 && req.value !== 1) {
          return { ok: false, error: "Invalid gate value (must be 0 or 1)" };
        }
        const updated = await updateGate(req.gateId, req.value);
        return { ok: true, data: { state: updated } };
      }

      default:
        return { ok: false, error: "Unknown message type" };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
