# Phase 3.3-B: Front Page Virtual Human (WebGL) + Receptionist Mode

## Overview

Phase 3.3-B extends the Virtual Human avatar from Phase 3.3-A to the home page, providing a welcoming receptionist experience for guest visitors. The avatar appears in a fixed-position container in the bottom-right corner and helps guide users toward key conversion funnels (Assessment and Sign-Up).

## Architecture

### Components

```
/index.html                      # Home page with VH integration
/assets/css/avatar-home.css      # Home-specific avatar styles
/assets/js/avatar-home.js        # HomeAvatarManager class
/assets/js/avatar/               # Shared modules from Phase 3.3-A
  ├── AvatarManager.js           # Core avatar orchestration
  ├── WebGLProvider.js           # Three.js rendering
  ├── LipSyncVisemes.js          # Viseme mapping
  └── AudioPlayer.js             # Audio playback
/functions/api/
  ├── tts.js                     # Text-to-speech (reused)
  └── session/summary.js         # Session logging (updated)
```

### Key Differences from Phase 3.3-A (Classroom)

| Feature | Phase 3.3-A (Classroom) | Phase 3.3-B (Home) |
|---------|------------------------|---------------------|
| **Position** | Embedded in layout | Fixed bottom-right |
| **Size** | 400px tall canvas | 280px tall canvas |
| **User Context** | Authenticated learner | Guest visitor |
| **Purpose** | AI tutor for courses | Receptionist for conversion |
| **Conversation** | Course-specific help | General info + CTAs |
| **Session Logging** | User-linked sessions | Anonymous guest sessions |
| **Loading** | Immediate | Lazy on user interaction |
| **Dismissible** | No (part of classroom) | Yes (minimize/close) |

## Features

### 1. Lazy Loading

The Virtual Human assets are loaded **only when the user activates** the toggle to protect page load performance:

- Initial page load: Only CSS and initialization script (~24KB)
- On toggle activation: Three.js + avatar modules loaded asynchronously (~200KB)
- Graceful fallback: If WebGL fails, continues in audio-only mode

### 2. Receptionist Conversation Starters

Five pre-defined conversation starters guide users toward conversion:

1. **"Tell me about courses"** → Explains offerings + Assessment CTA
2. **"How can I discover my path?"** → Promotes assessment tool
3. **"What does it cost?"** → Discusses pricing + Sign Up CTA
4. **"How does PMERIT work?"** → Platform overview + Sign Up CTA
5. **"Can this help my career?"** → Career focus + Assessment CTA

### 3. Call-to-Action Wiring

After conversation starters, contextual CTA buttons appear:

- **Begin Assessment** → Routes to `/assessment.html`
- **Create Account** → Opens AuthModal (Sign-Up tab) or `/signin.html`
- **Sign In** → Opens AuthModal (Sign-In tab) or `/signin.html`
- **View Pricing** → Routes to `/pricing.html`

All CTA clicks are tracked via analytics events.

### 4. Guest Session Tracking

Anonymous sessions are logged (no PII) to measure engagement:

```javascript
{
  sessionId: "guest_1234567890_abc123",  // Anonymous ID
  startedAt: "2025-10-26T10:00:00Z",
  endedAt: "2025-10-26T10:05:00Z",
  durationSec: 300,
  vhMode: true,
  guestMode: true,
  interactions: 3,                        // Number of starter clicks
  ctaClicks: {
    assessment: 1,
    signup: 1
  }
}
```

Session data is sent to `/api/session/summary` on close/hide.

### 5. UI Controls

The avatar container includes:

- **Toggle Button**: Enable/disable VH mode (WebGL on/off)
- **Minimize Button**: Collapse to header bar only
- **Close Button**: Hide container completely and end session

### 6. Responsive Design

- **Desktop (≥1024px)**: 360px width, bottom-right corner
- **Tablet (769-1023px)**: 320px width, bottom-right corner
- **Mobile (<768px)**: Full width minus 20px margin, bottom of screen

### 7. Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ `aria-live="polite"` for captions
- ✅ Keyboard accessible (focus styles, tab order)
- ✅ `prefers-reduced-motion` support
- ✅ High contrast mode support
- ✅ Screen reader compatible

