/**
 * PMERIT Core Module
 * Version: 1.0
 * 
 * Central module that ensures all core dependencies are loaded
 */

(function(window) {
    'use strict';

    // ============================================
    // CORE MODULE
    // ============================================
    
    const PMERITCore = {
        version: '3.0.0',
        initialized: false,
        
        /**
         * Initialize PMERIT Core
         */
        init: function() {
            if (this.initialized) {
                console.warn('PMERIT Core already initialized');
                return;
            }
            
            console.log(`🚀 Initializing PMERIT Core v${this.version}`);
            
            // Check for required modules
            this.checkDependencies();
            
            this.initialized = true;
            console.log('✅ PMERIT Core initialized');
        },
        
        /**
         * Check if all core dependencies are loaded
         */
        checkDependencies: function() {
            const dependencies = {
                'State Manager': window.PMERITStateManager,
                'Utils': window.PMERITUtils,
                'i18n': window.PMERITi18n,
                'Voice': window.PMERITVoice,
                'Chat': window.PMERITChat
            };
            
            const missing = [];
            
            Object.keys(dependencies).forEach(name => {
                if (!dependencies[name]) {
                    missing.push(name);
                }
            });
            
            if (missing.length > 0) {
                console.warn('⚠️ Missing dependencies:', missing.join(', '));
            } else {
                console.log('✅ All core dependencies loaded');
            }
        },
        
        /**
         * Get version
         */
        getVersion: function() {
            return this.version;
        },
        
        /**
         * Check if initialized
         */
        isInitialized: function() {
            return this.initialized;
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITCore = PMERITCore;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PMERITCore.init());
    } else {
        PMERITCore.init();
    }

})(window);
