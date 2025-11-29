/**
 * PMERIT Searchable Language Modal
 * Hybrid solution: Custom searchable UI + Google Translate backend
 */

(function() {
  'use strict';

  // Modal HTML template
  const modalHTML = `
    <div id="languageModal" class="language-modal-overlay" style="display:none;">
      <div class="language-modal">
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
      background: #4a9eff;
      color: #ffffff;
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
    return `
      <div class="language-item ${offlineClass}" data-code="${lang.code}" title="${lang.nativeName}">
        <span class="region">${lang.region}</span>
        <span class="name">${lang.name}</span>
      </div>
    `;
  }

  // Handle search input
  function handleSearch(e) {
    renderLanguages(e.target.value);
  }

  // Select a language
  function selectLanguage(code) {
    const lang = window.PMERIT_LANGUAGES.getByCode(code);
    if (!lang) return;

    console.log('[LanguageModal] Selected:', lang.name, '| Offline:', lang.offline);

    if (lang.offline) {
      // For offline languages: Reset GT first, then use Language Manager
      console.log('[LanguageModal] Resetting GT and applying Language Manager for:', code);

      // Step 1: Clear Google Translate cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;

      // Step 2: Reset GT select to empty/English if it exists
      const gtSelect = document.querySelector('.goog-te-combo');
      if (gtSelect) {
        gtSelect.value = '';
        gtSelect.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[LanguageModal] Reset GT select to English');
      }

      // Step 3: Apply Language Manager
      if (window.LanguageManager && typeof window.LanguageManager.setLanguage === 'function') {
        window.LanguageManager.setLanguage(code);
        console.log('[LanguageModal] ✅ Language Manager applied for:', code);
      } else {
        console.warn('[LanguageModal] LanguageManager not found or setLanguage not available');
        console.log('[LanguageModal] window.LanguageManager:', window.LanguageManager);
      }
    } else {
      // Use Google Translate for online languages
      triggerGoogleTranslate(code);
    }

    close();
  }

  // Trigger Google Translate programmatically
  function triggerGoogleTranslate(code) {
    console.log('[LanguageModal] Attempting to translate to:', code);

    // Method 1: Find GT's hidden select element
    const gtSelect = document.querySelector('.goog-te-combo');
    console.log('[LanguageModal] GT select element:', gtSelect);

    if (gtSelect) {
      // Check available options
      const options = Array.from(gtSelect.options).map(o => o.value);
      console.log('[LanguageModal] Available GT options:', options.slice(0, 10), '...');

      if (options.includes(code)) {
        gtSelect.value = code;
        gtSelect.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[LanguageModal] Triggered GT via select for:', code);
        return;
      } else {
        console.warn('[LanguageModal] Language code not in GT options:', code);
      }
    }

    // Method 2: Cookie-based fallback (most reliable)
    console.log('[LanguageModal] Using cookie fallback for:', code);
    setTranslateCookie(code);
  }

  // Set Google Translate cookie and reload
  function setTranslateCookie(code) {
    const value = '/en/' + code;

    // Set cookie for current domain
    document.cookie = 'googtrans=' + value + '; path=/';
    document.cookie = 'googtrans=' + value + '; path=/; domain=' + window.location.hostname;

    console.log('[LanguageModal] Set googtrans cookie:', value);

    // Reload to apply translation
    setTimeout(function() {
      window.location.reload();
    }, 100);
  }

  // Open modal
  function open() {
    if (!modal) return;
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
