/**
 * auth-check.js
 * Authentication checker for protected pages
 * Redirects unauthenticated users to /signin.html
 * Stores current page URL in sessionStorage for redirect after login
 *
 * Include this script on any page that requires authentication
 */

(function () {
  'use strict';

  // Check if AUTH module is loaded
  if (typeof window.AUTH === 'undefined') {
    console.error('AUTH module not loaded. Please include auth.js before auth-check.js');
    return;
  }

  // Check authentication status
  if (!window.AUTH.isAuthenticated()) {
    // Store current URL for redirect after login
    const currentPath = window.location.pathname + window.location.search + window.location.hash;

    // Don't store signin page itself
    if (!currentPath.includes('signin.html') && !currentPath.includes('signup.html')) {
      sessionStorage.setItem('redirect_after_login', currentPath);
    }

    // Redirect to signin page
    window.location.href = '/signin.html';
  }
})();
