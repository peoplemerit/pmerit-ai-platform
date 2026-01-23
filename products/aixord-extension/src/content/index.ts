import { observeDom } from "./observer";
import { detectProvider } from "../adapters/detector";

function logHandles(providerId: string, input: HTMLElement | null, sendButton: HTMLElement | null) {
  const hasInput = Boolean(input);
  const hasSend = Boolean(sendButton);
  console.log(`[AIXORD] provider=${providerId} input=${hasInput} send=${hasSend}`);
}

function attach(): void {
  const adapter = detectProvider(window.location);
  const { input, sendButton } = adapter.findUi();

  // Lightweight verification only
  logHandles(adapter.id, input, sendButton);

  // Later: enforcement will wrap send behavior and rewrite prompt.
  // For now, we stop here to avoid drift.
}

function boot(): void {
  console.log("[AIXORD] content script loaded");

  // Initial attach
  attach();

  // Re-attach on DOM changes (provider UIs are dynamic)
  observeDom(() => {
    attach();
  });
}

boot();
