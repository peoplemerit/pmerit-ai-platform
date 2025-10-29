# Avatar Configuration Guide

## Overview

This guide explains how to configure and swap avatar models in the PMERIT platform. Avatar configuration is designed to be **config-only**, requiring no code changes to switch between different 3D models.

## Configuration File

Avatar settings are managed in `/assets/js/config.js` via the global `window.PMERIT` namespace.

### Available Configuration Options

```javascript
window.PMERIT = {
  // Base URL for avatar assets (can be R2, CDN, or local path)
  AVATAR_BASE_URL: '/assets/avatars',
  
  // Avatar model filename (must be .glb format)
  AVATAR_MODEL: 'pm_classic.glb',
  
  // Scale multiplier for the avatar (1.0 = original size)
  AVATAR_SCALE: 1.0,
  
  // Camera position relative to avatar
  CAMERA_POS: { x: 0, y: 1.6, z: 2.5 }
};
```

## Swapping Avatar Models

### Method 1: Edit config.js (Recommended for Development)

1. Open `/assets/js/config.js`
2. Locate the avatar configuration section (around line 48)
3. Change the `AVATAR_MODEL` value:

```javascript
// Before
window.PMERIT.AVATAR_MODEL = window.PMERIT.AVATAR_MODEL || 'pm_classic.glb';

// After - Use a different model
window.PMERIT.AVATAR_MODEL = window.PMERIT.AVATAR_MODEL || 'pm_min.glb';
```

4. Save the file and reload the page
5. The new model will be loaded automatically

### Method 2: Environment Variables (Recommended for Production)

For Cloudflare Pages deployments, set environment variables in your Pages project settings:

```bash
AVATAR_BASE_URL=https://avatars.pmerit.com
AVATAR_MODEL=pm_classic.glb
AVATAR_SCALE=1.0
```

The config.js file will read these values if available.

### Method 3: Browser Console Override (Testing Only)

For quick testing without file changes:

```javascript
// Override in browser console before page loads
window.PMERIT = window.PMERIT || {};
window.PMERIT.AVATAR_MODEL = 'pm_test.glb';
```

## Supported Avatar Models

Place GLB model files in `/assets/avatars/` directory. The system expects:

- **Format**: GLB (binary GLTF)
- **Animations**: Optional (idle, speak, gesture tracks)
- **Texture**: Embedded in GLB
- **Optimization**: See compression section below

### Example Models

```
/assets/avatars/
├── pm_classic.glb      # Full-featured avatar (recommended)
├── pm_min.glb          # Compressed/minimal version
├── pm_test.glb         # Test/development model
└── placeholder.glb     # Fallback sphere (always available)
```

## Model Compression & Optimization

To reduce bandwidth and improve load times:

### 1. Use glTF-Transform CLI

```bash
# Install
npm install -g @gltf-transform/cli

# Compress a model
gltf-transform optimize avatar.glb avatar_optimized.glb \
  --compress meshopt \
  --texture-compress webp \
  --simplify 0.95
```

### 2. Reduce Polygon Count

Target specifications:
- **Desktop**: 15k-25k triangles
- **Mobile**: 8k-15k triangles
- **Low-end**: 5k-8k triangles

### 3. Texture Optimization

- Use 1024x1024 or 2048x2048 max
- Compress to WebP or JPEG
- Embed in GLB for fewer HTTP requests

### 4. Animation Baking

- Bake complex animations to keyframes
- Remove unused animation tracks
- Reduce keyframe density

## Configuration Parameters Reference

### AVATAR_BASE_URL

**Type**: String  
**Default**: `/assets/avatars`  
**Description**: Base directory or CDN URL where avatar models are stored

**Examples**:
```javascript
// Local assets
AVATAR_BASE_URL: '/assets/avatars'

// Cloudflare R2
AVATAR_BASE_URL: 'https://avatars.pmerit.com'

// CDN
AVATAR_BASE_URL: 'https://cdn.jsdelivr.net/gh/peoplemerit/avatars@main'
```

### AVATAR_MODEL

**Type**: String  
**Default**: `pm_classic.glb`  
**Description**: Filename of the GLB model to load

**Requirements**:
- Must end in `.glb`
- File must exist at `{AVATAR_BASE_URL}/{AVATAR_MODEL}`
- If file fails to load, fallback orb is displayed

