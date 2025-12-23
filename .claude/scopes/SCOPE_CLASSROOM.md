# PMERIT SUB-SCOPE: Virtual Classroom

**Version:** 2.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-22
**Status:** COMPLETE (Core) / ENHANCEMENT NEEDED (Unified Streaming)
**Phase:** P5 (Virtual Classroom)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Virtual Classroom with AI Tutor |
| **Phase** | Phase 5 (P5.1-P5.8) |
| **Pages** | `portal/classroom.html` |
| **JavaScript** | `classroom-session.js`, `gpu-streaming.js`, `lip-sync-controller.js`, `proctor-controller.js`, `vision-ai.js` |
| **CSS** | `classroom.css`, `avatar.css`, `proctor-mode.css` |
| **API Endpoints** | `/api/v1/classroom/*`, `/api/v1/tts` |
| **Database Tables** | `classroom_sessions`, `lesson_progress`, `session_interactions` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

These decisions are final. Changes require MASTER_SCOPE update.

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| CL-001 | Avatar Rendering | Three.js WebGL | Premium GPU services incompatible with free tier | 45 |
| CL-002 | Avatar Model | pmerit-tutor-no-morph.glb (773KB) | Ready Player Me, no morph target errors | 45 |
| CL-003 | Lip Sync Method | Jaw bone X-axis rotation | ARKit morph targets cause Three.js parsing errors | 45 |
| CL-004 | Layout Model | App Shell (100vh fixed) | Prevents scroll, enables docked panels | 47 |
| CL-005 | Theme | Dark mode (#0f1419) | Matches front page, reduces eye strain | 49 |
| CL-006 | Mobile Panels | Slide-out drawers with swipe | Native touch events, no external library | 49 |
| CL-007 | TTS Provider | Cloudflare Workers AI | Returns WAV audio, integrated with backend | 40 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### P5 Requirements (All Complete)

| # | Requirement | Status |
|---|-------------|--------|
| P5.1 | Classroom page loads with course context | Complete |
| P5.2 | AI Tutor available for enrolled students | Complete |
| P5.3 | Lesson content displays correctly | Complete |
| P5.4 | Student controls (prev/next, pause, bookmark) | Complete |
| P5.5 | Raise hand with question logging | Complete |
| P5.6 | Session stats display | Complete |
| P5.7 | Avatar renders with lip sync | Complete |
| P5.8 | Progress tracking persists | Complete |

### User Flow

```
1. User logs in → Dashboard
2. User selects enrolled course → Course detail
3. User clicks "Enter Classroom" → classroom.html?courseId=X
4. Classroom loads with:
   - Course outline (left panel)
   - Lesson content (main area)
   - Avatar with AI tutor (right/PIP)
   - Chat interface (bottom)
5. User interacts with AI tutor
6. Progress saved to database
```

### Layout Structure (App Shell)

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (fixed): Logo | Lesson Title | Proctor | Controls        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────────────────┐  ┌─────────────┐ │
│  │   OUTLINE   │  │                         │  │   AVATAR    │ │
│  │   (Left)    │  │     LESSON CONTENT      │  │   (Right)   │ │
│  │             │  │        (Main)           │  │             │ │
│  │  - Module 1 │  │                         │  │  [3D Model] │ │
│  │    - L1 ◄   │  │  [Content area with     │  │             │ │
│  │    - L2     │  │   video/text/quiz]      │  │             │ │
│  │  - Module 2 │  │                         │  │             │ │
│  │             │  │                         │  │             │ │
│  └─────────────┘  └─────────────────────────┘  └─────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ CHAT PANEL (bottom): Input | Send | Voice                       │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Session 49)

```
PORTRAIT MODE:
┌─────────────────────────┐
│ HEADER (sticky)         │
├─────────────────────────┤
│                         │
│    LESSON CONTENT       │
│    (scrollable)         │
│                         │
├─────────────────────────┤
│ PLAYBACK CONTROLS       │
│ (sticky bottom)         │
├─────────────────────────┤
│ [Outline] [Chat] [More] │
│ (tab bar)               │
└─────────────────────────┘

Outline: Swipe from left edge
Chat: Swipe up from bottom
Avatar: PIP (draggable)
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/classroom/sessions` | Start session |
| GET | `/api/v1/classroom/sessions/:id` | Get session |
| PUT | `/api/v1/classroom/sessions/:id` | Update session |
| POST | `/api/v1/classroom/sessions/:id/interactions` | Log interaction |
| GET | `/api/v1/classroom/lessons/:id` | Get lesson content |
| POST | `/api/v1/tts` | Text-to-speech |
| POST | `/api/v1/ai/tutor` | AI tutor chat |

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 49 (2025-12-11) — Mobile Responsiveness

