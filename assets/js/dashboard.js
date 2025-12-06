/**
 * PMERIT Dashboard Controller
 * Version: 1.0
 * Last Updated: December 2025
 *
 * Manages the user dashboard page
 * Features: Profile display, verification status, logout, assessment history
 */

(function () {
  'use strict';

  const Dashboard = {
    elements: {
      userName: null,
      profileName: null,
      profileEmail: null,
      emailStatus: null,
      resendContainer: null,
      btnResend: null,
      profileJoined: null,
      assessmentHistory: null,
      btnLogout: null,
      message: null
    },

    /**
     * Initialize the dashboard
     */
    init: function () {
      // Get DOM elements
      this.elements.userName = document.getElementById('user-name');
      this.elements.profileName = document.getElementById('profile-name');
      this.elements.profileEmail = document.getElementById('profile-email');
      this.elements.emailStatus = document.getElementById('email-status');
      this.elements.resendContainer = document.getElementById('resend-container');
      this.elements.btnResend = document.getElementById('btn-resend-verification');
      this.elements.profileJoined = document.getElementById('profile-joined');
      this.elements.assessmentHistory = document.getElementById('assessment-history');
      this.elements.btnLogout = document.getElementById('btn-logout');
      this.elements.message = document.getElementById('dashboard-message');

      // Load user data
      this.loadUserData();

      // Bind events
      this.bindEvents();

      // Load assessment history
      this.loadAssessmentHistory();

      logger.debug('Dashboard initialized');
    },

    /**
     * Load user data from localStorage/AUTH
     */
    loadUserData: function () {
      const user = window.AUTH?.getCurrentUser();

      if (!user) {
        logger.warn('Dashboard: No user data found');
        return;
      }

      // Display name
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
      if (this.elements.userName) {
        this.elements.userName.textContent = fullName;
      }
      if (this.elements.profileName) {
        this.elements.profileName.textContent = fullName;
      }

      // Display email
      if (this.elements.profileEmail) {
        this.elements.profileEmail.textContent = user.email || '-';
      }

      // Display email verification status
      this.updateVerificationStatus(user.email_verified);

      // Display join date
      if (this.elements.profileJoined && user.created_at) {
        const joinDate = new Date(user.created_at);
        this.elements.profileJoined.textContent = joinDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },

    /**
     * Update email verification status display
     */
    updateVerificationStatus: function (isVerified) {
      if (!this.elements.emailStatus) return;

      if (isVerified) {
        this.elements.emailStatus.className = 'verification-status verified';
        this.elements.emailStatus.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
        if (this.elements.resendContainer) {
          this.elements.resendContainer.style.display = 'none';
        }
      } else {
        this.elements.emailStatus.className = 'verification-status pending';
        this.elements.emailStatus.innerHTML = '<i class="fas fa-clock"></i> Pending';
        if (this.elements.resendContainer) {
          this.elements.resendContainer.style.display = 'block';
        }
      }
    },

    /**
     * Bind event listeners
     */
    bindEvents: function () {
      // Logout button
      if (this.elements.btnLogout) {
        this.elements.btnLogout.addEventListener('click', () => this.handleLogout());
      }

      // Resend verification button
      if (this.elements.btnResend) {
        this.elements.btnResend.addEventListener('click', () => this.handleResendVerification());
      }
    },

    /**
     * Handle logout
     */
    handleLogout: async function () {
      try {
        this.elements.btnLogout.disabled = true;
        this.elements.btnLogout.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing out...';

        await window.AUTH.logout();

        // Redirect to homepage
        window.location.href = '/';
      } catch (error) {
        logger.error('Logout error:', error);
        this.showMessage('error', 'Failed to sign out. Please try again.');
        this.elements.btnLogout.disabled = false;
        this.elements.btnLogout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
      }
    },

    /**
     * Handle resend verification email
     */
    handleResendVerification: async function () {
      const user = window.AUTH?.getCurrentUser();
      if (!user?.email) {
        this.showMessage('error', 'No email address found');
        return;
      }

      try {
        this.elements.btnResend.disabled = true;
        this.elements.btnResend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const result = await window.AUTH.resendVerification(user.email);

        if (result.success) {
          this.showMessage('success', 'Verification email sent! Please check your inbox.');
        } else {
          this.showMessage('error', result.message || 'Failed to send verification email');
        }
      } catch (error) {
        logger.error('Resend verification error:', error);
        this.showMessage('error', 'Failed to send verification email');
      } finally {
        this.elements.btnResend.disabled = false;
        this.elements.btnResend.innerHTML = '<i class="fas fa-paper-plane"></i> Resend Verification Email';
      }
    },

    /**
     * Load assessment history from localStorage
     */
    loadAssessmentHistory: function () {
      if (!this.elements.assessmentHistory) return;

      // Check localStorage for completed assessments
      const sessions = [];

      // Look for assessment session data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pmerit_assessment_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.completedAt) {
              sessions.push({
                id: key.replace('pmerit_assessment_', ''),
                completedAt: new Date(data.completedAt),
                type: data.type || 'Career Assessment'
              });
            }
          } catch (e) {
            // Skip invalid data
          }
        }
      }

      // Also check for visitor assessment
      const visitorAssessment = localStorage.getItem('pmerit_visitor_assessment');
      if (visitorAssessment) {
        try {
          const data = JSON.parse(visitorAssessment);
          if (data.completedAt) {
            sessions.push({
              id: 'visitor',
              completedAt: new Date(data.completedAt),
              type: 'Career Assessment'
            });
          }
        } catch (e) {
          // Skip invalid data
        }
      }

      // Sort by date (newest first)
      sessions.sort((a, b) => b.completedAt - a.completedAt);

      // Render assessment history
      if (sessions.length === 0) {
        // Keep the empty state that's already in the HTML
        return;
      }

      // Build list HTML
      let html = '';
      sessions.slice(0, 5).forEach(session => {
        html += `
          <div class="assessment-item">
            <div>
              <strong>${session.type}</strong>
              <div class="date">${session.completedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</div>
            </div>
            <span class="status">Completed</span>
          </div>
        `;
      });

      this.elements.assessmentHistory.innerHTML = html;
    },

    /**
     * Show message to user
     */
    showMessage: function (type, text) {
      if (!this.elements.message) return;

      this.elements.message.textContent = text;
      this.elements.message.className = `message ${type}`;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.elements.message.className = 'message';
        this.elements.message.textContent = '';
      }, 5000);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dashboard.init());
  } else {
    Dashboard.init();
  }

  // Export globally
  window.Dashboard = Dashboard;

  logger.debug('Dashboard controller loaded');
})();