**Examples**:
```javascript
AVATAR_MODEL: 'pm_classic.glb'    // Standard model
AVATAR_MODEL: 'pm_min.glb'        // Compressed model
AVATAR_MODEL: 'custom_avatar.glb' // Custom model
```

### AVATAR_SCALE

**Type**: Number  
**Default**: `1.0`  
**Description**: Scale multiplier for the loaded model

**Range**: `0.1` to `5.0` (recommended)

**Examples**:
```javascript
AVATAR_SCALE: 0.5   // Half size
AVATAR_SCALE: 1.0   // Original size
AVATAR_SCALE: 1.5   // 50% larger
AVATAR_SCALE: 2.0   // Double size
```

### CAMERA_POS

**Type**: Object `{ x, y, z }`  
**Default**: `{ x: 0, y: 1.6, z: 2.5 }`  
**Description**: Camera position in 3D space (Three.js coordinates)

**Units**: Meters (approximate)

**Examples**:
```javascript
// Close-up view
CAMERA_POS: { x: 0, y: 1.6, z: 1.5 }

// Wide view
CAMERA_POS: { x: 0, y: 1.6, z: 3.5 }

// Side angle
CAMERA_POS: { x: 2.0, y: 1.6, z: 2.5 }

// High angle
CAMERA_POS: { x: 0, y: 2.5, z: 2.5 }
```

## Fallback Behavior

The system includes robust fallback mechanisms:

1. **Model Load Failure**: If the specified GLB file cannot be loaded (404, CORS error, parse error), a **fallback orb** is displayed
2. **No GLTFLoader**: If Three.js GLTFLoader is not available, the orb is used
3. **WebGL Unavailable**: System falls back to audio-only mode (no 3D rendering)

### Fallback Orb Characteristics

- **Shape**: Sphere (teal color: `#45a29e`)
- **Animation**: Gentle bobbing idle animation
- **Scale**: Respects `AVATAR_SCALE` config
- **Performance**: Minimal GPU usage
- **Caption**: Remains functional

## Verification Steps

Use this checklist to verify avatar configuration changes:

### 1. Config Swap Test

- [ ] Edit `assets/js/config.js` to set `AVATAR_MODEL=pm_classic.glb`
- [ ] Reload page → Model A appears
- [ ] Change to `AVATAR_MODEL=pm_min.glb`
- [ ] Reload page → Model B appears
- [ ] No code edits required beyond config

### 2. Loader Behavior Test

- [ ] Model URL correctly built: `{AVATAR_BASE_URL}/{AVATAR_MODEL}`
- [ ] `AVATAR_SCALE` visibly affects model size
- [ ] `CAMERA_POS` changes camera viewpoint
- [ ] On bad path (404), fallback orb shows
- [ ] Captions remain functional during fallback

### 3. Console & CSP Test

- [ ] Open DevTools Console
- [ ] No CSP violations reported
- [ ] No 404 errors for avatar models
- [ ] No uncaught JavaScript errors
- [ ] Warnings are acceptable (autoplay, etc.)

### 4. Parity Test

- [ ] Front page (`/index.html`) VH toggle loads configured model
- [ ] Classroom (`/portal/classroom.html`) VH toggle loads same model
- [ ] Both surfaces respect same config values

### 5. Accessibility Test

- [ ] `prefers-reduced-motion` media query triggers audio-only mode
- [ ] Focus rings visible on VH toggle buttons
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces avatar state changes

### 6. Performance Test

- [ ] No layout shift when avatar loads
- [ ] Canvas resizes without overflow
- [ ] FPS stays above 24 on target devices
- [ ] Memory usage remains stable

## Troubleshooting

### Issue: Avatar doesn't appear

**Symptoms**: Orb appears instead of expected model

**Solutions**:
1. Check browser console for 404 errors
2. Verify file path: `{AVATAR_BASE_URL}/{AVATAR_MODEL}`
3. Ensure model file exists and is accessible
4. Check CORS headers if using CDN
5. Verify GLB file is valid (test in glTF Viewer)

### Issue: Model is too large/small

**Symptoms**: Avatar clips camera or is barely visible

**Solutions**:
1. Adjust `AVATAR_SCALE` value (try 0.5 or 2.0)
2. Adjust `CAMERA_POS.z` to move camera closer/farther
3. Check model's original scale in 3D software

### Issue: Camera angle is wrong

**Symptoms**: Avatar is off-center or clipped

