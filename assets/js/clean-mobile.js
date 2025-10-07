/**
 * PMERIT Clean Mobile
 * Version: 1.0
 * 
 * Mobile menu functionality exports
 * This module exports mobile menu functions for use in other scripts
 */

(function(window) {
    'use strict';

    // ============================================
    // MOBILE MENU UTILITIES
    // ============================================
    
    const CleanMobile = {
        /**
         * Check if device is mobile
         */
        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        /**
         * Get viewport width
         */
        getViewportWidth: function() {
            return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        },
        
        /**
         * Get viewport height
         */
        getViewportHeight: function() {
            return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        },
        
        /**
         * Check if viewport is mobile size
         */
        isMobileViewport: function() {
            return this.getViewportWidth() <= 768;
        },
        
        /**
         * Check if viewport is tablet size
         */
        isTabletViewport: function() {
            const width = this.getViewportWidth();
            return width > 768 && width <= 1100;
        },
        
        /**
         * Check if viewport is desktop size
         */
        isDesktopViewport: function() {
            return this.getViewportWidth() > 1100;
        },
        
        /**
         * Lock body scroll (for when menu is open)
         */
        lockScroll: function() {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        },
        
        /**
         * Unlock body scroll
         */
        unlockScroll: function() {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        },
        
        /**
         * Handle safe area insets for iOS
         */
        applySafeAreaInsets: function() {
            const root = document.documentElement;
            
            // Check if device supports safe area insets
            if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
                root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
                root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
                root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
                root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
            }
        },
        
        /**
         * Detect touch support
         */
        isTouchDevice: function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITMobile = CleanMobile;
    
    // Apply safe area insets on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CleanMobile.applySafeAreaInsets());
    } else {
        CleanMobile.applySafeAreaInsets();
    }

})(window);

// Export for testing/module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PMERITMobile;
}
