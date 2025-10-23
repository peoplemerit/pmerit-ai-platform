/**
 * auth.js
 * Mock Authentication API for PMERIT platform - Phase 1
 * Implements signin, signup, logout, isAuthenticated, getCurrentUser
 * Uses localStorage for token and user data
 *
 * NOTE: This is a MOCK implementation for Phase 1 development.
 * Replace with real API calls in production.
 */

(function () {
  'use strict';

  // Mock authentication module
  window.AUTH = {

    /**
     * Sign in user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data and token
     */
    signin: function (email, password) {
      return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
          // Basic validation
          if (!email || !password) {
            reject(new Error('Email and password are required'));
            return;
          }

          // Mock successful authentication
          // In real implementation, this would call the API
          const mockUser = {
            id: `user_${ Date.now()}`,
            email: email,
            name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => { return l.toUpperCase(); }),
            role: 'learner',
            createdAt: new Date().toISOString()
          };

          const mockToken = `mock_token_${ btoa(`${email }:${ Date.now()}`)}`;

          // Store in localStorage
          localStorage.setItem('pmerit_token', mockToken);
          localStorage.setItem('pmerit_user', JSON.stringify(mockUser));

          resolve({
            success: true,
            token: mockToken,
            user: mockUser
          });
        }, 500);
      });
    },

    /**
     * Sign up new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} name - User full name
     * @returns {Promise<Object>} User data and token
     */
    signup: function (email, password, name) {
      return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
          // Basic validation
          if (!email || !password || !name) {
            reject(new Error('Email, password, and name are required'));
            return;
          }

          // Mock successful registration
          const mockUser = {
            id: `user_${ Date.now()}`,
            email: email,
            name: name,
            role: 'learner',
            createdAt: new Date().toISOString()
          };

          const mockToken = `mock_token_${ btoa(`${email }:${ Date.now()}`)}`;

          // Store in localStorage
          localStorage.setItem('pmerit_token', mockToken);
          localStorage.setItem('pmerit_user', JSON.stringify(mockUser));

          resolve({
            success: true,
            token: mockToken,
            user: mockUser
          });
        }, 500);
      });
    },

    /**
     * Log out current user
     * @returns {Promise<void>}
     */
    logout: function () {
      return new Promise((resolve) => {
        // Clear localStorage
        localStorage.removeItem('pmerit_token');
        localStorage.removeItem('pmerit_user');

        // Clear any session storage
        sessionStorage.removeItem('redirect_after_login');

        resolve();
      });
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user has valid token
     */
    isAuthenticated: function () {
      const token = localStorage.getItem('pmerit_token');
      const user = localStorage.getItem('pmerit_user');
      return !!(token && user);
    },

    /**
     * Get current authenticated user
     * @returns {Object|null} User object or null if not authenticated
     */
    getCurrentUser: function () {
      if (!this.isAuthenticated()) {
        return null;
      }

      try {
        const userJson = localStorage.getItem('pmerit_user');
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    },

    /**
     * Get authentication token
     * @returns {string|null} Token or null if not authenticated
     */
    getToken: function () {
      return localStorage.getItem('pmerit_token');
    }
  };

  // Log auth module loaded in development
  if (window.CONFIG && window.CONFIG.isDevelopment()) {
    // eslint-disable-next-line no-console
    console.log('PMERIT Auth module loaded (MOCK)');
  }
})();
