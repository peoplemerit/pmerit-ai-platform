/**
 * PMERIT Platform - Main Application Logic
 * Version: 3.0 (Modular - Fixed IDs)
 * Last Updated: October 12, 2025
 * 
 * Handles: Menu system, toggles, state management, initialization
 * IDs updated to match index.html camelCase naming
 */

// ========== ANALYTICS SHIM ==========
// Provider-agnostic analytics: no-op if vendor not present
window.analytics = window.analytics || {
  track: function(event, props = {}) {
    if (window.PMERIT_DEBUG) {
      console.log('[track]', event, props);
    }
  }
};

// Helper to get page identifier
function pageId() {
  return location.pathname.includes('/portal/classroom') ? 'classroom' : 'home';
}

// ========== ERROR TRACKING ==========
// Client-side error tracking for monitoring and debugging
(function initErrorTracking() {
  // Log JavaScript errors
  window.addEventListener('error', (event) => {
    const errorInfo = {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      error: event.error?.stack || String(event.error),
      timestamp: new Date().toISOString(),
      page: pageId(),
      userAgent: navigator.userAgent
    };
    
    console.error('Client error:', errorInfo);
    
    // Track error in analytics
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('client_error', {
        message: errorInfo.message,
        source: errorInfo.source,
        page: errorInfo.page,
        timestamp: errorInfo.timestamp
      });
    }
    
    // Optional: Send to monitoring service in production
    // This can be enabled when a monitoring service like Sentry is configured
    if (window.PMERIT_ERROR_REPORTING_ENDPOINT && !window.PMERIT_DEBUG) {
      try {
        fetch(window.PMERIT_ERROR_REPORTING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo),
          keepalive: true
        }).catch(() => {
          // Silently fail if error reporting fails
        });
      } catch (e) {
        // Silently fail
      }
    }
  });

  // Log unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      reason: String(event.reason),
      promise: String(event.promise),
      timestamp: new Date().toISOString(),
      page: pageId(),
      userAgent: navigator.userAgent
    };
    
    console.error('Unhandled rejection:', errorInfo);
    
    // Track error in analytics
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('unhandled_rejection', {
        reason: errorInfo.reason,
        page: errorInfo.page,
        timestamp: errorInfo.timestamp
      });
    }
    
    // Optional: Send to monitoring service in production
    if (window.PMERIT_ERROR_REPORTING_ENDPOINT && !window.PMERIT_DEBUG) {
      try {
        fetch(window.PMERIT_ERROR_REPORTING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo),
          keepalive: true
        }).catch(() => {
          // Silently fail if error reporting fails
        });
      } catch (e) {
        // Silently fail
      }
    }
  });
})();

// ========== STATE MANAGEMENT ==========
const state = {
  virtualHuman: false,  // Default to false to show chat interface on page load
  customerService: false,
  darkMode: false,
  textToSpeech: false,
  language: 'en',
  authenticated: false,
  avatarManager: null,
  threeJSLoaded: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  try {
    init();
  } catch (error) {
    console.error('❌ PMERIT Platform initialization failed:', error);
    // Show user-friendly error
    showToast('Platform initialization error. Some features may not work.', 'error');
  }
});

/**
 * VH Bootstrap function - runs once to initialize avatar
 * Called when Virtual Human toggle is enabled
 */
