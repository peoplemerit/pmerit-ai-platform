/**
 * PMERIT Unified Settings Manager
 * @version 1.0.0
 * @description Centralized manager for user preferences (theme, TTS) with cross-page sync
 *
 * PURPOSE:
 * This module solves the "dual ID problem" where index.html uses different element IDs
 * than the shared partials (loaded via layout-loader.js). Instead of maintaining separate
 * settings code in multiple places, this manager listens to ALL known toggle IDs and
 * keeps them synchronized.
 *
 * ELEMENT ID MAPPING:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Setting      │ index.html IDs                    │ partials/header.html ID │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ Dark Mode    │ mobileDarkToggle, desktopDarkToggle │ dark-mode-toggle       │
 * │ TTS          │ mobileTtsToggle, desktopTtsToggle   │ tts-toggle             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * STORAGE KEYS:
 * - 'theme'        → Primary key for dark mode ('dark' | 'light')
 * - 'tts-enabled'  → Primary key for TTS ('true' | 'false')
 * - 'pmerit-state' → Legacy sync for main.js compatibility (JSON object)
 *
 * USAGE:
 *   // Auto-initializes on DOMContentLoaded, or call manually:
 *   window.SettingsManager.init();
 *
 *   // Programmatic access:
 *   window.SettingsManager.setTheme('dark');
 *   window.SettingsManager.setTTS(true);
 *
 *   // Get current values:
 *   const isDark = window.SettingsManager.getTheme() === 'dark';
 *   const ttsEnabled = window.SettingsManager.isTTSEnabled();
 *
 * @author PMERIT Development Team
 * @license MIT
 */

