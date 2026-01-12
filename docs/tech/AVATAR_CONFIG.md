# Avatar Configuration Guide

This guide explains how to configure and manage 3D avatar models for the PMERIT Virtual Human feature.

## Overview

The Virtual Human feature uses WebGL (Three.js) to render 3D avatar models that can speak, display captions, and provide an engaging learning experience. The avatar system is fully configurable through the `PMERIT` global configuration object.

## Configuration Keys

All avatar configuration is set in `assets/js/config.js` and can be overridden via environment variables or runtime settings.

### PMERIT.AVATAR_BASE_URL

**Type:** `string`
**Default:** `/assets/models/avatars/`
**Description:** Base URL for avatar assets. Must end with a trailing slash.

```javascript
window.PMERIT.AVATAR_BASE_URL = '/assets/models/avatars/';
// or
window.PMERIT.AVATAR_BASE_URL = 'https://cdn.example.com/models/';
```

### PMERIT.AVATAR_MODEL

**Type:** `string`
**Default:** `pmerit-tutor-no-morph.glb`
**Description:** Filename of the GLB model to load. Should exist in AVATAR_BASE_URL.

**Available Models:**
- `pmerit-tutor-no-morph.glb` (773KB) - Ready Player Me avatar with jaw bone animation (recommended)
- `pmerit-tutor.glb` - Original with morph targets (may cause Three.js errors)
- `pmerit-tutor-arkit.glb` - ARKit morph targets variant
- `humano_professional.glb` - Alternative professional avatar

```javascript
window.PMERIT.AVATAR_MODEL = 'pmerit-tutor-no-morph.glb';
// or switch to an alternative
window.PMERIT.AVATAR_MODEL = 'humano_professional.glb';
```

### PMERIT.AVATAR_SCALE

**Type:** `number`  
**Default:** `1.0`  
**Description:** Scale multiplier for the avatar model (1.0 = 100% original size).

```javascript
window.PMERIT.AVATAR_SCALE = 1.0;  // Original size
window.PMERIT.AVATAR_SCALE = 1.2;  // 120% larger
window.PMERIT.AVATAR_SCALE = 0.8;  // 80% smaller
```

### PMERIT.CAMERA_POS

**Type:** `array` of three numbers `[x, y, z]`  
**Default:** `[0, 1.4, 2.2]`  
**Description:** Camera position in 3D world space (meters).

```javascript
window.PMERIT.CAMERA_POS = [0, 1.4, 2.2];  // Default: centered, eye-level, close
window.PMERIT.CAMERA_POS = [0, 1.6, 3.0];  // Further back, higher angle
```

**Tips:**
- X: Left (-) to Right (+)
- Y: Down (-) to Up (+) - typically 1.4-1.6 for head/shoulder framing
- Z: Distance from avatar - typically 2.0-3.0 for portrait view

### PMERIT.LIGHT_PRESET

**Type:** `string`  
**Default:** `hemi-dir-soft`  
**Description:** Lighting configuration preset.

**Available Presets:**

1. **`hemi-dir-soft`** (default)
   - Ambient + directional + soft fill light
   - Balanced, professional look
   - Best for most avatars

2. **`hemi-dir-hard`**
   - Higher contrast lighting
   - Dramatic shadows
   - Good for stylized avatars

3. **`three-point`**
   - Traditional three-point lighting
   - Key light, fill light, back light
   - Professional studio look

```javascript
window.PMERIT.LIGHT_PRESET = 'hemi-dir-soft';  // Default
window.PMERIT.LIGHT_PRESET = 'three-point';    // Studio lighting
```

## How to Swap Avatars

### Method 1: Update config.js (permanent)

Edit `assets/js/config.js`:

```javascript
window.PMERIT.AVATAR_MODEL = 'new_avatar.glb';
window.PMERIT.AVATAR_SCALE = 1.2;
```

**Pros:** Changes persist across deployments  
**Cons:** Requires code change and redeployment

### Method 2: Environment Variables (recommended for production)

Create a `.env` file (copy from `.env.example`):

```bash
AVATAR_MODEL=new_avatar.glb
AVATAR_SCALE=1.2
CAMERA_POS=0,1.5,2.5
```

Then inject these at build time or via Cloudflare Pages environment variables.

**Pros:** No code changes, environment-specific settings  
**Cons:** Requires build/deployment pipeline integration

### Method 3: Runtime Override (testing)

Override in browser console or before initializing AvatarManager:

```javascript
window.PMERIT.AVATAR_MODEL = 'test_avatar.glb';
window.PMERIT.AVATAR_SCALE = 1.5;
```

**Pros:** Instant testing without deployment  
**Cons:** Not persistent, only for debugging

## Adding New Avatar Models

### 1. Prepare Your Model

**Requirements:**
- Format: GLB (binary glTF)
- Size: ≤ 5 MB (recommended), max 10 MB
- Polygon count: ≤ 50k triangles
- Textures: Embedded, max 2048x2048px each
- Animations: Optional "idle" and "speaking" clips

**Compression:**

