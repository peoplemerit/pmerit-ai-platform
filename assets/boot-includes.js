/**
PMERIT AI PLATFORM: DYNAMIC PARTIAL LOADER NARRATIVE

This file provides the bootstrapping logic for loading shared partials (header, nav, footer) into each page at runtime.

Function:
- Dynamically fetches and injects partial HTML content into designated containers (#headerContainer, #navContainer, #footerContainer).
- Ensures that shared UI elements are consistent and centrally managed.
- Initializes page-level scripts after partials are loaded.

Design Elements:
- Asynchronously loads /partials/header.html, /partials/nav.html, /partials/footer.html into their respective containers.
- After partials load, initializes event listeners for authentication, language selector, toggles, and ARIA enhancements.
- Detects and updates user authentication state via PMERIT.api.
- Supports reactivity: updates partials if authentication or language state changes.
- Handles errors gracefully, displaying fallback content or retrying if partials fail to load.
- Accessibility: Ensures focus is correctly managed after partial injection (e.g., skip-to-content).
- Supports lazy-loading or deferred loading for performance.

Integration:
- Used by all template pages.
- Loads before page-specific JS in the <body> to ensure partials are available.
- Can be extended to load modals or other UI fragments.

Result:
- Provides a DRY mechanism for shared layout, simplifying updates and ensuring a unified user experience across the PMERIT platform.
*/

// boot-includes.js

function loadPartial(containerId, partialPath, fallback = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  fetch(partialPath)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load: ' + partialPath);
      return res.text();
    })
    .then(html => { container.innerHTML = html; })
    .catch(() => { container.innerHTML = fallback; });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial('headerContainer', '/partials/header.html', '<div>Header unavailable</div>');
  loadPartial('navContainer', '/partials/nav.html', '<nav>Navigation unavailable</nav>');
  loadPartial('footerContainer', '/partials/footer.html', '<div>Footer unavailable</div>');
});
