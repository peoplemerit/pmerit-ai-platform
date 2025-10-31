/**
 * PMERIT Lip Sync Visemes
 * Phase 3.3-A: Maps viseme data to avatar blend shapes
 * 
 * This module synchronizes viseme/phoneme data with avatar
 * mouth movements for realistic lip-sync.
 */

(function (window) {
  'use strict';

  /**
   * Standard viseme to phoneme mapping
   * Based on Microsoft SAPI visemes
   */
  const VISEME_MAP = {
    // Silence
    'sil': { name: 'Silence', blendshapes: {} },
    
    // Vowels
    'PP': { name: 'PP', blendshapes: { mouthClose: 1.0 } },
    'FF': { name: 'FF', blendshapes: { mouthFunnel: 0.8 } },
    'TH': { name: 'TH', blendshapes: { mouthSmile: 0.6, jawOpen: 0.2 } },
    'DD': { name: 'DD', blendshapes: { jawOpen: 0.4 } },
    'kk': { name: 'kk', blendshapes: { jawOpen: 0.3 } },
    'CH': { name: 'CH', blendshapes: { mouthFunnel: 0.4, jawOpen: 0.3 } },
    'SS': { name: 'SS', blendshapes: { mouthSmile: 0.5 } },
    'nn': { name: 'nn', blendshapes: { jawOpen: 0.2 } },
    'RR': { name: 'RR', blendshapes: { mouthFunnel: 0.6, jawOpen: 0.3 } },
    'aa': { name: 'aa', blendshapes: { jawOpen: 0.8 } },
    'E': { name: 'E', blendshapes: { jawOpen: 0.5, mouthSmile: 0.3 } },
    'I': { name: 'I', blendshapes: { mouthSmile: 0.6, jawOpen: 0.3 } },
    'O': { name: 'O', blendshapes: { mouthFunnel: 0.8, jawOpen: 0.5 } },
    'U': { name: 'U', blendshapes: { mouthFunnel: 1.0, jawOpen: 0.4 } }
  };

  class LipSyncVisemes {
    /**
     * @param {WebGLProvider} provider - Avatar provider instance
     * @param {Array} visemes - Array of {v: viseme, t: timestamp_ms} objects
     */
    constructor(provider, visemes = []) {
      this.provider = provider;
      this.visemes = visemes.sort((a, b) => a.t - b.t);
      this.currentIndex = 0;
      this.lastViseme = null;
      this.intensityMode = false;
      this.currentIntensity = 0;
      this._boundVisemeHandler = null;
    }

    /**
     * Update lip-sync based on current playback time
     * @param {number} currentTimeMs - Current audio playback time in milliseconds
     */
    update(currentTimeMs) {
      // If in intensity mode, apply intensity-based animation
      if (this.intensityMode) {
        this._applyIntensityAnimation(this.currentIntensity);
        return;
      }

      if (!this.visemes || this.visemes.length === 0) {
        this._applyFallbackAnimation(currentTimeMs);
        return;
      }

      // Find the current viseme based on timestamp
      while (
        this.currentIndex < this.visemes.length &&
        this.visemes[this.currentIndex].t <= currentTimeMs
      ) {
        this.lastViseme = this.visemes[this.currentIndex];
        this.currentIndex++;
      }

      // Apply the viseme to the avatar
      if (this.lastViseme) {
        this._applyViseme(this.lastViseme.v);
      }
    }

    /**
     * Apply viseme to avatar blend shapes
     * @private
     */
    _applyViseme(viseme) {
      const visemeData = VISEME_MAP[viseme] || VISEME_MAP['aa'];
      
      if (this.provider && this.provider.setVisemeWeights) {
        this.provider.setVisemeWeights(visemeData.blendshapes);
      }
    }

    /**
     * Apply simple fallback animation when no viseme data
     * @private
     */
    _applyFallbackAnimation(currentTimeMs) {
      // Simple open-close mouth animation
      const frequency = 8; // Hz
      const openAmount = (Math.sin(currentTimeMs / 1000 * frequency * Math.PI * 2) + 1) / 2;
      
      if (this.provider && this.provider.setVisemeWeights) {
        this.provider.setVisemeWeights({
          jawOpen: openAmount * 0.5,
          mouthFunnel: openAmount * 0.3
        });
      }
    }

    /**
     * Apply intensity-based animation (from TTS viseme events)
     * @param {number} intensity - Intensity value [0..1]
     * @private
     */
    _applyIntensityAnimation(intensity) {
      if (this.provider && this.provider.setVisemeWeights) {
        // Map intensity to jaw open and mouth funnel
        this.provider.setVisemeWeights({
          jawOpen: intensity * 0.6,
          mouthFunnel: intensity * 0.4
        });
      }
    }

    /**
     * Start listening to TTS viseme events
     * Used when TTS is driving lip-sync via intensity
     */
    startIntensityMode() {
      this.intensityMode = true;
      this.currentIntensity = 0;

      // Listen for tts:viseme events
      this._boundVisemeHandler = (event) => {
        this.currentIntensity = event.detail.intensity || 0;
      };
      
      document.addEventListener('tts:viseme', this._boundVisemeHandler);
    }

    /**
     * Stop listening to TTS viseme events
     */
    stopIntensityMode() {
      this.intensityMode = false;
      this.currentIntensity = 0;

      if (this._boundVisemeHandler) {
        document.removeEventListener('tts:viseme', this._boundVisemeHandler);
        this._boundVisemeHandler = null;
      }
    }

    /**
     * Reset lip-sync state
     */
    reset() {
      this.currentIndex = 0;
      this.lastViseme = null;
      this.stopIntensityMode();
      
      if (this.provider && this.provider.setVisemeWeights) {
        this.provider.setVisemeWeights({});
      }
    }
  }

  // Export to global scope
  window.LipSyncVisemes = LipSyncVisemes;

})(window);
