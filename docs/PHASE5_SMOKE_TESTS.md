# Phase 5 Smoke Test Checklist

This checklist validates that the avatar configuration and assets work correctly across the PMERIT platform.

## Pre-Testing Setup

- [ ] Repository cloned and up to date
- [ ] Local server running: `python3 -m http.server 8080`
- [ ] Browser DevTools open (F12) with Console visible
- [ ] Test in Chrome/Edge (Chromium) for best WebGL support
- [ ] Network panel open to monitor asset loading

## Configuration Tests

### Config.js Loading
- [ ] Navigate to `http://localhost:8080`
- [ ] Check Console: `🔧 PMERIT Config loaded:` appears
- [ ] Verify `window.PMERIT` object exists in Console:
  ```javascript
  window.PMERIT
  // Should show: AVATAR_BASE_URL, AVATAR_MODEL, AVATAR_SCALE, CAMERA_POS, LIGHT_PRESET
  ```
- [ ] Check defaults loaded correctly:
  ```javascript
  console.log(window.PMERIT.AVATAR_MODEL); // "pm_classic.glb"
  console.log(window.PMERIT.AVATAR_SCALE); // 1.0
  console.log(window.PMERIT.CAMERA_POS);   // [0, 1.4, 2.2]
  ```

### Environment Variables
- [ ] `.env.example` file exists in project root
- [ ] Contains all avatar config keys with descriptions
- [ ] Values match defaults in `config.js`

## Front Page (index.html) Tests

### Basic Loading
- [ ] Navigate to `http://localhost:8080/index.html`
- [ ] Page loads without errors
- [ ] No 404s in Network tab
- [ ] No CSP violations in Console

### Virtual Human Toggle (Off State)
- [ ] VH canvas area is hidden by default
- [ ] Toggle shows "Enable Virtual Human" or similar

### Virtual Human Toggle (On State)
- [ ] Click "Enable Virtual Human" toggle
- [ ] Check Console for initialization:
  - [ ] `🎭 Initializing AvatarManager...`
  - [ ] `🎨 Initializing WebGLProvider...`
  - [ ] `📦 Attempting to load avatar from: /assets/avatars/pm_classic.glb`
  - [ ] Either `✅ Avatar model loaded` or `⚠️ ... using placeholder`
  - [ ] `✅ WebGLProvider initialized`
  - [ ] `✅ AvatarManager initialized`
- [ ] Canvas element (`#vh-canvas`) becomes visible
- [ ] Avatar renders (sphere placeholder or model if added)
- [ ] No console errors

