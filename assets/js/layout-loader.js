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
 * - Integrates with SettingsManager for settings (Dark Mode, TTS) if available
 * - Falls back to internal settings management if SettingsManager not loaded
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
        footerPosition: 'beforeend'    // append to body
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
        logger.debug('[LayoutLoader] Header loaded successfully');
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
        logger.debug('[LayoutLoader] Footer loaded successfully');
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
      logger.debug('[LayoutLoader] Theme applied:', theme);
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

      logger.debug('[LayoutLoader] Components initialized');
    }

    /**
     * Initialize header interactive elements
     * 
     * @description Sets up hamburger menu, language selector, and authentication
     * buttons for the header component. Called automatically after header is loaded.
     * 
     * @private
     */
    initHeader() {
      // Initialize hamburger menu
      this.initHamburgerMenu();

      // Initialize language selector
      this.initLanguageSelector();

      // Initialize sign-in buttons
      this.initAuthButtons();

      logger.debug('[LayoutLoader] Header components initialized');
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

      // Initialize Google Translate widget after footer is loaded
      this.initGoogleTranslate();

      logger.debug('[LayoutLoader] Footer components initialized');
    }

    /**
     * Initialize Google Translate widget for dynamically loaded footer
     *
     * @description Handles Google Translate initialization when footer is loaded
     * dynamically via layout-loader. Script tags in dynamically inserted HTML
     * are not executed, so we must manually define the callback and load the script.
     * Skips initialization if already set up (e.g., on index.html with embedded footer).
     *
     * @private
     */
    initGoogleTranslate() {
      const mobileEl = document.getElementById('google_translate_element');
      const desktopEl = document.getElementById('google_translate_element_desktop');

      // Skip if no Google Translate elements exist
      if (!mobileEl && !desktopEl) {
        return;
      }

      // Skip if already initialized (for pages with embedded footer like index.html)
      if (window.googleTranslateElementInit) {
        logger.debug('[LayoutLoader] Google Translate already initialized, skipping');
        return;
      }

      // Define the callback function globally
      window.googleTranslateElementInit = function() {
        logger.debug('🌐 Google Translate initializing...');

        // Mobile widget
        if (document.getElementById('google_translate_element')) {
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false
          }, 'google_translate_element');
          logger.debug('✅ Mobile Google Translate widget initialized');
        }

        // Desktop widget
        if (document.getElementById('google_translate_element_desktop')) {
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false
          }, 'google_translate_element_desktop');
          logger.debug('✅ Desktop Google Translate widget initialized');
        }
      };

      // Dynamically load the Google Translate script
      logger.debug('[LayoutLoader] Google Translate script loading...');
      const gtScript = document.createElement('script');
      gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      gtScript.onerror = function() {
        console.error('[LayoutLoader] ❌ Failed to load Google Translate script');
      };
      document.body.appendChild(gtScript);
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
          logger.debug('[LayoutLoader] Preview Voices clicked');
          // TODO: Implement preview voices modal
        });
      }

      // Settings toggles (Dark Mode, TTS)
      this.initSettingsToggles();
    }

    /**
     * Initialize settings toggles in menu
     *
     * @description Integrates with SettingsManager if available for unified
     * settings handling. Falls back to internal implementation if SettingsManager
     * is not loaded.
     *
     * INTEGRATION NOTE: For best results, include settings-manager.js before
     * layout-loader.js runs. SettingsManager handles all toggle IDs from both
     * index.html and partials, ensuring consistent state across pages.
     *
     * @private
     */
    initSettingsToggles() {
      // Prefer SettingsManager if available (centralized settings handling)
      if (window.SettingsManager) {
        // Rebind toggles to catch dynamically loaded elements
        window.SettingsManager.rebind();
        // Apply current settings to sync toggle states
        window.SettingsManager.applyCurrentSettings();
        logger.debug('[LayoutLoader] Settings delegated to SettingsManager');
        return;
      }

      // Fallback: Internal settings handling if SettingsManager not available
      logger.debug('[LayoutLoader] SettingsManager not found, using internal fallback');

      // Dark Mode toggle
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
        const isDark = localStorage.getItem('theme') === 'dark';
        darkModeToggle.checked = isDark;

        darkModeToggle.addEventListener('change', (e) => {
          const theme = e.target.checked ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
          logger.debug('[LayoutLoader] Theme changed to:', theme);
        });
      }

      // TTS toggle
      const ttsToggle = document.getElementById('tts-toggle');
      if (ttsToggle) {
        const ttsEnabled = localStorage.getItem('tts-enabled') === 'true';
        ttsToggle.checked = ttsEnabled;

        if (ttsEnabled && window.TTS) {
          window.TTS.setEnabled(true);
        }

        ttsToggle.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          localStorage.setItem('tts-enabled', enabled);

          if (window.TTS) {
            window.TTS.setEnabled(enabled);
          }

          logger.debug('[LayoutLoader] TTS', enabled ? 'enabled' : 'disabled');
        });
      }
    }

    /**
     * Initialize language selector dropdown
     * 
     * @description Sets up language selection dropdown with open/close functionality.
     * Loads saved language preference from localStorage and marks active option.
     * Language options are identified by data-lang attribute.
     * 
     * @private
     */
    initLanguageSelector() {
      const languageBtn = document.getElementById('language-btn');
      const languageDropdown = document.getElementById('language-dropdown');
      const closeLanguageBtn = document.getElementById('close-language-dropdown');
      const languageOptions = document.querySelectorAll('.language-option');

      if (!languageBtn || !languageDropdown) {
        console.warn('[LayoutLoader] Language selector elements not found');
        return;
      }

      // Open dropdown
      const openDropdown = (e) => {
        e?.stopPropagation();
        languageDropdown.classList.add('active');
        languageDropdown.setAttribute('aria-hidden', 'false');
      };

      // Close dropdown
      const closeDropdown = () => {
        languageDropdown.classList.remove('active');
        languageDropdown.setAttribute('aria-hidden', 'true');
      };

      // Event listeners
      languageBtn.addEventListener('click', openDropdown);
      closeLanguageBtn?.addEventListener('click', closeDropdown);

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!languageDropdown.contains(e.target) && e.target !== languageBtn) {
          closeDropdown();
        }
      });

      // Close dropdown on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && languageDropdown.classList.contains('active')) {
          closeDropdown();
          languageBtn.focus();
        }
      });

      // Language selection
      languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const lang = e.currentTarget.getAttribute('data-lang');
          
          // Remove active class from all options
          languageOptions.forEach(opt => opt.classList.remove('active'));
          
          // Add active class to selected
          e.currentTarget.classList.add('active');
          
          // Save preference
          localStorage.setItem('pmerit-language', lang);
          
          logger.debug('[LayoutLoader] Language changed to:', lang);
          
          // TODO: Implement actual language change
          // This would typically reload content in the selected language
          
          closeDropdown();
        });
      });

      // Load saved language preference
      const savedLang = localStorage.getItem('pmerit-language') || 'en';
      const activeOption = document.querySelector(`[data-lang="${savedLang}"]`);
      if (activeOption) {
        languageOptions.forEach(opt => opt.classList.remove('active'));
        activeOption.classList.add('active');
      }
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
