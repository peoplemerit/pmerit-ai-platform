/**
 * PMERIT Audio Player
 * Phase 3.3-A: Audio playback with progress tracking
 * 
 * This module handles audio playback and emits progress events
 * for synchronization with lip-sync and animations.
 */

(function (window) {
  'use strict';

  class AudioPlayer {
    constructor(config = {}) {
      this.config = {
        preload: config.preload !== undefined ? config.preload : true,
        autoplay: config.autoplay !== undefined ? config.autoplay : false,
        ...config
      };

      this.audio = null;
      this.state = {
        playing: false,
        currentTime: 0,
        duration: 0
      };

      this.callbacks = {
        onProgress: config.onProgress || null,
        onEnded: config.onEnded || null,
        onError: config.onError || null
      };

      this.progressInterval = null;
    }

    /**
     * Load audio from URL
     * @param {string} url - Audio file URL
     * @returns {Promise<void>}
     */
    load(url) {
      return new Promise((resolve, reject) => {
        this.dispose();

        this.audio = new Audio(url);
        this.audio.preload = this.config.preload ? 'auto' : 'metadata';

        // Set up event listeners
        this.audio.addEventListener('loadedmetadata', () => {
          this.state.duration = this.audio.duration;
          resolve();
        });

        this.audio.addEventListener('error', (error) => {
          console.error('Audio load error:', error);
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          reject(error);
        });

        this.audio.addEventListener('ended', () => {
          this.state.playing = false;
          this._stopProgressTracking();
          
          if (this.callbacks.onEnded) {
            this.callbacks.onEnded();
          }
        });

        this.audio.addEventListener('pause', () => {
          this.state.playing = false;
          this._stopProgressTracking();
        });

        this.audio.addEventListener('play', () => {
          this.state.playing = true;
          this._startProgressTracking();
        });
      });
    }

    /**
     * Play audio
     * @returns {Promise<void>}
     */
    async play() {
      if (!this.audio) {
        console.warn('No audio loaded');
        return;
      }

      try {
        await this.audio.play();
      } catch (error) {
        console.error('Audio play error:', error);
        if (this.callbacks.onError) {
          this.callbacks.onError(error);
        }
      }
    }

    /**
     * Pause audio
     */
    pause() {
      if (this.audio) {
        this.audio.pause();
      }
    }

    /**
     * Stop audio and reset to beginning
     */
    stop() {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.state.currentTime = 0;
    }

    /**
     * Seek to specific time
     * @param {number} timeSeconds - Time in seconds
     */
    seek(timeSeconds) {
      if (this.audio) {
        this.audio.currentTime = timeSeconds;
        this.state.currentTime = timeSeconds;
      }
    }

    /**
     * Get current playback time in milliseconds
     * @returns {number}
     */
    getCurrentTimeMs() {
      return this.audio ? this.audio.currentTime * 1000 : 0;
    }

    /**
     * Get duration in milliseconds
     * @returns {number}
     */
    getDurationMs() {
      return this.state.duration * 1000;
    }

    /**
     * Set volume (0-1)
     * @param {number} volume
     */
    setVolume(volume) {
      if (this.audio) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
      }
    }

    /**
     * Check if audio is playing
     * @returns {boolean}
     */
    isPlaying() {
      return this.state.playing;
    }

    /**
     * Start progress tracking
     * @private
     */
    _startProgressTracking() {
      this._stopProgressTracking();

      // Update progress at ~60fps for smooth lip-sync
      this.progressInterval = setInterval(() => {
        if (this.audio) {
          this.state.currentTime = this.audio.currentTime;
          
          if (this.callbacks.onProgress) {
            this.callbacks.onProgress(this.getCurrentTimeMs());
          }
        }
      }, 1000 / 60);
    }

    /**
     * Stop progress tracking
     * @private
     */
    _stopProgressTracking() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    }

    /**
     * Clean up resources
     */
    dispose() {
      this.stop();
      this._stopProgressTracking();

      if (this.audio) {
        this.audio.src = '';
        this.audio.load();
        this.audio = null;
      }

      this.state = {
        playing: false,
        currentTime: 0,
        duration: 0
      };
    }
  }

  // Export to global scope
  window.AudioPlayer = AudioPlayer;

})(window);
