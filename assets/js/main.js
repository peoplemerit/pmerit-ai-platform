// This file handles main application logic and event listeners

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
  const mDarkToggle = document.getElementById('m_darkToggle');
  if (mDarkToggle) mDarkToggle.classList.toggle('active', on);
  state.dark = on;
  body.classList.toggle('dark', on);
  save('pmerit_dark', on);
}

// Set TTS
function setTTS(on) {
  ttsToggle.classList.toggle('active', on);
  const mTtsToggle = document.getElementById('m_ttsToggle');
  if (mTtsToggle) mTtsToggle.classList.toggle('active', on);
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
  const mDarkToggle = document.getElementById('m_darkToggle');
  const mTtsToggle = document.getElementById('m_ttsToggle');
  const mVoicesBtn = document.getElementById('m_voicesBtn');
  
  if (mVhToggle) mVhToggle.addEventListener('click', () => setVH(!state.vh));
  if (mSupportToggle) mSupportToggle.addEventListener('click', () => setSupport(!state.support));
  if (mDarkToggle) mDarkToggle.addEventListener('click', () => setDark(!state.dark));
  if (mTtsToggle) mTtsToggle.addEventListener('click', () => setTTS(!state.tts));
  if (mSettings) mSettings.addEventListener('click', () => {
    settingsBody.style.display = settingsBody.style.display === 'block' ? 'none' : 'block';
  });
  if (mVoicesBtn) mVoicesBtn.addEventListener('click', () => voicesModal.showModal());
  
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
  
  document.getElementById('aboutBtn').addEventListener('click', () => {
    addMessage('PMERIT AI', 'PMERIT is dedicated to providing accessible, high-quality education to learners worldwide. Our mission is to bridge educational gaps and create opportunities for personal and professional growth through innovative learning solutions.');
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
