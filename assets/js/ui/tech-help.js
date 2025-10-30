/**
 * PMERIT Tech Help Modal Controller
 * Version: 1.0
 * Last Updated: October 30, 2025
 *
 * Manages the Tech Help modal component
 * Features: Form handling, focus management, accessibility, keyboard navigation
 */

(function () {
  'use strict';

  // Constants
  const SUBMIT_DELAY = 1000;
  const CLOSE_DELAY = 2000;
  const DEFAULT_BUTTON_HTML = '<i class="fas fa-paper-plane"></i> Send';
  const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const TechHelpModal = {
    modal: null,
    backdrop: null,
    closeButton: null,
    form: null,
    descriptionField: null,
    categoryField: null,
    commonFixesLink: null,
    previousFocus: null,
    isOpen: false,

    /**
     * Initialize the Tech Help Modal
     */
    init: function () {
      // Get modal elements
      this.modal = document.getElementById('tech-help-modal');

      if (!this.modal) {
        console.warn('TechHelpModal: Modal element not found. Include partials/tech-help-modal.html');
        return;
      }

      this.backdrop = this.modal.querySelector('.tech-help-modal-backdrop');
      this.closeButton = this.modal.querySelector('.tech-help-modal-close');
      this.form = document.getElementById('tech-help-form');
      this.descriptionField = document.getElementById('tech-help-description');
      this.categoryField = document.getElementById('tech-help-category');
      this.commonFixesLink = document.getElementById('common-fixes-link');

      // Bind event listeners
      this.bindEvents();

      // eslint-disable-next-line no-console
      console.log('✅ TechHelpModal initialized');
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

      // Form submission
      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }

      // Common fixes link
      if (this.commonFixesLink) {
        this.commonFixesLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleCommonFixes();
        });
      }

      // Focus trap
      this.modal.addEventListener('keydown', (e) => this.handleFocusTrap(e));
    },

    /**
     * Open the modal
     */
    open: function () {
      if (this.isOpen || !this.modal) {
        return;
      }

      // Dispatch analytics event
      this.dispatchAnalytics('tech_help_modal_open');

      this.isOpen = true;
      this.previousFocus = document.activeElement;

      // Show modal
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus first input after a short delay
      setTimeout(() => {
        if (this.descriptionField) {
          this.descriptionField.focus();
        }
      }, 100);
    },

    /**
     * Close the modal
     */
    close: function () {
      if (!this.isOpen || !this.modal) {
        return;
      }

      this.isOpen = false;

      // Hide modal
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Clear form and messages
      this.clearForm();
      this.clearMessage();

      // Restore focus
      if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
    },

    /**
     * Handle form submission
     */
    handleSubmit: function (e) {
      e.preventDefault();

      // Get form data
      const description = this.descriptionField?.value.trim();
      const category = this.categoryField?.value;

      // Clear previous messages
      this.clearMessage();

      // Basic validation
      if (!description || !category) {
        this.showMessage('error', 'Please fill in all required fields');
        return;
      }

      if (description.length < 10) {
        this.showMessage('error', 'Please provide a more detailed description');
        return;
      }

      // Disable form
      this.setFormLoading(true);

      // Dispatch analytics event
      this.dispatchAnalytics('tech_help_submit', { category });

      // Simulate submission (since this is a stub)
      setTimeout(() => {
        this.showMessage('success', 'Your request has been submitted. Our team will respond soon!');
        this.setFormLoading(false);

        // Close modal after a delay
        setTimeout(() => {
          this.close();
        }, CLOSE_DELAY);
      }, SUBMIT_DELAY);
    },

    /**
     * Handle common fixes link
     */
    handleCommonFixes: function () {
      // Dispatch analytics event
      this.dispatchAnalytics('tech_help_common_fixes_click');

      // For now, just log a message
      // In a real implementation, this would show a help center or FAQ
      this.showMessage('success', 'Opening common fixes guide...');

      // Simulate navigation
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('Navigate to help center/FAQ');
        // In production, you might do:
        // window.location.href = '/help.html#common-fixes';
        this.close();
      }, 1000);
    },

    /**
     * Show message
     */
    showMessage: function (type, message) {
      const messageEl = document.getElementById('tech-help-message');
      if (!messageEl) {
        return;
      }

      messageEl.textContent = message;
      messageEl.className = `tech-help-modal-message ${type}`;
      messageEl.style.display = 'block';
    },

    /**
     * Clear message
     */
    clearMessage: function () {
      const messageEl = document.getElementById('tech-help-message');
      if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'tech-help-modal-message';
        messageEl.style.display = 'none';
      }
    },

    /**
     * Clear form
     */
    clearForm: function () {
      if (this.form) {
        this.form.reset();
      }
    },

    /**
     * Set form loading state
     */
    setFormLoading: function (loading) {
      if (!this.form) {
        return;
      }

      const submitBtn = this.form.querySelector('button[type="submit"]');
      const inputs = this.form.querySelectorAll('input, textarea, select, button');

      if (loading) {
        inputs.forEach(input => {
          input.disabled = true;
        });
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
      } else {
        inputs.forEach(input => {
          input.disabled = false;
        });
        if (submitBtn) {
          submitBtn.innerHTML = DEFAULT_BUTTON_HTML;
        }
      }
    },

    /**
     * Handle focus trap for accessibility
     */
    handleFocusTrap: function (e) {
      if (!this.isOpen || e.key !== 'Tab') {
        return;
      }

      const focusableElements = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },

    /**
     * Dispatch analytics event
     */
    dispatchAnalytics: function (eventName, data = {}) {
      // eslint-disable-next-line no-console
      console.log(`📊 Analytics: ${eventName}`, data);

      // Dispatch custom event for future analytics integration
      window.dispatchEvent(new CustomEvent('pmerit-analytics', {
        detail: { event: eventName, ...data }
      }));
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TechHelpModal.init());
  } else {
    TechHelpModal.init();
  }

  // Export globally
  window.TechHelpModal = TechHelpModal;

  // eslint-disable-next-line no-console
  console.log('🛠️ TechHelpModal controller loaded');
})();
