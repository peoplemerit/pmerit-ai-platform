/**
 * @fileoverview PMERIT Layout Loader - MOSA-Compliant Component Loader
 * @version 1.1
 * @description Dynamically loads header/footer partials with single source of truth
 * @architecture MOSA-compliant modular design
 * @author PMERIT Development Team
 * @license MIT
 *
 * Purpose: Dynamically loads and initializes common header and footer components
 * Usage: Include this script and call LayoutLoader.init() after DOM is ready
 *
 * MOSA Compliance:
 * ✅ Single source of truth for header/footer partials
 * ✅ Modular component design with clear separation of concerns
 * ✅ Standard interfaces through public API methods
 * ✅ Independent functionality - no tight coupling with other modules
 * ✅ Reusable across different pages and contexts
 *
 * Features:
 * - Loads header.html and footer.html partials
 * - Initializes interactive elements (hamburger menu, language selector)
 * - Handles authentication state dynamically
 * - Supports custom insertion points and configuration
 * - Manages settings (Dark Mode, TTS) with localStorage persistence
 * - Accessible keyboard navigation and ARIA attributes
 * - No global namespace pollution
 *
 * @example
 * // Basic initialization
 * document.addEventListener('DOMContentLoaded', () => {
 *   window.LayoutLoader.init();
 * });
 *
 * @example
 * // With custom configuration
 * window.LayoutLoader.init({
 *   headerPartialPath: '/custom/header.html',
 *   footerPartialPath: '/custom/footer.html'
 * });
 */

