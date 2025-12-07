/**
 * GPU Streaming - Just-In-Time Cloud GPU for Premium Avatars
 * Phase 4: Digital Desk Classroom Redesign
 *
 * Manages tiered virtual human rendering:
 * - Free: CSS/SVG animations (client-side)
 * - Standard: WebGL 3D avatar (client-side)
 * - Premium: Unreal MetaHuman via DigitalOcean GPU streaming
 *
 * Features:
 * - Bandwidth detection for tier auto-selection
 * - Just-In-Time GPU Droplet provisioning (~$2.68/hr H100)
 * - Unreal Pixel Streaming client
 * - Auto-fallback when GPU unavailable
 * - Idle timeout for cost management
 *
 * @module gpu-streaming
 */

(function (window) {
  'use strict';

  /**
   * Avatar tier definitions
   */
  const TIERS = {
    FREE: {
      name: 'free',
      minBandwidth: 0,
      avatar: 'cartoon',
      description: 'CSS/SVG Animation',
      cost: 0
    },
    STANDARD: {
      name: 'standard',
      minBandwidth: 5, // Mbps
      avatar: 'webgl',
      description: 'WebGL 3D Avatar',
      cost: 0
    },
    PREMIUM: {
      name: 'premium',
      minBandwidth: 25, // Mbps for smooth 1080p streaming
      avatar: 'unreal',
      description: 'Unreal MetaHuman',
      cost: 2.68 // $/hr for H100
    },
    FALLBACK: {
      name: 'fallback',
      minBandwidth: 0,
      avatar: 'static',
      description: 'Static Image',
      cost: 0
    }
  };

  /**
   * DigitalOcean regions for GPU droplets
   */
  const GPU_REGIONS = {
    NYC1: { id: 'nyc1', name: 'New York 1', latency: null },
    SFO3: { id: 'sfo3', name: 'San Francisco 3', latency: null },
    AMS3: { id: 'ams3', name: 'Amsterdam 3', latency: null },
    SGP1: { id: 'sgp1', name: 'Singapore 1', latency: null }
  };

  /**
   * GPUStreaming class
   */
  class GPUStreaming {
    /**
     * @constructor
     * @param {Object} config - Configuration options
     */
    constructor(config = {}) {
      this.config = {
        apiBase: config.apiBase || window.CONFIG?.API_BASE_URL || 'https://pmerit-api-worker.peoplemerit.workers.dev',
        idleTimeout: config.idleTimeout || 300000, // 5 minutes
        maxSessionDuration: config.maxSessionDuration || 3600000, // 1 hour
        regions: config.regions || ['nyc1', 'sfo3', 'ams3'],
        dropletSize: config.dropletSize || 'gpu-h100x1-80gb', // H100 GPU
        streamQuality: config.streamQuality || 'auto'
      };

      // State
      this.state = {
        currentTier: 'free',
        isConnected: false,
        dropletId: null,
        dropletIp: null,
        streamUrl: null,
        sessionId: null,
        bandwidth: null,
        idleTimer: null,
        sessionTimer: null,
        pixelStreaming: null,
        sessionStartTime: null,
        sessionCostCents: 0,
        lastActivity: Date.now(),
        isProvisioning: false,
        provisioningProgress: 0
      };

      // Callbacks
      this.callbacks = {
        onTierChange: null,
        onConnectionChange: null,
        onError: null,
        onCostUpdate: null
      };

      // DOM elements
      this.avatarFrame = null;
      this.streamContainer = null;
    }

    /**
     * Initialize GPU streaming
     * @param {HTMLElement} avatarFrameElement - Avatar frame container
     * @returns {Promise<void>}
     */
    async init(avatarFrameElement) {
      console.log('🎮 Initializing GPU Streaming...');

      this.avatarFrame = avatarFrameElement || document.getElementById('avatar-frame');

      if (!this.avatarFrame) {
        console.warn('Avatar frame element not found');
      }

      // Detect bandwidth and auto-select tier
      await this.detectBandwidth();

      // Select best region based on latency
      await this.selectBestRegion();

      console.log('✅ GPU Streaming initialized');
      console.log(`📊 Detected bandwidth: ${this.state.bandwidth?.toFixed(2) || 'Unknown'} Mbps`);
      console.log(`🎯 Recommended tier: ${this.state.currentTier}`);
    }

    /**
     * Detect network bandwidth
     * @returns {Promise<number>} Bandwidth in Mbps
     */
    async detectBandwidth() {
      console.log('📡 Detecting bandwidth...');

      try {
        // Method 1: Use Network Information API if available
        if ('connection' in navigator) {
          const connection = navigator.connection;
          if (connection.downlink) {
            this.state.bandwidth = connection.downlink; // Already in Mbps
            this.selectTierForBandwidth(this.state.bandwidth);
            return this.state.bandwidth;
          }
        }

        // Method 2: Download test file and measure
        const testUrl = `${this.config.apiBase}/api/v1/bandwidth-test?t=${Date.now()}`;
        const startTime = performance.now();

        const response = await fetch(testUrl, {
          method: 'GET',
          cache: 'no-store'
        });

        if (!response.ok) {
          // Fallback to default moderate bandwidth
          this.state.bandwidth = 10;
          this.selectTierForBandwidth(this.state.bandwidth);
          return this.state.bandwidth;
        }

        const blob = await response.blob();
        const endTime = performance.now();

        const durationSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = blob.size * 8;
        const bps = bitsLoaded / durationSeconds;
        const mbps = bps / 1000000;

        this.state.bandwidth = mbps;
        this.selectTierForBandwidth(mbps);

        return mbps;

      } catch (error) {
        console.warn('Bandwidth detection failed:', error);
        // Default to standard tier bandwidth
        this.state.bandwidth = 10;
        this.selectTierForBandwidth(10);
        return 10;
      }
    }

    /**
     * Select tier based on bandwidth
     * @param {number} mbps - Bandwidth in Mbps
     * @returns {string} Selected tier name
     */
    selectTierForBandwidth(mbps) {
      let selectedTier = 'free';

      if (mbps >= TIERS.PREMIUM.minBandwidth) {
        selectedTier = 'premium';
      } else if (mbps >= TIERS.STANDARD.minBandwidth) {
        selectedTier = 'standard';
      } else {
        selectedTier = 'free';
      }

      const previousTier = this.state.currentTier;
      this.state.currentTier = selectedTier;

      if (previousTier !== selectedTier) {
        this.updateAvatarFrameTier(selectedTier);
        this.emitTierChange(selectedTier, previousTier);
      }

      return selectedTier;
    }

    /**
     * Select best region based on latency
     * Uses backend API to avoid CORS issues with direct pings
     * @returns {Promise<string>} Best region ID
     */
    async selectBestRegion() {
      console.log('🌍 Selecting best region...');

      // Use geolocation hint from timezone if available
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let suggestedRegion = 'nyc1'; // default

        if (tz) {
          // Map timezone to nearest region
          if (tz.includes('America/Los_Angeles') || tz.includes('America/Vancouver') || tz.includes('Pacific')) {
            suggestedRegion = 'sfo3';
          } else if (tz.includes('Europe') || tz.includes('Africa')) {
            suggestedRegion = 'ams3';
          } else if (tz.includes('Asia') || tz.includes('Australia') || tz.includes('Pacific/Auckland')) {
            suggestedRegion = 'sgp1';
          } else {
            suggestedRegion = 'nyc1'; // Americas East default
          }
        }

        // Store estimated latency based on region proximity (ms)
        const estimatedLatencies = {
          'nyc1': tz.includes('America') && !tz.includes('Los_Angeles') ? 30 : 100,
          'sfo3': tz.includes('Pacific') || tz.includes('Los_Angeles') ? 30 : 100,
          'ams3': tz.includes('Europe') ? 30 : 120,
          'sgp1': tz.includes('Asia') || tz.includes('Australia') ? 30 : 150
        };

        this.config.regions.forEach(region => {
          const key = region.toUpperCase();
          if (GPU_REGIONS[key]) {
            GPU_REGIONS[key].latency = estimatedLatencies[region] || 100;
          }
        });

        console.log(`📍 Selected region: ${suggestedRegion} (based on timezone: ${tz})`);
        return suggestedRegion;

      } catch (error) {
        console.warn('Region selection fallback:', error);
        return 'nyc1';
      }
    }

    /**
     * Get current tier
     * @returns {string}
     */
    getCurrentTier() {
      return this.state.currentTier;
    }

    /**
     * Get tier info
     * @param {string} tierName - Tier name
     * @returns {Object}
     */
    getTierInfo(tierName) {
      return TIERS[tierName?.toUpperCase()] || TIERS.FREE;
    }

    /**
     * Upgrade to a higher tier
     * @param {string} targetTier - Target tier name
     * @returns {Promise<boolean>}
     */
    async upgradeTier(targetTier) {
      return await this.switchTier(targetTier);
    }

    /**
     * Downgrade to a lower tier
     * @param {string} targetTier - Target tier name
     * @returns {Promise<boolean>}
     */
    async downgradeTier(targetTier) {
      return await this.switchTier(targetTier);
    }

    /**
     * Switch to a different tier
     * @param {string} newTier - Target tier name
     * @returns {Promise<boolean>}
     */
    async switchTier(newTier) {
      const tierInfo = this.getTierInfo(newTier);
      if (!tierInfo) {
        console.error(`Invalid tier: ${newTier}`);
        return false;
      }

      console.log(`🔄 Switching from ${this.state.currentTier} to ${newTier}...`);

      // Check bandwidth requirement
      if (this.state.bandwidth < tierInfo.minBandwidth) {
        console.warn(`Bandwidth too low for ${newTier} tier`);
        this.emitError('bandwidth_insufficient', {
          required: tierInfo.minBandwidth,
          actual: this.state.bandwidth
        });
        return false;
      }

      const previousTier = this.state.currentTier;

      // Handle premium tier connection/disconnection
      if (newTier === 'premium' && previousTier !== 'premium') {
        // Upgrade to premium - provision GPU
        const success = await this.startSession();
        if (!success) {
          console.warn('Failed to provision GPU, falling back');
          this.fallbackToWebGL();
          return false;
        }
      } else if (previousTier === 'premium' && newTier !== 'premium') {
        // Downgrade from premium - destroy GPU
        await this.endSession();
      }

      this.state.currentTier = newTier;
      this.updateAvatarFrameTier(newTier);
      this.emitTierChange(newTier, previousTier);

      return true;
    }

    /**
     * Update avatar frame UI for tier
     * @param {string} tier - Tier name
     */
    updateAvatarFrameTier(tier) {
      if (!this.avatarFrame) return;

      // Remove all tier classes
      this.avatarFrame.classList.remove(
        'tier-free', 'tier-standard', 'tier-premium', 'tier-fallback',
        'transitioning'
      );

      // Add transition effect
      this.avatarFrame.classList.add('transitioning');

      // Add new tier class
      setTimeout(() => {
        this.avatarFrame.classList.add(`tier-${tier}`);
        this.avatarFrame.classList.remove('transitioning');
      }, 500);

      // Update live badge
      const liveBadge = this.avatarFrame.querySelector('.avatar-live-badge');
      if (liveBadge) {
        if (tier === 'premium') {
          liveBadge.innerHTML = '<span class="live-dot"></span> LIVE HD';
          liveBadge.classList.add('premium', 'hd');
          liveBadge.style.display = 'flex';
        } else if (tier === 'standard') {
          liveBadge.innerHTML = '<span class="live-dot"></span> LIVE';
          liveBadge.classList.remove('premium', 'hd');
          liveBadge.style.display = 'flex';
        } else {
          liveBadge.style.display = 'none';
        }
      }
    }

    /**
     * Start premium GPU session
     * @returns {Promise<boolean>}
     */
    async startSession() {
      if (this.state.isProvisioning) {
        console.warn('Already provisioning');
        return false;
      }

      console.log('🚀 Starting premium GPU session...');
      this.state.isProvisioning = true;
      this.state.provisioningProgress = 0;

      try {
        // Provision GPU droplet
        const droplet = await this.provisionDroplet();
        if (!droplet) {
          throw new Error('Failed to provision droplet');
        }

        this.state.dropletId = droplet.id;
        this.state.dropletIp = droplet.ip;
        this.state.streamUrl = `wss://${droplet.ip}:8888`;
        this.state.sessionId = droplet.session_id;
        this.state.sessionStartTime = Date.now();

        // Connect to Pixel Streaming
        const connected = await this.connectPixelStream(this.state.streamUrl);
        if (!connected) {
          throw new Error('Failed to connect to pixel stream');
        }

        this.state.isConnected = true;
        this.state.isProvisioning = false;

        // Start idle timer
        this.startIdleTimer();

        // Start session timer
        this.startSessionTimer();

        this.emitConnectionChange(true);
        console.log('✅ Premium GPU session started');

        return true;

      } catch (error) {
        console.error('Failed to start GPU session:', error);
        this.state.isProvisioning = false;
        this.emitError('session_start_failed', error.message);
        return false;
      }
    }

    /**
     * End premium GPU session
     * @returns {Promise<void>}
     */
    async endSession() {
      console.log('⏹️ Ending GPU session...');

      // Stop timers
      this.stopIdleTimer();
      this.stopSessionTimer();

      // Disconnect stream
      this.disconnectPixelStream();

      // Destroy droplet
      if (this.state.dropletId) {
        await this.destroyDroplet(this.state.dropletId);
      }

      // Calculate final cost
      const sessionDuration = Date.now() - (this.state.sessionStartTime || Date.now());
      const hoursFraction = sessionDuration / 3600000;
      this.state.sessionCostCents = Math.ceil(hoursFraction * TIERS.PREMIUM.cost * 100);

      // Log session to backend
      await this.logSession({
        session_id: this.state.sessionId,
        droplet_id: this.state.dropletId,
        duration_ms: sessionDuration,
        cost_cents: this.state.sessionCostCents
      });

      // Reset state
      this.state.isConnected = false;
      this.state.dropletId = null;
      this.state.dropletIp = null;
      this.state.streamUrl = null;
      this.state.sessionStartTime = null;

      this.emitConnectionChange(false);
      console.log('✅ GPU session ended');
    }

    /**
     * Provision GPU droplet via API
     * @param {string} region - Region ID
     * @returns {Promise<Object>} Droplet info
     */
    async provisionDroplet(region = null) {
      console.log('☁️ Provisioning GPU droplet...');

      this.state.provisioningProgress = 10;

      try {
        const response = await fetch(`${this.config.apiBase}/api/v1/gpu/provision`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('pmerit_auth_token')}`
          },
          body: JSON.stringify({
            region: region || await this.selectBestRegion(),
            size: this.config.dropletSize,
            image: 'pmerit-unreal-metahuman' // Custom image with Unreal + Pixel Streaming
          })
        });

        if (!response.ok) {
          throw new Error(`Provision failed: ${response.status}`);
        }

        this.state.provisioningProgress = 30;

        const data = await response.json();

        // Wait for droplet to be ready
        const ready = await this.waitForDropletReady(data.droplet_id);
        if (!ready) {
          throw new Error('Droplet failed to become ready');
        }

        this.state.provisioningProgress = 100;

        return {
          id: data.droplet_id,
          ip: data.ip_address,
          session_id: data.session_id
        };

      } catch (error) {
        console.error('Droplet provision error:', error);
        this.state.provisioningProgress = 0;
        return null;
      }
    }

    /**
     * Wait for droplet to be ready
     * @param {string} dropletId - Droplet ID
     * @param {number} maxWait - Max wait time in ms
     * @returns {Promise<boolean>}
     */
    async waitForDropletReady(dropletId, maxWait = 120000) {
      console.log('⏳ Waiting for droplet to be ready...');

      const startTime = Date.now();
      const pollInterval = 5000; // 5 seconds

      while (Date.now() - startTime < maxWait) {
        try {
          const status = await this.getDropletStatus(dropletId);

          // Update progress
          const elapsed = Date.now() - startTime;
          this.state.provisioningProgress = 30 + Math.min(60, (elapsed / maxWait) * 60);

          if (status?.status === 'active' && status?.ip) {
            return true;
          }

          await new Promise(resolve => setTimeout(resolve, pollInterval));

        } catch (error) {
          console.warn('Status check error:', error);
        }
      }

      return false;
    }

    /**
     * Get droplet status
     * @param {string} dropletId - Droplet ID
     * @returns {Promise<Object>}
     */
    async getDropletStatus(dropletId) {
      try {
        const response = await fetch(`${this.config.apiBase}/api/v1/gpu/status/${dropletId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('pmerit_auth_token')}`
          }
        });

        if (!response.ok) return null;

        return await response.json();

      } catch (error) {
        return null;
      }
    }

    /**
     * Destroy GPU droplet
     * @param {string} dropletId - Droplet ID
     * @returns {Promise<boolean>}
     */
    async destroyDroplet(dropletId) {
      console.log('🗑️ Destroying GPU droplet...');

      try {
        const response = await fetch(`${this.config.apiBase}/api/v1/gpu/destroy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('pmerit_auth_token')}`
          },
          body: JSON.stringify({ droplet_id: dropletId })
        });

        return response.ok;

      } catch (error) {
        console.error('Failed to destroy droplet:', error);
        return false;
      }
    }

    /**
     * Connect to Pixel Streaming
     * @param {string} streamUrl - WebSocket URL
     * @returns {Promise<boolean>}
     */
    async connectPixelStream(streamUrl) {
      console.log('🔗 Connecting to Pixel Streaming...');

      return new Promise((resolve) => {
        try {
          // Create stream container if needed
          if (!this.streamContainer) {
            this.streamContainer = document.createElement('div');
            this.streamContainer.id = 'pixel-stream-container';
            this.streamContainer.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 18px;
              overflow: hidden;
            `;

            if (this.avatarFrame) {
              this.avatarFrame.appendChild(this.streamContainer);
            }
          }

          // Initialize Pixel Streaming (requires Unreal's PixelStreaming.js)
          if (typeof PixelStreaming !== 'undefined') {
            this.state.pixelStreaming = new PixelStreaming({
              container: this.streamContainer,
              signallingServerUrl: streamUrl,
              autoPlayVideo: true,
              startVideoMuted: true
            });

            this.state.pixelStreaming.addEventListener('connect', () => {
              console.log('✅ Pixel Streaming connected');
              resolve(true);
            });

            this.state.pixelStreaming.addEventListener('error', (error) => {
              console.error('Pixel Streaming error:', error);
              resolve(false);
            });

            this.state.pixelStreaming.connect();

          } else {
            // Fallback: Create video element for WHEP/WebRTC stream
            console.log('Using WebRTC fallback...');

            const video = document.createElement('video');
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true;
            video.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';

            this.streamContainer.appendChild(video);

            // Connect via WebRTC
            this.connectWebRTC(streamUrl, video)
              .then(resolve)
              .catch(() => resolve(false));
          }

        } catch (error) {
          console.error('Pixel Stream connection error:', error);
          resolve(false);
        }
      });
    }

    /**
     * Connect via WebRTC (fallback)
     * @param {string} url - Signaling URL
     * @param {HTMLVideoElement} videoElement - Video element
     * @returns {Promise<boolean>}
     */
    async connectWebRTC(url, videoElement) {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.ontrack = (event) => {
          videoElement.srcObject = event.streams[0];
        };

        // Signal exchange would happen here with your signaling server
        // This is a simplified example

        this.state.peerConnection = pc;
        return true;

      } catch (error) {
        console.error('WebRTC connection failed:', error);
        return false;
      }
    }

    /**
     * Disconnect from Pixel Stream
     */
    disconnectPixelStream() {
      if (this.state.pixelStreaming) {
        this.state.pixelStreaming.disconnect();
        this.state.pixelStreaming = null;
      }

      if (this.state.peerConnection) {
        this.state.peerConnection.close();
        this.state.peerConnection = null;
      }

      if (this.streamContainer) {
        this.streamContainer.innerHTML = '';
      }
    }

    /**
     * Send input to stream (for interactive avatar)
     * @param {Object} input - Input data
     */
    sendInputToStream(input) {
      if (this.state.pixelStreaming) {
        this.state.pixelStreaming.emitUIInteraction(input);
      }

      // Reset idle timer on activity
      this.resetIdleTimer();
    }

    /**
     * Handle stream message
     * @param {Object} message - Message from stream
     */
    handleStreamMessage(message) {
      // Process messages from Unreal (e.g., animation events, speech)
      console.log('Stream message:', message);

      this.resetIdleTimer();
    }

    /**
     * Start idle timer
     */
    startIdleTimer() {
      this.stopIdleTimer();

      this.state.idleTimer = setTimeout(() => {
        this.handleIdleTimeout();
      }, this.config.idleTimeout);
    }

    /**
     * Reset idle timer
     */
    resetIdleTimer() {
      this.state.lastActivity = Date.now();

      if (this.state.isConnected) {
        this.startIdleTimer();
      }
    }

    /**
     * Stop idle timer
     */
    stopIdleTimer() {
      if (this.state.idleTimer) {
        clearTimeout(this.state.idleTimer);
        this.state.idleTimer = null;
      }
    }

    /**
     * Handle idle timeout
     */
    async handleIdleTimeout() {
      console.log('⏰ Idle timeout reached');

      // Downgrade to save costs
      await this.switchTier('standard');
    }

    /**
     * Start session timer (max duration)
     */
    startSessionTimer() {
      this.stopSessionTimer();

      this.state.sessionTimer = setInterval(() => {
        const duration = Date.now() - this.state.sessionStartTime;
        const hoursFraction = duration / 3600000;
        const costCents = Math.ceil(hoursFraction * TIERS.PREMIUM.cost * 100);

        this.state.sessionCostCents = costCents;
        this.emitCostUpdate(costCents);

        // Check max duration
        if (duration >= this.config.maxSessionDuration) {
          console.log('⏰ Max session duration reached');
          this.switchTier('standard');
        }

      }, 60000); // Update every minute
    }

    /**
     * Stop session timer
     */
    stopSessionTimer() {
      if (this.state.sessionTimer) {
        clearInterval(this.state.sessionTimer);
        this.state.sessionTimer = null;
      }
    }

    /**
     * Get current session cost
     * @returns {number} Cost in cents
     */
    getSessionCost() {
      if (!this.state.sessionStartTime) return 0;

      const duration = Date.now() - this.state.sessionStartTime;
      const hoursFraction = duration / 3600000;
      return Math.ceil(hoursFraction * TIERS.PREMIUM.cost * 100);
    }

    /**
     * Get formatted session cost
     * @returns {string}
     */
    getFormattedCost() {
      const cents = this.getSessionCost();
      return `$${(cents / 100).toFixed(2)}`;
    }

    /**
     * Log session to backend
     * @param {Object} data - Session data
     */
    async logSession(data) {
      try {
        await fetch(`${this.config.apiBase}/api/v1/gpu/log-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('pmerit_auth_token')}`
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.warn('Failed to log session:', error);
      }
    }

    /**
     * Fallback to WebGL
     */
    fallbackToWebGL() {
      console.log('📉 Falling back to WebGL avatar');
      this.state.currentTier = 'standard';
      this.updateAvatarFrameTier('standard');
      this.emitTierChange('standard', 'premium');
    }

    /**
     * Fallback to cartoon
     */
    fallbackToCartoon() {
      console.log('📉 Falling back to cartoon avatar');
      this.state.currentTier = 'free';
      this.updateAvatarFrameTier('free');
      this.emitTierChange('free', this.state.currentTier);
    }

    /**
     * Handle stream error
     * @param {Error} error - Error object
     */
    handleStreamError(error) {
      console.error('Stream error:', error);
      this.emitError('stream_error', error.message);

      // Attempt fallback
      this.fallbackToWebGL();
    }

    /**
     * Register tier change callback
     * @param {Function} callback - Callback(newTier, previousTier)
     */
    onTierChange(callback) {
      this.callbacks.onTierChange = callback;
    }

    /**
     * Register connection change callback
     * @param {Function} callback - Callback(isConnected)
     */
    onConnectionChange(callback) {
      this.callbacks.onConnectionChange = callback;
    }

    /**
     * Register error callback
     * @param {Function} callback - Callback(type, message)
     */
    onError(callback) {
      this.callbacks.onError = callback;
    }

    /**
     * Register cost update callback
     * @param {Function} callback - Callback(costCents)
     */
    onCostUpdate(callback) {
      this.callbacks.onCostUpdate = callback;
    }

    /**
     * Emit tier change event
     */
    emitTierChange(newTier, previousTier) {
      if (this.callbacks.onTierChange) {
        this.callbacks.onTierChange(newTier, previousTier);
      }
    }

    /**
     * Emit connection change event
     */
    emitConnectionChange(isConnected) {
      if (this.callbacks.onConnectionChange) {
        this.callbacks.onConnectionChange(isConnected);
      }
    }

    /**
     * Emit error event
     */
    emitError(type, message) {
      if (this.callbacks.onError) {
        this.callbacks.onError(type, message);
      }
    }

    /**
     * Emit cost update event
     */
    emitCostUpdate(costCents) {
      if (this.callbacks.onCostUpdate) {
        this.callbacks.onCostUpdate(costCents);
      }
    }

    /**
     * Get current state
     * @returns {Object}
     */
    getState() {
      return {
        currentTier: this.state.currentTier,
        isConnected: this.state.isConnected,
        bandwidth: this.state.bandwidth,
        sessionCostCents: this.getSessionCost(),
        isProvisioning: this.state.isProvisioning,
        provisioningProgress: this.state.provisioningProgress
      };
    }

    /**
     * Cleanup and destroy
     */
    async destroy() {
      console.log('🗑️ Destroying GPU Streaming...');

      // End session if active
      if (this.state.isConnected) {
        await this.endSession();
      }

      // Stop timers
      this.stopIdleTimer();
      this.stopSessionTimer();

      // Remove stream container
      if (this.streamContainer && this.streamContainer.parentNode) {
        this.streamContainer.parentNode.removeChild(this.streamContainer);
        this.streamContainer = null;
      }

      console.log('✅ GPU Streaming destroyed');
    }
  }

  // Export tier definitions
  GPUStreaming.TIERS = TIERS;
  GPUStreaming.REGIONS = GPU_REGIONS;

  // Export to window
  window.GPUStreaming = GPUStreaming;

  // Factory function
  window.createGPUStreaming = async function(avatarFrameElement, config = {}) {
    const gpuStreaming = new GPUStreaming(config);
    await gpuStreaming.init(avatarFrameElement);
    return gpuStreaming;
  };

  console.log('✅ GPUStreaming module loaded (v1.0 - Digital Desk)');

})(window);
