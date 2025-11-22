/**
 * PMERIT Language Manager
 * Handles multi-language support: English, Yoruba, Igbo, Hausa
 * Follows MOSA modular architecture
 * Version: 1.0.0
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
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    init: function() {
      console.log('[LanguageManager] Initializing...');
      
      // Load saved language or use default
      this.currentLang = localStorage.getItem('pmerit_language') || this.defaultLang;
      
      // Set initial language
      this.setLanguage(this.currentLang, false); // false = don't reload
      
      // Bind language selector dropdowns
      this.bindSelectors();
      
      console.log('[LanguageManager] ✅ Initialized with language:', this.currentLang);
    },
    
    // ============================================
    // LANGUAGE SWITCHING
    // ============================================
    
    setLanguage: function(langCode, reload = true) {
      if (!this.languages[langCode]) {
        console.warn('[LanguageManager] Invalid language code:', langCode);
        return;
      }
      
      console.log('[LanguageManager] Switching to:', langCode);
      
      // Save to localStorage
      localStorage.setItem('pmerit_language', langCode);
      this.currentLang = langCode;
      
      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', langCode);
      
      // Update all dropdowns to show current selection
      this.updateSelectors(langCode);
      
      // Load translations for this language
      this.loadTranslations(langCode).then(() => {
        // Apply translations to current page
        this.applyTranslations();
        
        // Dispatch language change event for other modules
        window.dispatchEvent(new CustomEvent('pmerit-language-change', {
          detail: { language: langCode, translations: this.translations }
        }));
        
        // Reload page if requested (for full translation)
        if (reload) {
          console.log('[LanguageManager] Reloading page for full translation...');
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
          console.log(`[LanguageManager] ✅ Loaded translations for ${langCode}`);
          return data;
        })
        .catch(error => {
          console.error('[LanguageManager] Error loading translations:', error);
          // Fallback to English if translation file not found
          if (langCode !== 'en') {
            console.log('[LanguageManager] Falling back to English');
            return this.loadTranslations('en');
          }
          return {};
        });
    },
    
    // ============================================
    // APPLY TRANSLATIONS TO DOM
    // ============================================
    
    applyTranslations: function() {
      const currentTranslations = this.translations[this.currentLang] || {};
      
      // Find all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          // Handle different element types
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
      
      // Find all elements with data-i18n-placeholder
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.placeholder = translation;
        }
      });
      
      // Find all elements with data-i18n-title
      document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = this.getNestedTranslation(currentTranslations, key);
        
        if (translation) {
          element.title = translation;
        }
      });
      
      console.log('[LanguageManager] ✅ Translations applied');
    },
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Get nested translation by dot notation (e.g., "common.welcome")
    getNestedTranslation: function(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    // Get translation for a specific key
    translate: function(key) {
      const currentTranslations = this.translations[this.currentLang] || {};
      return this.getNestedTranslation(currentTranslations, key) || key;
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
        console.log('[LanguageManager] ✅ Desktop selector bound');
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
        console.log('[LanguageManager] ✅ Mobile selector bound');
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
    // PUBLIC API
    // ============================================
    
    getCurrentLanguage: function() {
      return this.currentLang;
    },
    
    getAvailableLanguages: function() {
      return this.languages;
    }
  };
  
  // ============================================
  // EXPOSE TO WINDOW
  // ============================================
  
  window.LanguageManager = LanguageManager;
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LanguageManager.init();
    });
  } else {
    LanguageManager.init();
  }
  
  console.log('[LanguageManager] Module loaded');
  
})();
