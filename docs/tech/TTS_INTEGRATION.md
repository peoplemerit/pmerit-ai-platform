# Cloudflare Workers AI TTS Integration

## Overview

This implementation integrates Cloudflare Workers AI for high-quality text-to-speech (TTS) generation on the PMERIT platform. The system provides natural-sounding voices with automatic fallback to browser-based speech synthesis.

## Features

- **Multiple Voice Engines**: Support for Cloudflare Workers AI TTS models:
  - `aura-2-en`: Deepgram Aura 2 (English) - Default, recommended
  - `aura-1`: Deepgram Aura 1 (Multi-language)
  - `melotts`: MeloTTS (Expressive voices)
  - `aura-2-es`: Deepgram Aura 2 (Spanish)
  - `browser`: Browser Web Speech API (Fallback)

- **Automatic Fallback**: If Workers AI is unavailable, automatically falls back to browser speech synthesis
- **Settings Persistence**: User voice preferences are saved to localStorage
- **Analytics Integration**: Comprehensive tracking of TTS events (start, stop, error, engine selection)
- **User Interface**: Settings page for voice engine selection with test functionality

## Configuration

### Cloudflare Pages Setup

1. **Deploy wrangler.toml**: The configuration file is already in the repository root
2. **Enable Workers AI**: In your Cloudflare Pages dashboard:
   - Go to Settings → Functions
   - Enable Workers AI
   - The AI binding will be available as `env.AI` in your functions

3. **Environment Variables** (optional, configured in wrangler.toml):
   - `TTS_DEFAULT_MODEL`: Default TTS model (default: @cf/deepgram/aura-2-en)
   - `TTS_MAX_TEXT_LENGTH`: Maximum text length (default: 5000)

### CSP Headers

The `_headers` file has been updated to allow:
- `connect-src`: Cloudflare API and Workers domains
- `media-src`: Audio streaming from Workers AI

## API Endpoints

### POST /functions/tts/speak

Generate speech from text using Cloudflare Workers AI.

**Query Parameters:**
- `voiceEngine` (optional): Voice engine to use (aura-2-en, aura-1, melotts, aura-2-es)

**Request Body:**
```json
{
  "text": "Hello, this is a test of the text-to-speech system."
}
```

**Response:**
- Status: 200 OK
- Content-Type: audio/mp3
- Headers:
  - `X-TTS-Engine`: Engine used
  - `X-TTS-Latency`: Generation latency in milliseconds

**Error Responses:**
- 400: Invalid input (missing text, text too long)
- 503: Service unavailable (Workers AI unavailable)
  - Response includes `fallback: true` to trigger client-side fallback
  - Header: `X-TTS-Fallback: required`

## Client-Side Usage

### Basic Usage

```javascript
// Simple speech with default settings
await window.TTS.speak('Hello, world!');

// Speech with specific engine
await window.TTS.speak('Hello, world!', {
  voiceEngine: 'aura-2-en',
  useServer: true
});

// Browser fallback
await window.TTS.speak('Hello, world!', {
  voiceEngine: 'browser',
  useServer: false
});
```

### Voice Engine Management

```javascript
// Get available engines
const engines = window.TTS.getAvailableEngines();
// Returns: { 'aura-2-en': 'Deepgram Aura 2 (English)', ... }

// Set preferred engine
window.TTS.setVoiceEngine('melotts');

// Get current engine
const current = window.TTS.getVoiceEngine();

// Get all settings
const settings = window.TTS.getSettings();
```

### Event Listening

```javascript
// Listen for TTS events
document.addEventListener('tts:start', (e) => {
  console.log('TTS started:', e.detail);
});

document.addEventListener('tts:end', () => {
  console.log('TTS ended');
});

document.addEventListener('tts:fallback', (e) => {
  console.log('Fallback triggered:', e.detail.message);
});

document.addEventListener('tts:viseme', (e) => {
  // Viseme events for avatar lip-sync
  console.log('Intensity:', e.detail.intensity);
});
```

## Analytics Events

The integration emits the following analytics events:

- `tts_start`: TTS playback started
  - `page`: Current page
  - `ts`: Timestamp
  - `textChars`: Text length
  - `engine`: Engine used
  - `source`: 'server' or 'web_speech_api'

- `tts_stop`: TTS playback stopped
  - `page`: Current page
  - `ts`: Timestamp
  - `engine`: Engine used
  - `duration`: Playback duration in ms

- `tts_error`: TTS error occurred
  - `page`: Current page
  - `ts`: Timestamp
  - `engine`: Engine used
  - `error`: Error message

- `tts_engine`: Engine selection/usage
  - `page`: Current page
  - `ts`: Timestamp
  - `engine`: Engine identifier
  - `useServer`: Boolean

- `tts_engine_change`: User changed engine preference
  - `page`: Current page
  - `ts`: Timestamp
  - `engine`: New engine

- `tts_fallback`: Fallback triggered
  - `page`: Current page
  - `ts`: Timestamp
  - `message`: Fallback reason
  - `engine`: Fallback engine

## Testing

### Automated Tests

Run the integration test suite:

```bash
cd /tmp/tts-test
node test-tts.js
```

Tests verify:
- Module loading
- Available engines
- Voice engine selection
- Settings persistence
- Settings loading
- Default settings
- Event constants

### Manual Testing

1. **Settings Page**: Visit `/settings.html`
   - Select different voice engines
   - Click "Test Voice" to hear each engine
   - Settings persist across page reloads

2. **Fallback Testing**: 
   - Test without AI binding configured (should fallback to browser)
   - Test with network issues (should show fallback message)

3. **Analytics Testing**:
   - Open browser console
   - Use voice engines
   - Verify analytics events are logged

## Browser Compatibility

- **Server TTS (Workers AI)**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Browser Fallback**: Requires Web Speech API support
  - Chrome/Edge: Full support
  - Firefox: Full support
  - Safari: Partial support (limited voices)
  - Mobile: Varies by platform

## Troubleshooting

### Workers AI Not Available

If you see "Service unavailable" errors:
1. Verify Workers AI is enabled in Cloudflare Pages dashboard
2. Check that wrangler.toml is deployed
3. Verify the AI binding is configured correctly

### Audio Not Playing

1. Check browser console for errors
2. Verify CSP headers allow audio loading
3. Try the browser fallback option
4. Check that audio autoplay is enabled (some browsers block it)

### Settings Not Persisting

1. Check localStorage is available and not full
2. Verify browser allows localStorage for the domain
3. Check for JavaScript errors in console

## Cost Considerations

- Cloudflare Workers AI TTS is billed per request
- Consider implementing:
  - Request throttling
  - Caching for repeated phrases
  - Text length limits (already implemented: 5000 chars)
  - Rate limiting per user

## Future Enhancements

- Audio caching for frequently used phrases
- Support for additional Cloudflare TTS models as they become available
- Viseme data for more accurate lip-sync
- Voice customization (speed, pitch)
- Support for SSML (Speech Synthesis Markup Language)
- Multi-language detection and automatic engine selection

## Related Files

- `/wrangler.toml` - Cloudflare configuration with AI binding
- `/functions/tts/speak.js` - Server-side TTS endpoint
- `/assets/js/tts.js` - Client-side TTS module
- `/settings.html` - User settings interface
- `/_headers` - CSP configuration
