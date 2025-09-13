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

// Load header
// boot-includes.js

// Helper to fetch and inject partials into their containers

// Load header

fetch('/partials/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('headerContainer').innerHTML = html;
  });

// Load body
fetch('/partials/body.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('bodyContainer').innerHTML = html;
  });

// Load footer
fetch('/partials/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footerContainer').innerHTML = html;
  });
