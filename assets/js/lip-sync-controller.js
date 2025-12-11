/**
 * Lip Sync Controller - Audio Analysis for Avatar Speech Animation
 *
 * Analyzes TTS audio in real-time using Web Audio API and emits
 * viseme events that gpu-streaming.js uses to animate the avatar's mouth.
 *
 * Features:
 * - Real-time audio amplitude analysis
 * - Frequency band detection for vowel estimation
 * - Smooth interpolation for natural movement
 * - Custom event emission for lip sync
 *
 * @version 1.0.0
 * @module lip-sync-controller
 */

(function(window) {
  'use strict';

  /**
   * LipSyncController class
   */
  class LipSyncController {
    constructor() {
      // Audio context and nodes
      this.audioContext = null;
      this.analyser = null;
      this.source = null;

      // Analysis data
      this.dataArray = null;
      this.frequencyData = null;
      this.bufferLength = 0;

      // State
      this.isActive = false;
      this.animationFrameId = null;
      this.lastIntensity = 0;

      // Smoothing parameters
      this.smoothingFactor = 0.7;  // Higher = smoother but more lag
      this.intensityThreshold = 0.02;  // Minimum intensity to register
      this.intensityMultiplier = 2.5;  // Boost low audio levels

      // Frequency bands for vowel detection (Hz)
      this.frequencyBands = {
        low: { min: 100, max: 500 },    // F1 formant (vowel height)
        mid: { min: 500, max: 2000 },   // F2 formant (front/back)
        high: { min: 2000, max: 4000 }  // Consonants, sibilants
      };

      console.log('👄 LipSyncController initialized');
    }

    /**
     * Initialize audio context (must be called after user interaction)
     * @returns {Promise<boolean>}
     */
    async init() {
      try {
        // Create audio context if not exists
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        // Create analyser node
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;  // Good balance of speed vs accuracy
        this.analyser.smoothingTimeConstant = 0.5;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.frequencyData = new Uint8Array(this.bufferLength);

        console.log('✅ LipSyncController audio context ready');
        return true;

      } catch (error) {
        console.error('❌ LipSyncController init failed:', error);
        return false;
      }
    }

    /**
     * Connect an audio element to the analyser
     * @param {HTMLAudioElement} audioElement - Audio element playing TTS
     * @returns {boolean}
     */
    connectAudio(audioElement) {
      if (!this.audioContext || !this.analyser) {
        console.warn('LipSyncController not initialized');
        return false;
      }

      try {
        // Disconnect previous source if exists
        if (this.source) {
          this.source.disconnect();
        }

        // Create media element source
        this.source = this.audioContext.createMediaElementSource(audioElement);

        // Connect: source -> analyser -> destination (speakers)
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        console.log('🔗 Audio element connected to LipSyncController');
        return true;

      } catch (error) {
        console.error('Failed to connect audio:', error);
        return false;
      }
    }

    /**
     * Connect an AudioBufferSourceNode (for programmatic audio)
     * @param {AudioBufferSourceNode} sourceNode - Audio source node
     * @returns {boolean}
     */
    connectSourceNode(sourceNode) {
      if (!this.audioContext || !this.analyser) {
        console.warn('LipSyncController not initialized');
        return false;
      }

      try {
        // Connect: source -> analyser -> destination
        sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.source = sourceNode;
        console.log('🔗 AudioNode connected to LipSyncController');
        return true;

      } catch (error) {
        console.error('Failed to connect source node:', error);
        return false;
      }
    }

    /**
     * Start lip sync analysis
     */
    start() {
      if (this.isActive) return;

      this.isActive = true;
      this.lastIntensity = 0;

      // Emit TTS start event
      document.dispatchEvent(new CustomEvent('tts:start'));

      // Start analysis loop
      this.analyze();

      console.log('▶️ Lip sync started');
    }

    /**
     * Stop lip sync analysis
     */
    stop() {
      this.isActive = false;

      // Cancel animation frame
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Emit final zero intensity
      this.emitViseme(0);

      // Emit TTS end event
      document.dispatchEvent(new CustomEvent('tts:end'));

      console.log('⏹️ Lip sync stopped');
    }

    /**
     * Main analysis loop
     */
    analyze() {
      if (!this.isActive || !this.analyser) return;

      // Get time domain data (waveform)
      this.analyser.getByteTimeDomainData(this.dataArray);

      // Get frequency data
      this.analyser.getByteFrequencyData(this.frequencyData);

      // Calculate RMS amplitude
      let sum = 0;
      for (let i = 0; i < this.bufferLength; i++) {
        const value = (this.dataArray[i] - 128) / 128;  // Normalize to -1..1
        sum += value * value;
      }
      const rms = Math.sqrt(sum / this.bufferLength);

      // Apply multiplier and clamp
      let intensity = rms * this.intensityMultiplier;
      intensity = Math.min(1, Math.max(0, intensity));

      // Apply smoothing
      intensity = this.lastIntensity * this.smoothingFactor +
                  intensity * (1 - this.smoothingFactor);

      // Apply threshold
      if (intensity < this.intensityThreshold) {
        intensity = 0;
      }

      this.lastIntensity = intensity;

      // Detect approximate viseme from frequency data
      const viseme = this.detectViseme();

      // Emit viseme event
      this.emitViseme(intensity, viseme);

      // Continue loop
      this.animationFrameId = requestAnimationFrame(() => this.analyze());
    }

    /**
     * Detect approximate viseme from frequency analysis
     * @returns {string} Viseme name
     */
    detectViseme() {
      if (!this.frequencyData) return 'aa';

      // Calculate energy in each frequency band
      const sampleRate = this.audioContext?.sampleRate || 44100;
      const binSize = sampleRate / (this.analyser?.fftSize || 256);

      let lowEnergy = 0;
      let midEnergy = 0;
      let highEnergy = 0;
      let lowCount = 0;
      let midCount = 0;
      let highCount = 0;

      for (let i = 0; i < this.frequencyData.length; i++) {
        const freq = i * binSize;
        const energy = this.frequencyData[i] / 255;

        if (freq >= this.frequencyBands.low.min && freq < this.frequencyBands.low.max) {
          lowEnergy += energy;
          lowCount++;
        } else if (freq >= this.frequencyBands.mid.min && freq < this.frequencyBands.mid.max) {
          midEnergy += energy;
          midCount++;
        } else if (freq >= this.frequencyBands.high.min && freq < this.frequencyBands.high.max) {
          highEnergy += energy;
          highCount++;
        }
      }

      // Average energy per band
      lowEnergy = lowCount > 0 ? lowEnergy / lowCount : 0;
      midEnergy = midCount > 0 ? midEnergy / midCount : 0;
      highEnergy = highCount > 0 ? highEnergy / highCount : 0;

      // Simple heuristic for viseme detection
      // This is approximate - true viseme detection requires speech recognition
      if (highEnergy > 0.5) {
        // Sibilants: s, sh, ch
        return 's';
      } else if (midEnergy > 0.4 && lowEnergy < 0.3) {
        // Front vowels: ee, ih
        return 'ee';
      } else if (lowEnergy > 0.5 && midEnergy < 0.3) {
        // Back vowels: oh, oo
        return 'oh';
      } else if (lowEnergy > 0.3 && midEnergy > 0.3) {
        // Open vowels: aa, ah
        return 'aa';
      } else if (lowEnergy < 0.2 && midEnergy < 0.2) {
        // Closed mouth: m, p, b
        return 'm';
      }

      // Default open vowel
      return 'aa';
    }

    /**
     * Emit viseme event
     * @param {number} intensity - Mouth opening intensity [0..1]
     * @param {string} viseme - Viseme name
     */
    emitViseme(intensity, viseme = null) {
      const event = new CustomEvent('tts:viseme', {
        detail: {
          intensity,
          viseme,
          timestamp: performance.now()
        }
      });
      document.dispatchEvent(event);
    }

    /**
     * Play audio blob and sync lips
     * @param {Blob} audioBlob - Audio blob from TTS
     * @returns {Promise<void>}
     */
    async playWithLipSync(audioBlob) {
      // Initialize if needed
      if (!this.audioContext) {
        await this.init();
      }

      try {
        // Decode audio data
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Create buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect to analyser
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // Start lip sync
        this.start();

        // Handle playback end
        source.onended = () => {
          this.stop();
        };

        // Play audio
        source.start(0);

        console.log('🔊 Playing TTS with lip sync');

      } catch (error) {
        console.error('Failed to play audio with lip sync:', error);
        this.stop();
      }
    }

    /**
     * Dispose resources
     */
    dispose() {
      this.stop();

      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }

      if (this.analyser) {
        this.analyser.disconnect();
        this.analyser = null;
      }

      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
        this.audioContext = null;
      }

      console.log('🧹 LipSyncController disposed');
    }
  }

  // Export globally
  window.LipSyncController = LipSyncController;

  // Create singleton instance
  window.lipSync = new LipSyncController();

})(window);
