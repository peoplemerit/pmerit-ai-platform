/**
 * PMERIT Tech Help Modal Controller
 * Version: 1.1
 * Last Updated: October 30, 2025
 *
 * Manages the Tech Help modal component
 * Features: Form handling, focus management, accessibility, keyboard navigation, FAQ search
 */

(function () {
  'use strict';

  // Constants
  const SUBMIT_DELAY = 1000;
  const CLOSE_DELAY = 2000;
  const DEFAULT_BUTTON_HTML = '<i class="fas fa-paper-plane"></i> Send';
  const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const FAQ_DATA_URL = '/assets/data/tech-help-faq.json';

  const TechHelpModal = {
    modal: null,
    backdrop: null,
    closeButton: null,
    form: null,
    descriptionField: null,
    categoryField: null,
    previousFocus: null,
    isOpen: false,
    
    // Tab elements
    formTab: null,
    faqTab: null,
    formPanel: null,
    faqPanel: null,
    currentTab: 'form',
    
    // FAQ elements
    faqSearch: null,
    faqResults: null,
    faqDetail: null,
    faqDetailContent: null,
    faqBackBtn: null,
    faqContactSupport: null,
    faqData: [],
    currentQuery: '',

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
      
      // Tab elements
      this.formTab = document.getElementById('help-form-tab');
      this.faqTab = document.getElementById('help-faq-tab');
      this.formPanel = document.getElementById('help-form-panel');
      this.faqPanel = document.getElementById('help-faq-panel');
      
      // FAQ elements
      this.faqSearch = document.getElementById('faq-search');
      this.faqResults = document.getElementById('faq-results');
      this.faqDetail = document.getElementById('faq-detail');
      this.faqDetailContent = document.getElementById('faq-detail-content');
      this.faqBackBtn = document.getElementById('faq-back-btn');
      this.faqContactSupport = document.getElementById('faq-contact-support');

      // Load FAQ data
      this.loadFAQData();

      // Bind event listeners
      this.bindEvents();
      
      // Check for deep link
      this.checkDeepLink();

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

      // Tab switching
      if (this.formTab) {
        this.formTab.addEventListener('click', () => this.switchTab('form'));
      }
      if (this.faqTab) {
        this.faqTab.addEventListener('click', () => this.switchTab('faq'));
      }
      
      // FAQ search
      if (this.faqSearch) {
        this.faqSearch.addEventListener('input', (e) => this.handleFAQSearch(e));
      }
      
      // FAQ back button
      if (this.faqBackBtn) {
        this.faqBackBtn.addEventListener('click', () => this.showFAQResults());
      }
      
      // FAQ contact support
      if (this.faqContactSupport) {
        this.faqContactSupport.addEventListener('click', () => this.switchTab('form'));
      }

      // Focus trap
      this.modal.addEventListener('keydown', (e) => this.handleFocusTrap(e));
    },
    
    /**
     * Load FAQ data
     */
    loadFAQData: async function () {
      try {
        const response = await fetch(FAQ_DATA_URL);
        if (!response.ok) {
          throw new Error('Failed to load FAQ data');
        }
        const data = await response.json();
        this.faqData = data.faqs || [];
        
        // Show all FAQs initially
        this.renderFAQResults(this.faqData);
      } catch (error) {
        console.error('Error loading FAQ data:', error);
        this.faqData = [];
      }
    },
    
    /**
     * Switch between tabs
     */
    switchTab: function (tab) {
      if (this.currentTab === tab) {
        return;
      }
      
      this.currentTab = tab;
      
      // Update tab states
      if (tab === 'form') {
        this.formTab?.classList.add('active');
        this.formTab?.setAttribute('aria-selected', 'true');
        this.faqTab?.classList.remove('active');
        this.faqTab?.setAttribute('aria-selected', 'false');
        
        this.formPanel?.classList.add('active');
        this.formPanel?.removeAttribute('hidden');
        this.faqPanel?.classList.remove('active');
        this.faqPanel?.setAttribute('hidden', '');
        
        // Focus first input
        setTimeout(() => this.descriptionField?.focus(), 100);
      } else {
        this.faqTab?.classList.add('active');
        this.faqTab?.setAttribute('aria-selected', 'true');
        this.formTab?.classList.remove('active');
        this.formTab?.setAttribute('aria-selected', 'false');
        
        this.faqPanel?.classList.add('active');
        this.faqPanel?.removeAttribute('hidden');
        this.formPanel?.classList.remove('active');
        this.formPanel?.setAttribute('hidden', '');
        
        // Focus search input
        setTimeout(() => this.faqSearch?.focus(), 100);
        
        // Dispatch analytics
        this.dispatchAnalytics('tech_help_faq_open');
      }
    },
    
    /**
     * Handle FAQ search
     */
    handleFAQSearch: function (e) {
      const query = e.target.value.toLowerCase().trim();
      this.currentQuery = query;
      
      if (!query) {
        this.renderFAQResults(this.faqData);
        return;
      }
      
      // Search FAQs by title, tags, and body
      const results = this.faqData.filter(faq => {
        const titleMatch = faq.title.toLowerCase().includes(query);
        const tagsMatch = faq.tags.some(tag => tag.toLowerCase().includes(query));
        const bodyMatch = faq.body.toLowerCase().includes(query);
        return titleMatch || tagsMatch || bodyMatch;
      });
      
      this.renderFAQResults(results);
    },
    
    /**
     * Render FAQ results
     */
    renderFAQResults: function (results) {
      if (!this.faqResults) {
        return;
      }
      
      // Hide detail view
      this.showFAQResults();
      
      if (results.length === 0) {
        this.faqResults.innerHTML = `
          <div class="faq-empty">
            <i class="fas fa-search"></i>
            <p>No results found. Try different keywords or contact support.</p>
          </div>
        `;
        return;
      }
      
      const query = this.currentQuery.toLowerCase();
      
      this.faqResults.innerHTML = results.map(faq => {
        const matchingTags = query ? faq.tags.filter(tag => tag.toLowerCase().includes(query)) : [];
        
        return `
          <div class="faq-item" role="button" tabindex="0" data-faq-id="${faq.id}">
            <h3 class="faq-item-title">${this.highlightText(faq.title, query)}</h3>
            <div class="faq-item-tags">
              ${faq.tags.slice(0, 4).map(tag => {
                const isMatch = matchingTags.includes(tag);
                return `<span class="faq-tag ${isMatch ? 'match' : ''}">${tag}</span>`;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
      
      // Add click handlers
      this.faqResults.querySelectorAll('.faq-item').forEach(item => {
        const faqId = item.getAttribute('data-faq-id');
        item.addEventListener('click', () => this.showFAQDetail(faqId));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.showFAQDetail(faqId);
          }
        });
      });
    },
    
    /**
     * Highlight matching text
     */
    highlightText: function (text, query) {
      if (!query) {
        return text;
      }
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },
    
    /**
     * Show FAQ detail
     */
    showFAQDetail: function (faqId) {
      const faq = this.faqData.find(f => f.id === faqId);
      if (!faq) {
        return;
      }
      
      // Dispatch analytics
      this.dispatchAnalytics('tech_help_faq_view', { faqId: faq.id, title: faq.title });
      
      if (!this.faqDetail || !this.faqDetailContent) {
        return;
      }
      
      this.faqDetailContent.innerHTML = `
        <h3 class="faq-detail-title">${faq.title}</h3>
        <div class="faq-detail-body">${faq.body}</div>
        ${faq.link ? `<a href="${faq.link}" class="faq-detail-link" target="_blank">
          Learn more <i class="fas fa-external-link-alt"></i>
        </a>` : ''}
      `;
      
      // Hide results, show detail
      this.faqResults.style.display = 'none';
      this.faqDetail.removeAttribute('hidden');
      this.faqBackBtn?.focus();
    },
    
    /**
     * Show FAQ results (hide detail)
     */
    showFAQResults: function () {
      if (!this.faqResults || !this.faqDetail) {
        return;
      }
      
      this.faqResults.style.display = '';
      this.faqDetail.setAttribute('hidden', '');
      this.faqSearch?.focus();
    },
    
    /**
     * Check for deep link
     */
    checkDeepLink: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const helpQuery = urlParams.get('help');
      
      if (helpQuery) {
        // Open modal and switch to FAQ tab
        this.open();
        this.switchTab('faq');
        
        // Set search query
        if (this.faqSearch) {
          this.faqSearch.value = helpQuery;
          this.handleFAQSearch({ target: this.faqSearch });
        }
      }
    },

    /**
     * Open the modal
     */
    open: function () {
      if (this.isOpen || !this.modal) {
        return;
      }

      // Dispatch analytics event (only once per session)
      this.dispatchAnalytics('tech_help_open');

      this.isOpen = true;
      this.previousFocus = document.activeElement;

      // Show modal
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus appropriate input after a short delay
      setTimeout(() => {
        if (this.currentTab === 'faq' && this.faqSearch) {
          this.faqSearch.focus();
        } else if (this.descriptionField) {
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
      
      // Reset to form tab
      this.switchTab('form');
      
      // Clear FAQ search
      if (this.faqSearch) {
        this.faqSearch.value = '';
        this.currentQuery = '';
      }

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
