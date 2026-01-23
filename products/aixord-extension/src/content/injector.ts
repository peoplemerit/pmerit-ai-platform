/**
 * Inject a JS file into the page context (not the extension isolated world).
 * This is useful when the provider UI uses frameworks that block direct hooking.
 *
 * NOTE: Claude blueprint references injected.js in manifest.web_accessible_resources.
 * We'll later configure the build to emit injected.js from TS (or ship a static file).
 */
export function injectScript(scriptPath: string): void {
  try {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL(scriptPath);
    s.type = "text/javascript";
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    console.warn("[AIXORD] injector failed", e);
  }
}

/**
 * Inject CSS into the page (content.css referenced by manifest).
 * For now this is a placeholder; later the build can emit content.css or
 * we can attach a style tag.
 */
export function injectStyleTag(cssText: string): void {
  const style = document.createElement("style");
  style.setAttribute("data-aixord-style", "true");
  style.textContent = cssText;
  document.head.appendChild(style);
}
