/**
 * PMERIT Voice/Text-to-Speech Module
 * Version: 1.0
 * 
 * Handles text-to-speech functionality using Web Speech API
 */

(function(window) {
    'use strict';

    // ============================================
    // VOICE MANAGER
    // ============================================
    
    const VoiceManager = {
        synthesis: null,
        voices: [],
        currentUtterance: null,
        settings: {
            rate: 0.9,
            pitch: 1.0,
            volume: 1.0,
            voice: null,
            language: 'en-US'
        },
        
        /**
         * Initialize Voice Manager
         */
        init: function() {
            if ('speechSynthesis' in window) {
                this.synthesis = window.speechSynthesis;
                
                // Load voices
                this.loadVoices();
                
                // Listen for voices changed event (needed for some browsers)
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = () => this.loadVoices();
                }
                
                // Load saved settings
                this.loadSettings();
                
                console.log('✅ Voice Manager initialized');
            } else {
                console.warn('Text-to-Speech not supported in this browser');
            }
        },
        
        /**
         * Load available voices
         */
        loadVoices: function() {
            if (!this.synthesis) return;
            
            this.voices = this.synthesis.getVoices();
            
            // Set default voice if not set
            if (!this.settings.voice && this.voices.length > 0) {
                // Try to find an English voice
                const englishVoice = this.voices.find(voice => 
                    voice.lang.startsWith('en')
                );
                this.settings.voice = englishVoice || this.voices[0];
            }
        },
        
        /**
         * Load settings from localStorage
         */
        loadSettings: function() {
            try {
                const savedSettings = localStorage.getItem('pmerit-tts-settings');
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    this.settings = { ...this.settings, ...settings };
                }
            } catch (error) {
                console.error('Error loading TTS settings:', error);
            }
        },
        
        /**
         * Save settings to localStorage
         */
        saveSettings: function() {
            try {
                localStorage.setItem('pmerit-tts-settings', JSON.stringify(this.settings));
            } catch (error) {
                console.error('Error saving TTS settings:', error);
            }
        },
        
        /**
         * Speak text
         */
        speak: function(text, options = {}) {
            if (!this.synthesis) {
                console.warn('Speech synthesis not available');
                return;
            }
            
            // Cancel any ongoing speech
            this.cancel();
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Apply settings
            utterance.rate = options.rate || this.settings.rate;
            utterance.pitch = options.pitch || this.settings.pitch;
            utterance.volume = options.volume || this.settings.volume;
            utterance.lang = options.language || this.settings.language;
            
            // Set voice
            if (options.voice) {
                utterance.voice = this.getVoiceByName(options.voice);
            } else if (this.settings.voice) {
                utterance.voice = this.settings.voice;
            }
            
            // Event handlers
            utterance.onstart = () => {
                console.log('Speech started');
                this.onSpeechStart(text);
            };
            
            utterance.onend = () => {
                console.log('Speech ended');
                this.onSpeechEnd();
            };
            
            utterance.onerror = (event) => {
                console.error('Speech error:', event);
                this.onSpeechError(event);
            };
            
            // Store current utterance
            this.currentUtterance = utterance;
            
            // Speak
            this.synthesis.speak(utterance);
        },
        
        /**
         * Pause speech
         */
        pause: function() {
            if (this.synthesis && this.synthesis.speaking) {
                this.synthesis.pause();
            }
        },
        
        /**
         * Resume speech
         */
        resume: function() {
            if (this.synthesis && this.synthesis.paused) {
                this.synthesis.resume();
            }
        },
        
        /**
         * Cancel speech
         */
        cancel: function() {
            if (this.synthesis) {
                this.synthesis.cancel();
            }
        },
        
        /**
         * Check if currently speaking
         */
        isSpeaking: function() {
            return this.synthesis && this.synthesis.speaking;
        },
        
        /**
         * Check if paused
         */
        isPaused: function() {
            return this.synthesis && this.synthesis.paused;
        },
        
        /**
         * Get voice by name
         */
        getVoiceByName: function(name) {
            return this.voices.find(voice => 
                voice.name.toLowerCase().includes(name.toLowerCase())
            );
        },
        
        /**
         * Get voices by language
         */
        getVoicesByLanguage: function(lang) {
            return this.voices.filter(voice => 
                voice.lang.startsWith(lang)
            );
        },
        
        /**
         * Get all available voices
         */
        getVoices: function() {
            return this.voices;
        },
        
        /**
         * Set speech rate (0.1 to 10)
         */
        setRate: function(rate) {
            this.settings.rate = Math.max(0.1, Math.min(10, rate));
            this.saveSettings();
        },
        
        /**
         * Set speech pitch (0 to 2)
         */
        setPitch: function(pitch) {
            this.settings.pitch = Math.max(0, Math.min(2, pitch));
            this.saveSettings();
        },
        
        /**
         * Set speech volume (0 to 1)
         */
        setVolume: function(volume) {
            this.settings.volume = Math.max(0, Math.min(1, volume));
            this.saveSettings();
        },
        
        /**
         * Set voice
         */
        setVoice: function(voice) {
            if (typeof voice === 'string') {
                this.settings.voice = this.getVoiceByName(voice);
            } else {
                this.settings.voice = voice;
            }
            this.saveSettings();
        },
        
        /**
         * Set language
         */
        setLanguage: function(lang) {
            this.settings.language = lang;
            
            // Try to find a voice for this language
            const voices = this.getVoicesByLanguage(lang);
            if (voices.length > 0) {
                this.settings.voice = voices[0];
            }
            
            this.saveSettings();
        },
        
        /**
         * Preview voice with sample text
         */
        previewVoice: function(voiceName, text = 'Welcome to PMERIT. Empowering learning through innovation.') {
            const voice = this.getVoiceByName(voiceName);
            if (voice) {
                this.speak(text, { voice });
            }
        },
        
        /**
         * Get voice categories
         */
        getVoiceCategories: function() {
            const categories = {
                male: [],
                female: [],
                other: []
            };
            
            this.voices.forEach(voice => {
                const nameLower = voice.name.toLowerCase();
                if (nameLower.includes('male') && !nameLower.includes('female')) {
                    categories.male.push(voice);
                } else if (nameLower.includes('female')) {
                    categories.female.push(voice);
                } else {
                    categories.other.push(voice);
                }
            });
            
            return categories;
        },
        
        /**
         * Get voice by type (male, female, default)
         */
        getVoiceByType: function(type) {
            const categories = this.getVoiceCategories();
            
            if (type === 'male' && categories.male.length > 0) {
                return categories.male[0];
            } else if (type === 'female' && categories.female.length > 0) {
                return categories.female[0];
            } else if (categories.other.length > 0) {
                return categories.other[0];
            }
            
            return this.voices[0];
        },
        
        // Event callbacks (can be overridden)
        onSpeechStart: function(text) {
            // Override this method to handle speech start events
        },
        
        onSpeechEnd: function() {
            // Override this method to handle speech end events
        },
        
        onSpeechError: function(event) {
            // Override this method to handle speech errors
        }
    };

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    /**
     * Quick speak function
     */
    function speak(text, options) {
        VoiceManager.speak(text, options);
    }
    
    /**
     * Quick cancel function
     */
    function stopSpeaking() {
        VoiceManager.cancel();
    }

    // ============================================
    // EXPORT
    // ============================================
    
    window.PMERITVoice = VoiceManager;
    window.speak = speak;
    window.stopSpeaking = stopSpeaking;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VoiceManager.init());
    } else {
        VoiceManager.init();
    }

})(window);
