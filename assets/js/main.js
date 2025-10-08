/**
 * PMERIT Platform - Main Application Logic
 * Version: 2.1 (Fixed Indentation & IDs)
 * Last Updated: October 2025
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
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.classList.remove('hidden');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
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
    showToast('Text-to-Speech Enabled', 'success');
    testTextToSpeech();
  } else {
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

// ========== MODALS ==========
function initializeModals() {
  // Career Track Modal
  const careerTrackBtn = document.getElementById('career-track-btn');
  if (careerTrackBtn) {
    careerTrackBtn.addEventListener('click', function() {
      closeMenu();
      openModal('career-tracks-modal');
    });
  }

  // Preview Voices Modal
  const previewVoicesBtn = document.getElementById('preview-voices-btn');
  if (previewVoicesBtn) {
    previewVoicesBtn.addEventListener('click', function() {
      closeMenu();
      openModal('voices-modal');
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
      openModal('assessment-modal');
    });
  }

  // Close modals on backdrop click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target.closest('.modal').id);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
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
}

function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();

  if (message) {
    addMessageToChat('user', message);
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(message);
      addMessageToChat('ai', response);

      if (state.textToSpeech) {
        speakMessage(response);
      }
    }, 1500);
  }
}

function addMessageToChat(sender, message) {
  const chatBody = document.getElementById('chat-body');
  if (!chatBody) return;

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');

  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  avatar.textContent = sender === 'user' ? '👤' : '🤖';

  const content = document.createElement('div');
  content.classList.add('message-content');

  const text = document.createElement('p');
  text.classList.add('message-text');
  text.textContent = message;

  const timestamp = document.createElement('span');
  timestamp.classList.add('message-time');
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  content.appendChild(text);
  content.appendChild(timestamp);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  chatBody.appendChild(messageDiv);

  // Auto-scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getAIResponse(message) {
  const responses = [
    "I'd be happy to help you with that! Let me provide you with some information.",
    "That's a great question! Here's what I can tell you...",
    "Thank you for asking. Let me assist you with that.",
    "I understand what you're looking for. Here's my response...",
    "Excellent inquiry! Allow me to guide you through this."
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function speakMessage(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.textContent = message;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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

// Export for testing
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