Use [glTF-Transform](https://gltf-transform.donmccurdy.com/) or Blender:

```bash
# Install glTF-Transform
npm install -g @gltf-transform/cli

# Compress with Draco
gltf-transform draco input.glb output.glb --compressionLevel 10
```

Or use the online tool: https://gltf.report/

### 2. Add Model to Repository

1. Place your `.glb` file in `assets/avatars/`
2. Update `assets/avatars/README.md` with license info
3. Test locally (see below)

### 3. Update Configuration

Edit `assets/js/config.js`:

```javascript
window.PMERIT.AVATAR_MODEL = 'your_model.glb';
window.PMERIT.AVATAR_SCALE = 1.0; // Adjust as needed
```

### 4. Test and Verify

See "Testing Locally" section below.

## Fallback Behavior

If a model fails to load (404, timeout, corrupt file), the system will:

1. Log a warning to console
2. Display an animated sphere placeholder (orb)
3. Continue with audio and captions working normally

**No hard failures** - the avatar system degrades gracefully.

## Accessibility: Reduced Motion

The avatar system respects the `prefers-reduced-motion` CSS media query.

When a user enables reduced motion in their OS/browser:
- Avatar animations are paused
- Audio and captions continue to work
- 3D model remains visible but static

**Test reduced motion:**

In DevTools (Chrome/Edge):
1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

## Content Security Policy (CSP)

If loading avatars from external CDNs, update your CSP headers:

```http
Content-Security-Policy: 
  default-src 'self';
  img-src 'self' https://cdn.example.com;
  media-src 'self' https://cdn.example.com;
  connect-src 'self' https://cdn.example.com;
```

For Cloudflare Pages, edit `_headers` file:

```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' https://cdn.example.com; connect-src 'self' https://cdn.example.com
```

Or set in Cloudflare Workers (`functions/_middleware.js`).

## Testing Locally

### Start Local Server

```bash
cd pmerit-ai-platform
python3 -m http.server 8080
```

### Open in Browser

Navigate to: `http://localhost:8080`

### Check Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - `🎨 Initializing WebGLProvider...`
   - `📦 Attempting to load avatar from: ...`
   - `✅ Avatar model loaded successfully` (or warning if using placeholder)

### Verify Rendering

1. Click "Enable Virtual Human" toggle (front page or classroom)
2. Avatar should appear in canvas area
3. Check for:
   - No console errors
   - Model visible and properly lit
   - Idle animation playing (if model includes it)
   - Canvas responsive to window resize

### Test Different Configs

In browser console:

```javascript
// Change model
window.PMERIT.AVATAR_MODEL = 'different_model.glb';
// Reload page to apply
location.reload();

// Or change scale dynamically (if already loaded)
window.avatarManager.state.provider.state.model.scale.setScalar(1.5);
```

## Deployment on Cloudflare Pages

### Preview Deployments

Every branch push creates a preview:

```
https://<branch-name>.<project>.pages.dev/
```

Avatar assets are served from:

```
https://<branch-name>.<project>.pages.dev/assets/avatars/pm_classic.glb
```

### Production Deployment

Production site (main branch):

```
https://pmerit.com/
```

Avatar assets:

```
https://pmerit.com/assets/avatars/pm_classic.glb
```

### Verify on Pages

1. Push changes to branch
2. Wait for Cloudflare Pages build
3. Open preview URL
4. Test avatar loading in Console
5. Verify no 404s in Network tab

## Troubleshooting

### Model Not Loading

**Symptoms:** Orb placeholder appears instead of model

**Check:**
1. Model file exists: `https://your-site.com/assets/avatars/pm_classic.glb`
2. Console shows 404 or loading error
3. File size < 10 MB
4. File is valid GLB format (test at https://gltf.report/)

**Fix:**
- Verify filename matches config exactly (case-sensitive)
- Check file uploaded to correct directory
- Test file locally first

### Model Too Dark/Light

**Symptoms:** Avatar is hard to see

**Fix:**
- Try different `LIGHT_PRESET` values
- Adjust material properties in 3D software before export
- Check model doesn't have conflicting embedded lights

### Model Wrong Size/Position

**Symptoms:** Avatar too big, too small, or cut off

**Fix:**
- Adjust `AVATAR_SCALE`: Try 0.5, 0.8, 1.2, 1.5
- Adjust `CAMERA_POS`: Move further (increase Z) or change height (adjust Y)
- In 3D software, ensure model origin is at character's feet

### Performance Issues

**Symptoms:** Low FPS, choppy animation

**Fix:**
1. Reduce polygon count (target 20k-30k)
2. Compress model with Draco
3. Reduce texture sizes (1024x1024 or smaller)
4. Remove unnecessary animations from GLB
5. Lower `targetFPS` in config (default: 30)

### CSP Errors

**Symptoms:** Console shows CSP violation

**Fix:**
- Update CSP headers to allow avatar CDN domain
- Check `img-src`, `connect-src`, `media-src` directives

## Advanced: Custom Animations

If your GLB model includes animations, they are automatically detected:

- Animation names containing "idle" → play as idle loop
- Animation names containing "speak" → play when avatar speaks

**Example animation names:**
- `idle`, `Idle`, `idle_loop`
- `speak`, `speaking`, `talk`

Make sure animations are baked into the GLB export.

## Support

For issues or questions:
- Check console logs for specific errors
- Review this guide's troubleshooting section
- Verify model meets requirements
- Test with default placeholder first

## Quick Reference

```javascript
// Minimal config (defaults)
window.PMERIT.AVATAR_BASE_URL = '/assets/models/avatars/';
window.PMERIT.AVATAR_MODEL = 'pmerit-tutor-no-morph.glb';
window.PMERIT.AVATAR_SCALE = 1.0;
window.PMERIT.CAMERA_POS = [0, 1.4, 2.2];
window.PMERIT.LIGHT_PRESET = 'hemi-dir-soft';

// Example: External CDN
window.PMERIT.AVATAR_BASE_URL = 'https://cdn.pmerit.com/avatars/v1/';
window.PMERIT.AVATAR_MODEL = 'pmerit-tutor-no-morph.glb';

// Example: Closer camera, larger avatar
window.PMERIT.CAMERA_POS = [0, 1.5, 1.8];
window.PMERIT.AVATAR_SCALE = 1.3;
```

---

**Last Updated:** Session 12 (January 2026) - Fixed CF-006 path mismatch
