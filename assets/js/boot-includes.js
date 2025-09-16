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
  const dashBtn = document.getElementById('dashBtn');
  if (dashBtn) dashBtn.classList.toggle('guest', !state.auth);
  const mDashBtn = document.getElementById('m_dashBtn');
  if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
}
