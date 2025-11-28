/**
 * PMERIT Chat Input Handler
 * Phase 8.4 - Thumb-Reach & Safe-Area Support
 * Version: 1.0
 * 
 * Features:
 * - Handles mobile keyboard appearance/disappearance
 * - Prevents viewport resize thrash using visualViewport API
 * - Auto-expands textarea up to 3 lines
 * - Character counter
 * - Send button enable/disable
 * - Voice input toggle
 */

(function() {
    'use strict';

    // ========================================
    // STATE
    // ========================================
    const inputState = {
        isKeyboardOpen: false,
        originalViewportHeight: 0,
        isRecording: false,
        charLimit: 1000
    };

    // ========================================
    // DOM ELEMENTS
    // ========================================
    let chatInput;
    let sendBtn;
    let voiceBtn;
    let charCounter;
    let inputContainer;

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Get DOM elements
        chatInput = document.getElementById('chatInput') || document.querySelector('.chat-input');
        sendBtn = document.getElementById('sendBtn') || document.querySelector('.send-btn');
        voiceBtn = document.querySelector('.input-voice-btn');
        charCounter = document.getElementById('charCount') || document.querySelector('.char-counter');
        inputContainer = document.querySelector('.chat-input-container');

        if (!chatInput || !sendBtn) {
            console.warn('[ChatInput] Required elements not found');
            return;
        }

        // Store original viewport height
        inputState.originalViewportHeight = window.innerHeight;

        // Set up event listeners
        setupEventListeners();
        
        // Initial state
        updateSendButton();
        
        // Use visualViewport API if available (Phase 8.4)
        setupVisualViewport();

        logger.debug('[ChatInput] Chat input handler initialized');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function setupEventListeners() {
        // Input events
        chatInput.addEventListener('input', handleInput);
        chatInput.addEventListener('keydown', handleKeyDown);
        
        // Send button
        sendBtn.addEventListener('click', handleSend);
        
        // Voice button
        if (voiceBtn) {
            voiceBtn.addEventListener('click', handleVoiceToggle);
        }
        
        // Focus/blur events
        chatInput.addEventListener('focus', handleFocus);
        chatInput.addEventListener('blur', handleBlur);
        
        // Window resize (fallback for browsers without visualViewport)
        window.addEventListener('resize', handleResize);
    }

    // ========================================
    // VISUAL VIEWPORT API (Phase 8.4)
    // Prevents viewport resize thrash on mobile keyboard
    // ========================================
    function setupVisualViewport() {
        if (!window.visualViewport) {
            logger.debug('[ChatInput] visualViewport API not available, using fallback');
            return;
        }

        window.visualViewport.addEventListener('resize', () => {
            const viewportHeight = window.visualViewport.height;
            const wasKeyboardOpen = inputState.isKeyboardOpen;
            
            // Detect keyboard open/close
            inputState.isKeyboardOpen = viewportHeight < inputState.originalViewportHeight * 0.85;
            
            // Adjust input container if needed
            if (inputState.isKeyboardOpen && !wasKeyboardOpen) {
                handleKeyboardOpen();
            } else if (!inputState.isKeyboardOpen && wasKeyboardOpen) {
                handleKeyboardClose();
            }
        });

        window.visualViewport.addEventListener('scroll', () => {
            // Ensure input container stays visible when keyboard is open
            if (inputState.isKeyboardOpen && inputContainer) {
                const offset = window.visualViewport.offsetTop;
                inputContainer.style.transform = `translateY(${offset}px)`;
            }
        });
    }

    // ========================================
    // INPUT HANDLING
    // ========================================
    function handleInput(e) {
        const text = chatInput.value;
        const length = text.length;

        // Update character counter
        if (charCounter) {
            charCounter.textContent = `${length}/${inputState.charLimit}`;
            
            // Show/hide counter
            if (length > 0) {
                charCounter.classList.remove('hidden');
            } else {
                charCounter.classList.add('hidden');
            }
            
            // Warning/error states
            charCounter.classList.toggle('warning', length > inputState.charLimit * 0.9);
            charCounter.classList.toggle('error', length >= inputState.charLimit);
        }

        // Auto-expand textarea (up to 3 lines - Phase 8.4)
        autoExpandTextarea();

        // Update send button state
        updateSendButton();
    }

    function handleKeyDown(e) {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function autoExpandTextarea() {
        // Reset height to get proper scrollHeight
        chatInput.style.height = 'auto';
        
        // Calculate new height (max 3 lines ≈ 72px)
        const maxHeight = 72;
        const newHeight = Math.min(chatInput.scrollHeight, maxHeight);
        
        chatInput.style.height = `${newHeight}px`;
    }

    // ========================================
    // SEND HANDLING
    // ========================================
    function handleSend() {
        const text = chatInput.value.trim();
        
        if (!text || text.length === 0) {
            return;
        }

        if (text.length > inputState.charLimit) {
            showToast('Message too long. Please shorten your message.', 'warning');
            return;
        }

        logger.debug('[ChatInput] Sending message:', text);

        // Dispatch custom event
        const event = new CustomEvent('chat:send', {
            detail: { message: text },
            bubbles: true
        });
        chatInput.dispatchEvent(event);

        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Update UI
        if (charCounter) {
            charCounter.textContent = `0/${inputState.charLimit}`;
            charCounter.classList.add('hidden');
        }
        updateSendButton();

        // Analytics
        trackEvent('chat_input_send', {
            messageLength: text.length,
            linesCount: text.split('\n').length
        });
    }

    function updateSendButton() {
        const text = chatInput.value.trim();
        const hasText = text.length > 0;
        
        sendBtn.disabled = !hasText;
        sendBtn.setAttribute('aria-disabled', !hasText);
    }

    // ========================================
    // VOICE INPUT
    // ========================================
    function handleVoiceToggle() {
        if (inputState.isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        logger.debug('[ChatInput] Starting voice recording');
        
        inputState.isRecording = true;
        voiceBtn.classList.add('recording');
        voiceBtn.setAttribute('aria-label', 'Stop recording');
        
        // Dispatch event for STT module
        const event = new CustomEvent('voice:start', { bubbles: true });
        voiceBtn.dispatchEvent(event);
        
        // Analytics
        trackEvent('voice_input_start', {
            inputMethod: 'microphone'
        });
    }

    function stopRecording() {
        logger.debug('[ChatInput] Stopping voice recording');
        
        inputState.isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.setAttribute('aria-label', 'Voice input');
        
        // Dispatch event for STT module
        const event = new CustomEvent('voice:stop', { bubbles: true });
        voiceBtn.dispatchEvent(event);
        
        // Analytics
        trackEvent('voice_input_stop', {
            duration: 0 // Would be calculated by STT module
        });
    }

    // ========================================
    // KEYBOARD DETECTION
    // ========================================
    function handleFocus() {
        logger.debug('[ChatInput] Input focused');
        
        // Track analytics
        trackEvent('chat_input_focus', {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }

    function handleBlur() {
        logger.debug('[ChatInput] Input blurred');
    }

    function handleKeyboardOpen() {
        logger.debug('[ChatInput] Mobile keyboard opened');
        
        // Ensure input stays visible
        if (inputContainer) {
            inputContainer.classList.add('keyboard-open');
        }
        
        // Scroll to keep input in view
        setTimeout(() => {
            chatInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        // Analytics
        trackEvent('keyboard_open', {
            viewport: {
                width: window.innerWidth,
                height: window.visualViewport ? window.visualViewport.height : window.innerHeight
            }
        });
    }

    function handleKeyboardClose() {
        logger.debug('[ChatInput] Mobile keyboard closed');
        
        if (inputContainer) {
            inputContainer.classList.remove('keyboard-open');
            inputContainer.style.transform = '';
        }
        
        // Analytics
        trackEvent('keyboard_close');
    }

    function handleResize() {
        // Fallback for browsers without visualViewport
        if (window.visualViewport) return;
        
        const currentHeight = window.innerHeight;
        const heightDiff = inputState.originalViewportHeight - currentHeight;
        
        // Threshold to detect keyboard (200px difference)
        if (heightDiff > 200 && !inputState.isKeyboardOpen) {
            inputState.isKeyboardOpen = true;
            handleKeyboardOpen();
        } else if (heightDiff < 100 && inputState.isKeyboardOpen) {
            inputState.isKeyboardOpen = false;
            handleKeyboardClose();
        }
    }

    // ========================================
    // UTILITIES
    // ========================================
    function showToast(message, type = 'info') {
        // Simple toast notification
        logger.debug(`[Toast ${type}]:`, message);
        
        // Could integrate with a toast library or custom implementation
        if (window.PMERIT?.toast) {
            window.PMERIT.toast(message, type);
        }
    }

    function trackEvent(eventName, data = {}) {
        if (window.analytics?.track) {
            window.analytics.track(eventName, {
                ...data,
                timestamp: Date.now()
            });
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================
    window.PMERIT = window.PMERIT || {};
    window.PMERIT.chatInput = {
        focus: () => chatInput?.focus(),
        clear: () => {
            if (chatInput) {
                chatInput.value = '';
                handleInput();
            }
        },
        getText: () => chatInput?.value || '',
        setText: (text) => {
            if (chatInput) {
                chatInput.value = text;
                handleInput();
            }
        }
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