window.vhBoot = async function vhBoot() {
  const modelUrl = '/assets/avatars/pm_classic.glb';
  
  try {
    if (!window.THREE || typeof THREE.WebGLRenderer !== "function") {
      const error = new Error('[VH] THREE not loaded; check script includes.');
      console.error(error.message);
      showToast('Virtual Human requires WebGL support', 'error');
      window.analytics.track('vh_init_error', {
        page: pageId(),
        ts: Date.now(),
        message: error.message
      });
      return;
    }
    if (typeof GLTFLoader !== "function" && typeof THREE?.GLTFLoader !== "function") {
      const error = new Error('[VH] GLTFLoader not available; check CDN include.');
      console.error(error.message);
      showToast('Virtual Human loader not available', 'error');
      window.analytics.track('vh_init_error', {
        page: pageId(),
        ts: Date.now(),
        message: error.message
      });
      return;
    }
    // Initialize only once
    if (window.__VH_INITED__) {
      console.log('[VH] Already initialized, skipping vhBoot');
      return;
    }
    window.__VH_INITED__ = true;

    console.log('[VH] Initializing AvatarManager with pm_classic.glb...');

    // AvatarManager should handle renderer/scene and accept modelUrl + canvas
    if (!state.avatarManager && window.AvatarManager) {
      state.avatarManager = new window.AvatarManager({
        canvasId: 'vh-canvas',
        captionsId: 'vh-captions',
        enabled: true,
        apiBaseUrl: (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api',
        // Configure to use pm_classic.glb model
        modelFile: 'pm_classic.glb',
        avatarBaseUrl: '/assets/avatars/'
      });
      await state.avatarManager.init();
      console.info("[VH] AvatarManager initialized with pm_classic.glb");
      showToast('Virtual Human ready', 'success');
      
      // Track successful initialization
      window.analytics.track('vh_init_success', {
        page: pageId(),
        ts: Date.now(),
        modelUrl: modelUrl
      });
    } else {
      console.warn('[VH] AvatarManager already exists or not available');
    }
  } catch (e) {
    console.error("[VH] init failed:", e);
    showToast('Virtual Human initialization failed', 'error');
    
    // Track initialization error
    window.analytics.track('vh_init_error', {
      page: pageId(),
      ts: Date.now(),
      message: String(e?.message || e),
      stack: e?.stack
    });
  }
};

function init() {
  console.log('🚀 PMERIT Platform initializing...');
  
  // Load saved state
  loadState();
  
  // Initialize all components - each has its own error handling
  initializeMenu();
  initializeToggles();
  initializeCollapsible();
  initializeCareerTrack();
  initializeReadAbout();
  initializeSupportButtons();
  
  // Auto-enable Virtual Human if it's set to true in state
  if (state.virtualHuman) {
    // Use requestAnimationFrame to ensure DOM is ready after all synchronous code completes
    requestAnimationFrame(() => {
      enableVirtualHuman(true).catch(error => {
        console.error('Failed to auto-enable Virtual Human:', error);
      });
    });
  }
  
  console.log('✅ PMERIT Platform initialized');
}

/**
 * Check if WebGL is supported
 * @returns {boolean}
 */
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// ========== VIRTUAL HUMAN MODE ==========
async function enableVirtualHuman(isEnabled) {
  console.log(`🤖 Virtual Human Mode: ${isEnabled ? 'ON' : 'OFF'}`);
  
  // Track toggle event
  window.analytics.track(isEnabled ? 'vh_toggle_on' : 'vh_toggle_off', {
    page: pageId(),
    ts: Date.now()
  });

  const vhRoot = document.getElementById('vh-root');
  const chatStream = document.getElementById('chat-stream');
  const statusText = document.getElementById('vh-status-text');

  if (isEnabled) {
    // Check WebGL support
    if (!isWebGLSupported()) {
      showToast('WebGL not supported. Falling back to chat mode.', 'warning');
      // Auto-switch to CSM
      state.virtualHuman = false;
      state.customerService = true;
      updateToggleStates();
      return;
    }

    try {
      // Show loading status
      if (statusText) {
        statusText.textContent = 'Virtual Human is loading...';
      }

      // Show VH viewport (remove hidden attributes)
      if (vhRoot) {
        vhRoot.classList.remove('is-hidden');
        vhRoot.removeAttribute('hidden');
        vhRoot.removeAttribute('aria-hidden');
      }

      // Ensure chat stream remains visible and accessible
      if (chatStream) {
        chatStream.style.display = 'block';
        chatStream.removeAttribute('aria-hidden');
      }

      // Add body class for any additional styling needs
      document.body.classList.add('vh-mode');

      // Use vhBoot() to initialize if not already initialized
      if (window.vhBoot) {
        await window.vhBoot();
      }

      // If already initialized, just enable it
      if (state.avatarManager && typeof state.avatarManager.setEnabled === 'function') {
        state.avatarManager.setEnabled(true);
        if (statusText) {
          statusText.textContent = 'Virtual Human is ready.';
        }
      }

      // Ensure CSM is OFF when VH is ON
      state.customerService = false;

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('vh_toggle_on'));

    } catch (error) {
      console.error('❌ Failed to enable Virtual Human:', error);
      showToast('Failed to load Virtual Human. Please try again.', 'error');

      // Hide VH on error, but keep chat visible
      if (vhRoot) {
        vhRoot.classList.add('is-hidden');
        vhRoot.setAttribute('hidden', '');
        vhRoot.setAttribute('aria-hidden', 'true');
      }
      if (chatStream) {
        chatStream.style.display = 'block';
        chatStream.removeAttribute('aria-hidden');
      }

      document.body.classList.remove('vh-mode');
      state.virtualHuman = false;
      updateToggleStates();
    }

  } else {
    // Disable VH mode
    if (state.avatarManager) {
      state.avatarManager.setEnabled(false);
    }

    // Hide VH viewport, keep chat visible
    if (vhRoot) {
      vhRoot.classList.add('is-hidden');
      vhRoot.setAttribute('hidden', '');
      vhRoot.setAttribute('aria-hidden', 'true');
    }
    if (chatStream) {
      chatStream.style.display = 'block';
      chatStream.removeAttribute('aria-hidden');
    }

    // Remove body class
    document.body.classList.remove('vh-mode');

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('vh_toggle_off'));
  }

  updateToggleStates();
}

