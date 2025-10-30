/**
 * PMERIT Diagnostics Utility
 * Version: 1.0
 * Last Updated: October 30, 2025
 *
 * Collects lightweight diagnostics for tech support submissions
 * Features: App version, browser info, viewport, network status, feature flags, console logs
 */

(function () {
  'use strict';

  const Diagnostics = {
    /**
     * Console log buffer
     */
    consoleBuffer: [],
    maxConsoleBuffer: 10,
    consoleCapture: false,

    /**
     * Initialize diagnostics
     */
    init: function () {
      // Intercept console methods if user consents
      this.setupConsoleCapture();
      
      // eslint-disable-next-line no-console
      console.log('✅ Diagnostics utility initialized');
    },

    /**
     * Setup console capture
     */
    setupConsoleCapture: function () {
      const self = this;
      
      // Store original console methods
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;

      // Intercept console.log
      console.log = function (...args) {
        if (self.consoleCapture) {
          self.addToConsoleBuffer('log', args);
        }
        originalLog.apply(console, args);
      };

      // Intercept console.warn
      console.warn = function (...args) {
        if (self.consoleCapture) {
          self.addToConsoleBuffer('warn', args);
        }
        originalWarn.apply(console, args);
      };

      // Intercept console.error
      console.error = function (...args) {
        if (self.consoleCapture) {
          self.addToConsoleBuffer('error', args);
        }
        originalError.apply(console, args);
      };
    },

    /**
     * Add entry to console buffer
     */
    addToConsoleBuffer: function (level, args) {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      this.consoleBuffer.push({
        level: level,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Keep only the last N entries
      if (this.consoleBuffer.length > this.maxConsoleBuffer) {
        this.consoleBuffer.shift();
      }
    },

    /**
     * Enable console capture
     */
    enableConsoleCapture: function () {
      this.consoleCapture = true;
    },

    /**
     * Disable console capture
     */
    disableConsoleCapture: function () {
      this.consoleCapture = false;
    },

    /**
     * Get app version
     */
    getAppVersion: function () {
      // Check for version in meta tag or config
      const versionMeta = document.querySelector('meta[name="app-version"]');
      if (versionMeta) {
        return versionMeta.content;
      }
      
      // Fallback to checking config
      if (window.PMERITConfig && window.PMERITConfig.VERSION) {
        return window.PMERITConfig.VERSION;
      }
      
      return '1.0.0';
    },

    /**
     * Get browser information
     */
    getBrowserInfo: function () {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 'Unknown';

      // Detect browser
      if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browser = 'Safari';
        version = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Edg') > -1) {
        browser = 'Edge';
        version = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
      }

      return {
        name: browser,
        version: version,
        userAgent: ua,
        language: navigator.language,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack
      };
    },

    /**
     * Get viewport information
     */
    getViewportInfo: function () {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio || 1,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown'
      };
    },

    /**
     * Get network status
     */
    getNetworkStatus: function () {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        return {
          online: navigator.onLine,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        };
      }
      
      return {
        online: navigator.onLine,
        effectiveType: 'unknown',
        downlink: null,
        rtt: null,
        saveData: false
      };
    },

    /**
     * Get feature toggles
     */
    getFeatureToggles: function () {
      const toggles = {
        virtualHuman: false,
        darkMode: false,
        tts: false
      };

      // Check for Virtual Human mode
      const vhButton = document.getElementById('virtual-human-btn');
      if (vhButton) {
        toggles.virtualHuman = vhButton.getAttribute('aria-pressed') === 'true';
      }

      // Check for dark mode
      const html = document.documentElement;
      toggles.darkMode = html.getAttribute('data-theme') === 'dark';

      // Check for TTS
      const ttsButton = document.getElementById('tts-toggle');
      if (ttsButton) {
        toggles.tts = ttsButton.getAttribute('aria-pressed') === 'true';
      }

      return toggles;
    },

    /**
     * Get WebGL information
     */
    getWebGLInfo: function () {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return {
            supported: true,
            vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
            renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
            version: gl.getParameter(gl.VERSION)
          };
        }
      } catch (e) {
        // WebGL not supported
      }
      
      return {
        supported: false,
        vendor: null,
        renderer: null,
        version: null
      };
    },

    /**
     * Get performance metrics
     */
    getPerformanceMetrics: function () {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const navigation = window.performance.navigation;
        
        return {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
          navigationType: navigation.type,
          redirectCount: navigation.redirectCount
        };
      }
      
      return null;
    },

    /**
     * Get local storage info (size, not content for privacy)
     */
    getStorageInfo: function () {
      const info = {
        localStorage: { available: false, itemCount: 0 },
        sessionStorage: { available: false, itemCount: 0 }
      };

      try {
        if (window.localStorage) {
          info.localStorage.available = true;
          info.localStorage.itemCount = window.localStorage.length;
        }
      } catch (e) {
        // LocalStorage not available
      }

      try {
        if (window.sessionStorage) {
          info.sessionStorage.available = true;
          info.sessionStorage.itemCount = window.sessionStorage.length;
        }
      } catch (e) {
        // SessionStorage not available
      }

      return info;
    },

    /**
     * Collect all diagnostics
     */
    collect: function (includeConsole = false) {
      const diagnostics = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        appVersion: this.getAppVersion(),
        browser: this.getBrowserInfo(),
        viewport: this.getViewportInfo(),
        network: this.getNetworkStatus(),
        features: this.getFeatureToggles(),
        webgl: this.getWebGLInfo(),
        performance: this.getPerformanceMetrics(),
        storage: this.getStorageInfo()
      };

      // Include console logs if requested and available
      if (includeConsole && this.consoleCapture) {
        diagnostics.consoleLogs = this.consoleBuffer.slice(-this.maxConsoleBuffer);
      }

      return diagnostics;
    },

    /**
     * Get diagnostics summary as human-readable string
     */
    getSummary: function () {
      const diag = this.collect(false);
      const lines = [];

      lines.push(`App Version: ${diag.appVersion}`);
      lines.push(`Browser: ${diag.browser.name} ${diag.browser.version}`);
      lines.push(`Platform: ${diag.browser.platform}`);
      lines.push(`Viewport: ${diag.viewport.width}x${diag.viewport.height}`);
      lines.push(`Screen: ${diag.viewport.screenWidth}x${diag.viewport.screenHeight}`);
      lines.push(`Network: ${diag.network.online ? 'Online' : 'Offline'} (${diag.network.effectiveType})`);
      lines.push(`Features: VH=${diag.features.virtualHuman}, Dark=${diag.features.darkMode}, TTS=${diag.features.tts}`);
      lines.push(`WebGL: ${diag.webgl.supported ? 'Supported' : 'Not Supported'}`);

      return lines.join('\n');
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Diagnostics.init());
  } else {
    Diagnostics.init();
  }

  // Export globally
  window.Diagnostics = Diagnostics;
})();
