/**
 * Minimal usage counter placeholder (for future telemetry / rate limiting).
 * No network calls; storage only.
 */
const KEY = "aixord_usage_counter";

export async function incrementCounter(): Promise<number> {
  const res = await chrome.storage.local.get([KEY]);
  const n = (res[KEY] as number) ?? 0;
  const next = n + 1;
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}