/**
 * Update toggle states across all toggle elements
 */
function updateToggleStates() {
  // Get all VH toggles
  const vhToggles = document.querySelectorAll('[data-toggle="vh"]');
  vhToggles.forEach(toggle => {
    toggle.checked = state.virtualHuman;
  });

  // Get all CS toggles
  const csToggles = document.querySelectorAll('[data-toggle="cs"]');
  csToggles.forEach(toggle => {
    toggle.checked = state.customerService;
  });

  // Update support button states
  updateSupportButtonStates();
}

/**
 * Update support button active states and aria attributes
 */
function updateSupportButtonStates() {
  const vhBtn = document.getElementById('support-vh-btn');
  const csmBtn = document.getElementById('support-csm-btn');

  if (vhBtn) {
    if (state.virtualHuman) {
      vhBtn.classList.add('active');
      vhBtn.setAttribute('aria-pressed', 'true');
    } else {
      vhBtn.classList.remove('active');
      vhBtn.setAttribute('aria-pressed', 'false');
    }
  }

  if (csmBtn) {
    if (state.customerService) {
      csmBtn.classList.add('active');
      csmBtn.setAttribute('aria-pressed', 'true');
    } else {
      csmBtn.classList.remove('active');
      csmBtn.setAttribute('aria-pressed', 'false');
    }
  }
}

// ========== SUPPORT ASSISTANT BUTTONS ==========
/**
 * Initialize Support Assistant buttons in right sidebar
 */
function initializeSupportButtons() {
  try {
    const vhBtn = document.getElementById('support-vh-btn');
    const csmBtn = document.getElementById('support-csm-btn');

    if (vhBtn) {
      vhBtn.addEventListener('click', async () => {
        try {
          console.log('🤖 Support VH button clicked');
          
          // Toggle VH mode
          const newState = !state.virtualHuman;
          state.virtualHuman = newState;

          // Add loading state
          if (newState) {
            vhBtn.classList.add('loading');
            showToast('Virtual Human loading...', 'info');
          }

          // Update the settings toggle to match
          const vhToggle = document.getElementById('virtual-human-toggle');
          if (vhToggle) {
            vhToggle.checked = newState;
          }

          // Dispatch custom event for consistency
          window.dispatchEvent(new CustomEvent('virtualHumanChanged', { 
            detail: { enabled: newState } 
          }));

          // Enable/disable VH mode
          await enableVirtualHuman(newState);

          // Remove loading state
          vhBtn.classList.remove('loading');

          // Show success toast
          if (newState) {
            showToast('Virtual Human active', 'success');
          } else {
            showToast('Virtual Human deactivated', 'info');
          }

          // Save state
          saveState();
        } catch (error) {
          console.error('❌ Error handling VH button:', error);
          vhBtn.classList.remove('loading');
          showToast('Failed to toggle Virtual Human', 'error');
        }
      });
    }

    if (csmBtn) {
      csmBtn.addEventListener('click', async () => {
        try {
          console.log('📞 Support CSM button clicked');
          
          // Toggle CSM mode
          const newState = !state.customerService;
          state.customerService = newState;

          // If enabling CSM, disable VH
          if (newState && state.virtualHuman) {
            state.virtualHuman = false;
            await enableVirtualHuman(false);
          }

          toggleCustomerServiceMode(newState);
          updateSupportButtonStates();

          // Save state
          saveState();
        } catch (error) {
          console.error('❌ Error handling CSM button:', error);
          showToast('Failed to toggle Customer Service Mode', 'error');
        }
      });
    }

    // Set initial button states
    updateSupportButtonStates();
  } catch (error) {
    console.error('❌ Error initializing support buttons:', error);
  }
}

// ========== MENU SYSTEM ==========
function initializeMenu() {
  try {
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
  } catch (error) {
    console.error('❌ Error initializing menu:', error);
  }
}

