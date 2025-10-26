# Phase 3.3-A: Learner Portal + Classroom Virtual Human (WebGL MVP)

## Overview

Phase 3.3-A integrates a Virtual Human avatar into the PMERIT classroom experience, providing learners with an AI tutor that can speak with synchronized lip movements, display captions, and enhance engagement through visual presence.

## Architecture

### Components

```
/portal/classroom.html          # Main classroom page with VH integration
/assets/js/avatar/
  ├── AvatarManager.js          # Orchestrates avatar lifecycle and speech
  ├── WebGLProvider.js          # Three.js-based rendering engine
  ├── LipSyncVisemes.js         # Viseme-to-blendshape mapping
  └── AudioPlayer.js            # Audio playback with progress tracking
/assets/css/avatar.css          # Avatar UI styles
/functions/api/
  ├── tts.js                    # Text-to-speech with viseme data
  ├── stt.js                    # Speech-to-text (stub for Phase 3.3-B)
  └── session/summary.js        # Session persistence
```

### Data Flow

1. **User sends chat message** → AI generates response
2. **Response text** → `/api/tts` → Audio URL + Viseme timeline
3. **AvatarManager** coordinates:
   - AudioPlayer plays audio
   - LipSyncVisemes maps visemes to blendshapes
   - WebGLProvider updates avatar morphTargets
   - Captions display synchronized text
4. **Session end** → `/api/session/summary` → Persist to KV/D1

## Features

### Virtual Human Mode
- **Toggle**: Users can enable/disable VH mode
- **Visual Avatar**: Three.js WebGL rendering (placeholder sphere in MVP)
- **Lip-Sync**: Viseme-driven mouth movements
- **Captions**: Accessible text display with aria-live
- **Audio-Only Fallback**: Graceful degradation when WebGL unavailable

### API Endpoints

#### POST /api/tts
Request:
```json
{
  "text": "Hello, how can I help you today?",
  "voice": "default",
  "speed": 1.0
}
```

Response:
```json
{
  "audioUrl": "https://...",
  "visemes": [
    {"v": "PP", "t": 0},
    {"v": "aa", "t": 150},
    {"v": "E", "t": 300}
  ],
  "duration": 2.5
}
```

#### POST /api/stt (Stub)
Request:
```json
{
  "audioBase64": "base64-encoded-audio-data"
}
```

Response:
```json
{
  "text": "Transcribed text",
  "stub": true
}
```

#### POST /api/session/summary
Request:
```json
{
  "userId": "user123",
  "courseId": "course456",
  "startedAt": "2025-10-26T10:00:00Z",
  "endedAt": "2025-10-26T10:30:00Z",
  "durationSec": 1800,
  "vhMode": true
}
```

Response:
```json
{
  "success": true,
  "sessionId": "session_user123_course456_1729938000000"
}
```

## Environment Variables

For production deployment, configure these in Cloudflare Pages:

```bash
# R2 Asset Storage
AVATAR_BASE_URL=https://avatars.pmerit.com
AVATAR_MODEL=avatar-v1.glb

# Workers AI (Future)
CLOUDFLARE_ACCOUNT_ID=your-account-id
WORKERS_AI_API_KEY=your-api-key

# KV Namespace Bindings
SESSION_SUMMARIES=your-kv-namespace
```

## Usage

### Accessing the Classroom

Navigate to: `/portal/classroom.html?courseId=demo-course-001`

### Virtual Human Toggle

Click the toggle button to enable/disable Virtual Human mode:
- **ON**: Avatar visible with speech and lip-sync
- **OFF**: Audio-only mode with static icon

### Keyboard Shortcuts
- `Ctrl+M`: Toggle Virtual Human mode
- `Ctrl+/`: Focus chat input

## Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| WebGL Avatar | ✅ | ✅ | ✅ | ⚠️ |
| Audio Playback | ✅ | ✅ | ✅ | ✅ |
| Lip-Sync | ✅ | ✅ | ✅ | ⚠️ |
| Captions | ✅ | ✅ | ✅ | ✅ |

