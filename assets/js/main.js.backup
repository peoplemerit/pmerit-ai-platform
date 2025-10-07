/**
 * PMERIT Main JavaScript
 * Version: 3.0 - Mobile-First Implementation
 * 
 * Handles all UI interactions for mobile and desktop
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const AppState = {
        theme: localStorage.getItem('pmerit-theme') || 'light',
        language: localStorage.getItem('pmerit-language') || 'en',
        virtualHumanActive: false,
        customerServiceActive: false,
        ttsEnabled: false,
        menuOpen: false
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const DOM = {
        // Header
        hamburgerToggle: document.getElementById('hamburgerToggle'),
        menuOverlay: document.getElementById('menuOverlay'),
        hamburgerMenu: document.getElementById('hamburgerMenu'),
        menuCloseBtn: document.getElementById('menuCloseBtn'),
        signInBtn: document.getElementById('signInBtn'),
        languageBtn: document.getElementById('languageBtn'),
        
        // Modals
        authModal: document.getElementById('authModal'),
        authModalClose: document.getElementById('authModalClose'),
        signInForm: document.getElementById('signInForm'),
        signUpForm: document.getElementById('signUpForm'),
        showSignUpBtn: document.getElementById('showSignUpBtn'),
        showSignInBtn: document.getElementById('showSignInBtn'),
        languageModal: document.getElementById('languageModal'),
        languageModalClose: document.getElementById('languageModalClose'),
        careerModal: document.getElementById('careerModal'),
        careerModalClose: document.getElementById('careerModalClose'),
        
        // Menu toggles
        virtualHumanToggle: document.getElementById('virtualHumanToggle'),
        customerServiceToggle: document.getElementById('customerServiceToggle'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        ttsToggle: document.getElementById('ttsToggle'),
        
        // Menu buttons
        careerTrackBtn: document.getElementById('careerTrackBtn'),
        previewVoicesBtn: document.getElementById('previewVoicesBtn'),
        dashboardBtn: document.getElementById('dashboardBtn'),
        beginAssessmentBtn: document.getElementById('beginAssessmentBtn'),
        
        // Chat
        chatMessages: document.getElementById('chatMessages'),
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn'),
        charCount: document.getElementById('charCount'),
        
        // Footer
        privacyTermsBtn: document.getElementById('privacyTermsBtn')
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🚀 PMERIT Initializing...');
        
        // Apply saved theme
        applyTheme(AppState.theme);
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize chat
        initChat();
        
        console.log('✅ PMERIT Ready');
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function setupEventListeners() {
        // Hamburger menu
        if (DOM.hamburgerToggle) {
            DOM.hamburgerToggle.addEventListener('click', toggleMenu);
        }
        
        if (DOM.menuCloseBtn) {
            DOM.menuCloseBtn.addEventListener('click', closeMenu);
        }
        
        if (DOM.menuOverlay) {
            DOM.menuOverlay.addEventListener('click', closeMenu);
        }
        
        // Sign In/Sign Up
        if (DOM.signInBtn) {
            DOM.signInBtn.addEventListener('click', () => openAuthModal('signin'));
        }
        
        if (DOM.authModalClose) {
            DOM.authModalClose.addEventListener('click', () => closeModal(DOM.authModal));
        }
        
        if (DOM.showSignUpBtn) {
            DOM.showSignUpBtn.addEventListener('click', () => switchAuthForm('signup'));
        }
        
        if (DOM.showSignInBtn) {
            DOM.showSignInBtn.addEventListener('click', () => switchAuthForm('signin'));
        }
        
        // Language switcher
        if (DOM.languageBtn) {
            DOM.languageBtn.addEventListener('click', () => openModal(DOM.languageModal));
        }
        
        if (DOM.languageModalClose) {
            DOM.languageModalClose.addEventListener('click', () => closeModal(DOM.languageModal));
        }
        
        // Language options
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.dataset.lang;
                changeLanguage(lang);
                closeModal(DOM.languageModal);
            });
        });
        
        // Menu toggles
        if (DOM.virtualHumanToggle) {
            DOM.virtualHumanToggle.addEventListener('change', function() {
                toggleVirtualHuman(this.checked);
            });
        }
        
        if (DOM.customerServiceToggle) {
            DOM.customerServiceToggle.addEventListener('change', function() {
                toggleCustomerService(this.checked);
            });
        }
        
        if (DOM.darkModeToggle) {
            DOM.darkModeToggle.addEventListener('change', function() {
                toggleDarkMode(this.checked);
            });
        }
        
        if (DOM.ttsToggle) {
            DOM.ttsToggle.addEventListener('change', function() {
                toggleTTS(this.checked);
            });
        }
        
        // Menu buttons
        if (DOM.careerTrackBtn) {
            DOM.careerTrackBtn.addEventListener('click', () => openCareerTracks());
        }
        
        if (DOM.previewVoicesBtn) {
            DOM.previewVoicesBtn.addEventListener('click', () => previewVoices());
        }
        
        if (DOM.dashboardBtn) {
            DOM.dashboardBtn.addEventListener('click', () => navigateToDashboard());
        }
        
        if (DOM.beginAssessmentBtn) {
            DOM.beginAssessmentBtn.addEventListener('click', () => navigateToAssessment());
        }
        
        // Chat
        if (DOM.sendBtn) {
            DOM.sendBtn.addEventListener('click', sendMessage);
        }
        
        if (DOM.chatInput) {
            DOM.chatInput.addEventListener('input', updateCharCount);
            DOM.chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Auto-resize textarea
            DOM.chatInput.addEventListener('input', autoResizeTextarea);
        }
        
        // Footer
        if (DOM.privacyTermsBtn) {
            DOM.privacyTermsBtn.addEventListener('click', () => showPrivacyTerms());
        }
        
        // Close modals on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
                if (AppState.menuOpen) {
                    closeMenu();
                }
            }
        });
    }

    // ============================================
    // MENU FUNCTIONS
    // ============================================
    
    function toggleMenu() {
        AppState.menuOpen = !AppState.menuOpen;
        
        if (AppState.menuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }
    
    function openMenu() {
        AppState.menuOpen = true;
        DOM.hamburgerMenu.setAttribute('aria-hidden', 'false');
        DOM.menuOverlay.setAttribute('aria-hidden', 'false');
        DOM.hamburgerToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        AppState.menuOpen = false;
        DOM.hamburgerMenu.setAttribute('aria-hidden', 'true');
        DOM.menuOverlay.setAttribute('aria-hidden', 'true');
        DOM.hamburgerToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // ============================================
    // MODAL FUNCTIONS
    // ============================================
    
    function openModal(modal) {
        if (modal) {
            modal.showModal();
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.close();
        }
    }
    
    function closeAllModals() {
        document.querySelectorAll('dialog[open]').forEach(dialog => {
            dialog.close();
        });
    }
    
    function openAuthModal(mode) {
        if (mode === 'signup') {
            DOM.signInForm.style.display = 'none';
            DOM.signUpForm.style.display = 'block';
        } else {
            DOM.signInForm.style.display = 'block';
            DOM.signUpForm.style.display = 'none';
        }
        openModal(DOM.authModal);
    }
    
    function switchAuthForm(mode) {
        if (mode === 'signup') {
            DOM.signInForm.style.display = 'none';
            DOM.signUpForm.style.display = 'block';
        } else {
            DOM.signInForm.style.display = 'block';
            DOM.signUpForm.style.display = 'none';
        }
    }

    // ============================================
    // THEME FUNCTIONS
    // ============================================
    
    function toggleDarkMode(enabled) {
        const theme = enabled ? 'dark' : 'light';
        applyTheme(theme);
        AppState.theme = theme;
        localStorage.setItem('pmerit-theme', theme);
        
        showToast(`${enabled ? 'Dark' : 'Light'} mode enabled`);
    }
    
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        if (DOM.darkModeToggle) {
            DOM.darkModeToggle.checked = (theme === 'dark');
        }
    }

    // ============================================
    // FEATURE TOGGLES
    // ============================================
    
    function toggleVirtualHuman(enabled) {
        AppState.virtualHumanActive = enabled;
        
        const vhAvatarSection = document.getElementById('vhAvatarSection');
        if (vhAvatarSection) {
            vhAvatarSection.style.display = enabled ? 'block' : 'none';
        }
        
        showToast(`Virtual Human ${enabled ? 'activated' : 'deactivated'}`);
        
        if (enabled) {
            addAIMessage('Virtual Human mode activated. I\'m now using visual representation to enhance our interaction.');
        }
    }
    
    function toggleCustomerService(enabled) {
        AppState.customerServiceActive = enabled;
        showToast(`Customer Service mode ${enabled ? 'activated' : 'deactivated'}`);
        
        if (enabled) {
            addAIMessage('Customer Service mode activated. How can I assist you today?');
        }
    }
    
    function toggleTTS(enabled) {
        AppState.ttsEnabled = enabled;
        showToast(`Text-to-Speech ${enabled ? 'enabled' : 'disabled'}`);
    }

    // ============================================
    // CHAT FUNCTIONS
    // ============================================
    
    function initChat() {
        // Add welcome message if chat is empty
        if (DOM.chatMessages && DOM.chatMessages.children.length === 0) {
            addAIMessage('Hello! I\'m here to help you explore courses, career paths, and answer any questions about your learning journey. What would you like to know?');
        }
    }
    
    function sendMessage() {
        const message = DOM.chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        addUserMessage(message);
        
        // Clear input
        DOM.chatInput.value = '';
        updateCharCount();
        autoResizeTextarea();
        
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const response = generateAIResponse(message);
            addAIMessage(response);
        }, 1000);
    }
    
    function addUserMessage(text) {
        const bubble = createChatBubble('user', text);
        DOM.chatMessages.appendChild(bubble);
        scrollToBottom();
    }
    
    function addAIMessage(text) {
        const bubble = createChatBubble('ai', text);
        DOM.chatMessages.appendChild(bubble);
        scrollToBottom();
        
        // Speak message if TTS is enabled
        if (AppState.ttsEnabled) {
            speakText(text);
        }
    }
    
    function createChatBubble(type, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}-bubble`;
        
        const avatar = document.createElement('div');
        avatar.className = 'bubble-avatar';
        avatar.innerHTML = type === 'ai'
