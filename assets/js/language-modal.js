/**
 * PMERIT Searchable Language Modal
 * Hybrid solution: Custom searchable UI + Google Translate backend
 */

(function() {
  'use strict';

  // Modal HTML template
  const modalHTML = `
    <div id="languageModal" class="language-modal-overlay" style="display:none;">
      <div class="language-modal notranslate">
        <div class="language-modal-header">
          <h3>🌐 Select Language</h3>
          <button class="language-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="language-modal-search">
          <input type="text" id="languageSearch" placeholder="Search languages..." autocomplete="off">
        </div>
        <div class="language-modal-content">
          <div class="language-section">
            <h4>★ Offline Available</h4>
            <div id="offlineLanguages" class="language-grid"></div>
          </div>
          <div class="language-section">
            <h4>All Languages</h4>
            <div id="allLanguages" class="language-grid"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // CSS styles for the modal
  const modalCSS = `
    .language-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .language-modal {
      background: #1a1a2e;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      border: 1px solid #3a3a5a;
    }
    .language-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #3a3a5a;
    }
    .language-modal-header h3 {
      margin: 0;
      color: #ffffff;
      font-size: 18px;
    }
    .language-modal-close {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .language-modal-close:hover {
      color: #4a9eff;
    }
    .language-modal-search {
      padding: 16px 20px;
      border-bottom: 1px solid #3a3a5a;
    }
    .language-modal-search input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #3a3a5a;
      border-radius: 8px;
      background: #0d0d1a;
      color: #ffffff;
      font-size: 16px;
    }
    .language-modal-search input:focus {
      outline: none;
      border-color: #4a9eff;
    }
    .language-modal-search input::placeholder {
      color: #888;
    }
    .language-modal-content {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
    }
    .language-section h4 {
      color: #4a9eff;
      margin: 0 0 12px 0;
      font-size: 14px;
      text-transform: uppercase;
    }
    .language-section {
      margin-bottom: 24px;
    }
    .language-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 8px;
    }
    .language-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #252540;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      color: #ffffff;
      border: 1px solid transparent;
    }
    .language-item:hover {
      background: #3a3a5a;
      border-color: #4a9eff;
    }
    .language-item.active {
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
      border-color: #14b8a6;
      color: #ffffff;
      position: relative;
    }
    .language-item.active::before {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 6px;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
    }
    .language-item.active:hover {
      background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
      border-color: #0d9488;
    }
    .language-item .region {
      font-size: 18px;
    }
    .language-item .name {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .language-item.offline::after {
      content: '★';
      color: #ffd700;
      margin-left: auto;
    }
    .no-results {
      color: #888;
      text-align: center;
      padding: 20px;
    }
  `;

  let modal = null;
  let searchInput = null;
  let currentLanguage = 'en';

  // Detect current active language from LanguageManager or Google Translate cookie
  function getCurrentLanguage() {
    // Priority 1: Check LanguageManager for offline language (most reliable)
    if (window.LanguageManager && typeof window.LanguageManager.getCurrentLanguage === 'function') {
      const lmLang = window.LanguageManager.getCurrentLanguage();
      // LanguageManager handles offline languages: en, yo, ig, ha
      // Return non-English offline languages immediately
      if (lmLang && lmLang !== 'en') {
        console.log('[LanguageModal] Current language from LanguageManager:', lmLang);
        return lmLang;
      }
    }

    // Priority 2: Check localStorage directly (fallback for offline languages)
    const offlineLang = localStorage.getItem('pmerit_language');
    if (offlineLang && offlineLang !== 'en') {
      console.log('[LanguageModal] Current language from localStorage:', offlineLang);
      return offlineLang;
    }

    // Default to English
    console.log('[LanguageModal] Defaulting to English');
    return 'en';
  }

  // Update the language button in the header to show current language
  function updateLanguageButton(code) {
    const lang = window.PMERIT_LANGUAGES && window.PMERIT_LANGUAGES.getByCode
      ? window.PMERIT_LANGUAGES.getByCode(code)
      : null;

    const languageName = lang ? lang.name : 'Language';
    const languageCode = code ? code.toUpperCase() : '';

    // === SUB-PAGES: header partial uses #language-btn ===
    const textSpan = document.querySelector('#language-btn .language-btn-text');
    if (textSpan) {
      textSpan.textContent = languageName;
    }
    const codeSpan = document.querySelector('#language-btn .language-btn-code');
    if (codeSpan) {
      codeSpan.textContent = languageCode;
    }

    // === INDEX.HTML: Desktop button uses .language-btn-desktop ===
    const desktopNameSpan = document.querySelector('#language-btn-desktop .language-name');
    if (desktopNameSpan) {
      desktopNameSpan.textContent = languageName;
    }

    // === INDEX.HTML: Mobile button uses .language-btn-mobile ===
    const mobileCodeSpan = document.querySelector('#language-btn-mobile .language-code');
    if (mobileCodeSpan) {
      mobileCodeSpan.textContent = languageCode;
    }

    console.log('[LanguageModal] Updated header button:', languageName, '(' + languageCode + ')');
  }

  // Initialize modal
  function init() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = modalCSS;
    document.head.appendChild(style);

    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    modal = document.getElementById('languageModal');
    searchInput = document.getElementById('languageSearch');

    // Bind events
    modal.querySelector('.language-modal-close').addEventListener('click', close);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') close();
    });
    searchInput.addEventListener('input', handleSearch);

    // Bind language button clicks
    document.addEventListener('click', function(e) {
      if (e.target.closest('[data-action="open-language-modal"]') ||
          e.target.closest('.language-btn-mobile') ||
          e.target.closest('.language-btn-desktop')) {
        e.preventDefault();
        open();
      }
    });

    // Update header button with current language on page load
    const initialLang = getCurrentLanguage();
    updateLanguageButton(initialLang);

    console.log('[LanguageModal] Initialized');
  }

  // Render languages
  function renderLanguages(filter = '') {
    const languages = window.PMERIT_LANGUAGES || [];
    const filtered = filter ? languages.search(filter) : languages;
    const offline = filtered.filter(l => l.offline);
    const online = filtered.filter(l => !l.offline);

    const offlineContainer = document.getElementById('offlineLanguages');
    const allContainer = document.getElementById('allLanguages');

    // Render offline languages
    if (offline.length > 0) {
      offlineContainer.innerHTML = offline.map(lang => createLanguageItem(lang)).join('');
      offlineContainer.parentElement.style.display = 'block';
    } else {
      offlineContainer.parentElement.style.display = 'none';
    }

    // Render all other languages
    if (online.length > 0) {
      allContainer.innerHTML = online.map(lang => createLanguageItem(lang)).join('');
      allContainer.parentElement.style.display = 'block';
    } else if (offline.length === 0) {
      allContainer.innerHTML = '<div class="no-results">No languages found</div>';
      allContainer.parentElement.style.display = 'block';
    } else {
      allContainer.parentElement.style.display = 'none';
    }

    // Bind click events
    modal.querySelectorAll('.language-item').forEach(item => {
      item.addEventListener('click', function() {
        selectLanguage(this.dataset.code);
      });
    });
  }

  // Create language item HTML
  function createLanguageItem(lang) {
    const offlineClass = lang.offline ? 'offline' : '';
    const activeClass = lang.code === currentLanguage ? 'active' : '';
    return `
      <div class="language-item ${offlineClass} ${activeClass}" data-code="${lang.code}" title="${lang.nativeName}">
        <span class="region">${lang.region}</span>
        <span class="name">${lang.name}</span>
      </div>
    `;
  }

  // Handle search input
  function handleSearch(e) {
    renderLanguages(e.target.value);
  }

  // Update the visual active state in the modal
  function updateActiveState(code) {
    // Remove active class from all items
    modal.querySelectorAll('.language-item.active').forEach(item => {
      item.classList.remove('active');
    });
    // Add active class to the selected item
    const selectedItem = modal.querySelector(`.language-item[data-code="${code}"]`);
    if (selectedItem) {
      selectedItem.classList.add('active');
    }
    // Update currentLanguage variable
    currentLanguage = code;
  }

  // Select a language (uses Language Manager for offline translations)
  function selectLanguage(code) {
    const lang = window.PMERIT_LANGUAGES.getByCode(code);
    if (!lang) return;

    console.log('[LanguageModal] Selected:', lang.name);

    // Update visual active state immediately
    updateActiveState(code);

    // Update header button to show selected language
    updateLanguageButton(code);

    // Apply Language Manager for translation
    if (window.LanguageManager && typeof window.LanguageManager.setLanguage === 'function') {
      window.LanguageManager.setLanguage(code);
      console.log('[LanguageModal] ✅ Language Manager applied for:', code);
    } else {
      console.warn('[LanguageModal] LanguageManager not found or setLanguage not available');
    }

    close();
  }

  // Open modal
  function open() {
    if (!modal) return;
    // Detect current language each time modal opens
    currentLanguage = getCurrentLanguage();
    console.log('[LanguageModal] Modal opened, current language:', currentLanguage);

    modal.style.display = 'flex';
    searchInput.value = '';
    searchInput.focus();
    renderLanguages();
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function close() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.LanguageModal = { open, close };

})();
