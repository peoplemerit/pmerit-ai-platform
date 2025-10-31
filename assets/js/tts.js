/**
 * PMERIT TTS Module
 * Phase 6: Text-to-Speech with Viseme Events
 * 
 * Provides browser-based TTS with Web Speech API fallback,
 * WebAudio analysis for viseme hints, and optional server-side TTS proxy.
 */

(function (window) {
  'use strict';

  // Event bus via document
  const BUS = document;

  // Audio context and analyzer state
  let audioCtx = null;
  let analyser = null;
  let source = null;
  let meterInterval = null;

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
        const intensity = Math.min(1, (sum / (data.length * 255)) * 2);
        
        // Emit viseme event with intensity
        BUS.dispatchEvent(new CustomEvent('tts:viseme', { 
          detail: { intensity } 
        }));
      }, 33); // ~30 FPS
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
      
      // Connect to analyser and destination (speakers)
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
        const intensity = Math.min(1, (sum / (data.length * 255)) * 2);
        
        // Emit viseme event with intensity
        BUS.dispatchEvent(new CustomEvent('tts:viseme', { 
          detail: { intensity } 
        }));
      }, 33); // ~30 FPS
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

      // Event handlers
      utter.onstart = () => {
        BUS.dispatchEvent(new Event('tts:start'));
      };

      utter.onend = () => {
        BUS.dispatchEvent(new Event('tts:end'));
        stopMeter();
        resolve();
      };

      utter.onerror = (e) => {
        BUS.dispatchEvent(new Event('tts:end'));
        stopMeter();
        reject(e.error || e);
      };

      // Best-effort: Try to get output stream for metering (Chrome experimental)
      if (speechSynthesis.speakWithStream) {
        speechSynthesis.speakWithStream(utter)
          .then(stream => startMeterFromMediaStream(stream))
          .catch(() => {
            // Fallback: no metering available
            console.warn('Audio metering not available for Web Speech');
          });
      }

      // Speak
      speechSynthesis.speak(utter);
    });
  }

  /**
   * Speak text via server-side TTS
   * @param {string} text - Text to speak
   * @returns {Promise<void>}
   */
  async function speakViaServer(text) {
    try {
      // Call server-side TTS endpoint
      const res = await fetch('/functions/tts/speak', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error(`TTS server ${res.status}`);
      }

      // Get audio blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      // Wait for audio to finish
      return new Promise((resolve, reject) => {
        // Set up event handlers
        audio.addEventListener('play', () => {
          BUS.dispatchEvent(new Event('tts:start'));
          startMeterFromAudio(audio);
        });

        audio.addEventListener('ended', () => {
          BUS.dispatchEvent(new Event('tts:end'));
          stopMeter();
          URL.revokeObjectURL(url);
          resolve();
        });

        audio.addEventListener('error', (error) => {
          BUS.dispatchEvent(new Event('tts:end'));
          stopMeter();
          URL.revokeObjectURL(url);
          reject(error);
        });

        // Play audio
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Server TTS error:', error);
      throw error;
    }
  }

  /**
   * Public API: Speak text
   * Tries server-side TTS first, falls back to Web Speech API
   * @param {string} text - Text to speak
   * @param {Object} options - Options { voiceName?: string, useServer?: boolean }
   * @returns {Promise<void>}
   */
  async function speak(text, options = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    const { voiceName, useServer = false } = options;

    try {
      if (useServer) {
        // Try server-side TTS
        await speakViaServer(text);
      } else {
        // Use Web Speech API
        await speakWebSpeech(text, voiceName);
      }
    } catch (error) {
      console.error('TTS error:', error);
      
      // Fallback to Web Speech if server fails
      if (useServer && window.speechSynthesis) {
        console.warn('Server TTS failed, falling back to Web Speech');
        await speakWebSpeech(text, voiceName);
      } else {
        throw error;
      }
    }
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
    // Event names for convenience
    events: {
      START: 'tts:start',
      END: 'tts:end',
      VISEME: 'tts:viseme'
    }
  };

  console.log('✅ TTS module loaded');

})(window);
