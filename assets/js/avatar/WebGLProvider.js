/**
 * PMERIT WebGL Avatar Provider
 * Phase 3.3-A: Three.js-based avatar rendering with animation
 * 
 * This module handles WebGL rendering of the avatar using Three.js,
 * including idle animations and speaking states.
 */

(function (window) {
  'use strict';

  class WebGLProvider {
    constructor(canvas, config = {}) {
      this.canvas = canvas;
      
      // Get config from global PMERIT namespace (Phase 5)
      const pmeritConfig = window.PMERIT || {};
      
      this.config = {
        avatarBaseUrl: config.avatarBaseUrl || pmeritConfig.AVATAR_BASE_URL || '/assets/avatars',
        modelFile: config.modelFile || pmeritConfig.AVATAR_MODEL || 'pm_classic.glb',
        avatarScale: config.avatarScale || pmeritConfig.AVATAR_SCALE || 1.0,
        cameraPos: config.cameraPos || pmeritConfig.CAMERA_POS || { x: 0, y: 1.6, z: 2.5 },
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        targetFPS: config.targetFPS || 30,
        ...config
      };

      this.state = {
        initialized: false,
        paused: false,
        speaking: false,
        model: null,
        mixer: null,
        idleAction: null,
        speakAction: null
      };

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.animationFrameId = null;
      this.lastFrameTime = 0;
    }

    /**
     * Initialize Three.js scene and load avatar
     * @returns {Promise<void>}
     */
    async init() {
      if (this.state.initialized) {
        console.warn('WebGLProvider already initialized');
        return;
      }

      try {
        console.log('🎨 Initializing WebGLProvider...');

        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
          throw new Error('Three.js not loaded. Please include Three.js before WebGLProvider.');
        }

        // Set up scene
        this._setupScene();
        this._setupCamera();
        this._setupRenderer();
        this._setupLights();

        // Load avatar model (placeholder for now)
        await this._loadAvatar();

        // Start render loop
        this._startRenderLoop();

        // Handle window resize
        window.addEventListener('resize', this._onResizeBound);

        // Handle tab visibility
        document.addEventListener('visibilitychange', this._onVisibilityChangeBound);

        this.state.initialized = true;
        console.log('✅ WebGLProvider initialized');
      } catch (error) {
        console.error('❌ WebGLProvider initialization failed:', error);
        throw error;
      }
    }

    /**
     * Set up Three.js scene
     * @private
     */
    _setupScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1f2833);
    }

    /**
     * Set up camera
     * @private
     */
    _setupCamera() {
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      
      // Use camera position from config (Phase 5)
      const pos = this.config.cameraPos;
      this.camera.position.set(pos.x, pos.y, pos.z);
      this.camera.lookAt(0, 1.5, 0);

      // Store bound handlers for proper cleanup
      this._onResizeBound = this._onResize.bind(this);
      this._onVisibilityChangeBound = this._onVisibilityChange.bind(this);
    }

    /**
     * Set up renderer
     * @private
     */
    _setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false
      });
      
      this.renderer.setPixelRatio(this.config.pixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    /**
     * Set up scene lighting
     * @private
     */
    _setupLights() {
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      // Main directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(2, 3, 2);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      // Fill light
      const fillLight = new THREE.DirectionalLight(0x66fcf1, 0.3);
      fillLight.position.set(-2, 1, -2);
      this.scene.add(fillLight);
    }

    /**
     * Load avatar model
     * @private
     */
    async _loadAvatar() {
      try {
        // Build model URL from config (Phase 5)
        const modelUrl = `${this.config.avatarBaseUrl}/${this.config.modelFile}`;
        console.log(`📦 Loading avatar from: ${modelUrl}`);

        // Check if GLTFLoader is available for loading .glb models
        if (typeof THREE.GLTFLoader !== 'undefined' && this.config.modelFile.endsWith('.glb')) {
          const loader = new THREE.GLTFLoader();
          
          try {
            const gltf = await new Promise((resolve, reject) => {
              loader.load(
                modelUrl,
                resolve,
                undefined,
                reject
              );
            });

            this.state.model = gltf.scene;
            this.state.model.scale.setScalar(this.config.avatarScale);
            this.state.model.position.set(0, 0, 0);
            this.scene.add(this.state.model);

            // Set up animations if available
            if (gltf.animations && gltf.animations.length > 0) {
              this.state.mixer = new THREE.AnimationMixer(this.state.model);
              // Could set up idle and speak animations here
            }

            console.log('✅ Avatar model loaded successfully');
            return;
          } catch (loadError) {
            console.warn('⚠️ Failed to load GLB model, using fallback:', loadError.message);
            // Fall through to fallback
          }
        }

        // Fallback: Create placeholder orb (Phase 5 requirement)
        console.log('📦 Creating fallback orb avatar...');
        this._createFallbackOrb();

      } catch (error) {
        console.error('❌ Avatar load error:', error);
        // Even on error, create fallback orb
        this._createFallbackOrb();
      }
    }

    /**
     * Create fallback orb when model can't be loaded
     * @private
     */
    _createFallbackOrb() {
      const geometry = new THREE.SphereGeometry(0.3 * this.config.avatarScale, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x45a29e,
        metalness: 0.3,
        roughness: 0.4
      });

      this.state.model = new THREE.Mesh(geometry, material);
      this.state.model.position.set(0, 1.5, 0);
      this.state.model.castShadow = true;
      this.scene.add(this.state.model);

      // Create animation mixer (ready for future GLB animations)
      this.state.mixer = new THREE.AnimationMixer(this.state.model);

      // Simple idle animation (gentle bobbing)
      this._createIdleAnimation();

      console.log('✅ Fallback orb created');
    }

    /**
     * Create simple idle animation
     * @private
     */
    _createIdleAnimation() {
      // Simple up-down bobbing animation
      const initialY = this.state.model.position.y;
      this.idleAnimation = {
        time: 0,
        update: (delta) => {
          if (!this.state.speaking) {
            this.idleAnimation.time += delta;
            const offset = Math.sin(this.idleAnimation.time * 2) * 0.02;
            this.state.model.position.y = initialY + offset;
          }
        }
      };
    }

    /**
     * Start speaking animation
     */
    startSpeaking() {
      this.state.speaking = true;
      console.log('🗣️ Avatar started speaking');
    }

    /**
     * Stop speaking animation
     */
    stopSpeaking() {
      this.state.speaking = false;
      console.log('🤐 Avatar stopped speaking');
    }

    /**
     * Set morph target influences for lip-sync
     * @param {Object} visemeWeights - Map of viseme names to weights (0-1)
     */
    setVisemeWeights(visemeWeights) {
      // Placeholder for morph target manipulation
      // In production, this will set blend shape weights on the avatar model
      if (this.state.model && this.state.model.morphTargetInfluences) {
        // Example: this.state.model.morphTargetInfluences[0] = visemeWeights.A || 0;
      }
    }

    /**
     * Start render loop
     * @private
     */
    _startRenderLoop() {
      const frameInterval = 1000 / this.config.targetFPS;

      const animate = (currentTime) => {
        this.animationFrameId = requestAnimationFrame(animate);

        if (this.state.paused) return;

        // Frame rate limiting
        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime < frameInterval) return;

        this.lastFrameTime = currentTime - (deltaTime % frameInterval);

        // Update animations
        const delta = deltaTime / 1000;
        if (this.state.mixer) {
          this.state.mixer.update(delta);
        }
        if (this.idleAnimation) {
          this.idleAnimation.update(delta);
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
      };

      this.animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Pause rendering
     */
    pause() {
      this.state.paused = true;
    }

    /**
     * Resume rendering
     */
    resume() {
      this.state.paused = false;
    }

    /**
     * Handle window resize
     * @private
     */
    _onResize() {
      if (!this.canvas || !this.camera || !this.renderer) return;

      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    /**
     * Handle tab visibility change
     * @private
     */
    _onVisibilityChange() {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    }

    /**
     * Clean up resources
     */
    dispose() {
      // Cancel animation frame
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Remove event listeners
      if (this._onResizeBound) {
        window.removeEventListener('resize', this._onResizeBound);
      }
      if (this._onVisibilityChangeBound) {
        document.removeEventListener('visibilitychange', this._onVisibilityChangeBound);
      }

      // Dispose Three.js resources
      if (this.state.model) {
        this.state.model.geometry?.dispose();
        this.state.model.material?.dispose();
      }

      if (this.scene) {
        this.scene.clear();
      }

      if (this.renderer) {
        this.renderer.dispose();
      }

      this.state.initialized = false;
      console.log('🧹 WebGLProvider disposed');
    }
  }

  // Export to global scope
  window.WebGLProvider = WebGLProvider;

})(window);
