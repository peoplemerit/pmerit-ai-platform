/**
 * PMERIT Searchable Language Modal
 * Hybrid solution: Custom searchable UI + Translation API backend
 * Version: 2.0.0 - API Integration with loading states
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
        <!-- Loading overlay for API translations -->
        <div id="languageLoadingOverlay" class="language-loading-overlay" style="display:none;">
          <div class="language-loading-spinner"></div>
          <p class="language-loading-text">Loading translations...</p>
        </div>
        <!-- Error message -->
        <div id="languageErrorMessage" class="language-error-message" style="display:none;">
          <p>⚠️ Failed to load translations. Using English instead.</p>
        </div>
      </div>
    </div>
  `;

  // CSS styles for the modal - Matches PMERIT platform theme
  // Version: 2.1 - Platform Theme Alignment (Session 56)
  const modalCSS = `
    .language-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* === LIGHT MODE (Default) === */
    .language-modal {
      background: #FFFFFF;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      border: 1px solid #E5E7EB;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .language-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #E5E7EB;
      background: linear-gradient(135deg, #375b8d 0%, #4AA4B9 100%);
      border-radius: 12px 12px 0 0;
    }
    .language-modal-header h3 {
      margin: 0;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 600;
    }
    .language-modal-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #FFFFFF;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 10px;
      line-height: 1;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .language-modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    .language-modal-search {
      padding: 16px 20px;
      border-bottom: 1px solid #E5E7EB;
      background: #F8F9FA;
    }
    .language-modal-search input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 24px;
      background: #FFFFFF;
      color: #2C2C2C;
      font-size: 16px;
    }
    .language-modal-search input:focus {
      outline: none;
      border-color: #4AA4B9;
      box-shadow: 0 0 0 3px rgba(74, 164, 185, 0.2);
    }
    .language-modal-search input::placeholder {
      color: #9CA3AF;
    }
    .language-modal-content {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
      background: #FFFFFF;
    }
    .language-section h4 {
      color: #2A5B8C;
      margin: 0 0 12px 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
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
      background: #F8F9FA;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      color: #2C2C2C;
      border: 1px solid #E5E7EB;
    }
    .language-item:hover {
      background: #F0F9FA;
      border-color: #4AA4B9;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .language-item.active {
      background: rgba(74, 164, 185, 0.15);
      border-color: #4AA4B9;
      color: #2C2C2C;
      position: relative;
    }
    .language-item.active::before {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 6px;
      font-size: 12px;
      font-weight: bold;
      color: #4AA4B9;
    }
    .language-item.active:hover {
      background: rgba(74, 164, 185, 0.25);
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
      color: #D4A853;
      margin-left: auto;
    }
    .no-results {
      color: #6B7280;
      text-align: center;
      padding: 20px;
    }

    /* === DARK MODE === */
    [data-theme="dark"] .language-modal {
      background: #141820;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    [data-theme="dark"] .language-modal-header {
      background: #1a2332;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    [data-theme="dark"] .language-modal-search {
      background: #141820;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    [data-theme="dark"] .language-modal-search input {
      background: #1a2332;
      border-color: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
    }
    [data-theme="dark"] .language-modal-search input:focus {
      border-color: #4AA4B9;
      box-shadow: 0 0 0 3px rgba(74, 164, 185, 0.2);
    }
    [data-theme="dark"] .language-modal-search input::placeholder {
      color: #6B7280;
    }
    [data-theme="dark"] .language-modal-content {
      background: #141820;
    }
    [data-theme="dark"] .language-section h4 {
      color: #D4A853;
    }
    [data-theme="dark"] .language-item {
      background: #1a2332;
      border-color: rgba(255, 255, 255, 0.1);
      color: #E5E7EB;
    }
    [data-theme="dark"] .language-item:hover {
      background: #242d3d;
      border-color: #4AA4B9;
    }
    [data-theme="dark"] .language-item.active {
      background: #1e4a5c;
      border-color: #4AA4B9;
      color: #FFFFFF;
    }
    [data-theme="dark"] .language-item.active::before {
      color: #4AA4B9;
    }
    [data-theme="dark"] .language-item.offline::after {
      color: #D4A853;
    }
    [data-theme="dark"] .no-results {
      color: #6B7280;
    }

    /* Loading overlay styles */
    .language-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      z-index: 10;
    }
    [data-theme="dark"] .language-loading-overlay {
      background: rgba(20, 24, 32, 0.95);
    }
    .language-loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #E5E7EB;
      border-top-color: #4AA4B9;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    [data-theme="dark"] .language-loading-spinner {
      border-color: rgba(255, 255, 255, 0.2);
      border-top-color: #4AA4B9;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .language-loading-text {
      color: #2C2C2C;
      margin-top: 16px;
      font-size: 14px;
    }
    [data-theme="dark"] .language-loading-text {
      color: #FFFFFF;
    }

    /* Error message styles */
    .language-error-message {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      background: #FEE2E2;
      color: #DC2626;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
      z-index: 11;
      border: 1px solid #FECACA;
    }
    [data-theme="dark"] .language-error-message {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
    }
    .language-error-message p {
      margin: 0;
    }
  `;

  let modal = null;
  let searchInput = null;
  let currentLanguage = 'en';

  // Detect current active language from LanguageManager or Azure Translator
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

  // Show loading overlay
  function showLoading(langCode) {
    const overlay = document.getElementById('languageLoadingOverlay');
    const errorMsg = document.getElementById('languageErrorMessage');
    const loadingText = overlay?.querySelector('.language-loading-text');

    if (overlay) {
      overlay.style.display = 'flex';
      if (loadingText) {
        const lang = window.PMERIT_LANGUAGES?.getByCode?.(langCode);
        const langName = lang?.name || langCode;
        loadingText.textContent = `Loading ${langName} translations...`;
      }
    }
    if (errorMsg) {
      errorMsg.style.display = 'none';
    }
  }

  // Hide loading overlay
  function hideLoading() {
    const overlay = document.getElementById('languageLoadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // Show error message
  function showError(message) {
    const errorMsg = document.getElementById('languageErrorMessage');
    if (errorMsg) {
      const p = errorMsg.querySelector('p');
      if (p) {
        p.textContent = message || '⚠️ Failed to load translations. Using English instead.';
      }
      errorMsg.style.display = 'block';
      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 5000);
    }
  }

  // Handle loading events from LanguageManager
  function handleLoadingEvent(e) {
    const { language, status, error } = e.detail;
    console.log('[LanguageModal] Loading event:', status, language);

    switch (status) {
      case 'start':
        showLoading(language);
        break;
      case 'complete':
        hideLoading();
        // Update button with new language
        updateLanguageButton(language);
        break;
      case 'error':
        hideLoading();
        showError(error ? `⚠️ ${error}` : undefined);
        break;
    }
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

    // Listen for loading events from LanguageManager
    window.addEventListener('pmerit-language-loading', handleLoadingEvent);

    // Update header button with current language on page load
    const initialLang = getCurrentLanguage();
    updateLanguageButton(initialLang);

    console.log('[LanguageModal] v2.0.0 Initialized (API Integration)');
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
