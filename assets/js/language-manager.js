/**
 * PMERIT Language Manager - ENHANCED VERSION
 * Handles multi-language support with offline and online translations
 * Follows MOSA modular architecture
 *
 * VERSION: 3.0.0 (API Integration)
 *
 * NEW FEATURES:
 * - Extended attribute support (aria-label, value, etc.)
 * - Global t() function for dynamic content
 * - Scoped translation application for dynamic elements
 * - data-i18n-auto for automatic key generation
 * - Missing translation warnings in dev mode
 * - API integration for online languages (v3.0)
 * - localStorage caching for API translations (v3.0)
 *
 * OFFLINE LANGUAGES: en, yo, ig, ha (bundled with app)
 * ONLINE LANGUAGES: All others (fetched from Translation API)
 *
 * USAGE EXAMPLES:
 *
 * 1. Static HTML:
 *    <button data-i18n="common.save">Save</button>
 *
 * 2. Placeholders:
 *    <input data-i18n-placeholder="form.email">
 *
 * 3. Accessibility:
 *    <button data-i18n-aria-label="buttons.close_aria">
 *
 * 4. Auto-translation (prototyping):
 *    <p data-i18n-auto>Welcome to PMERIT!</p>
 *
 * 5. Dynamic JS content:
 *    const message = LanguageManager.t('messages.success');
 *    element.textContent = message;
 *
 * 6. Dynamic HTML insertion:
 *    container.innerHTML = partialHTML;
 *    LanguageManager.applyTranslations(container);
 */

