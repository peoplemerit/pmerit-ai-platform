/**
 * PMERIT Mobile Base Template Functionality
 * Handles viewport height management, scroll containment, and template integration
 * Includes mobile header functionality and viewport height handling for mobile browsers
 */

(function() {
    'use strict';

    // Mobile navigation state
    let mobileNavState = {
        isOpen: false,
        settingsExpanded: false,
        darkMode: localStorage.getItem('pmerit_dark') === 'true',
        ttsEnabled: localStorage.getItem('pmerit_tts') === 'true',
        selectedLang: localStorage.getItem('pmerit_lang') || 'en'
    };

    // DOM Elements
    let elements = {};

    // Initialize mobile header functionality
    function initMobileHeader() {
        // Get DOM elements
        elements = {
            mobileHeader: document.getElementById('mobileHeader'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            mobileNav: document.getElementById('mobileNav'),
            mobileNavClose: document.getElementById('mobileNavClose'),
            mobileNavOverlay: document.getElementById('mobileNavOverlay'),
            mobileSignInBtn: document.getElementById('mobileSignInBtn'),
            mobileStartBtn: document.getElementById('mobileStartBtn'),
            mobileLang: document.getElementById('mobileLang'),
            mobileSettingsToggle: document.getElementById('mobileSettingsToggle'),
            mobileSettingsContent: document.getElementById('mobileSettingsContent'),
            mobileDarkToggle: document.getElementById('mobileDarkToggle'),
            mobileTtsToggle: document.getElementById('mobileTtsToggle'),
            mobileNavStatus: document.getElementById('mobileNavStatus'),
            body: document.body
        };

        // Check if mobile elements exist
        if (!elements.mobileHeader) {
            console.log('Mobile header not found - probably on desktop');
            return;
        }

        
        // Initialize mobile layout
        initMobileLayout();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize settings from localStorage
        initializeSettings();
        
        console.log('PMERIT Mobile header initialized');
    }

    // Initialize mobile layout
    function initMobileLayout() {
        // Add mobile layout class to body
        elements.body.classList.add('mobile-layout');
        
        // Set initial states
        updateHeaderVisibility();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Hamburger menu button
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.addEventListener('click', toggleMobileNav);
            elements.mobileMenuBtn.addEventListener('keydown', handleMenuKeydown);
        }

        // Close button and overlay
        if (elements.mobileNavClose) {
            elements.mobileNavClose.addEventListener('click', closeMobileNav);
        }
        
        if (elements.mobileNavOverlay) {
            elements.mobileNavOverlay.addEventListener('click', closeMobileNav);
        }

        // Sign in button
        if (elements.mobileSignInBtn) {
            elements.mobileSignInBtn.addEventListener('click', handleSignIn);
        }

        // Start learning button
        if (elements.mobileStartBtn) {
            elements.mobileStartBtn.addEventListener('click', handleStartLearning);
        }

        // Language selector
        if (elements.mobileLang) {
            elements.mobileLang.addEventListener('change', handleLanguageChange);
        }

        // Settings toggle
        if (elements.mobileSettingsToggle) {
            elements.mobileSettingsToggle.addEventListener('click', toggleSettings);
        }

        // Dark mode toggle
        if (elements.mobileDarkToggle) {
            elements.mobileDarkToggle.addEventListener('click', toggleDarkMode);
        }

        // TTS toggle
        if (elements.mobileTtsToggle) {
            elements.mobileTtsToggle.addEventListener('click', toggleTTS);
        }

        // Escape key to close nav
        document.addEventListener('keydown', handleEscapeKey);
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
    }

    // Initialize settings from localStorage
    function initializeSettings() {
        // Set language
        if (elements.mobileLang) {
            elements.mobileLang.value = mobileNavState.selectedLang;
        }

        // Set dark mode
        updateDarkMode(mobileNavState.darkMode);
        
        // Set TTS
        updateTTS(mobileNavState.ttsEnabled);
    }

    // Toggle mobile navigation
    function toggleMobileNav() {
        if (mobileNavState.isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    // Open mobile navigation
    function openMobileNav() {
        mobileNavState.isOpen = true;
        
        if (elements.mobileNav) {
            elements.mobileNav.classList.add('active');
        }
        
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
        
        // Prevent body scroll
        elements.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            if (elements.mobileNavClose) {
                elements.mobileNavClose.focus();
            }
        }, 300);
        
        // Announce to screen readers
        announceToScreenReader('Navigation menu opened');
    }

    // Close mobile navigation
    function closeMobileNav() {
        mobileNavState.isOpen = false;
        
        if (elements.mobileNav) {
            elements.mobileNav.classList.remove('active');
        }
        
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            elements.mobileMenuBtn.focus(); // Return focus
        }
        
        // Restore body scroll
        elements.body.style.overflow = '';
        
        // Announce to screen readers
        announceToScreenReader('Navigation menu closed');
    }

    // Handle keyboard navigation for menu button
    function handleMenuKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMobileNav();
        }
    }

    // Handle escape key
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && mobileNavState.isOpen) {
            closeMobileNav();
        }
    }

    // Toggle settings panel
    function toggleSettings() {
        mobileNavState.settingsExpanded = !mobileNavState.settingsExpanded;
        
        if (elements.mobileSettingsContent) {
            elements.mobileSettingsContent.classList.toggle('active', mobileNavState.settingsExpanded);
        }
        
        if (elements.mobileSettingsToggle) {
            elements.mobileSettingsToggle.setAttribute('aria-expanded', mobileNavState.settingsExpanded);
        }
    }

    // Toggle dark mode
    function toggleDarkMode() {
        mobileNavState.darkMode = !mobileNavState.darkMode;
        updateDarkMode(mobileNavState.darkMode);
        
        // Save to localStorage
        localStorage.setItem('pmerit_dark', mobileNavState.darkMode);
        
        announceToScreenReader(`Dark mode ${mobileNavState.darkMode ? 'enabled' : 'disabled'}`);
    }

    // Update dark mode UI
    function updateDarkMode(enabled) {
        elements.body.classList.toggle('dark', enabled);
        
        if (elements.mobileDarkToggle) {
            elements.mobileDarkToggle.classList.toggle('active', enabled);
        }
    }

    // Toggle TTS
    function toggleTTS() {
        mobileNavState.ttsEnabled = !mobileNavState.ttsEnabled;
        updateTTS(mobileNavState.ttsEnabled);
        
        // Save to localStorage
        localStorage.setItem('pmerit_tts', mobileNavState.ttsEnabled);
        
        announceToScreenReader(`Text-to-speech ${mobileNavState.ttsEnabled ? 'enabled' : 'disabled'}`);
    }

    // Update TTS UI
    function updateTTS(enabled) {
        if (elements.mobileTtsToggle) {
            elements.mobileTtsToggle.classList.toggle('active', enabled);
        }
    }

    // Handle language change
    function handleLanguageChange(event) {
        mobileNavState.selectedLang = event.target.value;
        localStorage.setItem('pmerit_lang', mobileNavState.selectedLang);
        
        announceToScreenReader(`Language changed to ${event.target.options[event.target.selectedIndex].text}`);
        
        // Trigger language change event
        document.dispatchEvent(new CustomEvent('pmerit:languageChanged', {
            detail: { language: mobileNavState.selectedLang }
        }));
    }

    // Handle sign in
    function handleSignIn() {
        announceToScreenReader('Opening sign in');
        // Trigger sign in event
        document.dispatchEvent(new CustomEvent('pmerit:signInClicked'));
        closeMobileNav();
    }

    // Handle start learning
    function handleStartLearning() {
        announceToScreenReader('Starting learning experience');
        // Trigger start learning event
        document.dispatchEvent(new CustomEvent('pmerit:startLearningClicked'));
        closeMobileNav();
    }

    // Handle window resize
    function handleResize() {
        // Close nav on resize to desktop
        if (window.innerWidth > 768 && mobileNavState.isOpen) {
            closeMobileNav();
        }
        
        updateHeaderVisibility();
    }

    // Update header visibility based on screen size
    function updateHeaderVisibility() {
        if (!elements.mobileHeader) return;
        
        if (window.innerWidth <= 768) {
            elements.mobileHeader.style.display = 'block';
        } else {
            elements.mobileHeader.style.display = 'none';
            // Close nav if open on desktop
            if (mobileNavState.isOpen) {
                closeMobileNav();
            }
        }
    }

    // Announce to screen readers
    function announceToScreenReader(message) {
        if (elements.mobileNavStatus) {
            elements.mobileNavStatus.textContent = message;
            setTimeout(() => {
                elements.mobileNavStatus.textContent = '';
            }, 1000);
        }
    }

    // Public API
    window.PMERITMobile = {
        init: initMobileHeader,
        openNav: openMobileNav,
        closeNav: closeMobileNav,
        toggleDarkMode: toggleDarkMode,
        toggleTTS: toggleTTS,
        getState: () => ({ ...mobileNavState })
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileHeader);
    } else {
        initMobileHeader();
    }

})();                // Bind event listeners
        bindMobileEvents();
        
        // Apply initial state
        applyInitialState();
        
        // Setup resize handler
        setupResizeHandler();

        console.log('Mobile header initialized');
    }
    }

    // Initialize mobile layout
    function initMobileLayout() {
        // Add mobile layout class to body on mobile screens
        if (window.innerWidth <= 768) {
            elements.body.classList.add('mobile-layout');
        }
    }

    // Bind all mobile event listeners
    function bindMobileEvents() {
        // Hamburger menu toggle
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.addEventListener('click', toggleMobileNav);
            elements.mobileMenuBtn.addEventListener('keydown', handleMenuKeydown);
        }

        // Close navigation
        if (elements.mobileNavClose) {
            elements.mobileNavClose.addEventListener('click', closeMobileNav);
        }

        // Overlay click to close
        if (elements.mobileNavOverlay) {
            elements.mobileNavOverlay.addEventListener('click', closeMobileNav);
        }

        // Sign in button
        if (elements.mobileSignInBtn) {
            elements.mobileSignInBtn.addEventListener('click', handleSignIn);
        }

        // Start learning button
        if (elements.mobileStartBtn) {
            elements.mobileStartBtn.addEventListener('click', handleStartLearning);
        }

        // Language selector
        if (elements.mobileLang) {
            elements.mobileLang.addEventListener('change', handleLanguageChange);
        }

        // Settings toggle
        if (elements.mobileSettingsToggle) {
            elements.mobileSettingsToggle.addEventListener('click', toggleMobileSettings);
        }

        // Dark mode toggle
        if (elements.mobileDarkToggle) {
            elements.mobileDarkToggle.addEventListener('click', toggleDarkMode);
        }

        // TTS toggle
        if (elements.mobileTtsToggle) {
            elements.mobileTtsToggle.addEventListener('click', toggleTTS);
        }

        // Escape key to close navigation
        document.addEventListener('keydown', handleEscapeKey);

        // Prevent body scroll when nav is open
        document.addEventListener('touchmove', preventBodyScroll, { passive: false });
    }

    // Apply initial state from localStorage
    function applyInitialState() {
        // Apply language
        if (elements.mobileLang) {
            elements.mobileLang.value = mobileNavState.selectedLang;
        }

        // Apply dark mode
        if (mobileNavState.darkMode) {
            elements.body.classList.add('dark');
            if (elements.mobileDarkToggle) {
                elements.mobileDarkToggle.classList.add('active');
            }
        }

        // Apply TTS state
        if (mobileNavState.ttsEnabled) {
            if (elements.mobileTtsToggle) {
                elements.mobileTtsToggle.classList.add('active');
            }
        }
    }

    // Toggle mobile navigation
    function toggleMobileNav(event) {
        event.preventDefault();
        event.stopPropagation();

        if (mobileNavState.isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    // Open mobile navigation
    function openMobileNav() {
        mobileNavState.isOpen = true;
        
        // Update DOM
        elements.mobileNav.classList.add('active');
        elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        elements.body.classList.add('nav-open');
        
        // Focus management
        setTimeout(() => {
            if (elements.mobileNavClose) {
                elements.mobileNavClose.focus();
            }
        }, 100);

        // Announce to screen readers
        announceToScreenReader('Navigation menu opened');

        // Prevent background scrolling
        elements.body.style.overflow = 'hidden';
    }

    // Close mobile navigation
    function closeMobileNav() {
        mobileNavState.isOpen = false;
        
        // Update DOM
        elements.mobileNav.classList.remove('active');
        elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        elements.body.classList.remove('nav-open');
        
        // Restore focus
        elements.mobileMenuBtn.focus();

        // Announce to screen readers
        announceToScreenReader('Navigation menu closed');

        // Restore background scrolling
        elements.body.style.overflow = '';
    }

    // Toggle mobile settings
    function toggleMobileSettings(event) {
        event.preventDefault();
        
        mobileNavState.settingsExpanded = !mobileNavState.settingsExpanded;
        
        // Update DOM
        elements.mobileSettingsToggle.setAttribute('aria-expanded', mobileNavState.settingsExpanded);
        
        if (mobileNavState.settingsExpanded) {
            elements.mobileSettingsContent.classList.add('active');
            announceToScreenReader('Settings expanded');
        } else {
            elements.mobileSettingsContent.classList.remove('active');
            announceToScreenReader('Settings collapsed');
        }
    }

    // Handle language change
    function handleLanguageChange(event) {
        const newLang = event.target.value;
        mobileNavState.selectedLang = newLang;
        
        // Save to localStorage
        localStorage.setItem('pmerit_lang', newLang);
        
        // Update main language selector if it exists
        const mainLangSelect = document.getElementById('lang');
        if (mainLangSelect) {
            mainLangSelect.value = newLang;
        }
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));
        
        announceToScreenReader(`Language changed to ${event.target.selectedOptions[0].textContent}`);
    }

    // Toggle dark mode
    function toggleDarkMode(event) {
        event.preventDefault();
        
        mobileNavState.darkMode = !mobileNavState.darkMode;
        
        // Update DOM
        elements.body.classList.toggle('dark', mobileNavState.darkMode);
        elements.mobileDarkToggle.classList.toggle('active', mobileNavState.darkMode);
        
        // Save to localStorage
        localStorage.setItem('pmerit_dark', mobileNavState.darkMode);
        
        // Update main dark mode toggle if it exists
        const mainDarkToggle = document.getElementById('darkToggle');
        if (mainDarkToggle) {
            mainDarkToggle.classList.toggle('active', mobileNavState.darkMode);
        }
        
        // Trigger dark mode change event
        window.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { enabled: mobileNavState.darkMode } }));
        
        announceToScreenReader(`Dark mode ${mobileNavState.darkMode ? 'enabled' : 'disabled'}`);
    }

    // Toggle text-to-speech
    function toggleTTS(event) {
        event.preventDefault();
        
        mobileNavState.ttsEnabled = !mobileNavState.ttsEnabled;
        
        // Update DOM
        elements.mobileTtsToggle.classList.toggle('active', mobileNavState.ttsEnabled);
        
        // Save to localStorage
        localStorage.setItem('pmerit_tts', mobileNavState.ttsEnabled);
        
        // Update main TTS toggle if it exists
        const mainTtsToggle = document.getElementById('ttsToggle');
        if (mainTtsToggle) {
            mainTtsToggle.classList.toggle('active', mobileNavState.ttsEnabled);
        }
        
        // Trigger TTS change event
        window.dispatchEvent(new CustomEvent('ttsChanged', { detail: { enabled: mobileNavState.ttsEnabled } }));
        
        announceToScreenReader(`Text-to-speech ${mobileNavState.ttsEnabled ? 'enabled' : 'disabled'}`);
    }

    // Handle sign in button click
    function handleSignIn(event) {
        event.preventDefault();
        
        // Close mobile nav first
        closeMobileNav();
        
        // Trigger sign in modal or navigate to sign in page
        const signInModal = document.getElementById('signInModal');
        if (signInModal && typeof window.openModal === 'function') {
            window.openModal('signInModal');
        } else {
            // Navigate to sign in page
            window.location.href = '/signin.html';
        }
    }

    // Handle start learning button click
    function handleStartLearning(event) {
        event.preventDefault();
        
        // Close mobile nav first
        closeMobileNav();
        
        // Trigger assessment or navigate to courses
        const assessmentModal = document.getElementById('assessmentModal');
        if (assessmentModal && typeof window.openModal === 'function') {
            window.openModal('assessmentModal');
        } else {
            // Navigate to courses page
            window.location.href = '/courses.html';
        }
    }

    // Handle keyboard navigation
    function handleMenuKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMobileNav(event);
        }
    }

    // Handle escape key to close navigation
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && mobileNavState.isOpen) {
            closeMobileNav();
        }
    }

    // Prevent body scroll when navigation is open
    function preventBodyScroll(event) {
        if (mobileNavState.isOpen && !elements.mobileNav.contains(event.target)) {
            event.preventDefault();
        }
    }

    // Setup resize handler
    function setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Close mobile nav on resize to desktop
                if (window.innerWidth > 768 && mobileNavState.isOpen) {
                    closeMobileNav();
                }
                
                // Toggle mobile layout class
                if (window.innerWidth <= 768) {
                    elements.body.classList.add('mobile-layout');
                } else {
                    elements.body.classList.remove('mobile-layout');
                }
            }, 150);
        });
    }

    // Announce to screen readers
    function announceToScreenReader(message) {
        if (elements.mobileNavStatus) {
            elements.mobileNavStatus.textContent = message;
            
            // Clear the message after a short delay
            setTimeout(() => {
                elements.mobileNavStatus.textContent = '';
            }, 1000);
        }
    }

    // Cleanup function for mobile navigation
    function cleanupMobileNav() {
        if (mobileNavState.isOpen) {
            closeMobileNav();
        }
        
        // Remove event listeners if needed
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('touchmove', preventBodyScroll);
    }

    // Public API
    window.MobileHeader = {
        init: initMobileHeader,
        open: openMobileNav,
        close: closeMobileNav,
        cleanup: cleanupMobileNav,
        state: mobileNavState
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileHeader);
    } else {
        // DOM is already ready
        initMobileHeader();
    }

    // Initialize on window load as fallback
    window.addEventListener('load', () => {
        if (!elements.mobileHeader) {
            initMobileHeader();
        }
    });

})();

