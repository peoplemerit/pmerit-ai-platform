/**
 * Observe DOM changes for provider pages that render dynamically.
 * We use this to detect when the send button / input appears, then attach hooks.
 */
export function observeDom(
  onChange: () => void,
  options: MutationObserverInit = { childList: true, subtree: true }
): MutationObserver {
  const obs = new MutationObserver(() => {
    onChange();
  });

  obs.observe(document.documentElement, options);
  return obs;
}