### Avatar Rendering
- [ ] Sphere/model is visible and properly lit
- [ ] Idle animation plays (gentle bobbing for sphere)
- [ ] Model not too dark or too bright
- [ ] Model not cut off by canvas bounds
- [ ] Background color correct (#1f2833 dark theme)

### Responsiveness
- [ ] Resize browser window smaller
- [ ] Canvas resizes appropriately
- [ ] Avatar remains visible and in frame
- [ ] Resize browser window larger
- [ ] Canvas fills available space correctly
- [ ] No overflow or layout breaks

### Configuration Override Test
- [ ] In Console, run:
  ```javascript
  window.PMERIT.AVATAR_SCALE = 1.5;
  ```
- [ ] Reload page (F5)
- [ ] Check sphere/model is larger (150% scale)
- [ ] Reset and reload to restore defaults

## Classroom (portal/classroom.html) Tests

### Basic Loading
- [ ] Navigate to `http://localhost:8080/portal/classroom.html`
- [ ] Sign in if auth required (mock auth: any email + 6+ char password)
- [ ] Page loads without errors
- [ ] No 404s in Network tab
- [ ] No CSP violations in Console

### Virtual Human Toggle (Off State)
- [ ] VH area is in audio-only mode or hidden
- [ ] Toggle shows VH is disabled

### Virtual Human Toggle (On State)
- [ ] Click VH toggle to enable
- [ ] Check Console for initialization (same as front page)
- [ ] Canvas appears in classroom layout
- [ ] Avatar renders correctly
- [ ] Idle animation plays

### Layout Integration
- [ ] Avatar canvas fits in classroom layout (doesn't break grid)
- [ ] Captions area visible below canvas
- [ ] Status strip shows loading states appropriately
- [ ] VH canvas doesn't overlap chat or other elements

### Consistency Check
- [ ] Both front page and classroom use same avatar model
- [ ] Both use same scale, camera, and lighting settings
- [ ] Visual appearance consistent across pages

## Fallback & Error Handling

### Missing Model File
- [ ] In Console, set non-existent model:
  ```javascript
  window.PMERIT.AVATAR_MODEL = 'nonexistent.glb';
  ```
- [ ] Reload page
- [ ] Check Console shows:
  - [ ] `📦 Attempting to load avatar from: .../nonexistent.glb`
  - [ ] `⚠️ Failed to load avatar model, using placeholder`
  - [ ] `✅ Placeholder avatar created`
- [ ] Sphere placeholder renders successfully
- [ ] No hard errors, system degrades gracefully
- [ ] Reset to default model and reload

### Network Error Simulation
- [ ] In DevTools, go to Network tab
- [ ] Enable "Offline" mode
- [ ] Reload page
- [ ] VH fails to initialize but page remains functional
- [ ] Disable "Offline" mode
- [ ] Reload to restore

## Accessibility: Reduced Motion

### Enable Reduced Motion (Chrome/Edge)
- [ ] Open DevTools (F12)
- [ ] Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- [ ] Type "reduced motion"
- [ ] Select "Emulate CSS prefers-reduced-motion: reduce"
- [ ] Enable VH toggle
- [ ] Check Console: `ℹ️ Reduced motion mode detected`
- [ ] Avatar renders but animations are paused
- [ ] Model is static (no bobbing or movement)
- [ ] Audio/captions still work (test if available)

### Disable Reduced Motion
- [ ] Repeat above steps, select "No emulation"
- [ ] Reload page
- [ ] Enable VH toggle
- [ ] Animations play normally

## Performance Tests

### Initial Load
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Navigate to `http://localhost:8080`
- [ ] Open Network tab, check "Disable cache"
- [ ] Reload page
- [ ] Check total load time < 3 seconds
- [ ] Check avatar assets load in < 1 second (placeholder)

### Frame Rate
- [ ] Enable VH
- [ ] Open Performance monitor (Chrome: Ctrl+Shift+P → "Show Performance monitor")
- [ ] Check FPS stays close to 30 (target) or 60
- [ ] No frame drops during idle animation

### Tab Visibility
- [ ] Enable VH with animation playing
- [ ] Switch to another browser tab
- [ ] Wait 5 seconds
- [ ] Switch back to PMERIT tab
- [ ] Check Console: rendering auto-paused and resumed
- [ ] No errors or crashes

## CSP & Security

### Console Security Warnings
- [ ] Check Console for any CSP violation warnings
- [ ] No "Refused to load..." errors
- [ ] No "Refused to connect..." errors
- [ ] No mixed content warnings (HTTP in HTTPS)

### Asset URLs
- [ ] Check Network tab for avatar asset request
- [ ] URL should be: `http://localhost:8080/assets/avatars/pm_classic.glb`
- [ ] Status: 404 (expected, no file yet) or 200 (if file added)
- [ ] No redirects or unexpected domains

## Documentation Tests

### README Files
- [ ] `/assets/avatars/README.md` exists
- [ ] Contains model requirements, size limits, compression tips
- [ ] Explains how to add new models

### AVATAR_CONFIG.md
- [ ] `/docs/AVATAR_CONFIG.md` exists
- [ ] Documents all config keys with examples
- [ ] Includes "How to Swap Avatars" section
- [ ] Has troubleshooting guide

### CSP_AVATAR_ASSETS.md
- [ ] `/docs/CSP_AVATAR_ASSETS.md` exists
- [ ] Documents required CSP directives
- [ ] Includes examples for self-hosted and CDN assets

### .env.example
- [ ] `.env.example` exists in project root
- [ ] Contains avatar config keys
- [ ] Has comments explaining each key

## Cleanup & Reset

- [ ] Restore any Console overrides
- [ ] Disable reduced motion emulation
- [ ] Clear browser cache
- [ ] Close DevTools
- [ ] Verify page works normally after cleanup

## Pass/Fail Criteria

**PASS:** All critical items checked, no blocking errors  
**FAIL:** Console errors, broken layout, or crashes

**Critical Items:**
- Config loads and has correct defaults
- VH toggle works on both pages
- Avatar renders (placeholder or model)
- No console errors during initialization
- Graceful fallback when model missing
- Reduced motion respected

**Nice-to-Have:**
- Smooth 30 FPS animation
- Fast load times
- Clean CSP (no violations)

## Additional Notes

_Add any observations, issues, or environment-specific notes here:_

---

**Tester:**  
**Date:**  
**Environment:** Local / Preview / Production  
**Browser:** Chrome / Firefox / Safari / Edge  
**Result:** ✅ PASS / ❌ FAIL  

---

**Last Updated:** Phase 5 Implementation (October 2025)