(function (window) {
  'use strict';

  /**
   * LayoutLoader - Main class for loading header/footer components
   *
   * @class
   * @description MOSA-compliant component loader that manages dynamic loading
   * and initialization of site-wide header and footer elements. Provides a single
   * source of truth for layout components across all pages.
   *
   * @property {boolean} headerLoaded - Indicates if header has been loaded
   * @property {boolean} footerLoaded - Indicates if footer has been loaded
   * @property {Object} config - Configuration object for paths and insertion points
   */
  class LayoutLoader {
    /**
     * Creates a new LayoutLoader instance with default configuration
     *
     * @constructor
     * @description Initializes the loader with default paths and settings.
     * Configuration can be overridden when calling init().
     */
    constructor() {
      this.headerLoaded = false;
      this.footerLoaded = false;
      this.config = {
        headerPartialPath: '/partials/header.html',
        footerPartialPath: '/partials/footer.html',
        headerInsertPoint: 'body',
        footerInsertPoint: 'body',
        headerPosition: 'afterbegin', // prepend to body
        footerPosition: 'beforeend' // append to body
      };
    }

    /**
     * Initialize the layout loader with custom config
     *
     * @async
     * @param {Object} [customConfig={}] - Optional configuration overrides
     * @param {string} [customConfig.headerPartialPath='/partials/header.html'] - Path to header HTML
     * @param {string} [customConfig.footerPartialPath='/partials/footer.html'] - Path to footer HTML
     * @param {string} [customConfig.headerInsertPoint='body'] - CSS selector for header insertion
     * @param {string} [customConfig.footerInsertPoint='body'] - CSS selector for footer insertion
     * @param {string} [customConfig.headerPosition='afterbegin'] - Position for header (afterbegin/beforeend)
     * @param {string} [customConfig.footerPosition='beforeend'] - Position for footer (afterbegin/beforeend)
     * @returns {Promise<Object>} Resolves with status object {header: boolean, footer: boolean, success: boolean, error?: string}
     *
     * @description Loads header and footer partials in parallel, then initializes
     * all interactive components. This is the main entry point for the LayoutLoader.
     *
     * @example
     * // Basic usage
     * await window.LayoutLoader.init();
     *
     * @example
     * // With custom paths
     * await window.LayoutLoader.init({
     *   headerPartialPath: '/custom-partials/header.html',
     *   footerPartialPath: '/custom-partials/footer.html'
     * });
     */
    async init(customConfig = {}) {
      // Merge custom config
      this.config = { ...this.config, ...customConfig };

      // Apply saved theme immediately on initialization
      this.applyTheme();

      try {
        // Load header and footer in parallel
        const results = await Promise.allSettled([
          this.loadHeader(),
          this.loadFooter()
        ]);

        const headerResult = results[0].status === 'fulfilled';
        const footerResult = results[1].status === 'fulfilled';

        this.headerLoaded = headerResult;
        this.footerLoaded = footerResult;

        // Initialize interactive elements after both are loaded
        if (headerResult || footerResult) {
          await this.initializeComponents();
        }

        return {
          header: headerResult,
          footer: footerResult,
          success: headerResult && footerResult
        };
      } catch (error) {
        console.error('[LayoutLoader] Initialization error:', error);
        return {
          header: false,
          footer: false,
          success: false,
          error: error.message
        };
      }
    }

    /**
     * Load header partial from configured path
     *
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If header fails to load or insert point is not found
     *
     * @description Fetches the header HTML partial and injects it into the DOM
     * at the configured insertion point. Uses fetch API for loading.
     *
     * @private
     */
    async loadHeader() {
      try {
        const response = await fetch(this.config.headerPartialPath);
        if (!response.ok) {
          throw new Error(`Failed to load header: ${response.status}`);
        }

        const html = await response.text();
        const insertPoint = document.querySelector(this.config.headerInsertPoint);

        if (!insertPoint) {
          throw new Error('Header insert point not found');
        }

        insertPoint.insertAdjacentHTML(this.config.headerPosition, html);
        console.log('[LayoutLoader] Header loaded successfully');
      } catch (error) {
        console.error('[LayoutLoader] Error loading header:', error);
        throw error;
      }
    }

    /**
     * Load footer partial from configured path
     *
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If footer fails to load or insert point is not found
     *
     * @description Fetches the footer HTML partial and injects it into the DOM
     * at the configured insertion point. Uses fetch API for loading.
     *
     * @private
     */
    async loadFooter() {
      try {
        const response = await fetch(this.config.footerPartialPath);
        if (!response.ok) {
          throw new Error(`Failed to load footer: ${response.status}`);
        }

        const html = await response.text();
        const insertPoint = document.querySelector(this.config.footerInsertPoint);

        if (!insertPoint) {
          throw new Error('Footer insert point not found');
        }

        insertPoint.insertAdjacentHTML(this.config.footerPosition, html);
        console.log('[LayoutLoader] Footer loaded successfully');
      } catch (error) {
        console.error('[LayoutLoader] Error loading footer:', error);
        throw error;
      }
    }

    /**
     * Apply saved theme from localStorage or system preference
     *
     * @description Applies the theme (dark/light) from localStorage if available,
     * otherwise falls back to system preference (prefers-color-scheme).
     * Sets the data-theme attribute on the HTML element.
     *
     * @private
     */
    applyTheme() {
      let theme = localStorage.getItem('theme');

      // If no saved preference, check system preference
      if (!theme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme = 'dark';
        } else {
          theme = 'light';
        }
      }

      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
      console.log('[LayoutLoader] Theme applied:', theme);
    }

    /**
     * Initialize interactive components after loading
     *
     * @async
     * @returns {Promise<void>}
     *
     * @description Waits for DOM to be ready, then initializes header and footer
     * components including hamburger menu, language selector, auth buttons, and settings.
     *
     * @private
     */
    async initializeComponents() {
      // Wait for DOM to settle
      await this.waitForDOM();

      // Initialize header components
      if (this.headerLoaded) {
        this.initHeader();
      }

      // Initialize footer components
      if (this.footerLoaded) {
        this.initFooter();
      }

      console.log('[LayoutLoader] Components initialized');
    }

    /**
     * Initialize header interactive elements
     *
     * @description Sets up hamburger menu, Google Translate, and authentication
     * buttons for the header component. Called automatically after header is loaded.
     *
     * @private
     */
    initHeader() {
      // Initialize hamburger menu
      this.initHamburgerMenu();

      // Load Google Translate for language switching
      this._loadGoogleTranslate();

      // Initialize sign-in buttons
      this.initAuthButtons();

      // eslint-disable-next-line no-console
      console.log('[LayoutLoader] Header components initialized');
    }

    /**
     * Initialize footer interactive elements
     *
     * @description Sets up footer components including copyright year update.
     * Footer is mostly static but can be extended for additional functionality.
     * Called automatically after footer is loaded.
     *
     * @private
     */
    initFooter() {
      // Footer is mostly static, but we can initialize any interactive elements here
      // For example, dynamic year in copyright notice
      this.updateCopyrightYear();

      console.log('[LayoutLoader] Footer components initialized');
    }

    /**
     * Initialize hamburger menu functionality
     *
     * @description Sets up the mobile hamburger menu with open/close functionality,
     * overlay click handling, keyboard navigation (Escape key), and focus management
     * for accessibility. Manages menu state with ARIA attributes.
     *
     * @private
     */
    initHamburgerMenu() {
      const hamburgerToggle = document.getElementById('hamburger-toggle');
      const hamburgerMenu = document.getElementById('hamburger-menu');
      const menuOverlay = document.getElementById('menu-overlay');
      const menuCloseBtn = document.getElementById('menu-close-btn');

      if (!hamburgerToggle || !hamburgerMenu) {
        console.warn('[LayoutLoader] Hamburger menu elements not found');
        return;
      }

      // Open menu
      const openMenu = () => {
        hamburgerMenu.setAttribute('aria-hidden', 'false');
        menuOverlay?.setAttribute('aria-hidden', 'false');
        hamburgerToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        // Focus management
        menuCloseBtn?.focus();
      };

      // Close menu
      const closeMenu = () => {
        hamburgerMenu.setAttribute('aria-hidden', 'true');
        menuOverlay?.setAttribute('aria-hidden', 'true');
        hamburgerToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        // Return focus to toggle button
        hamburgerToggle.focus();
      };

      // Event listeners
      hamburgerToggle.addEventListener('click', openMenu);
      menuCloseBtn?.addEventListener('click', closeMenu);
      menuOverlay?.addEventListener('click', closeMenu);

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburgerMenu.getAttribute('aria-hidden') === 'false') {
          closeMenu();
        }
      });

      // Initialize menu items
      this.initMenuItems();
    }

    /**
     * Initialize menu item interactions
     *
     * @description Sets up click handlers for menu items including Career Track,
     * Dashboard (with auth check), Begin Assessment, and Preview Voices buttons.
     * Also initializes settings toggles (Dark Mode, TTS).
     *
     * @private
     */
    initMenuItems() {
      // Career Track button
      const careerTrackBtn = document.getElementById('career-track-btn');
      if (careerTrackBtn) {
        careerTrackBtn.addEventListener('click', () => {
          window.location.href = '/career.html';
        });
      }

      // Dashboard button
      const dashboardBtn = document.getElementById('dashboard-btn');
      if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
          // Check authentication
          const isAuth = window.AUTH && window.AUTH.isAuthenticated();
          if (isAuth) {
            window.location.href = '/learner-portal.html';
          } else {
            // Open auth modal if available
            if (window.AuthModal) {
              window.AuthModal.open('signup');
            } else {
              window.location.href = '/signin.html';
            }
          }
        });
      }

      // Begin Assessment button - handled by href in header.html (no JS needed)

      // Preview Voices button
      const previewVoicesBtn = document.getElementById('preview-voices-btn');
      if (previewVoicesBtn) {
        previewVoicesBtn.addEventListener('click', () => {
          console.log('[LayoutLoader] Preview Voices clicked');
          // TODO: Implement preview voices modal
        });
      }

      // Settings toggles (Dark Mode, TTS)
      this.initSettingsToggles();
    }

    /**
     * Initialize settings toggles in menu
     *
     * @description Sets up Dark Mode and Text-to-Speech (TTS) toggles with
     * localStorage persistence. Loads saved preferences on initialization and
     * updates theme/TTS state when toggled. Integrates with window.TTS module
     * if available.
     *
     * @private
     */
    initSettingsToggles() {
      // Dark Mode toggle
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
        // Load saved preference
        const isDark = localStorage.getItem('theme') === 'dark';
        darkModeToggle.checked = isDark;

        darkModeToggle.addEventListener('change', (e) => {
          const theme = e.target.checked ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
          console.log('[LayoutLoader] Theme changed to:', theme);
        });
      }

      // TTS toggle
      const ttsToggle = document.getElementById('tts-toggle');
      if (ttsToggle) {
        // Load saved preference
        const ttsEnabled = localStorage.getItem('tts-enabled') === 'true';
        ttsToggle.checked = ttsEnabled;

        // Apply TTS state on initialization if TTS module is available
        if (ttsEnabled && window.TTS) {
          window.TTS.setEnabled(true);
        }

        ttsToggle.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          localStorage.setItem('tts-enabled', enabled);

          // Trigger TTS module if available
          if (window.TTS) {
            window.TTS.setEnabled(enabled);
          }

          console.log('[LayoutLoader] TTS', enabled ? 'enabled' : 'disabled');
        });
      }
    }

    /**
     * Load Google Translate script for language switching
     *
     * @description Dynamically loads the Google Translate script if not already loaded.
     * Calls the googleTranslateElementInit callback function defined in header.html
     * after the script loads to initialize the widget.
     *
     * @private
     */
    _loadGoogleTranslate() {
      // Check if already loaded
      if (window.google && window.google.translate) {
        // eslint-disable-next-line no-console
        console.log('[LayoutLoader] Google Translate already loaded');
        if (typeof window.googleTranslateElementInit === 'function') {
          window.googleTranslateElementInit();
        }
        return;
      }

      const translateElement = document.getElementById('google_translate_element');
      // Check if widget element exists
      if (!translateElement) {
        // eslint-disable-next-line no-console
        console.warn('[LayoutLoader] Google Translate element not found');
        return;
      }

      // eslint-disable-next-line no-console
      console.log('[LayoutLoader] Loading Google Translate script...');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.onerror = function () {
        console.error('[LayoutLoader] Failed to load Google Translate script');
        // Provide fallback notification to users
        translateElement.innerHTML = '<span style="color: var(--text-secondary); font-size: 0.85rem;" title="Language switching unavailable">🌐</span>';
      };
      document.body.appendChild(script);
    }

    /**
     * Initialize authentication buttons and handlers
     *
     * @description Sets up click handlers for sign-in buttons in header and menu.
     * Opens AuthModal if available, otherwise redirects to signin page.
     * Also calls updateAuthUI to reflect current authentication state.
     *
     * @private
     */
    initAuthButtons() {
      const signInBtn = document.getElementById('sign-in-btn');
      const menuSignInBtn = document.getElementById('menu-sign-in');

      const handleSignIn = (e) => {
        e.preventDefault();

        // Check if AuthModal is available
        if (window.AuthModal) {
          window.AuthModal.open('signin');
        } else {
          window.location.href = '/signin.html';
        }
      };

      signInBtn?.addEventListener('click', handleSignIn);
      menuSignInBtn?.addEventListener('click', handleSignIn);

      // Update UI based on auth state
      this.updateAuthUI();
    }

    /**
     * Update UI based on authentication state
     *
     * @description Checks window.AUTH module for authentication state and updates
     * UI accordingly. For authenticated users, displays welcome message with username
     * and dashboard link. Updates header sign-in button to show "Dashboard" link.
     * Uses safe DOM manipulation to prevent XSS vulnerabilities.
     *
     * @private
     */
    updateAuthUI() {
      const isAuth = window.AUTH && window.AUTH.isAuthenticated();
      const userSection = document.getElementById('user-section');
      const signInBtn = document.getElementById('sign-in-btn');

      if (isAuth && userSection) {
        // User is authenticated - update UI with safe text content
        const user = window.AUTH.getCurrentUser();
        const userName = user.name || 'User';

        // Clear existing content
        userSection.innerHTML = '';

        // Create paragraph with safe text content
        const statusP = document.createElement('p');
        statusP.className = 'user-status';
        statusP.textContent = `Welcome, ${userName}`;

        // Create dashboard link
        const dashboardLink = document.createElement('a');
        dashboardLink.href = '/learner-portal.html';
        dashboardLink.className = 'menu-btn primary';
        dashboardLink.textContent = 'Go to Dashboard';

        // Append elements
        userSection.appendChild(statusP);
        userSection.appendChild(dashboardLink);
      }

      // Update header sign-in button
      if (isAuth && signInBtn) {
        signInBtn.textContent = 'Dashboard';
        signInBtn.href = '/learner-portal.html';
      }
    }

    /**
     * Update copyright year in footer
     *
     * @description Automatically updates the copyright year to the current year.
     * Looks for element with class 'footer-copyright' and sets the text to
     * include the current year.
     *
     * @private
     */
    updateCopyrightYear() {
      const copyrightEl = document.querySelector('.footer-copyright');
      if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.textContent = `© ${currentYear} PMERIT. All rights reserved.`;
      }
    }

    /**
     * Wait for DOM elements to be available
     *
     * @async
     * @returns {Promise<void>}
     *
     * @description Utility method that waits for DOM to be ready before proceeding.
     * If document is still loading, waits for DOMContentLoaded event. Includes
     * a small delay (50ms) to ensure all elements are fully rendered.
     *
     * @private
     */
    waitForDOM() {
      return new Promise((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure all elements are rendered
            setTimeout(resolve, 50);
          });
        } else {
          setTimeout(resolve, 50);
        }
      });
    }
  }

  // Export to global namespace
  window.LayoutLoader = new LayoutLoader();

  // Auto-initialize if data-auto-init attribute is present
  if (document.querySelector('[data-layout-auto-init]')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.LayoutLoader.init();
      });
    } else {
      window.LayoutLoader.init();
    }
  }

})(window);
