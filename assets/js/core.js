/**
 * PMERIT Core JavaScript Module
 * Connection status and mobile footer functionality
 */

(function(window, document) {
  'use strict';

  // Connection status manager
  const ConnectionStatus = {
    states: {
      CONNECTED: 'connected',
      CONNECTING: 'connecting',
      DISCONNECTED: 'disconnected'
    },

    currentState: 'connected',
    
    // DOM elements
    elements: {
      statusText: null,
      statusDot: null,
      statusIndicator: null
    },

    // Initialize connection status functionality
    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.bindElements());
      } else {
        this.bindElements();
      }
    },

    // Bind DOM elements
    bindElements() {
      this.elements.statusText = document.getElementById('statusText');
      this.elements.statusDot = document.getElementById('statusDot');
      this.elements.statusIndicator = document.getElementById('footerStatus')?.querySelector('.status-indicator');
      
      if (this.elements.statusText && this.elements.statusDot) {
        this.startConnectionMonitoring();
      }
    },

    // Update status display
    updateStatus(state, message) {
      if (!this.elements.statusText || !this.elements.statusIndicator) return;

      this.currentState = state;
      this.elements.statusText.textContent = message;

      // Remove all state classes
      Object.values(this.states).forEach(stateClass => {
        this.elements.statusIndicator.classList.remove(stateClass);
      });

      // Add current state class
      this.elements.statusIndicator.classList.add(state);

      // Log status change for debugging
      console.log(`Connection status: ${state} - ${message}`);
    },

    // Simulate connection monitoring
    startConnectionMonitoring() {
      // Initial status
      this.updateStatus(this.states.CONNECTED, 'Connected to Educational Services');

      // Simulate periodic connection checks
      setInterval(() => {
        this.checkConnection();
      }, 30000); // Check every 30 seconds

      // Listen for online/offline events
      window.addEventListener('online', () => {
        this.updateStatus(this.states.CONNECTED, 'Connected to Educational Services');
      });

      window.addEventListener('offline', () => {
        this.updateStatus(this.states.DISCONNECTED, 'Connection lost - Offline mode');
      });
    },

    // Check connection status
    checkConnection() {
      if (!navigator.onLine) {
        this.updateStatus(this.states.DISCONNECTED, 'Connection lost - Offline mode');
        return;
      }

      // Simple connectivity test using a small request
      this.updateStatus(this.states.CONNECTING, 'Checking connection...');

      // Simulate connection check with timeout
      const checkPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
        
        // Try to fetch a small resource or ping endpoint
        fetch('/favicon.ico', { 
          method: 'HEAD', 
          cache: 'no-cache',
          mode: 'no-cors'
        })
        .then(() => {
          clearTimeout(timeout);
          resolve();
        })
        .catch(() => {
          clearTimeout(timeout);
          reject();
        });
      });

      checkPromise
        .then(() => {
          this.updateStatus(this.states.CONNECTED, 'Connected to Educational Services');
        })
        .catch(() => {
          this.updateStatus(this.states.DISCONNECTED, 'Connection issues detected');
        });
    },

    // Manual refresh connection
    refreshConnection() {
      this.checkConnection();
    }
  };

  // Mobile Footer Manager
  const MobileFooter = {
    elements: {
      footer: null,
      body: null
    },

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.bindElements());
      } else {
        this.bindElements();
      }
    },

    bindElements() {
      this.elements.footer = document.getElementById('mobileFooter');
      this.elements.body = document.body;

      if (this.elements.footer && this.elements.body) {
        this.setupLayout();
        this.bindEvents();
      }
    },

    setupLayout() {
      // Ensure body has mobile-layout class for proper spacing
      if (window.innerWidth <= 768) {
        this.elements.body.classList.add('mobile-layout');
      }
    },

    bindEvents() {
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
          this.elements.body.classList.add('mobile-layout');
        } else {
          this.elements.body.classList.remove('mobile-layout');
        }
      });

      // Handle keyboard show/hide on mobile devices
      if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', () => {
          this.handleKeyboardToggle();
        });
      }

      // Fallback for older browsers - detect height changes
      let initialViewportHeight = window.innerHeight;
      window.addEventListener('resize', () => {
        if (Math.abs(window.innerHeight - initialViewportHeight) > 150) {
          this.handleKeyboardToggle();
        }
      });
    },

    handleKeyboardToggle() {
      if (!this.elements.footer) return;

      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const windowHeight = window.innerHeight;
      
      // If viewport height is significantly smaller than window height, keyboard is likely open
      if (viewportHeight < windowHeight - 150) {
        this.elements.footer.style.display = 'none';
      } else {
        this.elements.footer.style.display = '';
      }
    }
  };

  // Initialize modules when DOM is ready
  ConnectionStatus.init();
  MobileFooter.init();

  // Expose public API
  window.PMERIT = window.PMERIT || {};
  window.PMERIT.ConnectionStatus = ConnectionStatus;
  window.PMERIT.MobileFooter = MobileFooter;

})(window, document);

// Footer link analytics (optional)
document.addEventListener('DOMContentLoaded', function() {
  const footerLinks = document.querySelectorAll('.footer-link');
  
  footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const linkText = this.querySelector('span')?.textContent || 'Unknown';
      const linkHref = this.getAttribute('href') || '#';
      
      // Log footer link clicks for analytics
      console.log(`Footer link clicked: ${linkText} (${linkHref})`);
      
      // Add any analytics tracking here
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'footer',
          'event_label': linkText,
          'value': linkHref
        });
      }
    });
  });
});