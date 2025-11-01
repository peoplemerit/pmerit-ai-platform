/**
 * PMERIT Layout Loader
 * Version: 1.0
 * Last Updated: November 2025
 * 
 * Purpose: Dynamically loads and initializes common header and footer components
 * Usage: Include this script and call LayoutLoader.init() after DOM is ready
 * 
 * Features:
 * - Loads header.html and footer.html partials
 * - Initializes interactive elements (hamburger menu, language selector)
 * - Handles authentication state
 * - Supports custom insertion points
 * - No global namespace pollution
 */

(function (window) {
  'use strict';

  /**
   * LayoutLoader - Main class for loading header/footer components
   */
  class LayoutLoader {
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
     * @param {Object} customConfig - Optional configuration overrides
     * @returns {Promise<Object>} - Resolves with {header: boolean, footer: boolean}
     */
    async init(customConfig = {}) {
      // Merge custom config
      this.config = { ...this.config, ...customConfig };

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
     * Load header partial
     * @returns {Promise<void>}
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
     * Load footer partial
     * @returns {Promise<void>}
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
     * Initialize interactive components after loading
     * @returns {Promise<void>}
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
     */
    initHeader() {
      // Initialize hamburger menu
      this.initHamburgerMenu();

      // Initialize language selector
      this.initLanguageSelector();

      // Initialize sign-in buttons
      this.initAuthButtons();

      console.log('[LayoutLoader] Header components initialized');
    }

    /**
     * Initialize footer interactive elements
     */
    initFooter() {
      // Footer is mostly static, but we can initialize any interactive elements here
      // For example, dynamic year in copyright notice
      this.updateCopyrightYear();

      console.log('[LayoutLoader] Footer components initialized');
    }

    /**
     * Initialize hamburger menu functionality
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

      // Begin Assessment button
      const beginAssessmentBtn = document.getElementById('begin-assessment-btn');
      if (beginAssessmentBtn) {
        beginAssessmentBtn.addEventListener('click', () => {
          window.location.href = '/assessment.html';
        });
      }

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
     * Initialize language selector
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
      const openDropdown = () => {
        languageDropdown.setAttribute('aria-hidden', 'false');
      };

      // Close dropdown
      const closeDropdown = () => {
        languageDropdown.setAttribute('aria-hidden', 'true');
      };

      // Event listeners
      languageBtn.addEventListener('click', openDropdown);
      closeLanguageBtn?.addEventListener('click', closeDropdown);

      // Language selection
      languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const lang = e.currentTarget.getAttribute('data-lang');
          
          // Remove active class from all options
          languageOptions.forEach(opt => opt.classList.remove('active'));
          
          // Add active class to selected
          e.currentTarget.classList.add('active');
          
          // Save preference
          localStorage.setItem('language', lang);
          
          console.log('[LayoutLoader] Language changed to:', lang);
          
          // TODO: Implement actual language change
          // This would typically reload content in the selected language
          
          closeDropdown();
        });
      });

      // Load saved language preference
      const savedLang = localStorage.getItem('language') || 'en';
      const activeOption = document.querySelector(`[data-lang="${savedLang}"]`);
      if (activeOption) {
        languageOptions.forEach(opt => opt.classList.remove('active'));
        activeOption.classList.add('active');
      }
    }

    /**
     * Initialize authentication buttons
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
     */
    updateAuthUI() {
      const isAuth = window.AUTH && window.AUTH.isAuthenticated();
      const userSection = document.getElementById('user-section');
      const signInBtn = document.getElementById('sign-in-btn');

      if (isAuth && userSection) {
        // User is authenticated - update UI
        const user = window.AUTH.getCurrentUser();
        userSection.innerHTML = `
          <p class="user-status">Welcome, ${user.name || 'User'}</p>
          <a href="/learner-portal.html" class="menu-btn primary">Go to Dashboard</a>
        `;
      }

      // Update header sign-in button
      if (isAuth && signInBtn) {
        signInBtn.textContent = 'Dashboard';
        signInBtn.href = '/learner-portal.html';
      }
    }

    /**
     * Update copyright year in footer
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
     * @returns {Promise<void>}
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
