import type { ProviderAdapter, UiHandles } from "./interface";

function q<T extends Element = Element>(sel: string): T | null {
  return document.querySelector(sel) as T | null;
}

/**
 * Gemini selectors may change; placeholders for wiring.
 */
export const geminiAdapter: ProviderAdapter = {
  id: "gemini",

  matches(location) {
    return location.host === "gemini.google.com";
  },

  findUi(): UiHandles {
    const input =
      q<HTMLTextAreaElement>('textarea') ??
      q<HTMLElement>('[contenteditable="true"]');

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

    handles.input.textContent = text;
    handles.input.dispatchEvent(new Event("input", { bubbles: true }));
  },

  clickSend(handles) {
    handles.sendButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
};
