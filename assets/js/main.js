/**
 * PMERIT Platform - Main Application Logic
 * Version: 2.2 (Phase 4 - Modal System)
 * Last Updated: October 2025
 * 
 * Includes: Menu system, toggles, modals (Sign In/Sign Up), chat integration
 */

// ========== STATE MANAGEMENT ==========
const state = {
  virtualHuman: false,
  customerService: false,
  darkMode: false,
  textToSpeech: false,
  language: 'en',
  authenticated: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 PMERIT Platform initializing...');
  init();
});

function init() {
  // Load saved state
  loadState();
  
  // Initialize all components
  initializeMenu();
  initializeAuth();
  initializeToggles();
  initializeLanguageSwitcher();
  initializeModals();
  initializeChat();
  
  console.log('✅ PMERIT Platform initialized successfully');
}

// ========== MENU SYSTEM ==========
function initializeMenu() {
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menuCloseBtn = document.getElementById('menu-close-btn');

  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', openMenu);
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // ESC key closes menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hamburgerMenu && hamburgerMenu.getAttribute('aria-hidden') === 'false') {
      closeMenu();
    }
  });
}

function openMenu() {
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const hamburgerMenu = document.getElementById('hamburger-menu');

  if (hamburgerMenu) {
    hamburgerMenu.classList.add('active');
    hamburgerMenu.setAttribute('aria-hidden', 'false');
  }

  if (menuOverlay) {
    menuOverlay.classList.add('active');
    menuOverlay.setAttribute('aria-hidden', 'false');
  }

  if (hamburgerToggle) {
    hamburgerToggle.setAttribute('aria-expanded', 'true');
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const hamburgerMenu = document.getElementById('hamburger-menu');

  if (hamburgerMenu) {
    hamburgerMenu.classList.remove('active');
    hamburgerMenu.setAttribute('aria-hidden', 'true');
  }

  if (menuOverlay) {
    menuOverlay.classList.remove('active');
    menuOverlay.setAttribute('aria-hidden', 'true');
  }

  if (hamburgerToggle) {
    hamburgerToggle.setAttribute('aria-expanded', 'false');
  }

  // Restore body scroll
  document.body.style.overflow = '';
}

// ========== AUTHENTICATION ==========
function initializeAuth() {
  const signInBtn = document.getElementById('sign-in-btn');
  const menuSignIn = document.getElementById('menu-sign-in');

  if (signInBtn) {
    signInBtn.addEventListener('click', openAuthModal);
  }

  if (menuSignIn) {
    menuSignIn.addEventListener('click', () => {
      closeMenu();
      openAuthModal();
    });
  }
}

function openAuthModal() {
  const signInModal = document.getElementById('sign-in-modal');
  if (signInModal) {
    signInModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const signInModal = document.getElementById('sign-in-modal');
  const signUpModal = document.getElementById('sign-up-modal');
  
  if (signInModal) {
    signInModal.setAttribute('aria-hidden', 'true');
  }
  
  if (signUpModal) {
    signUpModal.setAttribute('aria-hidden', 'true');
  }
  
  document.body.style.overflow = '';
}

// ========== TOGGLE SWITCHES ==========
function initializeToggles() {
  // Virtual Human Mode
  const virtualHumanToggle = document.getElementById('virtual-human-toggle');
  if (virtualHumanToggle) {
    virtualHumanToggle.checked = state.virtualHuman;
    virtualHumanToggle.addEventListener('change', function() {
      state.virtualHuman = this.checked;
      toggleVirtualHumanMode(this.checked);
      saveState();
    });
  }

  // Customer Service Mode
  const customerServiceToggle = document.getElementById('customer-service-toggle');
  if (customerServiceToggle) {
    customerServiceToggle.checked = state.customerService;
    customerServiceToggle.addEventListener('change', function() {
      state.customerService = this.checked;
      toggleCustomerServiceMode(this.checked);
      saveState();
    });
  }

  // Dark Mode
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.checked = state.darkMode;
    darkModeToggle.addEventListener('change', function() {
      state.darkMode = this.checked;
      toggleDarkMode(this.checked);
      saveState();
    });
  }

  // Text-to-Speech
  const ttsToggle = document.getElementById('tts-toggle');
  if (ttsToggle) {
    ttsToggle.checked = state.textToSpeech;
    ttsToggle.addEventListener('change', function() {
      state.textToSpeech = this.checked;
      toggleTextToSpeech(this.checked);
      saveState();
    });
  }

  // Desktop toggles (if present)
  const desktopVHToggle = document.getElementById('desktop-vh-toggle');
  if (desktopVHToggle) {
    desktopVHToggle.checked = state.virtualHuman;
    desktopVHToggle.addEventListener('change', function() {
      state.virtualHuman = this.checked;
      toggleVirtualHumanMode(this.checked);
      saveState();
    });
  }

  const desktopCSToggle = document.getElementById('desktop-cs-toggle');
  if (desktopCSToggle) {
    desktopCSToggle.checked = state.customerService;
    desktopCSToggle.addEventListener('change', function() {
      state.customerService = this.checked;
      toggleCustomerServiceMode(this.checked);
      saveState();
    });
  }

  const desktopDarkToggle = document.getElementById('desktop-dark-toggle');
  if (desktopDarkToggle) {
    desktopDarkToggle.checked = state.darkMode;
    desktopDarkToggle.addEventListener('change', function() {
      state.darkMode = this.checked;
      toggleDarkMode(this.checked);
      saveState();
    });
  }

  const desktopTTSToggle = document.getElementById('desktop-tts-toggle');
  if (desktopTTSToggle) {
    desktopTTSToggle.checked = state.textToSpeech;
    desktopTTSToggle.addEventListener('change', function() {
      state.textToSpeech = this.checked;
      toggleTextToSpeech(this.checked);
      saveState();
    });
  }
}

function toggleVirtualHumanMode(enabled) {
  if (enabled) {
    document.body.classList.add('virtual-human-mode');
    showToast('Virtual Human Mode Enabled', 'success');
    console.log('🤖 Virtual Human Mode: ON');
  } else {
    document.body.classList.remove('virtual-human-mode');
    showToast('Virtual Human Mode Disabled', 'info');
    console.log('🤖 Virtual Human Mode: OFF');
  }
}

function toggleCustomerServiceMode(enabled) {
  if (enabled) {
    document.body.classList.add('customer-service-mode');
    showToast('Customer Service Mode Enabled', 'success');
    console.log('💬 Customer Service Mode: ON');
  } else {
    document.body.classList.remove('customer-service-mode');
    showToast('Customer Service Mode Disabled', 'info');
    console.log('💬 Customer Service Mode: OFF');
  }
}

function toggleDarkMode(enabled) {
  if (enabled) {
    document.documentElement.setAttribute('data-theme', 'dark');
    showToast('Dark Mode Enabled', 'success');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    showToast('Dark Mode Disabled', 'info');
  }
}

function toggleTextToSpeech(enabled) {
  if (enabled) {
    document.body.classList.add('tts-enabled');
    showToast('Text-to-Speech Enabled', 'success');
    testTextToSpeech();
  } else {
    document.body.classList.remove('tts-enabled');
    showToast('Text-to-Speech Disabled', 'info');
  }
}

function testTextToSpeech() {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('Text-to-speech is now enabled.');
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ========== LANGUAGE SWITCHER ==========
function initializeLanguageSwitcher() {
  const languageBtn = document.getElementById('language-btn');
  const languageDropdown = document.getElementById('language-dropdown');
  const closeLanguageDropdown = document.getElementById('close-language-dropdown');
  const languageOptions = document.querySelectorAll('.language-option');

  if (languageBtn && languageDropdown) {
    languageBtn.addEventListener('click', function() {
      const isHidden = languageDropdown.getAttribute('aria-hidden') === 'true';
      languageDropdown.setAttribute('aria-hidden', !isHidden);
      languageDropdown.classList.toggle('active');
    });
  }

  if (closeLanguageDropdown) {
    closeLanguageDropdown.addEventListener('click', function() {
      languageDropdown.setAttribute('aria-hidden', 'true');
      languageDropdown.classList.remove('active');
    });
  }

  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      changeLanguage(lang);
      languageDropdown.setAttribute('aria-hidden', 'true');
      languageDropdown.classList.remove('active');
    });
  });
}

