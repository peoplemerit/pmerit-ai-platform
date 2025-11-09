# Virtual Human API Module

## Overview

The Virtual Human API (`virtual-human-api.js`) provides a clean, event-driven interface for text-to-speech, audio playback, and avatar management. It abstracts the complexity of TTS API calls and provides caching, queuing, and error handling out of the box.

## Installation

Include the script in your HTML:

```html
<script src="/assets/js/config.js"></script>
<script src="/assets/js/virtual-human-api.js"></script>
```

The module automatically creates a default instance at `window.virtualHumanAPI`.

## Quick Start

```javascript
// Simple text-to-speech
await window.virtualHumanAPI.speakAndPlay('Hello, world!');

// With custom voice
await window.virtualHumanAPI.speakAndPlay('Hello, world!', { voice: 'nova' });

// Separate speak and play
const audioData = await window.virtualHumanAPI.speak('Hello, world!');
await window.virtualHumanAPI.play(audioData);
```

## API Reference

### Constructor

```javascript
const api = new VirtualHumanAPI(config);
```

**Config options:**
- `apiBase` (string) - Base URL for API calls (default: 'https://pmerit-api.peoplemerit.workers.dev')
- `ttsEndpoint` (string) - TTS endpoint path (default: '/api/v1/tts/speak')
- `defaultVoice` (string) - Default voice to use (default: 'alloy')
- `cacheEnabled` (boolean) - Enable response caching (default: true)
- `maxCacheSize` (number) - Maximum cache entries (default: 50)
- `retryAttempts` (number) - Number of retry attempts (default: 3)
- `retryDelay` (number) - Base retry delay in ms (default: 1000)

### Core Methods

#### speak(text, options)

Generate speech from text.

```javascript
const audioData = await api.speak('Hello, world!', {
  voice: 'alloy' // Optional voice name
});

// Returns: {
//   audioUrl: string,
//   audioData: string, // base64
//   visemes: Array,
//   duration: number,
//   text: string,
//   voice: string
// }
```

#### play(audioData)

Play audio with automatic queue management.

```javascript
await api.play(audioData);
```

If another audio is playing, this will be queued automatically.

#### speakAndPlay(text, options)

Convenience method that combines speak() and play().

```javascript
await api.speakAndPlay('Hello, world!', { voice: 'nova' });
```

#### stop()

Stop current playback and clear the queue.

```javascript
api.stop();
```

### Avatar Management

#### getAvatars()

Get list of available avatars.

```javascript
const avatars = await api.getAvatars();
// Returns: Array of avatar objects with id, name, model_url, thumbnail, description
```

#### setPreferredAvatar(avatarId)

Save avatar preference (localStorage + backend if authenticated).

```javascript
await api.setPreferredAvatar('pm_classic');
```

#### getPreferredAvatar()

Get current preferred avatar ID.

```javascript
const avatarId = api.getPreferredAvatar();
```

### Voice Selection

#### getVoices()

Get list of available TTS voices.

```javascript
const voices = await api.getVoices();
// Returns: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
```

### Cache Management

#### clearCache()

Clear all cached TTS responses.

```javascript
api.clearCache();
```

### Status

#### getStatus()

Get current playback status.

```javascript
const status = api.getStatus();
// Returns: {
//   isPlaying: boolean,
//   queueLength: number,
//   cacheSize: number,
//   currentText: string | null
// }
```

### Event System

#### on(event, callback)

Add event listener.

```javascript
api.on('start', (data) => {
  console.log('TTS started:', data.text);
});

api.on('complete', (data) => {
  console.log('TTS complete:', data.text);
});

api.on('error', (data) => {
  console.error('TTS error:', data.error);
});
```

**Available events:**
- `start` - TTS generation started
- `progress` - TTS generation progress (reserved for future use)
- `complete` - TTS generation completed
- `error` - TTS generation error

#### off(event, callback)

Remove event listener.

```javascript
const handler = (data) => console.log(data);
api.on('complete', handler);
api.off('complete', handler);
```

### Custom DOM Events

The API dispatches custom events on `window` for avatar integration:

#### vh:lipsync

Dispatched when audio playback starts with viseme data.

```javascript
window.addEventListener('vh:lipsync', (event) => {
  const { visemes, duration } = event.detail;
  // Use visemes for lip-sync animation
});
```

#### vh:stop

Dispatched when playback is stopped.

```javascript
window.addEventListener('vh:stop', () => {
  // Stop avatar animation
});
```

## Usage Examples

### Example 1: Basic TTS with Events

