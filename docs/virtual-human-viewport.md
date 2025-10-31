# Virtual Human Fixed Viewport Architecture

## Overview

The Virtual Human (VH) Fixed Viewport Architecture implements a 3-row grid layout in the center panel to ensure the VH viewport remains fixed at the top, never overlays chat, and provides a smooth user experience without layout jumps.

## Architecture Components

### 1. Center Panel Structure

The center panel uses a 3-row CSS grid layout:

```html
<section id="center-panel" class="center-panel">
  <!-- Row 1: Virtual Human Fixed Viewport -->
  <div id="vh-root" class="vh-root is-hidden">...</div>
  
  <!-- Row 2: Chat Stream (Independently Scrollable) -->
  <div id="chat-stream" class="chat-stream">...</div>
  
  <!-- Row 3: Unified Interaction Bar -->
  <div id="interaction-bar" class="interaction-bar">...</div>
</section>
```

### 2. VH Root Container (`vh-root`)

- **Purpose**: Fixed viewport container for Virtual Human canvas and controls
- **Behavior**: 
  - Hidden by default with `is-hidden` class
  - Fixed height (420px) and max-width (680px)
  - Never overlays chat content
  - Positioned at top of center panel when visible
- **Contents**:
  - `vh-canvas`: WebGL canvas for 3D avatar rendering
  - `vh-captions`: Live captions for accessibility
  - `vh-status-strip`: Status indicators (loading, speaking, etc.)

### 3. Chat Stream (`chat-stream`)

- **Purpose**: Independently scrollable chat message container
- **Behavior**:
  - Always visible, even when VH is active
  - Flexibly expands to fill available space
  - Independent scroll (does not affect VH viewport)
  - No layout jumps when VH toggles on/off
- **Contents**: Chat messages with avatars and message bubbles

### 4. Interaction Bar (`interaction-bar`)

- **Purpose**: Unified input area for both chat and VH interaction
- **Behavior**:
  - Fixed at bottom of center panel
  - Contains text input, voice button, and action buttons
  - Works for both chat mode and VH mode
  - Persistent across mode changes

## CSS Grid Layout

### Desktop Layout (≥1024px)

```css
.desktop-layout .center-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 0;
  overflow: hidden;
}

.desktop-layout .vh-root {
  grid-row: 1;
  /* Fixed dimensions, hidden by default */
}

.desktop-layout .chat-stream {
  grid-row: 2;
  overflow-y: auto;
  /* Independently scrollable */
}

.desktop-layout .interaction-bar {
  grid-row: 3;
  /* Fixed at bottom */
}
```

## Key Benefits

### 1. No Layout Jumps
- VH viewport has fixed dimensions
- Chat stream maintains scroll position
- Smooth transitions when toggling VH mode

### 2. Always Visible Chat
- Chat never gets hidden or overlaid by VH
- Users can reference chat while VH is speaking
- Better context preservation

### 3. Unified Interaction
- Single input bar for all interactions
- Consistent UX across modes
- Voice and text input integrated

### 4. Accessibility
- VH container has proper ARIA attributes
- Live regions for captions
- Keyboard navigation support

## State Management

### VH Toggle Behavior

When Virtual Human is enabled:
1. Remove `is-hidden` class from `vh-root`
2. Set display to `block`
3. Initialize AvatarManager if not already initialized
4. Chat stream remains visible and functional

When Virtual Human is disabled:
1. Add `is-hidden` class to `vh-root`
2. Set display to `none`
3. Disable AvatarManager (keep initialized)
4. Chat stream continues to work normally

### JavaScript Integration

```javascript
// Enable Virtual Human
const vhRoot = document.getElementById('vh-root');
if (vhRoot) {
  vhRoot.style.display = 'block';
  vhRoot.classList.remove('is-hidden');
}

// Disable Virtual Human
if (vhRoot) {
  vhRoot.style.display = 'none';
  vhRoot.classList.add('is-hidden');
}

// Chat stream is NEVER hidden
const chatStream = document.getElementById('chat-stream');
// chatStream remains visible at all times
```

## Browser Compatibility

- Modern browsers with CSS Grid support (all major browsers since 2017)
- WebGL required for VH rendering
- Graceful fallback to audio-only mode if WebGL unavailable

## Mobile Considerations

For mobile layouts (<1024px):
- Mobile uses a different layout structure (not affected by this architecture)
- Mobile has separate mobile-specific components
- This architecture applies only to desktop (≥1024px)

## Testing Checklist

- [ ] VH viewport appears at top when enabled
- [ ] Chat stream remains visible when VH is active
- [ ] No layout jumps when toggling VH on/off
- [ ] Chat scroll position preserved during VH toggle
- [ ] Input bar remains functional in both modes
- [ ] WebGL fallback works correctly
- [ ] Accessibility features (ARIA, captions) work
- [ ] No console errors or CSP violations

## File Locations

- **HTML**: `/index.html`, `/portal/classroom.html`
- **CSS**: `/assets/css/avatar.css`, embedded styles in index.html
- **JavaScript**: `/assets/js/main.js`
- **Documentation**: `/docs/virtual-human-viewport.md` (this file)

## Future Enhancements

1. Responsive VH viewport sizing for smaller screens
2. Picture-in-picture mode for VH
3. Split-screen layout options
4. Customizable VH viewport dimensions
5. Animation transitions for VH show/hide

## References

- Issue: "Implement Virtual Human Fixed Viewport Architecture"
- Blueprint: `.copilot/blueprint-index.html`
- Avatar Config: `docs/AVATAR_CONFIG.md`