// ========== TOGGLE SWITCHES ==========
function initializeToggles() {
  try {
    // Get all toggle elements
    const toggles = document.querySelectorAll('[data-toggle]');

    toggles.forEach(toggle => {
      const toggleType = toggle.getAttribute('data-toggle');

      toggle.addEventListener('change', async () => {
        const isActive = toggle.checked;

        try {
          // Handle different toggle types
          switch(toggleType) {
            case 'vh':
              state.virtualHuman = isActive;
              // VH and CS are mutually exclusive
              if (isActive && state.customerService) {
                state.customerService = false;
                updateToggleStates();
              }
              await enableVirtualHuman(isActive);
              break;
            case 'cs':
              state.customerService = isActive;
              // VH and CS are mutually exclusive
              if (isActive && state.virtualHuman) {
                state.virtualHuman = false;
                await enableVirtualHuman(false);
                updateToggleStates();
              }
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
        } catch (error) {
          // Map toggle types to user-friendly names
          const toggleNames = {
            'vh': 'Virtual Human',
            'cs': 'Customer Service',
            'dark': 'Dark Mode',
            'tts': 'Text-to-Speech'
          };
          const friendlyName = toggleNames[toggleType] || toggleType;
          console.error(`❌ Error handling ${friendlyName} toggle:`, error);
          showToast(`Failed to toggle ${friendlyName}. Please try again.`, 'error');
        }
      });

    // Set initial state from saved data
    if (toggleType === 'vh' && state.virtualHuman) {
      toggle.checked = true;
    }
    if (toggleType === 'cs' && state.customerService) {
      toggle.checked = true;
    }
    if (toggleType === 'dark' && state.darkMode) {
      toggle.checked = true;
    }
    if (toggleType === 'tts' && state.textToSpeech) {
      toggle.checked = true;
    }
  });
  
  console.log('✅ Toggle switches initialized');
} catch (error) {
  console.error('❌ Error initializing toggles:', error);
  showToast('Some toggles may not be working. Please refresh the page.', 'warning');
}
}

function toggleVirtualHumanMode(enabled) {
  if (enabled) {
    document.body.classList.add('virtual-human-mode');
  } else {
    document.body.classList.remove('virtual-human-mode');
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
    
    // Test TTS if available
    if (window.TTS && window.TTS.isAvailable()) {
      testTextToSpeech();
    } else {
      console.warn('TTS module not available');
      showToast('TTS module loading...', 'info');
    }
  } else {
    document.body.classList.remove('tts-enabled');
    showToast('Text-to-Speech Disabled', 'info');
    
    // Stop any ongoing speech
    if (window.TTS) {
      window.TTS.stop();
    }
  }
}

function testTextToSpeech() {
  // Use TTS module if available, fall back to speechSynthesis
  if (window.TTS && window.TTS.isAvailable()) {
    window.TTS.speak('Text-to-speech is now enabled.', { useServer: false })
      .catch(error => {
        console.error('TTS test failed:', error);
      });
  } else if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('Text-to-speech is now enabled.');
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ========== COLLAPSIBLE SECTIONS ==========
function initializeCollapsible() {
  try {
    const settingsCollapsible = document.getElementById('settingsCollapsible');
    
    if (settingsCollapsible) {
      const header = settingsCollapsible.querySelector('.collapsible-header');
      
      header?.addEventListener('click', () => {
        settingsCollapsible.classList.toggle('open');
      });
    }
  } catch (error) {
    console.error('❌ Error initializing collapsible:', error);
  }
}

// ========== CAREER TRACK & EXPLORE PATHS ==========
function initializeCareerTrack() {
  try {
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
  } catch (error) {
    console.error('❌ Error initializing Career Track:', error);
    // Don't show toast for this - fail silently as it's not critical
  }
}

// ========== READ ABOUT BUTTON ==========
function initializeReadAbout() {
  try {
    // Find all "Read About" buttons with data-action="read-about"
    const readAboutButtons = document.querySelectorAll('[data-action="read-about"]');
    
    readAboutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('📖 Read About button clicked - Navigating to about-us.html');
        window.location.href = '/about-us.html';
      });
    });
    
    console.log('✅ Read About navigation initialized');
  } catch (error) {
    console.error('❌ Error initializing Read About:', error);
    // Don't show toast for this - fail silently as it's not critical
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
    
    // Also check individual keys for theme and TTS (used by layout-loader.js)
    // This ensures consistency across pages using different loaders
    const theme = localStorage.getItem('theme');
    if (theme) {
      state.darkMode = theme === 'dark';
    } else {
      // No saved preference, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        state.darkMode = true;
      }
    }
    
    const ttsEnabled = localStorage.getItem('tts-enabled');
    if (ttsEnabled !== null) {
      state.textToSpeech = ttsEnabled === 'true';
    }

    // Apply saved state
    if (state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
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
    
    // Also save to individual keys for compatibility with layout-loader.js
    localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    localStorage.setItem('tts-enabled', state.textToSpeech.toString());
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
window.PMERIT = window.PMERIT || {};
Object.assign(window.PMERIT, {
  state,
  enableVirtualHuman,
  toggleVirtualHumanMode,
  toggleCustomerServiceMode,
  toggleDarkMode,
  toggleTextToSpeech,
  showToast
});
