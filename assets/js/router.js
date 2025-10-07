/**
 * PMERIT Router
 * Version: 1.0
 * 
 * Simple client-side routing for navigation between pages
 */

(function(window) {
    'use strict';

    // ============================================
    // ROUTER
    // ============================================
    
    const Router = {
        /**
         * Navigate to a page
         */
        navigate: function(url) {
            window.location.href = url;
        },
        
        /**
         * Navigate back
         */
        back: function() {
            window.history.back();
        },
        
        /**
         * Navigate forward
         */
        forward: function() {
            window.history.forward();
        },
        
        /**
         * Get current path
         */
        getCurrentPath: function() {
            return window.location.pathname;
        },
        
        /**
         * Get query parameters
         */
        getQueryParams: function() {
            const params = {};
            const searchParams = new URLSearchParams(window.location.search);
            
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
            
            return params;
        },
        
        /**
         * Get specific query parameter
         */
        getQueryParam: function(key) {
            const params = new URLSearchParams(window.location.search);
            return params.get(key);
        },
        
        /**
         * Check if current page matches path
         */
        isCurrentPage: function(path) {
            return window.location.pathname.endsWith(path);
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITRouter = Router;

})(window);
