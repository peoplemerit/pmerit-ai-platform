// PMERIT Boot and Includes System
// This file handles dynamic loading and initialization

class PMERITBootstrap {
  constructor() {
    this.loadedModules = new Set();
    this.init();
  }

  init() {
    this.loadFonts();
    this.loadIcons();
    this.initializeAccessibility();
    this.setupGlobalErrorHandling();
  }

  loadFonts() {
    // Preload Inter font family
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }

  loadIcons() {
    // Load Font Awesome icons
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    document.head.appendChild(iconLink);
  }

  initializeAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const main = document.querySelector('main');
    if (main) {
      main.id = 'main-content';
    }

    // Enhance focus visibility
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
      .focus-visible {
        outline: 2px solid var(--primary) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(focusStyle);
  }

  setupGlobalErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('PMERIT Error:', event.error);
      this.showErrorNotification('An unexpected error occurred. Please refresh the page.');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('PMERIT Promise Rejection:', event.reason);
      this.showErrorNotification('A network error occurred. Please check your connection.');
    });
  }

  showErrorNotification(message) {
    // Create simple error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #EF4444;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      max-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  async loadModule(moduleName, moduleUrl) {
    if (this.loadedModules.has(moduleName)) {
      return true;
    }
