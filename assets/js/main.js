/**
 * PMERIT Platform - Main Application Logic
 * Version: 3.0 (Modular - Fixed IDs)
 * Last Updated: October 12, 2025
 * 
 * Handles: Menu system, toggles, state management, initialization
 * IDs updated to match index.html camelCase naming
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
  init();
});

function init() {
  console.log('🚀 PMERIT Platform initializing...');
  
  // Load saved state
  loadState();
  
  // Initialize all components
  initializeMenu();
  initializeToggles();
  initializeCollapsible();
  initializeCareerTrack();
  
  console.log('✅ PMERIT Platform initialized');
}

// ========== MENU SYSTEM ==========
function initializeMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  if (hamburgerBtn && sideMenu && menuOverlay) {
    // Open menu
    hamburgerBtn.addEventListener('click', () => {
      sideMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Close menu (overlay click)
    menuOverlay.addEventListener('click', () => {
      sideMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // ESC key closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// ========== TOGGLE SWITCHES ==========
function initializeToggles() {
  // Get all toggle elements
  const toggles = document.querySelectorAll('[data-toggle]');
  
  toggles.forEach(toggle => {
    const toggleType = toggle.getAttribute('data-toggle');
    
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const isActive = toggle.classList.contains('active');
      
      // Handle different toggle types
      switch(toggleType) {
        case 'vh':
          state.virtualHuman = isActive;
          toggleVirtualHumanMode(isActive);
          break;
        case 'cs':
          state.customerService = isActive;
          toggleCustomerServiceMode(isActive);
          break;
        case 'dark':
          state.darkMode = isActive;
          toggleDarkMode(isActive);
          break;
        case 'tts':
          state.textToSpeech = isActive;
          toggleTextToSpeech(isActive);
          break;
      }
      
      saveState();
    });
    
    // Set initial state from saved data
    if (toggleType === 'vh' && state.virtualHuman) {
      toggle.classList.add('active');
    }
    if (toggleType === 'cs' && state.customerService) {
      toggle.classList.add('active');
    }
    if (toggleType === 'dark' && state.darkMode) {
      toggle.classList.add('active');
    }
    if (toggleType === 'tts' && state.textToSpeech) {
      toggle.classList.add('active');
    }
  });
}

function toggleVirtualHumanMode(enabled) {
  if (enabled) {
    document.body.classList.add('virtual-human-mode');
    showToast('Virtual Human Mode Enabled', 'success');
  } else {
    document.body.classList.remove('virtual-human-mode');
    showToast('Virtual Human Mode Disabled', 'info');
  }
}

function toggleCustomerServiceMode(enabled) {
  if (enabled) {
    document.body.classList.add('customer-service-mode');
    showToast('Customer Service Mode Enabled', 'success');
  } else {
    document.body.classList.remove('customer-service-mode');
    showToast('Customer Service Mode Disabled', 'info');
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

// ========== COLLAPSIBLE SECTIONS ==========
function initializeCollapsible() {
  const settingsCollapsible = document.getElementById('settingsCollapsible');
  
  if (settingsCollapsible) {
    const header = settingsCollapsible.querySelector('.collapsible-header');
    
    header?.addEventListener('click', () => {
      settingsCollapsible.classList.toggle('open');
    });
  }
}

// ========== CAREER TRACK & EXPLORE PATHS ==========
function initializeCareerTrack() {
  // Get all Career Track elements (both mobile and desktop)
  const careerTrackElements = document.querySelectorAll('.menu-item, .action');
  
  careerTrackElements.forEach(element => {
    const text = element.textContent?.trim();
    
    // Check if this is a Career Track element
    if (text && text.includes('Career Track')) {
      element.style.cursor = 'pointer';
      
      element.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🎯 Career Track clicked - Navigating to career.html');
        
        // Navigate to career page
        window.location.href = '/career.html';
        
        // Show confirmation toast
        showToast('Opening Career Paths...', 'info');
      });
    }
  });
  
  // Also handle the specific button ID from partials/header.html
  const careerTrackBtn = document.getElementById('career-track-btn');
  if (careerTrackBtn) {
    careerTrackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🎯 Career Track button clicked - Navigating to career.html');
      window.location.href = '/career.html';
      showToast('Opening Career Paths...', 'info');
    });
  }
  
  console.log('✅ Career Track navigation initialized');
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  // Remove any existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
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
  
  const textNode = document.createTextNode(' ' + message);
  toast.appendChild(icon);
  toast.appendChild(textNode);

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
  try {
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
  } catch (error) {
    console.error('Error loading state:', error);
  }
}

function saveState() {
  try {
    localStorage.setItem('pmerit-state', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
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

// ========== EXPORT FOR EXTERNAL ACCESS ==========
window.PMERIT = {
  state,
  toggleVirtualHumanMode,
  toggleCustomerServiceMode,
  toggleDarkMode,
  toggleTextToSpeech,
  showToast
};
