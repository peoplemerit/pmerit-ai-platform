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

// Load header
fetch('/partials/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('headerContainer').innerHTML = html;
    initHeaderEvents();
  })
  .catch(err => console.error('Error loading header:', err));

// Load body
fetch('/partials/body.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('bodyContainer').innerHTML = html;
    initBodyEvents();
  })
  .catch(err => console.error('Error loading body:', err));

// Load footer
fetch('/partials/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footerContainer').innerHTML = html;
    initFooterEvents();
  })
  .catch(err => console.error('Error loading footer:', err));

function initHeaderEvents() {
  // Header-specific event listeners
  document.getElementById('lang')?.addEventListener('change', handleLanguageChange);
  document.getElementById('signInBtn')?.addEventListener('click', () => signInModal.showModal());
  document.getElementById('startBtn')?.addEventListener('click', openAssessment);
  document.getElementById('pricingBtn')?.addEventListener('click', handlePricingClick);
}

function initBodyEvents() {
  // Body-specific event listeners
  document.getElementById('vhToggle')?.addEventListener('click', () => setVH(!state.vh));
  document.getElementById('supportToggle')?.addEventListener('click', () => setSupport(!state.support));
  document.getElementById('darkToggle')?.addEventListener('click', () => setDark(!state.dark));
  document.getElementById('ttsToggle')?.addEventListener('click', () => setTTS(!state.tts));
  document.getElementById('dashBtn')?.addEventListener('click', goDashboard);
  document.getElementById('careerPaths')?.addEventListener('click', renderTracks);
  document.getElementById('beginAssessment')?.addEventListener('click', openAssessment);
  document.getElementById('vhQuick')?.addEventListener('click', () => setVH(true));
  document.getElementById('readAbout')?.addEventListener('click', handleReadAbout);
  document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
  document.getElementById('chatInput')?.addEventListener('keydown', handleChatInputKeydown);
  document.getElementById('chatInput')?.addEventListener('input', updateCharCount);
  document.getElementById('voicesBtn')?.addEventListener('click', () => voicesModal.showModal());
  
  // Mobile event listeners
  document.getElementById('m_vhToggle')?.addEventListener('click', () => setVH(!state.vh));
  document.getElementById('m_supportToggle')?.addEventListener('click', () => setSupport(!state.support));
  document.getElementById('m_dashBtn')?.addEventListener('click', goDashboard);
  document.getElementById('m_beginAssessment')?.addEventListener('click', openAssessment);
  document.getElementById('m_careerPaths')?.addEventListener('click', renderTracks);
  document.getElementById('m_settings')?.addEventListener('click', handleMobileSettings);
  
  // Settings collapsible
  const settingsHead = document.querySelector('#settingsBox .head');
  if (settingsHead) {
    settingsHead.addEventListener('click', () => {
      const isOpen = settingsBody.style.display === 'block';
      settingsBody.style.display = isOpen ? 'none' : 'block';
      settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
    });
  }
}

function initFooterEvents() {
  // Footer-specific event listeners
  document.getElementById('privacyBtn')?.addEventListener('click', handlePrivacyClick);
  document.getElementById('contactBtn')?.addEventListener('click', handleContactClick);
  document.getElementById('partnershipsBtn')?.addEventListener('click', handlePartnershipsClick);
  document.getElementById('supportBtn')?.addEventListener('click', () => setSupport(true));
}