**Solutions**:
1. Adjust `CAMERA_POS` coordinates
2. Ensure model is centered at origin (0,0,0) in GLB file
3. Try different camera heights (adjust `y` value)

### Issue: Avatar loads slowly

**Symptoms**: Long wait before avatar appears

**Solutions**:
1. Compress model using glTF-Transform
2. Reduce polygon count in 3D software
3. Optimize textures (smaller resolution, better compression)
4. Use CDN with `AVATAR_BASE_URL`
5. Consider progressive loading techniques

### Issue: CSP violations

**Symptoms**: Console errors about Content Security Policy

**Solutions**:
1. Ensure all resources loaded from allowed domains
2. Check meta CSP tags in HTML
3. Verify `connect-src` includes avatar CDN
4. Use `self` or specific domains, not `*`

## Integration Examples

### Front Page Integration

File: `/index.html`

```html
<!-- Load config first -->
<script src="assets/js/config.js"></script>

<!-- Load Three.js and GLTFLoader -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>

<!-- Load avatar modules -->
<script src="assets/js/avatar/WebGLProvider.js"></script>
<script src="assets/js/avatar/AvatarManager.js"></script>

<!-- VH Toggle Button -->
<button id="vh-toggle" aria-label="Toggle Virtual Human">
  <i class="fas fa-robot"></i>
</button>

<!-- Canvas Container -->
<div id="vh-canvas-root" style="display: none;">
  <canvas id="vh-canvas"></canvas>
  <div id="vh-captions" aria-live="polite"></div>
</div>
```

### Classroom Integration

File: `/portal/classroom.html`

Same script loading order, identical configuration usage.

## Performance Monitoring

Track these metrics:

- **Load Time**: Time from config read to model displayed
- **FPS**: Frames per second during idle and speaking
- **Memory**: WebGL context memory usage
- **Network**: Model file size and transfer time

Use browser DevTools:
- Performance tab: Record avatar load
- Network tab: Check model file size
- Memory tab: Look for leaks during long sessions

## Accessibility Considerations

### Reduced Motion Support

```javascript
// Detect user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Use audio-only mode (no 3D avatar)
  avatarManager.setEnabled(false);
}
```

### Focus Management

Ensure VH toggle button has:
- Visible focus ring (`:focus-visible`)
- ARIA labels
- Keyboard support (Enter/Space)

### Screen Reader Support

Avatar state changes should announce:
```html
<div role="status" aria-live="polite" aria-atomic="true">
  Virtual Human avatar is now active
</div>
```

## Security Best Practices

1. **CORS**: Restrict avatar CDN to specific origins
2. **CSP**: Use `connect-src` whitelist for `AVATAR_BASE_URL`
3. **File Validation**: Validate GLB format server-side
4. **Size Limits**: Enforce max file size (e.g., 5MB)
5. **Rate Limiting**: Prevent excessive model downloads

## Advanced Topics

### Custom Animations

If your GLB includes animation tracks:

```javascript
// Access animations in WebGLProvider
const idleClip = gltf.animations.find(a => a.name === 'Idle');
const speakClip = gltf.animations.find(a => a.name === 'Speak');

const idleAction = mixer.clipAction(idleClip);
idleAction.play();
```

### Dynamic Model Switching

Switch models without page reload:

```javascript
// Update config
window.PMERIT.AVATAR_MODEL = 'new_model.glb';

// Dispose and reinitialize WebGLProvider
webglProvider.dispose();
await webglProvider.init();
```

### Multi-Environment Config

```javascript
// Detect environment
const env = window.CONFIG.ENV; // 'development' | 'staging' | 'production'

// Environment-specific models
const models = {
  development: 'pm_dev.glb',
  staging: 'pm_staging.glb',
  production: 'pm_classic.glb'
};

window.PMERIT.AVATAR_MODEL = models[env];
```

## Related Documentation

- [Phase 3.3-A README](./PHASE_3_3_A_README.md) - Virtual Human implementation
- [ACCESSIBILITY.md](../ACCESSIBILITY.md) - Accessibility guidelines
- [Three.js Docs](https://threejs.org/docs/) - Three.js reference
- [glTF 2.0 Spec](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) - Model format

## Support

For configuration issues:
- GitHub Issues: https://github.com/peoplemerit/pmerit-ai-platform/issues
- Email: support@pmerit.com
- Slack: #avatar-support

---

**Last Updated**: October 28, 2025  
**Phase**: 5  
**Status**: Active
