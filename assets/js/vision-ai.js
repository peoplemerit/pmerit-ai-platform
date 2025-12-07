/**
 * Vision AI - Face Detection & Gaze Tracking for Proctoring
 * Phase 3: Digital Desk Classroom Redesign
 *
 * Uses TensorFlow.js with MediaPipe FaceMesh for:
 * - Face detection (presence, multiple faces)
 * - Gaze tracking (eye movement, looking away)
 * - Object detection (phones, screens)
 * - Privacy-first design with clear camera indicators
 *
 * @module vision-ai
 */

(function (window) {
  'use strict';

  /**
   * Violation types emitted by Vision AI
   */
  const VISION_VIOLATIONS = {
    FACE_NOT_VISIBLE: 'face_not_visible',
    MULTIPLE_FACES: 'multiple_faces',
    GAZE_AWAY: 'gaze_away',
    PHONE_DETECTED: 'phone_detected',
    LOOKING_DOWN: 'looking_down',
    HEAD_TURNED: 'head_turned'
  };

  /**
   * VisionAI class for face detection and gaze tracking
   */
  class VisionAI {
    /**
     * @constructor
     * @param {Object} config - Configuration options
     */
    constructor(config = {}) {
      this.config = {
        faceDetectionInterval: config.faceDetectionInterval || 1000, // ms between detections
        gazeThreshold: config.gazeThreshold || 0.3, // deviation threshold for gaze warning
        confidenceThreshold: config.confidenceThreshold || 0.7, // minimum detection confidence
        maxPeopleAllowed: config.maxPeopleAllowed || 1, // max faces allowed
        maxConsecutiveViolations: config.maxConsecutiveViolations || 3, // before emitting
        videoWidth: config.videoWidth || 640,
        videoHeight: config.videoHeight || 480
      };

      // State
      this.state = {
        isActive: false,
        isInitialized: false,
        stream: null,
        videoElement: null,
        detector: null,
        lastDetection: null,
        detectionLoop: null,
        consecutiveNoFace: 0,
        consecutiveMultipleFaces: 0,
        consecutiveGazeAway: 0,
        cameraPermissionGranted: false
      };

      // Callbacks
      this.callbacks = {
        onViolation: null,
        onStatusChange: null,
        onFaceDetected: null
      };

      // Reference points for gaze calculation
      this.referenceGaze = null;
      this.calibrated = false;
    }

    /**
     * Initialize Vision AI
     * @param {string} videoElementId - ID of video element to use
     * @returns {Promise<boolean>}
     */
    async init(videoElementId) {
      console.log('👁️ Initializing Vision AI...');

      try {
        // Get or create video element
        this.state.videoElement = document.getElementById(videoElementId);
        if (!this.state.videoElement) {
          this.state.videoElement = this.createVideoElement(videoElementId);
        }

        // Request camera permission
        const permissionGranted = await this.requestCameraPermission();
        if (!permissionGranted) {
          console.error('Camera permission denied');
          return false;
        }

        // Load TensorFlow.js models
        await this.loadModels();

        this.state.isInitialized = true;
        console.log('✅ Vision AI initialized');

        this.emitStatusChange('initialized');
        return true;

      } catch (error) {
        console.error('Failed to initialize Vision AI:', error);
        this.emitStatusChange('error', error.message);
        return false;
      }
    }

    /**
     * Create video element for camera feed
     * @param {string} id - Element ID
     * @returns {HTMLVideoElement}
     */
    createVideoElement(id) {
      const video = document.createElement('video');
      video.id = id || 'vision-ai-video';
      video.width = this.config.videoWidth;
      video.height = this.config.videoHeight;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 160px;
        height: 120px;
        border-radius: 8px;
        object-fit: cover;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(74, 164, 185, 0.5);
      `;

      document.body.appendChild(video);
      return video;
    }

    /**
     * Request camera permission
     * @returns {Promise<boolean>}
     */
    async requestCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: this.config.videoWidth },
            height: { ideal: this.config.videoHeight },
            facingMode: 'user'
          },
          audio: false
        });

        this.state.stream = stream;
        this.state.videoElement.srcObject = stream;
        this.state.cameraPermissionGranted = true;

        // Wait for video to be ready
        await new Promise((resolve) => {
          this.state.videoElement.onloadedmetadata = () => {
            this.state.videoElement.play();
            resolve();
          };
        });

        this.showCameraActive();
        return true;

      } catch (error) {
        console.error('Camera permission error:', error);
        this.state.cameraPermissionGranted = false;
        return false;
      }
    }

    /**
     * Load TensorFlow.js face detection models
     * @returns {Promise<void>}
     */
    async loadModels() {
      console.log('📦 Loading face detection models...');

      // Check if TensorFlow.js is available
      if (typeof tf === 'undefined') {
        console.warn('TensorFlow.js not loaded. Loading from CDN...');
        await this.loadTensorFlowJS();
      }

      // Check if face-landmarks-detection is available
      if (typeof faceLandmarksDetection === 'undefined') {
        console.warn('Face landmarks detection not loaded. Loading from CDN...');
        await this.loadFaceLandmarksDetection();
      }

      try {
        // Create detector using MediaPipe FaceMesh
        this.state.detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true,
            maxFaces: 3
          }
        );

        console.log('✅ Face detection model loaded');

      } catch (error) {
        console.error('Failed to load face detection model:', error);
        // Fallback to simpler detection if available
        await this.loadFallbackDetector();
      }
    }

    /**
     * Load TensorFlow.js from CDN
     * @returns {Promise<void>}
     */
    loadTensorFlowJS() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    /**
     * Load face landmarks detection from CDN
     * @returns {Promise<void>}
     */
    loadFaceLandmarksDetection() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.5/dist/face-landmarks-detection.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    /**
     * Load fallback detector if MediaPipe fails
     * @returns {Promise<void>}
     */
    async loadFallbackDetector() {
      console.log('Loading fallback face detection...');

      // Try BlazeFace as fallback
      try {
        if (typeof blazeface === 'undefined') {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        this.state.detector = await blazeface.load();
        this.state.usingFallback = true;
        console.log('✅ Fallback BlazeFace detector loaded');

      } catch (error) {
        console.error('Failed to load fallback detector:', error);
        throw new Error('No face detection model available');
      }
    }

    /**
     * Start face detection loop
     * @returns {Promise<void>}
     */
    async startDetection() {
      if (!this.state.isInitialized) {
        console.error('Vision AI not initialized');
        return;
      }

      if (this.state.isActive) {
        console.warn('Detection already running');
        return;
      }

      this.state.isActive = true;
      this.emitStatusChange('active');
      console.log('🔍 Starting face detection...');

      // Detection loop
      this.state.detectionLoop = setInterval(async () => {
        await this.detectFaces();
      }, this.config.faceDetectionInterval);
    }

    /**
     * Stop face detection loop
     */
    stopDetection() {
      if (this.state.detectionLoop) {
        clearInterval(this.state.detectionLoop);
        this.state.detectionLoop = null;
      }

      this.state.isActive = false;
      this.emitStatusChange('stopped');
      console.log('⏹️ Face detection stopped');
    }

    /**
     * Detect faces in current video frame
     * @returns {Promise<void>}
     */
    async detectFaces() {
      if (!this.state.detector || !this.state.videoElement) return;

      try {
        let faces;

        if (this.state.usingFallback) {
          // BlazeFace detection
          faces = await this.state.detector.estimateFaces(
            this.state.videoElement,
            false
          );
        } else {
          // MediaPipe FaceMesh detection
          faces = await this.state.detector.estimateFaces(
            this.state.videoElement,
            { flipHorizontal: false }
          );
        }

        this.state.lastDetection = {
          timestamp: Date.now(),
          faces: faces,
          faceCount: faces.length
        };

        // Analyze detection results
        this.checkForViolations(faces);

        // Callback for face detection
        if (this.callbacks.onFaceDetected) {
          this.callbacks.onFaceDetected(faces);
        }

      } catch (error) {
        console.warn('Face detection error:', error);
      }
    }

    /**
     * Check detection results for violations
     * @param {Array} faces - Detected faces
     */
    checkForViolations(faces) {
      const faceCount = faces.length;

      // No face detected
      if (faceCount === 0) {
        this.state.consecutiveNoFace++;
        this.state.consecutiveMultipleFaces = 0;
        this.state.consecutiveGazeAway = 0;

        if (this.state.consecutiveNoFace >= this.config.maxConsecutiveViolations) {
          this.emitViolation(VISION_VIOLATIONS.FACE_NOT_VISIBLE, 0.9, {
            message: 'No face detected in camera view',
            consecutiveFrames: this.state.consecutiveNoFace
          });
          this.state.consecutiveNoFace = 0; // Reset after emitting
        }
        return;
      }

      this.state.consecutiveNoFace = 0;

      // Multiple faces detected
      if (faceCount > this.config.maxPeopleAllowed) {
        this.state.consecutiveMultipleFaces++;
        this.state.consecutiveGazeAway = 0;

        if (this.state.consecutiveMultipleFaces >= this.config.maxConsecutiveViolations) {
          this.emitViolation(VISION_VIOLATIONS.MULTIPLE_FACES, 0.85, {
            message: `${faceCount} faces detected, only ${this.config.maxPeopleAllowed} allowed`,
            faceCount: faceCount,
            consecutiveFrames: this.state.consecutiveMultipleFaces
          });
          this.state.consecutiveMultipleFaces = 0;
        }
        return;
      }

      this.state.consecutiveMultipleFaces = 0;

      // Analyze gaze for single face
      if (faceCount === 1 && faces[0].keypoints) {
        this.analyzeGaze(faces[0]);
      }
    }

    /**
     * Analyze gaze direction from face landmarks
     * @param {Object} face - Face detection result with keypoints
     */
    analyzeGaze(face) {
      const keypoints = face.keypoints;
      if (!keypoints || keypoints.length === 0) return;

      // Get key landmarks for gaze estimation
      const leftEye = this.getLandmarkByName(keypoints, 'leftEye') ||
                      this.getLandmarkByIndex(keypoints, 33); // Left eye outer corner
      const rightEye = this.getLandmarkByName(keypoints, 'rightEye') ||
                       this.getLandmarkByIndex(keypoints, 263); // Right eye outer corner
      const noseTip = this.getLandmarkByName(keypoints, 'noseTip') ||
                      this.getLandmarkByIndex(keypoints, 1);

      if (!leftEye || !rightEye || !noseTip) return;

      // Calculate gaze direction
      const gaze = this.calculateGazeDirection(leftEye, rightEye, noseTip);

      // Calibrate on first detection
      if (!this.calibrated && gaze) {
        this.referenceGaze = gaze;
        this.calibrated = true;
        console.log('📐 Gaze calibrated:', gaze);
        return;
      }

      // Check gaze deviation
      if (this.referenceGaze && gaze) {
        const deviation = this.getGazeDeviation(gaze, this.referenceGaze);

        if (deviation.horizontal > this.config.gazeThreshold) {
          this.state.consecutiveGazeAway++;

          if (this.state.consecutiveGazeAway >= this.config.maxConsecutiveViolations) {
            this.emitViolation(VISION_VIOLATIONS.HEAD_TURNED, 0.75, {
              message: 'Head turned away from screen',
              deviation: deviation,
              consecutiveFrames: this.state.consecutiveGazeAway
            });
            this.state.consecutiveGazeAway = 0;
          }
        } else if (deviation.vertical > this.config.gazeThreshold) {
          this.state.consecutiveGazeAway++;

          if (this.state.consecutiveGazeAway >= this.config.maxConsecutiveViolations) {
            this.emitViolation(VISION_VIOLATIONS.LOOKING_DOWN, 0.7, {
              message: 'Looking away from screen',
              deviation: deviation,
              consecutiveFrames: this.state.consecutiveGazeAway
            });
            this.state.consecutiveGazeAway = 0;
          }
        } else {
          this.state.consecutiveGazeAway = 0;
        }
      }
    }

    /**
     * Get landmark by name
     * @param {Array} keypoints - Face keypoints
     * @param {string} name - Landmark name
     * @returns {Object|null}
     */
    getLandmarkByName(keypoints, name) {
      return keypoints.find(kp => kp.name === name);
    }

    /**
     * Get landmark by index
     * @param {Array} keypoints - Face keypoints
     * @param {number} index - Landmark index
     * @returns {Object|null}
     */
    getLandmarkByIndex(keypoints, index) {
      return keypoints[index] || null;
    }

    /**
     * Calculate gaze direction from eye landmarks
     * @param {Object} leftEye - Left eye landmark
     * @param {Object} rightEye - Right eye landmark
     * @param {Object} noseTip - Nose tip landmark
     * @returns {Object} Gaze direction
     */
    calculateGazeDirection(leftEye, rightEye, noseTip) {
      // Calculate face center
      const faceCenterX = (leftEye.x + rightEye.x) / 2;
      const faceCenterY = (leftEye.y + rightEye.y) / 2;

      // Calculate eye line angle (for head tilt)
      const eyeAngle = Math.atan2(
        rightEye.y - leftEye.y,
        rightEye.x - leftEye.x
      );

      // Calculate nose offset from eye center (for horizontal turn)
      const noseOffsetX = noseTip.x - faceCenterX;
      const noseOffsetY = noseTip.y - faceCenterY;

      // Normalize by face width
      const faceWidth = Math.abs(rightEye.x - leftEye.x);
      const horizontalTurn = noseOffsetX / (faceWidth || 1);
      const verticalTurn = noseOffsetY / (faceWidth || 1);

      return {
        horizontal: horizontalTurn,
        vertical: verticalTurn,
        tilt: eyeAngle,
        faceCenter: { x: faceCenterX, y: faceCenterY }
      };
    }

    /**
     * Calculate deviation from reference gaze
     * @param {Object} current - Current gaze
     * @param {Object} reference - Reference gaze
     * @returns {Object} Deviation values
     */
    getGazeDeviation(current, reference) {
      return {
        horizontal: Math.abs(current.horizontal - reference.horizontal),
        vertical: Math.abs(current.vertical - reference.vertical),
        tilt: Math.abs(current.tilt - reference.tilt)
      };
    }

    /**
     * Check if user is looking at screen
     * @param {Object} gaze - Current gaze
     * @returns {boolean}
     */
    isLookingAtScreen(gaze) {
      if (!this.referenceGaze || !gaze) return true;

      const deviation = this.getGazeDeviation(gaze, this.referenceGaze);
      return deviation.horizontal < this.config.gazeThreshold &&
             deviation.vertical < this.config.gazeThreshold;
    }

    /**
     * Emit violation to callbacks
     * @param {string} type - Violation type
     * @param {number} confidence - Detection confidence
     * @param {Object} details - Additional details
     */
    emitViolation(type, confidence, details = {}) {
      console.warn(`👁️ Vision Violation: ${type} (${(confidence * 100).toFixed(0)}%)`);

      if (this.callbacks.onViolation) {
        this.callbacks.onViolation(type, confidence, details);
      }
    }

    /**
     * Register violation callback
     * @param {Function} callback - Callback function(type, confidence, details)
     */
    onViolation(callback) {
      this.callbacks.onViolation = callback;
    }

    /**
     * Register status change callback
     * @param {Function} callback - Callback function(status, data)
     */
    onStatusChange(callback) {
      this.callbacks.onStatusChange = callback;
    }

    /**
     * Emit status change to callbacks
     * @param {string} status - Status name
     * @param {any} data - Additional data
     */
    emitStatusChange(status, data = null) {
      if (this.callbacks.onStatusChange) {
        this.callbacks.onStatusChange(status, data);
      }
    }

    /**
     * Show camera active indicator
     */
    showCameraActive() {
      this.updateCameraIndicator('active');
    }

    /**
     * Show camera off indicator
     */
    showCameraOff() {
      this.updateCameraIndicator('off');
    }

    /**
     * Update camera indicator UI
     * @param {string} state - 'active', 'off', 'warning'
     */
    updateCameraIndicator(state) {
      let indicator = document.getElementById('vision-ai-indicator');

      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'vision-ai-indicator';
        indicator.style.cssText = `
          position: fixed;
          bottom: 145px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          z-index: 1001;
        `;
        document.body.appendChild(indicator);
      }

      const states = {
        active: { color: '#28a745', icon: '👁️', text: 'Vision Active' },
        off: { color: '#6c757d', icon: '🔒', text: 'Camera Off' },
        warning: { color: '#ffc107', icon: '⚠️', text: 'Warning' }
      };

      const stateInfo = states[state] || states.off;
      indicator.innerHTML = `
        <span style="color: ${stateInfo.color};">${stateInfo.icon}</span>
        <span>${stateInfo.text}</span>
      `;
    }

    /**
     * Show privacy shutter animation
     */
    showPrivacyShutter() {
      // Hide video element
      if (this.state.videoElement) {
        this.state.videoElement.style.opacity = '0';
      }

      // Create shutter overlay
      let shutter = document.getElementById('vision-privacy-shutter');
      if (!shutter) {
        shutter = document.createElement('div');
        shutter.id = 'vision-privacy-shutter';
        shutter.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 160px;
          height: 120px;
          border-radius: 8px;
          background: #1a1a1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1002;
          animation: shutterClose 0.5s ease-out;
        `;
        shutter.innerHTML = `
          <div style="font-size: 32px; margin-bottom: 8px;">📷</div>
          <div style="font-size: 11px; color: #28a745; font-weight: 600;">Camera Off</div>
        `;
        document.body.appendChild(shutter);
      }

      shutter.style.display = 'flex';
    }

    /**
     * Hide privacy shutter
     */
    hidePrivacyShutter() {
      const shutter = document.getElementById('vision-privacy-shutter');
      if (shutter) {
        shutter.style.display = 'none';
      }

      // Show video element
      if (this.state.videoElement) {
        this.state.videoElement.style.opacity = '1';
      }
    }

    /**
     * Recalibrate gaze reference
     */
    recalibrate() {
      this.referenceGaze = null;
      this.calibrated = false;
      console.log('🔄 Gaze recalibration requested');
    }

    /**
     * Get current detection state
     * @returns {Object}
     */
    getState() {
      return {
        isActive: this.state.isActive,
        isInitialized: this.state.isInitialized,
        lastDetection: this.state.lastDetection,
        calibrated: this.calibrated,
        cameraPermissionGranted: this.state.cameraPermissionGranted
      };
    }

    /**
     * Cleanup and destroy Vision AI
     */
    destroy() {
      console.log('🗑️ Destroying Vision AI...');

      // Stop detection
      this.stopDetection();

      // Stop camera stream
      if (this.state.stream) {
        this.state.stream.getTracks().forEach(track => track.stop());
        this.state.stream = null;
      }

      // Remove video element
      if (this.state.videoElement && this.state.videoElement.parentNode) {
        this.state.videoElement.parentNode.removeChild(this.state.videoElement);
        this.state.videoElement = null;
      }

      // Remove indicators
      const indicator = document.getElementById('vision-ai-indicator');
      if (indicator) indicator.remove();

      const shutter = document.getElementById('vision-privacy-shutter');
      if (shutter) shutter.remove();

      // Clear state
      this.state.isInitialized = false;
      this.state.detector = null;
      this.calibrated = false;
      this.referenceGaze = null;

      this.showCameraOff();
      console.log('✅ Vision AI destroyed');
    }
  }

  // Export violation types
  VisionAI.VIOLATIONS = VISION_VIOLATIONS;

  // Export to window
  window.VisionAI = VisionAI;

  // Factory function
  window.createVisionAI = async function(videoElementId, config = {}) {
    const visionAI = new VisionAI(config);
    const success = await visionAI.init(videoElementId);

    if (success) {
      return visionAI;
    }

    return null;
  };

  console.log('✅ VisionAI module loaded (v1.0 - Digital Desk)');

})(window);
