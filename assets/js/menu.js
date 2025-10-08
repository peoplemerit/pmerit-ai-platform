/**
 * PMERIT Mobile Menu Controller
 * Version: 2.0
 * Last Updated: October 2025
 * 
 * Handles hamburger menu open/close, overlay, and keyboard navigation
 */

class MobileMenu {
    constructor() {
        this.menuButton = document.querySelector('[aria-controls="mobile-menu"]');
        this.menu = document.getElementById('mobile-menu');
        this.overlay = document.querySelector('.menu-overlay');
        this.closeButton = document.querySelector('.menu-close');
        this.menuLinks = [];
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuButton || !this.menu) {
            return;
        }
        
        // Get all focusable elements in menu
        this.menuLinks = this.menu.querySelectorAll('a, button');
        
        // Event listeners
        this.menuButton.addEventListener('click', () => this.toggle());
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', () => this.handleResize());
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        
        // Update ARIA and classes
        this.menu.classList.add('menu-open');
        this.menuButton.setAttribute('aria-expanded', 'true');
        
        if (this.overlay) {
            this.overlay.classList.add('overlay-visible');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        setTimeout(() => {
            if (this.menuLinks.length > 0) {
                this.menuLinks[0].focus();
            }
        }, 300); // Wait for animation
        
        // Trap focus in menu
        this.trapFocus();
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Update ARIA and classes
        this.menu.classList.remove('menu-open');
        this.menuButton.setAttribute('aria-expanded', 'false');
        
        if (this.overlay) {
            this.overlay.classList.remove('overlay-visible');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to menu button
        this.menuButton.focus();
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    handleKeyboard(e) {
        // Close menu on Escape key
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    
    trapFocus() {
        if (!this.isOpen) return;
        
        const focusableElements = this.menu.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleFocusTrap = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        this.menu.addEventListener('keydown', handleFocusTrap);
    }
    
    handleResize() {
        // Close menu if window is resized to desktop width
        if (window.innerWidth >= 1024 && this.isOpen) {
            this.close();
        }
    }
}

// Initialize menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileMenu = new MobileMenu();
    });
} else {
    window.mobileMenu = new MobileMenu();
}

// Export for use in other modules
export default MobileMenu;
