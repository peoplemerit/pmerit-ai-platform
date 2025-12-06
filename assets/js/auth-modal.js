/**
 * PMERIT Auth Modal Controller
 * Version: 1.0
 * Last Updated: October 25, 2025
 *
 * Manages the Auth Modal component with Sign Up and Sign In tabs
 * Features: Tab switching, form handling, focus management, accessibility
 */

(function () {
  'use strict';

  const AuthModal = {
    modal: null,
    backdrop: null,
    closeButton: null,
    signupTab: null,
    signinTab: null,
    signupPanel: null,
    signinPanel: null,
    signupForm: null,
    signinForm: null,
    previousFocus: null,
    isOpen: false,
    currentTab: 'signup',

    /**
     * Initialize the Auth Modal
     */
    init: function () {
      // Get modal elements
      this.modal = document.getElementById('auth-modal');

      if (!this.modal) {
        console.warn('AuthModal: Modal element not found. Include partials/auth-modal.html');
        return;
      }

      this.backdrop = this.modal.querySelector('.auth-modal-backdrop');
      this.closeButton = this.modal.querySelector('.auth-modal-close');
      this.signupTab = document.getElementById('signup-tab');
      this.signinTab = document.getElementById('signin-tab');
      this.signupPanel = document.getElementById('signup-panel');
      this.signinPanel = document.getElementById('signin-panel');
      this.signupForm = document.getElementById('signup-form');
      this.signinForm = document.getElementById('signin-form');

      // Bind event listeners
      this.bindEvents();

      // Check for URL parameter to auto-open
      this.checkAutoOpen();

      // eslint-disable-next-line no-console
      logger.debug('✅ AuthModal initialized');
    },

    /**
     * Bind all event listeners
     */
    bindEvents: function () {
      // Close button
      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => this.close());
      }

      // Backdrop click
      if (this.backdrop) {
        this.backdrop.addEventListener('click', (e) => {
          if (e.target === this.backdrop) {
            this.close();
          }
        });
      }

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Tab switching
      if (this.signupTab) {
        this.signupTab.addEventListener('click', () => this.switchTab('signup'));
      }
      if (this.signinTab) {
        this.signinTab.addEventListener('click', () => this.switchTab('signin'));
      }

      // Tab switch links
      const switchLinks = this.modal.querySelectorAll('[data-switch-to]');
      switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = link.getAttribute('data-switch-to');
          this.switchTab(targetTab);
        });
      });

      // Form submissions
      if (this.signupForm) {
        this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
      }
      if (this.signinForm) {
        this.signinForm.addEventListener('submit', (e) => this.handleSignin(e));
      }

      // Password toggle buttons
      const passwordToggles = this.modal.querySelectorAll('.password-toggle');
      passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = toggle.getAttribute('data-target');
          const input = document.getElementById(targetId);
          if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const icon = toggle.querySelector('i');
            if (icon) {
              icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
          }
        });
      });

      // Keyboard navigation for tabs
      if (this.signupTab && this.signinTab) {
        this.signupTab.addEventListener('keydown', (e) => this.handleTabKeyboard(e, 'signup'));
        this.signinTab.addEventListener('keydown', (e) => this.handleTabKeyboard(e, 'signin'));
      }
    },

    /**
     * Open the modal with specified tab
     * @param {string} tab - 'signup' or 'signin'
     */
    open: function (tab = 'signup') {
      if (this.isOpen || !this.modal) {return;}

      // Dispatch analytics event
      this.dispatchAnalytics('auth_modal_open', { initialTab: tab });

      this.isOpen = true;
      this.previousFocus = document.activeElement;

      // Show modal
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Switch to requested tab
      this.switchTab(tab, true);

      // Focus first input after a short delay
      setTimeout(() => {
        const activePanel = tab === 'signup' ? this.signupPanel : this.signinPanel;
        const firstInput = activePanel?.querySelector('input:not([type="hidden"])');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    },

    /**
     * Close the modal
     */
    close: function () {
      if (!this.isOpen || !this.modal) {return;}

      this.isOpen = false;

      // Hide modal
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Clear forms and messages
      this.clearForms();
      this.clearMessages();

      // Restore focus
      if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
    },

    /**
     * Switch between tabs
     * @param {string} tab - 'signup' or 'signin'
     * @param {boolean} silent - Don't dispatch analytics
     */
    switchTab: function (tab, silent = false) {
      if (this.currentTab === tab) {return;}

      this.currentTab = tab;

      // Dispatch analytics event
      if (!silent) {
        this.dispatchAnalytics('auth_tab_switch', { tab });
      }

      // Update tabs
      if (tab === 'signup') {
        this.signupTab?.classList.add('active');
        this.signupTab?.setAttribute('aria-selected', 'true');
        this.signinTab?.classList.remove('active');
        this.signinTab?.setAttribute('aria-selected', 'false');

        this.signupPanel?.classList.add('active');
        this.signupPanel?.setAttribute('aria-hidden', 'false');
        this.signinPanel?.classList.remove('active');
        this.signinPanel?.setAttribute('aria-hidden', 'true');
      } else {
        this.signinTab?.classList.add('active');
        this.signinTab?.setAttribute('aria-selected', 'true');
        this.signupTab?.classList.remove('active');
        this.signupTab?.setAttribute('aria-selected', 'false');

        this.signinPanel?.classList.add('active');
        this.signinPanel?.setAttribute('aria-hidden', 'false');
        this.signupPanel?.classList.remove('active');
        this.signupPanel?.setAttribute('aria-hidden', 'true');
      }

      // Clear messages when switching
      this.clearMessages();
    },

    /**
     * Handle tab keyboard navigation
     */
    handleTabKeyboard: function (e, currentTab) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newTab = currentTab === 'signup' ? 'signin' : 'signup';
        this.switchTab(newTab);
        const targetTabEl = newTab === 'signup' ? this.signupTab : this.signinTab;
        targetTabEl?.focus();
      }
    },

    /**
     * Handle sign up form submission
     */
    handleSignup: async function (e) {
      e.preventDefault();

      // Get form data
      const firstname = document.getElementById('signup-firstname')?.value.trim();
      const lastname = document.getElementById('signup-lastname')?.value.trim();
      const email = document.getElementById('signup-email')?.value.trim();
      const password = document.getElementById('signup-password')?.value;

      // Clear previous messages
      this.clearMessages();

      // Basic validation
      if (!firstname || !lastname || !email || !password) {
        this.showMessage('signup', 'error', 'All fields are required');
        return;
      }

      if (password.length < 6) {
        this.showMessage('signup', 'error', 'Password must be at least 6 characters');
        return;
      }

      // Check localStorage availability
      if (!this.checkStorageAvailable()) {
        this.showCookieWarning();
        return;
      }

      // Disable form
      this.setFormLoading('signup', true);

      // Dispatch analytics event
      this.dispatchAnalytics('signup_attempt', { email });

      try {
        // Call AUTH.signup
        const result = await window.AUTH.signup(email, password, firstname, lastname);

        if (result.success) {
          // Check if email verification is required
          if (result.requiresVerification) {
            // Show verification message with code (for development/testing)
            let message = 'Account created! Please check your email for verification.';
            if (result.verificationCode) {
              message += ` (Dev code: ${result.verificationCode})`;
            }
            this.showMessage('signup', 'success', message);

            // Store email for verification flow
            sessionStorage.setItem('pmerit_pending_verification', email);

            // Redirect to verification page or portal after delay
            setTimeout(() => {
              window.location.href = '/dashboard.html';
            }, 3000);
          } else {
            // Mock/offline mode - redirect immediately
            this.showMessage('signup', 'success', 'Account created! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard.html';
            }, 1000);
          }
        } else {
          this.showMessage('signup', 'error', result.message || 'Sign up failed');
          this.setFormLoading('signup', false);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        this.showMessage('signup', 'error', 'An unexpected error occurred');
        this.setFormLoading('signup', false);
      }
    },

    /**
     * Handle sign in form submission
     */
    handleSignin: async function (e) {
      e.preventDefault();

      // Get form data
      const email = document.getElementById('signin-email')?.value.trim();
      const password = document.getElementById('signin-password')?.value;

      // Clear previous messages
      this.clearMessages();

      // Basic validation
      if (!email || !password) {
        this.showMessage('signin', 'error', 'Email and password are required');
        return;
      }

      if (password.length < 6) {
        this.showMessage('signin', 'error', 'Password must be at least 6 characters');
        return;
      }

      // Check localStorage availability
      if (!this.checkStorageAvailable()) {
        this.showCookieWarning();
        return;
      }

      // Disable form
      this.setFormLoading('signin', true);

      // Dispatch analytics event
      this.dispatchAnalytics('signin_attempt', { email });

      try {
        // Call AUTH.signin
        const result = await window.AUTH.signin(email, password);

        if (result.success) {
          this.showMessage('signin', 'success', 'Signed in! Redirecting...');

          // Check for stored redirect URL (from protected route)
          const redirectUrl = sessionStorage.getItem('pmerit_redirect_after_login');
          sessionStorage.removeItem('pmerit_redirect_after_login');

          // Redirect after short delay
          setTimeout(() => {
            window.location.href = redirectUrl || '/dashboard.html';
          }, 1000);
        } else {
          this.showMessage('signin', 'error', result.message || 'Sign in failed');
          this.setFormLoading('signin', false);
        }
      } catch (error) {
        console.error('Sign in error:', error);
        this.showMessage('signin', 'error', 'An unexpected error occurred');
        this.setFormLoading('signin', false);
      }
    },

    /**
     * Show message in the specified panel
     */
    showMessage: function (panel, type, message) {
      const messageEl = document.getElementById(`${panel}-message`);
      if (!messageEl) {return;}

      messageEl.textContent = message;
      messageEl.className = `auth-modal-message ${type}`;
      messageEl.style.display = 'block';
    },

    /**
     * Clear all messages
     */
    clearMessages: function () {
      ['signup', 'signin'].forEach(panel => {
        const messageEl = document.getElementById(`${panel}-message`);
        if (messageEl) {
          messageEl.textContent = '';
          messageEl.className = 'auth-modal-message';
          messageEl.style.display = 'none';
        }
      });
      this.hideCookieWarning();
    },

    /**
     * Clear all forms
     */
    clearForms: function () {
      if (this.signupForm) {this.signupForm.reset();}
      if (this.signinForm) {this.signinForm.reset();}
    },

    /**
     * Set form loading state
     */
    setFormLoading: function (panel, loading) {
      const form = panel === 'signup' ? this.signupForm : this.signinForm;
      const submitBtn = form?.querySelector('button[type="submit"]');

      if (!submitBtn) {return;}

      const inputs = form.querySelectorAll('input, button');

      if (loading) {
        inputs.forEach(input => {
          input.disabled = true;
        });
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      } else {
        inputs.forEach(input => {
          input.disabled = false;
        });
        submitBtn.textContent = panel === 'signup' ? 'Create Account' : 'Sign In';
      }
    },

    /**
     * Check if localStorage is available
     */
    checkStorageAvailable: function () {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Show cookie/storage warning
     */
    showCookieWarning: function () {
      const warning = document.getElementById('cookie-warning');
      if (warning) {
        warning.classList.remove('hidden');
      }
    },

    /**
     * Hide cookie/storage warning
     */
    hideCookieWarning: function () {
      const warning = document.getElementById('cookie-warning');
      if (warning) {
        warning.classList.add('hidden');
      }
    },

    /**
     * Check for auto-open URL parameter
     */
    checkAutoOpen: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const openParam = urlParams.get('open');
      const authParam = urlParams.get('auth');

      // Check for ?auth=signin or ?auth=signup (from protected route redirect)
      if (authParam && !window.AUTH?.isAuthenticated()) {
        const tab = authParam === 'signup' ? 'signup' : 'signin';
        setTimeout(() => this.open(tab), 100);

        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        return;
      }

      // Legacy: Check for ?open=dashboard
      if (openParam === 'dashboard' && !window.AUTH?.isAuthenticated()) {
        setTimeout(() => this.open('signup'), 100);
      }
    },

    /**
     * Dispatch analytics event
     */
    dispatchAnalytics: function (eventName, data = {}) {
      // Log to console for Phase 3.1
      // eslint-disable-next-line no-console
      logger.debug(`📊 Analytics: ${eventName}`, data);

      // Dispatch custom event for future analytics integration
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: eventName, ...data }
      }));
    }
  };

  // Export globally (init is called after partial is loaded via fetch in index.html)
  window.AuthModal = AuthModal;

  // eslint-disable-next-line no-console
  logger.debug('🔐 AuthModal controller loaded');
})();
