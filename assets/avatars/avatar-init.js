// File: assets/js/avatar/avatar-init.js
// Purpose: Minimal, self-contained Three.js + GLTFLoader avatar bootstrapper for PMERIT.
// - Imports Three + GLTFLoader from CDN (no local deps)
// - Creates renderer, camera, lights, resize handling
// - Loads a .glb avatar and renders it into a target container
// - Exposes window.AvatarManager.init(containerSelector, modelUrl, opts)

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

(() => {
  const state = {
    renderer: null,
    scene: null,
    camera: null,
    mixer: null,
    clock: new THREE.Clock(),
    model: null,
    raf: null,
    containerEl: null,
    isReady: false
  };

  function createRenderer(container) {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.setSize(container.clientWidth, container.clientHeight);
    r.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(r.domElement);
    return r;
    }

  function createCamera(container) {
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 1.6, 3.2);
    return camera;
  }

  function addLights(scene) {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 2, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 6);
    dir.castShadow = false;
    scene.add(dir);
  }

  function fitModelToView(object, camera) {
    // Auto-center and scale model modestly
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    object.position.sub(center); // center at origin

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const desiredSize = 1.8; // meters-ish on screen
    const scale = desiredSize / maxDim;
    object.scale.setScalar(scale);

    // Slightly raise the model (optional)
    object.position.y -= box.min.y * scale * 0.5;
  }

  function animate() {
    state.raf = requestAnimationFrame(animate);
    const dt = state.clock.getDelta();
    if (state.mixer) state.mixer.update(dt);
    state.renderer.render(state.scene, state.camera);
  }

  function onResize() {
    if (!state.containerEl || !state.renderer || !state.camera) return;
    const { clientWidth: w, clientHeight: h } = state.containerEl;
    state.renderer.setSize(w, h);
    state.camera.aspect = w / Math.max(h, 1);
    state.camera.updateProjectionMatrix();
  }

  async function loadGLB(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => resolve(gltf),
        undefined,
        (err) => reject(err)
      );
    });
  }

  async function init(containerSelector, modelUrl, opts = {}) {
    if (!THREE.WEBGL.isWebGLAvailable && THREE.WEBGL) {
      throw new Error('WebGL not available in this browser');
    }

    const container = document.querySelector(containerSelector);
    if (!container) throw new Error(`Container not found: ${containerSelector}`);

    // Clean previous session if any
    dispose();

    state.containerEl = container;
    state.scene = new THREE.Scene();
    state.camera = createCamera(container);
    state.renderer = createRenderer(container);
    addLights(state.scene);

    const url =
      modelUrl ||
      '/assets/avatars/chris_redfield__re6_bad.glb'; // your new asset (fallback below)
    const fallbackUrl = '/assets/avatars/pm_classic.glb';

    let gltf;
    try {
      gltf = await loadGLB(url);
    } catch (e) {
      console.warn(`[AvatarManager] Failed to load ${url}. Trying fallback...`, e);
      gltf = await loadGLB(fallbackUrl);
    }

    state.model = gltf.scene || gltf.scenes?.[0];
    if (!state.model) throw new Error('Loaded GLB has no scene');

    fitModelToView(state.model, state.camera);
    state.scene.add(state.model);

    // Autoplay first animation if present
    if (gltf.animations && gltf.animations.length) {
      state.mixer = new THREE.AnimationMixer(state.model);
      const clip = gltf.animations[0];
      const action = state.mixer.clipAction(clip);
      action.play();
    }

    window.addEventListener('resize', onResize);
    onResize();
    state.isReady = true;
    animate();

    return true;
  }

  function dispose() {
    cancelAnimationFrame(state.raf);
    window.removeEventListener('resize', onResize);

    if (state.scene) {
      state.scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
            else obj.material.dispose?.();
          }
        }
      });
    }

    state.renderer?.dispose?.();
    if (state.containerEl?.firstChild && state.containerEl.firstChild.tagName === 'CANVAS') {
      state.containerEl.removeChild(state.containerEl.firstChild);
    }

    state.renderer = null;
    state.scene = null;
    state.camera = null;
    state.mixer = null;
    state.model = null;
    state.containerEl = null;
    state.isReady = false;
  }

  // Public API
  window.AvatarManager = {
    init,       // AvatarManager.init('#vh-canvas', '/assets/avatars/chris_redfield__re6_bad.glb')
    dispose,
    get ready() { return state.isReady; }
  };
})();
