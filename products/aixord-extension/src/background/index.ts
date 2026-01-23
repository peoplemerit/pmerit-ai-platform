import { handleMessage } from "./messaging";

// MV3 Service Worker entry point.
// Routes messages from content scripts/popup to the background layer.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // We return true to keep the message channel open for async responses.
  (async () => {
    const res = await handleMessage(message);
    sendResponse(res);
  })();

  return true;
});

// Optional: basic install hook for future migrations
chrome.runtime.onInstalled.addListener(() => {
  console.log("[AIXORD] Background service worker installed");
});
