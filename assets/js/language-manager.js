/**
 * PMERIT Language Manager - ENHANCED VERSION
 * Handles multi-language support: English, Yoruba, Igbo, Hausa
 * Follows MOSA modular architecture
 * 
 * VERSION: 2.0.0 (Enhanced)
 * 
 * NEW FEATURES:
 * - Extended attribute support (aria-label, value, etc.)
 * - Global t() function for dynamic content
 * - Scoped translation application for dynamic elements
 * - data-i18n-auto for automatic key generation
 * - Missing translation warnings in dev mode
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
    // LANGUAGE SWITCHING
    // ============================================
    
    setLanguage: function(langCode, reload = true) {
      if (!this.languages[langCode]) {
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
    
    // ============================================
    // TRANSLATION LOADING
    // ============================================
    
    loadTranslations: function(langCode) {
      // If already loaded, return immediately
      if (this.translations[langCode]) {
        return Promise.resolve(this.translations[langCode]);
      }
      
      // Load translation file
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
          logger.debug(`[LanguageManager] ✅ Loaded translations for ${langCode}`);
          return data;
        })
        .catch(error => {
          console.error('[LanguageManager] Error loading translations:', error);
          // Fallback to English if translation file not found
          if (langCode !== 'en') {
            logger.debug('[LanguageManager] Falling back to English');
            return this.loadTranslations('en');
          }
          return {};
        });
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
    // PUBLIC API (Enhanced)
    // ============================================
    
    getCurrentLanguage: function() {
      return this.currentLang;
    },
    
    getAvailableLanguages: function() {
      return this.languages;
    },
    
    // Enable/disable dev mode
    setDevMode: function(enabled) {
      this.devMode = enabled;
    }
  };
  
  // ============================================
  // EXPOSE TO WINDOW (Enhanced)
  // ============================================
  
  window.LanguageManager = LanguageManager;
  
  // GLOBAL SHORTHAND FOR t() FUNCTION (Priority 2)
  window.t = LanguageManager.t.bind(LanguageManager);
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LanguageManager.init();
    });
  } else {
    LanguageManager.init();
  }
  
  logger.debug('[LanguageManager] Enhanced Module v2.0.0 loaded');
  logger.debug('[LanguageManager] Global t() function available');
  
})();
