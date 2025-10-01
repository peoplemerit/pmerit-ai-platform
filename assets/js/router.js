// Navigation loader and mobile hamburger menu functionality
// This handles dynamic loading of partials and mobile navigation behavior

class NavigationManager {
  constructor() {
    this.hamburgerToggle = null;
    this.hamburgerMenu = null;
    this.isMenuOpen = false;
  }

  // Load navigation partial
  async loadNavigation() {
    try {
      const response = await fetch('partials/nav.html');
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      const html = await response.text();
      
      const container = document.getElementById('header-container');
      if (container) {
        container.innerHTML = html;
        this.initializeHamburgerMenu();
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
      // Fallback navigation if partial loading fails
      this.createFallbackNavigation();
    }
  }

  // Load footer partial
  async loadFooter() {
    try {
      const response = await fetch('partials/footer.html');
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      const html = await response.text();
      
      const container = document.getElementById('footer-container');
      if (container) {
        container.innerHTML = html;
        
        // Initialize footer button functionality
        this.initFooterButtons();
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }

  // Initialize footer button event listeners
  initFooterButtons() {
    const privacyBtn = document.getElementById('privacyBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (privacyBtn) {
      privacyBtn.addEventListener('click', function() {
        window.location.href = 'privacy.html';
      });
    }

    if (settingsBtn) {
      settingsBtn.addEventListener('click', function() {
        alert('Settings functionality will be implemented here');
      });
    }
  }

  // Initialize hamburger menu functionality
  initializeHamburgerMenu() {
    this.hamburgerToggle = document.querySelector('.hamburger-toggle');
    this.hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (this.hamburgerToggle && this.hamburgerMenu) {
      this.hamburgerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && 
            !this.hamburgerMenu.contains(e.target) && 
            !this.hamburgerToggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMenu();
        }
      });

      // Handle menu item clicks on mobile
      const menuItems = this.hamburgerMenu.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth < 768) {
            this.closeMenu();
          }
        });
      });
    }
  }

  // Toggle menu open/closed
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  // Open hamburger menu
  openMenu() {
    if (this.hamburgerMenu) {
      this.hamburgerMenu.classList.add('open');
      this.hamburgerMenu.removeAttribute('hidden');
      this.hamburgerToggle.setAttribute('aria-expanded', 'true');
      this.isMenuOpen = true;
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }
  }

  // Close hamburger menu
  closeMenu() {
    if (this.hamburgerMenu) {
      this.hamburgerMenu.classList.remove('open');
      this.hamburgerMenu.setAttribute('hidden', '');
      this.hamburgerToggle.setAttribute('aria-expanded', 'false');
      this.isMenuOpen = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  // Fallback navigation if partial loading fails
  createFallbackNavigation() {
    const container = document.getElementById('header-container');
    if (container) {
      container.innerHTML = '<nav class="mobile-nav"><div class="nav-primary"><div class="logo">PMERIT</div><div class="nav-actions"><select class="language-switcher" aria-label="Select Language"><option value="en">English</option><option value="yo">Yor�b�</option><option value="ig">Igbo</option><option value="ha">Hausa</option></select><button class="cta-primary">Sign Up</button><button class="hamburger-toggle" aria-label="Menu"></button></div></div></nav>';
      this.initializeHamburgerMenu();
    }
  }

  // Handle window resize
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const navManager = new NavigationManager();
  navManager.loadNavigation();
  navManager.loadFooter();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    navManager.handleResize();
  });
});

// Export for potential use in other modules
window.NavigationManager = NavigationManager;
