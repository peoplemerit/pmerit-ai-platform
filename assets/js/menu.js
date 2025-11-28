/**
 * PMERIT Mobile Menu Controller
 * Version: 3.0 - Phase 8.2 & 8.3 Enhanced
 * Last Updated: November 2025
 * 
 * Features:
 * - Hamburger menu with keyboard navigation
 * - Nested navigation with accordion behavior
 * - Classroom route integration
 * - Focus trap with ARIA support
 * - Route persistence
 * - Telemetry hooks
 */

class MobileMenu {
    constructor() {
        // Primary menu elements
        this.menuButton = document.querySelector('[aria-controls="mobile-menu"]') ||
                          document.getElementById('hamburgerBtn') ||
                          document.querySelector('#hamburger-toggle');
        this.menu = document.getElementById('mobile-menu') ||
                    document.getElementById('sideMenu') ||
                    document.querySelector('#hamburger-menu');
        this.overlay = document.querySelector('.menu-overlay') ||
                       document.getElementById('menuOverlay');
        this.closeButton = document.querySelector('.menu-close') ||
                           document.getElementById('menu-close-btn');
        
        this.menuLinks = [];
        this.isOpen = false;
        this.expandedSections = new Set();
        this.currentRoute = window.location.hash || '/';
        
        this.init();
    }
    
    init() {
        if (!this.menuButton || !this.menu) {
            console.warn('[Menu] Required menu elements not found');
            return;
        }
        
        // Get all focusable elements in menu
        this.updateFocusableElements();
        
        // Initialize ARIA attributes
        this.initializeARIA();
        
        // Event listeners
        this.setupEventListeners();
        
        // Check route state
        this.checkRouteState();
        
        logger.debug('[Menu] Mobile menu initialized with nested navigation support');
    }
    
    initializeARIA() {
        // Menu button
        this.menuButton.setAttribute('aria-controls', 'hamburger-menu');
        this.menuButton.setAttribute('aria-expanded', 'false');
        this.menuButton.setAttribute('aria-label', 'Open navigation menu');
        
        // Menu
        this.menu.setAttribute('role', 'navigation');
        this.menu.setAttribute('aria-label', 'Main navigation');
        this.menu.setAttribute('aria-hidden', 'true');
        
        // Nested sections
        const nestedSections = this.menu.querySelectorAll('[data-nested-section]');
        nestedSections.forEach(section => {
            section.setAttribute('role', 'region');
            section.setAttribute('aria-hidden', 'true');
            section.style.maxHeight = '0';
            section.style.overflow = 'hidden';
            section.style.transition = 'max-height 0.3s ease-in-out';
        });
    }
    
