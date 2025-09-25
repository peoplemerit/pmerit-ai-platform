// PMERIT Clean Mobile JavaScript

// State management
const PMERITApp = {
  isMenuOpen: false,
  authModalOpen: false,
  
  init() {
    this.setupEventListeners();
    this.setupChatInterface();
    console.log('PMERIT App initialized');
  },
  
  setupEventListeners() {
    // Hamburger menu toggle
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const sideMenu = document.querySelector('.side-menu');
    
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => this.toggleMenu());
    }
    
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => this.closeMenu());
    }
    
    // Auth modal handlers
    const signInBtns = document.querySelectorAll('.sign-in-btn, .menu-signin-btn');
    const authModal = document.querySelector('.auth-modal');
    const modalClose = document.querySelector('.modal-close');
    
    signInBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal();
      });
    });
    
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeAuthModal());
    }
    
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          this.closeAuthModal();
        }
      });
    }
    
    // Toggle switches
    document.querySelectorAll('.modern-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        console.log('Toggle changed:', e.target.id, e.target.checked);
      });
    });
    
    // Action buttons
    document.querySelectorAll('.action-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        console.log('Action clicked:', action);
      });
    });
    
    // Collapsible sections
    document.querySelectorAll('.collapsible-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = content.classList.contains('open');
        
        // Close all other collapsibles
        document.querySelectorAll('.collapsible-content').forEach(c => {
          c.classList.remove('open');
        });
        
        // Toggle current one
        if (!isOpen) {
          content.classList.add('open');
        }
      });
    });
    
    // Dashboard button
    const dashboardBtn = document.querySelector('.dashboard-btn');
    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', () => {
        console.log('Dashboard clicked');
      });
    }
    
    // Grid menu button
    const gridMenuBtn = document.querySelector('.grid-menu-btn');
    if (gridMenuBtn) {
      gridMenuBtn.addEventListener('click', () => {
        console.log('Grid menu clicked - reserved for future apps');
      });
    }
    
    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
        this.closeAuthModal();
      }
    });
  },
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateMenuState();
  },
  
  closeMenu() {
    this.isMenuOpen = false;
    this.updateMenuState();
  },
  
  updateMenuState() {
    const menuOverlay = document.querySelector('.menu-overlay');
    const sideMenu = document.querySelector('.side-menu');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    if (this.isMenuOpen) {
      menuOverlay?.classList.add('active');
      sideMenu?.classList.add('active');
      hamburgerBtn?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      menuOverlay?.classList.remove('active');
      sideMenu?.classList.remove('active');
      hamburgerBtn?.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  
  openAuthModal() {
    this.authModalOpen = true;
    const authModal = document.querySelector('.auth-modal');
    if (authModal) {
      authModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeAuthModal() {
    this.authModalOpen = false;
    const authModal = document.querySelector('.auth-modal');
    if (authModal) {
      authModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },
  
  setupChatInterface() {
    const chatInput = document.querySelector('#chatInput');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatInput || !sendBtn) return;
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
    
    // Send message
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      this.addChatMessage('user', message);
      
      // Clear input
      chatInput.value = '';
      chatInput.style.height = 'auto';
      
      // Simulate AI response
      setTimeout(() => {
        this.addChatMessage('ai', 'Hello! I\'m PMERIT AI. How can I help you today?');
      }, 1000);
    };
    
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  },
  
  addChatMessage(sender, message) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.style.cssText = `
      margin-bottom: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      ${sender === 'user' 
        ? 'background: rgba(37, 99, 235, 0.8); color: white; margin-left: 2rem; text-align: right;' 
        : 'background: rgba(255, 255, 255, 0.2); color: white; margin-right: 2rem;'
      }
    `;
    
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PMERITApp.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    console.log('Page hidden');
  } else {
    // Page is visible
    console.log('Page visible');
  }
});

// Handle resize events
window.addEventListener('resize', () => {
  // Close menu on resize to desktop
  if (window.innerWidth > 768 && PMERITApp.isMenuOpen) {
    PMERITApp.closeMenu();
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PMERITApp;
}