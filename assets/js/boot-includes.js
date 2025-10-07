/**
 * PMERIT Boot Includes
 * Version: 1.0
 * 
 * Dynamically loads shared HTML partials into pages
 * Used by secondary pages to include header, footer, and nav
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const PARTIALS_DIR = 'partials/';
    const TIMEOUT = 5000; // 5 seconds

    // ============================================
    // INCLUDE LOADER
    // ============================================
    
    function loadPartial(element) {
        const file = element.getAttribute('data-include');
        
        if (!file) {
            console.warn('Element has data-include but no file specified:', element);
            return Promise.resolve();
        }

        const url = PARTIALS_DIR + file;
        
        return fetch(url, { timeout: TIMEOUT })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                element.removeAttribute('data-include');
                
                // Trigger custom event for any scripts that need to know when partials are loaded
                const event = new CustomEvent('partialLoaded', { 
                    detail: { file, element } 
                });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error(`Error loading partial ${file}:`, error);
                element.innerHTML = `<!-- Failed to load ${file} -->`;
            });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🔄 Loading partials...');
        
        // Find all elements with data-include attribute
        const elements = document.querySelectorAll('[data-include]');
        
        if (elements.length === 0) {
            console.log('✅ No partials to load');
            return;
        }

        // Load all partials
        const promises = Array.from(elements).map(element => loadPartial(element));
        
        // Wait for all partials to load
        Promise.all(promises)
            .then(() => {
                console.log(`✅ Loaded ${elements.length} partial(s)`);
                
                // Trigger event when all partials are loaded
                const event = new CustomEvent('allPartialsLoaded');
                document.dispatchEvent(event);
                
                // Initialize main.js functionality if available
                if (window.PMERITCore && typeof window.PMERITCore.init === 'function') {
                    window.PMERITCore.init();
                }
            })
            .catch(error => {
                console.error('Error loading partials:', error);
            });
    }

    // ============================================
    // AUTO-INITIALIZE
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // EXPORT FOR MANUAL USE
    // ============================================
    
    window.PMERITBootIncludes = {
        loadPartial: loadPartial,
        reload: init
    };

})();
