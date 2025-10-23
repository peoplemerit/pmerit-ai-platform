/**
 * PMERIT Authentication Module (Phase 1: Mock Implementation)
 * Last Updated: October 2025
 *
 * This module provides mock authentication that works without a backend.
 * All authentication logic will be replaced with real API calls in Phase 2.
 *
 * TODO (Phase 2): Replace all mock functions with real fetch() calls to ${CONFIG.API_BASE_URL}/auth/*
 */

(function () {
  'use strict';

  const AUTH = {
    /**
     * Sign in a user (Mock implementation)
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{success: boolean, message: string, user?: object}>}
     */
    signin: async function (email, password) {
      // TODO (Phase 2): Replace with real API call
      // Example:
      // const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/signin`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   localStorage.setItem('pmerit_token', data.token);
      //   localStorage.setItem('pmerit_user', JSON.stringify(data.user));
      //   return { success: true, message: 'Signed in successfully', user: data.user };
      // }
      // return { success: false, message: data.message || 'Sign in failed' };

      // Mock implementation (Phase 1)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Basic validation
          if (!email || !password) {
            resolve({ success: false, message: 'Email and password are required' });
            return;
          }

          if (password.length < 6) {
            resolve({ success: false, message: 'Password must be at least 6 characters' });
            return;
          }

          // Mock success - any email with password >= 6 chars
          const user = {
            id: 'mock-user-' + Date.now(),
            email: email,
            firstName: email.split('@')[0],
            lastName: 'User',
            createdAt: new Date().toISOString()
          };

          // Store mock token and user data
          localStorage.setItem('pmerit_token', 'mock-token-' + Date.now());
          localStorage.setItem('pmerit_user', JSON.stringify(user));

          resolve({
            success: true,
            message: 'Signed in successfully',
            user: user
          });
        }, 500); // Simulate network delay
      });
    },

    /**
     * Sign up a new user (Mock implementation)
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} firstName - User first name
     * @param {string} lastName - User last name
     * @returns {Promise<{success: boolean, message: string, user?: object}>}
     */
    signup: async function (email, password, firstName, lastName) {
      // TODO (Phase 2): Replace with real API call
      // Example:
      // const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, firstName, lastName })
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   localStorage.setItem('pmerit_token', data.token);
      //   localStorage.setItem('pmerit_user', JSON.stringify(data.user));
      //   return { success: true, message: 'Account created successfully', user: data.user };
      // }
      // return { success: false, message: data.message || 'Sign up failed' };

      // Mock implementation (Phase 1)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Basic validation
          if (!email || !password || !firstName || !lastName) {
            resolve({ success: false, message: 'All fields are required' });
            return;
          }

          if (password.length < 6) {
            resolve({ success: false, message: 'Password must be at least 6 characters' });
            return;
          }

          // Mock success
          const user = {
            id: 'mock-user-' + Date.now(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            createdAt: new Date().toISOString()
          };

          // Store mock token and user data
          localStorage.setItem('pmerit_token', 'mock-token-' + Date.now());
          localStorage.setItem('pmerit_user', JSON.stringify(user));

          resolve({
            success: true,
            message: 'Account created successfully',
            user: user
          });
        }, 500); // Simulate network delay
      });
    },

    /**
     * Log out the current user
     */
    logout: function () {
      // Clear authentication data
      localStorage.removeItem('pmerit_token');
      localStorage.removeItem('pmerit_user');

      // TODO (Phase 2): Call backend to invalidate token
      // await fetch(`${window.CONFIG.API_BASE_URL}/auth/logout`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      // Redirect to sign in page
      window.location.href = '/signin.html';
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function () {
      const token = localStorage.getItem('pmerit_token');
      const user = localStorage.getItem('pmerit_user');

      // TODO (Phase 2): Validate token with backend
      // const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/verify`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // return response.ok;

      // Mock: check if both token and user exist
      return !!(token && user);
    },

    /**
     * Get current authenticated user
     * @returns {object|null}
     */
    getCurrentUser: function () {
      try {
        const userJson = localStorage.getItem('pmerit_user');
        return userJson ? JSON.parse(userJson) : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
  };

  // Make AUTH globally available
  window.AUTH = AUTH;

  // Log in development
  if (window.CONFIG && window.CONFIG.ENV === 'development') {
    console.log('🔐 PMERIT Auth module loaded (Phase 1: Mock)');
  }
})();
