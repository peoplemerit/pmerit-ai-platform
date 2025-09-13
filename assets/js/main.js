/**
 * PMERIT MAIN.JS: Blueprint-accurate, DRY, modular, and with all sidebar/settings/career track functionality.
 * - Settings accordion is fully accessible and matches blueprint.
 * - Dark Mode, TTS, Preview Voices: all functional.
 * - "Career Track & Explore Paths": opens modal with blueprint look.
 */

const state = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en',
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
  if (darkToggle) {
    darkToggle.classList.toggle('active', on);
    darkToggle.setAttribute('aria-pressed', !!on);
  }
  state.dark = on;
  document.body.classList.toggle('dark', on);
  save('pmerit_dark', on);
}
function setTTS(on) {
  const ttsToggle = $('ttsToggle');
  if (ttsToggle) {
    ttsToggle.classList.toggle('active', on);
    ttsToggle.setAttribute('aria-pressed', !!on);
  }
  state.tts = on;
  save('pmerit_tts', on);
  if (!on && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}
function setSupport(on) {
  const supportToggle = $('supportToggle');
  if (supportToggle) {
    supportToggle.classList.toggle('active', on);
    supportToggle.setAttribute('aria-pressed', !!on);
  }
  const mSupportToggle = $('m_supportToggle');
  if (mSupportToggle) {
    mSupportToggle.classList.toggle('active', on);
    mSupportToggle.setAttribute('aria-pressed', !!on);
  }
  state.support = on;
  const supportBadge = $('supportBadge');
  if (supportBadge) supportBadge.style.display = on ? 'inline-flex' : 'none';
  const welcomeCopy = $('welcomeCopy');
  if (welcomeCopy) {
    welcomeCopy.textContent = on
      ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
      : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your best path?";
  }
}
function setVH(on) {
  const vhToggle = $('vhToggle');
  if (vhToggle) {
    vhToggle.classList.toggle('active', on);
    vhToggle.setAttribute('aria-pressed', !!on);
  }
  const mVhToggle = $('m_vhToggle');
  if (mVhToggle) {
    mVhToggle.classList.toggle('active', on);
    mVhToggle.setAttribute('aria-pressed', !!on);
  }
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
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
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
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
    tracksList.appendChild(card);
  });
}

// --- Settings Collapsible (accordion) ---
function setupSettingsCollapsible() {
  const settingsBox = $('settingsBox');
  if (!settingsBox) return;
  const settingsHead = settingsBox.querySelector('.head');
  const settingsBody = settingsBox.querySelector('.body');
  function setExpanded(expanded) {
    settingsBox.classList.toggle('expanded', expanded);
    settingsHead.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    settingsBody.style.display = expanded ? 'block' : 'none';
  }
  setExpanded(false);
  settingsHead.onclick = () => setExpanded(settingsBody.style.display !== 'block');
  settingsHead.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') settingsHead.click();
  };
}

// --- Modal Cancel Button Handlers ---
function setupModalCancel() {
  // Sign Up Cancel
  const signUpCancel = $('signUpCancel');
  const signUpModal = $('signUpModal');
  if (signUpCancel && signUpModal) {
    signUpCancel.onclick = () => signUpModal.close();
  }
  // Sign In Cancel
  const signInCancel = $('signInCancel');
  const signInModal = $('signInModal');
  if (signInCancel && signInModal) {
    signInCancel.onclick = () => signInModal.close();
  }
  // Assessment Cancel
  const assessmentCancel = $('assessmentCancel');
  const assessmentModal = $('assessmentModal');
  if (assessmentCancel && assessmentModal) {
    assessmentCancel.onclick = () => assessmentModal.close();
  }
  // Tracks Close
  const tracksClose = $('tracksClose');
  const tracksModal = $('tracksModal');
  if (tracksClose && tracksModal) {
    tracksClose.onclick = () => tracksModal.close();
  }
  // Voices Close
  const voicesClose = $('voicesClose');
  const voicesModal = $('voicesModal');
  if (voicesClose && voicesModal) {
    voicesClose.onclick = () => voicesModal.close();
  }
}

// --- Sidebar Toggles & Actions ---
function setupSidebarToggles() {
  // VH Toggle
  const vhToggle = $('vhToggle');
  if (vhToggle) {
    vhToggle.onclick = () => setVH(!state.vh);
    vhToggle.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') vhToggle.click(); };
  }
  // Support Toggle
  const supportToggle = $('supportToggle');
  if (supportToggle) {
    supportToggle.onclick = () => setSupport(!state.support);
    supportToggle.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') supportToggle.click(); };
  }
  // Dark Mode Toggle
  const darkToggle = $('darkToggle');
  if (darkToggle) {
    darkToggle.onclick = () => setDark(!state.dark);
    darkToggle.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') darkToggle.click(); };
  }
  // TTS Toggle
  const ttsToggle = $('ttsToggle');
  if (ttsToggle) {
    ttsToggle.onclick = () => setTTS(!state.tts);
    ttsToggle.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') ttsToggle.click(); };
  }
  // Preview Voices
  const voicesBtn = $('voicesBtn');
  if (voicesBtn) {
    voicesBtn.onclick = () => {
      const modal = $('voicesModal');
      if (modal && typeof modal.showModal === 'function') modal.showModal();
    };
    voicesBtn.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') voicesBtn.click(); };
  }
  // Dashboard
  const dashBtn = $('dashBtn');
  if (dashBtn) {
    dashBtn.onclick = goDashboard;
    dashBtn.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') dashBtn.click(); };
  }
  // Career Paths
  const careerPaths = $('careerPaths');
  if (careerPaths) {
    careerPaths.onclick = () => {
      renderTracks();
      const tracksModal = $('tracksModal');
      if (tracksModal && typeof tracksModal.showModal === 'function') tracksModal.showModal();
    };
    careerPaths.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') careerPaths.click(); };
  }
}

// --- Rotating Tips Example ---
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

// --- Full Initialization (after partials load) ---
function mainInitAfterPartials() {
  initState();
  if (state.dark) setDark(true);
  if (state.tts) setTTS(true);
  updateDashboardVisual();
  setupSettingsCollapsible();
  setupSidebarToggles();
  setupModalCancel();
  rotateInsights($('insights'));
  rotateInsights($('m_insights'));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mainInitAfterPartials);
} else {
  mainInitAfterPartials();
}

// --- Export handlers for boot-includes.js ---
window.setVH = setVH;
window.setSupport = setSupport;
window.setDark = setDark;
window.setTTS = setTTS;
window.goDashboard = goDashboard;
window.openAssessment = openAssessment;
window.renderTracks = renderTracks;
window.state = state;
