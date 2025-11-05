// Robust layout loader - insert once, wire theme/TTS persistence, defensive removal of legacy static blocks
(function () {
  'use strict';

  const HEADER_ID = 'pmerit-shared-header';
  const FOOTER_ID = 'pmerit-shared-footer';
  const AUTO_ATTR = 'data-layout-auto-init';

  // Configuration: read from global config, data attributes, or use defaults
  function getConfig() {
    const bodyEl = document.body;
    const globalBase = (window.CONFIG && window.CONFIG.LAYOUT_PARTIALS_BASE) || null;
    const dataBase = bodyEl.getAttribute('data-layout-partials-base') || null;
    const base = dataBase || globalBase || '/shared';

    return {
      headerPrimary: `${base}/header.html`,
      footerPrimary: `${base}/footer.html`,
      headerFallback: '/partials/header.html',
      footerFallback: '/partials/footer.html'
    };
  }

  function fetchText(url) {
    return fetch(url, { credentials: 'same-origin' }).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url} (${res.status})`);
      }
      return res.text();
    });
  }

  // Fetch with fallback: try primary URL first, then fallback URL
  async function fetchWithFallback(primaryUrl, fallbackUrl, partialName) {
    try {
      return await fetchText(primaryUrl);
    } catch (primaryError) {
      console.warn(`layout-loader: ${partialName} not found at ${primaryUrl}, trying fallback...`);
      try {
        return await fetchText(fallbackUrl);
      } catch (fallbackError) {
        const errorMsg = `layout-loader: failed to fetch ${partialName} from ${primaryUrl} and ${fallbackUrl}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
    }
  }

  function insertOnce(id, html, isHeader) {
    if (document.getElementById(id)) {
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'pmerit-shared-layout';
    wrapper.innerHTML = html;
    if (isHeader) {
      // Insert header at the very top of body
      document.body.insertAdjacentElement('afterbegin', wrapper);
    } else {
      document.body.insertAdjacentElement('beforeend', wrapper);
    }
  }

  function removeLegacyStatic() {
    // Remove or hide legacy static header/footer markers if present
    const legacyHeader = document.querySelector('header[data-pmerit-static-header]');
    const legacyFooter = document.querySelector('footer[data-pmerit-static-footer]');
    if (legacyHeader) {
      legacyHeader.remove();
    }
    if (legacyFooter) {
      legacyFooter.remove();
    }
  }

  function restorePreferences() {
    try {
      const theme = localStorage.getItem('pmerit:theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
      const tts = localStorage.getItem('pmerit:tts-enabled');
      if (tts === 'true') {
        document.documentElement.setAttribute('data-tts', 'on');
      } else {
        document.documentElement.removeAttribute('data-tts');
      }
    } catch (e) {
      // ignore storage errors
      console.warn('layout-loader: localStorage not available', e);
    }
  }

  function wireControls(container) {
    if (!container) {
      return;
    }
    const themeBtn = container.querySelector('[data-toggle-theme]');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('pmerit:theme', next);
        } catch (e) {
          // ignore
        }
      });
    }

    const ttsBtn = container.querySelector('[data-toggle-tts]');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const on = document.documentElement.getAttribute('data-tts') === 'on';
        if (on) {
          document.documentElement.removeAttribute('data-tts');
          try {
            localStorage.setItem('pmerit:tts-enabled', 'false');
          } catch (e) {
            // ignore
          }
        } else {
          document.documentElement.setAttribute('data-tts', 'on');
          try {
            localStorage.setItem('pmerit:tts-enabled', 'true');
          } catch (e) {
            // ignore
          }
        }
      });
    }
  }

  function loadModalScript() {
    // Check if modal.js is already loaded
    if (window.modalManager || document.querySelector('script[src="/assets/js/modal.js"]')) {
      return;
    }
    
    // Create and load modal.js script
    const script = document.createElement('script');
    script.src = '/assets/js/modal.js';
    script.onerror = () => {
      console.warn('layout-loader: Failed to load modal.js');
    };
    document.body.appendChild(script);
  }

  async function init() {
    if (document.body.dataset.layoutLoaded === 'true') {
      // Already loaded, check if elements still exist
      const headerExists = !!document.getElementById(HEADER_ID);
      const footerExists = !!document.getElementById(FOOTER_ID);
      return { success: headerExists || footerExists, header: headerExists, footer: footerExists, error: null };
    }
    removeLegacyStatic();

    const config = getConfig();
    const results = { success: false, header: false, footer: false, error: null };

    try {
      // Fetch header with fallback
      try {
        const headerHtml = await fetchWithFallback(config.headerPrimary, config.headerFallback, 'header');
        insertOnce(HEADER_ID, headerHtml, true);
        wireControls(document.getElementById(HEADER_ID));
        results.header = true;
      } catch (headerError) {
        results.error = headerError.message;
      }

      // Fetch footer with fallback
      try {
        const footerHtml = await fetchWithFallback(config.footerPrimary, config.footerFallback, 'footer');
        insertOnce(FOOTER_ID, footerHtml, false);
        results.footer = true;
        
        // Load modal.js after footer is inserted to manage modal behavior
        loadModalScript();
      } catch (footerError) {
        if (!results.error) {
          results.error = footerError.message;
        } else {
          results.error = `${results.error}; ${footerError.message}`;
        }
      }

      // Success if at least one partial loaded
      results.success = results.header || results.footer;

      restorePreferences();
      document.body.dataset.layoutLoaded = 'true';

      return results;
    } catch (err) {
      console.error('layout-loader init error', err);
      results.error = err.message || 'Unknown error during initialization';
      return results;
    }
  }

  function boot() {
    if (!document.body.hasAttribute(AUTO_ATTR)) {
      return;
    }
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.PMERIT = window.PMERIT || {};
  window.PMERIT.layout = { init };
})();
