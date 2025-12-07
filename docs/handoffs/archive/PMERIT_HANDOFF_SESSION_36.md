# 🔄 PMERIT Session 36 Handoff Document

## 📋 Session Overview

| Field | Value |
|-------|-------|
| **Date** | December 6, 2025 |
| **Previous Session** | 35 (Phases 4-5 Complete + Bug Fixes) |
| **Current Session** | 36 (Digital Desk Redesign) |
| **Status** | Phase 1 COMPLETE, Phases 2-4 IN PROGRESS |
| **Environment** | Claude Web (pivoted from Claude Code Desktop) |
| **Reason for Pivot** | Claude Code OAuth token expired mid-implementation |

---

## ✅ COMPLETED IN SESSION 35-36

### Bug Fixes (All Committed & Pushed)

| Commit | Files | Issue Fixed |
|--------|-------|-------------|
| `0ab639d` | auth.js, dashboard-courses.js | "User not authenticated" on dashboard |
| `7b30a54` | courses.html | Wrong API endpoints (/functions/api/*) |
| `3ec7763` | courses.html | Wrong field mapping causing enrollment 404 |
| `c6ff4d7` | virtual-human-api.js | Avatar ID mismatch (ty_character → ty_child) |
| `43d816a` | avatar-frame.css, proctor-mode.css, classroom.html | Digital Desk Phase 1 |

### Phase 1: Digital Desk Foundation — COMPLETE ✅

**Files Created:**

1. **`assets/css/avatar-frame.css`** (564 lines) — NEW
   - Hologram frame container with shimmer effect
   - Tiered styling: Premium (gold glow), Standard (teal), Free (dashed), Fallback
   - LIVE badge for premium tier
   - State indicators (listening, processing, speaking animations)
   - Quick Actions drawer with slide-up interaction
   - Assignment drop zone overlay
   - Bandwidth toggle control

2. **`assets/css/proctor-mode.css`** (536 lines) — NEW
   - Proctor status indicator with pulse animation
   - Sidebar retraction during exams
   - Exam container and timer styling
   - Vision AI indicators (eye tracking)
   - Violation warning modal
   - Camera privacy shutter animation

3. **`portal/classroom.html`** — MODIFIED
   - Added CSS imports for new stylesheets
   - Proctor status indicator in header
   - New avatar frame HTML structure:
     - Quick Actions drawer (Raise Hand, Submit Work, Ask Hint)
     - Assignment drop zone for drag-and-drop
     - Bandwidth toggle
     - State indicator ring
     - Fallback static avatar
   - JavaScript handlers for drag-and-drop, quick actions, tier detection

---

## 🚧 IN PROGRESS — Phases 2-4

### Phase 2: Proctor Mode JavaScript (STARTED, NOT COMPLETE)

**File Started:** `assets/js/proctor-controller.js`

Claude Code was creating this file when the OAuth token expired. The file was partially written (approximately 762 lines started).

**Required Features:**
- Exam session management (start, end, submit)
- Timer management with warnings
- Violation detection and tracking
- Tab/window focus monitoring
- Integration points for Vision AI
- Exam submission and grading hooks

### Phase 3: Vision AI Integration (NOT STARTED)

**File Needed:** `assets/js/vision-ai.js`

**Required Features:**
- Face detection using TensorFlow.js or MediaPipe
- Gaze tracking (eye movement monitoring)
- Multiple person detection
- Phone/screen detection
- Violation event emission
- Privacy controls (camera on/off indicators)

### Phase 4: DigitalOcean GPU Streaming (NOT STARTED)

**File Needed:** `assets/js/gpu-streaming.js`

**Required Features:**
- DigitalOcean API integration
- Just-In-Time GPU Droplet provisioning
- Unreal Pixel Streaming client
- Bandwidth detection for tier auto-selection
- Graceful fallback when GPU unavailable
- Cost management (auto-shutdown idle sessions)

---

## 📁 Current File Structure

```
pmerit-ai-platform/
├── assets/
│   ├── css/
│   │   ├── avatar-frame.css       ← NEW (Phase 1)
│   │   ├── proctor-mode.css       ← NEW (Phase 1)
│   │   └── ...
│   ├── js/
│   │   ├── auth.js                ← MODIFIED (userId fix)
│   │   ├── dashboard-courses.js   ← MODIFIED (userId fix)
│   │   ├── virtual-human-api.js   ← MODIFIED (avatar ID fix)
│   │   ├── virtual-human-controller.js
│   │   ├── proctor-controller.js  ← NEEDS COMPLETION (Phase 2)
│   │   ├── vision-ai.js           ← NEEDS CREATION (Phase 3)
│   │   └── gpu-streaming.js       ← NEEDS CREATION (Phase 4)
│   └── avatars/
│       └── ty_character.glb
├── portal/
│   ├── classroom.html             ← MODIFIED (Digital Desk UI)
│   └── ...
├── courses.html                   ← MODIFIED (API fix)
├── dashboard.html
└── Break time brainstorm.txt      ← Reference document
```

---

## 🎯 Implementation Plan (Phases 2-4)

### Phase 2: Proctor Controller (~800 lines)

```javascript
// Key structure needed:
window.ProctorController = {
  // State
  state: {
    isExamMode: false,
    examId: null,
    startTime: null,
    duration: null,
    violations: [],
    warningCount: 0
  },
  
  // Core Methods
  startExam(config),
  endExam(),
  submitExam(),
  pauseExam(),
  resumeExam(),
  
  // Violation Tracking
  logViolation(type, details),
  showWarning(message),
  handleTabBlur(),
  handleTabFocus(),
  
  // Timer
  startTimer(),
  updateTimer(),
  showTimeWarning(),
  
  // UI Updates
  enterProctorMode(),
  exitProctorMode(),
  updateProctorStatus(status)
};
```

### Phase 3: Vision AI (~600 lines)

```javascript
// Key structure needed:
window.VisionAI = {
  // State
  state: {
    isActive: false,
    stream: null,
    model: null,
    lastDetection: null
  },
  
  // Initialization
  async init(),
  async loadModel(),
  async requestCamera(),
  
  // Detection
  async detectFace(),
  async trackGaze(),
  async detectMultiplePeople(),
  async detectPhone(),
  
  // Event System
  onViolation(callback),
  emitViolation(type, confidence),
  
  // Privacy
  showCameraActive(),
  showCameraOff(),
  stopTracking()
};
```

### Phase 4: GPU Streaming (~500 lines)

```javascript
// Key structure needed:
window.GPUStreaming = {
  // State
  state: {
    isConnected: false,
    dropletId: null,
    streamUrl: null,
    tier: 'free' // 'free', 'standard', 'premium'
  },
  
  // DigitalOcean Integration
  async provisionDroplet(),
  async destroyDroplet(),
  async getDropletStatus(),
  
  // Pixel Streaming
  async connectStream(url),
  async disconnectStream(),
  handleStreamEvent(event),
  
  // Tier Management
  detectBandwidth(),
  selectTier(bandwidth),
  upgradeTier(),
  downgradeTier(),
  
  // Cost Management
  startIdleTimer(),
  resetIdleTimer(),
  handleIdleTimeout()
};
```

---

## 🔧 Backend Requirements

### New API Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/exams/:id/start` | POST | Start proctored exam session |
| `/api/v1/exams/:id/submit` | POST | Submit exam answers |
| `/api/v1/exams/:id/violations` | POST | Log proctoring violation |
| `/api/v1/assignments/submit` | POST | Submit assignment file |
| `/api/v1/gpu/provision` | POST | Request GPU droplet |
| `/api/v1/gpu/status` | GET | Check droplet status |
| `/api/v1/gpu/destroy` | POST | Destroy GPU droplet |

### Database Tables Needed

```sql
-- Exam sessions
CREATE TABLE exam_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  exam_id UUID REFERENCES assessments(assessment_id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  submitted_at TIMESTAMP,
  duration_seconds INTEGER,
  violation_count INTEGER DEFAULT 0,
  status VARCHAR(20), -- 'in_progress', 'submitted', 'flagged', 'invalidated'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proctoring violations
CREATE TABLE proctoring_violations (
  violation_id UUID PRIMARY KEY,
  session_id UUID REFERENCES exam_sessions(session_id),
  violation_type VARCHAR(50), -- 'tab_switch', 'face_away', 'multiple_faces', 'phone_detected'
  timestamp TIMESTAMP,
  details JSONB,
  severity VARCHAR(20), -- 'warning', 'minor', 'major', 'critical'
  created_at TIMESTAMP DEFAULT NOW()
);

-- GPU sessions (for billing/tracking)
CREATE TABLE gpu_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  droplet_id VARCHAR(100),
  region VARCHAR(20),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  cost_cents INTEGER,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 Design Reference (From Gemini Brainstorm)

### Tiered Virtual Humans

| Tier | Avatar Type | Technology | Visual Style |
|------|-------------|------------|--------------|
| **Free** | Cartoonish 2D | CSS/SVG animations | Dashed border, sketch effect |
| **Standard** | Semi-realistic 3D | Three.js/WebGL client-side | Teal border, subtle glow |
| **Premium** | Unreal MetaHuman | DigitalOcean GPU streaming | Gold border, "LIVE" badge |
| **Fallback** | Static icon | CSS only | Gray border, no animation |

### Proctor Mode UI Transformation

1. **On Exam Start:**
   - UI colors dim (muted theme)
   - Sidebars retract completely
   - "AI Proctor Active" indicator pulses red
   - Avatar moves to corner (monitoring pose)

2. **Vision AI Active:**
   - Small eye icon shows gaze tracking
   - Green border = compliant
   - Yellow border = warning issued
   - Red border = violation logged

3. **On Exam End:**
   - "Camera Off / Proctoring Ended" animation
   - Digital shutter closing effect
   - Return to normal UI theme

---

## 📋 Immediate Next Steps

### Priority 1: Complete proctor-controller.js
1. Create the full ProctorController module
2. Wire up to classroom.html
3. Test exam start/end flow

### Priority 2: Create vision-ai.js
1. Implement face detection with TensorFlow.js
2. Add gaze tracking
3. Integrate with ProctorController

### Priority 3: Create gpu-streaming.js
1. DigitalOcean API integration
2. Pixel Streaming client
3. Tier auto-detection

### Priority 4: Backend API endpoints
1. Create exam session endpoints
2. Create GPU provisioning endpoints
3. Database migrations

---

## 🔗 Key References

| Resource | Location |
|----------|----------|
| Break time brainstorm.txt | `E:\pmerit\pmerit-ai-platform\Break time brainstorm.txt` |
| Gemini Design Brainstorm | User message in this session |
| Current classroom.html | `portal/classroom.html` |
| Avatar Frame CSS | `assets/css/avatar-frame.css` |
| Proctor Mode CSS | `assets/css/proctor-mode.css` |
| Production URL | https://pmerit.com |
| API URL | https://pmerit-api-worker.peoplemerit.workers.dev |

---

## 📝 User Preferences Reminder

- One command/code block at a time
- Wait for "DONE" confirmation before next step
- Free/open-source solutions first
- Assess tokens for handoff timing
- Document all decisions

---

## 🏁 Ready to Continue

**Current Task:** Complete Phase 2 (proctor-controller.js) → Phase 3 (vision-ai.js) → Phase 4 (gpu-streaming.js)

**User Request:** "Can we implement Phase 2 to 4 now once and for all since we are on it? We will then update the entire project documents and files being used for this project to reflect software stacks and the technologies being deployed."

---

*Handoff created: December 6, 2025*
*Previous commits: 5 (bug fixes + Phase 1)*
*Pending commits: Phases 2-4 implementation*
