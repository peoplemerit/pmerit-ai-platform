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
    PCFSoftShadowMap: 1,
    
    // GLTFLoader for loading .glb models
    GLTFLoader: class GLTFLoader {
      load(url, onLoad, onProgress, onError) {
        // Simulate loading with fetch
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
          })
          .then(buffer => {
            console.log(`✅ Loaded GLB file: ${url} (${buffer.byteLength} bytes)`);
            
            // Create a simple mock GLTF structure
            const gltf = {
              scene: new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0x45a29e })
              ),
              animations: []
            };
            
            // Add properties to scene object
            gltf.scene.traverse = function(callback) {
              callback(this);
            };
            gltf.scene.isMesh = true;
            gltf.scene.castShadow = true;
            gltf.scene.receiveShadow = true;
            gltf.scene.scale = {
              setScalar: function(s) {
                this.x = s;
                this.y = s;
                this.z = s;
              },
              x: 1,
              y: 1,
              z: 1
            };
            
            // Report progress
            if (onProgress) {
              onProgress({ loaded: buffer.byteLength, total: buffer.byteLength });
            }
            
            // Call success callback
            if (onLoad) {
              onLoad(gltf);
            }
          })
          .catch(error => {
            console.error('❌ GLTFLoader error:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    },
    
    Box3: class Box3 {
      setFromObject(obj) {
        this.min = { x: -0.5, y: 0, z: -0.5 };
        this.max = { x: 0.5, y: 2, z: 0.5 };
        return this;
      }
      getCenter(target) {
        target.x = 0;
        target.y = 1;
        target.z = 0;
        return target;
      }
    },
    
    Vector3: class Vector3 {
      constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }
    }
  };
  console.log('✅ Mock Three.js loaded for testing');
}
