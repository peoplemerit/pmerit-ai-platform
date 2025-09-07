/**
 * PMERIT AI Platform - Boot Includes System
 * Loads shared partials and initializes core functionality
 * Version: 2.2 - Enhanced Navigation Toggles
 */

class PMERITBootSystem {
  constructor() {
    this.config = {
      partials: {
        header: '/partials/header.html',
        nav: '/partials/nav.html', 
        footer: '/partials/footer.html'
      },
      containers: {
        header: '#header-container',
        nav: '#nav-container',
        footer: '#footer-container'
      },
      endpoints: {
        ai: 'https://ai.pmerit.com',
        api: '/api'
      }
    };
    
    this.retryCount = 0;
    this.maxRetries = 3;
    this.initialized = false;
    this.navigationInitialized = false;
  }

  /**
   * Enhanced fetch with retry logic and CORS handling
   */
  async fetchWithRetry(url, options = {}) {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json',
        'Cache-Control': 'no-cache'
      },
      ...options
    };

    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        console.log(`[PMERIT] Fetching: ${url} (attempt ${i + 1})`);
        
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
        
      } catch (error) {
        console.warn(`[PMERIT] Fetch attempt ${i + 1} failed:`, error.message);
        
        if (i === this.maxRetries) {
          console.error(`[PMERIT] All fetch attempts failed for ${url}:`, error);
          throw error;
        }
        
        // Progressive backoff
        await this.delay(Math.pow(2, i) * 1000);
      }
    }
  }

  /**
   * Load HTML partial into container
   */
  async loadPartial(partialName, containerId) {
    try {
      const container = document.querySelector(containerId);
      
      if (!container) {
        console.error(`[PMERIT] Container not found: ${containerId}`);
        return false;
      }

      const partialUrl = this.config.partials[partialName];
      
      if (!partialUrl) {
        console.error(`[PMERIT] Partial not configured: ${partialName}`);
        return false;
      }

      console.log(`[PMERIT] Loading ${partialName} into ${containerId}`);
      
      const content = await this.fetchWithRetry(partialUrl);
      container.innerHTML = content;
      
      // Initialize navigation after nav partial loads
      if (partialName === 'nav') {
        setTimeout(() => this.initializeNavigation(), 100);
      }
      
      console.log(`[PMERIT] ✓ Loaded ${partialName} successfully`);
      return true;
      
    } catch (error) {
      console.error(`[PMERIT] Failed to load ${partialName}:`, error);
      
      // Provide fallback content
      const container = document.querySelector(containerId);
      if (container) {
        container.innerHTML = this.getFallbackContent(partialName);
      }
      
      return false;
    }
  }

  /**
   * Provide fallback content for failed partial loads
   */
  getFallbackContent(partialName) {
    const fallbacks = {
      header: `
        <header class="header">
          <div class="header-content">
            <div class="header-brand">
              <h1>🎓 PMERIT AI</h1>
              <span>Accessible Global Education</span>
            </div>
            <div class="header-actions">
              <button class="btn btn-outline">Sign In</button>
              <button class="btn btn-primary">Start Learning</button>
            </div>
          </div>
        </header>
      `,
      nav: `
        <nav class="sidebar">
          <div class="nav-section">
            <h3>🚀 Quick Actions</h3>
            <ul>
              <li><button class="nav-btn">Virtual Human Mode</button></li>
              <li><button class="nav-btn">Career Paths</button></li>
              <li><button class="nav-btn">Customer Service</button></li>
            </ul>
          </div>
        </nav>
      `,
      footer: `
        <footer class="footer">
          <div class="footer-content">
            <div class="system-status">
              <span class="status-indicator online">🟢 System Online</span>
              <span>PMERIT AI Platform v1.0</span>
            </div>
            <div class="footer-links">
              <a href="/support">Support</a>
              <a href="/privacy">Privacy</a>
              <a href="/about">About</a>
            </div>
          </div>
        </footer>
      `
    };
    
    return fallbacks[partialName] || '<div>Content unavailable</div>';
  }

  /**
   * Initialize navigation functionality
   */
  initializeNavigation() {
    if (this.navigationInitialized) {
      console.log('[PMERIT] Navigation already initialized');
      return;
    }

    console.log('[PMERIT] Initializing navigation functionality...');

    // Initialize toggle switches
    this.initToggleSwitches();
    
    // Initialize settings collapsible
    this.initSettingsToggle();
    
    // Initialize career tracks functionality
    this.initCareerTracks();
    
    // Initialize dashboard functionality
    this.initDashboardButton();
    
    // Initialize other buttons
    this.initOtherButtons();
    
    // Load saved states
    this.loadSavedStates();
    
    // Initialize role-based visibility
    this.updateRoleVisibility();

    this.navigationInitialized = true;
    console.log('[PMERIT] ✓ Navigation functionality initialized');
  }

  /**
   * Initialize toggle switches functionality
   */
  initToggleSwitches() {
    const switches = document.querySelectorAll('.switch');
    
    switches.forEach(switchEl => {
      switchEl.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const isActive = switchEl.classList.contains('active');
        switchEl.classList.toggle('active');
        switchEl.setAttribute('aria-checked', !isActive);
        
        // Handle specific toggle actions
        this.handleSwitchToggle(switchEl.id, !isActive);
        
        // Save state
        localStorage.setItem(`pmerit_${switchEl.id}`, !isActive);
        
        console.log(`[PMERIT] Toggle ${switchEl.id}: ${!isActive}`);
      });
    });
  }

  /**
   * Handle specific switch toggle actions
   */
  handleSwitchToggle(switchId, isActive) {
    switch (switchId) {
      case 'vhModeSwitch':
        this.toggleVirtualHuman(isActive);
        break;
      case 'customerServiceSwitch':
        this.toggleCustomerService(isActive);
        break;
      case 'darkModeSwitch':
        this.toggleDarkMode(isActive);
        break;
      case 'ttsSwitch':
        this.toggleTTS(isActive);
        break;
    }
  }

  /**
   * Toggle Virtual Human Mode
   */
  toggleVirtualHuman(active) {
    const badge = document.getElementById('virtualHumanBadge');
    const interface = document.getElementById('virtualHumanInterface');
    const chatArea = document.querySelector('.chat-container') || document.querySelector('#chat-container');
    
    if (active) {
      if (badge) badge.style.display = 'flex';
      if (interface) interface.style.display = 'block';
      if (chatArea) chatArea.style.display = 'none';
      
      console.log('[PMERIT] Virtual Human Mode activated');
    } else {
      if (badge) badge.style.display = 'none';
      if (interface) interface.style.display = 'none';
      if (chatArea) chatArea.style.display = 'block';
      
      console.log('[PMERIT] Virtual Human Mode deactivated');
    }
  }

  /**
   * Toggle Customer Service Mode
   */
  toggleCustomerService(active) {
    const badge = document.getElementById('supportAssistantBadge');
    const aiGreeting = document.querySelector('.ai-message') || document.querySelector('.chat-message');
    
    if (active) {
      if (badge) badge.style.display = 'flex';
      if (aiGreeting) {
        aiGreeting.textContent = 'Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?';
      }
      
      console.log('[PMERIT] Customer Service Mode activated');
    } else {
      if (badge) badge.style.display = 'none';
      if (aiGreeting) {
        aiGreeting.textContent = 'Welcome to PMERIT! I\'m here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?';
      }
      
      console.log('[PMERIT] Customer Service Mode deactivated');
    }
  }

  /**
   * Toggle Dark Mode
   */
  toggleDarkMode(active) {
    document.body.classList.toggle('dark-mode', active);
    console.log(`[PMERIT] Dark Mode: ${active ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle Text-to-Speech
   */
  toggleTTS(active) {
    // TTS functionality would be implemented here
    console.log(`[PMERIT] Text-to-Speech: ${active ? 'enabled' : 'disabled'}`);
  }

  /**
   * Initialize settings collapsible
   */
  initSettingsToggle() {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsContent = document.getElementById('settingsContent');
    
    if (settingsToggle && settingsContent) {
      settingsToggle.addEventListener('click', (event) => {
        event.preventDefault();
        
        const isExpanded = settingsToggle.getAttribute('aria-expanded') === 'true';
        
        settingsToggle.setAttribute('aria-expanded', !isExpanded);
        settingsContent.style.display = isExpanded ? 'none' : 'block';
        
        const toggleIcon = settingsToggle.querySelector('.toggle-icon');
        if (toggleIcon) {
          toggleIcon.classList.toggle('rotated', !isExpanded);
        }
        
        console.log(`[PMERIT] Settings: ${!isExpanded ? 'expanded' : 'collapsed'}`);
      });
    }
  }

  /**
   * Initialize career tracks functionality
   */
  initCareerTracks() {
    const careerBtn = document.getElementById('careerTracksBtn');
    const overlay = document.getElementById('careerTracksOverlay');
    const closeBtn = document.getElementById('closeCareerTracks');
    
    if (careerBtn && overlay) {
      careerBtn.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.style.display = 'flex';
        console.log('[PMERIT] Career tracks overlay opened');
      });
    }
    
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.style.display = 'none';
        console.log('[PMERIT] Career tracks overlay closed');
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          overlay.style.display = 'none';
          console.log('[PMERIT] Career tracks overlay closed (backdrop click)');
        }
      });
    }
  }

  /**
   * Initialize dashboard button functionality
   */
  initDashboardButton() {
    const dashboardBtn = document.getElementById('dashboardBtn');
    
    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const isAuthenticated = localStorage.getItem('pmerit_authenticated') === 'true';
        
        if (isAuthenticated) {
          // Navigate to dashboard
          window.location.href = '/dashboard.html';
        } else {
          // Show sign-up prompt for guest users
          this.showSignUpPrompt();
        }
      });
    }
  }

  /**
   * Initialize other navigation buttons
   */
  initOtherButtons() {
    // Preview Voices button
    const previewVoicesBtn = document.getElementById('previewVoicesBtn');
    if (previewVoicesBtn) {
      previewVoicesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('[PMERIT] Preview voices clicked');
        // Voice preview functionality would be implemented here
      });
    }
  }

  /**
   * Show sign-up prompt for guest users
   */
  showSignUpPrompt() {
    const message = 'Please sign up to access your personalized dashboard with courses, career center, and learning progress.';
    
    // Try to use existing modal system first
    if (window.PMERIT && window.PMERIT.auth && window.PMERIT.auth.showSignUp) {
      window.PMERIT.auth.showSignUp();
    } else {
      // Fallback to alert and redirect
      alert(message);
      window.location.href = '/signup.html';
    }
  }

  /**
   * Load saved toggle states
   */
  loadSavedStates() {
    const switches = document.querySelectorAll('.switch');
    
    switches.forEach(switchEl => {
      const savedState = localStorage.getItem(`pmerit_${switchEl.id}`);
      if (savedState === 'true') {
        switchEl.classList.add('active');
        switchEl.setAttribute('aria-checked', 'true');
        
        // Apply the saved state
        this.handleSwitchToggle(switchEl.id, true);
      }
    });
  }

  /**
   * Role-based visibility
   */
  updateRoleVisibility() {
    const isAuthenticated = localStorage.getItem('pmerit_authenticated') === 'true';
    
    document.querySelectorAll('.guest-only').forEach(el => {
      el.style.display = isAuthenticated ? 'none' : 'block';
    });
    
    document.querySelectorAll('.authenticated-only').forEach(el => {
      el.style.display = isAuthenticated ? 'block' : 'none';
    });
  }

  /**
   * Health check for AI service with CORS handling
   */
  async healthCheck() {
    try {
      const healthUrl = `${this.config.endpoints.ai}/api/health`;
      console.log(`[PMERIT] Health check: ${healthUrl}`);
      
      // Use different approach for CORS-restricted endpoints
      const response = await this.fetchWithRetry(healthUrl, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('[PMERIT] ✓ AI service healthy:', response);
      this.updateConnectionStatus('online');
      return true;
      
    } catch (error) {
      console.warn('[PMERIT] AI service health check failed:', error.message);
      
      // Don't treat CORS errors as fatal - service may be working
      if (error.message.includes('CORS')) {
        console.log('[PMERIT] CORS restriction detected - assuming service is operational');
        this.updateConnectionStatus('cors-restricted');
      } else {
        this.updateConnectionStatus('offline');
      }
      
      return false;
    }
  }

  /**
   * Update connection status indicators
   */
  updateConnectionStatus(status) {
    const indicators = document.querySelectorAll('.connection-status, .status-indicator');
    
    indicators.forEach(indicator => {
      indicator.classList.remove('online', 'offline', 'cors-restricted');
      indicator.classList.add(status);
      
      const statusText = {
        'online': '🟢 Connected to Educational Services',
        'cors-restricted': '🟡 Services Available (CORS Limited)',
        'offline': '🔴 Connection Issues'
      };
      
      const textElement = indicator.querySelector('span') || indicator;
      if (textElement.textContent.includes('Connected') || textElement.textContent.includes('Services')) {
        textElement.textContent = statusText[status];
      }
    });
  }

  /**
   * Initialize speech synthesis safely
   */
  initializeSpeech() {
    if (!window.speechSynthesis) {
      console.log('[PMERIT] Speech synthesis not supported');
      return;
    }

    // Only initialize on user interaction to avoid deprecation warning
    document.addEventListener('click', () => {
      if (!this.speechInitialized) {
        console.log('[PMERIT] Speech synthesis ready for user interaction');
        this.speechInitialized = true;
      }
    }, { once: true });
  }

  /**
   * Initialize form accessibility
   */
  initializeAccessibility() {
    // Fix label associations
    const labels = document.querySelectorAll('label[for]');
    labels.forEach(label => {
      const targetId = label.getAttribute('for');
      const target = document.getElementById(targetId);
      
      if (!target) {
        console.warn(`[PMERIT] Label references missing element: ${targetId}`);
        // Try to find nearby input and associate it
        const nearbyInput = label.nextElementSibling || label.previousElementSibling;
        if (nearbyInput && nearbyInput.tagName === 'INPUT') {
          const newId = targetId || `input-${Date.now()}`;
          nearbyInput.id = newId;
          label.setAttribute('for', newId);
          console.log(`[PMERIT] Fixed label association: ${newId}`);
        }
      }
    });

    // Ensure proper ARIA labels
    const interactiveElements = document.querySelectorAll('button, input, select, textarea');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const text = element.textContent || element.placeholder || element.title;
        if (text) {
          element.setAttribute('aria-label', text.trim());
        }
      }
    });
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Main initialization function
   */
  async initialize() {
    if (this.initialized) {
      console.log('[PMERIT] Boot system already initialized');
      return;
    }

    console.log('[PMERIT] Initializing boot system...');

    try {
      // Load all partials in parallel
      const loadPromises = [
        this.loadPartial('header', this.config.containers.header),
        this.loadPartial('nav', this.config.containers.nav),
        this.loadPartial('footer', this.config.containers.footer)
      ];

      const results = await Promise.allSettled(loadPromises);
      
      // Log results
      results.forEach((result, index) => {
        const partialName = ['header', 'nav', 'footer'][index];
        if (result.status === 'fulfilled') {
          console.log(`[PMERIT] ✓ ${partialName} loaded successfully`);
        } else {
          console.error(`[PMERIT] ✗ ${partialName} failed:`, result.reason);
        }
      });

      // Initialize other systems
      this.initializeSpeech();
      this.initializeAccessibility();
      
      // Perform health check (non-blocking)
      this.healthCheck().catch(err => {
        console.log('[PMERIT] Health check completed with warnings');
      });

      this.initialized = true;
      console.log('[PMERIT] ✓ Boot system initialization complete');
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('pmerit:initialized', {
        detail: { timestamp: Date.now() }
      }));

    } catch (error) {
      console.error('[PMERIT] Boot system initialization failed:', error);
    }
  }
}

// Initialize when DOM is ready
const PMERIT = new PMERITBootSystem();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => PMERIT.initialize(), 100);
  });
} else {
  setTimeout(() => PMERIT.initialize(), 100);
}

// Export for global access
window.PMERIT = PMERIT;

// Additional DOM ready initialization for immediate functionality
document.addEventListener('DOMContentLoaded', function() {
  // Retry navigation initialization if nav partial is already loaded
  setTimeout(() => {
    if (document.getElementById('settingsToggle') && !PMERIT.navigationInitialized) {
      PMERIT.initializeNavigation();
    }
  }, 500);
});

console.log('[PMERIT] Boot includes system loaded');
