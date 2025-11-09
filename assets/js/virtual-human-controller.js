/**
 * Virtual Human Controller
 * Phase 3.3: Virtual Human Integration
 *
 * Orchestrates integration between 3D avatar, TTS API, chat interface,
 * and lip-sync system to create a cohesive Virtual Human experience.
 *
 * @module virtual-human-controller
 * @requires virtual-human-api.js
 * @requires /assets/js/avatar/AvatarManager.js
 * @requires /assets/js/avatar/LipSyncVisemes.js
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
        initialized: false,
        avatarLoaded: false,
        speaking: false,
        muted: false,
        currentAvatar: null,
        currentAnimation: 'idle',
        error: null
      };

      // Components
      this.avatarManager = null;
      this.lipSyncController = null;
      this.api = window.virtualHumanAPI;

      // UI Elements
      this.container = null;
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

        // Get container
        this.container = document.getElementById(this.config.containerId);
        if (!this.container) {
          throw new Error(`Container #${this.config.containerId} not found`);
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
      // Find or create toggle button
      this.toggleButton = document.getElementById('vh-toggle');
      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => this.toggle());
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
      // Listen for TTS events
      this.api.on('start', this.handleTTSStart.bind(this));
      this.api.on('complete', this.handleTTSComplete.bind(this));
      this.api.on('error', this.handleTTSError.bind(this));

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

        // Show container
        if (this.container) {
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
        this.updateToggleButton();

        // Save preference
        this.savePreference('enabled', true);

        console.log('Virtual Human enabled');

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

      // Hide container
      if (this.container) {
        this.container.style.display = 'none';
      }

      // Stop any speaking
      this.api.stop();

      // Stop animations
      this.stopIdleAnimation();

      // Update state
      this.state.enabled = false;

      // Update UI
      this.updateToggleButton();

      // Save preference
      this.savePreference('enabled', false);

      console.log('Virtual Human disabled');
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

        // Stop idle animation
        this.stopIdleAnimation();

        // Use AvatarManager's speak method if available
        if (this.avatarManager && typeof this.avatarManager.speak === 'function') {
          await this.avatarManager.speak(text);
        } else {
          // Fallback to API-only
          await this.api.speakAndPlay(text);
        }

        // Update state
        this.state.speaking = false;

        // Resume idle animation
        if (this.config.enableIdleAnimation) {
          this.startIdleAnimation();
        }

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
     */
    updateToggleButton() {
      if (!this.toggleButton) {
        return;
      }

      const text = this.state.enabled ? 'Hide Assistant' : 'Show Assistant';
      const icon = this.state.enabled ? 'fa-eye-slash' : 'fa-eye';

      this.toggleButton.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
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

  // Auto-create default instance if container exists
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('virtual-human-container');
    if (container) {
      window.virtualHumanController = new VirtualHumanController({
        autoInit: true,
        defaultEnabled: false // User must opt-in
      });
    }
  });

})(window);
