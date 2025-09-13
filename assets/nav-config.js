/**
PMERIT AI PLATFORM: NAV-CONFIG.JS NARRATIVE

This file centralizes and manages the dynamic navigation configuration logic for the PMERIT educational platform’s left sidebar (partials/nav.html).
It serves as the single source of truth for which navigation links, toggles, and quick actions are visible or enabled based on the user’s authentication state, role, and available platform features.

SPECIFIC FUNCTION:
- Defines role-based navigation: guest, student, instructor, admin (Tier 1/2), and manages which links and toggles are shown to each.
- Exposes configuration and state for sidebar toggles (Virtual Human, Customer Service, Settings).
- Handles the logic for the Dashboard button: for guests, triggers sign-in/signup modal; for authenticated users, navigates directly to dashboard.html.
- Provides access rules and dynamic state for quick actions (e.g., Start Assessment, My Courses, Support).
- Integrates with the PMERIT.api namespace to check authentication state, fetch user roles, and persist user navigation preferences.
- Responds to user state changes by updating the sidebar UI in real time.
- Supports localization and updates navigation labels when the selected language changes.

TEMPLATE-SPECIFIC CONSTRAINT:
- Contains only navigation-related configuration and logic; no DOM injection or rendering (handled by nav.html and boot-includes.js).
- No global namespace pollution; all logic is encapsulated and exported for use by partials/nav.html and boot-includes.js.
- Must be fully compatible with DRY partial system and CSS grid layout.

SPECIFIC REQUIREMENTS:
- Provides an API (object or class) to:
  - Get the current effective navigation config for the active user/role.
  - Update the navigation config and notify the UI on changes.
  - Set and get the state of toggles (Virtual Human, Customer Service, Settings).
  - Expose quick action availability and accessor labels based on role and localization.
- All navigation and toggle actions are keyboard accessible and screen reader friendly.
- Integrates with localization system to update navigation text dynamically.

INTEGRATION:
- Imported by partials/nav.html and assets/boot-includes.js.
- All navigation rendering and updates are driven by this configuration.
- May emit or listen for custom events (e.g., navchange) for reactivity.

RESULT:
- Delivers a maintainable, extensible, and DRY-compliant navigation logic layer for the PMERIT platform, supporting role-based access, dynamic UI updates, and seamless integration with the broader frontend architecture.
**/

export const navConfig = {
  header: [
    { label: "Language", id: "lang", type: "select", options: [
      { value: "en", label: "English" },
      { value: "yo", label: "Yorùbá" },
      { value: "ig", label: "Igbo" },
      { value: "ha", label: "Hausa" }
    ]},
    { label: "Pricing", id: "pricingBtn", type: "button" },
    { label: "Sign In", id: "signInBtn", type: "button" },
    { label: "Start Learning", id: "startBtn", type: "button", primary: true }
  ],

  sidebar: {
    quickActions: [
      { label: "Virtual Human Mode", id: "vhToggle", type: "toggle", icon: "fas fa-user-astronaut" },
      { label: "Career Track & Explore Paths", id: "careerPaths", type: "action", icon: "fas fa-compass" },
      { label: "Customer Service Mode", id: "supportToggle", type: "toggle", icon: "fas fa-headset" }
    ],
    settings: [
      { label: "Dark Mode", id: "darkToggle", type: "toggle", icon: "fas fa-moon" },
      { label: "Text-to-Speech", id: "ttsToggle", type: "toggle", icon: "fas fa-volume-up" },
      { label: "Preview Voices", id: "voicesBtn", type: "action", icon: "fas fa-headphones" }
    ],
    dashboard: { label: "Dashboard", id: "dashBtn", icon: "fas fa-gauge-high" }
  },

  footer: [
    { label: "Privacy & Terms", id: "privacyBtn" },
    { label: "Contact", id: "contactBtn" },
    { label: "Partnerships", id: "partnershipsBtn" },
    { label: "Support", id: "supportBtn" }
  ]
};
