/**
 * Virtual Human Controller
 * Issue #7-10: Virtual Human Mode Complete Overhaul
 * 
 * Implements picture-in-picture corner overlay for Virtual Human avatar
 * that works alongside chat without blocking it.
 *
 * Features:
 * - Corner overlay (doesn't block chat)
 * - Minimize/maximize controls
 * - Mobile support
 * - State persistence
 * - Classroom integration
 *
 * @module virtual-human-controller
 * @requires virtual-human-api.js (optional)
 * @requires /assets/js/avatar/AvatarManager.js (optional)
 * @requires /assets/js/avatar/LipSyncVisemes.js (optional)
 */

(function (window) {
  'use strict';

  /**
   * VirtualHumanController class
   */
  class VirtualHumanController {
    /**
     * @constructor
     * @param {Object} config - Configuration options
     */
    constructor(config = {}) {
      this.config = {
        useOverlay: config.useOverlay !== false, // NEW: Enable overlay mode by default
        containerId: config.containerId || 'virtual-human-container',
        autoInit: config.autoInit !== false,
        defaultEnabled: config.defaultEnabled || false,
        avatarScale: config.avatarScale || 1.0,
        position: config.position || { x: 0, y: -1, z: 0 },
        enableIdleAnimation: config.enableIdleAnimation !== false,
        enableLipSync: config.enableLipSync !== false,
        debugMode: config.debugMode || false
      };

      // State
      this.state = {
        enabled: this.config.defaultEnabled,
        minimized: false, // NEW: Minimized state
        initialized: false,
        avatarLoaded: false,
        speaking: false,
        muted: false,
        currentAvatar: null,
        currentAnimation: 'idle',
        error: null
      };

      // Storage keys
      this.storageKeyEnabled = 'pmerit-vh-enabled';
      this.storageKeyMinimized = 'pmerit-vh-minimized';

      // Components
      this.avatarManager = null;
      this.lipSyncController = null;
      this.api = window.virtualHumanAPI;

      // UI Elements
      this.container = null;
      this.overlay = null; // NEW: Overlay container
      this.toggleButton = null;
      this.muteButton = null;
      this.avatarSelector = null;

      // Event listeners
      this.boundListeners = new Map();

      // Initialize if auto-init enabled
      if (this.config.autoInit) {
        this.init();
      }
    }

    /**
     * Initialize Virtual Human system
     */
    async init() {
      if (this.state.initialized) {
        console.warn('Virtual Human already initialized');
        return;
      }

      try {
        console.log('Initializing Virtual Human...');

        // NEW: Create overlay if enabled
        if (this.config.useOverlay) {
          this.createOverlay();
        } else {
          // OLD: Get existing container
          this.container = document.getElementById(this.config.containerId);
          if (!this.container) {
            console.warn(`Container #${this.config.containerId} not found, creating overlay instead`);
            this.config.useOverlay = true;
            this.createOverlay();
          }
        }

        // Initialize avatar manager
        await this.initAvatarManager();

        // Initialize lip-sync controller
        this.initLipSyncController();

        // Setup UI controls
        this.setupUIControls();

        // Setup event listeners
        this.setupEventListeners();

        // Load user preferences
        this.loadPreferences();

        // Mark as initialized
        this.state.initialized = true;

        console.log('Virtual Human initialized successfully');

        // Auto-enable if configured
        if (this.config.defaultEnabled) {
          await this.enable();
        }

      } catch (error) {
        console.error('Virtual Human initialization failed:', error);
        this.state.error = error;
        this.showError(error);
      }
    }

    /**
     * Create Virtual Human overlay HTML
     * NEW: Creates picture-in-picture overlay instead of full-screen
     */
    createOverlay() {
      // Check if overlay already exists
      if (document.getElementById('vh-overlay')) {
        this.overlay = document.getElementById('vh-overlay');
        this.container = this.overlay; // Use overlay as container
        return;
      }
      
      // Create overlay element
      const overlay = document.createElement('div');
      overlay.id = 'vh-overlay';
      overlay.className = 'virtual-human-overlay';
      overlay.setAttribute('role', 'region');
      overlay.setAttribute('aria-label', 'Virtual Human Assistant');
      
      overlay.innerHTML = `
        <!-- Avatar Stage -->
        <div class="virtual-human-stage">
          <!-- Canvas for WebGL avatar -->
          <canvas id="vh-canvas"></canvas>
          
          <!-- Placeholder avatar (shown when avatar not loaded) -->
          <div class="avatar-placeholder" style="display: none;">
            <i class="fas fa-user-astronaut"></i>
          </div>
          
          <!-- Control Buttons -->
          <div class="virtual-human-controls">
            <button 
              id="vh-minimize-btn" 
              class="vh-control-btn" 
              aria-label="Minimize Virtual Human"
              title="Minimize"
            >
              <i class="fas fa-minus"></i>
            </button>
            
            <button 
              id="vh-close-btn" 
              class="vh-control-btn" 
              aria-label="Close Virtual Human"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <!-- Captions -->
        <div class="virtual-human-captions" id="vh-captions">
          Virtual Human is ready
        </div>
      `;
      
      // Append to body
      document.body.appendChild(overlay);
      this.overlay = overlay;
      this.container = overlay; // Use overlay as container for avatar
      
      console.log('Virtual Human overlay created');
    }

    /**
     * Initialize Avatar Manager
     */
    async initAvatarManager() {
      try {
        // Check if AvatarManager is available
        if (!window.AvatarManager) {
          console.warn('AvatarManager not loaded - avatar features disabled');
          return;
        }

        // Create avatar manager instance
        this.avatarManager = new window.AvatarManager({
          canvasId: 'vh-canvas',
          enabled: true,
          avatarScale: this.config.avatarScale
        });

        // Wait for avatar manager to be ready
        await this.avatarManager.init();

        console.log('Avatar Manager initialized');

      } catch (error) {
        console.error('Failed to initialize Avatar Manager:', error);
        // Non-fatal - controller can work without avatar
        this.avatarManager = null;
      }
    }

    /**
     * Initialize Lip-Sync Controller
     */
    initLipSyncController() {
      try {
        // Check if LipSyncVisemes is available
        if (!window.LipSyncVisemes) {
          console.warn('LipSyncVisemes not loaded - lip-sync disabled');
          return;
        }

        // LipSyncVisemes expects provider, not avatarManager
        if (this.avatarManager && this.avatarManager.state && this.avatarManager.state.provider) {
          this.lipSyncController = new window.LipSyncVisemes(
            this.avatarManager.state.provider,
            []
          );
          console.log('Lip-Sync Controller initialized');
        } else {
          console.warn('Avatar provider not available - lip-sync disabled');
        }

      } catch (error) {
        console.warn('Lip-sync initialization failed:', error);
        // Non-fatal - avatar can still work without lip-sync
      }
    }

    /**
     * Setup UI controls
     */
    setupUIControls() {
      // NEW: Setup multiple toggle buttons (desktop, mobile, classroom)
      const toggleIds = [
        'virtual-human-toggle',    // Desktop sidebar toggle
        'vh-toggle',                // Alternative desktop toggle
        'mobile-vh-toggle',         // Mobile menu toggle
        'm_vhToggle',              // Alternative mobile toggle
        'classroom-vh-toggle'       // Classroom page toggle
      ];
      
      toggleIds.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
          // Check if it's a checkbox or button
          if (toggle.type === 'checkbox') {
            toggle.addEventListener('change', () => this.toggle());
          } else {
            toggle.addEventListener('click', () => this.toggle());
          }
          console.log(`Bound toggle: ${id}`);
        }
      });

      // NEW: Setup overlay control buttons
      if (this.config.useOverlay) {
        const minimizeBtn = document.getElementById('vh-minimize-btn');
        const closeBtn = document.getElementById('vh-close-btn');
        
        if (minimizeBtn) {
          minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.state.minimized) {
              this.maximize();
            } else {
              this.minimize();
            }
          });
        }
        
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.disable();
          });
        }
        
        // Click minimized overlay to maximize
        if (this.overlay) {
          this.overlay.addEventListener('click', (e) => {
            if (this.state.minimized && e.target === this.overlay) {
              this.maximize();
            }
          });
        }
      }

      // Find or create mute button
      this.muteButton = document.getElementById('vh-mute');
      if (this.muteButton) {
        this.muteButton.addEventListener('click', () => this.toggleMute());
      }

      // Find or create avatar selector
      this.avatarSelector = document.getElementById('vh-avatar-selector');
      if (this.avatarSelector) {
        this.avatarSelector.addEventListener('change', (e) => {
          this.changeAvatar(e.target.value);
        });
      }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Listen for TTS events (if API available)
      if (this.api && typeof this.api.on === 'function') {
        this.api.on('start', this.handleTTSStart.bind(this));
        this.api.on('complete', this.handleTTSComplete.bind(this));
        this.api.on('error', this.handleTTSError.bind(this));
      }

      // Listen for lip-sync events
      const lipSyncHandler = this.handleLipSync.bind(this);
      window.addEventListener('vh:lipsync', lipSyncHandler);
      this.boundListeners.set('vh:lipsync', lipSyncHandler);

      const stopHandler = this.handleStop.bind(this);
      window.addEventListener('vh:stop', stopHandler);
      this.boundListeners.set('vh:stop', stopHandler);

      // Listen for chat events
      const chatMessageHandler = this.handleChatMessage.bind(this);
      window.addEventListener('chat:message', chatMessageHandler);
      this.boundListeners.set('chat:message', chatMessageHandler);

      const chatResponseHandler = this.handleChatResponse.bind(this);
      window.addEventListener('chat:response', chatResponseHandler);
      this.boundListeners.set('chat:response', chatResponseHandler);
    }

    /**
     * Enable Virtual Human
     */
    async enable() {
      if (this.state.enabled) {
        return;
      }

      try {
        console.log('Enabling Virtual Human...');

        // NEW: Show overlay or container
        if (this.config.useOverlay && this.overlay) {
          this.overlay.classList.add('active');
          // Apply minimized state if it was saved
          if (this.state.minimized) {
            this.overlay.classList.add('minimized');
          }
        } else if (this.container) {
          this.container.style.display = 'block';
        }

        // Load avatar if not loaded
        if (!this.state.avatarLoaded) {
          await this.loadAvatar();
        }

        // Start idle animation
        if (this.config.enableIdleAnimation) {
          this.startIdleAnimation();
        }

        // Update state
        this.state.enabled = true;

        // Update UI
        this.updateToggleButtons();

        // Save preference
        this.savePreference('enabled', true);

        // Update captions
        this.updateCaptions('Virtual Human is ready');

        console.log('Virtual Human enabled');

        // Dispatch event
        window.dispatchEvent(new CustomEvent('virtualHumanEnabled'));

      } catch (error) {
        console.error('Failed to enable Virtual Human:', error);
        this.showError(error);
      }
    }

    /**
     * Disable Virtual Human
     */
    disable() {
      if (!this.state.enabled) {
        return;
      }

      console.log('Disabling Virtual Human...');

      // NEW: Hide overlay or container
      if (this.config.useOverlay && this.overlay) {
        this.overlay.classList.remove('active', 'minimized');
      } else if (this.container) {
        this.container.style.display = 'none';
      }

      // Stop any speaking
      if (this.api && typeof this.api.stop === 'function') {
        this.api.stop();
      }

      // Stop animations
      this.stopIdleAnimation();

      // Update state
      this.state.enabled = false;
      this.state.minimized = false;

      // Update UI
      this.updateToggleButtons();

      // Save preference
      this.savePreference('enabled', false);
      this.savePreference('minimized', false);

      console.log('Virtual Human disabled');

      // Dispatch event
      window.dispatchEvent(new CustomEvent('virtualHumanDisabled'));
    }

    /**
     * Toggle Virtual Human on/off
     */
    async toggle() {
      if (this.state.enabled) {
        this.disable();
      } else {
        await this.enable();
      }
    }

    /**
     * Minimize Virtual Human to badge
     * NEW: Collapse overlay to small circle
     */
    minimize() {
      if (!this.config.useOverlay || !this.overlay || !this.state.enabled) {
        return;
      }

      this.state.minimized = true;
      this.overlay.classList.add('minimized');
      
      // Update minimize button icon
      const minimizeBtn = document.getElementById('vh-minimize-btn');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        minimizeBtn.setAttribute('aria-label', 'Maximize Virtual Human');
        minimizeBtn.setAttribute('title', 'Maximize');
      }
      
      this.savePreference('minimized', true);
      console.log('[VirtualHuman] Minimized');
    }
    
    /**
     * Maximize Virtual Human from badge
     * NEW: Expand overlay to full size
     */
    maximize() {
      if (!this.config.useOverlay || !this.overlay) {
        return;
      }

      this.state.minimized = false;
      this.overlay.classList.remove('minimized');
      
      // Update minimize button icon
      const minimizeBtn = document.getElementById('vh-minimize-btn');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        minimizeBtn.setAttribute('aria-label', 'Minimize Virtual Human');
        minimizeBtn.setAttribute('title', 'Minimize');
      }
      
      this.savePreference('minimized', false);
      console.log('[VirtualHuman] Maximized');
    }

    /**
     * Load avatar model
     */
    async loadAvatar(avatarId = null) {
      try {
        // Get avatar ID
        const id = avatarId || this.api.getPreferredAvatar();

        // Get avatar data
        const avatars = await this.api.getAvatars();
        const avatar = avatars.find(a => a.id === id);

        if (!avatar) {
          throw new Error(`Avatar ${id} not found`);
        }

        console.log('Loading avatar:', avatar.name);

        // Update state - actual model loading handled by AvatarManager internally
        this.state.avatarLoaded = true;
        this.state.currentAvatar = avatar;

        console.log('Avatar loaded successfully');

      } catch (error) {
        console.error('Failed to load avatar:', error);
        throw error;
      }
    }

    /**
     * Change avatar
     * @param {string} avatarId - Avatar ID
     */
    async changeAvatar(avatarId) {
      try {
        // Save preference
        await this.api.setPreferredAvatar(avatarId);

        // Reload avatar
        await this.loadAvatar(avatarId);

        // Restart idle animation if enabled
        if (this.state.enabled && this.config.enableIdleAnimation) {
          this.startIdleAnimation();
        }

      } catch (error) {
        console.error('Failed to change avatar:', error);
        this.showError(error);
      }
    }

    /**
     * Handle chat message (from user)
     * @param {CustomEvent} event - Chat message event
     */
    handleChatMessage(event) {
      const message = event.detail.message;
      console.log('User message:', message);

      // Currently no specific animation for listening
      // Could be enhanced in future versions
    }

    /**
     * Handle chat response (from AI)
     * @param {CustomEvent} event - Chat response event
     */
    async handleChatResponse(event) {
      const response = event.detail.response;
      console.log('AI response:', response);

      // Speak response if Virtual Human is enabled
      if (this.state.enabled && !this.state.muted) {
        await this.speak(response);
      }
    }

    /**
     * Speak text with avatar
     * @param {string} text - Text to speak
     */
    async speak(text) {
      try {
        // Update state
        this.state.speaking = true;

        // NEW: Update captions
        this.updateCaptions(text);

        // Stop idle animation
        this.stopIdleAnimation();

        // Use AvatarManager's speak method if available
        if (this.avatarManager && typeof this.avatarManager.speak === 'function') {
          await this.avatarManager.speak(text);
        } else if (this.api && typeof this.api.speakAndPlay === 'function') {
          // Fallback to API-only
          await this.api.speakAndPlay(text);
        } else {
          // No TTS available, just show captions
          console.log('No TTS available, showing captions only');
        }

        // Update state
        this.state.speaking = false;

        // Resume idle animation
        if (this.config.enableIdleAnimation) {
          this.startIdleAnimation();
        }

        // NEW: Clear captions after a delay
        setTimeout(() => {
          if (!this.state.speaking) {
            this.updateCaptions('Virtual Human is ready');
          }
        }, 2000);

      } catch (error) {
        console.error('Speak failed:', error);
        this.state.speaking = false;

        // Resume idle animation on error
        if (this.config.enableIdleAnimation) {
          this.startIdleAnimation();
        }
      }
    }

    /**
     * Handle TTS start
     * @param {Object} data - TTS start data
     */
    handleTTSStart(data) {
      console.log('TTS started:', data.text);
      // Show speaking indicator in UI
    }

    /**
     * Handle TTS complete
     * @param {Object} data - TTS complete data
     */
    handleTTSComplete(data) {
      console.log('TTS completed:', data.text);
      // Hide speaking indicator
    }

    /**
     * Handle TTS error
     * @param {Object} data - TTS error data
     */
    handleTTSError(data) {
      console.error('TTS error:', data.error);
      this.showError(data.error);
    }

    /**
     * Handle lip-sync event
     * @param {CustomEvent} event - Lip-sync event
     */
    handleLipSync(event) {
      const { visemes } = event.detail;

      if (!this.config.enableLipSync || !this.lipSyncController) {
        return;
      }

      try {
        // Update visemes in lip-sync controller
        this.lipSyncController.visemes = visemes;
        this.lipSyncController.currentIndex = 0;
      } catch (error) {
        console.warn('Lip-sync playback failed:', error);
      }
    }

    /**
     * Handle stop event
     */
    handleStop() {
      console.log('Playback stopped');

      // Reset lip-sync
      if (this.lipSyncController) {
        this.lipSyncController.reset();
      }

      // Resume idle state
      this.state.speaking = false;
      if (this.config.enableIdleAnimation) {
        this.startIdleAnimation();
      }
    }

    /**
     * Start idle animation
     */
    startIdleAnimation() {
      if (!this.avatarManager || this.state.speaking) {
        return;
      }

      // AvatarManager doesn't have direct animation control
      // Idle animation is handled internally by WebGLProvider
      this.state.currentAnimation = 'idle';
    }

    /**
     * Stop idle animation
     */
    stopIdleAnimation() {
      if (!this.avatarManager) {
        return;
      }

      // Animation control is internal to AvatarManager/WebGLProvider
      this.state.currentAnimation = null;
    }

    /**
     * Toggle mute
     */
    toggleMute() {
      this.state.muted = !this.state.muted;

      // Update mute button UI
      if (this.muteButton) {
        const icon = this.muteButton.querySelector('i');
        if (icon) {
          icon.className = this.state.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
      }

      // Save preference
      this.savePreference('muted', this.state.muted);

      console.log('Virtual Human', this.state.muted ? 'muted' : 'unmuted');
    }

    /**
     * Update toggle button UI
     * NEW: Updates all toggle buttons across the site
     */
    updateToggleButtons() {
      const toggleIds = [
        'virtual-human-toggle',
        'vh-toggle',
        'mobile-vh-toggle',
        'm_vhToggle',
        'classroom-vh-toggle'
      ];
      
      toggleIds.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
          // Handle checkbox toggles
          if (toggle.type === 'checkbox') {
            toggle.checked = this.state.enabled;
          }
          // Handle button toggles
          else {
            toggle.classList.toggle('active', this.state.enabled);
          }
          
          // Update aria-pressed for accessibility
          toggle.setAttribute('aria-pressed', this.state.enabled);
        }
      });
    }

    /**
     * Update captions text
     * NEW: Updates caption display in overlay
     * @param {string} text - Caption text
     */
    updateCaptions(text) {
      const captions = document.getElementById('vh-captions');
      if (captions) {
        captions.textContent = text;
      }
    }

    /**
     * Show error message
     * @param {Error} error - Error object
     */
    showError(error) {
      console.error('Virtual Human error:', error);

      // Show error in UI (toast notification)
      if (window.showNotification) {
        window.showNotification('Virtual Human Error', error.message, 'error');
      }
    }

    /**
     * Save preference to localStorage
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     */
    savePreference(key, value) {
      try {
        const preferences = this.loadAllPreferences();
        preferences[key] = value;
        localStorage.setItem('pmerit_vh_preferences', JSON.stringify(preferences));
      } catch (error) {
        console.warn('Failed to save preference:', error);
      }
    }

    /**
     * Load all preferences from localStorage
     * @returns {Object} Preferences object
     */
    loadAllPreferences() {
      try {
        const stored = localStorage.getItem('pmerit_vh_preferences');
        return stored ? JSON.parse(stored) : {};
      } catch (error) {
        console.warn('Failed to load preferences:', error);
        return {};
      }
    }

    /**
     * Load preferences and apply them
     */
    loadPreferences() {
      const prefs = this.loadAllPreferences();

      // Apply enabled state
      if (prefs.enabled !== undefined) {
        this.state.enabled = prefs.enabled;
      }

      // Apply muted state
      if (prefs.muted !== undefined) {
        this.state.muted = prefs.muted;
      }

      // NEW: Apply minimized state
      if (prefs.minimized !== undefined) {
        this.state.minimized = prefs.minimized;
      }

      console.log('Preferences loaded:', prefs);
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
      return { ...this.state };
    }

    /**
     * Destroy Virtual Human (cleanup)
     */
    destroy() {
      console.log('Destroying Virtual Human...');

      // Stop any speaking
      if (this.api) {
        this.api.stop();
      }

      // Destroy avatar manager
      if (this.avatarManager && typeof this.avatarManager.dispose === 'function') {
        this.avatarManager.dispose();
      }

      // Remove event listeners
      this.boundListeners.forEach((listener, event) => {
        window.removeEventListener(event, listener);
      });
      this.boundListeners.clear();

      // Clear state
      this.state.initialized = false;
      this.state.enabled = false;

      console.log('Virtual Human destroyed');
    }
  }

  // Export to window
  window.VirtualHumanController = VirtualHumanController;

  // Auto-create default instance with overlay mode
  // NEW: Always creates overlay, doesn't require container
  document.addEventListener('DOMContentLoaded', () => {
    // Check if already initialized
    if (!window.virtualHumanController) {
      window.virtualHumanController = new VirtualHumanController({
        useOverlay: true,           // NEW: Use overlay mode by default
        autoInit: true,
        defaultEnabled: false       // User must opt-in
      });
      console.log('Virtual Human Controller auto-initialized with overlay mode');
    }
  });

  // Also initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
  } else {
    // DOM is already ready
    if (!window.virtualHumanController) {
      window.virtualHumanController = new VirtualHumanController({
        useOverlay: true,
        autoInit: true,
        defaultEnabled: false
      });
      console.log('Virtual Human Controller initialized immediately');
    }
  }

})(window);
