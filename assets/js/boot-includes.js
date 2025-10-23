/**
 * PMERIT Boot Includes
 * Version: 1.0
 * Last Updated: October 2025
 * 
 * Handles loading of shared partials (header, footer, nav)
 * and initializes sign-in functionality
 */

(function() {
  'use strict';

  // ========== CONFIGURATION ==========
  const CONFIG = {
    PARTIALS_PATH: 'partials/',
    CONTAINERS: {
      nav: 'nav-container',
      footer: 'footer-container'
    }
  };

  // ========== LOAD PARTIAL HTML ==========
  async function loadPartial(partialName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container #${containerId} not found`);
      return false;
    }

    try {
      const response = await fetch(`${CONFIG.PARTIALS_PATH}${partialName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load ${partialName}: ${response.status}`);
      }
      
      const html = await response.text();
      container.innerHTML = html;
      console.log(`✅ Loaded ${partialName}.html`);
      return true;
    } catch (error) {
      console.error(`❌ Error loading ${partialName}:`, error);
      return false;
    }
  }

  // ========== INITIALIZE SIGN-IN FUNCTIONALITY ==========
  function initializeSignIn() {
    // Add click handlers for sign-in buttons - using multiple selectors
    const signInButtonIds = [
      'sign-in-btn',       // Header sign-in button
      'menu-sign-in',      // Menu sign-in button
      'signInBtn',         // Mobile sign-in button (index.html)
      'desktopSignInBtn'   // Desktop sign-in button (index.html)
    ];

    // Also find buttons by class name as a fallback
    const signInButtonClasses = [
      '.sign-in-btn',
      '.btn-sign-in'
    ];

    let attachedCount = 0;

    // Try by ID first
    signInButtonIds.forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          openSignInModal();
        });
        console.log(`✅ Sign-in handler attached to #${buttonId}`);
        attachedCount++;
      }
    });

    // Try by class name as well
    signInButtonClasses.forEach(className => {
      const buttons = document.querySelectorAll(className);
      buttons.forEach(button => {
        // Check if already has event listener by checking a data attribute
        if (!button.dataset.signInInit) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            openSignInModal();
          });
          button.dataset.signInInit = 'true';
          console.log(`✅ Sign-in handler attached to ${className}`);
          attachedCount++;
        }
      });
    });

    if (attachedCount === 0) {
      console.warn('⚠️ No sign-in buttons found');
    }

    // Handle switch between sign-in and sign-up modals
    const switchToSignIn = document.getElementById('switch-to-sign-in');
    const switchToSignUp = document.getElementById('switch-to-sign-up');

    if (switchToSignIn) {
      switchToSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('sign-up-modal');
        openSignInModal();
      });
    }

    if (switchToSignUp) {
      switchToSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('sign-in-modal');
        openSignUpModal();
      });
    }
  }

  // ========== MODAL FUNCTIONS ==========
  function openSignInModal() {
    const modal = document.getElementById('sign-in-modal');
    if (modal) {
      modal.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      console.log('✅ Sign-in modal opened');
    } else {
      console.warn('⚠️ Sign-in modal not found, redirecting to signin.html');
      window.location.href = 'signin.html';
    }
  }

  function openSignUpModal() {
    const modal = document.getElementById('sign-up-modal');
    if (modal) {
      modal.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      console.log('✅ Sign-up modal opened');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('modal-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // ========== INITIALIZE MODAL CONTROLS ==========
  function initializeModalControls() {
    // Close buttons
    const closeButtons = [
      'sign-in-close',
      'sign-up-close'
    ];

    closeButtons.forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', () => {
          const modalId = buttonId.replace('-close', '-modal');
          closeModal(modalId);
        });
      }
    });

    // Backdrop clicks
    const backdrops = [
      { id: 'sign-in-backdrop', modal: 'sign-in-modal' },
      { id: 'sign-up-backdrop', modal: 'sign-up-modal' }
    ];

    backdrops.forEach(({ id, modal }) => {
      const backdrop = document.getElementById(id);
      if (backdrop) {
        backdrop.addEventListener('click', () => closeModal(modal));
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal('sign-in-modal');
        closeModal('sign-up-modal');
      }
    });
  }

  // ========== INITIALIZE FORM HANDLERS ==========
  function initializeFormHandlers() {
    const signInForm = document.getElementById('sign-in-form');
    const signUpForm = document.getElementById('sign-up-form');

    if (signInForm) {
      signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignIn(signInForm);
      });
    }

    if (signUpForm) {
      signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignUp(signUpForm);
      });
    }
  }

  function handleSignIn(form) {
    const email = form.querySelector('#sign-in-email').value;
    const password = form.querySelector('#sign-in-password').value;
    const rememberMe = form.querySelector('#remember-me')?.checked || false;

    console.log('Sign-in attempt:', { email, rememberMe });
    
    // TODO: Implement actual authentication
    alert('Sign-in functionality will be implemented with backend integration.\n\nEmail: ' + email);
    
    // For now, just close the modal
    closeModal('sign-in-modal');
  }

  function handleSignUp(form) {
    const name = form.querySelector('#sign-up-name').value;
    const email = form.querySelector('#sign-up-email').value;
    const password = form.querySelector('#sign-up-password').value;

    console.log('Sign-up attempt:', { name, email });
    
    // TODO: Implement actual registration
    alert('Sign-up functionality will be implemented with backend integration.\n\nName: ' + name + '\nEmail: ' + email);
    
    // For now, just close the modal
    closeModal('sign-up-modal');
  }

  // ========== INITIALIZE HAMBURGER MENU ==========
  function initializeHamburgerMenu() {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuCloseBtn = document.getElementById('menu-close-btn');

    if (!hamburgerToggle || !hamburgerMenu || !menuOverlay) {
      return;
    }

    // Open menu
    hamburgerToggle.addEventListener('click', () => {
      hamburgerMenu.setAttribute('aria-hidden', 'false');
      menuOverlay.setAttribute('aria-hidden', 'false');
      hamburgerToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    // Close menu
    const closeMenu = () => {
      hamburgerMenu.setAttribute('aria-hidden', 'true');
      menuOverlay.setAttribute('aria-hidden', 'true');
      hamburgerToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', closeMenu);
    }

    menuOverlay.addEventListener('click', closeMenu);

    // ESC key closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // ========== MAIN INITIALIZATION ==========
  async function init() {
    console.log('🚀 PMERIT Boot Includes initializing...');

    // Load partials
    const navLoaded = await loadPartial('header', CONFIG.CONTAINERS.nav);
    const footerLoaded = await loadPartial('footer', CONFIG.CONTAINERS.footer);

    // Wait a bit for DOM to settle after loading partials
    await new Promise(resolve => setTimeout(resolve, 200));

    // Initialize all components
    if (navLoaded) {
      initializeHamburgerMenu();
    }

    if (footerLoaded) {
      initializeModalControls();
      initializeFormHandlers();
    }

    // Initialize sign-in on ALL buttons (from index.html and from loaded partials)
    initializeSignIn();

    console.log('✅ PMERIT Boot Includes ready');
    
    // Dispatch custom event to signal initialization complete
    document.dispatchEvent(new CustomEvent('pmerit:initialized'));
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
