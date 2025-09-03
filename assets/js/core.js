/**
 * PMERIT Core System - Foundation
 * This must load BEFORE all other modules
 * Creates the global PMERIT namespace and initialization system
 */

// Create global PMERIT namespace
window.PMERIT = window.PMERIT || {};

// Initialize core subsystems
window.PMERIT.version = '1.0.0';
window.PMERIT.initialized = false;
window.PMERIT.modules = {};
window.PMERIT.state = {};
window.PMERIT.utils = {};
window.PMERIT.config = {};

// Event system for module communication
window.PMERIT.events = {
    listeners: {},
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    },
    
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
};

// Configuration management
window.PMERIT.config = {
    apiBase: '/api',
    endpoints: {
        health: '/api/health',
        assessment: '/api/assessment',
        chat: '/api/chat',
        auth: '/api/auth'
    },
    timeouts: {
        default: 5000,
        chat: 10000,
        assessment: 15000
    },
    fallbacks: {
        enabled: true,
        offlineMode: false
    }
};

// State management system
window.PMERIT.state = {
    data: {},
    
    set(key, value) {
        this.data[key] = value;
        this.save(key, value);
        window.PMERIT.events.emit('state:change', { key, value });
    },
    
    get(key, defaultValue = null) {
        if (this.data[key] !== undefined) {
            return this.data[key];
        }
        
        // Try to load from localStorage
        try {
            const stored = localStorage.getItem(`pmerit_${key}`);
            if (stored !== null) {
                const parsed = JSON.parse(stored);
                this.data[key] = parsed;
                return parsed;
            }
        } catch (error) {
            console.warn(`Failed to load state for ${key}:`, error);
        }
        
        return defaultValue;
    },
    
    save(key, value) {
        try {
            localStorage.setItem(`pmerit_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to save state for ${key}:`, error);
        }
    },
    
    remove(key) {
        delete this.data[key];
        try {
            localStorage.removeItem(`pmerit_${key}`);
        } catch (error) {
            console.warn(`Failed to remove state for ${key}:`, error);
        }
        window.PMERIT.events.emit('state:change', { key, value: undefined });
    },
    
    // Auth-specific state helpers
    getAuthToken() {
        return this.get('auth_token');
    },
    
    setAuthToken(token) {
        this.set('auth_token', token);
    },
    
    getUserId() {
        return this.get('user_id');
    },
    
    setUserId(userId) {
        this.set('user_id', userId);
    },
    
    isAuthenticated() {
        return !!(this.getAuthToken() && this.getUserId());
    },
    
    clearAuth() {
        this.remove('auth_token');
        this.remove('user_id');
        this.remove('user_profile');
    }
};

// Utility functions
window.PMERIT.utils = {
    // DOM helpers
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },
    
    // API helpers
    async fetchJson(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add auth token if available
        const token = window.PMERIT.state.getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API request failed for ${url}:`, error);
            throw error;
        }
    },
    
    // Validation helpers
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    validateLength(str, min = 0, max = Infinity) {
        return str && str.length >= min && str.length <= max;
    },
    
    // UI helpers
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    },
    
    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    },
    
    // Error handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        const message = error.message || 'An unexpected error occurred';
        this.showNotification(message, 'error');
    },
    
    showNotification(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // Set background color based on type
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// Module registration and initialization system
window.PMERIT.modules = {
    registered: {},
    initialized: {},
    
    // Register a module
    register(name, module) {
        if (this.registered[name]) {
            console.warn(`Module ${name} is already registered`);
            return;
        }
        
        this.registered[name] = module;
        console.log(`📦 Module registered: ${name}`);
    },
    
    // Initialize specific modules
    async init(moduleNames = []) {
        console.log('🚀 Initializing PMERIT modules:', moduleNames);
        
        for (const name of moduleNames) {
            await this.initModule(name);
        }
        
        // Emit event that modules are ready
        window.PMERIT.events.emit('modules:ready', { modules: moduleNames });
    },
    
    // Initialize a single module
    async initModule(name) {
        if (this.initialized[name]) {
            console.log(`Module ${name} already initialized`);
            return;
        }
        
        const module = this.registered[name];
        if (!module) {
            console.warn(`Module ${name} not found`);
            return;
        }
        
        try {
            if (typeof module.init === 'function') {
                await module.init();
                this.initialized[name] = true;
                console.log(`✅ Module initialized: ${name}`);
            } else {
                console.warn(`Module ${name} has no init function`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize module ${name}:`, error);
        }
    },
    
    // Get a module
    get(name) {
        return this.registered[name];
    },
    
    // Check if module is available
    has(name) {
        return !!this.registered[name];
    },
    
    // Get module API (safe accessor)
    api(name) {
        const module = this.registered[name];
        return module && module.api ? module.api : {};
    }
};

// Health check system
window.PMERIT.health = {
    async check() {
        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            
            if (response.ok) {
                const data = await response.json();
                return { status: 'healthy', data };
            } else {
                return { status: 'error', message: `HTTP ${response.status}` };
            }
        } catch (error) {
            return { status: 'offline', message: error.message };
        }
    },
    
    async checkDatabase() {
        try {
            const result = await this.check();
            return result.status === 'healthy' && result.data?.database === 'connected';
        } catch (error) {
            return false;
        }
    }
};

// Initialize core system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 PMERIT Core System initializing...');
    
    // Mark as initialized
    window.PMERIT.initialized = true;
    
    // Check system health
    window.PMERIT.health.check().then(result => {
        console.log('🏥 System health:', result);
        window.PMERIT.state.set('system_health', result);
    });
    
    // Emit ready event
    window.PMERIT.events.emit('core:ready');
    
    console.log('✅ PMERIT Core System ready');
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    window.PMERIT.utils.handleError(event.error, 'Global');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    window.PMERIT.utils.handleError(event.reason, 'Promise');
});

// Export for modules that need early access
window.PMERIT.ready = new Promise((resolve) => {
    if (window.PMERIT.initialized) {
        resolve(window.PMERIT);
    } else {
        window.PMERIT.events.on('core:ready', () => resolve(window.PMERIT));
    }
});
