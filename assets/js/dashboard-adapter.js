/**
 * PMERIT Dashboard Adapter
 * Implements Option C (Hybrid) - Single dashboard with dynamic content based on user type
 *
 * @version 1.0.0
 * @created December 25, 2025 (Session 80)
 *
 * Purpose:
 * - Detects user type (adult, K-2, 3-5, 6-8, 9-12) from AUTH module
 * - Applies appropriate CSS classes to show/hide content
 * - Adapts dashboard UI for age-appropriate experience
 *
 * Usage:
 * Include after auth.js and auth-check.js on dashboard.html:
 * <script src="assets/js/dashboard-adapter.js"></script>
 */

(function() {
  'use strict';

  const DashboardAdapter = {
    // UI type to CSS class mapping
    UI_CLASSES: {
      'early_childhood': 'ui-tier-k2',      // K-2: simplified, read-aloud
      'childhood': 'ui-tier-elementary',     // 3-5: guided navigation
      'early_adolescence': 'ui-tier-middle', // 6-8: more autonomy
      'adolescence': 'ui-tier-high',         // 9-12: near-adult
      'adult': 'ui-tier-adult'               // Adults: full career focus
    },

    // Elements to hide for K-12 users (career-focused content)
    K12_HIDDEN_SELECTORS: [
      '#nav-career',                         // Career sidebar section
      '.dashboard-card:has(.fa-briefcase)', // Career Guidance card
      '[href="assessment-entry.html"]',     // Career Assessment links
      '.career-assessment-cta',             // Career assessment CTAs
      '.career-guidance-section',           // Career guidance sections
      '.learner-journey-map'                // Adult learner journey
    ],

    // Elements to show only for K-12 users
    K12_ONLY_SELECTORS: [
      '.k12-learning-section',
      '.parent-oversight-notice'
    ],

    /**
     * Initialize the dashboard adapter
     */
    init: function() {
      console.log('[DashboardAdapter] Initializing...');

      // Wait for AUTH to be available
      if (typeof window.AUTH === 'undefined') {
        console.warn('[DashboardAdapter] AUTH not available, retrying in 100ms');
        setTimeout(() => this.init(), 100);
        return;
      }

      // Get current user
      const user = window.AUTH.getCurrentUser();
      if (!user) {
        console.warn('[DashboardAdapter] No user found');
        return;
      }

      console.log('[DashboardAdapter] User:', {
        accountType: user.accountType,
        gradeCode: user.gradeCode,
        uiType: user.uiType,
        isMinor: user.isMinor
      });

      // Determine UI type
      const uiType = this.determineUIType(user);
      console.log('[DashboardAdapter] Determined UI type:', uiType);

      // Apply dashboard adaptations
      this.applyUIType(uiType, user);
    },

    /**
     * Determine UI type from user data
     * @param {object} user - User object from AUTH
     * @returns {string} UI type
     */
    determineUIType: function(user) {
      // If backend provided uiType, use it
      if (user.uiType) {
        return user.uiType;
      }

      // If user is K-12 (by accountType), derive from gradeCode
      if (user.accountType === 'k12' || user.isMinor) {
        if (user.gradeCode) {
          const grade = user.gradeCode.toUpperCase();
          const gradeNum = parseInt(grade, 10);

          if (grade === 'K' || gradeNum <= 2) {
            return 'early_childhood';
          } else if (gradeNum >= 3 && gradeNum <= 5) {
            return 'childhood';
          } else if (gradeNum >= 6 && gradeNum <= 8) {
            return 'early_adolescence';
          } else if (gradeNum >= 9 && gradeNum <= 12) {
            return 'adolescence';
          }
        }
        // Default K-12 without grade to childhood
        return 'childhood';
      }

      // Default to adult
      return 'adult';
    },

    /**
     * Apply UI adaptations based on type
     * @param {string} uiType - UI type to apply
     * @param {object} user - User object
     */
    applyUIType: function(uiType, user) {
      const body = document.body;
      const isK12 = uiType !== 'adult';

      // Add UI tier class to body
      const uiClass = this.UI_CLASSES[uiType] || 'ui-tier-adult';
      body.classList.add(uiClass);
      body.classList.add(isK12 ? 'user-k12' : 'user-adult');

      console.log('[DashboardAdapter] Applied classes:', uiClass, isK12 ? 'user-k12' : 'user-adult');

      // Hide/show content based on user type
      if (isK12) {
        this.hideCareerContent();
        this.showK12Content();
        this.adaptUIForGrade(uiType, user.gradeCode);
      } else {
        this.showCareerContent();
        this.hideK12Content();
      }

      // Update welcome message for K-12
      if (isK12 && user.gradeCode) {
        this.updateWelcomeForK12(user);
      }
    },

    /**
     * Hide career-focused content for K-12 users
     */
    hideCareerContent: function() {
      // Use CSS classes to hide instead of display:none for better maintainability
      this.K12_HIDDEN_SELECTORS.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.classList.add('hidden-for-k12');
            el.setAttribute('aria-hidden', 'true');
          });
        } catch (e) {
          // Selector might be invalid (e.g., :has not supported in all browsers)
          console.debug('[DashboardAdapter] Selector not supported:', selector);
        }
      });

      // Fallback: Hide career guidance card by icon
      document.querySelectorAll('.dashboard-card').forEach(card => {
        if (card.querySelector('.fa-briefcase')) {
          card.classList.add('hidden-for-k12');
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Hide "Career Assessment" quick action
      document.querySelectorAll('.quick-action-card').forEach(card => {
        const text = card.textContent || '';
        if (text.includes('Assessment') && !text.includes('Quiz')) {
          card.classList.add('hidden-for-k12');
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Hide "Explore Pathways" for K-8 (keep for high school)
      const uiTier = document.body.classList;
      if (uiTier.contains('ui-tier-k2') || uiTier.contains('ui-tier-elementary') || uiTier.contains('ui-tier-middle')) {
        document.querySelectorAll('.quick-action-card').forEach(card => {
          const text = card.textContent || '';
          if (text.includes('Pathway') || text.includes('pathway')) {
            card.classList.add('hidden-for-k12');
            card.setAttribute('aria-hidden', 'true');
          }
        });
      }

      console.log('[DashboardAdapter] Career content hidden for K-12 user');
    },

    /**
     * Show career content (for adults)
     */
    showCareerContent: function() {
      document.querySelectorAll('.hidden-for-k12').forEach(el => {
        el.classList.remove('hidden-for-k12');
        el.removeAttribute('aria-hidden');
      });
    },

    /**
     * Show K-12 specific content
     */
    showK12Content: function() {
      this.K12_ONLY_SELECTORS.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.classList.remove('hidden');
          el.classList.add('visible-for-k12');
        });
      });
    },

    /**
     * Hide K-12 specific content (for adults)
     */
    hideK12Content: function() {
      this.K12_ONLY_SELECTORS.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.classList.add('hidden');
        });
      });
    },

    /**
     * Apply grade-specific UI adaptations
     * @param {string} uiType - UI type
     * @param {string} gradeCode - Grade code (K, 1-12)
     */
    adaptUIForGrade: function(uiType, gradeCode) {
      // K-2: Larger text, buttons, simplified navigation
      if (uiType === 'early_childhood') {
        document.documentElement.style.setProperty('--font-size-base', '1.1rem');
        document.documentElement.style.setProperty('--btn-padding', '1rem 1.5rem');
      }

      // Update sidebar labels for younger users
      if (uiType === 'early_childhood' || uiType === 'childhood') {
        // Simplify navigation labels
        const navLabels = {
          'Dashboard': 'Home',
          'My Courses': 'My Lessons',
          'Progress & Assessments': 'My Progress',
          'Community & Support': 'Help'
        };

        document.querySelectorAll('.nav-menu-link span, .dashboard-card h3').forEach(el => {
          const text = el.textContent?.trim();
          if (navLabels[text]) {
            el.textContent = navLabels[text];
          }
        });
      }
    },

    /**
     * Update welcome message for K-12 students
     * @param {object} user - User object
     */
    updateWelcomeForK12: function(user) {
      const gradeLabel = user.gradeCode === 'K' ? 'Kindergarten' : `Grade ${user.gradeCode}`;

      // Update subtitle if exists
      const subtitle = document.querySelector('.portal-header .subtitle, .main-content > p');
      if (subtitle) {
        const originalText = subtitle.textContent || '';
        if (!originalText.includes('Grade')) {
          subtitle.textContent = `${gradeLabel} Student - ${originalText}`;
        }
      }

      // Add grade badge near user name
      const welcomeHeader = document.querySelector('.portal-header h1, .main-content > h1');
      if (welcomeHeader && !welcomeHeader.querySelector('.grade-badge')) {
        const badge = document.createElement('span');
        badge.className = 'grade-badge';
        badge.textContent = gradeLabel;
        badge.style.cssText = 'font-size: 0.6em; background: var(--color-primary); color: white; padding: 0.25em 0.5em; border-radius: 4px; margin-left: 0.5em; vertical-align: middle;';
        welcomeHeader.appendChild(badge);
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DashboardAdapter.init());
  } else {
    // DOM already loaded
    DashboardAdapter.init();
  }

  // Export for testing
  window.DashboardAdapter = DashboardAdapter;
})();