function changeLanguage(lang) {
  state.language = lang;
  saveState();
  showToast(`Language changed to ${lang.toUpperCase()}`, 'success');
  console.log(`🌐 Language changed to: ${lang}`);
  
  // Update active language option
  document.querySelectorAll('.language-option').forEach(opt => {
    opt.classList.remove('active');
    if (opt.getAttribute('data-lang') === lang) {
      opt.classList.add('active');
    }
  });
}

// ========== MODALS (Phase 4) ==========
function initializeModals() {
  // Sign In Modal
  const signInModal = document.getElementById('sign-in-modal');
  const signInClose = document.getElementById('sign-in-close');
  const signInBackdrop = document.getElementById('sign-in-backdrop');
  const signInForm = document.getElementById('sign-in-form');

  if (signInClose) {
    signInClose.addEventListener('click', () => {
      signInModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  if (signInBackdrop) {
    signInBackdrop.addEventListener('click', () => {
      signInModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', handleSignIn);
  }

  // Sign Up Modal
  const signUpModal = document.getElementById('sign-up-modal');
  const signUpClose = document.getElementById('sign-up-close');
  const signUpBackdrop = document.getElementById('sign-up-backdrop');
  const signUpForm = document.getElementById('sign-up-form');

  if (signUpClose) {
    signUpClose.addEventListener('click', () => {
      signUpModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  if (signUpBackdrop) {
    signUpBackdrop.addEventListener('click', () => {
      signUpModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', handleSignUp);
  }

  // Switch between modals
  const switchToSignIn = document.getElementById('switch-to-sign-in');
  const switchToSignUp = document.getElementById('switch-to-sign-up');

  if (switchToSignIn) {
    switchToSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      if (signUpModal) signUpModal.setAttribute('aria-hidden', 'true');
      if (signInModal) {
        signInModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (switchToSignUp) {
    switchToSignUp.addEventListener('click', (e) => {
      e.preventDefault();
      if (signInModal) signInModal.setAttribute('aria-hidden', 'true');
      if (signUpModal) {
        signUpModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (signInModal && signInModal.getAttribute('aria-hidden') === 'false') {
        signInModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (signUpModal && signUpModal.getAttribute('aria-hidden') === 'false') {
        signUpModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

  // Career Track Modal
  const careerTrackBtn = document.getElementById('career-track-btn');
  if (careerTrackBtn) {
    careerTrackBtn.addEventListener('click', function() {
      closeMenu();
      showToast('Career Tracks feature coming soon!', 'info');
    });
  }

  // Preview Voices Modal
  const previewVoicesBtn = document.getElementById('preview-voices-btn');
  if (previewVoicesBtn) {
    previewVoicesBtn.addEventListener('click', function() {
      closeMenu();
      showToast('Voice Preview feature coming soon!', 'info');
    });
  }

  // Dashboard
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      closeMenu();
      window.location.href = 'learner-portal.html';
    });
  }

  // Begin Assessment
  const beginAssessmentBtn = document.getElementById('begin-assessment-btn');
  if (beginAssessmentBtn) {
    beginAssessmentBtn.addEventListener('click', function() {
      closeMenu();
      window.location.href = 'assessment.html';
    });
  }

  // Desktop buttons
  const desktopCareerBtn = document.getElementById('desktop-career-btn');
  if (desktopCareerBtn) {
    desktopCareerBtn.addEventListener('click', () => {
      showToast('Career Tracks feature coming soon!', 'info');
    });
  }

  const desktopVoicesBtn = document.getElementById('desktop-voices-btn');
  if (desktopVoicesBtn) {
    desktopVoicesBtn.addEventListener('click', () => {
      showToast('Voice Preview feature coming soon!', 'info');
    });
  }

  const desktopDashboardBtn = document.getElementById('desktop-dashboard-btn');
  if (desktopDashboardBtn) {
    desktopDashboardBtn.addEventListener('click', () => {
      window.location.href = 'learner-portal.html';
    });
  }

  const desktopBeginAssessment = document.getElementById('desktop-begin-assessment');
  if (desktopBeginAssessment) {
    desktopBeginAssessment.addEventListener('click', () => {
      window.location.href = 'assessment.html';
    });
  }
}

function handleSignIn(e) {
  e.preventDefault();
  
  const email = document.getElementById('sign-in-email').value;
  const password = document.getElementById('sign-in-password').value;
  const rememberMe = document.getElementById('remember-me').checked;

  console.log('Sign In:', { email, rememberMe });
  
  // TODO: Implement actual authentication
  showToast('Sign-in feature coming soon!', 'info');
  
  // Close modal
  const signInModal = document.getElementById('sign-in-modal');
  if (signInModal) {
    signInModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function handleSignUp(e) {
  e.preventDefault();
  
  const name = document.getElementById('sign-up-name').value;
  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('sign-up-password').value;

  console.log('Sign Up:', { name, email });
  
  // TODO: Implement actual registration
  showToast('Sign-up feature coming soon!', 'info');
  
  // Close modal
  const signUpModal = document.getElementById('sign-up-modal');
  if (signUpModal) {
    signUpModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ========== CHAT INTERFACE ==========
function initializeChat() {
  const sendBtn = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-input');

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Desktop chat
  const desktopSendBtn = document.getElementById('desktop-send-btn');
  const desktopChatInput = document.getElementById('desktop-chat-input');

  if (desktopSendBtn && desktopChatInput) {
    desktopSendBtn.addEventListener('click', () => sendMessage('desktop'));
    desktopChatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage('desktop');
      }
    });
  }
}

function sendMessage(layout = 'mobile') {
  // Delegate to chat.js if available
  if (typeof window.sendMessage === 'function') {
    window.sendMessage(layout);
  } else {
    console.log('Chat functionality will be handled by chat.js');
  }
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  // Remove any existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.textContent = message;

  // Add icon based on type
  const icon = document.createElement('i');
  switch(type) {
    case 'success':
      icon.className = 'fas fa-check-circle';
      break;
    case 'error':
      icon.className = 'fas fa-exclamation-circle';
      break;
    case 'warning':
      icon.className = 'fas fa-exclamation-triangle';
      break;
    default:
      icon.className = 'fas fa-info-circle';
  }
  toast.prepend(icon);

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Toast styles (if not already in CSS)
if (!document.querySelector('style[data-toast-styles]')) {
  const toastStyles = document.createElement('style');
  toastStyles.setAttribute('data-toast-styles', '');
  toastStyles.textContent = `
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #000);
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: var(--shadow-lg, 0 4px 12px rgba(0,0,0,0.15));
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid var(--border-color, #e0e0e0);
    }
    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .toast-success {
      background: var(--success-light, #d4edda);
      color: var(--success, #155724);
      border-color: var(--success, #28a745);
    }
    .toast-error {
      background: var(--error-light, #f8d7da);
      color: var(--error, #721c24);
      border-color: var(--error, #dc3545);
    }
    .toast-warning {
      background: var(--warning-light, #fff3cd);
      color: var(--warning, #856404);
      border-color: var(--warning, #ffc107);
    }
    .toast-info {
      background: var(--primary-light, #d1ecf1);
      color: var(--primary, #0c5460);
      border-color: var(--primary, #17a2b8);
    }
  `;
  document.head.appendChild(toastStyles);
}

// ========== STATE PERSISTENCE ==========
function loadState() {
  const savedState = localStorage.getItem('pmerit-state');
  if (savedState) {
    Object.assign(state, JSON.parse(savedState));
  }

  // Apply saved state
  if (state.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (state.virtualHuman) {
    document.body.classList.add('virtual-human-mode');
  }

  if (state.customerService) {
    document.body.classList.add('customer-service-mode');
  }

  if (state.textToSpeech) {
    document.body.classList.add('tts-enabled');
  }
}

function saveState() {
  localStorage.setItem('pmerit-state', JSON.stringify(state));
}

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    openMenu,
    closeMenu,
    openAuthModal,
    closeAuthModal,
    toggleVirtualHumanMode,
    toggleCustomerServiceMode,
    showToast
  };
}
