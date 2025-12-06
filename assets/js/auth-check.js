/**
 * PMERIT Route Guard
 * Last Updated: December 2025
 *
 * This script should be included near the top of any protected page.
 * It checks if the user is authenticated and redirects to homepage if not.
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
    sessionStorage.setItem('pmerit_redirect_after_login', currentUrl);

    // Redirect to homepage with auth modal trigger
    window.location.href = '/?auth=signin';
  } else {
    // User is authenticated - optionally validate token with backend
    // This is done asynchronously to not block page load
    window.AUTH.fetchCurrentUser().then(result => {
      if (!result.success) {
        console.warn('Token validation failed:', result.message);
        // Token may be expired - redirect to login
        if (result.message === 'Not authenticated' || result.message?.includes('expired')) {
          sessionStorage.setItem('pmerit_redirect_after_login', window.location.pathname);
          window.location.href = '/?auth=signin';
        }
      }
    }).catch(err => {
      console.warn('Token validation error:', err);
    });
  }
})();
