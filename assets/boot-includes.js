/**
 * PMERIT AI Platform - Boot Includes System
 * Dynamic partial loader and core application functionality
 * Follows Frontend Implementation Strategy.txt - DRY Principle
 * Version: 1.0.0
 */

(function() {
  'use strict';
  
  // ===== GLOBAL CONFIGURATION =====
  
  const CONFIG = {
    version: '1.0.0',
    buildDate: '2025-09-06',
    apiEndpoint: 'https://ai.pmerit.com',
    debug: localStorage.getItem('pmerit_debug') === 'true',
    partials: {
      header: '/partials/header.html',
      nav: '/partials/nav.html', 
      footer: '/partials/footer.html'
    },
    loadTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  };
  
  // ===== UTILITY FUNCTIONS =====
  
  /**
   * Logging utility with debug support
   */
  const log = {
    info: (msg, data) => CONFIG.debug && console.log(`[PMERIT] ${msg}`, data || ''),
    warn: (msg, data) => console.warn(`[PMERIT] ${msg}`, data || ''),
    error: (msg, error) => console.error(`[PMERIT] ${msg}`, error || ''),
    debug: (msg, data) => CONFIG.debug && console.debug(`[PMERIT] ${msg}`, data || '')
  };
  
  /**
   * Performance measurement utility
   */
  const perf = {
    start: (name) => CONFIG.debug && performance.mark(`${name}-start`),
    end: (name) => {
      if (!CONFIG.debug) return;
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        log.debug(`Performance: ${name}`, `${measure.duration.toFixed(2)}ms`);
      } catch (e) {
        log.debug(`Performance: ${name}`, 'measurement failed');
      }
    }
  };
  
  /**
   * Fetch with retry logic and timeout
   */
  async function fetchWithRetry(url, options = {}, attempts = CONFIG.retryAttempts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.loadTimeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempts > 1 && !controller.signal.aborted) {
        log.warn(`Fetch failed for ${url}, retrying... (${attempts - 1} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        return fetchWithRetry(url, options, attempts - 1);
      }
      
      throw error;
    }
  }
  
  /**
   * DOM ready utility
   */
  function domReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  
  /**
   * Debounce utility
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // ===== PARTIAL LOADER SYSTEM =====
  
  /**
   * Load and inject HTML partial
   */
  async function loadPartial(partialName, targetSelector) {
    const startTime = `load-partial-${partialName}`;
    perf.start(startTime);
    
    try {
      log.info(`Loading partial: ${partialName}`);
      
      const target = document.querySelector(targetSelector);
      if (!target) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }
      
      // Show loading state
      target.innerHTML = `
        <div class="partial-loading" role="status" aria-live="polite">
          <div class="loading-spinner"></div>
          <span class="sr-only">Loading ${partialName}...</span>
        </div>
      `;
      
      const partialUrl = CONFIG.partials[partialName];
      if (!partialUrl) {
        throw new Error(`Unknown partial: ${partialName}`);
      }
      
      const response = await fetchWithRetry(partialUrl);
      const html = await response.text();
      
      // Inject the HTML
      target.innerHTML = html;
      
      // Execute any scripts in the partial
      const scripts = target.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        script.parentNode.replaceChild(newScript, script);
      });
      
      // Dispatch loaded event
      const event = new CustomEvent('partialLoaded', {
        detail: { partialName, targetSelector, element: target }
      });
      document.dispatchEvent(event);
      
      log.info(`Partial loaded successfully: ${partialName}`);
      perf.end(startTime);
      
      return target;
      
    } catch (error) {
      log.error(`Failed to load partial: ${partialName}`, error);
      
      // Show error state
      const target = document.querySelector(targetSelector);
      if (target) {
        target.innerHTML = `
          <div class="partial-error" role="alert">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <span>Failed to load ${partialName}</span>
            <button type="button" class="btn btn-sm btn-outline" onclick="PMERIT.reloadPartial('${partialName}', '${targetSelector}')">
              Retry
            </button>
          </div>
        `;
      }
      
      perf.end(startTime);
      throw error;
    }
  }
  
  /**
   * Load all configured partials
   */
  async function loadAllPartials() {
    const startTime = 'load-all-partials';
    perf.start(startTime);
    
    log.info('Loading all partials...');
    
    const partialTargets = [
      { name: 'header', selector: '#header-container, header-container' },
      { name: 'nav', selector: '#nav-container, nav-container' },
      { name: 'footer', selector: '#footer-container, footer-container' }
    ];
    
    const loadPromises = partialTargets.map(async ({ name, selector }) => {
      const targets = document.querySelectorAll(selector);
      if (targets.length === 0) {
        log.warn(`No target found for partial: ${name} (selector: ${selector})`);
        return null;
      }
      
      // Load into first matching target
      try {
        await loadPartial(name, selector);
        return { name, success: true };
      } catch (error) {
        return { name, success: false, error };
      }
    });
    
    const results = await Promise.allSettled(loadPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;
    
    log.info(`Partials loaded: ${successful} successful, ${failed} failed`);
    perf.end(startTime);
    
    // Dispatch global event
    document.dispatchEvent(new CustomEvent('allPartialsLoaded', {
      detail: { successful, failed, results }
    }));
  }
  
  // ===== CORE APPLICATION SYSTEM =====
  
  /**
   * State management system
   */
  const StateManager = {
    state: new Proxy({}, {
      set(target, key, value) {
        const oldValue = target[key];
        target[key] = value;
        
        // Dispatch state change event
        document.dispatchEvent(new CustomEvent('stateChanged', {
          detail: { key, value, oldValue }
        }));
        
        // Save to localStorage if it's a persistent key
        if (key.startsWith('pmerit_')) {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            log.warn(`Failed to save state to localStorage: ${key}`, e);
          }
        }
        
        return true;
      }
    }),
    
    get(key, defaultValue = null) {
      if (this.state[key] !== undefined) {
        return this.state[key];
      }
      
      // Try loading from localStorage
      if (key.startsWith('pmerit_')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored !== null) {
            const value = JSON.parse(stored);
            this.state[key] = value;
            return value;
          }
        } catch (e) {
          log.warn(`Failed to load state from localStorage: ${key}`, e);
        }
      }
      
      return defaultValue;
    },
    
    set(key, value) {
      this.state[key] = value;
    },
    
    subscribe(key, callback) {
      const handler = (event) => {
        if (event.detail.key === key) {
          callback(event.detail.value, event.detail.oldValue);
        }
      };
      document.addEventListener('stateChanged', handler);
      return () => document.removeEventListener('stateChanged', handler);
    }
  };
  
  /**
   * Authentication system
   */
  const AuthSystem = {
    init() {
      // Load authentication state
      const isAuth = StateManager.get('pmerit_auth', false);
      const userData = StateManager.get('pmerit_user', null);
      
      this.updateAuthState(isAuth, userData);
      
      // Listen for auth state changes
      StateManager.subscribe('pmerit_auth', (isAuth) => {
        this.updateAuthState(isAuth);
      });
    },
    
    updateAuthState(isAuthenticated, userData = null) {
      log.debug('Auth state updated', { isAuthenticated, userData });
      
      // Dispatch auth state change
      document.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { authenticated: isAuthenticated, user: userData }
      }));
      
      // Update UI elements
      this.updateAuthUI(isAuthenticated, userData);
    },
    
    updateAuthUI(isAuthenticated, userData = null) {
      // Update header buttons
      const signInBtn = document.getElementById('signInBtn');
      const startBtn = document.getElementById('startBtn');
      const dashBtn = document.getElementById('dashBtn');
      
      if (signInBtn) {
        if (isAuthenticated) {
          signInBtn.innerHTML = '<i class="fas fa-gauge-high" aria-hidden="true"></i><span>Dashboard</span>';
        } else {
          signInBtn.innerHTML = '<i class="fas fa-right-to-bracket" aria-hidden="true"></i><span>Sign In</span>';
        }
      }
      
      if (startBtn && isAuthenticated) {
        startBtn.innerHTML = '<i class="fas fa-graduation-cap" aria-hidden="true"></i><span>Continue Learning</span>';
      }
      
      if (dashBtn) {
        dashBtn.classList.toggle('guest', !isAuthenticated);
        if (!isAuthenticated) {
          dashBtn.innerHTML = '<i class="fas fa-user-plus" aria-hidden="true"></i><span>Get Started</span>';
        } else {
          dashBtn.innerHTML = '<i class="fas fa-gauge-high" aria-hidden="true"></i><span>Dashboard</span>';
        }
      }
      
      // Update user profile in nav
      const userProfile = document.getElementById('userProfile');
      const userName = document.getElementById('userName');
      
      if (userProfile) {
        userProfile.style.display = isAuthenticated ? 'flex' : 'none';
        userProfile.setAttribute('aria-hidden', !isAuthenticated);
      }
      
      if (userName && userData?.name) {
        userName.textContent = userData.name;
      }
    },
    
    signIn(userData) {
      StateManager.set('pmerit_auth', true);
      StateManager.set('pmerit_user', userData);
      this.updateAuthState(true, userData);
      log.info('User signed in', userData?.email || 'unknown');
    },
    
    signOut() {
      StateManager.set('pmerit_auth', false);
      StateManager.set('pmerit_user', null);
      this.updateAuthState(false);
      log.info('User signed out');
    }
  };
  
  /**
   * API integration system
   */
  const APISystem = {
    async call(endpoint, options = {}) {
      const url = endpoint.startsWith('http') ? endpoint : `${CONFIG.apiEndpoint}${endpoint}`;
      
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          'X-PMERIT-Version': CONFIG.version
        }
      };
      
      // Add auth token if available
      const authToken = StateManager.get('pmerit_token');
      if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
      };
      
      try {
        log.debug(`API call: ${endpoint}`, mergedOptions);
        const response = await fetchWithRetry(url, mergedOptions);
        const data = await response.json();
        
        log.debug(`API response: ${endpoint}`, data);
        return data;
      } catch (error) {
        log.error(`API error: ${endpoint}`, error);
        throw error;
      }
    },
    
    async healthCheck() {
      try {
        const response = await this.call('/api/health');
        return response.status === 'ok';
      } catch (error) {
        return false;
      }
    },
    
    // Assessment API methods
    async startAssessment(type = 'personality') {
      return this.call('/api/assessment/start', {
        method: 'POST',
        body: JSON.stringify({ type })
      });
    },
    
    async submitAnswer(assessmentId, questionId, answer) {
      return this.call('/api/assessment/answer', {
        method: 'POST',
        body: JSON.stringify({ assessmentId, questionId, answer })
      });
    },
    
    async finishAssessment(assessmentId) {
      return this.call('/api/assessment/finish', {
        method: 'POST',
        body: JSON.stringify({ assessmentId })
      });
    },
    
    // AI Chat methods
    async sendMessage(message, context = {}) {
      return this.call('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          model: 'phi3:mini',
          prompt: message,
          context,
          stream: false
        })
      });
    }
  };
  
  /**
   * Chat system integration
   */
  const ChatSystem = {
    messages: [],
    
    init() {
      this.setupChatInput();
      this.loadChatHistory();
    },
    
    setupChatInput() {
      const chatInput = document.getElementById('chatInput');
      const sendBtn = document.getElementById('sendBtn');
      const counter = document.getElementById('count');
      
      if (chatInput) {
        // Character counter
        chatInput.addEventListener('input', () => {
          if (counter) {
            counter.textContent = `${chatInput.value.length}/${chatInput.maxLength}`;
          }
        });
        
        // Enter to send
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
          }
        });
      }
      
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.sendMessage());
      }
    },
    
    async sendMessage() {
      const chatInput = document.getElementById('chatInput');
      const counter = document.getElementById('count');
      
      if (!chatInput) return;
      
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Clear input
      chatInput.value = '';
      if (counter) counter.textContent = '0/1000';
      
      // Add user message
      this.addMessage('You', message, true);
      
      try {
        // Send to API
        const response = await APISystem.sendMessage(message);
        
        // Add AI response
        this.addMessage('PMERIT AI', response.response || response.text || 'I apologize, but I encountered an issue processing your message. Please try again.');
      } catch (error) {
        log.error('Chat error', error);
        this.addMessage('PMERIT AI', 'I apologize, but I\'m currently experiencing technical difficulties. Please try again in a moment.');
      }
    },
    
    addMessage(sender, text, isUser = false) {
      const chatBody = document.getElementById('chatBody');
      if (!chatBody) return;
      
      // Remove welcome message if it exists
      const welcomeMsg = document.getElementById('welcomeMsg');
      if (welcomeMsg) {
        welcomeMsg.remove();
      }
      
      const messageEl = document.createElement('article');
      messageEl.className = 'chat-bubble';
      messageEl.innerHTML = `
        <div class="chat-avatar">
          <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
        </div>
        <div class="chat-content">
          <h3>${sender}</h3>
          <p>${text}</p>
        </div>
      `;
      
      chatBody.appendChild(messageEl);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // Store message
      this.messages.push({ sender, text, isUser, timestamp: Date.now() });
      this.saveChatHistory();
      
      // TTS if enabled and it's an AI message
      const ttsEnabled = StateManager.get('pmerit_tts', false);
      if (ttsEnabled && !isUser && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
      
      // Dispatch chat event
      document.dispatchEvent(new CustomEvent('messageAdded', {
        detail: { sender, text, isUser }
      }));
    },
    
    loadChatHistory() {
      try {
        const history = localStorage.getItem('pmerit_chat_history');
        if (history) {
          this.messages = JSON.parse(history);
          // Restore recent messages (last 10)
          this.messages.slice(-10).forEach(msg => {
            if (msg.sender && msg.text) {
              this.addMessage(msg.sender, msg.text, msg.isUser);
            }
          });
        }
      } catch (error) {
        log.warn('Failed to load chat history', error);
      }
    },
    
    saveChatHistory() {
      try {
        // Keep only last 50 messages
        const recentMessages = this.messages.slice(-50);
        localStorage.setItem('pmerit_chat_history', JSON.stringify(recentMessages));
      } catch (error) {
        log.warn('Failed to save chat history', error);
      }
    },
    
    clearHistory() {
      this.messages = [];
      localStorage.removeItem('pmerit_chat_history');
      const chatBody = document.getElementById('chatBody');
      if (chatBody) {
        chatBody.innerHTML = '';
      }
    }
  };
  
  /**
   * Theme system
   */
  const ThemeSystem = {
    init() {
      // Load saved theme
      const isDark = StateManager.get('pmerit_dark_mode', false);
      this.setTheme(isDark ? 'dark' : 'light');
      
      // Listen for theme changes
      StateManager.subscribe('pmerit_dark_mode', (isDark) => {
        this.setTheme(isDark ? 'dark' : 'light');
      });
    },
    
    setTheme(theme) {
      document.body.classList.toggle('dark', theme === 'dark');
      
      // Update meta theme-color
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
      }
      
      metaTheme.content = theme === 'dark' ? '#1E293B' : '#FFFFFF';
      
      log.debug('Theme changed', theme);
    }
  };
  
  /**
   * Error handling system
   */
  const ErrorHandler = {
    init() {
      // Global error handler
      window.addEventListener('error', (event) => {
        log.error('Global error', {
          message: event.error?.message || event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      });
      
      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        log.error('Unhandled promise rejection', event.reason);
      });
    },
    
    showUserError(message, type = 'error') {
      // You can implement a toast notification system here
      console.error(`[User Error] ${message}`);
    }
  };
  
  // ===== INITIALIZATION SYSTEM =====
  
  /**
   * Main initialization function
   */
  async function initialize() {
    const startTime = 'app-initialization';
    perf.start(startTime);
    
    log.info(`PMERIT Platform v${CONFIG.version} initializing...`);
    
    try {
      // Initialize error handling first
      ErrorHandler.init();
      
      // Load partials
      await loadAllPartials();
      
      // Initialize core systems
      StateManager.state = StateManager.state; // Initialize proxy
      AuthSystem.init();
      ThemeSystem.init();
      
      // Wait for DOM to be fully ready
      await new Promise(resolve => domReady(resolve));
      
      // Initialize interactive systems
      ChatSystem.init();
      
      // Health check
      const isHealthy = await APISystem.healthCheck();
      log.info('API health check', isHealthy ? 'passed' : 'failed');
      
      // Dispatch app ready event
      document.dispatchEvent(new CustomEvent('appReady', {
        detail: { version: CONFIG.version, healthy: isHealthy }
      }));
      
      perf.end(startTime);
      log.info('PMERIT Platform initialized successfully');
      
    } catch (error) {
      log.error('Initialization failed', error);
      throw error;
    }
  }
  
  // ===== GLOBAL API =====
  
  /**
   * Global PMERIT namespace
   */
  window.PMERIT = {
    // Configuration
    version: CONFIG.version,
    config: CONFIG,
    
    // Core systems
    state: StateManager,
    auth: AuthSystem,
    api: APISystem,
    chat: ChatSystem,
    theme: ThemeSystem,
    
    // Utility functions
    log,
    perf,
    
    // Partial management
    loadPartial,
    reloadPartial: (name, selector) => loadPartial(name, selector),
    
    // Initialization
    init: initialize,
    
    // Event system
    on: (event, callback) => document.addEventListener(event, callback),
    off: (event, callback) => document.removeEventListener(event, callback),
    emit: (event, detail) => document.dispatchEvent(new CustomEvent(event, { detail })),
    
    // Convenience methods
    addMessage: (sender, text, isUser = false) => ChatSystem.addMessage(sender, text, isUser),
    setLanguage: (lang) => StateManager.set('pmerit_lang', lang),
    setTheme: (theme) => ThemeSystem.setTheme(theme),
    
    // Debug helpers
    debugInfo: () => ({
      version: CONFIG.version,
      state: StateManager.state,
      messages: ChatSystem.messages.length,
      performance: performance.getEntriesByType('measure')
    })
  };
  
  // ===== AUTO-INITIALIZATION =====
  
  // Auto-initialize when DOM is ready
  domReady(() => {
    // Small delay to ensure all external resources are loaded
    setTimeout(initialize, 100);
  });
  
  // Expose for manual initialization if needed
  window.PMERIT.manualInit = initialize;
  
  log.info('Boot includes system loaded');
  
})();
