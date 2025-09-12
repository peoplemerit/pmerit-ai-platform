/**
PMERIT AI PLATFORM: MAIN.JS NARRATIVE

This file implements core interactive behaviors for the PMERIT frontend, enabling dynamic toggling and accessibility for key UI features. 
It is loaded globally on all main pages that use the DRY partial system and three-panel layout.

SPECIFIC FUNCTION:
- Handles click and input events for toggles (Virtual Human, Support, Dark Mode), chat input character counter, and integrates with the markup produced by /partials/body.html.
- Ensures immediate and accessible UI feedback for user actions, with ARIA and visible focus compatibility.
- Preserves layout and component integrity for both desktop and mobile breakpoints, as per the design grid.

TEMPLATE-SPECIFIC CONSTRAINT:
- No global namespace pollution; all logic runs within DOMContentLoaded.
- No changes to core layout or markup; only enhances interactivity.
- Uses only standard JavaScript and is compatible with all modern browsers.
- Does not duplicate logic handled by PMERIT.api or boot-includes.js.

SPECIFIC REQUIREMENTS:
- Virtual Human Toggle: Shows/hides the Virtual Human badge and stage.
- Support Mode Toggle: Shows/hides the Support badge and support assistant pane.
- Dark Mode Toggle: Toggles the .dark class on <body> for theme switching.
- Chat Input Counter: Live character count for chat input area (max 1000).
- All toggles and buttons must remain keyboard and screen reader accessible.
- Must work with the markup and class names defined in /partials/body.html and base.css.

INTEGRATION:
- Loaded after boot-includes.js and after partials are injected.
- Assumes the presence of the correct IDs and classes on DOM elements.
- May be extended in the future to emit events to PMERIT.api for state persistence.

RESULT:
- Provides a smooth, accessible, and responsive user experience for toggling key platform features and managing chat interactions within the PMERIT estate layout.

**/

document.addEventListener("DOMContentLoaded", () => {
  // Toggle Virtual Human Mode
  document.getElementById("vhToggle")?.addEventListener("click", () => {
    document.getElementById("vhBadge").style.display = "inline-block";
    document.getElementById("vhStage").classList.toggle("hidden");
  });

  // Toggle Support Mode
  document.getElementById("supportToggle")?.addEventListener("click", () => {
    document.getElementById("supportBadge").style.display = "inline-block";
    document.getElementById("supportAssistantPane").classList.toggle("hidden");
  });

  // Dark Mode Toggle
  document.getElementById("darkToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // Chat Input Counter
  const chatInput = document.getElementById("chatInput");
  const count = document.getElementById("count");
  chatInput?.addEventListener("input", () => {
    count.textContent = `${chatInput.value.length}/1000`;
  });
});
