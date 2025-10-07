/**
 * PMERIT Utility Functions
 * Version: 1.0
 * 
 * Helper functions and utilities for the PMERIT application
 */

(function(window) {
    'use strict';

    const PMERITUtils = {
        
        // ============================================
        // DOM UTILITIES
        // ============================================
        
        /**
         * Safely query selector
         */
        $: function(selector) {
            return document.querySelector(selector);
        },
        
        /**
         * Query selector all
         */
        $$: function(selector) {
            return Array.from(document.querySelectorAll(selector));
        },
        
        /**
         * Create element with attributes and content
         */
        createElement: function(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'dataset') {
                    Object.keys(attributes[key]).forEach(dataKey => {
                        element.dataset[dataKey] = attributes[key][dataKey];
                    });
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            if (content) {
                if (typeof content === 'string') {
                    element.textContent = content;
                } else {
                    element.appendChild(content);
                }
            }
            
            return element;
        },
        
        /**
         * Add event listener with delegation
         */
        on: function(selector, event, handler, parent = document) {
            parent.addEventListener(event, function(e) {
                const target = e.target.closest(selector);
                if (target) {
                    handler.call(target, e);
                }
            });
        },
        
        // ============================================
        // STRING UTILITIES
        // ============================================
        
        /**
         * Sanitize HTML string
         */
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },
        
        /**
         * Truncate string
         */
        truncate: function(str, length, suffix = '...') {
            if (str.length <= length) return str;
            return str.substring(0, length - suffix.length) + suffix;
        },
        
        /**
         * Capitalize first letter
         */
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        /**
         * Slugify string
         */
        slugify: function(str) {
            return str
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },
        
        // ============================================
        // DATE/TIME UTILITIES
        // ============================================
        
        /**
         * Format date
         */
        formatDate: function(date, format = 'short') {
            const d = new Date(date);
            
            if (format === 'short') {
                return d.toLocaleDateString();
            } else if (format === 'long') {
                return d.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            } else if (format === 'time') {
                return d.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            } else if (format === 'full') {
                return d.toLocaleString();
            }
            
            return d.toISOString();
        },
        
        /**
         * Get relative time (e.g., "2 hours ago")
         */
        getRelativeTime: function(date) {
            const d = new Date(date);
            const now = new Date();
            const diff = now - d;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            return 'Just now';
        },
        
        // ============================================
        // VALIDATION UTILITIES
        // ============================================
        
        /**
         * Validate email
         */
        isValidEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        /**
         * Validate URL
         */
        isValidURL: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        
        /**
         * Validate phone number (basic)
         */
        isValidPhone: function(phone) {
            const re = /^[\d\s\-\+\(\)]+$/;
            return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
        },
        
        // ============================================
        // STORAGE UTILITIES
        // ============================================
        
        /**
         * Get from localStorage with JSON parse
         */
        getStorage: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error(`Error getting storage item "${key}":`, error);
                return defaultValue;
            }
        },
        
        /**
         * Set to localStorage with JSON stringify
         */
        setStorage: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Error setting storage item "${key}":`, error);
                return false;
            }
        },
        
        /**
         * Remove from localStorage
         */
        removeStorage: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Error removing storage item "${key}":`, error);
                return false;
            }
        },
        
        /**
         * Clear all localStorage
         */
        clearStorage: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing storage:', error);
                return false;
            }
        },
        
        // ============================================
        // ARRAY UTILITIES
        // ============================================
        
        /**
         * Shuffle array
         */
        shuffle: function(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        },
        
        /**
         * Get unique values from array
         */
        unique: function(array) {
            return [...new Set(array)];
        },
        
        /**
         * Group array by key
         */
        groupBy: function(array, key) {
            return array.reduce((result, item) => {
                const group = item[key];
                if (!result[group]) {
                    result[group] = [];
                }
                result[group].push(item);
                return result;
            }, {});
        },
        
        // ============================================
        // NUMBER UTILITIES
        // ============================================
        
        /**
         * Format number with commas
         */
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        /**
         * Format percentage
         */
        formatPercentage: function(value, total, decimals = 0) {
            const percentage = (value / total) * 100;
            return percentage.toFixed(decimals) + '%';
        },
        
        /**
         * Clamp number between min and max
         */
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        // ============================================
        // ASYNC UTILITIES
        // ============================================
        
        /**
         * Debounce function
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        /**
         * Throttle function
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        /**
         * Sleep/delay function
         */
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        // ============================================
        // MISC UTILITIES
        // ============================================
        
        /**
         * Generate unique ID
         */
        generateId: function(prefix = 'id') {
            return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },
        
        /**
         * Deep clone object
         */
        deepClone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        
        /**
         * Check if object is empty
         */
        isEmpty: function(obj) {
            return Object.keys(obj).length === 0;
        },
        
        /**
         * Copy text to clipboard
         */
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return Promise.resolve();
            }
        },
        
        /**
         * Detect if mobile device
         */
        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        /**
         * Get query parameter
         */
        getQueryParam: function(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        },
        
        /**
         * Set query parameter
         */
        setQueryParam: function(param, value) {
            const url = new URL(window.location);
            url.searchParams.set(param, value);
            window.history.pushState({}, '', url);
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITUtils = PMERITUtils;

})(window);
