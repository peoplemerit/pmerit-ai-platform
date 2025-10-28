# Avatar Models Directory

This directory contains 3D avatar models (.glb files) for the Virtual Human feature.

## Phase 5: Avatar Configuration

### Current Models
- `pm_classic.glb` - Placeholder for the default PMERIT avatar (to be added)

### Model Requirements
- **Format**: GLB (GL Transmission Format - Binary)
- **Recommended Size**: 3-5 MB (compressed with Draco/meshopt)
- **Maximum Size**: 10 MB for optimal loading performance
- **Polygon Count**: ≤ 50k triangles for mobile compatibility
- **Textures**: Embedded in GLB, max 2048x2048px per texture
- **Animations**: Include "idle" and "speaking" animations if available

### Compression Tools
- **Draco Compression**: Use glTF-Transform or Blender export with Draco
- **Meshopt**: Consider meshopt compression for additional size reduction
- **Online Tools**: https://gltf.report/ for validation and optimization

### Adding New Models

1. Place your `.glb` file in this directory
2. Update `AVATAR_MODEL` in `assets/js/config.js` or set via environment:
   ```js
   window.PMERIT.AVATAR_MODEL = 'your_model.glb';
   ```
3. Adjust scale if needed:
   ```js
   window.PMERIT.AVATAR_SCALE = 1.2; // 120% of original size
   ```

### License & Attribution

Any models placed here must comply with appropriate licensing:
- Commercial use permitted
- Proper attribution included in model metadata
- Source and license documented below

**Current Models:**
- `pm_classic.glb` - Placeholder (to be added with license info)

### Fallback Behavior

If a model fails to load:
- WebGLProvider will display an animated sphere placeholder
- Audio and captions continue to work (audio-only mode)
- Console warning logged with error details

### Testing Models Locally

1. Start local server: `python3 -m http.server 8080`
2. Navigate to `http://localhost:8080`
3. Open browser DevTools (F12)
4. Check Console for loading status
5. Verify model appears and animates correctly

For production deployment on Cloudflare Pages, models are served from:
- Preview: `https://<branch>.<project>.pages.dev/assets/avatars/`
- Production: `https://pmerit.com/assets/avatars/`