(function() {
  'use strict';

  // ============================================
  // CONSTANTS
  // ============================================

  // Languages with bundled translation files (no API needed)
  const OFFLINE_LANGUAGES = ['en', 'yo', 'ig', 'ha'];

  // localStorage key prefix for cached translations
  const CACHE_PREFIX = 'pmerit_i18n_';

  // Cache expiry time (7 days in milliseconds)
  const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

  // Translation API endpoint
  const API_ENDPOINT = '/api/v1/locales';

  // ============================================
  // LANGUAGE MANAGER MODULE
  // ============================================
  
  const LanguageManager = {
    // Supported languages
    languages: {
      'en': 'English',
      'yo': 'Yorùbá',
      'ig': 'Igbo',
      'ha': 'Hausa'
    },
    
    // Default language
    defaultLang: 'en',
    
    // Current active language
    currentLang: null,
    
    // Translation data cache
    translations: {},
    
    // Dev mode (shows warnings for missing translations)
    devMode: true,
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    init: function() {
      logger.debug('[LanguageManager] Initializing Enhanced v2.0.0...');
      
      // Load saved language or use default
      this.currentLang = localStorage.getItem('pmerit_language') || this.defaultLang;
      
      // Set initial language
      this.setLanguage(this.currentLang, false); // false = don't reload
      
      // Bind language selector dropdowns
      this.bindSelectors();
      
      logger.debug('[LanguageManager] ✅ Initialized with language:', this.currentLang);
    },
    
    // ============================================
    // LANGUAGE SWITCHING (v3.0 - Supports all languages)
    // ============================================

    setLanguage: function(langCode, reload = false) {
      // Validate language code using PMERIT_LANGUAGES if available
      if (!this.isValidLanguage(langCode)) {
        console.warn('[LanguageManager] Invalid language code:', langCode);
        return;
      }

      logger.debug('[LanguageManager] Switching to:', langCode);

      // Save to localStorage
      localStorage.setItem('pmerit_language', langCode);
      this.currentLang = langCode;

      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', langCode);

      // Update all dropdowns to show current selection
      this.updateSelectors(langCode);

      // Load translations for this language
      this.loadTranslations(langCode).then(() => {
        // Process auto-translations first
        this.processAutoTranslations();

        // Apply translations to current page
        this.applyTranslations();

        // Dispatch language change event for other modules
        window.dispatchEvent(new CustomEvent('pmerit-language-change', {
          detail: { language: langCode, translations: this.translations }
        }));

        // Reload page if requested (for full translation)
        if (reload) {
          logger.debug('[LanguageManager] Reloading page for full translation...');
          window.location.reload();
        }
      });
    },

    /**
     * Check if a language code is valid
     */
    isValidLanguage: function(langCode) {
      // Check PMERIT_LANGUAGES global array if available
      if (window.PMERIT_LANGUAGES && Array.isArray(window.PMERIT_LANGUAGES)) {
        return window.PMERIT_LANGUAGES.some(lang => lang.code === langCode);
      }
      // Fallback to hardcoded list
      return OFFLINE_LANGUAGES.includes(langCode);
    },
    
    // ============================================
    // TRANSLATION LOADING (v3.0 - API Integration)
    // ============================================

    /**
     * Load translations for a language
     * - Offline languages (en, yo, ig, ha): Load from bundled JSON files
     * - Online languages: Check cache first, then fetch from API
     */
    loadTranslations: function(langCode) {
      // If already loaded in memory, return immediately
      if (this.translations[langCode]) {
        return Promise.resolve(this.translations[langCode]);
      }

      // Dispatch loading start event
      this.dispatchLoadingEvent(langCode, 'start');

      // Check if this is an offline language
      if (OFFLINE_LANGUAGES.includes(langCode)) {
        return this.loadOfflineTranslations(langCode);
      }

      // Online language - check cache first, then API
      return this.loadOnlineTranslations(langCode);
    },

    /**
     * Load translations from bundled JSON file (offline languages)
     */
    loadOfflineTranslations: function(langCode) {
      const translationPath = `/assets/i18n/${langCode}.json`;

      return fetch(translationPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load translations for ${langCode}`);
          }
          return response.json();
        })
        .then(data => {
          this.translations[langCode] = data;
          this.dispatchLoadingEvent(langCode, 'complete');
          logger.debug(`[LanguageManager] ✅ Loaded offline translations for ${langCode}`);
          return data;
        })
        .catch(error => {
          console.error('[LanguageManager] Error loading offline translations:', error);
          this.dispatchLoadingEvent(langCode, 'error', error.message);
          // Fallback to English if translation file not found
          if (langCode !== 'en') {
            logger.debug('[LanguageManager] Falling back to English');
            return this.loadTranslations('en');
          }
          return {};
        });
    },

    /**
     * Load translations from API with localStorage caching (online languages)
     */
    loadOnlineTranslations: function(langCode) {
      // Check localStorage cache first
      const cached = this.getCachedTranslations(langCode);
      if (cached) {
        this.translations[langCode] = cached;
        this.dispatchLoadingEvent(langCode, 'complete');
        logger.debug(`[LanguageManager] ✅ Loaded ${langCode} from cache`);
        return Promise.resolve(cached);
      }

      // Fetch from API
      logger.debug(`[LanguageManager] Fetching ${langCode} from API...`);

      return fetch(`${API_ENDPOINT}/${langCode}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`API returned ${response.status} for ${langCode}`);
          }
          return response.json();
        })
        .then(data => {
          // Cache in localStorage
          this.setCachedTranslations(langCode, data);
          // Store in memory
          this.translations[langCode] = data;
          this.dispatchLoadingEvent(langCode, 'complete');
          logger.debug(`[LanguageManager] ✅ Loaded ${langCode} from API and cached`);
          return data;
        })
        .catch(error => {
          console.error(`[LanguageManager] Error fetching ${langCode} from API:`, error);
          this.dispatchLoadingEvent(langCode, 'error', error.message);
          // Fallback to English
          logger.debug('[LanguageManager] Falling back to English');
          return this.loadTranslations('en');
        });
    },

    /**
     * Get cached translations from localStorage
     */
    getCachedTranslations: function(langCode) {
      try {
        const cacheKey = CACHE_PREFIX + langCode;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Check if cache has expired
        if (Date.now() - timestamp > CACHE_EXPIRY) {
          localStorage.removeItem(cacheKey);
          logger.debug(`[LanguageManager] Cache expired for ${langCode}`);
          return null;
        }

        return data;
      } catch (error) {
        console.warn('[LanguageManager] Error reading cache:', error);
        return null;
      }
    },

    /**
     * Cache translations in localStorage
     */
    setCachedTranslations: function(langCode, data) {
      try {
        const cacheKey = CACHE_PREFIX + langCode;
        const cacheData = {
          data: data,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        logger.debug(`[LanguageManager] Cached translations for ${langCode}`);
      } catch (error) {
        console.warn('[LanguageManager] Error caching translations:', error);
        // localStorage might be full - try to clear old caches
        this.clearOldCaches();
      }
    },

    /**
     * Clear old translation caches to free up space
     */
    clearOldCaches: function() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        logger.debug('[LanguageManager] Cleared old translation caches');
      } catch (error) {
        console.warn('[LanguageManager] Error clearing caches:', error);
      }
    },

    /**
     * Dispatch loading event for UI feedback
     */
    dispatchLoadingEvent: function(langCode, status, error = null) {
      window.dispatchEvent(new CustomEvent('pmerit-language-loading', {
        detail: { language: langCode, status: status, error: error }
      }));
    },

    /**
     * Check if a language is available offline
     */
    isOfflineLanguage: function(langCode) {
      return OFFLINE_LANGUAGES.includes(langCode);
    },
    
    // ============================================
    // AUTO-TRANSLATION PROCESSING (Priority 3)
    // ============================================
    
    processAutoTranslations: function(root = document) {
      const autoNodes = root.querySelectorAll('[data-i18n-auto]');
      
      autoNodes.forEach(element => {
        // Get or store original text
        let original = element.getAttribute('data-i18n-original');
        
        if (!original) {
          original = element.textContent.trim();
          element.setAttribute('data-i18n-original', original);
        }
        
        // Generate key from original text
        const key = 'auto.' + this.slugify(original);
        
        // Attach data-i18n attribute so normal pipeline handles it
        element.setAttribute('data-i18n', key);
        
        // Ensure key exists in translations (fallback to original)
        const currentTranslations = this.translations[this.currentLang] || {};
        if (!this.getNestedTranslation(currentTranslations, key)) {
          // Store original as fallback
          if (!currentTranslations.auto) {
            currentTranslations.auto = {};
          }
          currentTranslations.auto[this.slugify(original)] = original;
        }
      });
      
      logger.debug('[LanguageManager] ✅ Processed auto-translation nodes');
    },
    
    // Convert text to slug (for auto-key generation)
    slugify: function(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50); // Max 50 chars
    },
    
    // ============================================
    // APPLY TRANSLATIONS TO DOM (Enhanced)
    // ============================================
    
    applyTranslations: function(root = document) {
      const currentTranslations = this.translations[this.currentLang] || {};
      
      // 1. TEXT CONTENT (data-i18n)
      root.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.textContent = translation;
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      // 2. PLACEHOLDERS (data-i18n-placeholder)
      root.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.placeholder = translation;
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      // 3. TOOLTIPS/TITLES (data-i18n-title)
      root.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.title = translation;
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      // 4. ARIA LABELS (data-i18n-aria-label) - NEW!
      root.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.setAttribute('aria-label', translation);
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      // 5. VALUES (data-i18n-value) - NEW!
      root.querySelectorAll('[data-i18n-value]').forEach(element => {
        const key = element.getAttribute('data-i18n-value');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.value = translation;
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      // 6. ALT TEXT (data-i18n-alt) - NEW!
      root.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.alt = translation;
        } else if (this.devMode) {
          console.warn(`[LanguageManager] Missing translation: ${key}`);
        }
      });
      
      logger.debug('[LanguageManager] ✅ Translations applied to', root === document ? 'full document' : 'scoped element');
    },
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Get nested translation by dot notation (e.g., "common.welcome")
    getNestedTranslation: function(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    // Get translation for a specific key (Priority 2: Exposed globally)
    translate: function(key, fallback = null) {
      const currentTranslations = this.translations[this.currentLang] || {};
      const translation = this.getNestedTranslation(currentTranslations, key);
      
      if (!translation && this.devMode) {
        console.warn(`[LanguageManager] Missing translation: ${key}`);
      }
      
      return translation || fallback || key;
    },
    
    // Shorthand for translate (Priority 2: Global t() function)
    t: function(key, fallback = null) {
      return this.translate(key, fallback);
    },
    
    // ============================================
    // BIND LANGUAGE SELECTORS
    // ============================================
    
    bindSelectors: function() {
      // Desktop language selector (dropdown)
      const desktopSelector = document.querySelector('.desktop-layout .lang-selector');
      if (desktopSelector) {
        desktopSelector.value = this.currentLang;
        desktopSelector.addEventListener('change', (e) => {
          this.setLanguage(e.target.value, true);
        });
        logger.debug('[LanguageManager] ✅ Desktop selector bound');
      }
      
      // Mobile language selector (button - will need modal/menu)
      const mobileSelector = document.querySelector('.mobile-layout .lang-selector');
      if (mobileSelector) {
        // Update button text to show current language
        mobileSelector.textContent = this.getLanguageShortCode(this.currentLang);
        
        // For now, cycle through languages on click
        // TODO: Replace with proper modal/dropdown in mobile
        mobileSelector.addEventListener('click', (e) => {
          e.preventDefault();
          const langCodes = Object.keys(this.languages);
          const currentIndex = langCodes.indexOf(this.currentLang);
          const nextIndex = (currentIndex + 1) % langCodes.length;
          const nextLang = langCodes[nextIndex];
          
          this.setLanguage(nextLang, true);
        });
        logger.debug('[LanguageManager] ✅ Mobile selector bound');
      }
    },
    
    updateSelectors: function(langCode) {
      // Update desktop dropdown
      const desktopSelector = document.querySelector('.desktop-layout .lang-selector');
      if (desktopSelector) {
        desktopSelector.value = langCode;
      }
      
      // Update mobile button text
      const mobileSelector = document.querySelector('.mobile-layout .lang-selector');
      if (mobileSelector) {
        mobileSelector.textContent = this.getLanguageShortCode(langCode);
      }
    },
    
    getLanguageShortCode: function(langCode) {
      const codes = {
        'en': 'En',
        'yo': 'Yo',
        'ig': 'Ig',
        'ha': 'Ha'
      };
      return codes[langCode] || 'En';
    },
    
    // ============================================
    // PUBLIC API (v3.0 - Enhanced)
    // ============================================

    getCurrentLanguage: function() {
      return this.currentLang;
    },

    /**
     * Get all available languages
     * Returns PMERIT_LANGUAGES if available, otherwise hardcoded list
     */
    getAvailableLanguages: function() {
      if (window.PMERIT_LANGUAGES && Array.isArray(window.PMERIT_LANGUAGES)) {
        return window.PMERIT_LANGUAGES;
      }
      // Fallback to hardcoded list
      return Object.keys(this.languages).map(code => ({
        code: code,
        name: this.languages[code],
        offline: true
      }));
    },

    /**
     * Get offline languages only
     */
    getOfflineLanguages: function() {
      return OFFLINE_LANGUAGES;
    },

    /**
     * Clear all cached translations (useful for debugging)
     */
    clearCache: function() {
      this.clearOldCaches();
      this.translations = {};
      logger.debug('[LanguageManager] All caches cleared');
    },

    // Enable/disable dev mode
    setDevMode: function(enabled) {
      this.devMode = enabled;
    }
  };

  // ============================================
  // EXPOSE TO WINDOW (v3.0)
  // ============================================

  window.LanguageManager = LanguageManager;

  // GLOBAL SHORTHAND FOR t() FUNCTION
  window.t = LanguageManager.t.bind(LanguageManager);

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LanguageManager.init();
    });
  } else {
    LanguageManager.init();
  }

  logger.debug('[LanguageManager] v3.0.0 loaded (API Integration)');
  logger.debug('[LanguageManager] Offline languages:', OFFLINE_LANGUAGES.join(', '));
  logger.debug('[LanguageManager] Global t() function available');

})();
