/**
 * PMERIT TTS Module
 * Phase 10: Cloudflare Workers AI TTS Integration
 *
 * Provides browser-based TTS with Web Speech API fallback,
 * Cloudflare Workers AI integration, WebAudio analysis for viseme hints,
 * and optional server-side TTS proxy with voice engine selection.
 */

(function (window) {
  'use strict';

  // Event bus via document
  const BUS = document;

  // Helper to get page identifier for analytics
  function aid() {
    return location.pathname.includes('/portal/classroom') ? 'classroom' : 'home';
  }

  // Audio context and analyzer state
  let audioCtx = null;
  let analyser = null;
  let source = null;
  let meterInterval = null;

  // TTS state management (module-level)
  let isSpeaking = false;

  // Constants
  const INTENSITY_AMPLIFIER = 2; // Amplify intensity for more visible mouth movement
  const VISEME_UPDATE_INTERVAL = 33; // ~30 FPS
  const SERVER_TTS_TIMEOUT = 30000; // 30 seconds timeout for server TTS requests
  const MAX_TEXT_LENGTH = 5000; // Maximum text length for TTS

  // TTS Settings - Voice Engine Selection
  const SETTINGS_KEY = 'pmerit_tts_settings';
  const AVAILABLE_ENGINES = {
    'aura-2-en': 'Deepgram Aura 2 (English)',
    'aura-1': 'Deepgram Aura 1',
    'melotts': 'MeloTTS',
    'aura-2-es': 'Deepgram Aura 2 (Spanish)',
    'browser': 'Browser (Web Speech API)'
  };

  /**
   * Get TTS settings from localStorage
   * @returns {Object} settings object
   */
  function getSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load TTS settings:', e);
    }
    // Default settings
    return {
      voiceEngine: 'aura-2-en',
      useServer: true
    };
  }

  /**
   * Save TTS settings to localStorage
   * @param {Object} settings - settings object
   */
  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save TTS settings:', e);
    }
  }

  /**
   * Start audio metering from MediaStream
   * Emits tts:viseme events with intensity [0..1] at ~30 FPS
   * @private
   */
  function startMeterFromMediaStream(stream) {
    stopMeter();

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      meterInterval = setInterval(() => {
        analyser.getByteFrequencyData(data);

        // Calculate crude energy → intensity
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i];
        }
        const intensity = Math.min(1, (sum / (data.length * 255)) * INTENSITY_AMPLIFIER);

        // Emit viseme event with intensity
        BUS.dispatchEvent(new CustomEvent('tts:viseme', {
          detail: { intensity }
        }));
      }, VISEME_UPDATE_INTERVAL);
    } catch (error) {
      console.error('Failed to start audio meter:', error);
    }
  }

  /**
   * Start audio metering from Audio element
   * @private
   */
  function startMeterFromAudio(audioElement) {
    stopMeter();

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaElementSource(audioElement);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;

      // Connect: audio element -> analyser -> destination (speakers)
      // Note: Audio element output is rerouted through the analyser
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);

      meterInterval = setInterval(() => {
        analyser.getByteFrequencyData(data);

        // Calculate crude energy → intensity
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i];
        }
        const intensity = Math.min(1, (sum / (data.length * 255)) * INTENSITY_AMPLIFIER);

        // Emit viseme event with intensity
        BUS.dispatchEvent(new CustomEvent('tts:viseme', {
          detail: { intensity }
        }));
      }, VISEME_UPDATE_INTERVAL);
    } catch (error) {
      console.error('Failed to start audio meter:', error);
    }
  }

  /**
   * Stop audio metering
   * @private
   */
  function stopMeter() {
    if (meterInterval) {
      clearInterval(meterInterval);
      meterInterval = null;
    }

    try {
      if (source) {
        source.disconnect();
      }
    } catch (e) {
      // Ignore disconnect errors
    }

    try {
      if (audioCtx) {
        audioCtx.close();
      }
    } catch (e) {
      // Ignore close errors
    }

    source = null;
    analyser = null;
    audioCtx = null;
  }

  /**
   * Speak text using Web Speech API
   * @param {string} text - Text to speak
   * @param {string} voiceName - Optional voice name
   * @returns {Promise<void>}
   */
  function speakWebSpeech(text, voiceName) {
    return new Promise((resolve, reject) => {
      // Validate input
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return reject(new Error('Text is required and must be a non-empty string'));
      }

      if (text.length > MAX_TEXT_LENGTH) {
        return reject(new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`));
      }

      if (!window.speechSynthesis) {
        return reject(new Error('speechSynthesis not supported'));
      }

      const utter = new SpeechSynthesisUtterance(text);

      // Set voice if specified
      if (voiceName) {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
          utter.voice = voice;
        }
      }

      const startTime = Date.now();

      // Event handlers
      utter.onstart = () => {
        BUS.dispatchEvent(new CustomEvent('tts:start', { detail: { text, engine: 'browser' } }));

        // Emit analytics event
        window.analytics?.track('tts_start', {
          page: aid(),
          ts: startTime,
          textChars: text.length,
          engine: 'browser',
          source: 'web_speech_api'
        });
      };

      utter.onend = () => {
        BUS.dispatchEvent(new Event('tts:end'));
        stopMeter();

        // Emit analytics event
        window.analytics?.track('tts_stop', {
          page: aid(),
          ts: Date.now(),
          engine: 'browser',
          duration: Date.now() - startTime
        });

        resolve();
      };

      utter.onerror = (e) => {
        BUS.dispatchEvent(new Event('tts:end'));
        stopMeter();

        // Emit analytics event
        window.analytics?.track('tts_error', {
          page: aid(),
          ts: Date.now(),
          engine: 'browser',
          error: e.error || 'unknown'
        });

        reject(e.error || e);
      };

      // Note: Web Speech API doesn't provide audio stream access
      // so we cannot meter the audio for viseme hints
      // The avatar will use fallback animation instead

      // Speak
      speechSynthesis.speak(utter);
    });
  }

  /**
   * Speak text via server-side TTS
   * @param {string} text - Text to speak
   * @param {string} voiceEngine - Voice engine identifier
   * @returns {Promise<void>}
   */
  async function speakViaServer(text, voiceEngine = 'aura-2-en') {
    // Prevent multiple simultaneous TTS sessions (atomic check-and-set)
    if (isSpeaking) {
      throw new Error('TTS already in progress');
    }
    isSpeaking = true;

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      // Timeout mechanism to prevent hung requests
      const timeoutId = setTimeout(() => {
        isSpeaking = false;
        reject(new Error('Server TTS request timed out'));
      }, SERVER_TTS_TIMEOUT);

      // Main TTS logic
      (async () => {
        try {
          // Emit analytics event for TTS start with engine
          window.analytics?.track('tts_start', {
            page: aid(),
            ts: startTime,
            textChars: text.length,
            engine: voiceEngine,
            source: 'server'
          });

          // Call server-side TTS endpoint with voiceEngine parameter
          const res = await fetch(`/functions/tts/speak?voiceEngine=${encodeURIComponent(voiceEngine)}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text })
          });

          if (!res.ok) {
            // Check if fallback is suggested
            const fallbackHeader = res.headers.get('X-TTS-Fallback');
            if (fallbackHeader === 'required' || res.status === 503) {
              throw new Error('TTS_FALLBACK_REQUIRED');
            }
            throw new Error(`TTS server ${res.status}`);
          }

          // Clear timeout on successful response
          clearTimeout(timeoutId);

          // Get audio blob
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);

          const latency = Date.now() - startTime;
          console.log('TTS audio received:', { latency, engine: voiceEngine });

          // Wait for audio to finish
          const handlePlay = () => {
            BUS.dispatchEvent(new CustomEvent('tts:start', { detail: { text, engine: voiceEngine } }));
            startMeterFromAudio(audio);
          };

          const handleEnd = () => {
            cleanup();

            // Emit analytics event for TTS end
            window.analytics?.track('tts_stop', {
              page: aid(),
              ts: Date.now(),
              engine: voiceEngine,
              duration: Date.now() - startTime
            });

            resolve();
          };

          const handleError = (error) => {
            cleanup();

            // Emit analytics event for TTS error
            window.analytics?.track('tts_error', {
              page: aid(),
              ts: Date.now(),
              engine: voiceEngine,
              error: error.message || 'playback_error'
            });

            reject(error);
          };

          const cleanup = () => {
            BUS.dispatchEvent(new Event('tts:end'));
            stopMeter();
            URL.revokeObjectURL(url);
            isSpeaking = false;
            clearTimeout(timeoutId);

            // Remove event listeners to prevent memory leaks
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('ended', handleEnd);
            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('play', handlePlay);
          audio.addEventListener('ended', handleEnd);
          audio.addEventListener('error', handleError);

          // Play audio
          await audio.play();
        } catch (error) {
          clearTimeout(timeoutId);
          isSpeaking = false;
          console.error('Server TTS error:', error);

          // Emit analytics event for TTS error
          window.analytics?.track('tts_error', {
            page: aid(),
            ts: Date.now(),
            engine: voiceEngine,
            error: error.message || 'unknown_error'
          });

          reject(error);
        }
      })();
    });
  }

  /**
   * Public API: Speak text
   * Tries server-side TTS first, falls back to Web Speech API
   * @param {string} text - Text to speak
   * @param {Object} options - Options { voiceName?: string, useServer?: boolean, voiceEngine?: string }
   * @returns {Promise<void>}
   */
  async function speak(text, options = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    // Get settings
    const settings = getSettings();

    // Merge options with settings
    const {
      voiceName,
      useServer = settings.useServer,
      voiceEngine = settings.voiceEngine
    } = options;

    // Emit analytics event for TTS engine selection
    window.analytics?.track('tts_engine', {
      page: aid(),
      ts: Date.now(),
      engine: useServer && voiceEngine !== 'browser' ? voiceEngine : 'browser',
      useServer: useServer
    });

    try {
      if (useServer && voiceEngine !== 'browser') {
        // Try server-side TTS with selected engine
        await speakViaServer(text, voiceEngine);
      } else {
        // Use Web Speech API
        await speakWebSpeech(text, voiceName);
      }
    } catch (error) {
      console.error('TTS error:', error);

      // Fallback to Web Speech if server fails
      if (useServer && window.speechSynthesis && error.message === 'TTS_FALLBACK_REQUIRED') {
        console.warn('Server TTS unavailable, falling back to Web Speech API');

        // Show user notification
        BUS.dispatchEvent(new CustomEvent('tts:fallback', {
          detail: {
            message: 'Server TTS unavailable, using browser speech',
            engine: 'browser'
          }
        }));

        await speakWebSpeech(text, voiceName);
      } else {
        throw error;
      }
    }
  }

  /**
   * Set voice engine preference
   * @param {string} engine - Engine identifier (e.g., 'aura-2-en', 'melotts', 'browser')
   */
  function setVoiceEngine(engine) {
    const settings = getSettings();
    settings.voiceEngine = engine;
    settings.useServer = engine !== 'browser';
    saveSettings(settings);

    // Emit analytics event
    window.analytics?.track('tts_engine_change', {
      page: aid(),
      ts: Date.now(),
      engine: engine
    });
  }

  /**
   * Get current voice engine preference
   * @returns {string} Current engine identifier
   */
  function getVoiceEngine() {
    const settings = getSettings();
    return settings.voiceEngine;
  }

  /**
   * Get available voice engines
   * @returns {Object} Available engines mapping
   */
  function getAvailableEngines() {
    return { ...AVAILABLE_ENGINES };
  }

  /**
   * Stop current speech
   */
  function stop() {
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }
    stopMeter();
    BUS.dispatchEvent(new Event('tts:end'));
  }

  /**
   * Check if TTS is available
   * @returns {boolean}
   */
  function isAvailable() {
    return !!(window.speechSynthesis || window.SpeechSynthesisUtterance);
  }

  /**
   * Get available voices
   * @returns {Array<SpeechSynthesisVoice>}
   */
  function getVoices() {
    if (!window.speechSynthesis) {
      return [];
    }
    return speechSynthesis.getVoices();
  }

  // Export public API
  window.TTS = {
    speak,
    stop,
    isAvailable,
    getVoices,
    setVoiceEngine,
    getVoiceEngine,
    getAvailableEngines,
    getSettings,
    // Event names for convenience
    events: {
      START: 'tts:start',
      END: 'tts:end',
      VISEME: 'tts:viseme',
      FALLBACK: 'tts:fallback'
    }
  };

  // Set up analytics tracking for TTS events
  BUS.addEventListener('tts:start', (e) => {
    // Get text from detail if available, otherwise we'll track without text length
    const textChars = e.detail?.text?.length || 0;
    const engine = e.detail?.engine || 'unknown';
    window.analytics?.track('tts_start', {
      page: aid(),
      ts: Date.now(),
      textChars: textChars,
      engine: engine
    });
  });

  BUS.addEventListener('tts:end', () => {
    window.analytics?.track('tts_stop', {
      page: aid(),
      ts: Date.now()
    });
  });

  BUS.addEventListener('tts:fallback', (e) => {
    window.analytics?.track('tts_fallback', {
      page: aid(),
      ts: Date.now(),
      message: e.detail?.message,
      engine: e.detail?.engine
    });
  });

  console.log('✅ TTS module loaded');

})(window);
