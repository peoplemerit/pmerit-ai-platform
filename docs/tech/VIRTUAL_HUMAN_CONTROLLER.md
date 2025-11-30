# Virtual Human Controller Documentation

## Overview

The Virtual Human Controller (`/assets/js/virtual-human-controller.js`) is the orchestration layer that integrates the 3D avatar, TTS API, chat interface, and lip-sync system to create a cohesive Virtual Human experience.

## Architecture

```
┌─────────────────────────────────────────┐
│   VirtualHumanController (Main)         │
│  - Lifecycle Management                 │
│  - State Management                     │
│  - Event Coordination                   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
   ┌───▼────┐    ┌────▼─────┐
   │ Avatar │    │   TTS    │
   │Manager │    │   API    │
   └───┬────┘    └────┬─────┘
       │              │
   ┌───▼────┐    ┌────▼─────┐
   │LipSync │    │  Audio   │
   │Visemes │    │ Playback │
   └────────┘    └──────────┘
```

## Core Components

### 1. VirtualHumanController Class

Main orchestration class that manages:
- Avatar lifecycle (init, enable, disable, destroy)
- Event coordination between components
- State tracking and persistence
- UI control management
- Error handling

### 2. Component Integration

#### AvatarManager
- 3D avatar rendering via WebGL
- Animation playback (idle, speaking)
- Visual representation of the virtual human

#### VirtualHumanAPI
- Text-to-speech generation
- Audio playback management
- Avatar preferences storage

#### LipSyncVisemes
- Mouth movement synchronization
- Viseme-based animation
- Real-time lip-sync during speech

## Usage

### Basic Initialization

```javascript
// Auto-initialization (if container exists)
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('virtual-human-container');
  if (container) {
    window.virtualHumanController = new VirtualHumanController({
      autoInit: true,
      defaultEnabled: false
    });
  }
});
```

### Manual Initialization

```javascript
const controller = new VirtualHumanController({
  containerId: 'virtual-human-container',
  autoInit: false,
  defaultEnabled: false,
  avatarScale: 1.0,
  enableIdleAnimation: true,
  enableLipSync: true,
  debugMode: false
});

await controller.init();
```

### Controlling the Virtual Human

```javascript
// Enable/disable
await controller.enable();
controller.disable();

// Toggle
await controller.toggle();

// Speak
await controller.speak('Hello, how can I help you?');

// Change avatar
await controller.changeAvatar('chris_redfield');

// Mute/unmute
controller.toggleMute();

// Get state
const state = controller.getState();
console.log(state);
```

## Event System

### Listening Events

The controller listens for these events:

#### Chat Events
- `chat:message` - User sent a message
- `chat:response` - AI responded with message

#### TTS Events (via API)
- `start` - TTS generation started
- `complete` - TTS generation completed
- `error` - TTS generation failed

#### Lip-Sync Events
- `vh:lipsync` - Start lip-sync animation
- `vh:stop` - Stop all animations

### Dispatching Events

To trigger the controller, dispatch these events:

```javascript
// User sent message
window.dispatchEvent(new CustomEvent('chat:message', {
  detail: { message: 'Hello!' }
}));

// AI responded
window.dispatchEvent(new CustomEvent('chat:response', {
  detail: { response: 'Hi! How can I help?' }
}));
```

## State Management

### State Properties

```javascript
{
  enabled: false,          // Is VH enabled?
  initialized: false,      // Is controller initialized?
  avatarLoaded: false,     // Is avatar model loaded?
  speaking: false,         // Is currently speaking?
  muted: false,           // Is audio muted?
  currentAvatar: null,    // Current avatar object
  currentAnimation: null, // Current animation name
  error: null             // Last error (if any)
}
```

### Persistence

Preferences are saved to `localStorage` under key `pmerit_vh_preferences`:

```javascript
{
  enabled: true,
  muted: false
}
```

## UI Integration

### Required HTML Elements

```html
<!-- Container for avatar -->
<div id="virtual-human-container"></div>

<!-- Optional UI controls -->
<button id="vh-toggle">Show Assistant</button>
<button id="vh-mute">Mute</button>
<select id="vh-avatar-selector">
  <option value="pm_classic">PMERIT Assistant</option>
  <option value="chris_redfield">Chris</option>
</select>
```

### CSS Classes

```css
#virtual-human-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
  display: none;
}

#virtual-human-container.enabled {
  display: block;
}
```

## Error Handling

The controller implements graceful degradation:

