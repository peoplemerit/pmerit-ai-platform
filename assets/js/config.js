/**
 * config.js
 * Global configuration for PMERIT platform
 * Provides environment detection and API endpoints
 */

(function () {
  'use strict';

  // Detect environment based on hostname
  const hostname = window.location.hostname;
  let env = 'production';

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    env = 'development';
  } else if (hostname.includes('staging') || hostname.includes('preview') || hostname.includes('pages.dev')) {
    env = 'staging';
  }

  // Configuration object
  window.CONFIG = {
    ENV: env,

    // API endpoints
    API_BASE_URL: env === 'development'
      ? 'http://localhost:3000/api'
      : env === 'staging'
        ? 'https://api-staging.pmerit.com'
        : 'https://api.pmerit.com',

    // AI Chat service URL
    AI_CHAT_URL: env === 'development'
      ? 'http://localhost:3001/chat'
      : env === 'staging'
        ? 'https://chat-staging.pmerit.com'
        : 'https://chat.pmerit.com',

    // Helper to check environment
    isDevelopment: function () {
      return this.ENV === 'development';
    },

    isStaging: function () {
      return this.ENV === 'staging';
    },

    isProduction: function () {
      return this.ENV === 'production';
    }
  };

  // Log configuration in development (using console.warn for eslint compliance)
  if (window.CONFIG.isDevelopment()) {
    // eslint-disable-next-line no-console
    console.log('PMERIT Config loaded:', window.CONFIG);
  }
})();
