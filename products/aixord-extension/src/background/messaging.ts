export type MessageRequest =
  | { type: "PING"; payload?: unknown }
  | { type: "AUTH_GET_TOKEN" }
  | { type: "AUTH_SET_TOKEN"; token: string }
  | { type: "AUTH_CLEAR_TOKEN" };

export type MessageResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };

const TOKEN_KEY = "aixord_auth_token";

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

      default:
        return { ok: false, error: "Unknown message type" };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
