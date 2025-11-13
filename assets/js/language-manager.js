/**
 * Language Manager for PMERIT Platform
 * Handles language selection, persistence, and UI translation
 * Version: 1.0
 * Last Updated: 2025-11-12
 * 
 * Usage:
 *   const langManager = new LanguageManager();
 *   langManager.setLanguage('es'); // Switch to Spanish
 */

class LanguageManager {
  constructor() {
    this.storageKey = 'pmerit-language';
    this.defaultLang = 'en';
    this.currentLang = null;
    
    // Supported languages with display names and flag emojis
    this.languages = {
      'en': { name: 'English', flag: '🇺🇸', code: 'EN' },
      'yo': { name: 'Yorùbá', flag: '🌍', code: 'YO' },
      'ig': { name: 'Igbo', flag: '🌍', code: 'IG' },
      'ha': { name: 'Hausa', flag: '🌍', code: 'HA' },
      'fr': { name: 'Français', flag: '🇫🇷', code: 'FR' },
      'es': { name: 'Español', flag: '🇪🇸', code: 'ES' }
    };
    
    // Load translations (for Phase 1, only UI elements)
    this.translations = {};
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize language manager
   */
  async init() {
    // Load stored language preference
    this.currentLang = this.getStoredLanguage();
    
    // Load translations for current language
    await this.loadTranslations(this.currentLang);
    
    // Apply language to page
    this.applyLanguage(this.currentLang);
    
    console.log(`[LanguageManager] Initialized with language: ${this.currentLang}`);
  }
  
  /**
   * Get stored language from localStorage
   * @returns {string} Language code (e.g., 'en', 'es')
   */
  getStoredLanguage() {
    const stored = localStorage.getItem(this.storageKey);
    return stored && this.languages[stored] ? stored : this.defaultLang;
  }
  
  /**
   * Set and persist language
   * @param {string} langCode - Language code (e.g., 'en', 'es')
   */
  async setLanguage(langCode) {
    if (!this.languages[langCode]) {
      console.error(`[LanguageManager] Invalid language code: ${langCode}`);
      return;
    }
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, langCode);
    this.currentLang = langCode;
    
    // Load translations
    await this.loadTranslations(langCode);
    
    // Apply to page
    this.applyLanguage(langCode);
    
    console.log(`[LanguageManager] Language changed to: ${langCode}`);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: langCode }
    }));
  }
  
  /**
   * Load translations for a language
   * @param {string} langCode - Language code
   */
  async loadTranslations(langCode) {
    // English (default - no translation needed)
    if (langCode === 'en') {
      this.translations = {};
      return;
    }
    
    // Try to load translations file
    try {
      const response = await fetch(`/assets/i18n/${langCode}.json`);
      if (response.ok) {
        this.translations = await response.json();
      } else {
        console.warn(`[LanguageManager] Translations not found for ${langCode}`);
        this.translations = {};
      }
    } catch (error) {
      console.warn(`[LanguageManager] Failed to load translations:`, error);
      this.translations = {};
    }
  }
  
  /**
   * Apply language to all translatable elements on page
   * @param {string} langCode - Language code
   */
  applyLanguage(langCode) {
    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', langCode);
    
    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Update text content or attribute
        if (element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        } else if (element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', translation);
        } else {
          element.textContent = translation;
        }
      }
    });
  }
  
  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'nav.learning')
   * @returns {string} Translated text or null if not found
   */
  getTranslation(key) {
    // Navigate nested object using dot notation
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null; // Translation not found
      }
    }
    
    return typeof value === 'string' ? value : null;
  }
  
  /**
   * Get current language code
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  /**
   * Get language display info
   * @param {string} langCode - Language code
   * @returns {object} Language info with name, flag, code
   */
  getLanguageInfo(langCode) {
    return this.languages[langCode] || this.languages[this.defaultLang];
  }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pmeritLanguageManager = new LanguageManager();
  });
} else {
  window.pmeritLanguageManager = new LanguageManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}
