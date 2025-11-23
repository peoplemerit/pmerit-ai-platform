/**
 * PMERIT TTS Client
 * Handles text-to-speech generation using Cloudflare Workers AI with browser fallback
 * Features: API integration, quota management, voice selection, audio caching
 */

class TTSClient {
  constructor() {
    // API configuration
    this.apiUrl = 'https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts';
    this.quotaUrl = 'https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts/quota';
    
    // Audio cache (prevent duplicate API calls)
    this.cache = new Map();
    
    // Voice preference (persisted to localStorage)
    this.currentVoice = localStorage.getItem('tts_voice') || 'alloy';
    
    // Fallback mode tracking
    this.fallbackMode = false;
    
    // Current audio player
    this.currentAudio = null;
    
    // Quota info
    this.quotaRemaining = null;
    this.quotaLimit = 10000; // Daily limit
    
    console.log('[TTS Client] Initialized with voice:', this.currentVoice);
  }

  /**
   * Main speak method - tries API first, falls back to browser
   * @param {string} text - Text to convert to speech
   * @returns {Promise<void>}
   */
  async speak(text) {
    if (!text || text.trim().length === 0) {
      console.warn('[TTS Client] Empty text provided, skipping TTS');
      return;
    }

    try {
      // Try Cloudflare Workers AI API first
      await this.speakCloudflare(text);
    } catch (error) {
      console.warn('[TTS Client] API TTS failed, using browser fallback:', error.message);
      
      // Fall back to browser Web Speech API
      try {
        await this.speakBrowser(text);
      } catch (browserError) {
        console.error('[TTS Client] Browser TTS also failed:', browserError);
        // Silently fail - don't break the user experience
      }
    }
  }

  /**
   * Cloudflare Workers AI TTS implementation
   * @param {string} text - Text to convert to speech
   * @returns {Promise<void>}
   */
  async speakCloudflare(text) {
    // Check cache first
    const cacheKey = `${text}_${this.currentVoice}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('[TTS Client] Using cached audio');
      const audioUrl = this.cache.get(cacheKey);
      await this.playAudio(audioUrl);
      return;
    }

    console.log('[TTS Client] Requesting TTS from API...');

    // Make API request
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        voice: this.currentVoice
      })
    });

    // Handle quota exceeded
    if (response.status === 429) {
      console.warn('[TTS Client] Quota exceeded (429)');
      this.fallbackMode = true;
      throw new Error('Quota exceeded');
    }

    // Handle other errors
    if (!response.ok) {
      console.error('[TTS Client] API error:', response.status);
      throw new Error(`API error: ${response.status}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Error response from backend
      const errorData = await response.json();
      console.warn('[TTS Client] Backend error:', errorData);
      
      if (errorData.fallbackRequired) {
        throw new Error('Fallback required by backend');
      }
      
      throw new Error(errorData.error || 'Unknown error');
    }

    // Success - audio response
    console.log('[TTS Client] Audio received from API');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Cache the audio URL
    this.cache.set(cacheKey, audioUrl);
    
    // Play the audio
    await this.playAudio(audioUrl);
    