## Usage

### For Users

1. **Activate Virtual Human**:
   - Click "Virtual Human Mode" toggle in left sidebar (desktop)
   - Or tap the toggle in hamburger menu (mobile)

2. **Interact**:
   - Click a conversation starter button
   - Read the avatar's response in captions
   - Click CTA buttons to take action

3. **Dismiss**:
   - Click minimize to collapse
   - Click close to hide completely

### For Developers

#### Including in a Page

Add to `<head>`:
```html
<link rel="stylesheet" href="assets/css/avatar-home.css">
```

Add before `</body>`:
```html
<script src="assets/js/avatar-home.js" defer></script>
```

The avatar will auto-initialize on page load.

#### Configuration

The `HomeAvatarManager` reads these from `localStorage`:

- `pmerit_vh_home_enabled`: `"true"` or `"false"` (persists toggle state)
- `pmerit_vh_home_session`: Session data (ephemeral)

#### Customizing Conversation Starters

Edit `assets/js/avatar-home.js` and modify the `conversationStarters` array:

```javascript
{
  icon: 'fa-graduation-cap',           // Font Awesome icon
  text: 'Tell me about courses',       // Button text
  response: 'I\'d be happy...',        // Avatar's spoken response
  ctas: ['assessment']                 // CTAs to show: assessment, signup, signin, pricing
}
```

## API Integration

### Reused Endpoints

Phase 3.3-B reuses these endpoints from Phase 3.3-A:

#### POST /api/tts

Generates audio and viseme data for speech.

**Request:**
```json
{
  "text": "Hello, how can I help you?",
  "voice": "default",
  "speed": 1.0
}
```

**Response:**
```json
{
  "audioUrl": "data:audio/wav;base64,...",
  "visemes": [
    {"v": "PP", "t": 0},
    {"v": "aa", "t": 150}
  ],
  "duration": 2.5
}
```

### Updated Endpoint

#### POST /api/session/summary

Logs session metrics. Updated to support `guestMode` flag.

**Request:**
```json
{
  "sessionId": "guest_1234567890_abc123",
  "startedAt": "2025-10-26T10:00:00Z",
  "endedAt": "2025-10-26T10:05:00Z",
  "durationSec": 300,
  "vhMode": true,
  "guestMode": true,
  "interactions": 3,
  "ctaClicks": {
    "assessment": 1,
    "signup": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "guest_1234567890_abc123"
}
```

## Analytics Events

The home avatar dispatches these custom events:

| Event | Fired When | Payload |
|-------|-----------|---------|
| `vh_home_init` | Avatar manager initialized | `{enabled: boolean}` |
| `vh_toggle_on` | Avatar shown | `{sessionId: string}` |
| `vh_toggle_off` | Avatar hidden | `{sessionId: string}` |
| `vh_minimize` | Avatar minimized | `{sessionId: string}` |
| `vh_starter_click` | Conversation starter clicked | `{starterId: number, text: string}` |
| `cta_assessment_click` | "Begin Assessment" clicked | `{sessionId: string}` |
| `cta_signup_click` | "Create Account" clicked | `{sessionId: string}` |
| `cta_signin_click` | "Sign In" clicked | `{sessionId: string}` |
| `cta_pricing_click` | "View Pricing" clicked | `{sessionId: string}` |

Listen for events:
```javascript
window.addEventListener('pmerit-analytics', (e) => {
  console.log('Event:', e.detail.event, e.detail);
  // Send to analytics service
});
```

## Performance

### Optimization Features

1. **Lazy Loading**: Three.js and avatar modules loaded only on demand
2. **Deferred Script**: `avatar-home.js` uses `defer` attribute
3. **CSS-Only Initial State**: Avatar toggle is functional before JS loads
4. **Minimal Footprint**: Container hidden until activated
5. **Resource Cleanup**: Three.js resources disposed on close

### Performance Budget

