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
  try {
    if (!window.THREE || typeof THREE.WebGLRenderer !== "function") {
      console.error("[VH] THREE not loaded; check script includes.");
      showToast('Virtual Human requires WebGL support', 'error');
      return;
    }
    if (typeof GLTFLoader !== "function" && typeof THREE?.GLTFLoader !== "function") {
      console.error("[VH] GLTFLoader not available; check CDN include.");
      showToast('Virtual Human loader not available', 'error');
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
    } else {
      console.warn('[VH] AvatarManager already exists or not available');
    }
  } catch (e) {
    console.error("[VH] init failed:", e);
    showToast('Virtual Human initialization failed', 'error');
  }
};

/**
 * Show/hide VH mode - toggles only VH visibility, never hides chat
 * @param {boolean} on - Whether to enable VH mode
 */
function showVH(on) {
  const vhRoot = document.getElementById("vh-root");
  const chat = document.getElementById("chat-panel");

  // Toggle body class
  document.body.classList.toggle("vh-mode", !!on);

  // Toggle VH visibility
  if (vhRoot) {
    vhRoot.classList.toggle("is-hidden", !on);
    vhRoot.toggleAttribute("aria-hidden", !on);
  }

  // Ensure chat is always visible
  if (chat) {
    chat.style.display = "block";
    chat.removeAttribute("aria-hidden");
  }

  // Initialize VH if turning on
  if (on && window.AvatarManager && !state.avatarManager) {
    try {
      window.__VH_INITED__ = true;
      state.avatarManager = new window.AvatarManager({
        canvasId: 'vh-canvas',
        enabled: true,
        apiBaseUrl: (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api',
        modelFile: 'pm_classic.glb',
        avatarBaseUrl: '/assets/avatars/'
      });
      state.avatarManager.init().then(() => {
        console.info("[VH] AvatarManager initialized with pm_classic.glb");
        showToast('Virtual Human ready', 'success');
      }).catch(e => {
        console.error("[VH] init error", e);
        showToast('Virtual Human initialization failed', 'error');
      });
    } catch (e) {
      console.error("[VH] AvatarManager instantiation failed", e);
      showToast('Virtual Human initialization failed', 'error');
    }
  }
}


function init() {
  console.log('🚀 PMERIT Platform initializing...');
  
  // Load saved state
  loadState();
  
  // Initialize all components - each has its own error handling
  initializeMenu();
  initializeToggles();
  initializeCollapsible();
  initializeCareerTrack();
  initializeSupportButtons();
  
  // Set up VH toggle listener - support both data-toggle values
  const vhToggle = document.querySelector("[data-toggle='virtual-human']") || 
                   document.querySelector("[data-toggle='vh']") ||
                   document.getElementById("virtual-human-toggle");
  if (vhToggle) {
    vhToggle.addEventListener("change", e => showVH(e.target.checked));
    // Normalize on load
    showVH(vhToggle.checked);
  }
  
  console.log('✅ PMERIT Platform initialized');
}

/**
 * Ensure chat container is visible by removing display:none if set
 * @param {HTMLElement} chatContainer - The chat container element
 */
function ensureChatVisible(chatContainer) {
  if (chatContainer) {
    // Remove any inline display:none that might have been set
    if (chatContainer.style.display === 'none') {
      chatContainer.style.display = '';
    }
    chatContainer.removeAttribute('aria-hidden');
  }
}

/**
 * Hide the VH container
 * @param {HTMLElement} vhCanvasRoot - The VH canvas root element
 */
function hideVHContainer(vhCanvasRoot) {
  if (vhCanvasRoot) {
    vhCanvasRoot.style.display = 'none';
    vhCanvasRoot.classList.add('is-hidden');
    vhCanvasRoot.setAttribute('aria-hidden', 'true');
  }
}

// ========== VIRTUAL HUMAN MODE ==========
async function enableVirtualHuman(isEnabled) {
  console.log(`🤖 Virtual Human Mode: ${isEnabled ? 'ON' : 'OFF'}`);

  const vhCanvasRoot = document.getElementById('vh-canvas-root');
  const chatContainer = document.getElementById('desktopChatMessages') || document.getElementById('desktop-chat-messages');
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

      // Show VH canvas container above chat (never hide chat)
      if (vhCanvasRoot) {
        vhCanvasRoot.style.display = 'flex';
        vhCanvasRoot.classList.remove('is-hidden');
        vhCanvasRoot.removeAttribute('aria-hidden');
      }

      // Ensure chat remains visible (don't modify display, just ensure it's not hidden)
      ensureChatVisible(chatContainer);

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
      hideVHContainer(vhCanvasRoot);
      ensureChatVisible(chatContainer);

      document.body.classList.remove('vh-mode');
      state.virtualHuman = false;
      updateToggleStates();
    }

  } else {
    // Disable VH mode
    if (state.avatarManager) {
      state.avatarManager.setEnabled(false);
    }

    // Hide VH canvas, keep chat visible
    hideVHContainer(vhCanvasRoot);
    ensureChatVisible(chatContainer);

    // Remove body class
    document.body.classList.remove('vh-mode');

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('vh_toggle_off'));
  }

  updateToggleStates();
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