    // Update quota info if provided
    if (response.headers.get('x-quota-remaining')) {
      this.quotaRemaining = parseInt(response.headers.get('x-quota-remaining'));
      console.log('[TTS Client] Quota remaining:', this.quotaRemaining);
    }
  }

  /**
   * Browser Web Speech API fallback
   * @param {string} text - Text to convert to speech
   * @returns {Promise<void>}
   */
  speakBrowser(text) {
    return new Promise((resolve, reject) => {
      // Check browser support
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser does not support speech synthesis'));
        return;
      }

      console.log('[TTS Client] Using browser speech synthesis');

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      utterance.voice = this.getBrowserVoice();
      
      // Configure utterance
      utterance.rate = 1.0;  // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Event handlers
      utterance.onend = () => {
        console.log('[TTS Client] Browser speech completed');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('[TTS Client] Browser speech error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Speak
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Get appropriate browser voice based on selected TTS voice
   * @returns {SpeechSynthesisVoice|null}
   */
  getBrowserVoice() {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.warn('[TTS Client] No browser voices available');
      return null;
    }

    // Map TTS voice names to browser voice preferences
    const voiceMap = {
      'alloy': ['Google US English', 'Microsoft David', 'Alex'],
      'echo': ['Google UK English Male', 'Microsoft Mark', 'Daniel'],
      'fable': ['Google US English', 'Microsoft David', 'Alex'],
      'onyx': ['Google UK English Male', 'Microsoft Mark', 'Daniel'],
      'nova': ['Google US English Female', 'Microsoft Zira', 'Samantha'],
      'shimmer': ['Google UK English Female', 'Microsoft Zira', 'Karen']
    };

    // Get preferences for current voice
    const preferences = voiceMap[this.currentVoice] || [];

    // Try to find matching voice
    for (const preference of preferences) {
      const voice = voices.find(v => v.name.includes(preference));
      if (voice) {
        console.log('[TTS Client] Selected browser voice:', voice.name);
        return voice;
      }
    }

    // Default to first English voice
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      console.log('[TTS Client] Using default English voice:', englishVoice.name);
      return englishVoice;
    }

    // Fallback to first available voice
    console.log('[TTS Client] Using first available voice:', voices[0].name);
    return voices[0];
  }

  /**
   * Play audio from URL
   * @param {string} audioUrl - URL of audio to play
   * @returns {Promise<void>}
   */
  playAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      // Stop current audio if playing
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      // Event handlers
      audio.onended = () => {
        console.log('[TTS Client] Audio playback completed');
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (error) => {
        console.error('[TTS Client] Audio playback error:', error);
        this.currentAudio = null;
        reject(new Error('Audio playback failed'));
      };

      // Start playback
      audio.play().catch(error => {
        console.error('[TTS Client] Audio play failed:', error);
        reject(error);
      });
    });
  }

  /**
   * Stop any ongoing speech
   */
  stop() {
    // Stop API audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // Stop browser speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    console.log('[TTS Client] Speech stopped');
  }

  /**
   * Change voice preference
   * @param {string} voice - Voice ID (alloy, echo, fable, onyx, nova, shimmer)
   */
  setVoice(voice) {
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    
    if (!validVoices.includes(voice)) {
      console.error('[TTS Client] Invalid voice:', voice);
      return;
    }

    this.currentVoice = voice;
    localStorage.setItem('tts_voice', voice);
    console.log('[TTS Client] Voice changed to:', voice);

    // Clear cache when voice changes (force regeneration)
    this.cache.clear();
  }

  /**
   * Get current voice preference
   * @returns {string}
   */
  getVoice() {
    return this.currentVoice;
  }

  /**
   * Check TTS quota from API
   * @returns {Promise<Object>}
   */
  async checkQuota() {
    try {
      const response = await fetch(this.quotaUrl);
      
      if (!response.ok) {
        throw new Error(`Quota check failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.quota) {
        this.quotaRemaining = data.quota.remaining;
        this.quotaLimit = data.quota.limit;
        
        console.log('[TTS Client] Quota:', this.quotaRemaining, '/', this.quotaLimit);
        
        return {
          remaining: this.quotaRemaining,
          limit: this.quotaLimit,
          percentage: (this.quotaRemaining / this.quotaLimit) * 100
        };
      }

      // Quota tracking not available
      return {
        remaining: null,
        limit: this.quotaLimit,
        percentage: null
      };

    } catch (error) {
      console.error('[TTS Client] Quota check error:', error);
      return {
        remaining: null,
        limit: this.quotaLimit,
        percentage: null
      };
    }
  }

  /**
   * Clear audio cache
   */
  clearCache() {
    // Revoke all blob URLs to free memory
    for (const [key, url] of this.cache.entries()) {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
    
    this.cache.clear();
    console.log('[TTS Client] Cache cleared');
  }

  /**
   * Check if browser supports Web Speech API
   * @returns {boolean}
   */
  static isBrowserSupported() {
    return 'speechSynthesis' in window;
  }

  /**
   * Check if quota warning should be shown
   * @returns {boolean}
   */
  shouldShowQuotaWarning() {
    if (this.quotaRemaining === null) {
      return false;
    }
    
    // Show warning when below 1000 characters (10%)
    return this.quotaRemaining < 1000;
  }

  /**
   * Check if quota is exceeded
   * @returns {boolean}
   */
  isQuotaExceeded() {
    if (this.quotaRemaining === null) {
      return false;
    }
    
    return this.quotaRemaining <= 0;
  }
}

// Initialize global TTS client
console.log('[TTS Client] Creating global instance...');
window.TTSClient = new TTSClient();

// Load browser voices when available
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('[TTS Client] Browser voices loaded:', window.speechSynthesis.getVoices().length);
  };
}

console.log('[TTS Client] Ready! Usage: window.TTSClient.speak("Hello world")');