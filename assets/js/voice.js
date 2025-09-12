/**
PMERIT AI PLATFORM: VOICE.JS NARRATIVE

This file implements text-to-speech (TTS) and speech synthesis features for the PMERIT educational platform’s frontend.  
It enables the PMERIT AI, Virtual Human, and assessment systems to read content aloud to users, supporting accessibility, language diversity, and multimodal learning.

SPECIFIC FUNCTION:
- Provides JavaScript functions and event handlers for converting text content and AI responses into spoken audio using the browser’s Web Speech API (speechSynthesis).
- Allows users to toggle TTS mode, select different voices (including local accent and language support when available), and preview available voices.
- Integrates with chat, assessment, and learning content flows, reading out AI messages, assessment questions, or guidance when TTS is enabled.
- Supports dynamic voice selection for multiple languages (English, Yorùbá, Igbo, Hausa) and adapts to user/system preferences.
- Handles accessibility and ARIA: ensures TTS controls and announcements are screen reader friendly and keyboard accessible.
- Provides callback hooks or emits events for TTS status (start, end, error), allowing UI feedback (e.g., “Speaking…”, “Speech ended”, error messages).

TEMPLATE-SPECIFIC CONSTRAINT:
- All logic must be encapsulated in the PMERIT Voice namespace or as ES6 modules.
- No global namespace pollution; integrates with the PMERIT.api and broader frontend state.
- Works with markup from /partials/body.html (e.g., TTS toggle, voicesBtn) and interacts with chat.js for reading chat bubbles and assessment.js for reading questions.
- Must not interfere with normal keyboard navigation, chat input, or assessment flows.
- All code must be compatible with modern browsers and degrade gracefully if the Web Speech API is unavailable.

SPECIFIC REQUIREMENTS:
- TTS Toggle: Enables/disables TTS on user request.
- Voice Selection: Lists and previews all available voices, prioritizing PMERIT-supported languages and accents.
- Speak Function: Reads arbitrary text; used by chat.js, assessment.js, and other modules.
- Stop Function: Interrupts current speech when toggled off or when a new utterance is requested.
- Accessibility: All controls are properly labeled for screen readers and keyboard accessible.
- Integrates with PMERIT.api for user preferences (persisting TTS state/voice selection).

INTEGRATION:
- Loaded on all pages with chat or assessment capability, after DOM and core partials are ready.
- Works alongside main.js and chat.js for seamless multimodal interaction.
- May trigger or respond to events for TTS status, updating UI as needed (e.g., set aria-live, update button states).
- All TTS-related UI and state persist via PMERIT.api or localStorage, supporting both guest and authenticated users.

RESULT:
- Delivers a robust, accessible, and multilingual text-to-speech experience that enhances learning and platform accessibility for all PMERIT users.
**/
