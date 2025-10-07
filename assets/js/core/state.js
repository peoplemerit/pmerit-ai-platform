/**
 * PMERIT State Management
 * Version: 1.0
 * 
 * Centralized state management for the PMERIT application
 */

(function(window) {
    'use strict';

    // ============================================
    // STATE OBJECT
    // ============================================
    
    const PMERITState = {
        // User authentication
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            email: null,
            role: 'guest', // guest, learner, educator, admin
            assessmentCompleted: false
        },
        
        // Application settings
        settings: {
            theme: 'light', // light, dark
            language: 'en', // en, yo, ig, ha
            ttsEnabled: false,
            ttsVoice: 'default',
            ttsRate: 0.9,
            ttsPitch: 1,
            notificationsEnabled: true
        },
        
        // Feature toggles
        features: {
            virtualHumanActive: false,
            customerServiceActive: false,
            darkModeActive: false
        },
        
        // UI state
        ui: {
            menuOpen: false,
            activeModal: null,
            chatMinimized: false
        },
        
        // Chat state
        chat: {
            messages: [],
            isTyping: false,
            context: 'general' // general, assessment, support
        },
        
        // Assessment state
        assessment: {
            currentStep: 0,
            totalSteps: 0,
            answers: {},
            results: null
        },
        
        // Learning path
        learningPath: {
            track: null, // 'grc', 'lcp', 'up'
            courses: [],
            progress: {}
        }
    };

    // ============================================
    // STATE METHODS
    // ============================================
    
    const StateManager = {
        /**
         * Initialize state from localStorage
         */
        init: function() {
            this.loadFromStorage();
            console.log('✅ State Manager initialized');
        },
        
        /**
         * Load state from localStorage
         */
        loadFromStorage: function() {
            try {
                // Load theme
                const savedTheme = localStorage.getItem('pmerit-theme');
                if (savedTheme) {
                    PMERITState.settings.theme = savedTheme;
                }
                
                // Load language
                const savedLanguage = localStorage.getItem('pmerit-language');
                if (savedLanguage) {
                    PMERITState.settings.language = savedLanguage;
                }
                
                // Load TTS settings
                const ttsEnabled = localStorage.getItem('pmerit-tts-enabled');
                if (ttsEnabled !== null) {
                    PMERITState.settings.ttsEnabled = ttsEnabled === 'true';
                }
                
                // Load user data
                const userData = localStorage.getItem('pmerit-user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        PMERITState.user = { ...PMERITState.user, ...user };
                    } catch (e) {
                        console.error('Error parsing user data:', e);
                    }
                }
                
                // Load learning path
                const learningPath = localStorage.getItem('pmerit-learning-path');
                if (learningPath) {
                    try {
                        const path = JSON.parse(learningPath);
                        PMERITState.learningPath = { ...PMERITState.learningPath, ...path };
                    } catch (e) {
                        console.error('Error parsing learning path:', e);
                    }
                }
            } catch (error) {
                console.error('Error loading state from storage:', error);
            }
        },
        
        /**
         * Save state to localStorage
         */
        saveToStorage: function() {
            try {
                localStorage.setItem('pmerit-theme', PMERITState.settings.theme);
                localStorage.setItem('pmerit-language', PMERITState.settings.language);
                localStorage.setItem('pmerit-tts-enabled', PMERITState.settings.ttsEnabled.toString());
                
                // Save user data (excluding sensitive info)
                const userToSave = {
                    isAuthenticated: PMERITState.user.isAuthenticated,
                    name: PMERITState.user.name,
                    email: PMERITState.user.email,
                    role: PMERITState.user.role,
                    assessmentCompleted: PMERITState.user.assessmentCompleted
                };
                localStorage.setItem('pmerit-user', JSON.stringify(userToSave));
                
                // Save learning path
                localStorage.setItem('pmerit-learning-path', JSON.stringify(PMERITState.learningPath));
            } catch (error) {
                console.error('Error saving state to storage:', error);
            }
        },
        
        /**
         * Get current state
         */
        getState: function() {
            return PMERITState;
        },
        
        /**
         * Update theme
         */
        setTheme: function(theme) {
            PMERITState.settings.theme = theme;
            PMERITState.features.darkModeActive = (theme === 'dark');
            this.saveToStorage();
        },
        
        /**
         * Update language
         */
        setLanguage: function(language) {
            PMERITState.settings.language = language;
            this.saveToStorage();
        },
        
        /**
         * Toggle TTS
         */
        toggleTTS: function(enabled) {
            PMERITState.settings.ttsEnabled = enabled;
            this.saveToStorage();
        },
        
        /**
         * Toggle Virtual Human
         */
        toggleVirtualHuman: function(enabled) {
            PMERITState.features.virtualHumanActive = enabled;
        },
        
        /**
         * Toggle Customer Service
         */
        toggleCustomerService: function(enabled) {
            PMERITState.features.customerServiceActive = enabled;
        },
        
        /**
         * Set user authentication
         */
        setUser: function(userData) {
            PMERITState.user = { ...PMERITState.user, ...userData };
            this.saveToStorage();
        },
        
        /**
         * Log out user
         */
        logout: function() {
            PMERITState.user = {
                isAuthenticated: false,
                id: null,
                name: null,
                email: null,
                role: 'guest',
                assessmentCompleted: false
            };
            localStorage.removeItem('pmerit-user');
        },
        
        /**
         * Add chat message
         */
        addChatMessage: function(message) {
            PMERITState.chat.messages.push({
                ...message,
                timestamp: new Date().toISOString()
            });
        },
        
        /**
         * Clear chat messages
         */
        clearChat: function() {
            PMERITState.chat.messages = [];
        },
        
        /**
         * Set assessment data
         */
        setAssessment: function(data) {
            PMERITState.assessment = { ...PMERITState.assessment, ...data };
        },
        
        /**
         * Set learning path
         */
        setLearningPath: function(path) {
            PMERITState.learningPath = { ...PMERITState.learningPath, ...path };
            this.saveToStorage();
        },
        
        /**
         * Update course progress
         */
        updateProgress: function(courseId, progress) {
            PMERITState.learningPath.progress[courseId] = progress;
            this.saveToStorage();
        },
        
        /**
         * Reset state (useful for testing)
         */
        reset: function() {
            localStorage.clear();
            this.init();
        }
    };

    // ============================================
    // EXPORT
    // ============================================
    
    // Expose to window object
    window.PMERITState = PMERITState;
    window.PMERITStateManager = StateManager;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => StateManager.init());
    } else {
        StateManager.init();
    }

})(window);
