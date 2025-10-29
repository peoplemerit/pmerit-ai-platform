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
      // Use PMERIT global config with fallbacks
      const PMERIT = window.PMERIT || {};
      this.config = {
        avatarBaseUrl: config.avatarBaseUrl || PMERIT.AVATAR_BASE_URL || '/assets/avatars/',
        modelFile: config.modelFile || PMERIT.AVATAR_MODEL || 'pm_classic.glb',
        avatarScale: config.avatarScale || PMERIT.AVATAR_SCALE || 1.0,
        cameraPos: config.cameraPos || PMERIT.CAMERA_POS || [0, 1.4, 2.2],
        lightPreset: config.lightPreset || PMERIT.LIGHT_PRESET || 'hemi-dir-soft',
        modelLoadTimeout: config.modelLoadTimeout || 10000, // 10 seconds default
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
        speakAction: null,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

        // Handle reduced motion changes
        this._onReducedMotionBound = this._onReducedMotionChange.bind(this);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', this._onReducedMotionBound);
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(this._onReducedMotionBound);
        }

        this.state.initialized = true;
        console.log('✅ WebGLProvider initialized');
        
        if (this.state.reducedMotion) {
          console.log('ℹ️ Reduced motion mode detected');
        }
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
      
      // Use configured camera position
      const camPos = this.config.cameraPos;
      this.camera.position.set(camPos[0], camPos[1], camPos[2]);
      this.camera.lookAt(0, camPos[1] - 0.1, 0);

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
     * Set up scene lighting based on preset
     * @private
     */
    _setupLights() {
      const preset = this.config.lightPreset;
      
      if (preset === 'hemi-dir-soft') {
        // Hemisphere + Directional + Soft fill (default)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 3, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0x66fcf1, 0.3);
        fillLight.position.set(-2, 1, -2);
        this.scene.add(fillLight);
      } else if (preset === 'hemi-dir-hard') {
        // Stronger contrast lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(2, 3, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
      } else if (preset === 'three-point') {
        // Traditional three-point lighting
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(2, 3, 2);
        keyLight.castShadow = true;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-2, 1, 1);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0x66fcf1, 0.6);
        backLight.position.set(0, 2, -2);
        this.scene.add(backLight);
      } else {
        // Fallback to default soft lighting
        console.warn(`Unknown light preset: ${preset}, using default`);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 3, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
      }
    }

    /**
     * Load avatar model from config or fallback to placeholder
     * @private
     */
    async _loadAvatar() {
      try {
        // Build full model URL - handle both relative and absolute base URLs
        const baseUrl = this.config.avatarBaseUrl.startsWith('http')
          ? this.config.avatarBaseUrl
          : window.location.origin + this.config.avatarBaseUrl;
        const modelUrl = new URL(this.config.modelFile, baseUrl).toString();

        console.log(`📦 Attempting to load avatar from: ${modelUrl}`);
        console.log(`📦 Config: avatarBaseUrl="${this.config.avatarBaseUrl}", modelFile="${this.config.modelFile}"`);

        // Attempt to load GLB model with try-catch for GLTFLoader availability
        try {
          await this._loadGLBModel(modelUrl);
          console.log(`✅ Successfully loaded GLB model from ${modelUrl}`);
        } catch (loadError) {
          // GLTFLoader not available or model load failed
          console.warn('⚠️ GLTFLoader not available or load failed, using placeholder orb fallback');
          console.warn('⚠️ Error details:', loadError.message);
          this._createPlaceholderAvatar();
        }
      } catch (error) {
        console.warn('⚠️ Failed to load avatar model, using placeholder orb fallback:', error.message);
        this._createPlaceholderAvatar();
      }
    }

    /**
     * Load GLB model using GLTFLoader
     * @private
     */
    async _loadGLBModel(url) {
      return new Promise((resolve, reject) => {
        if (!THREE.GLTFLoader) {
          console.error('❌ THREE.GLTFLoader is not available. Make sure GLTFLoader.js is loaded after Three.js');
          reject(new Error('GLTFLoader not available'));
          return;
        }
        if (!THREE.GLTFLoader) {
          reject(new Error('GLTFLoader not available'));
          return;
        }
        const loader = new THREE.GLTFLoader();
        
        console.log(`🔄 Starting GLB load from: ${url}`);
        
        // Set configurable timeout for loading
        const timeout = setTimeout(() => {
          console.error(`❌ Model loading timeout (${this.config.modelLoadTimeout}ms) - ${url}`);
          reject(new Error('Model loading timeout'));
        }, this.config.modelLoadTimeout);

        loader.load(
          url,
          (gltf) => {
            clearTimeout(timeout);
            this.state.model = gltf.scene;
            
            // Apply configured scale
            this.state.model.scale.setScalar(this.config.avatarScale);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(this.state.model);
            const center = box.getCenter(new THREE.Vector3());
            this.state.model.position.set(-center.x, -box.min.y, -center.z);
            
            // Enable shadows
            this.state.model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            this.scene.add(this.state.model);

            // Set up animation mixer
            this.state.mixer = new THREE.AnimationMixer(this.state.model);
            
            // Look for idle and speaking animations
            if (gltf.animations && gltf.animations.length > 0) {
              console.log(`🎬 Found ${gltf.animations.length} animation(s) in model`);
              gltf.animations.forEach((clip) => {
                if (clip.name.toLowerCase().includes('idle')) {
                  this.state.idleAction = this.state.mixer.clipAction(clip);
                  this.state.idleAction.play();
                  console.log(`▶️ Playing idle animation: ${clip.name}`);
                } else if (clip.name.toLowerCase().includes('speak')) {
                  this.state.speakAction = this.state.mixer.clipAction(clip);
                  console.log(`🔊 Found speaking animation: ${clip.name}`);
                }
              });
            } else {
              console.log('ℹ️ No animations found in model');
            }

            console.log('✅ Avatar model loaded and initialized successfully');
            resolve();
          },
          (progress) => {
            if (progress.total > 0) {
              const percent = (progress.loaded / progress.total * 100).toFixed(0);
              console.log(`📦 Loading avatar: ${percent}% (${progress.loaded}/${progress.total} bytes)`);
            } else {
              console.log(`📦 Loading avatar: ${progress.loaded} bytes received...`);
            }
          },
          (error) => {
            clearTimeout(timeout);
            console.error(`❌ GLB load error for ${url}:`, error);
            console.error('   Check Network tab for HTTP status. Common issues:');
            console.error('   - 404: File not found at path');
            console.error('   - 403: Permission denied');
            console.error('   - CORS: Cross-origin request blocked');
            console.error('   - CSP: Content Security Policy violation');
            reject(error);
          }
        );
      });
    }

    /**
     * Create placeholder sphere avatar
     * @private
     */
    _createPlaceholderAvatar() {
      console.log('📦 Creating placeholder avatar (orb)...');

      // Create a simple sphere as avatar placeholder
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
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

      console.log('✅ Placeholder avatar created');
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

        // Update animations (skip if reduced motion is enabled)
        const delta = deltaTime / 1000;
        if (!this.state.reducedMotion) {
          if (this.state.mixer) {
            this.state.mixer.update(delta);
          }
          if (this.idleAnimation) {
            this.idleAnimation.update(delta);
          }
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
     * Handle reduced motion preference change
     * @private
     */
    _onReducedMotionChange(event) {
      this.state.reducedMotion = event.matches;
      console.log(`ℹ️ Reduced motion: ${this.state.reducedMotion ? 'enabled' : 'disabled'}`);
      
      // Pause animations if reduced motion is enabled
      if (this.state.reducedMotion) {
        if (this.state.idleAction) {
          this.state.idleAction.paused = true;
        }
        if (this.state.speakAction) {
          this.state.speakAction.paused = true;
        }
      } else {
        if (this.state.idleAction && !this.state.speaking) {
          this.state.idleAction.paused = false;
        }
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
      if (this._onReducedMotionBound) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', this._onReducedMotionBound);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(this._onReducedMotionBound);
        }
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
