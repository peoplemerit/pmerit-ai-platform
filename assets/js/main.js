/**
 * main.js
 * Primary application logic and event handling for PMERIT platform
 */

(function() {
  'use strict';

  // Global state
  window.virtualHumanMode = false;
  window.customerServiceMode = false;
  window.darkMode = false;
  window.ttsEnabled = false;

  const App = {
    init() {
      console.log('Initializing PMERIT application...');
      this.initializeToggles();
      this.initializeCollapsibles();
      this.initializeModals();
      this.initializeQuickActions();
      this.loadSavedPreferences();
    },

    initializeToggles() {
      // Virtual Human Mode toggle
      const vhToggle = document.getElementById('vhToggle');
      const vhToggleMobile = document.getElementById('vhToggleMobile');
      const virtualHumanToggle = document.getElementById('virtualHumanToggle');
      
      if (vhToggle) {
        vhToggle.addEventListener('click', () => {
          this.toggleVirtualHumanMode();
        });
      }

      if (vhToggleMobile) {
        vhToggleMobile.addEventListener('click', () => {
          this.toggleVirtualHumanMode();
        });
      }

      if (virtualHumanToggle) {
        virtualHumanToggle.addEventListener('change', (e) => {
          window.virtualHumanMode = e.target.checked;
          this.updateVirtualHumanMode();
        });
      }

      // Customer Service Mode toggle
      const supportToggle = document.getElementById('supportToggle');
      const supportToggleMobile = document.getElementById('supportToggleMobile');
      const customerServiceToggle = document.getElementById('customerServiceToggle');
      
      if (supportToggle) {
        supportToggle.addEventListener('click', () => {
          this.toggleCustomerServiceMode();
        });
      }

      if (supportToggleMobile) {
        supportToggleMobile.addEventListener('click', () => {
          this.toggleCustomerServiceMode();
        });
      }

      if (customerServiceToggle) {
        customerServiceToggle.addEventListener('change', (e) => {
          window.customerServiceMode = e.target.checked;
          this.updateCustomerServiceMode();
        });
      }

      // Dark Mode toggle
      const darkToggle = document.getElementById('darkToggle');
      const darkToggleMobile = document.getElementById('darkToggleMobile');
      const darkModeToggle = document.getElementById('darkModeToggle');
      
      if (darkToggle) {
        darkToggle.addEventListener('click', () => {
          this.toggleDarkMode();
        });
      }

      if (darkToggleMobile) {
        darkToggleMobile.addEventListener('click', () => {
          this.toggleDarkMode();
        });
      }

      if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
          window.darkMode = e.target.checked;
          this.applyDarkMode();
        });
      }

      // TTS toggle
      const ttsToggle = document.getElementById('ttsToggle');
      const ttsToggleMobile = document.getElementById('ttsToggleMobile');
      
      if (ttsToggle) {
        ttsToggle.addEventListener('click', () => {
          this.toggleTextToSpeech();
        });
      }

      if (ttsToggleMobile) {
        ttsToggleMobile.addEventListener('click', () => {
          this.toggleTextToSpeech();
        });
      }
    },

    toggleVirtualHumanMode() {
      window.virtualHumanMode = !window.virtualHumanMode;
      this.updateVirtualHumanMode();
      
      // Update checkbox if exists
      const checkbox = document.getElementById('virtualHumanToggle');
      if (checkbox) {
        checkbox.checked = window.virtualHumanMode;
      }
      
      // Update mobile toggle visual state
      this.updateToggleSwitch('vhToggleMobile', window.virtualHumanMode);
      this.updateToggleSwitch('vhToggle', window.virtualHumanMode);
    },

    updateVirtualHumanMode() {
      const vhBadge = document.getElementById('vhBadge');
      const vhStage = document.getElementById('vhStage');
      const textChat = document.getElementById('textChat');
      const vhModeIndicator = document.getElementById('vhModeIndicator');

      if (window.virtualHumanMode) {
        if (vhBadge) vhBadge.style.display = 'inline-flex';
        if (vhStage) vhStage.style.display = 'block';
        if (textChat) textChat.style.display = 'none';
        if (vhModeIndicator) vhModeIndicator.classList.add('active');
        this.showToast('🤖 Virtual Human Mode Activated');
      } else {
        if (vhBadge) vhBadge.style.display = 'none';
        if (vhStage) vhStage.style.display = 'none';
        if (textChat) textChat.style.display = 'block';
        if (vhModeIndicator) vhModeIndicator.classList.remove('active');
      }

      this.savePreferences();
    },

    toggleCustomerServiceMode() {
      window.customerServiceMode = !window.customerServiceMode;
      this.updateCustomerServiceMode();
      
      // Update checkbox if exists
      const checkbox = document.getElementById('customerServiceToggle');
      if (checkbox) {
        checkbox.checked = window.customerServiceMode;
      }
      
      // Update mobile toggle visual state
      this.updateToggleSwitch('supportToggleMobile', window.customerServiceMode);
      this.updateToggleSwitch('supportToggle', window.customerServiceMode);
    },

    updateCustomerServiceMode() {
      const supportBadge = document.getElementById('supportBadge');
      const csModeIndicator = document.getElementById('csModeIndicator');

      if (window.customerServiceMode) {
        if (supportBadge) supportBadge.style.display = 'inline-flex';
        if (csModeIndicator) csModeIndicator.classList.add('active');
        this.showToast('🎧 Customer Service Mode Activated');
      } else {
        if (supportBadge) supportBadge.style.display = 'none';
        if (csModeIndicator) csModeIndicator.classList.remove('active');
      }

      this.savePreferences();
    },

    toggleDarkMode() {
      window.darkMode = !window.darkMode;
      this.applyDarkMode();
      
      // Update checkbox if exists
      const checkbox = document.getElementById('darkModeToggle');
      if (checkbox) {
        checkbox.checked = window.darkMode;
      }
      
      // Update mobile toggle visual state
      this.updateToggleSwitch('darkToggleMobile', window.darkMode);
      this.updateToggleSwitch('darkToggle', window.darkMode);
    },

    applyDarkMode() {
      if (window.darkMode) {
        document.body.classList.add('dark-mode');
        this.showToast('🌙 Dark Mode Enabled');
      } else {
        document.body.classList.remove('dark-mode');
        this.showToast('☀️ Light Mode Enabled');
      }

      this.savePreferences();
    },

    toggleTextToSpeech() {
      window.ttsEnabled = !window.ttsEnabled;
      
      if (window.ttsEnabled) {
        this.showToast('🔊 Text-to-Speech Enabled');
      } else {
        this.showToast('🔇 Text-to-Speech Disabled');
        // Stop any ongoing speech
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }

      this.savePreferences();
    },

    initializeCollapsibles() {
      // Settings collapsible
      const settingsBox = document.getElementById('settingsBox');
      const settingsHeader = document.getElementById('settingsHeader');
      const settingsContent = document.getElementById('settingsContent');

      if (settingsBox) {
        const head = settingsBox.querySelector('.head');
        if (head) {
          head.addEventListener('click', () => {
            settingsBox.classList.toggle('open');
          });
        }
      }

      if (settingsHeader && settingsContent) {
        settingsHeader.addEventListener('click', () => {
          settingsContent.classList.toggle('open');
          const chevron = settingsHeader.querySelector('.chevron-icon');
          if (chevron) {
            chevron.classList.toggle('rotate');
          }
        });
      }
    },

    initializeModals() {
      // Auth modal handlers
      document.addEventListener('show-auth-modal', (e) => {
        const mode = e.detail?.mode || 'signin';
        this.showAuthModal(mode);
      });

      // Modal close buttons
      const modalClose = document.getElementById('modalClose');
      if (modalClose) {
        modalClose.addEventListener('click', () => {
          this.hideAuthModal();
        });
      }

      // Sign-in buttons
      const signInButtons = document.querySelectorAll('.sign-in-btn, #menuSignInBtn');
      signInButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.showAuthModal('signin');
        });
      });

      // Grid menu button
      const gridMenuBtn = document.getElementById('gridMenuBtn');
      if (gridMenuBtn) {
        gridMenuBtn.addEventListener('click', () => {
          // Could open a grid menu modal
          console.log('Grid menu clicked');
        });
      }
    },

    showAuthModal(mode = 'signin') {
      const authModal = document.getElementById('authModal');
      if (authModal) {
        authModal.classList.remove('hidden');
        authModal.style.display = 'flex';
      }
    },

    hideAuthModal() {
      const authModal = document.getElementById('authModal');
      if (authModal) {
        authModal.classList.add('hidden');
        authModal.style.display = 'none';
      }
    },

    initializeQuickActions() {
      // Career Paths button
      const careerPaths = document.getElementById('careerPaths');
      if (careerPaths) {
        careerPaths.addEventListener('click', () => {
          window.showCareerTracks();
        });
      }

      // Dashboard button
      const dashBtn = document.getElementById('dashBtn');
      const dashboardBtn = document.getElementById('dashboardBtn');
      
      [dashBtn, dashboardBtn].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            window.location.href = 'learner-portal.html';
          });
        }
      });

      // Preview Voices button
      const voicesBtn = document.getElementById('voicesBtn');
      const voicesBtnMobile = document.getElementById('voicesBtnMobile');
      
      [voicesBtn, voicesBtnMobile].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            window.previewVoices();
          });
        }
      });

      // Begin Assessment button
      const beginAssessment = document.getElementById('beginAssessment');
      const assessmentStart = document.getElementById('assessmentStart');
      
      [beginAssessment, assessmentStart].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            window.location.href = 'assessment.html';
          });
        }
      });

      // VH Quick buttons
      const vhQuick = document.getElementById('vhQuick');
      const vhShort = document.getElementById('vhShort');
      
      [vhQuick, vhShort].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            this.toggleVirtualHumanMode();
          });
        }
      });

      // Support Quick buttons
      const supportShort = document.getElementById('supportShort');
      if (supportShort) {
        supportShort.addEventListener('click', () => {
          this.toggleCustomerServiceMode();
        });
      }
    },

    updateToggleSwitch(toggleId, isActive) {
      const toggle = document.getElementById(toggleId);
      if (toggle) {
        const switchEl = toggle.querySelector('.switch');
        if (switchEl) {
          switchEl.style.background = isActive ? 'var(--primary, #2563eb)' : '#ccc';
        }
        toggle.classList.toggle('active', isActive);
      }
    },

    showToast(message, duration = 3000) {
      // Remove existing toast
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) {
        existingToast.remove();
      }

      // Create toast
      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary, #2563eb);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
      `;

      document.body.appendChild(toast);

      // Remove after duration
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    savePreferences() {
      const preferences = {
        virtualHumanMode: window.virtualHumanMode,
        customerServiceMode: window.customerServiceMode,
        darkMode: window.darkMode,
        ttsEnabled: window.ttsEnabled
      };
      localStorage.setItem('pmerit_preferences', JSON.stringify(preferences));
    },

    loadSavedPreferences() {
      try {
        const saved = localStorage.getItem('pmerit_preferences');
        if (saved) {
          const preferences = JSON.parse(saved);
          
          if (preferences.darkMode) {
            window.darkMode = true;
            this.applyDarkMode();
          }
          
          if (preferences.ttsEnabled) {
            window.ttsEnabled = true;
          }

          // Update checkboxes
          const virtualHumanToggle = document.getElementById('virtualHumanToggle');
          const customerServiceToggle = document.getElementById('customerServiceToggle');
          const darkModeToggle = document.getElementById('darkModeToggle');
          
          if (virtualHumanToggle) virtualHumanToggle.checked = preferences.virtualHumanMode || false;
          if (customerServiceToggle) customerServiceToggle.checked = preferences.customerServiceMode || false;
          if (darkModeToggle) darkModeToggle.checked = preferences.darkMode || false;
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  };

  // Global functions for inline onclick handlers
  window.showCareerTracks = function() {
    window.location.href = 'career.html';
  };

  window.previewVoices = function() {
    App.showToast('Voice preview feature coming soon!');
  };

  window.startAIDiscovery = function() {
    App.showToast('Starting AI discovery...');
    window.location.href = 'assessment.html';
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait a bit for partials to load
      setTimeout(() => {
        App.init();
      }, 100);
    });
  } else {
    setTimeout(() => {
      App.init();
    }, 100);
  }

  // Export for global access
  window.App = App;

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      color: var(--text-secondary, #666);
      font-style: italic;
    }

    .typing-indicator .dots span {
      animation: blink 1.4s infinite;
      animation-fill-mode: both;
    }

    .typing-indicator .dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator .dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes blink {
      0%, 80%, 100% {
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
    }

    .mode-indicator {
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 8px 16px;
      background: var(--primary, #2563eb);
      color: white;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 1000;
    }

    .mode-indicator.active {
      opacity: 1;
      transform: translateY(0);
    }

    .mode-indicator.cs {
      background: var(--success, #10b981);
    }

    .collapsible.open .body {
      display: block;
    }

    .collapsible .body {
      display: none;
    }

    .collapsible-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .collapsible-content.open {
      max-height: 500px;
    }

    .chevron-icon {
      transition: transform 0.3s ease;
    }

    .chevron-icon.rotate {
      transform: rotate(180deg);
    }
  `;
  document.head.appendChild(style);
})();
