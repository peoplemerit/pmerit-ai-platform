/**
 * PMERIT Home Page Avatar Integration
 * Phase 3.3-B: Front Page Virtual Human with Receptionist Mode
 * 
 * This module integrates the Virtual Human on the home page with:
 * - Lazy loading for performance
 * - Receptionist conversation starters
 * - CTA wiring for assessment and sign-up
 * - Analytics tracking
 * - Guest session logging
 */

(function (window) {
  'use strict';

  class HomeAvatarManager {
    constructor() {
      this.config = {
        apiBaseUrl: '/api',
        storageKey: 'pmerit_vh_home_enabled',
        sessionKey: 'pmerit_vh_home_session'
      };

      this.state = {
        enabled: false,
        initialized: false,
        avatarManager: null,
        sessionId: null,
        startedAt: null,
        interactions: 0,
        ctaClicks: {}
      };

      this.conversationStarters = [
        {
          icon: 'fa-graduation-cap',
          text: 'Tell me about courses',
          response: 'I\'d be happy to help you explore our courses! We offer a wide range of programs designed to help you build valuable skills. Would you like to start with our career assessment to find the best fit for your goals?',
          ctas: ['assessment']
        },
        {
          icon: 'fa-compass',
          text: 'How can I discover my path?',
          response: 'Great question! Our "Discover Your Path" assessment helps you identify your strengths, interests, and ideal career direction. It takes about 10-15 minutes and provides personalized course recommendations. Ready to begin?',
          ctas: ['assessment']
        },
        {
          icon: 'fa-money-bill-wave',
          text: 'What does it cost?',
          response: 'We believe education should be accessible to everyone. We offer flexible pricing including free courses for those in need, affordable paid options, and scholarship opportunities. Would you like to create an account to see what\'s available?',
          ctas: ['signup', 'pricing']
        },
        {
          icon: 'fa-question-circle',
          text: 'How does PMERIT work?',
          response: 'PMERIT is an AI-powered learning platform that provides personalized education and career guidance. You can take courses, get certified, and connect with opportunities—all designed to help you break poverty cycles through education. Want to get started with a free account?',
          ctas: ['signup', 'signin']
        },
        {
          icon: 'fa-briefcase',
          text: 'Can this help my career?',
          response: 'Absolutely! PMERIT focuses on career-oriented education with practical skills that employers value. Many of our learners have secured remote work opportunities after completing courses. Let\'s start by discovering which career path interests you most!',
          ctas: ['assessment', 'signup']
        }
      ];
    }

    /**
     * Initialize the home avatar system
     */
    async init() {
      if (this.state.initialized) {
        console.warn('HomeAvatarManager already initialized');
        return;
      }

      console.log('🏠 Initializing Home Avatar Manager...');

      try {
        // Check saved preference
        const savedEnabled = localStorage.getItem(this.config.storageKey);
        this.state.enabled = savedEnabled === 'true';

        // Set up DOM
        this._setupDOM();

        // Wire event listeners
        this._wireEvents();

        // If enabled, lazy load avatar
        if (this.state.enabled) {
          await this._lazyLoadAvatar();
        }

        this.state.initialized = true;
        console.log('✅ Home Avatar Manager initialized');

        // Track initialization
        this._trackEvent('vh_home_init', { enabled: this.state.enabled });

      } catch (error) {
        console.error('❌ Home Avatar Manager initialization failed:', error);
      }
    }

    /**
     * Set up DOM elements for avatar
     * @private
     */
    _setupDOM() {
      // Check if container already exists
      if (document.getElementById('vh-home-container')) {
        return;
      }

      // Create avatar container
      const container = document.createElement('div');
      container.id = 'vh-home-container';
      container.className = 'vh-home-container hidden';
      container.innerHTML = `
        <div class="vh-home-header">
          <div class="vh-home-title">
            <i class="fas fa-robot"></i>
            Virtual Assistant
          </div>
          <div class="vh-home-controls">
            <button 
              class="vh-home-toggle" 
              id="vh-home-toggle-btn"
              aria-label="Toggle Virtual Human Mode"
              title="Toggle Virtual Human Mode">
            </button>
            <button 
              class="vh-home-minimize" 
              id="vh-home-minimize-btn"
              aria-label="Minimize"
              title="Minimize">
              <i class="fas fa-minus"></i>
            </button>
            <button 
              class="vh-home-close" 
              id="vh-home-close-btn"
              aria-label="Close"
              title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="vh-content">
          <div class="vh-home-speaking-indicator">Speaking</div>
          
          <div class="vh-loading-placeholder" id="vh-loading-placeholder">
            <div class="loading-icon"><i class="fas fa-spinner fa-spin"></i></div>
            <div class="loading-text">Loading Virtual Assistant...</div>
          </div>
          
          <canvas id="vh-home-canvas" style="display: none;"></canvas>
          
          <div class="audio-only-placeholder">
            <div class="avatar-icon"><i class="fas fa-user-circle"></i></div>
            <div class="status-text">Audio-Only Mode</div>
          </div>
          
          <div id="vh-home-captions" aria-live="polite" aria-atomic="true"></div>
        </div>
        
        <div class="vh-conversation-starters" id="vh-starters">
          <div class="vh-starters-title">How can I help you today?</div>
          <div class="vh-starter-buttons" id="vh-starter-buttons"></div>
        </div>
      `;

      document.body.appendChild(container);

      // Populate conversation starters
      this._populateStarters();
    }

    /**
     * Populate conversation starter buttons
     * @private
     */
    _populateStarters() {
      const buttonsContainer = document.getElementById('vh-starter-buttons');
      if (!buttonsContainer) return;

      this.conversationStarters.forEach((starter, index) => {
        const button = document.createElement('button');
        button.className = 'vh-starter-btn';
        button.innerHTML = `<i class="fas ${starter.icon}"></i> ${starter.text}`;
        button.dataset.starterId = index;
        
        button.addEventListener('click', () => this._handleStarterClick(index));
        
        buttonsContainer.appendChild(button);
      });
    }

    /**
     * Wire event listeners
     * @private
     */
    _wireEvents() {
      // Toggle button
      const toggleBtn = document.getElementById('vh-home-toggle-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
      }

      // Minimize button
      const minimizeBtn = document.getElementById('vh-home-minimize-btn');
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => this._minimize());
      }

      // Close button
      const closeBtn = document.getElementById('vh-home-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
      }

      // Also wire the existing VH toggles in the sidebar
      const desktopToggle = document.getElementById('desktopVhToggle');
      const mobileToggle = document.getElementById('mobileVhToggle');
      
      if (desktopToggle) {
        desktopToggle.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.show();
          } else {
            this.hide();
          }
        });
      }

      if (mobileToggle) {
        mobileToggle.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.show();
          } else {
            this.hide();
          }
        });
      }
    }

    /**
     * Handle conversation starter click
     * @private
     */
    async _handleStarterClick(starterId) {
      const starter = this.conversationStarters[starterId];
      if (!starter) return;

      this.state.interactions++;
      this._trackEvent('vh_starter_click', { 
        starterId, 
        text: starter.text 
      });

      // Show response
      await this._speak(starter.response);

      // Show CTAs
      this._showCTAs(starter.ctas);
    }

    /**
     * Speak text using avatar
     * @private
     */
    async _speak(text) {
      if (!this.state.avatarManager) {
        // If avatar not loaded yet, just show caption
        this._showCaption(text);
        return;
      }

      try {
        await this.state.avatarManager.speak(text);
      } catch (error) {
        console.error('Speak error:', error);
        this._showCaption(text);
      }
    }

    /**
     * Show caption text
     * @private
     */
    _showCaption(text) {
      const captionsEl = document.getElementById('vh-home-captions');
      if (captionsEl) {
        captionsEl.textContent = text;
        captionsEl.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          if (captionsEl.textContent === text) {
            captionsEl.style.display = 'none';
          }
        }, 10000);
      }
    }

    /**
     * Show CTA buttons
     * @private
     */
    _showCTAs(ctaTypes) {
      const startersContainer = document.getElementById('vh-starters');
      if (!startersContainer) return;

      // Clear existing CTAs
      const existingCTAs = startersContainer.querySelectorAll('.vh-cta-button');
      existingCTAs.forEach(btn => btn.remove());

      // Create new CTAs
      const ctaConfigs = {
        assessment: {
          text: 'Begin Assessment',
          icon: 'fa-clipboard-list',
          action: () => this._handleAssessmentClick(),
          primary: true
        },
        signup: {
          text: 'Create Account',
          icon: 'fa-user-plus',
          action: () => this._handleSignUpClick(),
          primary: true
        },
        signin: {
          text: 'Sign In',
          icon: 'fa-sign-in-alt',
          action: () => this._handleSignInClick(),
          primary: false
        },
        pricing: {
          text: 'View Pricing',
          icon: 'fa-dollar-sign',
          action: () => this._handlePricingClick(),
          primary: false
        }
      };

      ctaTypes.forEach(type => {
        const config = ctaConfigs[type];
        if (!config) return;

        const button = document.createElement('button');
        button.className = `vh-cta-button ${config.primary ? 'primary' : ''}`;
        button.innerHTML = `<i class="fas ${config.icon}"></i> ${config.text}`;
        button.dataset.ctaType = type;
        button.addEventListener('click', config.action);

        startersContainer.appendChild(button);
      });
    }

    /**
     * Handle Assessment CTA click
     * @private
     */
    _handleAssessmentClick() {
      this.state.ctaClicks.assessment = (this.state.ctaClicks.assessment || 0) + 1;
      this._trackEvent('cta_assessment_click', { sessionId: this.state.sessionId });
      
      // Navigate to assessment
      window.location.href = '/assessment.html';
    }

    /**
     * Handle Sign Up CTA click
     * @private
     */
    _handleSignUpClick() {
      this.state.ctaClicks.signup = (this.state.ctaClicks.signup || 0) + 1;
      this._trackEvent('cta_signup_click', { sessionId: this.state.sessionId });
      
      // Open Auth Modal with signup tab if available
      if (window.AuthModal) {
        window.AuthModal.open('signup');
      } else {
        window.location.href = '/signin.html';
      }
    }

    /**
     * Handle Sign In CTA click
     * @private
     */
    _handleSignInClick() {
      this.state.ctaClicks.signin = (this.state.ctaClicks.signin || 0) + 1;
      this._trackEvent('cta_signin_click', { sessionId: this.state.sessionId });
      
      // Open Auth Modal with signin tab if available
      if (window.AuthModal) {
        window.AuthModal.open('signin');
      } else {
        window.location.href = '/signin.html';
      }
    }

    /**
     * Handle Pricing CTA click
     * @private
     */
    _handlePricingClick() {
      this.state.ctaClicks.pricing = (this.state.ctaClicks.pricing || 0) + 1;
      this._trackEvent('cta_pricing_click', { sessionId: this.state.sessionId });
      
      window.location.href = '/pricing.html';
    }

    /**
     * Lazy load avatar modules
     * @private
     */
    async _lazyLoadAvatar() {
      if (this.state.avatarManager) {
        return; // Already loaded
      }

      console.log('🔄 Lazy loading avatar modules...');

      try {
        // Load Three.js if not already loaded
        if (!window.THREE) {
          await this._loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
            'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==',
            'anonymous'
          );
        }

        // Load avatar modules
        const moduleScripts = [
          '/assets/js/avatar/AudioPlayer.js',
          '/assets/js/avatar/LipSyncVisemes.js',
          '/assets/js/avatar/WebGLProvider.js',
          '/assets/js/avatar/AvatarManager.js'
        ];

        for (const src of moduleScripts) {
          if (!document.querySelector(`script[src="${src}"]`)) {
            await this._loadScript(src);
          }
        }

        // Initialize avatar manager
        if (window.AvatarManager) {
          this.state.avatarManager = new window.AvatarManager({
            canvasId: 'vh-home-canvas',
            captionsId: 'vh-home-captions',
            enabled: true,
            apiBaseUrl: this.config.apiBaseUrl
          });

          await this.state.avatarManager.init();

          // Hide loading placeholder, show canvas
          const placeholder = document.getElementById('vh-loading-placeholder');
          const canvas = document.getElementById('vh-home-canvas');
          if (placeholder) placeholder.style.display = 'none';
          if (canvas) canvas.style.display = 'block';

          console.log('✅ Avatar modules loaded');
        }

      } catch (error) {
        console.error('❌ Failed to load avatar modules:', error);
        this._showError('Failed to load Virtual Assistant. Continuing in audio-only mode.');
      }
    }

    /**
     * Load external script
     * @private
     */
    _loadScript(src, integrity, crossorigin) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        if (integrity) script.integrity = integrity;
        if (crossorigin) script.crossOrigin = crossorigin;
        script.referrerPolicy = 'no-referrer';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    /**
     * Show error message
     * @private
     */
    _showError(message) {
      const captionsEl = document.getElementById('vh-home-captions');
      if (captionsEl) {
        captionsEl.textContent = message;
        captionsEl.style.display = 'block';
        captionsEl.style.color = '#ff6b6b';
      }
    }

    /**
     * Toggle avatar visibility
     */
    async toggle() {
      if (this.state.enabled) {
        this.hide();
      } else {
        await this.show();
      }
    }

    /**
     * Show avatar
     */
    async show() {
      this.state.enabled = true;
      localStorage.setItem(this.config.storageKey, 'true');

      const container = document.getElementById('vh-home-container');
      const toggleBtn = document.getElementById('vh-home-toggle-btn');

      if (container) {
        container.classList.remove('hidden');
      }

      if (toggleBtn) {
        toggleBtn.classList.add('on');
      }

      // Update sidebar toggles
      const desktopToggle = document.getElementById('desktopVhToggle');
      const mobileToggle = document.getElementById('mobileVhToggle');
      if (desktopToggle) desktopToggle.checked = true;
      if (mobileToggle) mobileToggle.checked = true;

      // Start session
      this._startSession();

      // Lazy load avatar if not already loaded
      if (!this.state.avatarManager) {
        await this._lazyLoadAvatar();
      }

      this._trackEvent('vh_toggle_on', { sessionId: this.state.sessionId });
    }

    /**
     * Hide avatar
     */
    hide() {
      this.state.enabled = false;
      localStorage.setItem(this.config.storageKey, 'false');

      const container = document.getElementById('vh-home-container');
      const toggleBtn = document.getElementById('vh-home-toggle-btn');

      if (container) {
        container.classList.add('hidden');
      }

      if (toggleBtn) {
        toggleBtn.classList.remove('on');
      }

      // Update sidebar toggles
      const desktopToggle = document.getElementById('desktopVhToggle');
      const mobileToggle = document.getElementById('mobileVhToggle');
      if (desktopToggle) desktopToggle.checked = false;
      if (mobileToggle) mobileToggle.checked = false;

      // End session
      this._endSession();

      this._trackEvent('vh_toggle_off', { sessionId: this.state.sessionId });
    }

    /**
     * Minimize avatar
     * @private
     */
    _minimize() {
      const container = document.getElementById('vh-home-container');
      if (container) {
        container.classList.toggle('collapsed');
      }

      this._trackEvent('vh_minimize', { sessionId: this.state.sessionId });
    }

    /**
     * Generate cryptographically secure random ID
     * @private
     */
    _generateSecureId() {
      // Use crypto.getRandomValues for secure randomness
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').substring(0, 12);
    }

    /**
     * Start guest session
     * @private
     */
    _startSession() {
      if (this.state.sessionId) return; // Already started

      this.state.sessionId = `guest_${Date.now()}_${this._generateSecureId()}`;
      this.state.startedAt = new Date().toISOString();
      this.state.interactions = 0;
      this.state.ctaClicks = {};

      // Save to sessionStorage
      sessionStorage.setItem(this.config.sessionKey, JSON.stringify({
        sessionId: this.state.sessionId,
        startedAt: this.state.startedAt
      }));

      console.log('📊 Started VH session:', this.state.sessionId);
    }

    /**
     * End guest session and log
     * @private
     */
    async _endSession() {
      if (!this.state.sessionId) return;

      const endedAt = new Date().toISOString();
      const durationSec = Math.floor(
        (new Date(endedAt) - new Date(this.state.startedAt)) / 1000
      );

      // Log session summary
      try {
        await fetch(`${this.config.apiBaseUrl}/session/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.state.sessionId,
            startedAt: this.state.startedAt,
            endedAt,
            durationSec,
            vhMode: true,
            guestMode: true,
            interactions: this.state.interactions,
            ctaClicks: this.state.ctaClicks
          })
        });

        console.log('📊 Session logged:', this.state.sessionId);
      } catch (error) {
        console.error('Failed to log session:', error);
      }

      // Clear session
      sessionStorage.removeItem(this.config.sessionKey);
      this.state.sessionId = null;
      this.state.startedAt = null;
    }

    /**
     * Track analytics event
     * @private
     */
    _trackEvent(eventName, data = {}) {
      console.log('📊 Analytics:', eventName, data);
      
      // Dispatch custom event for external analytics
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: eventName, ...data }
      }));

      // TODO: Send to analytics service
    }

    /**
     * Clean up
     */
    dispose() {
      this._endSession();

      if (this.state.avatarManager) {
        this.state.avatarManager.dispose();
        this.state.avatarManager = null;
      }

      const container = document.getElementById('vh-home-container');
      if (container) {
        container.remove();
      }

      this.state.initialized = false;
    }
  }

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    window.homeAvatar = new HomeAvatarManager();
    window.homeAvatar.init();
  });

  // Export to global scope
  window.HomeAvatarManager = HomeAvatarManager;

})(window);
