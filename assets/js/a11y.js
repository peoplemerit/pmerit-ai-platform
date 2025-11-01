/**
 * PMERIT Accessibility Announcements
 * Phase 8.8 - Mobile A11y (ARIA Live Regions)
 * Version: 1.0
 * 
 * Features:
 * - ARIA live regions for screen reader announcements
 * - Status announcements (TTS playing, Recording, etc.)
 * - Focus management
 * - Keyboard navigation support
 */

(function() {
    'use strict';

    // ========================================
    // ARIA LIVE REGION SETUP
    // ========================================
    
    let liveRegion = null;
    let statusRegion = null;

    function createLiveRegions() {
        // Polite live region for general announcements
        liveRegion = document.createElement('div');
        liveRegion.id = 'pmerit-live-region';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Assertive live region for important status updates
        statusRegion = document.createElement('div');
        statusRegion.id = 'pmerit-status-region';
        statusRegion.setAttribute('role', 'alert');
        statusRegion.setAttribute('aria-live', 'assertive');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.className = 'sr-only';
        document.body.appendChild(statusRegion);

        console.log('[A11y] ARIA live regions created');
    }

    // ========================================
    // ANNOUNCEMENT FUNCTIONS
    // ========================================

    /**
     * Announce a message to screen readers
     * @param {string} message - The message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    function announce(message, priority = 'polite') {
        const region = priority === 'assertive' ? statusRegion : liveRegion;
        
        if (!region) {
            console.warn('[A11y] Live region not initialized');
            return;
        }

        // Clear and then set message to ensure it's announced
        region.textContent = '';
        setTimeout(() => {
            region.textContent = message;
            console.log(`[A11y] Announced (${priority}):`, message);
        }, 100);
    }

    /**
     * Announce TTS (Text-to-Speech) status
     */
    function announceTTSStatus(status) {
        const messages = {
            'playing': 'Text-to-speech is now playing',
            'paused': 'Text-to-speech paused',
            'stopped': 'Text-to-speech stopped',
            'completed': 'Text-to-speech completed',
            'error': 'Text-to-speech error'
        };
        
        announce(messages[status] || status, 'polite');
    }

    /**
     * Announce voice recording status
     */
    function announceRecordingStatus(status) {
        const messages = {
            'started': 'Recording started. Speak now.',
            'stopped': 'Recording stopped. Processing your voice...',
            'processing': 'Processing voice input...',
            'completed': 'Voice input received',
            'error': 'Voice recording error'
        };
        
        announce(messages[status] || status, 'assertive');
    }

    /**
     * Announce message sent/received
     */
    function announceMessage(type, text) {
        if (type === 'sent') {
            announce('Message sent', 'polite');
        } else if (type === 'received') {
            // Truncate long messages
            const preview = text.length > 100 ? text.substring(0, 100) + '...' : text;
            announce(`New message: ${preview}`, 'polite');
        }
    }

    /**
     * Announce navigation changes
     */
    function announceNavigation(pageName) {
        announce(`Navigated to ${pageName}`, 'polite');
    }

    /**
     * Announce loading states
     */
    function announceLoading(isLoading, context = '') {
        if (isLoading) {
            announce(`Loading ${context}...`, 'polite');
        } else {
            announce(`${context} loaded`, 'polite');
        }
    }

    // ========================================
    // FOCUS MANAGEMENT
    // ========================================

    /**
     * Ensure visible focus indicators
     */
    function ensureFocusVisible() {
        // Add CSS class to body when user is using keyboard
        let isUsingKeyboard = false;

        document.addEventListener('mousedown', () => {
            isUsingKeyboard = false;
            document.body.classList.remove('using-keyboard');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                isUsingKeyboard = true;
                document.body.classList.add('using-keyboard');
            }
        });
    }

    /**
     * Manage skip links
     */
    function setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.setAttribute('tabindex', '0');
        
        // Insert at the beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content') || 
                               document.querySelector('main') ||
                               document.querySelector('.chat-messages');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========================================
    // ARIA LABELS AND ROLES
    // ========================================

    function enhanceARIALabels() {
        // Chat messages region
        const chatMessages = document.querySelector('.chat-messages') || 
                            document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.setAttribute('role', 'log');
            chatMessages.setAttribute('aria-live', 'polite');
            chatMessages.setAttribute('aria-label', 'Chat conversation');
        }

        // Input controls
        const sendBtn = document.querySelector('.send-btn') || 
                       document.getElementById('sendBtn');
        if (sendBtn && !sendBtn.getAttribute('aria-label')) {
            sendBtn.setAttribute('aria-label', 'Send message');
        }

        const voiceBtn = document.querySelector('.input-voice-btn');
        if (voiceBtn && !voiceBtn.getAttribute('aria-label')) {
            voiceBtn.setAttribute('aria-label', 'Start voice input');
        }

        // Toggles
        const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
        toggles.forEach(toggle => {
            const label = toggle.getAttribute('data-toggle');
            if (label && !toggle.getAttribute('aria-label')) {
                toggle.setAttribute('aria-label', `Toggle ${label}`);
            }
        });

        console.log('[A11y] ARIA labels enhanced');
    }

    /**
     * Ensure proper heading hierarchy
     */
    function checkHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        let warnings = [];

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            
            if (index === 0 && level !== 1) {
                warnings.push('First heading should be h1');
            }
            
            if (level > lastLevel + 1) {
                warnings.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
            }
            
            lastLevel = level;
        });

        if (warnings.length > 0) {
            console.warn('[A11y] Heading hierarchy issues:', warnings);
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    function setupEventListeners() {
        // Listen for custom events from other modules
        
        // TTS events
        document.addEventListener('tts:playing', () => announceTTSStatus('playing'));
        document.addEventListener('tts:paused', () => announceTTSStatus('paused'));
        document.addEventListener('tts:stopped', () => announceTTSStatus('stopped'));
        document.addEventListener('tts:completed', () => announceTTSStatus('completed'));
        
        // Voice input events
        document.addEventListener('voice:start', () => announceRecordingStatus('started'));
        document.addEventListener('voice:stop', () => announceRecordingStatus('stopped'));
        document.addEventListener('voice:processing', () => announceRecordingStatus('processing'));
        document.addEventListener('voice:completed', () => announceRecordingStatus('completed'));
        
        // Chat events
        document.addEventListener('chat:send', (e) => {
            if (e.detail?.message) {
                announceMessage('sent', e.detail.message);
            }
        });
        
        document.addEventListener('chat:receive', (e) => {
            if (e.detail?.message) {
                announceMessage('received', e.detail.message);
            }
        });
        
        // Navigation events
        document.addEventListener('nav:change', (e) => {
            if (e.detail?.page) {
                announceNavigation(e.detail.page);
            }
        });
        
        // Loading events
        document.addEventListener('loading:start', (e) => {
            announceLoading(true, e.detail?.context || '');
        });
        
        document.addEventListener('loading:complete', (e) => {
            announceLoading(false, e.detail?.context || '');
        });
    }

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable) {
                return;
            }

            // Global shortcuts
            switch(e.key) {
                case '/':
                    // Focus chat input
                    e.preventDefault();
                    const chatInput = document.querySelector('.chat-input') || 
                                     document.getElementById('chatInput');
                    if (chatInput) {
                        chatInput.focus();
                        announce('Chat input focused', 'polite');
                    }
                    break;
                    
                case '?':
                    // Show keyboard shortcuts help
                    e.preventDefault();
                    showKeyboardShortcuts();
                    break;
            }
        });
    }

    function showKeyboardShortcuts() {
        const shortcuts = [
            '/ - Focus chat input',
            '? - Show keyboard shortcuts',
            'Esc - Close menu or modal',
            'Tab - Navigate forward',
            'Shift+Tab - Navigate backward'
        ];
        
        announce('Keyboard shortcuts: ' + shortcuts.join(', '), 'polite');
        console.log('[A11y] Keyboard shortcuts:', shortcuts);
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        // Create live regions
        createLiveRegions();
        
        // Set up focus management
        ensureFocusVisible();
        setupSkipLinks();
        
        // Enhance ARIA labels
        enhanceARIALabels();
        
        // Check heading hierarchy (dev mode only)
        if (window.PMERIT_DEBUG) {
            checkHeadingHierarchy();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts();
        
        console.log('[A11y] Accessibility enhancements initialized');
        announce('PMERIT platform loaded', 'polite');
    }

    // ========================================
    // PUBLIC API
    // ========================================

    window.PMERIT = window.PMERIT || {};
    window.PMERIT.a11y = {
        announce: announce,
        announceTTS: announceTTSStatus,
        announceRecording: announceRecordingStatus,
        announceMessage: announceMessage,
        announceNavigation: announceNavigation,
        announceLoading: announceLoading
    };

    // ========================================
    // INITIALIZE ON DOM READY
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
