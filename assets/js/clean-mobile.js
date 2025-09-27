/**
 * PMERIT Mobile Header Interactions
 * Google-inspired mobile navigation functionality
 * Handles hamburger menu, settings toggles, and accessibility
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

})();        // Bind event listeners
        bindMobileEvents();
        
        // Apply initial state
        applyInitialState();
        
        // Setup resize handler
        setupResizeHandler();

        console.log('Mobile header initialized');
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