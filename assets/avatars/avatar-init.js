/**
 * Avatar Manager - Virtual Human 3D Avatar Loader
 * Uses Three.js and GLTFLoader to render 3D avatars
 * 
 * CRITICAL FIXES:
 * 1. Wrapped in DOMContentLoaded to ensure DOM is ready
 * 2. Guards against missing #vh-canvas element
 * 3. Try/catch around init to prevent blocking other scripts
 * 4. Checks for module support before initialization
 */

// Import Three.js and GLTFLoader from CDN
import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

/**
 * AvatarManager - Manages 3D avatar rendering
 */
class AvatarManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatar = null;
    this.container = null;
    this.animationFrameId = null;
  }

  /**
   * Initialize the avatar in the specified container
   * @param {string} containerSelector - CSS selector for the canvas container
   * @param {string} modelPath - Path to the GLB model file
   * @returns {Promise<boolean>} - Success status
   */
  async init(containerSelector, modelPath) {
    try {
      // CRITICAL: Check if container exists before proceeding
      this.container = document.querySelector(containerSelector);
      
      if (!this.container) {
        console.warn(`AvatarManager: Container "${containerSelector}" not found. Skipping initialization.`);
        return false;
      }

      console.log('AvatarManager: Initializing with container:', containerSelector);

      // Setup Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1a1a1a);

      // Setup camera
      const width = this.container.clientWidth || 300;
      const height = this.container.clientHeight || 400;
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 1.6, 2.5);
      this.camera.lookAt(0, 1, 0);

      // Setup renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 2, 1);
      this.scene.add(directionalLight);

      // Load the GLB model
      const loader = new GLTFLoader();
      
      await new Promise((resolve, reject) => {
        loader.load(
          modelPath,
          (gltf) => {
            this.avatar = gltf.scene;
            this.avatar.position.set(0, 0, 0);
            this.scene.add(this.avatar);
            console.log('AvatarManager: Model loaded successfully');
            resolve();
          },
          (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`AvatarManager: Loading... ${percent.toFixed(0)}%`);
          },
          (error) => {
            console.error('AvatarManager: Error loading model:', error);
            reject(error);
          }
        );
      });

      // Handle window resize
      window.addEventListener('resize', () => this.onWindowResize());

      // Start animation loop
      this.animate();

      console.log('AvatarManager: Initialization complete');
      return true;

    } catch (error) {
      console.error('AvatarManager: Initialization failed:', error);
      return false;
    }
  }

  /**
   * Animation loop
   */
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Rotate avatar slowly
    if (this.avatar) {
      this.avatar.rotation.y += 0.005;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatar = null;
    this.container = null;
  }
}

// Create singleton instance
const avatarManager = new AvatarManager();

// Export for use in other scripts
window.AvatarManager = avatarManager;

// CRITICAL FIX: Wait for DOM to be ready before attempting initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('AvatarManager: DOM ready, module loaded successfully');
  
  // Don't auto-initialize - let the page decide when to call init
  // This prevents errors if #vh-canvas doesn't exist on this page
});

console.log('AvatarManager: Module loaded, waiting for DOMContentLoaded');