| Metric | Target | Phase 3.3-B Impact |
|--------|--------|--------------------|
| **LCP** | <2.5s | No impact (lazy load) |
| **FID** | <100ms | No impact (deferred) |
| **CLS** | <0.1 | No impact (fixed position) |
| **Initial Load** | <500KB | +24KB (CSS + JS) |
| **After Activation** | - | +200KB (Three.js + modules) |

## Security

### Implemented

- ✅ CORS headers on API endpoints
- ✅ Input validation and sanitization
- ✅ Anonymous session IDs (no PII)
- ✅ Rate limiting structure in place
- ✅ No secrets in client code

### TODO (Phase 3.3-C)

- [ ] Origin-lock CORS to site domain only
- [ ] Implement KV-based rate limiting
- [ ] Add CSP headers for worker responses
- [ ] Implement signed R2 URLs for avatar assets

## Browser Support

| Browser | WebGL Avatar | Audio-Only | Captions |
|---------|-------------|------------|----------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ⚠️ | ✅ | ✅ |
| Mobile Safari | ⚠️ | ✅ | ✅ |

⚠️ = Limited testing, may have visual artifacts

## Troubleshooting

### Avatar doesn't appear when toggled

**Possible causes:**
- Check browser console for JavaScript errors
- Ensure `assets/js/avatar-home.js` is loaded
- Verify CSS file `assets/css/avatar-home.css` is linked

**Fix:**
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Clear localStorage: `localStorage.removeItem('pmerit_vh_home_enabled')`

### Three.js fails to load

**Error:** `Failed to load avatar modules`

**Cause:** CDN blocked or network issue

**Fix:** Avatar continues in audio-only mode automatically. This is expected behavior.

### CTAs don't navigate

**Possible causes:**
- AuthModal not loaded (check for `/partials/auth-modal.html`)
- JavaScript error preventing navigation

**Fix:**
- Check browser console
- Ensure auth modal partial is included in page

### Session not logging

**Error:** `Failed to log session` (501 or other HTTP error)

**Cause:** `/api/session/summary` endpoint not updated for `guestMode`

**Fix:** Update endpoint to handle guest sessions (see API Integration section)

## Testing Checklist

- [ ] Toggle shows/hides avatar correctly
- [ ] Conversation starters trigger responses
- [ ] CTAs appear after starter clicks
- [ ] Assessment CTA routes to `/assessment.html`
- [ ] Sign Up CTA opens AuthModal
- [ ] Analytics events fire correctly
- [ ] Close button ends session
- [ ] Minimize button collapses avatar
- [ ] Sidebar toggles sync with avatar state
- [ ] Mobile responsive layout works
- [ ] Captions display with AA contrast
- [ ] Keyboard navigation works
- [ ] Screen reader announces captions
- [ ] Audio-only fallback when WebGL fails

## Integration with Phase 3.3-A

Phase 3.3-B **reuses** these modules from Phase 3.3-A:

- `AvatarManager.js` - Core orchestration (no changes)
- `WebGLProvider.js` - Three.js rendering (no changes)
- `LipSyncVisemes.js` - Viseme mapping (no changes)
- `AudioPlayer.js` - Audio playback (no changes)

Phase 3.3-B **adds** these new components:

- `avatar-home.css` - Home page specific styles
- `avatar-home.js` - HomeAvatarManager wrapper class

This architecture allows both classroom and home page avatars to coexist without conflicts.

## Future Enhancements (Phase 3.3-C)

- [ ] Voice input (STT) for guest users
- [ ] Multi-language support for conversation starters
- [ ] Gesture animations (wave on first load, nod during response)
- [ ] Custom avatar selection
- [ ] A/B testing framework for different conversation flows
- [ ] Integration with live chat handoff
- [ ] More sophisticated NLP for freeform questions

## References

- [Phase 3.3-A README](PHASE_3_3_A_README.md) - Classroom avatar implementation
- [Three.js Documentation](https://threejs.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)

## Support

For questions or issues:
- GitHub Issues: https://github.com/peoplemerit/pmerit-ai-platform/issues
- Email: support@pmerit.com
- Tag issues with: `phase:3.3`, `area:frontend`, `area:ux`

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0  
**Status**: MVP Complete
