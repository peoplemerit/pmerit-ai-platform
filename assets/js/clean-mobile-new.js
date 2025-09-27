/**
 * PMERIT Mobile Base Template Functionality
 * Handles viewport height management, scroll containment, and template integration
 * Includes mobile header functionality and viewport height handling for mobile browsers
 */

(function() {
    'use strict';

    // Mobile template state
    let templateState = {
        viewportHeight: window.innerHeight,
        headerHeight: 64,
        footerHeight: 80,
        contentHeight: 0,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        scrollPosition: 0,
        isInitialized: false
    };

    // Viewport height management
    function handleMobileViewport() {
        function setViewportHeight() {
            // Get actual viewport height
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            templateState.viewportHeight = window.innerHeight;
            
            // Update content height calculations
            adjustContentHeight();
            
            // Handle iOS Safari address bar behavior
            if (templateState.isIOS) {
                handleIOSViewport();
            }
        }

        // Set initial height
        setViewportHeight();

        // Update on resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setViewportHeight, 100);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 200);
        });

        // Handle iOS Safari address bar
        if (templateState.isIOS) {
            let scrollTimer;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(setViewportHeight, 150);
            });
        }
    }

    // Handle iOS Safari specific viewport issues
    function handleIOSViewport() {
        const content = document.querySelector('.mobile-content-container');
        if (!content) return;

        // Force recalculation on iOS when keyboard appears/disappears
        const initialHeight = window.innerHeight;
        
        // Listen for viewport meta changes
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            const observer = new MutationObserver(() => {
                setTimeout(() => {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                    adjustContentHeight();
                }, 100);
            });
            observer.observe(viewportMeta, { attributes: true });
        }

        // Handle focus events for form inputs
        document.addEventListener('focusin', () => {
            setTimeout(() => {
                if (window.innerHeight < initialHeight * 0.75) {
                    // Keyboard is likely visible
                    document.documentElement.style.setProperty('--keyboard-visible', 'true');
                }
            }, 300);
        });

        document.addEventListener('focusout', () => {
            setTimeout(() => {
                document.documentElement.style.setProperty('--keyboard-visible', 'false');
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                adjustContentHeight();
            }, 300);
        });
    }

    // Adjust content area height based on header and footer
    function adjustContentHeight() {
        const header = document.querySelector('.mobile-header');
        const footer = document.querySelector('.mobile-footer');
        const content = document.querySelector('.mobile-content-container');
        
        if (!header || !footer || !content) {
            // Try to find elements with fallback selectors
            const headerFallback = document.getElementById('mobile-header-placeholder');
            const footerFallback = document.getElementById('mobile-footer-placeholder');
            
            if (!headerFallback && !footerFallback) return;
        }

        // Get actual heights
        templateState.headerHeight = (header?.offsetHeight) || 64;
        templateState.footerHeight = (footer?.offsetHeight) || 80;
        
        // Calculate available content height
        templateState.contentHeight = templateState.viewportHeight - templateState.headerHeight - templateState.footerHeight;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--mobile-header-height', `${templateState.headerHeight}px`);
        document.documentElement.style.setProperty('--mobile-footer-height', `${templateState.footerHeight}px`);
        document.documentElement.style.setProperty('--mobile-content-height', `${templateState.contentHeight}px`);
        
        // Apply styles to content container
        if (content) {
            content.style.top = `${templateState.headerHeight}px`;
            content.style.bottom = `${templateState.footerHeight}px`;
            content.style.height = `${templateState.contentHeight}px`;
            
            // Ensure proper z-index layering
            if (header) header.style.zIndex = '1000';
            if (footer) footer.style.zIndex = '999';
            content.style.zIndex = '1';
        }
    }

    // Initialize scroll containment
    function initScrollContainment() {
        const content = document.querySelector('.mobile-content-container');
        if (!content) return;

        // Prevent overscroll on the body
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Enable smooth scrolling within content area
        content.style.scrollBehavior = 'smooth';
        content.style.overflowY = 'auto';
        content.style.overflowX = 'hidden';
        content.style.webkitOverflowScrolling = 'touch';
        content.style.overscrollBehavior = 'contain';

        // Track scroll position for potential features
        content.addEventListener('scroll', (e) => {
            templateState.scrollPosition = e.target.scrollTop;
            
            // Optional: Add scroll-based header effects
            const header = document.querySelector('.mobile-header');
            if (header) {
                if (templateState.scrollPosition > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, { passive: true });

        // Prevent pull-to-refresh on mobile browsers
        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop === 0) {
                content.scrollTop = 1;
            } else if (content.scrollTop + content.offsetHeight >= content.scrollHeight) {
                content.scrollTop = content.scrollHeight - content.offsetHeight - 1;
            }
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (content.scrollTop === 0 && e.touches[0].clientY > e.changedTouches[0].clientY) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Initialize mobile header functionality (simplified version)
    function initMobileHeader() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavClose = document.getElementById('mobileNavClose');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (!mobileMenuBtn || !mobileNav) return;

        // Toggle mobile navigation
        function toggleMobileNav() {
            const isOpen = mobileNav.classList.contains('active');
            
            if (isOpen) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        }

        function openMobileNav() {
            mobileNav.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            
            // Update status for screen readers
            const status = document.getElementById('mobileNavStatus');
            if (status) status.textContent = 'Navigation menu opened';
        }

        function closeMobileNav() {
            mobileNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            
            // Update status for screen readers
            const status = document.getElementById('mobileNavStatus');
            if (status) status.textContent = 'Navigation menu closed';
        }

        // Event listeners
        mobileMenuBtn.addEventListener('click', toggleMobileNav);
        
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileNav);
        }
        
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileNav);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileNav();
            }
        });

        // Settings toggle functionality
        const settingsToggle = document.getElementById('mobileSettingsToggle');
        const settingsContent = document.getElementById('mobileSettingsContent');
        
        if (settingsToggle && settingsContent) {
            settingsToggle.addEventListener('click', () => {
                const isExpanded = settingsContent.classList.contains('active');
                
                if (isExpanded) {
                    settingsContent.classList.remove('active');
                    settingsToggle.setAttribute('aria-expanded', 'false');
                } else {
                    settingsContent.classList.add('active');
                    settingsToggle.setAttribute('aria-expanded', 'true');
                }
            });
        }
    }

    // Initialize mobile footer functionality
    function initMobileFooter() {
        // Update copyright year
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Connection status management
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (statusDot && statusText) {
            // Simulate connection status (replace with actual logic)
            function updateConnectionStatus(status = 'connected') {
                const statusIndicator = statusDot.parentElement;
                
                statusIndicator.className = `status-indicator ${status}`;
                
                switch (status) {
                    case 'connected':
                        statusText.textContent = 'Connected to Educational Services';
                        break;
                    case 'connecting':
                        statusText.textContent = 'Connecting...';
                        break;
                    case 'disconnected':
                        statusText.textContent = 'Connection lost - Retrying...';
                        break;
                }
            }

            // Initial status
            updateConnectionStatus('connected');
        }
    }

    // Initialize mobile template
    function initMobileTemplate() {
        // Check if we're in mobile layout
        const isMobile = window.innerWidth <= 768 || document.body.classList.contains('mobile-layout');
        
        if (!isMobile) {
            console.log('Not in mobile layout mode');
            return;
        }

        // Add mobile layout class
        document.body.classList.add('mobile-layout');

        // Initialize viewport handling
        handleMobileViewport();
        
        // Initialize scroll containment
        initScrollContainment();
        
        // Initialize mobile header
        initMobileHeader();
        
        // Initialize mobile footer
        initMobileFooter();
        
        // Adjust layout after DOM is ready
        setTimeout(adjustContentHeight, 100);
        
        // Re-adjust after images load
        window.addEventListener('load', () => {
            setTimeout(adjustContentHeight, 200);
        });

        templateState.isInitialized = true;
        console.log('Mobile template initialized successfully');
    }

    // Handle template cleanup
    function cleanupMobileTemplate() {
        // Remove event listeners and reset styles
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('mobile-layout');
        
        const content = document.querySelector('.mobile-content-container');
        if (content) {
            content.style.scrollBehavior = '';
            content.style.overflowY = '';
            content.style.overflowX = '';
            content.style.webkitOverflowScrolling = '';
            content.style.overscrollBehavior = '';
        }

        templateState.isInitialized = false;
    }

    // Responsive breakpoint handling
    function handleResponsiveBreakpoints() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        function handleBreakpointChange(e) {
            if (e.matches) {
                // Mobile view
                if (!templateState.isInitialized) {
                    initMobileTemplate();
                }
            } else {
                // Desktop view
                if (templateState.isInitialized) {
                    cleanupMobileTemplate();
                }
            }
        }

        // Initial check
        handleBreakpointChange(mediaQuery);
        
        // Listen for changes (modern browsers)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleBreakpointChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleBreakpointChange);
        }
    }

    // Performance optimization: Intersection Observer for content loading
    function initContentObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Content is visible, can trigger animations or lazy loading
                    entry.target.classList.add('content-visible');
                    
                    // Optional: Lazy load images or components here
                    const lazyElements = entry.target.querySelectorAll('[data-lazy]');
                    lazyElements.forEach(el => {
                        const src = el.getAttribute('data-lazy');
                        if (src && el.tagName === 'IMG') {
                            el.src = src;
                            el.removeAttribute('data-lazy');
                        }
                    });
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe content sections
        const sections = document.querySelectorAll('.mobile-welcome-section, .mobile-ai-section, .mobile-features-section, .mobile-stats-section, .mobile-cta-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Debug helper function
    function debugMobileLayout() {
        if (window.location.search.includes('debug=mobile')) {
            const debugInfo = document.createElement('div');
            debugInfo.id = 'mobile-debug';
            debugInfo.style.cssText = `
                position: fixed;
                top: 70px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                font-size: 12px;
                z-index: 9999;
                border-radius: 4px;
                font-family: monospace;
                line-height: 1.4;
                max-width: 200px;
            `;
            
            function updateDebugInfo() {
                debugInfo.innerHTML = `
                    Viewport: ${templateState.viewportHeight}px<br>
                    Header: ${templateState.headerHeight}px<br>
                    Footer: ${templateState.footerHeight}px<br>
                    Content: ${templateState.contentHeight}px<br>
                    Scroll: ${templateState.scrollPosition}px<br>
                    iOS: ${templateState.isIOS}<br>
                    Android: ${templateState.isAndroid}<br>
                    Initialized: ${templateState.isInitialized}
                `;
            }
            
            document.body.appendChild(debugInfo);
            updateDebugInfo();
            setInterval(updateDebugInfo, 1000);
        }
    }

    // Public API for mobile template
    window.MobileTemplate = {
        init: initMobileTemplate,
        cleanup: cleanupMobileTemplate,
        adjustContentHeight: adjustContentHeight,
        handleMobileViewport: handleMobileViewport,
        initMobileHeader: initMobileHeader,
        initMobileFooter: initMobileFooter,
        state: templateState
    };

    // Auto-initialize mobile template
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            handleResponsiveBreakpoints();
            initContentObserver();
            debugMobileLayout();
        });
    } else {
        handleResponsiveBreakpoints();
        initContentObserver();
        debugMobileLayout();
    }

    // Initialize on window load as fallback
    window.addEventListener('load', () => {
        if (!templateState.isInitialized && window.innerWidth <= 768) {
            initMobileTemplate();
        }
    });

})();