(function(window) {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * All known toggle element IDs for dark mode
   * These come from different page layouts (index.html vs partials)
   */
  const DARK_MODE_TOGGLE_IDS = [
    'mobileDarkToggle',      // index.html mobile
    'desktopDarkToggle',     // index.html desktop
    'dark-mode-toggle',      // partials/header.html
    'desktop-dark-toggle'    // partials/body.html
  ];

  /**
   * All known toggle element IDs for TTS
   * These come from different page layouts (index.html vs partials)
   */
  const TTS_TOGGLE_IDS = [
    'mobileTtsToggle',       // index.html mobile
    'desktopTtsToggle',      // index.html desktop
    'tts-toggle',            // partials/header.html
    'desktop-tts-toggle'     // partials/body.html
  ];

  /**
   * localStorage keys
   */
  const STORAGE_KEYS = {
    THEME: 'theme',
    TTS: 'tts-enabled',
    LEGACY_STATE: 'pmerit-state'
  };

  /**
   * Theme values
   */
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  // ============================================================================
  // STATE
  // ============================================================================

  let initialized = false;
  let mutationObserver = null;
  const boundElements = new WeakSet(); // Track which elements have listeners attached

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  /**
   * Get the current theme from localStorage or system preference
   * @returns {string} 'light' or 'dark'
   */
  function getTheme() {
    let theme = localStorage.getItem(STORAGE_KEYS.THEME);

    // If no saved preference, check system preference
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = THEMES.DARK;
      } else {
        theme = THEMES.LIGHT;
      }
    }

    return theme;
  }

  /**
   * Set the theme and sync all toggles
   * @param {string} theme - 'light' or 'dark'
   */
  function setTheme(theme) {
    // Validate input
    if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) {
      console.warn('[SettingsManager] Invalid theme value:', theme);
      return;
    }

    const isDark = theme === THEMES.DARK;

    // 1. Save to localStorage (primary key)
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    // 2. Apply to document
    document.documentElement.setAttribute('data-theme', theme);

    // 3. Sync all toggle elements
    syncDarkModeToggles(isDark);

    // 4. Sync legacy pmerit-state for main.js compatibility
    syncLegacyState('darkMode', isDark);

    // 5. Dispatch event for other components
    window.dispatchEvent(new CustomEvent('pmerit:themeChanged', {
      detail: { theme, isDark }
    }));

    console.log('[SettingsManager] Theme set to:', theme);
  }

  /**
   * Toggle between light and dark themes
   * @returns {string} The new theme value
   */
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    return newTheme;
  }

  /**
   * Sync all dark mode toggle checkboxes to the given state
   * @param {boolean} isDark - Whether dark mode is enabled
   */
  function syncDarkModeToggles(isDark) {
    DARK_MODE_TOGGLE_IDS.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle && toggle.type === 'checkbox') {
        // Only update if different to avoid triggering change events
        if (toggle.checked !== isDark) {
          toggle.checked = isDark;
        }
      }
    });
  }

  /**
   * Handle dark mode toggle change event
   * @param {Event} e - Change event
   */
  function handleDarkModeToggleChange(e) {
    const isDark = e.target.checked;
    const theme = isDark ? THEMES.DARK : THEMES.LIGHT;
    setTheme(theme);
  }

  // ============================================================================
  // TTS MANAGEMENT
  // ============================================================================

  /**
   * Check if TTS is enabled
   * @returns {boolean}
   */
  function isTTSEnabled() {
    return localStorage.getItem(STORAGE_KEYS.TTS) === 'true';
  }

  /**
   * Set TTS enabled state and sync all toggles
   * @param {boolean} enabled - Whether TTS should be enabled
   */
  function setTTS(enabled) {
    const boolEnabled = Boolean(enabled);

    // 1. Save to localStorage (primary key)
    localStorage.setItem(STORAGE_KEYS.TTS, boolEnabled.toString());

    // 2. Sync all toggle elements
    syncTTSToggles(boolEnabled);

    // 3. Sync legacy pmerit-state for main.js compatibility
    syncLegacyState('textToSpeech', boolEnabled);

    // 4. Call TTS module if available
    if (window.TTS && typeof window.TTS.setEnabled === 'function') {
      window.TTS.setEnabled(boolEnabled);
    }

    // 5. Update body class for CSS hooks
    if (boolEnabled) {
      document.body.classList.add('tts-enabled');
    } else {
      document.body.classList.remove('tts-enabled');
    }

    // 6. Dispatch event for other components
    window.dispatchEvent(new CustomEvent('pmerit:ttsChanged', {
      detail: { enabled: boolEnabled }
    }));

    console.log('[SettingsManager] TTS set to:', boolEnabled);
  }

  /**
   * Toggle TTS state
   * @returns {boolean} The new TTS state
   */
  function toggleTTS() {
    const newState = !isTTSEnabled();
    setTTS(newState);
    return newState;
  }

  /**
   * Sync all TTS toggle checkboxes to the given state
   * @param {boolean} enabled - Whether TTS is enabled
   */
  function syncTTSToggles(enabled) {
    TTS_TOGGLE_IDS.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle && toggle.type === 'checkbox') {
        // Only update if different to avoid triggering change events
        if (toggle.checked !== enabled) {
          toggle.checked = enabled;
        }
      }
    });
  }

  /**
   * Handle TTS toggle change event
   * @param {Event} e - Change event
   */
  function handleTTSToggleChange(e) {
    const enabled = e.target.checked;
    setTTS(enabled);
  }

  // ============================================================================
  // LEGACY SYNC (for main.js compatibility)
  // ============================================================================

  /**
   * Sync a value to the legacy pmerit-state object
   * This ensures compatibility with main.js which uses a combined state object
   * @param {string} key - State key (e.g., 'darkMode', 'textToSpeech')
   * @param {*} value - Value to set
   */
  function syncLegacyState(key, value) {
    try {
      const stateStr = localStorage.getItem(STORAGE_KEYS.LEGACY_STATE);
      const state = stateStr ? JSON.parse(stateStr) : {};
      state[key] = value;
      localStorage.setItem(STORAGE_KEYS.LEGACY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('[SettingsManager] Could not sync legacy state:', e);
    }
  }

  // ============================================================================
  // ELEMENT BINDING
  // ============================================================================

  /**
   * Bind event listeners to a toggle element
   * Uses WeakSet to track which elements have been bound (prevents double-binding)
   * @param {HTMLElement} element - The toggle element
   * @param {string} type - 'dark' or 'tts'
   */
  function bindToggle(element, type) {
    if (!element || boundElements.has(element)) {
      return; // Already bound or doesn't exist
    }

    const handler = type === 'dark' ? handleDarkModeToggleChange : handleTTSToggleChange;
    element.addEventListener('change', handler);
    boundElements.add(element);

    console.log(`[SettingsManager] Bound ${type} toggle:`, element.id);
  }

  /**
   * Bind all dark mode toggle elements that exist in the DOM
   */
  function bindDarkModeToggles() {
    DARK_MODE_TOGGLE_IDS.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        bindToggle(toggle, 'dark');
      }
    });
  }

  /**
   * Bind all TTS toggle elements that exist in the DOM
   */
  function bindTTSToggles() {
    TTS_TOGGLE_IDS.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        bindToggle(toggle, 'tts');
      }
    });
  }

  /**
   * Bind all settings toggles
   */
  function bindAllToggles() {
    bindDarkModeToggles();
    bindTTSToggles();
  }

  // ============================================================================
  // MUTATION OBSERVER (for dynamically loaded elements)
  // ============================================================================

  /**
   * Start observing the DOM for dynamically added toggle elements
   * This handles the case where layout-loader.js loads header/footer after page load
   */
  function startObserver() {
    if (mutationObserver) {
      return; // Already observing
    }

    mutationObserver = new MutationObserver((mutations) => {
      let shouldRebind = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain our toggle IDs
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the node itself or any descendants have our toggle IDs
              const allToggleIds = [...DARK_MODE_TOGGLE_IDS, ...TTS_TOGGLE_IDS];
              for (const id of allToggleIds) {
                if (node.id === id || (node.querySelector && node.querySelector(`#${id}`))) {
                  shouldRebind = true;
                  break;
                }
              }
            }
            if (shouldRebind) break;
          }
        }
        if (shouldRebind) break;
      }

      if (shouldRebind) {
        console.log('[SettingsManager] DOM changed, rebinding toggles...');
        bindAllToggles();
        applyCurrentSettings();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[SettingsManager] MutationObserver started');
  }

  /**
   * Stop the mutation observer
   */
  function stopObserver() {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
      console.log('[SettingsManager] MutationObserver stopped');
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Apply current settings to the page
   * This syncs localStorage values to the DOM and toggle states
   */
  function applyCurrentSettings() {
    // Apply theme
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    syncDarkModeToggles(theme === THEMES.DARK);

    // Apply TTS
    const ttsEnabled = isTTSEnabled();
    syncTTSToggles(ttsEnabled);

    if (ttsEnabled) {
      document.body.classList.add('tts-enabled');
      if (window.TTS && typeof window.TTS.setEnabled === 'function') {
        window.TTS.setEnabled(true);
      }
    }

    console.log('[SettingsManager] Applied settings - theme:', theme, 'tts:', ttsEnabled);
  }

  /**
   * Initialize the settings manager
   * Safe to call multiple times (idempotent)
   * @returns {boolean} True if initialization was performed, false if already initialized
   */
  function init() {
    if (initialized) {
      console.log('[SettingsManager] Already initialized, skipping');
      return false;
    }

    console.log('[SettingsManager] Initializing...');

    // 1. Apply current settings from localStorage
    applyCurrentSettings();

    // 2. Bind all existing toggle elements
    bindAllToggles();

    // 3. Start observing for dynamically loaded elements
    startObserver();

    // 4. Listen for storage events (cross-tab sync)
    window.addEventListener('storage', handleStorageChange);

    initialized = true;
    console.log('[SettingsManager] Initialization complete');

    return true;
  }

  /**
   * Handle storage change events (for cross-tab sync)
   * @param {StorageEvent} e - Storage event
   */
  function handleStorageChange(e) {
    if (e.key === STORAGE_KEYS.THEME) {
      const theme = e.newValue || THEMES.LIGHT;
      document.documentElement.setAttribute('data-theme', theme);
      syncDarkModeToggles(theme === THEMES.DARK);
      console.log('[SettingsManager] Cross-tab theme sync:', theme);
    } else if (e.key === STORAGE_KEYS.TTS) {
      const enabled = e.newValue === 'true';
      syncTTSToggles(enabled);
      console.log('[SettingsManager] Cross-tab TTS sync:', enabled);
    }
  }

  /**
   * Destroy the settings manager (cleanup)
   * Useful for testing or single-page app navigation
   */
  function destroy() {
    stopObserver();
    window.removeEventListener('storage', handleStorageChange);
    initialized = false;
    console.log('[SettingsManager] Destroyed');
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const SettingsManager = {
    // Initialization
    init,
    destroy,

    // Theme
    getTheme,
    setTheme,
    toggleTheme,

    // TTS
    isTTSEnabled,
    setTTS,
    toggleTTS,

    // Manual rebind (useful if DOM is updated outside of MutationObserver)
    rebind: bindAllToggles,
    applyCurrentSettings,

    // Constants (for external use)
    THEMES,
    STORAGE_KEYS,
    DARK_MODE_TOGGLE_IDS,
    TTS_TOGGLE_IDS
  };

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  // Attach to window for global access
  window.SettingsManager = SettingsManager;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded, initialize immediately
    // Use setTimeout to ensure this runs after any other inline scripts
    setTimeout(init, 0);
  }

  console.log('[SettingsManager] Module loaded');

})(window);
