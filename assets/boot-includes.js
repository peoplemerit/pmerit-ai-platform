/**
 * PMERIT Platform - Boot Includes
 * Dynamic Partial Loader & Core Application Bootstrap
 * ================================================
 * Version: 3.0.0
 * Purpose: Load shared template partials and initialize core functionality
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    partials: {
      header: '/partials/header.html',
      nav: '/partials/nav.html', 
      footer: '/partials/footer.html'
    },
    containers: {
      header: '#header-container',
      nav: '#nav-container', 
      footer: '#footer-container'
    },
    debug: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'),
    retryAttempts: 3,
    retryDelay: 1000
  };
  
  // Global PMERIT namespace
  window.PMERIT = window.PMERIT || {
    version: '3.0.0',
    build: '2025.09.04',
    config: CONFIG,
    state: {
      partialsLoaded: false,
      userAuthenticated: false,
      userRole: null,
      currentPage: null
    },
    utils: {},
    components: {},
    events: new EventTarget()
  };
  
  // Utility Functions
  const utils = {
    /**
     * Fetch HTML content with retry logic
     */
    async fetchWithRetry(url, retries = CONFIG.retryAttempts) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return await response.text();
        } catch (error) {
          console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
          if (i === retries - 1) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        }
      }
    },
    
    /**
     * Safely inject HTML content
     */
    injectHTML(container, html) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      
      if (!container) {
        throw new Error('Container element not found');
      }
      
      // Create a temporary container to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Move all child nodes to the target container
      while (temp.firstChild) {
        container.appendChild(temp.firstChild);
      }
    },
    
    /**
     * Execute scripts in injected HTML
     */
    executeScripts(container) {
      const scripts = container.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        newScript.textContent = script.textContent;
        
        // Replace old script with new one
        script.parentNode.replaceChild(newScript, script);
      });
    },
    
    /**
     * Get current page identifier
     */
    getCurrentPage() {
      const path = window.location.pathname;
      const page = path.split('/').pop().replace('.html', '') || 'home';
      return page === 'index' ? 'home' : page;
    },
    
    /**
     * Show loading state
     */
    showLoading(message = 'Loading...') {
      const loader = document.createElement('div');
      loader.id = 'pmerit-loader';
      loader.className = 'pmerit-loader';
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <div class="loader-message">${message}</div>
        </div>
      `;
      
      // Add loader styles if not present
      if (!document.querySelector('#pmerit-loader-styles')) {
        const styles = document.createElement('style');
        styles.id = 'pmerit-loader-styles';
        styles.textContent = `
          .pmerit-loader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loader-content {
            text-align: center;
            color: var(--text-secondary);
          }
          .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          .loader-message {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(loader);
      return loader;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
      const loader = document.getElementById('pmerit-loader');
      if (loader) {
        loader.remove();
      }
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    /**
     * Log with debug flag
     */
    log(...args) {
      if (CONFIG.debug) {
        console.log('[PMERIT]', ...args);
      }
    },
    
    /**
     * Error logging
     */
    error(...args) {
      console.error('[PMERIT ERROR]', ...args);
    }
  };
  
  // Add utils to global namespace
  window.PMERIT.utils = utils;
  
  // Partial Loader
  class PartialLoader {
    constructor() {
      this.loadedPartials = new Set();
      this.loadingPromises = new Map();
    }
    
    /**
     * Load a single partial
     */
    async loadPartial(name, url, container) {
      // Return existing promise if already loading
      if (this.loadingPromises.has(name)) {
        return this.loadingPromises.get(name);
      }
      
      // Return immediately if already loaded
      if (this.loadedPartials.has(name)) {
        utils.log(`Partial '${name}' already loaded`);
        return;
      }
      
      utils.log(`Loading partial: ${name} from ${url}`);
      
      const promise = this._doLoadPartial(name, url, container);
      this.loadingPromises.set(name, promise);
      
      try {
        await promise;
        this.loadedPartials.add(name);
        this.loadingPromises.delete(name);
        utils.log(`Partial '${name}' loaded successfully`);
      } catch (error) {
        this.loadingPromises.delete(name);
        throw error;
      }
    }
    
    /**
     * Internal partial loading logic
     */
    async _doLoadPartial(name, url, containerSelector) {
      try {
        const html = await utils.fetchWithRetry(url);
        const container = document.querySelector(containerSelector);
        
        if (!container) {
          throw new Error(`Container '${containerSelector}' not found for partial '${name}'`);
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Inject new content
        utils.injectHTML(container, html);
        
        // Execute any scripts
        utils.executeScripts(container);
        
        // Dispatch event
        window.PMERIT.events.dispatchEvent(new CustomEvent('partial:loaded', {
          detail: { name, container: containerSelector }
        }));
        
      } catch (error) {
        utils.error(`Failed to load partial '${name}':`, error);
        this._showPartialError(name, containerSelector, error);
        throw error;
      }
    }
    
    /**
     * Show error message for failed partial
     */
    _showPartialError(name, containerSelector, error) {
      const container = document.querySelector(containerSelector);
      if (container) {
        container.innerHTML = `
          <div class="partial-error" style="padding: 1rem; border: 1px solid var(--border-error); border-radius: var(--radius-md); background: var(--error-light); color: var(--error);">
            <strong>Failed to load ${name}</strong><br>
            <small>${error.message}</small>
          </div>
        `;
      }
    }
    
    /**
     * Load all configured partials
     */
    async loadAllPartials() {
      const loadPromises = Object.entries(CONFIG.partials).map(([name, url]) => {
        const container = CONFIG.containers[name];
        if (container) {
          return this.loadPartial(name, url, container);
        } else {
          utils.error(`No container configured for partial '${name}'`);
          return Promise.resolve();
        }
      });
      
      try {
        await Promise.all(loadPromises);
        window.PMERIT.state.partialsLoaded = true;
        
        // Dispatch global event
        window.PMERIT.events.dispatchEvent(new CustomEvent('partials:allLoaded'));
        
        utils.log('All partials loaded successfully');
      } catch (error) {
        utils.error('Failed to load some partials:', error);
        throw error;
      }
    }
  }
  
  // Application Initializer
  class PMERITApp {
    constructor() {
      this.loader = new PartialLoader();
      this.initialized = false;
    }
    
    /**
     * Initialize the application
     */
    async init() {
      if (this.initialized) {
        utils.log('App already initialized');
        return;
      }
      
      utils.log('Initializing PMERIT application...');
      
      try {
        // Show loading state
        const loadingEl = utils.showLoading('Loading PMERIT Platform...');
        
        // Set current page
        window.PMERIT.state.currentPage = utils.getCurrentPage();
        
        // Load partials
        await this.loader.loadAllPartials();
        
        // Initialize core functionality
        await this.initializeCore();
        
        // Hide loading state
        utils.hideLoading();
        
        this.initialized = true;
        
        // Dispatch app ready event
        window.PMERIT.events.dispatchEvent(new CustomEvent('app:ready'));
        
        utils.log('PMERIT application initialized successfully');
        
      } catch (error) {
        utils.hideLoading();
        utils.error('Failed to initialize application:', error);
        this.showInitError(error);
      }
    }
    
    /**
     * Initialize core functionality
     */
    async initializeCore() {
      // Load navigation configuration
      await this.loadNavConfig();
      
      // Initialize authentication state
      this.initializeAuth();
      
      // Initialize page-specific functionality
      this.initializePageFeatures();
      
      // Initialize global event listeners
      this.initializeEventListeners();
      
      // Initialize accessibility features
      this.initializeA11y();
    }
    
    /**
     * Load navigation configuration
     */
    async loadNavConfig() {
      try {
        // Load nav-config.js if it exists
        const script = document.createElement('script');
        script.src = '/assets/nav-config.js';
        script.onerror = () => {
          utils.log('nav-config.js not found, using default navigation');
        };
        document.head.appendChild(script);
      } catch (error) {
        utils.log('Failed to load navigation config:', error);
      }
    }
    
    /**
     * Initialize authentication state
     */
    initializeAuth() {
      // Check for stored authentication
      try {
        const authData = localStorage.getItem('pmerit_auth');
        if (authData) {
          const auth = JSON.parse(authData);
          window.PMERIT.state.userAuthenticated = auth.authenticated || false;
          window.PMERIT.state.userRole = auth.role || null;
        }
      } catch (error) {
        utils.log('Failed to load auth state:', error);
      }
      
      // Dispatch auth state change
      window.PMERIT.events.dispatchEvent(new CustomEvent('auth:stateChanged', {
        detail: {
          isAuthenticated: window.PMERIT.state.userAuthenticated,
          userRole: window.PMERIT.state.userRole
        }
      }));
    }
    
    /**
     * Initialize page-specific features
     */
    initializePageFeatures() {
      const page = window.PMERIT.state.currentPage;
      
      // Page-specific initializations
      switch (page) {
        case 'home':
          this.initializeHomePage();
          break;
        case 'assessment':
          this.initializeAssessmentPage();
          break;
        case 'courses':
          this.initializeCoursesPage();
          break;
        case 'dashboard':
          this.initializeDashboardPage();
          break;
        case 'classroom':
          this.initializeClassroomPage();
          break;
        default:
          utils.log(`No specific initialization for page: ${page}`);
      }
      
      // Dispatch page ready event
      window.PMERIT.events.dispatchEvent(new CustomEvent('page:ready', {
        detail: { page }
      }));
    }
    
    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
      // Handle navigation changes
      window.addEventListener('popstate', () => {
        const newPage = utils.getCurrentPage();
        if (newPage !== window.PMERIT.state.currentPage) {
          window.PMERIT.state.currentPage = newPage;
          window.PMERIT.events.dispatchEvent(new CustomEvent('page:changed', {
            detail: { page: newPage }
          }));
        }
      });
      
      // Handle online/offline status
      window.addEventListener('online', () => {
        window.PMERIT.events.dispatchEvent(new CustomEvent('connection:online'));
      });
      
      window.addEventListener('offline', () => {
        window.PMERIT.events.dispatchEvent(new CustomEvent('connection:offline'));
      });
      
      // Handle visibility changes
      document.addEventListener('visibilitychange', () => {
        window.PMERIT.events.dispatchEvent(new CustomEvent('page:visibilityChanged', {
          detail: { hidden: document.hidden }
        }));
      });
    }
    
    /**
     * Initialize accessibility features
     */
    initializeA11y() {
      // Add skip link if not present
      this.addSkipLink();
      
      // Announce page changes to screen readers
      this.initializeAriaLive();
      
      // Handle keyboard navigation
      this.initializeKeyboardNav();
    }
    
    /**
     * Add skip link for keyboard users
     */
    addSkipLink() {
      if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        document.body.insertAdjacentElement('afterbegin', skipLink);
      }
    }
    
    /**
     * Initialize ARIA live region for announcements
     */
    initializeAriaLive() {
      if (!document.querySelector('#aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
      }
    }
    
    /**
     * Initialize keyboard navigation
     */
    initializeKeyboardNav() {
      // Add keyboard support for interactive elements
      document.addEventListener('keydown', (event) => {
        // Handle Escape key for modals/dropdowns
        if (event.key === 'Escape') {
          window.PMERIT.events.dispatchEvent(new CustomEvent('keyboard:escape'));
        }
        
        // Handle Enter/Space for custom buttons
        if ((event.key === 'Enter' || event.key === ' ') && 
            event.target.hasAttribute('data-keyboard-action')) {
          event.preventDefault();
          event.target.click();
        }
      });
    }
    
    /**
     * Page-specific initializers
     */
    initializeHomePage() {
      utils.log('Initializing home page features');
      // Home page specific code will go here
    }
    
    initializeAssessmentPage() {
      utils.log('Initializing assessment page features');
      // Assessment page specific code will go here
    }
    
    initializeCoursesPage() {
      utils.log('Initializing courses page features');
      // Courses page specific code will go here
    }
    
    initializeDashboardPage() {
      utils.log('Initializing dashboard page features');
      // Dashboard page specific code will go here
    }
    
    initializeClassroomPage() {
      utils.log('Initializing classroom page features');
      // Classroom page specific code will go here
    }
    
    /**
     * Show initialization error
     */
    showInitError(error) {
      const errorEl = document.createElement('div');
      errorEl.className = 'init-error';
      errorEl.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg-primary); z-index: 10000; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 2rem;">
          <h1 style="color: var(--error); margin-bottom: 1rem;">Failed to Load PMERIT Platform</h1>
          <p style="color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px;">
            We're having trouble loading the platform. Please check your internet connection and try refreshing the page.
          </p>
          <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
            Refresh Page
          </button>
          ${CONFIG.debug ? `<details style="margin-top: 2rem; max-width: 600px;"><summary>Error Details</summary><pre style="text-align: left; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-top: 1rem; overflow: auto;">${error.stack || error.message}</pre></details>` : ''}
        </div>
      `;
      document.body.appendChild(errorEl);
    }
  }
  
  // Create global app instance
  window.PMERIT.app = new PMERITApp();
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.PMERIT.app.init();
    });
  } else {
    // DOM is already ready
    window.PMERIT.app.init();
  }
  
  // Export for manual initialization if needed
  window.PMERIT.init = () => window.PMERIT.app.init();
  
})();