**Completed:**
- Comprehensive classroom page mobile redesign
- Slide-out outline drawer (swipe from left)
- Slide-up chat panel (swipe from bottom)
- Native touch swipe gestures (no external library)
- Sticky playback controls on mobile
- Dark mode styling for all components

**Files Modified:**
- `assets/css/classroom.css` (mobile styles)
- `portal/classroom.html` (touch gesture handlers)

**Commits:** 9d1d718, 68d52a4, 1fe2fc5

---

### Session 47 (2025-12-11) — App Shell Foundation

**Completed:**
- Created `classroom.css` (new file)
- App Shell architecture (100vh fixed viewport)
- Dark theme implementation (#0f1419)
- Three-column layout (outline | content | avatar)
- Docked avatar PIP container

---

### Session 45 (2025-12-11) — Avatar System Complete

**Completed:**
- Jaw bone lip sync working
- `lip-sync-controller.js` created
- `gpu-streaming.js` v1.8.0
- Ready Player Me avatar rendering

**Key Finding:** ARKit morph targets cause Three.js parsing errors. Solution: Use jaw bone X-axis rotation for lip sync instead.

**Model:** `pmerit-tutor-no-morph.glb` (773KB)

---

### Session 36 (2025-12-06) — Phase 5 Initial Complete

**Completed:**
- P5.1-P5.8 all requirements
- `classroom-session.js` API client
- Backend classroom routes
- Student controls implementation
- Session stats display

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_DASHBOARD | User navigates from dashboard |
| **Requires** | SCOPE_ENROLLMENT | User must be enrolled in course |
| **Requires** | SCOPE_AVATAR | Avatar rendering system |
| **Enables** | SCOPE_PROGRESS | Classroom generates progress data |
| **Enables** | SCOPE_CREDENTIALS | Completed courses earn credentials |

---

## 6. VERIFICATION CHECKLIST

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Classroom loads with course context | [x] | URL params, API fetch |
| 2 | AI Tutor responds to questions | [x] | /api/v1/ai/tutor working |
| 3 | Avatar renders without errors | [x] | No console errors |
| 4 | Lip sync activates on TTS | [x] | Jaw bone animation |
| 5 | Mobile layout works (375px) | [x] | Tested Session 49 |
| 6 | Swipe gestures work | [x] | Left drawer, bottom chat |
| 7 | Dark mode consistent | [x] | #0f1419 throughout |
| 8 | Progress persists to DB | [x] | classroom_sessions table |

---

## 7. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| Avatar may flash on slow connections | Low | Graceful fallback exists |
| Outline drawer z-index on some Android | Low | Edge case, most devices work |

---

## 8. FUTURE ENHANCEMENTS (Not Started)

| Enhancement | Priority | Notes |
|-------------|----------|-------|
| Haptic feedback on mobile | P3 | Vibration API |
| Chat panel state persistence | P3 | Remember open/closed |
| Offline lesson caching | P2 | Service Worker |
| Multiple avatar personas | P2 | Track B - Avatar Diversity |
| Bookmark sync to API | P3 | Currently localStorage only |

---

## 9. UNIFIED STREAMING ARCHITECTURE (From Session 70 Research)

### 9.1 Current Problem: "Reading a Script" Feel

The current architecture processes components sequentially, causing:
- AI generates FULL response → TTS converts FULL text → Audio plays → Avatar animates
- Result: Robotic "reading" feel rather than natural teaching

```
CURRENT (Modular/Sequential)
─────────────────────────────
User Question
    ↓
LLM generates FULL response (waits 2-5s)
    ↓
TTS converts FULL text to audio (waits 1-3s)
    ↓
Audio plays + jaw animation starts
    ↓
Total latency: 3-8 seconds, unnatural cadence
```

### 9.2 Recommended Architecture: Unified Streaming

```
RECOMMENDED (Unified/Streaming)
───────────────────────────────
User Question
    ↓
LLM streams tokens via SSE
    ↓ (parallel)
TTS processes sentence chunks in real-time
    ↓ (parallel)
Audio streams + lip sync data streams
    ↓
Avatar animates in sync with audio
    ↓
Perceived latency: <500ms, natural speech flow
```

### 9.3 Implementation Phases

#### Phase 1: SSE Token Streaming (Backend)

**Current:** `/api/v1/ai/tutor` returns full response
**Target:** Stream tokens via Server-Sent Events

```javascript
// Backend: Stream LLM tokens
app.post('/api/v1/ai/tutor/stream', async (c) => {
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of llmStream) {
                controller.enqueue(`data: ${JSON.stringify({ token: chunk })}\n\n`);
            }
            controller.close();
        }
    });
    return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' }
    });
});
```

#### Phase 2: Sentence-Chunked TTS (Frontend)

**Current:** Wait for full response, then TTS entire text
**Target:** Buffer tokens until sentence complete, TTS each sentence

```javascript
// Frontend: Process sentences as they arrive
let buffer = '';
eventSource.onmessage = (event) => {
    buffer += JSON.parse(event.data).token;

    // Check for sentence boundary
    const sentences = buffer.match(/[^.!?]*[.!?]/g);
    if (sentences) {
        for (const sentence of sentences) {
            ttsQueue.push(sentence);
            buffer = buffer.replace(sentence, '');
        }
    }
};

// TTS queue processor
async function processTTSQueue() {
    while (ttsQueue.length > 0) {
        const sentence = ttsQueue.shift();
        const audio = await fetchTTS(sentence);
        await playWithLipSync(audio);
    }
}
```

#### Phase 3: Interleaved Audio + Lip Sync

**Current:** Audio amplitude → jaw rotation (reactive)
**Target:** Audio + blendshape data stream together (predictive)

| Tier | Sync Method | Latency | Quality |
|------|-------------|---------|---------|
| Free | Audio amplitude → jaw | ~100ms | Basic |
| Premium | Viseme timing data | ~50ms | Good |
| Self-Hosted | Live Link Face | <20ms | Perfect |

### 9.4 Immediate Configuration Fixes

These require NO architectural changes, just prompt/config updates:

#### Fix 1: Instructional System Prompt

```javascript
// BEFORE (current ai.ts)
"You are an AI tutor for PMERIT..."

// AFTER (natural teaching style)
`You are an expert human teacher with natural speech patterns.

SPEECH STYLE:
- Use conversational fillers: "hmm", "let's see", "now..."
- Pause after key concepts: "This is important. [pause] Let me explain why."
- Ask comprehension questions: "Does that make sense so far?"
- Vary tone: excited for new concepts, calm for reinforcement
- Never sound like you're reading a textbook

TEACHING STYLE:
- Break complex ideas into steps
- Use analogies the learner can relate to
- Celebrate small wins: "Good thinking!" or "Exactly right!"
- If the learner is confused, try a different explanation`
```

#### Fix 2: TTS Prosody Hints (If Supported)

```javascript
// Add SSML-like markers for TTS emphasis
const enhancedText = response
    .replace(/\*\*(.*?)\*\*/g, '<emphasis>$1</emphasis>')
    .replace(/\[pause\]/g, '<break time="500ms"/>')
    .replace(/\?/g, '?<break time="300ms"/>');
```

### 9.5 Technology Comparison

| Feature | Current (Modular) | Recommended (Unified) |
|---------|-------------------|----------------------|
| Logic | Text-based LLM | Multimodal LLM (future) |
| Voice | Standard TTS (Monotone) | Prosodic TTS (Emotional) |
| Visuals | Static between speech | Micro-expressions always |
| Sync | Sequential (wait for full) | Interleaved (streaming) |
| Feel | "Reading a textbook" | "Active coaching" |

### 9.6 Service Providers to Evaluate

| Service | Type | Cost | Best For |
|---------|------|------|----------|
| **Hume AI EVI** | Emotive TTS | Pay-per-use | Emotional prosody |
| **Cartesia** | Prosodic TTS | Pay-per-use | Natural speech |
| **HeyGen Interactive** | Streaming avatar | $49+/mo | Real-time lip sync |
| **Tavus** | Streaming avatar | Enterprise | Low-latency sync |
| **OpenAI Realtime API** | Audio LLM | Pay-per-use | Native audio output |

### 9.7 Implementation Checklist

**Phase A: Quick Wins (No Code Changes)**
- [ ] Update AI persona prompts with conversational style
- [ ] Add instructional cues to system prompts
- [ ] Test with "teaching" language vs "reading" language

**Phase B: Streaming Infrastructure**
- [ ] Implement SSE endpoint for LLM streaming
- [ ] Create sentence-chunking buffer in frontend
- [ ] Queue-based TTS processing
- [ ] Test latency improvements

**Phase C: Advanced Sync (Premium/Self-Hosted)**
- [ ] Evaluate HeyGen/Tavus for streaming avatar
- [ ] Implement viseme-based lip sync
- [ ] Add micro-expressions (blinking, breathing)
- [ ] Live Link Face for MetaHuman (self-hosted)

---

## 10. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 36 | 2025-12-06 | P5.1-P5.8 initial implementation |
| 45 | 2025-12-11 | Avatar system with jaw bone lip sync |
| 47 | 2025-12-11 | App Shell architecture |
| 49 | 2025-12-11 | Mobile responsiveness complete |
| 50 | 2025-12-12 | Scope document created |
| 70 | 2025-12-22 | Added Unified Streaming Architecture recommendations |

---

*Last Updated: 2025-12-22 by Claude Code (Session 70)*
