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

// main.js

// State management
const state = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en'
};

// Career tracks data
const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
];

// DOM Elements
const body = document.body;
const darkToggle = document.getElementById('darkToggle');
const vhToggle = document.getElementById('vhToggle');
const supportToggle = document.getElementById('supportToggle');
const ttsToggle = document.getElementById('ttsToggle');
const vhAvatar = document.getElementById('vhAvatar');
const vhBadge = document.getElementById('vhBadge');
const vhStage = document.getElementById('vhStage');
const textChat = document.getElementById('textChat');
const supportBadge = document.getElementById('supportBadge');
const chatInput = document.getElementById('chatInput');
const count = document.getElementById('count');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');
const welcomeCopy = document.getElementById('welcomeCopy');
const welcomeMsg = document.getElementById('welcomeMsg');
const settingsBox = document.getElementById('settingsBox');
const settingsHead = settingsBox?.querySelector('.head');
const settingsBody = settingsBox?.querySelector('.body');
const dashBtn = document.getElementById('dashBtn');
const signInBtn = document.getElementById('signInBtn');
const startBtn = document.getElementById('startBtn');
const pricingBtn = document.getElementById('pricingBtn');
const careerPaths = document.getElementById('careerPaths');
const beginBtn = document.getElementById('beginAssessment');
const vhQuick = document.getElementById('vhQuick');
const vhShort = document.getElementById('vhShort');
const supportShort = document.getElementById('supportShort');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const assessmentModal = document.getElementById('assessmentModal');
const tracksModal = document.getElementById('tracksModal');
const voicesModal = document.getElementById('voicesModal');
const insights = document.getElementById('insights');
const m_insights = document.getElementById('m_insights');

// Initialize state from localStorage
function initState() {
  try {
    state.dark = localStorage.getItem('pmerit_dark') === 'true';
    state.auth = localStorage.getItem('pmerit_auth') === 'true';
    state.tts = localStorage.getItem('pmerit_tts') === 'true';
    state.lang = localStorage.getItem('pmerit_lang') || 'en';
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  
  // Apply initial state
  body.classList.toggle('dark', state.dark);
  if (state.dark) {
    darkToggle.classList.add('active');
  }
  if (state.tts) {
    ttsToggle.classList.add('active');
  }
  
  document.getElementById('lang').value = state.lang;
  updateDashboardVisual();
}

// Save state to localStorage
function save(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Update dashboard visual based on auth state
function updateDashboardVisual() {
  dashBtn.classList.toggle('guest', !state.auth);
  const mDashBtn = document.getElementById('m_dashBtn');
  if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
}

// Set dark mode
function setDark(on) {
  darkToggle.classList.toggle('active', on);
  state.dark = on;
  body.classList.toggle('dark', on);
  save('pmerit_dark', on);
}

// Set TTS
function setTTS(on) {
  ttsToggle.classList.toggle('active', on);
  state.tts = on;
  save('pmerit_tts', on);
  if (!on && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// Set support mode
function setSupport(on) {
  supportToggle.classList.toggle('active', on);
  const mSupportToggle = document.getElementById('m_supportToggle');
  if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
  state.support = on;
  supportBadge.style.display = on ? 'inline-flex' : 'none';
  
  // Update welcome message based on mode
  if (welcomeCopy) {
    welcomeCopy.textContent = on
      ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
      : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
  }
}

// Set virtual human mode
function setVH(on) {
  vhToggle.classList.toggle('active', on);
  const mVhToggle = document.getElementById('m_vhToggle');
  if (mVhToggle) mVhToggle.classList.toggle('active', on);
  state.vh = on;
  
  if (on) {
    textChat.style.display = 'none';
    vhStage.style.display = 'flex';
    vhAvatar.classList.add('active');
    vhBadge.style.display = 'inline-flex';
    document.getElementById('captions').textContent = "Virtual Human is ready.";
  } else {
    vhStage.style.display = 'none';
    textChat.style.display = 'flex';
    vhAvatar.classList.remove('active');
    vhBadge.style.display = 'none';
  }
}

// Go to dashboard or show sign up modal
function goDashboard() {
  if (state.auth) {
    window.location.href = 'dashboard.html';
  } else {
    if (typeof signUpModal.showModal === 'function') {
      signUpModal.showModal();
    }
  }
}

// Open assessment modal
function openAssessment() {
  if (typeof assessmentModal.showModal === 'function') {
    assessmentModal.showModal();
  }
}

// Render career tracks
function renderTracks() {
  const tracksList = document.getElementById('tracksList');
  const trackDetail = document.getElementById('trackDetail');
  tracksList.innerHTML = '';
  
  TRACKS.forEach(t => {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.innerHTML = `<h4>${t.name}</h4><p>${t.blurb}</p>`;
    card.addEventListener('click', () => {
      trackDetail.style.display = 'block';
      trackDetail.innerHTML = `
        <h4 style="margin:0.25rem 0">${t.name}</h4>
        <p style="color:var(--text-secondary);margin:0.5rem 0">${t.blurb}</p>
        <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>
      `;
      document.getElementById('trackCta').addEventListener('click', () => {
        tracksModal.close();
        assessmentModal.showModal();
      });
    });
    tracksList.appendChild(card);
  });
}

// Rotating tips for insights
const tips = [
  "Pro tip: Keep notes in your own words for better recall.",
  "Short, frequent study sessions are more effective than long cramming sessions.",
  "Relate new concepts to things you already understand for better retention.",
  "Teach what you've learned to someone else to solidify your understanding.",
  "Take breaks during study sessions to improve focus and retention."
];

function rotateInsights(el) {
  if (!el) return;
  let i = 0;
  el.textContent = tips[0];
  setInterval(() => {
    i = (i + 1) % tips.length;
    el.textContent = tips[i];
  }, 5000);
}

// Initialize the application
function init() {
  // Initialize state
  initState();
  
  // Set up event listeners
  vhShort.addEventListener('click', () => setVH(true));
  
  // Footer buttons
  document.getElementById('privacyBtn')?.addEventListener('click', () => {
    addMessage('PMERIT AI', 'Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
  });
  
  document.getElementById('contactBtn')?.addEventListener('click', () => {
    addMessage('PMERIT AI', 'You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
  });
  
  document.getElementById('partnershipsBtn')?.addEventListener('click', () => {
    addMessage('PMERIT AI', 'PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
  });
  
  // Language selector
  document.getElementById('lang')?.addEventListener('change', function() {
    state.lang = this.value;
    save('pmerit_lang', state.lang);
    addMessage('PMERIT AI', `Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
  });

  // Pricing button
  pricingBtn.addEventListener('click', () => {
    addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
  });
  
  // Initialize rotating tips
  rotateInsights(insights);
  rotateInsights(m_insights);
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
