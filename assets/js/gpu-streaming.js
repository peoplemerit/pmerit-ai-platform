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
   * Avatar tier definitions with 3D model paths
   */
  const TIERS = {
    FREE: {
      name: 'free',
      minBandwidth: 0,
      avatar: 'cartoon',
      description: 'CSS/SVG Animation',
      cost: 0,
      model: null // Uses CSS avatar
    },
    STANDARD: {
      name: 'standard',
      minBandwidth: 5, // Mbps
      avatar: 'webgl',
      description: 'WebGL 3D Avatar',
      cost: 0,
      model: '/assets/models/avatars/humano_professional.glb' // Use same model for debugging
    },
    PREMIUM: {
      name: 'premium',
      minBandwidth: 25, // Mbps for smooth 1080p streaming
      avatar: 'unreal',
      description: 'Unreal MetaHuman',
      cost: 2.68, // $/hr for H100
      model: '/assets/models/avatars/humano_professional.glb' // 5.8 MB premium fallback
    },
    FALLBACK: {
      name: 'fallback',
      minBandwidth: 0,
      avatar: 'static',
      description: 'Static Image',
      cost: 0,
      model: null
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
        isStreaming: false,
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

      // WebGL state for 3D avatar rendering
      this.webgl = {
        scene: null,
        camera: null,
        renderer: null,
        model: null,
        mixer: null,
        clock: null,
        animationId: null,
        isLoading: false,
        loadedModel: null
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
            await this.selectTierForBandwidth(this.state.bandwidth);
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
          await this.selectTierForBandwidth(this.state.bandwidth);
          return this.state.bandwidth;
        }

        const blob = await response.blob();
        const endTime = performance.now();

        const durationSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = blob.size * 8;
        const bps = bitsLoaded / durationSeconds;
        const mbps = bps / 1000000;

        this.state.bandwidth = mbps;
        await this.selectTierForBandwidth(mbps);

        return mbps;

      } catch (error) {
        console.warn('Bandwidth detection failed:', error);
        // Default to standard tier bandwidth
        this.state.bandwidth = 10;
        await this.selectTierForBandwidth(10);
        return 10;
      }
    }

    /**
     * Select tier based on bandwidth
     * @param {number} mbps - Bandwidth in Mbps
     * @returns {string} Selected tier name
     */
    async selectTierForBandwidth(mbps) {
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

      // Auto-load WebGL avatar for standard tier
      if (selectedTier === 'standard' && this.avatarFrame) {
        // Wait a frame for container to be visible and sized
        await new Promise(resolve => requestAnimationFrame(resolve));
        const tierInfo = this.getTierInfo('standard');
        if (tierInfo.model) {
          console.log('🎭 Auto-loading WebGL avatar for standard tier...');
          await this.loadWebGLAvatar(tierInfo.model);
        }
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

      // Handle tier-specific transitions
      if (newTier === 'premium' && previousTier !== 'premium') {
        // Upgrade to premium - provision GPU
        this.disposeWebGL(); // Clean up WebGL first
        const success = await this.startSession();
        if (!success) {
          console.warn('Failed to provision GPU, falling back');
          await this.fallbackToWebGL();
          return false;
        }
      } else if (previousTier === 'premium' && newTier !== 'premium') {
        // Downgrade from premium - destroy GPU
        await this.endSession();
      }

      // Handle WebGL avatar for standard tier
      if (newTier === 'standard') {
        // Load 3D WebGL avatar
        const webglSuccess = await this.loadWebGLAvatar(tierInfo.model);
        if (!webglSuccess) {
          console.warn('WebGL avatar failed, falling back to CSS');
          this.state.currentTier = 'free';
          this.updateAvatarFrameTier('free');
          this.emitTierChange('free', previousTier);
          return false;
        }
      } else if (newTier === 'free' && previousTier === 'standard') {
        // Downgrading from standard to free - dispose WebGL
        this.disposeWebGL();
      }

      this.state.currentTier = newTier;
      this.updateAvatarFrameTier(newTier);
      this.emitTierChange(newTier, previousTier);

      return true;
    }

    /**
     * Start streaming - loads the avatar based on current/recommended tier
     * This is the main entry point to begin avatar rendering
     * @returns {Promise<boolean>}
     */
    async startStreaming() {
      console.log('🎬 Starting avatar streaming...');

      // Use the detected tier or default to standard
      const targetTier = this.state.currentTier || 'standard';

      try {
        // Switch to the target tier, which will load the appropriate avatar
        const success = await this.switchTier(targetTier);

        if (success) {
          this.state.isStreaming = true;
          console.log(`✅ Avatar streaming started (${targetTier} tier)`);
        } else {
          // Tier switch failed, try fallback to WebGL standard
          console.warn('Tier switch failed, attempting WebGL fallback...');
          await this.fallbackToWebGL();
          this.state.isStreaming = true;
        }

        return true;
      } catch (error) {
        console.error('Failed to start streaming:', error);
        // Last resort: try cartoon fallback
        this.fallbackToCartoon();
        return false;
      }
    }

    /**
     * Stop streaming - disposes WebGL resources and stops rendering
     */
    stopStreaming() {
      console.log('🛑 Stopping avatar streaming...');

      this.state.isStreaming = false;

      // Dispose WebGL resources
      this.disposeWebGL();

      // If we have a premium session, end it
      if (this.state.currentTier === 'premium' && this.state.sessionActive) {
        this.endSession();
      }

      console.log('✅ Avatar streaming stopped');
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
     * Fallback to WebGL (loads 3D avatar)
     */
    async fallbackToWebGL() {
      console.log('📉 Falling back to WebGL avatar');
      this.state.currentTier = 'standard';
      this.updateAvatarFrameTier('standard');

      // Load the 3D WebGL avatar
      const success = await this.loadWebGLAvatar(TIERS.STANDARD.model);
      if (!success) {
        console.warn('WebGL fallback failed, using CSS avatar');
        this.fallbackToCartoon();
        return;
      }

      this.emitTierChange('standard', 'premium');
    }

    /**
     * Fallback to cartoon
     */
    fallbackToCartoon() {
      console.log('📉 Falling back to cartoon avatar');
      this.disposeWebGL();
      this.state.currentTier = 'free';
      this.updateAvatarFrameTier('free');
      this.emitTierChange('free', this.state.currentTier);
    }

    // =========================================================================
    // WebGL 3D Avatar Rendering
    // =========================================================================

    /**
     * Load and render WebGL 3D avatar
     * @param {string} modelPath - Path to GLB model file
     * @returns {Promise<boolean>}
     */
    async loadWebGLAvatar(modelPath = null) {
      console.log('🎭 loadWebGLAvatar called');

      // Use tier model if not specified
      const tierInfo = this.getTierInfo(this.state.currentTier);
      const path = modelPath || tierInfo?.model || TIERS.STANDARD.model;
      if (!path) {
        console.warn('No model path specified for WebGL avatar');
        return false;
      }

      // Check if Three.js is available
      if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded. Cannot render WebGL avatar.');
        return false;
      }

      // Don't reload same model
      if (this.webgl.loadedModel === path && this.webgl.renderer) {
        return true;
      }

      console.log('🎭 Loading 3D avatar:', path);
      this.webgl.isLoading = true;

      try {
        // Dispose previous WebGL resources
        this.disposeWebGL();

        // Get container dimensions
        const container = this.avatarFrame;
        if (!container) {
          throw new Error('Avatar frame container not found');
        }

        // Get dimensions - use reasonable defaults if container is hidden
        // Container may be hidden initially, so fallback dimensions are important
        let width = container.clientWidth;
        let height = container.clientHeight;

        // If container is hidden/collapsed, use CSS variable values or defaults
        if (width < 50 || height < 50) {
          // Try to get from computed style
          const style = getComputedStyle(document.documentElement);
          const cssWidth = parseInt(style.getPropertyValue('--vh-container-max-width')) || 400;
          const cssHeight = parseInt(style.getPropertyValue('--vh-container-height')) || 380;
          width = width || cssWidth;
          height = height || cssHeight;
          console.log(`📐 Container hidden, using fallback dimensions: ${width}x${height}`);
        }

        // Ensure minimum dimensions for WebGL
        width = Math.max(width, 300);
        height = Math.max(height, 350);

        // Canvas dimensions set

        // Create scene with transparent background (shows avatar-frame gradient)
        this.webgl.scene = new THREE.Scene();
        // Transparent background - let CSS gradient show through
        this.webgl.scene.background = null;

        // Create camera - will reposition after model loads for waist-up framing
        this.webgl.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        this.webgl.camera.position.set(0, 1.4, 2.5);
        this.webgl.camera.lookAt(0, 1.2, 0);

        // Find the avatar-stage container (or fall back to avatar-frame)
        const avatarStage = container.querySelector('.avatar-stage');
        const canvasContainer = avatarStage || container;

        // Remove any existing vh-canvas to prevent conflicts
        const existingCanvas = canvasContainer.querySelector('canvas#vh-canvas');
        if (existingCanvas) {
          existingCanvas.remove();
        }

        // Create new WebGL renderer with transparency
        this.webgl.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true, // Enable transparency for CSS background to show
          powerPreference: 'high-performance'
        });

        // Transparent clear color
        this.webgl.renderer.setClearColor(0x000000, 0);

        // Get the canvas element from the renderer
        const canvas = this.webgl.renderer.domElement;

        // Set canvas ID and styling
        canvas.id = 'vh-canvas';
        canvas.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          z-index: 10;
          display: block;
        `;

        // Set pixel dimensions for WebGL rendering
        canvas.width = width;
        canvas.height = height;

        // Append canvas to the container
        canvasContainer.appendChild(canvas);

        // Verify canvas is in DOM
        if (!canvas.parentElement) {
          throw new Error('Canvas not attached to DOM');
        }

        this.webgl.renderer.setSize(width, height);
        this.webgl.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.webgl.renderer.outputEncoding = THREE.sRGBEncoding;
        this.webgl.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.webgl.renderer.toneMappingExposure = 1.0;
        this.webgl.renderer.shadowMap.enabled = true;
        this.webgl.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add lighting
        this.setupLighting();

        // Load the model
        await this.loadGLBModel(path);

        // Create animation clock
        this.webgl.clock = new THREE.Clock();

        // Start animation loop
        this.startWebGLAnimation();

        // Handle resize
        this.setupResizeHandler();

        this.webgl.isLoading = false;
        this.webgl.loadedModel = path;

        console.log('✅ WebGL 3D avatar loaded successfully');
        return true;

      } catch (error) {
        console.error('Failed to load WebGL avatar:', error);
        this.webgl.isLoading = false;
        this.disposeWebGL();
        return false;
      }
    }

    /**
     * Set up scene lighting
     */
    setupLighting() {
      if (!this.webgl.scene) return;

      // Ambient light for overall illumination (increased for better visibility)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.webgl.scene.add(ambientLight);

      // Hemisphere light for natural sky/ground gradient lighting
      // This helps PBR materials look good without full environment map
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
      hemiLight.position.set(0, 10, 0);
      this.webgl.scene.add(hemiLight);

      // Key light (main light from front-right)
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
      keyLight.position.set(2, 3, 2);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      this.webgl.scene.add(keyLight);

      // Fill light (softer, from front-left)
      const fillLight = new THREE.DirectionalLight(0x9bb5ff, 0.4);
      fillLight.position.set(-2, 2, 2);
      this.webgl.scene.add(fillLight);

      // Rim light (from behind for edge definition)
      const rimLight = new THREE.DirectionalLight(0x4aa4b9, 0.5);
      rimLight.position.set(0, 2, -3);
      this.webgl.scene.add(rimLight);

      // Ground plane for shadows (invisible)
      const groundGeometry = new THREE.PlaneGeometry(10, 10);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      this.webgl.scene.add(ground);
    }

    /**
     * Load GLB model using GLTFLoader
     * @param {string} path - Model path
     * @returns {Promise<void>}
     */
    async loadGLBModel(path) {

      return new Promise((resolve, reject) => {
        // Check for GLTFLoader
        if (typeof THREE.GLTFLoader === 'undefined') {
          reject(new Error('GLTFLoader not available'));
          return;
        }

        const loader = new THREE.GLTFLoader();

        // Add loading progress
        loader.load(
          path,
          (gltf) => {
            this.webgl.model = gltf.scene;

            // Calculate model bounds
            const rawBox = new THREE.Box3().setFromObject(this.webgl.model);
            const rawSize = rawBox.getSize(new THREE.Vector3());

            // Scale to fit ~1.8m height
            const targetHeight = 1.8;
            let scale = 1;
            if (rawSize.y > 0.01) {
              scale = targetHeight / rawSize.y;
            }
            this.webgl.model.scale.setScalar(scale);

            // Recalculate bounds after scaling
            const box = new THREE.Box3().setFromObject(this.webgl.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Center horizontally, place feet at y=0
            this.webgl.model.position.x = -center.x;
            this.webgl.model.position.y = -box.min.y;
            this.webgl.model.position.z = -center.z;

            // Load and apply external textures for photorealistic rendering
            const textureLoader = new THREE.TextureLoader();
            const texturePath = '/assets/avatars/';

            // Load PBR texture maps
            const colorMap = textureLoader.load(texturePath + 'Humano_Rig_064-4893_Color01_1K.jpg');
            const normalMap = textureLoader.load(texturePath + 'Humano_Rig_064-4893_Normal-LOD3_1K.jpg');
            const roughnessMap = textureLoader.load(texturePath + 'Humano_Rig_064-4893_Roughness_1K.jpg');
            const aoMap = textureLoader.load(texturePath + 'Humano_Rig_064-4893_AO_1K.jpg');

            // Configure textures for GLB/glTF compatibility
            [colorMap, normalMap, roughnessMap, aoMap].forEach(tex => {
              tex.flipY = false; // GLB models need flipY = false
            });

            // Set color space for accurate color display
            colorMap.encoding = THREE.sRGBEncoding;

            console.log('📷 Loading avatar textures from:', texturePath);

            // Apply textures and enable shadows (preserve existing material properties)
            this.webgl.model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                const isSkinnedMesh = child.isSkinnedMesh;
                console.log('🎨 Applying textures to mesh:', child.name, isSkinnedMesh ? '(skinned)' : '');

                // Update existing material's texture maps (preserves skinning/morphing)
                if (child.material) {
                  child.material.map = colorMap;
                  child.material.normalMap = normalMap;
                  child.material.roughnessMap = roughnessMap;
                  child.material.aoMap = aoMap;
                  child.material.roughness = 0.8;
                  child.material.metalness = 0.0; // Skin/fabric are non-metallic
                  child.material.envMapIntensity = 0.3;
                  child.material.needsUpdate = true;
                }

                // Copy UV coordinates to UV2 for ambient occlusion map
                if (child.geometry && child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
                  child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
                }
              }
            });

            console.log('✅ Avatar textures applied (skinning preserved)');

            // Add to scene
            this.webgl.scene.add(this.webgl.model);

            // Position camera for waist-up "video call" framing
            // Camera looks at upper body (chest/face area)
            const waistY = size.y * 0.55; // Waist level
            const headY = size.y * 0.9;   // Head level
            const lookAtY = (waistY + headY) / 2; // Look at chest/neck area
            const cameraDistance = size.y * 0.9; // Closer for waist-up view

            this.webgl.camera.position.set(0, lookAtY, cameraDistance);
            this.webgl.camera.lookAt(0, lookAtY, 0);

            // Set up animations if present
            if (gltf.animations && gltf.animations.length > 0) {
              console.log(`🎬 Playing animation: ${gltf.animations[0].name || 'default'}`);
              this.webgl.mixer = new THREE.AnimationMixer(this.webgl.model);
              const action = this.webgl.mixer.clipAction(gltf.animations[0]);
              action.play();
            }

            // Force initial render
            if (this.webgl.renderer && this.webgl.scene && this.webgl.camera) {
              this.webgl.renderer.render(this.webgl.scene, this.webgl.camera);
            }

            console.log(`✅ 3D avatar loaded: ${path}`);

            // Initialize lip sync after model loads
            this.initLipSync();

            resolve();
          },
          (progress) => {
            if (progress.total > 0) {
              const percent = (progress.loaded / progress.total * 100).toFixed(0);
              console.log(`📦 Loading model: ${percent}%`);
            } else {
              console.log(`📦 Loading model: ${progress.loaded} bytes...`);
            }
          },
          (error) => {
            console.error('❌ Model load error:', error);
            reject(error);
          }
        );
      });
    }

    /**
     * Start WebGL animation loop
     */
    startWebGLAnimation() {
      if (this.webgl.animationId) {
        cancelAnimationFrame(this.webgl.animationId);
      }

      const animate = () => {
        this.webgl.animationId = requestAnimationFrame(animate);

        if (!this.webgl.renderer || !this.webgl.scene || !this.webgl.camera) {
          return;
        }

        // Update animation mixer (plays GLB animations)
        if (this.webgl.mixer && this.webgl.clock) {
          const delta = this.webgl.clock.getDelta();
          this.webgl.mixer.update(delta);
        }

        // Subtle idle animation (breathing/swaying) when no GLB animation
        if (this.webgl.model && !this.webgl.mixer) {
          const time = Date.now() * 0.001;
          // Store base Y to avoid drift
          if (this.webgl._baseY === undefined) {
            this.webgl._baseY = this.webgl.model.position.y;
          }
          // Subtle breathing motion
          this.webgl.model.position.y = this.webgl._baseY + Math.sin(time * 2) * 0.005;
          // Very subtle sway
          this.webgl.model.rotation.y = Math.sin(time * 0.5) * 0.02;
        }

        // Render frame
        this.webgl.renderer.render(this.webgl.scene, this.webgl.camera);
      };

      animate();
    }

    /**
     * Set up window resize handler
     */
    setupResizeHandler() {
      this._resizeHandler = () => {
        if (!this.avatarFrame || !this.webgl.renderer || !this.webgl.camera) return;

        const width = this.avatarFrame.clientWidth;
        const height = this.avatarFrame.clientHeight;

        // Skip if container is collapsed/hidden (dimensions too small)
        if (width < 50 || height < 50) return;

        // Update canvas pixel dimensions
        const canvas = this.webgl.renderer.domElement;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }

        this.webgl.camera.aspect = width / height;
        this.webgl.camera.updateProjectionMatrix();
        this.webgl.renderer.setSize(width, height);
      };

      window.addEventListener('resize', this._resizeHandler);

      // Also trigger resize when container becomes visible
      // This handles the case where model loads while container is hidden
      this._visibilityObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' &&
              (mutation.attributeName === 'hidden' || mutation.attributeName === 'class')) {
            // Container visibility may have changed
            setTimeout(() => this._resizeHandler(), 100);
          }
        }
      });

      // Observe the vh-root container for visibility changes
      const vhRoot = this.avatarFrame?.closest('.vh-root') || this.avatarFrame?.parentElement;
      if (vhRoot) {
        this._visibilityObserver.observe(vhRoot, { attributes: true });
      }
    }

    /**
     * Dispose WebGL resources
     */
    disposeWebGL() {
      console.log('🧹 Disposing WebGL resources...');

      // Stop animation
      if (this.webgl.animationId) {
        cancelAnimationFrame(this.webgl.animationId);
        this.webgl.animationId = null;
      }

      // Remove resize handler
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = null;
      }

      // Disconnect visibility observer
      if (this._visibilityObserver) {
        this._visibilityObserver.disconnect();
        this._visibilityObserver = null;
      }

      // Dispose mixer
      if (this.webgl.mixer) {
        this.webgl.mixer.stopAllAction();
        this.webgl.mixer = null;
      }

      // Dispose model
      if (this.webgl.model) {
        this.webgl.model.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        if (this.webgl.scene) {
          this.webgl.scene.remove(this.webgl.model);
        }
        this.webgl.model = null;
      }

      // Dispose scene objects
      if (this.webgl.scene) {
        while (this.webgl.scene.children.length > 0) {
          const child = this.webgl.scene.children[0];
          this.webgl.scene.remove(child);
        }
        this.webgl.scene = null;
      }

      // Dispose renderer
      if (this.webgl.renderer) {
        this.webgl.renderer.dispose();
        if (this.webgl.renderer.domElement && this.webgl.renderer.domElement.parentNode) {
          this.webgl.renderer.domElement.parentNode.removeChild(this.webgl.renderer.domElement);
        }
        this.webgl.renderer = null;
      }

      // Reset state
      this.webgl.camera = null;
      this.webgl.clock = null;
      this.webgl.loadedModel = null;

      console.log('✅ WebGL resources disposed');
    }

    // =========================================================================
    // Lip Sync - Connect TTS audio to avatar mouth movement
    // =========================================================================

    /**
     * Initialize lip sync listener for TTS viseme events
     * Listens to tts:viseme events emitted by tts.js
     */
    initLipSync() {
      // Remove existing listener if any
      if (this._lipSyncHandler) {
        document.removeEventListener('tts:viseme', this._lipSyncHandler);
      }

      this._lipSyncHandler = (event) => {
        const intensity = event.detail?.intensity || 0;
        this.applyMouthMovement(intensity);
      };

      document.addEventListener('tts:viseme', this._lipSyncHandler);

      // Also listen for TTS start/end to control animation state
      document.addEventListener('tts:start', () => {
        this._isSpeaking = true;
        console.log('🎤 TTS started - lip sync active');
      });

      document.addEventListener('tts:end', () => {
        this._isSpeaking = false;
        // Reset mouth to closed position
        this.applyMouthMovement(0);
        console.log('🎤 TTS ended - lip sync stopped');
      });

      console.log('👄 Lip sync listener initialized');
    }

    /**
     * Apply mouth movement to avatar model based on audio intensity
     * @param {number} intensity - Audio intensity [0..1]
     */
    applyMouthMovement(intensity) {
      if (!this.webgl?.model) return;

      // Clamp and smooth the intensity
      const mouthOpen = Math.min(Math.max(intensity, 0), 1);

      this.webgl.model.traverse((child) => {
        // Method 1: Morph targets (blend shapes)
        if (child.isMesh && child.morphTargetInfluences && child.morphTargetDictionary) {
          // Try common mouth morph target names
          const morphNames = [
            'mouthOpen', 'jawOpen', 'viseme_aa', 'viseme_O',
            'mouth_open', 'Jaw_Open', 'MouthOpen', 'A'
          ];

          for (const name of morphNames) {
            const idx = child.morphTargetDictionary[name];
            if (idx !== undefined) {
              child.morphTargetInfluences[idx] = mouthOpen;
              return; // Found one, done for this mesh
            }
          }
        }

        // Method 2: Jaw bone rotation (fallback)
        if (child.isBone) {
          const boneName = child.name?.toLowerCase() || '';
          if (boneName.includes('jaw') || boneName.includes('chin') || boneName.includes('mouth')) {
            // Rotate jaw down based on intensity (around X axis)
            // Typical range is 0 to 0.2 radians for natural mouth opening
            child.rotation.x = mouthOpen * 0.18;
          }
        }
      });
    }

    /**
     * Clean up lip sync listener
     */
    disposeLipSync() {
      if (this._lipSyncHandler) {
        document.removeEventListener('tts:viseme', this._lipSyncHandler);
        this._lipSyncHandler = null;
      }
      this._isSpeaking = false;
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

      // Dispose WebGL resources
      this.disposeWebGL();

      // Dispose lip sync listeners
      this.disposeLipSync();

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
    // Export globally for TTS lip sync integration
    window.gpuStreaming = gpuStreaming;
    return gpuStreaming;
  };

  console.log('✅ GPUStreaming module loaded (v1.0 - Digital Desk)');

})(window);