### Non-Fatal Errors
- AvatarManager not available → Continues without avatar
- LipSyncVisemes not available → Continues without lip-sync
- Avatar load failure → Shows error, remains functional

### Fatal Errors
- Container element not found → Initialization fails
- VirtualHumanAPI not available → Controller cannot function

### Error Display

Errors are shown via `window.showNotification()` if available:

```javascript
showError(error) {
  console.error('Virtual Human error:', error);
  if (window.showNotification) {
    window.showNotification('Virtual Human Error', error.message, 'error');
  }
}
```

## API Reference

### Constructor

```javascript
new VirtualHumanController(config)
```

**Config Options:**
- `containerId` (string) - ID of container element (default: 'virtual-human-container')
- `autoInit` (boolean) - Auto-initialize on construction (default: true)
- `defaultEnabled` (boolean) - Start enabled (default: false)
- `avatarScale` (number) - Avatar scale factor (default: 1.0)
- `enableIdleAnimation` (boolean) - Enable idle animations (default: true)
- `enableLipSync` (boolean) - Enable lip-sync (default: true)
- `debugMode` (boolean) - Enable debug logging (default: false)

### Methods

#### Lifecycle
- `async init()` - Initialize controller and components
- `async enable()` - Enable and show virtual human
- `disable()` - Disable and hide virtual human
- `async toggle()` - Toggle enabled state
- `destroy()` - Clean up and destroy controller

#### Avatar Management
- `async loadAvatar(avatarId?)` - Load avatar model
- `async changeAvatar(avatarId)` - Change to different avatar

#### Speech
- `async speak(text)` - Speak text with avatar

#### Animation
- `startIdleAnimation()` - Start idle animation
- `stopIdleAnimation()` - Stop idle animation

#### Controls
- `toggleMute()` - Toggle mute state
- `updateToggleButton()` - Update toggle button UI

#### State
- `getState()` - Get current state object
- `savePreference(key, value)` - Save preference
- `loadAllPreferences()` - Load all preferences
- `loadPreferences()` - Load and apply preferences

#### Error Handling
- `showError(error)` - Display error to user

## Testing

A comprehensive test page is available at `test-virtual-human-controller.html`:

### Test Categories
1. **Lifecycle** - Init, enable, disable, toggle, destroy
2. **Avatar Management** - Load, change, list avatars
3. **Speech & Animation** - Speak, idle, stop, mute
4. **Event System** - Chat messages, chat responses, lip-sync
5. **State Management** - Save, load, clear preferences

### Running Tests

1. Open `test-virtual-human-controller.html` in browser
2. Click "Initialize" to create controller
3. Use test buttons to verify functionality
4. Check output log for results
5. Monitor state display for changes

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES6 Features**: Classes, async/await, arrow functions, destructuring
- **APIs Required**: localStorage, CustomEvent, Audio, fetch

## Dependencies

- `virtual-human-api.js` - TTS and avatar API
- `AvatarManager.js` - Avatar rendering
- `LipSyncVisemes.js` - Lip-sync animation
- `WebGLProvider.js` - 3D rendering (via AvatarManager)

## Performance Considerations

- Avatar rendering: 30+ FPS target
- TTS caching: Reduces API calls
- Event-driven: Minimal polling
- Lazy loading: Components load as needed
- Memory management: Proper cleanup in `destroy()`

## Security

- **XSS Protection**: No innerHTML usage in production code
- **Input Validation**: Avatar IDs validated against available avatars
- **localStorage**: Only trusted data stored
- **API Calls**: Uses existing authenticated endpoints
- **CodeQL Scan**: 0 vulnerabilities detected

## Future Enhancements

Potential improvements:
1. Multiple avatar positions
2. Gesture animations
3. Eye tracking/gaze
4. Emotion expressions
5. Custom animation sequences
6. Avatar customization
7. Voice selection per avatar
8. Background/environment options

## Troubleshooting

### Avatar not appearing
- Check container element exists
- Verify AvatarManager loaded
- Check console for errors
- Verify WebGL support in browser

### No speech output
- Check VirtualHumanAPI loaded
- Verify not muted
- Check audio permissions
- Verify TTS API endpoint

### Lip-sync not working
- Check LipSyncVisemes loaded
- Verify viseme data in TTS response
- Check avatar has morph targets

### Events not firing
- Verify event names match exactly
- Check CustomEvent support
- Verify listeners bound correctly

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies loaded
3. Use test page to isolate issues
4. Check GitHub issues for similar problems

## License

Part of PMERIT AI Platform - see main repository for license.
