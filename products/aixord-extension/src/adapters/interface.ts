export type ProviderId = "claude" | "chatgpt" | "gemini" | "unknown";

export interface ProviderContext {
  provider: ProviderId;
  url: string;
}

export interface UiHandles {
  /** Text input element (textarea or contenteditable root) */
  input: HTMLElement | null;
  /** Send/submit button element */
  sendButton: HTMLElement | null;
}

export interface ProviderAdapter {
  id: ProviderId;

  /** Returns true if the current page appears to match this provider */
  matches(location: Location): boolean;

  /** Find key UI elements (input + send). Called repeatedly due to dynamic UIs. */
  findUi(): UiHandles;

  /** Optional: attempt to write text into the provider input */
  setInputText?(text: string, handles: UiHandles): void;

  /** Optional: attempt to click the send button */
  clickSend?(handles: UiHandles): void;
}
