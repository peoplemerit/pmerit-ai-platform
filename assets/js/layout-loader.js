// Robust layout loader - insert once, wire theme/TTS persistence, defensive removal of legacy static blocks
(function () {
  'use strict';

  const HEADER_URL = '/shared/header.html';
  const FOOTER_URL = '/shared/footer.html';
  const HEADER_ID = 'pmerit-shared-header';
  const FOOTER_ID = 'pmerit-shared-footer';
  const AUTO_ATTR = 'data-layout-auto-init';

  function fetchText(url) {
    return fetch(url, { credentials: 'same-origin' }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch ' + url + ' ' + res.status);
      return res.text();
    });
  }

  function insertOnce(id, html, isHeader) {
    if (document.getElementById(id)) return;
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
    if (legacyHeader) legacyHeader.remove();
    if (legacyFooter) legacyFooter.remove();
  }

  function restorePreferences() {
    try {
      const theme = localStorage.getItem('pmerit:theme');
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      const tts = localStorage.getItem('pmerit:tts-enabled');
      if (tts === 'true') document.documentElement.setAttribute('data-tts', 'on');
      else document.documentElement.removeAttribute('data-tts');
    } catch (e) {
      // ignore storage errors
      console.warn('layout-loader: localStorage not available', e);
    }
  }

  function wireControls(container) {
    if (!container) return;
    const themeBtn = container.querySelector('[data-toggle-theme]');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('pmerit:theme', next); } catch (e) {}
      });
    }

    const ttsBtn = container.querySelector('[data-toggle-tts]');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const on = document.documentElement.getAttribute('data-tts') === 'on';
        if (on) {
          document.documentElement.removeAttribute('data-tts');
          try { localStorage.setItem('pmerit:tts-enabled', 'false'); } catch(e) {}
        } else {
          document.documentElement.setAttribute('data-tts', 'on');
          try { localStorage.setItem('pmerit:tts-enabled', 'true'); } catch(e) {}
        }
      });
    }
  }

  async function init() {
    if (document.body.dataset.layoutLoaded === 'true') return;
    removeLegacyStatic();
    try {
      const [h, f] = await Promise.allSettled([fetchText(HEADER_URL), fetchText(FOOTER_URL)]);
      if (h.status === 'fulfilled' && h.value) {
        insertOnce(HEADER_ID, h.value, true);
        wireControls(document.getElementById(HEADER_ID));
      }
      if (f.status === 'fulfilled' && f.value) {
        insertOnce(FOOTER_ID, f.value, false);
      }
      restorePreferences();
      document.body.dataset.layoutLoaded = 'true';
    } catch (err) {
      console.error('layout-loader init error', err);
    }
  }

  function boot() {
    if (!document.body.hasAttribute(AUTO_ATTR)) return;
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
