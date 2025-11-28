/**
 * PMERIT Global Theme Manager
 * Version: 1.0
 * 
 * Handles dark mode persistence across all pages
 * Integrates with existing layout-loader.js implementation
 * 
 * Features:
 * - localStorage persistence with key 'theme'
 * - System preference fallback
 * - Keyboard shortcut support (Ctrl+Shift+D)
 * - Event-driven architecture
 * - Accessibility support
 * 
 * Usage:
 *   const themeManager = new ThemeManager();
 *   themeManager.toggleTheme();
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'theme';
    this.defaultTheme = 'light';
    
    // Apply stored theme immediately
    this.applyStoredTheme();
    
    // Bind toggle button if it exists
    this.bindToggleButton();
    
    // Bind keyboard shortcut
    this.bindKeyboardShortcut();
    
    logger.debug('[ThemeManager] Initialized');
  }
  
  /**
   * Get current theme from localStorage or system preference
   * @returns {string} 'light' | 'dark'
   */
  getCurrentTheme() {
    let theme = localStorage.getItem(this.storageKey);
    
    // If no saved preference, check system preference
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      } else {
        theme = this.defaultTheme;
      }
    }
    
    return theme;
  }
  
  /**
   * Apply the stored theme to the page
   */
  applyStoredTheme() {
    const theme = this.getCurrentTheme();
    const isDark = theme === 'dark';
    
    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button state if it exists
    this.updateToggleButton(isDark);
    
    logger.debug(`[ThemeManager] Applied theme: ${theme}`);
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, newTheme);
    
    // Apply to current page
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update toggle button
    this.updateToggleButton(newTheme === 'dark');
    
    logger.debug(`[ThemeManager] Theme toggled: ${currentTheme} → ${newTheme}`);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
    
    // Also update pmerit-state for compatibility with main.js
    try {
      const state = JSON.parse(localStorage.getItem('pmerit-state') || '{}');
      state.darkMode = newTheme === 'dark';
      localStorage.setItem('pmerit-state', JSON.stringify(state));
    } catch (e) {
      console.warn('[ThemeManager] Could not update pmerit-state:', e);
    }
  }
  
  /**
   * Bind click handler to theme toggle button
   */
  bindToggleButton() {
    // Try multiple possible toggle button IDs for compatibility
    const toggleIds = ['theme-toggle', 'dark-mode-toggle'];
    
    for (const id of toggleIds) {
      const toggleButton = document.getElementById(id);
      if (toggleButton) {
        // Check if it's a checkbox or button
        if (toggleButton.type === 'checkbox') {
          // It's a checkbox toggle (like in the hamburger menu)
          toggleButton.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            localStorage.setItem(this.storageKey, theme);
            document.documentElement.setAttribute('data-theme', theme);
            logger.debug(`[ThemeManager] Theme changed to: ${theme}`);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('themeChanged', { 
              detail: { theme } 
            }));
          });
        } else {
          // It's a button toggle
          toggleButton.addEventListener('click', () => this.toggleTheme());
        }
        
        logger.debug(`[ThemeManager] Bound toggle button: #${id}`);
      }
    }
  }
  
  /**
   * Update toggle button icon and aria-label
   * @param {boolean} isDark - Whether dark mode is active
   */
  updateToggleButton(isDark) {
    const toggleIds = ['theme-toggle', 'dark-mode-toggle'];
    
    for (const id of toggleIds) {
      const toggleButton = document.getElementById(id);
      if (!toggleButton) continue;
      
      // Update checkbox state
      if (toggleButton.type === 'checkbox') {
        toggleButton.checked = isDark;
      }
      
      // Update button icon if it has one
      const icon = toggleButton.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      }
      
      // Update aria-label for accessibility
      toggleButton.setAttribute(
        'aria-label', 
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
      
      // Update data attribute for CSS styling
      toggleButton.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }
  
  /**
   * Bind keyboard shortcut (Ctrl+Shift+D)
   */
  bindKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
        
        // Announce to screen readers
        this.announceThemeChange();
      }
    });
  }
  
  /**
   * Announce theme change to screen readers
   */
  announceThemeChange() {
    const theme = this.getCurrentTheme();
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme} mode`;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000);
  }
}

// Auto-initialize when script loads
// This runs on every page that includes this script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pmeritThemeManager = new ThemeManager();
  });
} else {
  window.pmeritThemeManager = new ThemeManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