    setupEventListeners() {
        // Menu button
        this.menuButton.addEventListener('click', () => this.toggle());
        
        // Overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Route change handlers
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('popstate', () => this.handleRouteChange());
        
        // Menu item clicks
        this.menu.addEventListener('click', (e) => this.handleMenuClick(e));
        
        // Nested section toggles
        const toggles = this.menu.querySelectorAll('[data-toggle-section]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleNestedToggle(e));
            toggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    updateFocusableElements() {
        this.menuLinks = Array.from(this.menu.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'textarea:not([disabled]), select:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        ));
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        
        // Update classes
        this.menu.classList.add('menu-open', 'active');
        if (this.overlay) {
            this.overlay.classList.add('overlay-visible', 'active');
        }
        
        // Update ARIA
        this.menuButton.setAttribute('aria-expanded', 'true');
        this.menuButton.setAttribute('aria-label', 'Close navigation menu');
        this.menu.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        setTimeout(() => {
            if (this.menuLinks.length > 0) {
                this.menuLinks[0].focus();
            }
        }, 100);
        
        // Trap focus
        this.trapFocus();
        
        // Analytics
        this.trackEvent('nav_open');
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Update classes
        this.menu.classList.remove('menu-open', 'active');
        if (this.overlay) {
            this.overlay.classList.remove('overlay-visible', 'active');
        }
        
        // Update ARIA
        this.menuButton.setAttribute('aria-expanded', 'false');
        this.menuButton.setAttribute('aria-label', 'Open navigation menu');
        this.menu.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to menu button
        this.menuButton.focus();
        
        // Analytics
        this.trackEvent('nav_close');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    handleKeyboard(e) {
        if (!this.isOpen) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.focusNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPrevious();
                break;
        }
    }
    
    focusNext() {
        const currentIndex = this.menuLinks.indexOf(document.activeElement);
        if (currentIndex === -1) {
            this.menuLinks[0]?.focus();
        } else {
            const nextIndex = (currentIndex + 1) % this.menuLinks.length;
            this.menuLinks[nextIndex]?.focus();
        }
    }
    
    focusPrevious() {
        const currentIndex = this.menuLinks.indexOf(document.activeElement);
        if (currentIndex === -1) {
            this.menuLinks[0]?.focus();
        } else {
            const prevIndex = (currentIndex - 1 + this.menuLinks.length) % this.menuLinks.length;
            this.menuLinks[prevIndex]?.focus();
        }
    }
    
    trapFocus() {
        if (!this.isOpen || this.menuLinks.length === 0) return;
        
        const firstElement = this.menuLinks[0];
        const lastElement = this.menuLinks[this.menuLinks.length - 1];
        
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
    
    handleMenuClick(e) {
        const target = e.target.closest('[data-route], a[href]');
        if (!target) return;
        
        const route = target.getAttribute('data-route') || target.getAttribute('href');
        if (!route) return;
        
        // Handle classroom route (Phase 8.3)
        if (route === '/classroom' || route === '#/classroom' || route.includes('classroom')) {
            e.preventDefault();
            this.navigateToClassroom();
            this.close();
            return;
        }
        
        // Handle other routes
        if (route.startsWith('#')) {
            e.preventDefault();
            this.navigateToRoute(route);
            this.close();
        }
        
        // Track navigation
        this.trackEvent('nav_item_click', {
            route: route,
            label: target.textContent.trim()
        });
    }
    
    handleNestedToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const toggle = e.currentTarget;
        const sectionId = toggle.getAttribute('data-toggle-section');
        const section = document.querySelector(`[data-nested-section="${sectionId}"]`);
        
        if (!section) return;
        
        const isExpanded = this.expandedSections.has(sectionId);
        
        if (isExpanded) {
            // Collapse
            section.style.maxHeight = '0';
            section.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            this.expandedSections.delete(sectionId);
        } else {
            // Expand
            section.style.maxHeight = section.scrollHeight + 'px';
            section.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            this.expandedSections.add(sectionId);
        }
        
        // Update focusable elements
        this.updateFocusableElements();
    }
    
    navigateToClassroom() {
        logger.debug('[Menu] Navigating to Classroom');
        
        // Update URL
        window.location.hash = '#/classroom';
        
        // Trigger router if available
        if (window.router?.navigate) {
            window.router.navigate('/classroom');
        }
        
        // Show classroom UI elements
        this.showClassroomUI();
        
        // Track analytics
        this.trackEvent('classroom_enter', {
            route: window.location.pathname,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }
    
    showClassroomUI() {
        // Show avatar canvas
        const vhRoot = document.getElementById('vh-root') || 
                      document.querySelector('.vh-root');
        if (vhRoot) {
            vhRoot.style.display = 'block';
        }
        
        // Show chat stream
        const chatStream = document.getElementById('chat-stream') || 
                          document.querySelector('.chat-stream') ||
                          document.getElementById('chatMessages');
        if (chatStream) {
            chatStream.style.display = 'flex';
        }
        
        // Ensure proper layout
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
        });
    }
    
    navigateToRoute(route) {
        // Update URL hash
        window.location.hash = route;
        
        // Trigger router
        if (window.router?.navigate) {
            window.router.navigate(route.replace('#', ''));
        }
    }
    
    handleRouteChange() {
        const newRoute = window.location.hash || '/';
        
        // Close menu on route change
        if (this.isOpen) {
            this.close();
        }
        
        this.currentRoute = newRoute;
    }
    
    checkRouteState() {
        const hash = window.location.hash;
        
        // If on classroom route, ensure UI is visible
        if (hash && hash.includes('classroom')) {
            this.showClassroomUI();
        }
    }
    
    handleResize() {
        // Close menu if window is resized to desktop width
        if (window.innerWidth >= 1024 && this.isOpen) {
            this.close();
        }
    }
    
    trackEvent(eventName, data = {}) {
        if (window.analytics?.track) {
            window.analytics.track(eventName, {
                ...data,
                route: this.currentRoute,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                timestamp: Date.now()
            });
        }
    }
    
    // Public API
    destroy() {
        // Clean up event listeners if needed
        if (this.isOpen) {
            this.close();
        }
    }
}

// Initialize menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileMenu = new MobileMenu();
        window.PMERIT = window.PMERIT || {};
        window.PMERIT.menu = window.mobileMenu;
    });
} else {
    window.mobileMenu = new MobileMenu();
    window.PMERIT = window.PMERIT || {};
    window.PMERIT.menu = window.mobileMenu;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenu;
}
export default MobileMenu;
