import { observeDom } from "./observer";
import { detectProvider } from "../adapters/detector";
import { injectStyleTag } from "./injector";
import { enforce } from "../enforcement/engine";
import type { GateState } from "../enforcement/gates";
import type { ProviderAdapter, UiHandles } from "../adapters/interface";
import type { Violation } from "../enforcement/violations";

// Track attached elements to avoid duplicate listeners
const attachedButtons = new WeakSet<HTMLElement>();

/**
 * Fetch gate state from background service worker.
 */
async function getGateState(): Promise<GateState> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GATE_GET_STATE" }, (response) => {
      if (response?.ok && response.data?.state) {
        resolve(response.data.state as GateState);
      } else {
        resolve({});
      }
    });
  });
}

/**
 * Get input text from provider UI handles.
 */
function getInputText(handles: UiHandles): string {
  if (!handles.input) return "";

  if (handles.input instanceof HTMLTextAreaElement) {
    return handles.input.value;
  }

  // contenteditable
  return handles.input.textContent ?? "";
}

/**
 * Show enforcement block overlay.
 */
function showBlockOverlay(violations: Violation[]): void {
  // Remove existing overlay if any
  const existing = document.getElementById("aixord-block-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "aixord-block-overlay";
  overlay.innerHTML = `
    <div class="aixord-block-modal">
      <div class="aixord-block-header">
        <span class="aixord-block-icon">⚠️</span>
        <h2>AIXORD Enforcement</h2>
      </div>
      <div class="aixord-block-body">
        <p>Your prompt was blocked due to governance violations:</p>
        <ul>
          ${violations.map(v => `<li><strong>${v.code}</strong>: ${v.message}</li>`).join("")}
        </ul>
      </div>
      <div class="aixord-block-footer">
        <button class="aixord-block-dismiss">Dismiss</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Dismiss handler
  overlay.querySelector(".aixord-block-dismiss")?.addEventListener("click", () => {
    overlay.remove();
  });

  // Click outside to dismiss
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

/**
 * Intercept send button click and run enforcement.
 */
function interceptSend(
  adapter: ProviderAdapter,
  handles: UiHandles,
  originalClick: (e: Event) => void
): (e: Event) => void {
  return async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const userText = getInputText(handles);
    if (!userText.trim()) {
      // Empty input, allow native behavior
      originalClick(e);
      return;
    }

    console.log("[AIXORD] intercepted send, running enforcement...");

    // Get current gate state
    const gateState = await getGateState();

    // Run enforcement
    const result = enforce({ userText, gateState });
    const blockingViolations = result.violations.filter(v => v.severity === "BLOCK");

    if (blockingViolations.length > 0) {
      console.log("[AIXORD] BLOCKED:", blockingViolations);
      showBlockOverlay(blockingViolations);
      return;
    }

    // Log any warnings
    const warnings = result.violations.filter(v => v.severity === "WARN");
    if (warnings.length > 0) {
      console.log("[AIXORD] warnings:", warnings);
    }

    // If prompt was rewritten, update input
    if (result.outboundPrompt !== userText && adapter.setInputText) {
      adapter.setInputText(result.outboundPrompt, handles);
    }

    console.log("[AIXORD] enforcement passed, allowing send");

    // Allow the send - click programmatically since we prevented the original
    if (adapter.clickSend) {
      // Small delay to let UI update
      setTimeout(() => {
        adapter.clickSend!(handles);
      }, 10);
    }
  };
}

/**
 * Attach enforcement to send button.
 */
function attachEnforcement(adapter: ProviderAdapter, handles: UiHandles): boolean {
  const { sendButton } = handles;
  if (!sendButton || attachedButtons.has(sendButton)) {
    return false;
  }

  console.log(`[AIXORD] attaching enforcement to ${adapter.id} send button`);

  // Mark as attached
  attachedButtons.add(sendButton);

  // Store original handler reference (for passthrough on empty/allowed)
  const originalClick = () => {
    sendButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  };

  // Add our interceptor with capture to run first
  sendButton.addEventListener("click", interceptSend(adapter, handles, originalClick), { capture: true });

  return true;
}

function logHandles(providerId: string, input: HTMLElement | null, sendButton: HTMLElement | null) {
  const hasInput = Boolean(input);
  const hasSend = Boolean(sendButton);
  console.log(`[AIXORD] provider=${providerId} input=${hasInput} send=${hasSend}`);
}

function attach(): void {
  const adapter = detectProvider(window.location);
  const handles = adapter.findUi();

  logHandles(adapter.id, handles.input, handles.sendButton);

  // Attach enforcement if handles are available
  if (handles.input && handles.sendButton) {
    attachEnforcement(adapter, handles);
  }
}

function injectStyles(): void {
  injectStyleTag(`
    #aixord-block-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .aixord-block-modal {
      background: #1a1a2e;
      border: 1px solid #e94560;
      border-radius: 12px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(233, 69, 96, 0.3);
    }
    .aixord-block-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid #333;
    }
    .aixord-block-icon {
      font-size: 24px;
    }
    .aixord-block-header h2 {
      margin: 0;
      color: #e94560;
      font-size: 18px;
      font-weight: 600;
    }
    .aixord-block-body {
      padding: 20px;
      color: #eee;
    }
    .aixord-block-body p {
      margin: 0 0 12px 0;
    }
    .aixord-block-body ul {
      margin: 0;
      padding-left: 20px;
    }
    .aixord-block-body li {
      margin: 8px 0;
      color: #ccc;
    }
    .aixord-block-body li strong {
      color: #e94560;
    }
    .aixord-block-footer {
      padding: 16px 20px;
      border-top: 1px solid #333;
      display: flex;
      justify-content: flex-end;
    }
    .aixord-block-dismiss {
      background: #e94560;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .aixord-block-dismiss:hover {
      background: #d63651;
    }
  `);
}

function boot(): void {
  console.log("[AIXORD] content script loaded");

  // Inject overlay styles
  injectStyles();

  // Initial attach
  attach();

  // Re-attach on DOM changes (provider UIs are dynamic)
  observeDom(() => {
    attach();
  });
}

boot();
