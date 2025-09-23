const state = {
  auth: false,
  assessed: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en'
};

const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
];

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
const settingsHead = settingsBox ? settingsBox.querySelector('.head') : null;
const settingsBody = settingsBox ? settingsBox.querySelector('.body') : null;
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

// Mobile menu elements
const hamburgerToggle = document.querySelector('.hamburger-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose = document.querySelector('.menu-close');
const menuBackdrop = document.querySelector('.menu-backdrop');
const assessmentModal = document.getElementById('assessmentModal');
const tracksModal = document.getElementById('tracksModal');
const voicesModal = document.getElementById('voicesModal');
const insights = document.getElementById('insights');
const m_insights = document.getElementById('m_insights');

function initState() {
  try {
    state.dark = localStorage.getItem('pmerit_dark') === 'true';
    state.auth = localStorage.getItem('pmerit_auth') === 'true';
    state.assessed = localStorage.getItem('pmerit_assessed') === 'true';
    state.tts = localStorage.getItem('pmerit_tts') === 'true';
    state.lang = localStorage.getItem('pmerit_lang') || 'en';
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  
  body.classList.toggle('dark', state.dark);
  if (state.dark && darkToggle) {
    darkToggle.classList.add('active');
  }
  if (state.tts && ttsToggle) {
    ttsToggle.classList.add('active');
  }
  
  const langSelect = document.getElementById('lang');
  if (langSelect) {
    langSelect.value = state.lang;
  }
  const mobileLangSelect = document.getElementById('mobileLang');
  if (mobileLangSelect) {
    mobileLangSelect.value = state.lang;
  }
  updateDashboardVisual();
  updateStartButton();
  updateWelcomeMessage();
}

function save(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

function updateDashboardVisual() {
  if (dashBtn) dashBtn.classList.toggle('guest', !state.auth);
  const mDashBtn = document.getElementById('m_dashBtn');
  if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
  
  // Update start button based on auth state
  updateStartButton();
}

function updateStartButton() {
  if (!startBtn) return; // Safety check
  if (state.auth) {
    startBtn.textContent = 'Begin Assessment';
    startBtn.title = 'Start your personalized learning assessment';
  } else {
    startBtn.textContent = 'Sign Up';
    startBtn.title = 'Create your PMERIT account to get started';
  }
}

function setDark(on) {
  if (darkToggle) darkToggle.classList.toggle('active', on);
  const mDarkToggle = document.getElementById('m_darkToggle');
  if (mDarkToggle) mDarkToggle.classList.toggle('active', on);
  state.dark = on;
  body.classList.toggle('dark', on);
  save('pmerit_dark', on);
}

function setTTS(on) {
  if (ttsToggle) ttsToggle.classList.toggle('active', on);
  const mTtsToggle = document.getElementById('m_ttsToggle');
  if (mTtsToggle) mTtsToggle.classList.toggle('active', on);
  state.tts = on;
  save('pmerit_tts', on);
  if (!on && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

function updateWelcomeMessage() {
  if (!welcomeCopy) return;
  
  let greeting;
  if (state.support) {
    greeting = "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?";
  } else if (!state.auth) {
    greeting = "Hi there! I'm your learning companion, empowering your education through innovation. PMERIT provides accessible, high-quality education that opens doors to endless opportunities worldwide. Ready to discover your potential and start your learning journey?";
  } else if (state.auth && !state.assessed) {
    greeting = "Welcome back! Ready to discover your perfect learning path? Let's start with a quick assessment to personalize your experience.";
  } else {
    greeting = "Welcome back, Merit! Ready to continue your learning path? I'm here to help you achieve your goals.";
  }
  
  if (welcomeCopy) welcomeCopy.textContent = greeting;
}

function setSupport(on) {
  if (supportToggle) supportToggle.classList.toggle('active', on);
  const mSupportToggle = document.getElementById('m_supportToggle');
  if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
  state.support = on;
  if (supportBadge) supportBadge.style.display = on ? 'inline-flex' : 'none';
  updateWelcomeMessage();
}

function setVH(on) {
  if (vhToggle) vhToggle.classList.toggle('active', on);
  const mVhToggle = document.getElementById('m_vhToggle');
  if (mVhToggle) mVhToggle.classList.toggle('active', on);
  state.vh = on;
  
  if (on) {
    if (textChat) textChat.style.display = 'none';
    if (vhStage) vhStage.style.display = 'flex';
    if (vhAvatar) vhAvatar.classList.add('active');
    if (vhBadge) vhBadge.style.display = 'inline-flex';
    const captions = document.getElementById('captions');
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
    window.location.href = 'learner-portal.html';
  } else {
    if (typeof signUpModal.showModal === 'function') {
      signUpModal.showModal();
    }
  }
}

function openAssessment() {
  if (typeof assessmentModal.showModal === 'function') {
    assessmentModal.showModal();
  }
}

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

// Mobile Menu Functions
function openMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerToggle?.setAttribute('aria-expanded', 'true');
    
    // Create backdrop if it doesn't exist
    if (!document.querySelector('.menu-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'menu-backdrop';
      backdrop.addEventListener('click', closeMobileMenu);
      document.body.appendChild(backdrop);
    }
    
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerToggle?.setAttribute('aria-expanded', 'false');
    
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Initialize mobile menu event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Hamburger toggle
  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', function() {
      const isOpen = mobileMenu?.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }
  
  // Close button
  if (menuClose) {
    menuClose.addEventListener('click', closeMobileMenu);
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
    }
  });
  
  // Close menu when clicking menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
  });
  
  // Sync mobile menu actions with main buttons
  const menuSignUp = document.getElementById('menuSignUp');
  const menuSignIn = document.getElementById('menuSignIn');
  
  if (menuSignUp && startBtn) {
    menuSignUp.addEventListener('click', function() {
      closeMobileMenu();
      startBtn.click();
    });
  }
  
  if (menuSignIn && signInBtn) {
    menuSignIn.addEventListener('click', function() {
      closeMobileMenu();
      signInBtn.click();
    });
  }

  // Footer button functionality
  const privacyBtn = document.getElementById('privacyBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  if (privacyBtn) {
    privacyBtn.addEventListener('click', function() {
      window.location.href = 'privacy.html';
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
      // Open settings modal or navigate to settings page
      // For now, we'll just show an alert - you can customize this
      alert('Settings functionality will be implemented here');
    });
  }
});
