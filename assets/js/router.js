/**
PMERIT AI PLATFORM: ROUTER.JS NARRATIVE

This file encapsulates client-side routing and view switching logic for the PMERIT educational platform. 
It is responsible for managing navigation between major UI panels, pages, and modal flows within the single-page application (SPA)-like frontend, without triggering full page reloads.

SPECIFIC FUNCTION:
- Handles hash-based or path-based client-side navigation, enabling seamless transitions between core views (dashboard, assessment, courses, classroom, library, support, etc.) as well as in-panel navigation (right/left panels, modal overlays).
- Listens for changes in URL hash or history (pushState/replaceState/popstate).
- Dynamically loads or shows/hides relevant panels and partials in the DOM, maintaining the three-panel layout and updating the main content area accordingly.
- Ensures correct initial view rendering on page load and after authentication state changes (guest vs. user).
- Integrates with PMERIT.api for permission checks, role-based access, and redirects (e.g., redirect guests to sign-in modal if accessing restricted routes).

TEMPLATE-SPECIFIC CONSTRAINT:
- All routing must be client-side (no full reloads), compatible with Cloudflare Pages static hosting.
- Supports DRY partials (header, nav, footer), grid layout, and mobile collapse patterns.
- No global namespace pollution; all logic must be encapsulated.
- Does not duplicate navigation logic in nav-config.js, but may listen to sidebar/dashboard/action buttons for navigation events.

SPECIFIC REQUIREMENTS:
- All route/view changes must update ARIA roles, browser title, and focus for accessibility.
- Supports deep-linking: direct access to /#dashboard, /#assessment, /#courses, etc.
- Handles not-found routes and fallback views gracefully.
- May support modal or overlay routes for authentication, assessment start, or support flows.
- Handles user state transitions (guest→user, user→guest) and updates visible routes.
- Integrates with browser history API for forward/back navigation.
- All navigation actions must be keyboard accessible.

INTEGRATION:
- Loaded globally after boot-includes.js.
- Works in concert with nav.html, nav-config.js, and main partials.
- May trigger page-specific JS (e.g., assessment.js, chat.js) on view change.
- May emit or listen for custom events (e.g., routechange) for inter-component coordination.

RESULT:
- Provides a seamless, accessible, and modern SPA-style navigation experience, ensuring fast UI updates and preserving the PMERIT platform’s DRY, scalable, and accessible frontend architecture.
**/
