/**
 * PMERIT Platform Configuration
 * Phase 1: Environment detection and config management
 * Last Updated: October 2025
 *
 * This file must be loaded before all other application scripts.
 */

(function () {
  'use strict';

  // Detect environment based on hostname
  function detectEnvironment() {
    const hostname = window.location.hostname;

    // Development: localhost or 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }

    // Staging: Cloudflare Pages preview URLs (*.pages.dev)
    if (hostname.includes('.pages.dev')) {
      return 'staging';
    }

    // Production: everything else (pmerit.com, etc.)
    return 'production';
  }

  // Configuration object
  const config = {
    ENV: detectEnvironment(),

    // AI Chat URL (current)
    AI_CHAT_URL: 'https://pmerit-ai-chat.openai.azure.com',

    // API Base URL (placeholder for Phase 2)
    // TODO (Phase 2): Update this with actual backend API URL
    API_BASE_URL: '/api',

    // App version
    VERSION: '1.0.0-phase1'
  };

  // Make config globally available
  window.CONFIG = Object.freeze(config);

  // Avatar configuration (Phase 5)
  window.PMERIT = window.PMERIT || {};
  
  // Ensure AVATAR_BASE_URL always has trailing slash
  let avatarBaseUrl = window.PMERIT.AVATAR_BASE_URL || '/assets/avatars/';
  if (!avatarBaseUrl.endsWith('/')) {
    avatarBaseUrl += '/';
  }
  
  window.PMERIT.AVATAR_BASE_URL = avatarBaseUrl;
  window.PMERIT.AVATAR_MODEL = window.PMERIT.AVATAR_MODEL || 'pm_classic.glb';
  window.PMERIT.AVATAR_SCALE = window.PMERIT.AVATAR_SCALE || 1.0;
  window.PMERIT.CAMERA_POS = window.PMERIT.CAMERA_POS || [0, 1.4, 2.2];
  window.PMERIT.LIGHT_PRESET = window.PMERIT.LIGHT_PRESET || 'hemi-dir-soft';

  // Log environment in development
  if (config.ENV === 'development') {
    console.log('🔧 PMERIT Config loaded:', config);
  }
})();
