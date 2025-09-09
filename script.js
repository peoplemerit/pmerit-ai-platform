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
const settingsHead = settingsBox.querySelector('.head');
const settingsBody = settingsBox.querySelector('.body');
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
  window.location.href = '/assessment.html';
}

// Add message to chat
function addMessage(sender, text, isUser = false) {
  if (document.getElementById('welcomeMsg')) {
    welcomeMsg.remove();
  }

  const messageEl = document.createElement('article');
  messageEl.className = 'bubble';
  
  messageEl.innerHTML = `
    <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
      <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
    </div>
    <div>
      <h3>${sender}</h3>
      <p>${text}</p>
    </div>
  `;
  
  chatBody.appendChild(messageEl);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // If TTS is enabled and it's an AI message, speak it
  if (state.tts && !isUser && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  
  // If VH mode is active, update captions
  if (state.vh && !isUser) {
    document.getElementById('captions').textContent = text;
  }
}

// Send message function
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage('You', text, true);
  
  // Clear input
  chatInput.value = '';
  count.textContent = '0/1000';
  
  // Simulate AI response
  setTimeout(() => {
    const reply = state.support
      ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, enrollment, and technical issues. What do you need assistance with?"
      : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
    addMessage('PMERIT AI', reply);
  }, 1000);
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
  darkToggle.addEventListener('click', () => setDark(!state.dark));
  ttsToggle.addEventListener('click', () => setTTS(!state.tts));
  supportToggle.addEventListener('click', () => setSupport(!state.support));
  supportShort.addEventListener('click', () => setSupport(true));
  vhToggle.addEventListener('click', () => setVH(!state.vh));
  vhQuick.addEventListener('click', () => setVH(true));
  vhShort.addEventListener('click', () => setVH(true));
  
  // Mobile toggles
  const mVhToggle = document.getElementById('m_vhToggle');
  const mSupportToggle = document.getElementById('m_supportToggle');
  const mSettings = document.getElementById('m_settings');
  
  if (mVhToggle) mVhToggle.addEventListener('click', () => setVH(!state.vh));
  if (mSupportToggle) mSupportToggle.addEventListener('click', () => setSupport(!state.support));
  if (mSettings) mSettings.addEventListener('click', () => {
    alert(`Settings: Dark Mode: ${state.dark ? 'On' : 'Off'}, TTS: ${state.tts ? 'On' : 'Off'}`);
  });
  
  // Settings collapsible
  settingsHead.addEventListener('click', () => {
    const isOpen = settingsBody.style.display === 'block';
    settingsBody.style.display = isOpen ? 'none' : 'block';
    settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
  });
  
  // Dashboard button
  dashBtn.addEventListener('click', goDashboard);
  const mDashBtn = document.getElementById('m_dashBtn');
  if (mDashBtn) mDashBtn.addEventListener('click', goDashboard);
  
  // Auth buttons
  signInBtn.addEventListener('click', () => {
    if (typeof signInModal.showModal === 'function') signInModal.showModal();
  });
  
  document.getElementById('signInCancel').addEventListener('click', () => signInModal.close());
  document.getElementById('signInGo').addEventListener('click', () => {
    const email = document.getElementById('si_email').value.trim();
    const password = document.getElementById('si_pwd').value.trim();
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }
    state.auth = true;
    save('pmerit_auth', true);
    updateDashboardVisual();
    signInModal.close();
    addMessage('PMERIT AI', `Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.`);
  });
  
  document.getElementById('signUpCancel').addEventListener('click', () => signUpModal.close());
  document.getElementById('signUpCreate').addEventListener('click', () => {
    const name = document.getElementById('su_name').value.trim();
    const email = document.getElementById('su_email').value.trim();
    const password = document.getElementById('su_pwd').value.trim();
    if (!name || !email || !password) {
      alert('Please complete all fields.');
      return;
    }
    state.auth = true;
    save('pmerit_auth', true);
    updateDashboardVisual();
    signUpModal.close();
    addMessage('PMERIT AI', `Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
  });
  
  startBtn.addEventListener('click', openAssessment);
  beginBtn.addEventListener('click', openAssessment);
  const mBeginBtn = document.getElementById('m_beginAssessment');
  if (mBeginBtn) mBeginBtn.addEventListener('click', openAssessment);
  
  document.getElementById('assessmentCancel').addEventListener('click', () => assessmentModal.close());
  document.getElementById('assessmentStart').addEventListener('click', () => {
    assessmentModal.close();
    const results = [
      "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights through dashboards and reports.",
      "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered problem solving.",
      "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities and match your interpersonal strengths."
    ];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    addMessage('PMERIT AI', randomResult);
  });
  
  // Chat functionality
  chatInput.addEventListener('input', () => {
    count.textContent = `${chatInput.value.length}/1000`;
  });
  
  sendBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Career paths
  careerPaths.addEventListener('click', () => {
    renderTracks();
    tracksModal.showModal();
  });
  
  const mCareerPaths = document.getElementById('m_careerPaths');
  if (mCareerPaths) {
    mCareerPaths.addEventListener('click', () => {
      renderTracks();
      tracksModal.showModal();
    });
  }
  
  document.getElementById('tracksClose').addEventListener('click', () => tracksModal.close());
  
  // Voices
  document.getElementById('voicesBtn').addEventListener('click', () => voicesModal.showModal());
  document.getElementById('voicesClose').addEventListener('click', () => voicesModal.close());
  document.getElementById('browserTts').addEventListener('click', () => {
    const text = document.getElementById('voiceText').value.trim();
    if (!text) return;
    if (!('speechSynthesis' in window)) {
      alert('Browser TTS not supported.');
      return;
    }
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  });
  
  // Footer buttons
  document.getElementById('privacyBtn').addEventListener('click', () => {
    addMessage('PMERIT AI', 'Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
  });
  
  document.getElementById('contactBtn').addEventListener('click', () => {
    addMessage('PMERIT AI', 'You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
  });
  
  document.getElementById('partnershipsBtn').addEventListener('click', () => {
    addMessage('PMERIT AI', 'PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
  });
  
  document.getElementById('supportBtn').addEventListener('click', () => {
    setSupport(true);
    addMessage('PMERIT AI', 'Support mode activated! I\'m now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?');
  });
  
  // Initialize rotating tips
  rotateInsights(insights);
  rotateInsights(m_insights);
  
  // Language selector
  document.getElementById('lang').addEventListener('change', function() {
    state.lang = this.value;
    save('pmerit_lang', state.lang);
    addMessage('PMERIT AI', `Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
  });

  // Pricing button
  pricingBtn.addEventListener('click', () => {
    addMessage('PMERIT AI', 'PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
  });
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