/**
 * PMERIT Mobile Base Template Functionality
 * Handles viewport height management, scroll containment, and template integration
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
        scrollPosition: 0
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
        
        if (!header || !footer || !content) return;

        // Get actual heights
        templateState.headerHeight = header.offsetHeight || 64;
        templateState.footerHeight = footer.offsetHeight || 80;
        
        // Calculate available content height
        templateState.contentHeight = templateState.viewportHeight - templateState.headerHeight - templateState.footerHeight;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--mobile-header-height', `${templateState.headerHeight}px`);
        document.documentElement.style.setProperty('--mobile-footer-height', `${templateState.footerHeight}px`);
        document.documentElement.style.setProperty('--mobile-content-height', `${templateState.contentHeight}px`);
        
        // Apply styles to content container
        content.style.top = `${templateState.headerHeight}px`;
        content.style.bottom = `${templateState.footerHeight}px`;
        content.style.height = `${templateState.contentHeight}px`;
        
        // Ensure proper z-index layering
        header.style.zIndex = '1000';
        footer.style.zIndex = '999';
        content.style.zIndex = '1';
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
            if (templateState.scrollPosition > 10) {
                document.querySelector('.mobile-header')?.classList.add('scrolled');
            } else {
                document.querySelector('.mobile-header')?.classList.remove('scrolled');
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

    // Initialize mobile template
    function initMobileTemplate() {
        // Check if we're in mobile layout
        if (!document.body.classList.contains('mobile-layout')) {
            console.log('Not in mobile layout mode');
            return;
        }

        // Initialize viewport handling
        handleMobileViewport();
        
        // Initialize scroll containment
        initScrollContainment();
        
        // Adjust layout after DOM is ready
        setTimeout(adjustContentHeight, 100);
        
        // Re-adjust after images load
        window.addEventListener('load', () => {
            setTimeout(adjustContentHeight, 200);
        });

        console.log('Mobile template initialized successfully');
    }

    // Handle template cleanup
    function cleanupMobileTemplate() {
        // Remove event listeners and reset styles
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        const content = document.querySelector('.mobile-content-container');
        if (content) {
            content.style.scrollBehavior = '';
            content.style.overflowY = '';
            content.style.overflowX = '';
            content.style.webkitOverflowScrolling = '';
            content.style.overscrollBehavior = '';
        }
    }

    // Enhanced responsive breakpoint handling
    function handleResponsiveBreakpoints() {
        // Define breakpoint media queries
        const breakpoints = {
            mobile: window.matchMedia('(max-width: 767px)'),
            tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
            desktop: window.matchMedia('(min-width: 1024px)')
        };
        
        // Current breakpoint state
        let currentBreakpoint = 'mobile';
        
        function determineBreakpoint() {
            if (breakpoints.desktop.matches) return 'desktop';
            if (breakpoints.tablet.matches) return 'tablet';
            return 'mobile';
        }
        
        function handleBreakpointChange() {
            const newBreakpoint = determineBreakpoint();
            
            if (newBreakpoint !== currentBreakpoint) {
                const previousBreakpoint = currentBreakpoint;
                currentBreakpoint = newBreakpoint;
                
                console.log(`PMERIT: Breakpoint changed from ${previousBreakpoint} to ${currentBreakpoint}`);
                
                // Update body classes
                document.body.classList.remove('mobile-layout', 'tablet-layout', 'desktop-layout');
                document.body.classList.add(`${currentBreakpoint}-layout`);
                
                // Handle navigation based on breakpoint
                handleNavigationBreakpoint(currentBreakpoint, previousBreakpoint);
                
                // Handle content layout
                handleContentBreakpoint(currentBreakpoint);
                
                // Dispatch custom event for other components to listen to
                const breakpointEvent = new CustomEvent('breakpointChange', {
                    detail: {
                        current: currentBreakpoint,
                        previous: previousBreakpoint,
                        viewport: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    }
                });
                document.dispatchEvent(breakpointEvent);
            }
        }
        
        function handleNavigationBreakpoint(current, previous) {
            const mobileNav = document.getElementById('mobileNav');
            const tabletNav = document.querySelector('.tablet-nav');
            const desktopNav = document.querySelector('.desktop-nav');
            
            switch (current) {
                case 'mobile':
                    // Ensure mobile layout is initialized
                    if (!document.body.classList.contains('mobile-layout')) {
                        initMobileTemplate();
                    }
                    // Close any open mobile nav if coming from larger screen
                    if (previous !== 'mobile' && mobileNavState.isOpen) {
                        closeMobileNav();
                    }
                    break;
                    
                case 'tablet':
                    // Close mobile nav if open
                    if (mobileNavState.isOpen) {
                        closeMobileNav();
                    }
                    // Initialize tablet-specific behaviors
                    initTabletBehaviors();
                    break;
                    
                case 'desktop':
                    // Close mobile nav if open
                    if (mobileNavState.isOpen) {
                        closeMobileNav();
                    }
                    // Initialize desktop-specific behaviors
                    initDesktopBehaviors();
                    break;
            }
        }
        
        function handleContentBreakpoint(breakpoint) {
            const contentArea = document.getElementById('contentArea') || document.querySelector('.mobile-content-area');
            
            if (contentArea) {
                // Update content area classes for responsive layouts
                contentArea.classList.remove('mobile-content', 'tablet-content', 'desktop-content');
                contentArea.classList.add(`${breakpoint}-content`);
                
                // Adjust content height if needed
                if (typeof adjustContentHeight === 'function') {
                    adjustContentHeight();
                }
            }
        }
        
        function initTabletBehaviors() {
            console.log('PMERIT: Initializing tablet behaviors');
            
            // Add tablet-specific event listeners
            const tabletNavItems = document.querySelectorAll('.tablet-nav-item');
            tabletNavItems.forEach(item => {
                // Enhanced hover effects for tablet
                item.addEventListener('touchstart', handleTabletTouch, { passive: true });
            });
            
            // Initialize tablet grid layouts
            const gridElements = document.querySelectorAll('.content-grid-tablet');
            gridElements.forEach(grid => {
                grid.style.display = 'grid';
            });
        }
        
        function initDesktopBehaviors() {
            console.log('PMERIT: Initializing desktop behaviors');
            
            // Add desktop-specific event listeners
            const desktopNavItems = document.querySelectorAll('.desktop-nav-item');
            desktopNavItems.forEach(item => {
                // Desktop hover and focus behaviors
                item.addEventListener('mouseenter', handleDesktopNavHover);
                item.addEventListener('mouseleave', handleDesktopNavLeave);
                item.addEventListener('focus', handleDesktopNavFocus);
            });
            
            // Initialize desktop grid layouts
            const gridElements = document.querySelectorAll('.content-grid-desktop');
            gridElements.forEach(grid => {
                grid.style.display = 'grid';
            });
            
            // Initialize desktop-specific components
            initDesktopDropdowns();
            initDesktopTooltips();
        }
        
        function handleTabletTouch(event) {
            // Add visual feedback for tablet touches
            const item = event.currentTarget;
            item.classList.add('tablet-touch');
            setTimeout(() => {
                item.classList.remove('tablet-touch');
            }, 200);
        }
        
        function handleDesktopNavHover(event) {
            const item = event.currentTarget;
            const dropdown = item.querySelector('.desktop-nav-dropdown');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        }
        
        function handleDesktopNavLeave(event) {
            const item = event.currentTarget;
            const dropdown = item.querySelector('.desktop-nav-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
        
        function handleDesktopNavFocus(event) {
            // Keyboard navigation support for desktop
            const item = event.currentTarget;
            item.classList.add('nav-focused');
        }
        
        function initDesktopDropdowns() {
            const dropdownTriggers = document.querySelectorAll('.desktop-nav-dropdown-trigger');
            dropdownTriggers.forEach(trigger => {
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const dropdown = trigger.querySelector('.desktop-nav-dropdown');
                        if (dropdown) {
                            const isVisible = dropdown.style.display === 'block';
                            dropdown.style.display = isVisible ? 'none' : 'block';
                        }
                    }
                });
            });
        }
        
        function initDesktopTooltips() {
            const tooltipElements = document.querySelectorAll('[data-tooltip]');
            tooltipElements.forEach(element => {
                element.addEventListener('mouseenter', showTooltip);
                element.addEventListener('mouseleave', hideTooltip);
            });
        }
        
        function showTooltip(event) {
            // Tooltip implementation for desktop
            console.log('Showing tooltip:', event.currentTarget.dataset.tooltip);
        }
        
        function hideTooltip(event) {
            // Hide tooltip
            console.log('Hiding tooltip');
        }
        
        // Initialize responsive font loading
        function initResponsiveFonts() {
            // Ensure fonts are loaded appropriately for current breakpoint
            if ('fonts' in document) {
                document.fonts.ready.then(() => {
                    document.body.classList.add('fonts-loaded');
                    console.log('PMERIT: Fonts loaded for', currentBreakpoint, 'breakpoint');
                });
            }
        }
        
        // Set up media query listeners
        Object.values(breakpoints).forEach(mq => {
            mq.addListener(handleBreakpointChange);
        });
        
        // Initial breakpoint determination
        handleBreakpointChange();
        
        // Initialize responsive fonts
        initResponsiveFonts();
        
        // Add resize debouncing for better performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleBreakpointChange();
            }, 150);
        });
        
        // Expose current breakpoint globally
        window.getCurrentBreakpoint = () => currentBreakpoint;
        
        console.log('PMERIT: Responsive breakpoint system initialized');
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
                        // Implement lazy loading logic
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
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                font-size: 12px;
                z-index: 9999;
                border-radius: 4px;
                font-family: monospace;
                line-height: 1.4;
            `;
            
            function updateDebugInfo() {
                debugInfo.innerHTML = `
                    Viewport: ${templateState.viewportHeight}px<br>
                    Header: ${templateState.headerHeight}px<br>
                    Footer: ${templateState.footerHeight}px<br>
                    Content: ${templateState.contentHeight}px<br>
                    Scroll: ${templateState.scrollPosition}px<br>
                    iOS: ${templateState.isIOS}<br>
                    Android: ${templateState.isAndroid}
                `;
            }
            
            document.body.appendChild(debugInfo);
            setInterval(updateDebugInfo, 1000);
        }
    }

    // Public API for mobile template
    window.MobileTemplate = {
        init: initMobileTemplate,
        cleanup: cleanupMobileTemplate,
        adjustContentHeight: adjustContentHeight,
        handleMobileViewport: handleMobileViewport,
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
        if (document.body.classList.contains('mobile-layout')) {
            initMobileTemplate();
        }
    });

})();