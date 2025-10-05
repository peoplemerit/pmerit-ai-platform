/**
 * router.js
 * Navigation manager for handling partials and menu interactions
 */

class NavigationManager {
  constructor() {
    this.menuOpen = false;
    this.hamburgerBtn = null;
    this.mobileMenu = null;
    this.menuCloseBtn = null;
    this.menuOverlay = null;
    this.init();
  }

  init() {
    // Wait for partials to load before initializing
    document.addEventListener('partials-loaded', () => {
      this.initializeElements();
      this.initializeHamburgerMenu();
      this.initializeEventListeners();
    });
  }

  initializeElements() {
    this.hamburgerBtn = document.getElementById('hamburgerMenu');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.menuCloseBtn = document.getElementById('menuCloseBtn');
    
    // Create overlay if it doesn't exist
    if (!document.getElementById('menu-overlay')) {
      this.menuOverlay = document.createElement('div');
      this.menuOverlay.id = 'menu-overlay';
      this.menuOverlay.className = 'menu-overlay';
      this.menuOverlay.style.display = 'none';
      this.menuOverlay.style.position = 'fixed';
      this.menuOverlay.style.top = '0';
      this.menuOverlay.style.left = '0';
      this.menuOverlay.style.width = '100%';
      this.menuOverlay.style.height = '100%';
      this.menuOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      this.menuOverlay.style.zIndex = '1100';
      document.body.appendChild(this.menuOverlay);
    } else {
      this.menuOverlay = document.getElementById('menu-overlay');
    }
  }

  initializeHamburgerMenu() {
    if (!this.hamburgerBtn || !this.mobileMenu) {
      console.warn('Hamburger menu elements not found');
      return;
    }

    // Hamburger button click
    this.hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close button click
    if (this.menuCloseBtn) {
      this.menuCloseBtn.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Overlay click to close
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menuOpen) {
        this.closeMenu();
      }
    });
  }

  initializeEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Sign-in button in nav
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        this.closeMenu();
        // Trigger sign-in modal if it exists
        const event = new CustomEvent('show-auth-modal');
        document.dispatchEvent(event);
      });
    }

    // Menu sign-in/sign-up buttons
    const menuSignIn = document.getElementById('menuSignIn');
    const menuSignUp = document.getElementById('menuSignUp');
    
    if (menuSignIn) {
      menuSignIn.addEventListener('click', () => {
        this.closeMenu();
        const event = new CustomEvent('show-auth-modal', { detail: { mode: 'signin' } });
        document.dispatchEvent(event);
      });
    }

    if (menuSignUp) {
      menuSignUp.addEventListener('click', () => {
        this.closeMenu();
        const event = new CustomEvent('show-auth-modal', { detail: { mode: 'signup' } });
        document.dispatchEvent(event);
      });
    }

    // Language switcher sync
    const langSelect = document.getElementById('lang');
    const mobileLangSelect = document.getElementById('mobileLang');
    
    if (langSelect && mobileLangSelect) {
      langSelect.addEventListener('change', (e) => {
        mobileLangSelect.value = e.target.value;
      });
      mobileLangSelect.addEventListener('change', (e) => {
        langSelect.value = e.target.value;
      });
    }
  }

  toggleMenu() {
    if (this.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.mobileMenu) return;
    
    this.menuOpen = true;
    this.mobileMenu.style.display = 'block';
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    
    if (this.menuOverlay) {
      this.menuOverlay.style.display = 'block';
    }
    
    if (this.hamburgerBtn) {
      this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    if (!this.mobileMenu) return;
    
    this.menuOpen = false;
    this.mobileMenu.style.display = 'none';
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    
    if (this.menuOverlay) {
      this.menuOverlay.style.display = 'none';
    }
    
    if (this.hamburgerBtn) {
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleResize() {
    // Close menu on desktop
    if (window.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }
}

// Initialize navigation manager
if (typeof window !== 'undefined') {
  window.NavigationManager = NavigationManager;
  
  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.navManager = new NavigationManager();
    });
  } else {
    window.navManager = new NavigationManager();
  }
}
