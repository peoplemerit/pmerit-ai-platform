/**
 * Mock Three.js for testing purposes
 * This is a minimal implementation for demo purposes only
 */

if (typeof THREE === 'undefined') {
  window.THREE = {
    Scene: class Scene {
      constructor() {
        this.background = null;
        this.children = [];
      }
      add(obj) {
        this.children.push(obj);
      }
      clear() {
        this.children = [];
      }
    },
    PerspectiveCamera: class PerspectiveCamera {
      constructor(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.position = { x: 0, y: 0, z: 0, set: function(x, y, z) { this.x = x; this.y = y; this.z = z; } };
      }
      lookAt(x, y, z) {}
      updateProjectionMatrix() {}
    },
    WebGLRenderer: class WebGLRenderer {
      constructor(config) {
        this.shadowMap = { enabled: false, type: null };
      }
      setPixelRatio(ratio) {}
      setSize(width, height) {}
      render(scene, camera) {}
      dispose() {}
    },
    Color: class Color {
      constructor(hex) {
        this.hex = hex;
      }
    },
    AmbientLight: class AmbientLight {
      constructor(color, intensity) {}
    },
    DirectionalLight: class DirectionalLight {
      constructor(color, intensity) {
        this.position = { set: function() {} };
        this.castShadow = false;
      }
    },
    SphereGeometry: class SphereGeometry {
      constructor() {}
      dispose() {}
    },
    MeshStandardMaterial: class MeshStandardMaterial {
      constructor(props) {}
      dispose() {}
    },
    Mesh: class Mesh {
      constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.position = { x: 0, y: 0, z: 0, set: function(x, y, z) { this.x = x; this.y = y; this.z = z; } };
        this.castShadow = false;
        this.morphTargetInfluences = [];
      }
    },
    AnimationMixer: class AnimationMixer {
      constructor(root) {}
      update(delta) {}
    },
    PCFSoftShadowMap: 1
  };
  console.log('✅ Mock Three.js loaded for testing');
}
