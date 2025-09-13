/**
PMERIT AI PLATFORM: MAIN.JS — EXPORT ALL HANDLERS, FIX BOOT-INCLUDES INTEGRATION

- Ensures ALL handler functions (including renderTracks) are attached to window before boot-includes.js runs.
- All button/events are robust and blueprint-accurate.
**/

const state = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en'
};

function $(id) { return document.getElementById(id); }

// --- Persistent State ---
function initState() {
  try {
    state.dark = localStorage.getItem('pmerit_dark') === 'true';
    state.auth = localStorage.getItem('pmerit_auth') === 'true';
    state.tts = localStorage.getItem('pmerit_tts') === 'true';
    state.lang = localStorage.getItem('pmerit_lang') || 'en';
  } catch (e) { console.error('Error loading state from localStorage:', e); }
}
function save(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (e) {}
}
function updateDashboardVisual() {
  const dashBtn = $('dashBtn');
  if (dashBtn) dashBtn.classList.toggle('guest', !state.auth);
  const mDashBtn = $('m_dashBtn');
  if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
}
function setDark(on) {
  const darkToggle = $('darkToggle');
  if (darkToggle) darkToggle.classList.toggle('active', on);
  state.dark = on;
  document.body.classList.toggle('dark', on);
  save('pmerit_dark', on);
}
function setTTS(on) {
  const ttsToggle = $('ttsToggle');
  if (ttsToggle) ttsToggle.classList.toggle('active', on);
  state.tts = on;
  save('pmerit_tts', on);
  if (!on && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}
function setSupport(on) {
  const supportToggle = $('supportToggle');
  if (supportToggle) supportToggle.classList.toggle('active', on);
  const mSupportToggle = $('m_supportToggle');
  if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
  state.support = on;
  const supportBadge = $('supportBadge');
  if (supportBadge) supportBadge.style.display = on ? 'inline-flex' : 'none';
  const welcomeCopy = $('welcomeCopy');
  if (welcomeCopy) {
    welcomeCopy.textContent = on
      ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
      : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your path?";
  }
}
function setVH(on) {
  const vhToggle = $('vhToggle');
  if (vhToggle) vhToggle.classList.toggle('active', on);
  const mVhToggle = $('m_vhToggle');
  if (mVhToggle) mVhToggle.classList.toggle('active', on);
  state.vh = on;
  const textChat = $('textChat');
  const vhStage = $('vhStage');
  const vhAvatar = $('vhAvatar');
  const vhBadge = $('vhBadge');
  if (on) {
    if (textChat) textChat.style.display = 'none';
    if (vhStage) vhStage.style.display = 'flex';
    if (vhAvatar) vhAvatar.classList.add('active');
    if (vhBadge) vhBadge.style.display = 'inline-flex';
    const captions = $('captions');
    if (captions) captions.textContent = "Virtual Human is ready.";
  } else {
    if (vhStage) vhStage.style.display = 'none';
    if (textChat) textChat.style.display = 'flex';
    if (vhAvatar) vhAvatar.classList.remove('active');
    if (vhBadge) vhBadge.style.display = 'none';
  }
}
function goDashboard() {
  if (state.auth) {
    window.location.href = 'dashboard.html';
  } else {
    const signUpModal = $('signUpModal');
    if (signUpModal && typeof signUpModal.showModal === 'function') {
      signUpModal.showModal();
    }
  }
}
function openAssessment() {
  const assessmentModal = $('assessmentModal');
  if (assessmentModal && typeof assessmentModal.showModal === 'function') {
    assessmentModal.showModal();
  }
}
const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
];
function renderTracks() {
  const tracksList = $('tracksList');
  const trackDetail = $('trackDetail');
  if (!tracksList || !trackDetail) return;
  tracksList.innerHTML = '';
  trackDetail.style.display = 'none';
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
      $('trackCta').addEventListener('click', () => {
        $('tracksModal').close();
        openAssessment();
      });
    });
    tracksList.appendChild(card);
  });
}

// --- Rotating Tips ---
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

// --- BOOT-INCLUDES HANDLERS ---
function handleLanguageChange(e) {
  state.lang = e.target.value;
  save('pmerit_lang', state.lang);
  addMessage('PMERIT AI', `Language changed to ${e.target.options[e.target.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
}
function handleReadAbout() {
  addMessage('PMERIT AI', 'PMERIT is a platform for accessible, high-quality global education. You can explore our courses, certifications, and personalized career tracks, or chat with our AI for guidance.');
}
function handlePricingClick() {
  addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support.');
}
function handlePrivacyClick() {
  addMessage('PMERIT AI', 'Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
}
function handleContactClick() {
  addMessage('PMERIT AI', 'You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
}
function handlePartnershipsClick() {
  addMessage('PMERIT AI', 'PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
}
function handleMobileSettings() {
  const settingsBox = $('settingsBox');
  if (settingsBox) {
    const body = settingsBox.querySelector('.body');
    if (body) body.style.display = body.style.display === 'block' ? 'none' : 'block';
  }
}

// --- Collapsible/Accordion Logic ---
function setupSettingsCollapsible() {
  const settingsBox = $('settingsBox');
  if (!settingsBox) return;
  const settingsHead = settingsBox.querySelector('.head');
  const settingsBody = settingsBox.querySelector('.body');
  if (!settingsHead || !settingsBody) return;
  settingsBody.style.display = 'none';
  settingsHead.querySelector('i.fas').className = 'fas fa-chevron-down';
  settingsHead.onclick = () => {
    const isOpen = settingsBody.style.display === 'block';
    settingsBody.style.display = isOpen ? 'none' : 'block';
    settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-chevron-down' : 'fas fa-sliders-h';
  };
}
function setupMobileAccordions() {
  // Optionally: add auto-close logic or other enhancements
}

// --- Full Initialization (after partials load) ---
function mainInitAfterPartials() {
  initState();
  const langSel = $('lang');
  if (langSel) langSel.value = state.lang;
  if (state.dark) setDark(true);
  if (state.tts) setTTS(true);
  updateDashboardVisual();
  setupSettingsCollapsible();
  setupMobileAccordions();
  rotateInsights($('insights'));
  rotateInsights($('m_insights'));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mainInitAfterPartials);
} else {
  mainInitAfterPartials();
}

// --- Export all handlers to window for boot-includes.js ---
window.setVH = setVH;
window.setSupport = setSupport;
window.setDark = setDark;
window.setTTS = setTTS;
window.goDashboard = goDashboard;
window.openAssessment = openAssessment;
window.renderTracks = renderTracks;
window.handleLanguageChange = handleLanguageChange;
window.handleReadAbout = handleReadAbout;
window.handlePrivacyClick = handlePrivacyClick;
window.handleContactClick = handleContactClick;
window.handlePartnershipsClick = handlePartnershipsClick;
window.handlePricingClick = handlePricingClick;
window.handleMobileSettings = handleMobileSettings;
window.state = state;