⚠️ = Limited testing, may have visual artifacts

## Performance

### Optimization Features
- Pixel ratio capped at 2x for performance
- Frame rate limited to 30 FPS (configurable)
- Auto-pause when tab hidden
- Graceful disposal of Three.js resources

### Bandwidth Modes
- **Full VH**: ~500KB model + ~50KB per TTS request
- **Audio-Only**: ~50KB per TTS request (90% reduction)

## Accessibility

- ✅ WCAG 2.1 AA compliant captions
- ✅ Keyboard navigation support
- ✅ Screen reader compatible (aria-live regions)
- ✅ High contrast mode support
- ✅ Reduced motion support

## Security

### Implemented
- ✅ CORS headers on all API endpoints
- ✅ Input validation and sanitization
- ✅ PII redaction in logs
- ✅ No API keys in client code
- ✅ Rate limiting preparation (structure in place)

### TODO (Phase 3.3-B)
- [ ] Origin-lock CORS to site domain only
- [ ] Implement KV-based rate limiting
- [ ] Add CSP headers for worker responses
- [ ] Implement signed R2 URLs for avatar assets
- [ ] Add authentication checks to session API

## Development

### Local Setup

1. Clone and navigate to repository:
```bash
git clone https://github.com/peoplemerit/pmerit-ai-platform.git
cd pmerit-ai-platform
git checkout feat/phase-3.3A-portal-classroom-vh
```

2. Start local server:
```bash
python3 -m http.server 8080
```

3. Open browser:
```
http://localhost:8080/portal/classroom.html?courseId=demo
```

### Testing Checklist

- [ ] Avatar initializes without errors
- [ ] Toggle switches between VH and audio-only
- [ ] Chat messages trigger avatar speech
- [ ] Captions display synchronized text
- [ ] Audio plays without distortion
- [ ] Session saved on "End Class"
- [ ] Mobile responsive layout works
- [ ] WebGL fallback to audio-only

## Upgrade Path to Phase 3.4

Phase 3.4 will introduce Unreal Engine + Pixel Streaming:

1. **Keep existing WebGLProvider** as fallback
2. **Add PixelStreamProvider** class with same interface
3. **AvatarManager auto-detects** best provider
4. **Graceful degradation**: Pixel Streaming → WebGL → Audio-only

## Troubleshooting

### Avatar doesn't load
- Check browser console for Three.js errors
- Verify WebGL support: `about:gpu` in Chrome
- Try audio-only mode as fallback

### Audio doesn't play
- Check browser autoplay policies
- User interaction required before audio
- Verify CORS headers on audio URLs

### Lip-sync out of sync
- Check network latency
- Verify viseme timestamps in TTS response
- Try reducing playback speed

## Known Limitations (MVP)

1. **Placeholder Avatar**: Simple sphere instead of full humanoid model
2. **Mock TTS**: Returns silent audio with estimated visemes
3. **No Persistence**: Session summaries stored in localStorage only
4. **No Rate Limiting**: Basic structure only, not enforced
5. **CORS Wide Open**: Allows all origins (dev/test only)

## Future Enhancements

- [ ] Load Reallusion GLB avatar model
- [ ] Integrate Workers AI for real TTS
- [ ] Add gesture animations (wave, nod, think)
- [ ] Emotion-driven expressions
- [ ] Voice selection (male/female/accent)
- [ ] Custom avatar personalization
- [ ] Multiplayer classroom support
- [ ] VR/AR avatar mode

## References

- [Three.js Documentation](https://threejs.org/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [SAPI Visemes](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms720881(v=vs.85))
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Narrative Document](../docs/Pmerit-comprehensively-narrative.txt)

## Support

For questions or issues:
- GitHub Issues: https://github.com/peoplemerit/pmerit-ai-platform/issues
- Email: support@pmerit.com
- Slack: #phase-3-3-support

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0-mvp  
**Status**: MVP Complete
