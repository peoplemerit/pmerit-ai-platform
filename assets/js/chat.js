/**
PMERIT AI PLATFORM: CHAT.JS NARRATIVE

This file provides all interactive logic for the AI chat interface within the PMERIT educational platform.
It is responsible for enabling seamless, accessible, and responsive communication between users (guests or authenticated) and the platform’s AI tutor, virtual human, and support assistant.

SPECIFIC FUNCTION:
- Manages sending and receiving chat messages, including user prompts and AI responses, within the central panel of the estate layout.
- Handles chat UI behaviors: rendering message bubbles, updating the chat history, auto-scrolling, and managing input focus.
- Integrates with the backend AI endpoint (ai.pmerit.com) and relevant APIs (e.g., /api/ai/chat, /api/assessment/start) using fetch or WebSocket where appropriate.
- Supports mode switching (Tutor, Virtual Human, Support) and context-aware prompts per platform requirements.

TEMPLATE-SPECIFIC CONSTRAINT:
- No global namespace pollution; all logic must be encapsulated.
- Works with markup from /partials/body.html, using IDs/classes such as #chatInput, #sendBtn, #chatBody, #vhMode, #supportMode, etc.
- No hardcoded HTML; all DOM manipulations must be dynamic and accessible.
- All ARIA labels and roles must be preserved and updated for accessibility.
- Mobile and desktop compatibility: supports keyboard, mouse, and touch input.
- No duplicate logic with main.js—focus only on chat-specific behaviors and integration.

SPECIFIC REQUIREMENTS:
- On send: collects input, disables send button, displays user bubble, posts to AI endpoint, renders streaming or full AI response as a bubble.
- Handles error states gracefully (network/API errors) with user feedback.
- Maintains a live character count and enforces a 1000-character limit.
- Supports keyboard shortcuts (Enter to send, Shift+Enter for newline).
- Updates chat state and UI according to user authentication (guest vs. logged in).
- Integrates with assessment start/finish APIs when assessment flows are triggered from chat.
- Ensures screen reader and keyboard accessibility for all UI updates (e.g., aria-live regions).

INTEGRATION:
- Loaded on all pages with chat capability, after DOM and shared partials are ready.
- May interact with PMERIT.api for user/session context and with boot-includes.js for dynamic UI updates.
- All network requests must use appropriate API endpoints and handle authentication (token/session/cookie) as needed.

RESULT:
- Delivers a smooth, accessible, and robust AI chat experience for all PMERIT users, supporting real-time tutoring, career guidance, and support, while maintaining the platform’s design, accessibility, and DRY principles.
**/
