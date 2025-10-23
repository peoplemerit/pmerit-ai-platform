/**
 * PMERIT Route Guard (Phase 1)
 * Last Updated: October 2025
 *
 * This script should be included near the top of any protected page.
 * It checks if the user is authenticated and redirects to sign-in if not.
 *
 * Usage:
 * <script src="assets/js/config.js"></script>
 * <script src="assets/js/auth.js"></script>
 * <script src="assets/js/auth-check.js"></script>
 */

(function () {
  'use strict';

  // Wait for AUTH to be available
  if (typeof window.AUTH === 'undefined') {
    console.error('auth-check.js: AUTH module not loaded. Include auth.js before auth-check.js');
    return;
  }

  // Check authentication status
  if (!window.AUTH.isAuthenticated()) {
    // Store the current URL for redirect after login
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('redirect_after_login', currentUrl);

    // Redirect to sign-in page
    window.location.href = '/signin.html';
  }
})();
