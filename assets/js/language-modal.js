/**
 * PMERIT Language Modal
 * Branded, accessible language selector with search
 * Integrates with Google Translate for page translation
 *
 * @version 1.0.0
 * @date Nov 28, 2025
 */

(function() {
  'use strict';

  // ============================================
  // LANGUAGE DATA
  // Organized by popularity and region
  // ============================================

  const LANGUAGES = {
    // Popular languages (shown first)
    popular: [
      { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
      { code: 'yo', name: 'Yoruba', flag: '🇳🇬', native: 'Yorùbá' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬', native: 'Igbo' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬', native: 'Hausa' },
      { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
      { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' }
    ],

    // African languages
    african: [
      { code: 'yo', name: 'Yoruba', flag: '🇳🇬', native: 'Yorùbá' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬', native: 'Igbo' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬', native: 'Hausa' },
      { code: 'zu', name: 'Zulu', flag: '🇿🇦', native: 'isiZulu' },
      { code: 'xh', name: 'Xhosa', flag: '🇿🇦', native: 'isiXhosa' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦', native: 'Afrikaans' },
      { code: 'sw', name: 'Swahili', flag: '🇰🇪', native: 'Kiswahili' },
      { code: 'am', name: 'Amharic', flag: '🇪🇹', native: 'አማርኛ' },
      { code: 'so', name: 'Somali', flag: '🇸🇴', native: 'Soomaali' },
      { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', native: 'Ikinyarwanda' },
      { code: 'ny', name: 'Chichewa', flag: '🇲🇼', native: 'Chichewa' },
      { code: 'sn', name: 'Shona', flag: '🇿🇼', native: 'chiShona' }
    ],

    // All languages supported by Google Translate
    all: [
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦', native: 'Afrikaans' },
      { code: 'sq', name: 'Albanian', flag: '🇦🇱', native: 'Shqip' },
      { code: 'am', name: 'Amharic', flag: '🇪🇹', native: 'አማርኛ' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
      { code: 'hy', name: 'Armenian', flag: '🇦🇲', native: 'Հայերdelays' },
      { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', native: 'Azərbaycan' },
      { code: 'eu', name: 'Basque', flag: '🇪🇸', native: 'Euskara' },
      { code: 'be', name: 'Belarusian', flag: '🇧🇾', native: 'Беларуская' },
      { code: 'bn', name: 'Bengali', flag: '🇧🇩', native: 'বাংলা' },
      { code: 'bs', name: 'Bosnian', flag: '🇧🇦', native: 'Bosanski' },
      { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', native: 'Български' },
      { code: 'ca', name: 'Catalan', flag: '🇪🇸', native: 'Català' },
      { code: 'ceb', name: 'Cebuano', flag: '🇵🇭', native: 'Cebuano' },
      { code: 'ny', name: 'Chichewa', flag: '🇲🇼', native: 'Chichewa' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳', native: '简体中文' },
      { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', native: '繁體中文' },
      { code: 'hr', name: 'Croatian', flag: '🇭🇷', native: 'Hrvatski' },
      { code: 'cs', name: 'Czech', flag: '🇨🇿', native: 'Čeština' },
      { code: 'da', name: 'Danish', flag: '🇩🇰', native: 'Dansk' },
      { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
      { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
      { code: 'eo', name: 'Esperanto', flag: '🌍', native: 'Esperanto' },
      { code: 'et', name: 'Estonian', flag: '🇪🇪', native: 'Eesti' },
      { code: 'tl', name: 'Filipino', flag: '🇵🇭', native: 'Filipino' },
      { code: 'fi', name: 'Finnish', flag: '🇫🇮', native: 'Suomi' },
      { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
      { code: 'gl', name: 'Galician', flag: '🇪🇸', native: 'Galego' },
      { code: 'ka', name: 'Georgian', flag: '🇬🇪', native: 'ქართული' },
      { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
      { code: 'el', name: 'Greek', flag: '🇬🇷', native: 'Ελληνικά' },
      { code: 'gu', name: 'Gujarati', flag: '🇮🇳', native: 'ગુજરાતી' },
      { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹', native: 'Kreyòl Ayisyen' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬', native: 'Hausa' },
      { code: 'haw', name: 'Hawaiian', flag: '🇺🇸', native: 'ʻŌlelo Hawaiʻi' },
      { code: 'he', name: 'Hebrew', flag: '🇮🇱', native: 'עברית' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
      { code: 'hu', name: 'Hungarian', flag: '🇭🇺', native: 'Magyar' },
      { code: 'is', name: 'Icelandic', flag: '🇮🇸', native: 'Íslenska' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬', native: 'Igbo' },
      { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
      { code: 'ga', name: 'Irish', flag: '🇮🇪', native: 'Gaeilge' },
      { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
      { code: 'jv', name: 'Javanese', flag: '🇮🇩', native: 'Basa Jawa' },
      { code: 'kn', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
      { code: 'kk', name: 'Kazakh', flag: '🇰🇿', native: 'Қазақ' },
      { code: 'km', name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ' },
      { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', native: 'Ikinyarwanda' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어' },
      { code: 'ku', name: 'Kurdish', flag: '🇮🇶', native: 'Kurdî' },
      { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', native: 'Кыргызча' },
      { code: 'lo', name: 'Lao', flag: '🇱🇦', native: 'ລາວ' },
      { code: 'la', name: 'Latin', flag: '🇻🇦', native: 'Latina' },
      { code: 'lv', name: 'Latvian', flag: '🇱🇻', native: 'Latviešu' },
      { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', native: 'Lietuvių' },
      { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺', native: 'Lëtzebuergesch' },
      { code: 'mk', name: 'Macedonian', flag: '🇲🇰', native: 'Македонски' },
      { code: 'mg', name: 'Malagasy', flag: '🇲🇬', native: 'Malagasy' },
      { code: 'ms', name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu' },
      { code: 'ml', name: 'Malayalam', flag: '🇮🇳', native: 'മലയാളം' },
      { code: 'mt', name: 'Maltese', flag: '🇲🇹', native: 'Malti' },
      { code: 'mi', name: 'Maori', flag: '🇳🇿', native: 'Te Reo Māori' },
      { code: 'mr', name: 'Marathi', flag: '🇮🇳', native: 'मराठी' },
      { code: 'mn', name: 'Mongolian', flag: '🇲🇳', native: 'Монгол' },
      { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲', native: 'မြန်မာ' },
      { code: 'ne', name: 'Nepali', flag: '🇳🇵', native: 'नेपाली' },
      { code: 'no', name: 'Norwegian', flag: '🇳🇴', native: 'Norsk' },
      { code: 'or', name: 'Odia (Oriya)', flag: '🇮🇳', native: 'ଓଡ଼ିଆ' },
      { code: 'ps', name: 'Pashto', flag: '🇦🇫', native: 'پښتو' },
      { code: 'fa', name: 'Persian', flag: '🇮🇷', native: 'فارسی' },
      { code: 'pl', name: 'Polish', flag: '🇵🇱', native: 'Polski' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
      { code: 'pa', name: 'Punjabi', flag: '🇮🇳', native: 'ਪੰਜਾਬੀ' },
      { code: 'ro', name: 'Romanian', flag: '🇷🇴', native: 'Română' },
      { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
      { code: 'sm', name: 'Samoan', flag: '🇼🇸', native: 'Gagana Samoa' },
      { code: 'gd', name: 'Scots Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', native: 'Gàidhlig' },
      { code: 'sr', name: 'Serbian', flag: '🇷🇸', native: 'Српски' },
      { code: 'st', name: 'Sesotho', flag: '🇱🇸', native: 'Sesotho' },
      { code: 'sn', name: 'Shona', flag: '🇿🇼', native: 'chiShona' },
      { code: 'sd', name: 'Sindhi', flag: '🇵🇰', native: 'سنڌي' },
      { code: 'si', name: 'Sinhala', flag: '🇱🇰', native: 'සිංහල' },
      { code: 'sk', name: 'Slovak', flag: '🇸🇰', native: 'Slovenčina' },
      { code: 'sl', name: 'Slovenian', flag: '🇸🇮', native: 'Slovenščina' },
      { code: 'so', name: 'Somali', flag: '🇸🇴', native: 'Soomaali' },
      { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
      { code: 'su', name: 'Sundanese', flag: '🇮🇩', native: 'Basa Sunda' },
      { code: 'sw', name: 'Swahili', flag: '🇰🇪', native: 'Kiswahili' },
      { code: 'sv', name: 'Swedish', flag: '🇸🇪', native: 'Svenska' },
      { code: 'tg', name: 'Tajik', flag: '🇹🇯', native: 'Тоҷикӣ' },
      { code: 'ta', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
      { code: 'tt', name: 'Tatar', flag: '🇷🇺', native: 'Татар' },
      { code: 'te', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
      { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
      { code: 'tr', name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
      { code: 'tk', name: 'Turkmen', flag: '🇹🇲', native: 'Türkmen' },
      { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', native: 'Українська' },
      { code: 'ur', name: 'Urdu', flag: '🇵🇰', native: 'اردو' },
      { code: 'ug', name: 'Uyghur', flag: '🇨🇳', native: 'ئۇيغۇرچە' },
      { code: 'uz', name: 'Uzbek', flag: '🇺🇿', native: "O'zbek" },
      { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
      { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', native: 'Cymraeg' },
      { code: 'xh', name: 'Xhosa', flag: '🇿🇦', native: 'isiXhosa' },
      { code: 'yi', name: 'Yiddish', flag: '🇮🇱', native: 'ייִדיש' },
      { code: 'yo', name: 'Yoruba', flag: '🇳🇬', native: 'Yorùbá' },
      { code: 'zu', name: 'Zulu', flag: '🇿🇦', native: 'isiZulu' }
    ]
  };

  // ============================================
  // LANGUAGE MODAL CLASS
  // ============================================

  const LanguageModal = {
    // State
    isOpen: false,
    currentLanguage: 'en',
    searchQuery: '',

    // DOM Elements
    elements: {
      overlay: null,
      modal: null,
      closeBtn: null,
      searchInput: null,
      searchClear: null,
      currentValue: null,
      listContainer: null,
      noResults: null,
      noResultsQuery: null,
      resetBtn: null,
      sections: {},
      grids: {}
    },

    // ============================================
    // INITIALIZATION
    // ============================================

    init: function() {
      console.log('[LanguageModal] Initializing...');

      // Cache DOM elements
      this.cacheElements();

      if (!this.elements.overlay) {
        console.warn('[LanguageModal] Modal not found in DOM. Skipping initialization.');
        return;
      }

      // Load saved language
      this.currentLanguage = this.getSavedLanguage();

      // Populate language grids
      this.populateLanguages();

      // Bind events
      this.bindEvents();

      // Update current language display
      this.updateCurrentLanguageDisplay();

      // Initialize Google Translate (hidden)
      this.initGoogleTranslate();

      console.log('[LanguageModal] Initialized with language:', this.currentLanguage);
    },

    cacheElements: function() {
      this.elements.overlay = document.getElementById('language-modal-overlay');
      this.elements.closeBtn = document.getElementById('language-modal-close');
      this.elements.modalTitle = document.getElementById('language-modal-title');
      this.elements.searchInput = document.getElementById('language-search-input');
      this.elements.searchClear = document.getElementById('language-search-clear');
      this.elements.currentValue = document.getElementById('language-current-value');
      this.elements.listContainer = document.getElementById('language-list-container');
      this.elements.noResults = document.getElementById('language-no-results');
      this.elements.noResultsQuery = document.getElementById('language-no-results-query');
      this.elements.resetBtn = document.getElementById('language-reset-btn');

      if (this.elements.overlay) {
        this.elements.modal = this.elements.overlay.querySelector('.language-modal');
      }

      // Cache section and grid elements
      ['popular', 'african', 'all'].forEach(section => {
        this.elements.sections[section] = document.querySelector(`.language-section[data-section="${section}"]`);
        this.elements.grids[section] = document.getElementById(`language-grid-${section}`);
      });

      // Debug logging
      console.log('[LanguageModal] Elements cached:', {
        overlay: !!this.elements.overlay,
        searchInput: !!this.elements.searchInput,
        listContainer: !!this.elements.listContainer,
        grids: {
          popular: !!this.elements.grids.popular,
          african: !!this.elements.grids.african,
          all: !!this.elements.grids.all
        }
      });
    },

    // ============================================
    // POPULATE LANGUAGES
    // ============================================

    populateLanguages: function() {
      // Populate each section
      Object.keys(LANGUAGES).forEach(section => {
        const grid = this.elements.grids[section];
        if (!grid) return;

        grid.innerHTML = LANGUAGES[section].map(lang => this.createLanguageButton(lang)).join('');
      });

      // Mark current language as active
      this.updateActiveLanguage();
    },

    createLanguageButton: function(lang) {
      const isActive = lang.code === this.currentLanguage;
      return `
        <button
          class="language-option-btn ${isActive ? 'active' : ''}"
          data-lang-code="${lang.code}"
          data-lang-name="${lang.name}"
          data-lang-native="${lang.native}"
          aria-label="Select ${lang.name}"
        >
          <span class="language-option-flag">${lang.flag}</span>
          <span class="language-option-name">${lang.native}</span>
        </button>
      `;
    },

    updateActiveLanguage: function() {
      // Remove active class from all buttons
      document.querySelectorAll('.language-option-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // Add active class to current language buttons
      document.querySelectorAll(`[data-lang-code="${this.currentLanguage}"]`).forEach(btn => {
        btn.classList.add('active');
      });
    },

    // ============================================
    // EVENT BINDING
    // ============================================

    bindEvents: function() {
      // Open modal - bind to all globe buttons
      document.querySelectorAll('[data-action="open-language-modal"], .language-btn, #language-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.open();
        });
      });

      // Close modal
      if (this.elements.closeBtn) {
        this.elements.closeBtn.addEventListener('click', () => this.close());
      }

      // Close on overlay click
      if (this.elements.overlay) {
        this.elements.overlay.addEventListener('click', (e) => {
          if (e.target === this.elements.overlay) {
            this.close();
          }
        });
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Search input - bind multiple events for reliability
      if (this.elements.searchInput) {
        const searchHandler = (e) => {
          console.log('[LanguageModal] Search triggered:', e.target.value);
          this.handleSearch(e.target.value);
        };
        this.elements.searchInput.addEventListener('input', searchHandler);
        this.elements.searchInput.addEventListener('keyup', searchHandler);
      } else {
        console.warn('[LanguageModal] Search input not found!');
      }

      // Search clear
      if (this.elements.searchClear) {
        this.elements.searchClear.addEventListener('click', () => {
          this.elements.searchInput.value = '';
          this.handleSearch('');
          this.elements.searchInput.focus();
        });
      }

      // Language selection (event delegation)
      if (this.elements.listContainer) {
        this.elements.listContainer.addEventListener('click', (e) => {
          const btn = e.target.closest('.language-option-btn');
          if (btn) {
            const langCode = btn.dataset.langCode;
            this.selectLanguage(langCode);
          }
        });
      }

      // Reset button
      if (this.elements.resetBtn) {
        this.elements.resetBtn.addEventListener('click', () => {
          this.selectLanguage('en');
        });
      }
    },

    // ============================================
    // MODAL OPEN/CLOSE
    // ============================================

    open: function() {
      if (!this.elements.overlay) return;

      this.isOpen = true;
      this.elements.overlay.classList.add('active');
      this.elements.overlay.setAttribute('aria-hidden', 'false');

      // Focus search input
      setTimeout(() => {
        if (this.elements.searchInput) {
          this.elements.searchInput.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      console.log('[LanguageModal] Opened');
    },

    close: function() {
      if (!this.elements.overlay) return;

      this.isOpen = false;
      this.elements.overlay.classList.remove('active');
      this.elements.overlay.setAttribute('aria-hidden', 'true');

      // Clear search
      if (this.elements.searchInput) {
        this.elements.searchInput.value = '';
        this.handleSearch('');
      }

      // Restore body scroll
      document.body.style.overflow = '';

      console.log('[LanguageModal] Closed');
    },

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    handleSearch: function(query) {
      this.searchQuery = query.toLowerCase().trim();
      console.log('[LanguageModal] Searching for:', this.searchQuery);

      // Show/hide clear button
      if (this.elements.searchClear) {
        this.elements.searchClear.style.display = this.searchQuery ? 'flex' : 'none';
      }

      if (!this.searchQuery) {
        // Show all languages
        this.showAllLanguages();
        return;
      }

      // Filter languages
      let hasResults = false;
      let totalMatches = 0;

      Object.keys(LANGUAGES).forEach(section => {
        const grid = this.elements.grids[section];
        const sectionEl = this.elements.sections[section];
        if (!grid || !sectionEl) {
          console.warn('[LanguageModal] Missing grid or section for:', section);
          return;
        }

        let sectionHasResults = false;
        const buttons = grid.querySelectorAll('.language-option-btn');
        console.log('[LanguageModal] Section', section, 'has', buttons.length, 'buttons');

        // Filter buttons in this section
        buttons.forEach(btn => {
          const name = (btn.dataset.langName || '').toLowerCase();
          const native = (btn.dataset.langNative || '').toLowerCase();
          const code = (btn.dataset.langCode || '').toLowerCase();

          const matches = name.includes(this.searchQuery) ||
                         native.includes(this.searchQuery) ||
                         code.includes(this.searchQuery);

          btn.classList.toggle('hidden', !matches);
          if (matches) {
            sectionHasResults = true;
            hasResults = true;
            totalMatches++;
          }
        });

        // Show/hide section based on results
        sectionEl.classList.toggle('hidden', !sectionHasResults);
      });

      console.log('[LanguageModal] Search results:', totalMatches, 'matches');

      // Show/hide no results message
      if (this.elements.noResults) {
        this.elements.noResults.style.display = hasResults ? 'none' : 'block';
        if (this.elements.noResultsQuery) {
          this.elements.noResultsQuery.textContent = query;
        }
      }
    },

    showAllLanguages: function() {
      // Show all buttons
      document.querySelectorAll('.language-option-btn').forEach(btn => {
        btn.classList.remove('hidden');
      });

      // Show all sections
      Object.values(this.elements.sections).forEach(section => {
        if (section) section.classList.remove('hidden');
      });

      // Hide no results
      if (this.elements.noResults) {
        this.elements.noResults.style.display = 'none';
      }
    },

    // ============================================
    // LANGUAGE SELECTION
    // ============================================

    selectLanguage: function(langCode) {
      console.log('[LanguageModal] Selecting language:', langCode);

      this.currentLanguage = langCode;

      // Save to localStorage
      localStorage.setItem('pmerit_gt_language', langCode);

      // Update UI
      this.updateActiveLanguage();
      this.updateCurrentLanguageDisplay();

      // Trigger Google Translate
      this.translatePage(langCode);

      // Dispatch event for other modules
      window.dispatchEvent(new CustomEvent('pmerit-language-selected', {
        detail: { code: langCode }
      }));

      // Close modal after short delay
      setTimeout(() => this.close(), 300);
    },

    updateCurrentLanguageDisplay: function() {
      // Find language info
      const lang = LANGUAGES.all.find(l => l.code === this.currentLanguage);
      if (!lang) return;

      // Update current value display
      if (this.elements.currentValue) {
        this.elements.currentValue.textContent = `${lang.flag} ${lang.native}`;
      }

      // Update modal title to show current language (saves space on mobile)
      if (this.elements.modalTitle) {
        this.elements.modalTitle.innerHTML = `<i class="fas fa-globe"></i> ${lang.native}`;
      }
    },

    // ============================================
    // GOOGLE TRANSLATE INTEGRATION
    // ============================================

    initGoogleTranslate: function() {
      // Create hidden container for Google Translate
      let gtContainer = document.getElementById('google_translate_element');
      if (!gtContainer) {
        gtContainer = document.createElement('div');
        gtContainer.id = 'google_translate_element';
        gtContainer.style.cssText = 'position: absolute; left: -9999px; opacity: 0;';
        document.body.appendChild(gtContainer);
      }

      // Define callback before loading script
      window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');

        console.log('[LanguageModal] Google Translate initialized');

        // Apply saved language after GT is ready
        setTimeout(() => {
          const savedLang = this.getSavedLanguage();
          if (savedLang && savedLang !== 'en') {
            this.translatePage(savedLang);
          }
        }, 500);
      };

      // Load Google Translate script if not already loaded
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    },

    translatePage: function(langCode) {
      console.log('[LanguageModal] Translating to:', langCode);

      // Method 1: Use Google Translate's cookie-based approach
      if (langCode === 'en') {
        // Reset to original
        this.resetTranslation();
        return;
      }

      // Method 2: Trigger via select element (most reliable)
      const gtFrame = document.querySelector('.goog-te-menu-frame');
      if (gtFrame) {
        try {
          const frameDoc = gtFrame.contentDocument || gtFrame.contentWindow.document;
          const langLink = frameDoc.querySelector(`[lang="${langCode}"], [value="${langCode}"]`);
          if (langLink) {
            langLink.click();
            return;
          }
        } catch (e) {
          console.warn('[LanguageModal] Cannot access GT iframe:', e);
        }
      }

      // Method 3: Use the combo box
      const gtCombo = document.querySelector('.goog-te-combo');
      if (gtCombo) {
        gtCombo.value = langCode;
        gtCombo.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }

      // Method 4: Set cookie and reload (fallback)
      this.setTranslateCookie(langCode);
    },

    resetTranslation: function() {
      // Clear Google Translate cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;

      // Try to trigger reset via GT
      const gtBanner = document.querySelector('.goog-te-banner-frame');
      if (gtBanner) {
        try {
          const frameDoc = gtBanner.contentDocument || gtBanner.contentWindow.document;
          const closeBtn = frameDoc.querySelector('.goog-close-link');
          if (closeBtn) {
            closeBtn.click();
            return;
          }
        } catch (e) {
          // Ignore
        }
      }

      // Reload page to reset
      if (this.currentLanguage === 'en') {
        window.location.reload();
      }
    },

    setTranslateCookie: function(langCode) {
      const value = `/en/${langCode}`;
      document.cookie = `googtrans=${value}; path=/`;
      document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;

      // Reload to apply translation
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },

    getSavedLanguage: function() {
      // Check localStorage first
      const saved = localStorage.getItem('pmerit_gt_language');
      if (saved) return saved;

      // Check Google Translate cookie
      const cookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='));
      if (cookie) {
        const value = cookie.split('=')[1];
        const langMatch = value.match(/\/en\/(\w+)/);
        if (langMatch) return langMatch[1];
      }

      return 'en';
    }
  };

  // ============================================
  // EXPOSE AND INITIALIZE
  // ============================================

  window.LanguageModal = LanguageModal;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LanguageModal.init());
  } else {
    LanguageModal.init();
  }

  console.log('[LanguageModal] Module loaded');

})();
