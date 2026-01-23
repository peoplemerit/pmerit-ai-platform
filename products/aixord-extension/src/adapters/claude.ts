import type { ProviderAdapter, UiHandles } from "./interface";

function q<T extends Element = Element>(sel: string): T | null {
  return document.querySelector(sel) as T | null;
}

/**
 * Claude selectors may change; these are placeholders for wiring.
 * We'll harden these later with robust heuristics.
 */
export const claudeAdapter: ProviderAdapter = {
  id: "claude",

  matches(location) {
    return location.host === "claude.ai";
  },

  findUi(): UiHandles {
    // Claude commonly uses a textarea in the composer area.
    const input =
      q<HTMLTextAreaElement>('textarea') ??
      q<HTMLElement>('[contenteditable="true"]');

    // Send button is often a button near composer with aria-label.
    const sendButton =
      q<HTMLButtonElement>('button[aria-label*="Send"]') ??
      q<HTMLButtonElement>('button[type="submit"]');

    return { input, sendButton };
  },

  setInputText(text, handles) {
    if (!handles.input) return;

    if (handles.input instanceof HTMLTextAreaElement) {
      handles.input.value = text;
      handles.input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    // contenteditable fallback
    handles.input.textContent = text;
    handles.input.dispatchEvent(new Event("input", { bubbles: true }));
  },

  clickSend(handles) {
    handles.sendButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
};
