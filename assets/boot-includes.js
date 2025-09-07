/**
 * PMERIT AI Platform - Boot Includes System
 * Loads shared partials and initializes core functionality
 * Version: 2.1 - CORS & Container Fix
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

// Settings Collapsible
document.getElementById('settingsToggle')?.addEventListener('click', function() {
  const content = document.getElementById('settingsContent');
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  
  this.setAttribute('aria-expanded', !isExpanded);
  content.style.display = isExpanded ? 'none' : 'block';
  
  const icon = this.querySelector('i');
  icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Switch Toggle Functionality
function initSwitches() {
  document.querySelectorAll('.switch').forEach(switchEl => {
    switchEl.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      this.classList.toggle('active');
      this.setAttribute('aria-checked', !isActive);
      
      // Store setting in localStorage
      if (this.id) {
        localStorage.setItem(`pmerit_${this.id}`, !isActive);
      }
    });
  });
}

// Role-based Visibility
function updateRoleVisibility() {
  const isAuthenticated = localStorage.getItem('pmerit_authenticated') === 'true';
  
  document.querySelectorAll('.guest-only').forEach(el => {
    el.style.display = isAuthenticated ? 'none' : 'block';
  });
  
  document.querySelectorAll('.authenticated-only').forEach(el => {
    el.style.display = isAuthenticated ? 'block' : 'none';
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  initSwitches();
  updateRoleVisibility();
});
