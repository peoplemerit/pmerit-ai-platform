import { getToken } from "./messaging";

/**
 * Placeholder for extension ↔ webapp auth handshake.
 * Claude blueprint calls this out in D2.S6; for now we define the
 * minimal surfaces so the codebase has stable import paths.
 */

export interface AuthStatus {
  isAuthenticated: boolean;
  token: string | null;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const token = await getToken();
  return { isAuthenticated: Boolean(token), token };
}