```javascript
// Listen for events
window.virtualHumanAPI.on('start', () => {
  document.getElementById('status').textContent = 'Speaking...';
});

window.virtualHumanAPI.on('complete', () => {
  document.getElementById('status').textContent = 'Ready';
});

// Speak
await window.virtualHumanAPI.speakAndPlay('Hello from PMERIT!');
```

### Example 2: Queue Multiple Messages

```javascript
// These will play in sequence automatically
await window.virtualHumanAPI.speakAndPlay('First message');
await window.virtualHumanAPI.speakAndPlay('Second message');
await window.virtualHumanAPI.speakAndPlay('Third message');

// Check queue status
const status = window.virtualHumanAPI.getStatus();
console.log(`Queue length: ${status.queueLength}`);
```

### Example 3: Cache Performance

```javascript
// First call - hits API (~2-3 seconds)
await window.virtualHumanAPI.speak('Cached message');

// Second call - uses cache (< 100ms)
await window.virtualHumanAPI.speak('Cached message');
```

### Example 4: Voice Selection

```javascript
// Get available voices
const voices = await window.virtualHumanAPI.getVoices();

// Use different voices
await window.virtualHumanAPI.speakAndPlay('Hello in Alloy', { voice: 'alloy' });
await window.virtualHumanAPI.speakAndPlay('Hello in Nova', { voice: 'nova' });
```

### Example 5: Error Handling

```javascript
try {
  await window.virtualHumanAPI.speakAndPlay('Test message');
} catch (error) {
  console.error('TTS failed:', error);
  // Show user-friendly error message
  alert('Voice synthesis temporarily unavailable');
}
```

### Example 6: Avatar Integration

```javascript
// Get avatars
const avatars = await window.virtualHumanAPI.getAvatars();

// Display in UI
avatars.forEach(avatar => {
  console.log(`${avatar.name}: ${avatar.description}`);
});

// Set preference
await window.virtualHumanAPI.setPreferredAvatar('chris_redfield');

// Listen for lip-sync events
window.addEventListener('vh:lipsync', (event) => {
  const { visemes, duration } = event.detail;
  // Pass to avatar controller for animation
  avatarController.animateLipSync(visemes, duration);
});
```

## Configuration

### Custom API Endpoint

```javascript
const customAPI = new VirtualHumanAPI({
  apiBase: 'https://custom-api.example.com',
  ttsEndpoint: '/tts/generate'
});
```

### Disable Caching

```javascript
const noCacheAPI = new VirtualHumanAPI({
  cacheEnabled: false
});
```

### Custom Retry Settings

```javascript
const retryAPI = new VirtualHumanAPI({
  retryAttempts: 5,
  retryDelay: 2000 // 2 seconds
});
```

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 14+, Edge 79+
- **Required APIs**: Fetch API, Web Audio API (optional)
- **Storage**: localStorage for preferences

## Performance

- **First TTS call**: ~2-3 seconds (API network request)
- **Cached TTS call**: < 100ms (instant)
- **Cache size**: Up to 50 entries (LRU eviction)
- **Retry behavior**: 3 attempts with exponential backoff

## Security

- All API calls use HTTPS
- No sensitive data in cache
- Auth token only read from localStorage (never sent to unauthorized endpoints)
- CodeQL security scan: ✅ No vulnerabilities found

## Testing

A test page is included for manual verification:

```bash
# Open in browser
open test-virtual-human-api.html
```

Test features:
- Basic TTS generation
- Cache performance
- Queue management
- Avatar preferences
- Voice selection
- Event system
- Error handling

## Integration

This module is designed to work with:
- `/assets/js/avatar/AudioPlayer.js` - Audio playback utilities
- `/functions/tts/speak.js` - Cloudflare Workers TTS endpoint
- `/assets/js/virtual-human-controller.js` - Avatar controller (Issue #13)

## Troubleshooting

### TTS not working

1. Check API endpoint is accessible
2. Check browser console for errors
3. Verify API returns expected JSON format
4. Try disabling cache: `api.clearCache()`

### Audio not playing

1. Check browser audio permissions
2. Verify audio data format (MP3 or base64)
3. Check browser console for playback errors
4. Test with: `api.getStatus().isPlaying`

### Cache not working

1. Check `cacheEnabled: true` in config
2. Verify cache size: `api.getStatus().cacheSize`
3. Clear cache: `api.clearCache()`

## License

Part of PMERIT AI Educational Platform
© 2025 PeopleMerit

---

**Created:** November 2025  
**Issue:** #12  
**Module Version:** 1.0.0
