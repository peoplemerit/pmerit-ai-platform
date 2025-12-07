# PMERIT HANDOFF — Sessions 38-39 (UPDATED)
**Date:** December 7, 2025  
**Status:** Digital Desk Complete, Content Strategy Defined  
**Next Session:** 40

---

## SESSIONS 38-39 MAJOR ACHIEVEMENTS

### Session 38 — Digital Desk Backend API (13 New Endpoints → 40 Total)
- **Exam/Proctoring Routes** (src/routes/exams.ts ~520 lines): 6 endpoints for exam sessions, violations, submissions, user history
- **GPU Streaming Routes** (src/routes/gpu.ts ~350 lines): 7 endpoints for provisioning, status, destroy, tiers, bandwidth testing
- **Database:** Verified 82 tables including exam_sessions, proctoring_violations, gpu_sessions
- **Build Fix:** Committed missing src/routes/classroom.ts (d8ba1b5)

### Session 39 — 3D Avatar Rendering Breakthrough
- Fixed API_BASE_URL from '/api' to full backend URL (9340bd8)
- Added visual completion indicators, guest mode, timezone-based region selection (ea03cd3)
- Cloudflare CSP updated: Added https://cdn.jsdelivr.net to script-src
- Import map added to portal/classroom.html for Three.js ES module resolution
- **3D Avatar Success:** humano_professional.glb (5,851 KB) now renders in classroom

**Current Avatar State:** Model loads 100%, renders with lighting, T-pose (needs idle animation), full body view (should be waist-up)

---

## PRODUCTION STATUS

| Component | Status | Details |
|-----------|--------|---------|
| API | v2.2.0 | 40 endpoints, healthy |
| Frontend | Live | pmerit.com |
| Classroom modules | All loading | Auth, ProctorController v2.0, VisionAI v1.0, GPUStreaming v1.0 |
| Guest preview | Working | Bandwidth detection (9.00 Mbps), region selection (nyc1) |
| Console | Clean | No errors |

---

## UX ASSESSMENT & RECOMMENDATIONS

**Critical Issue:** Avatar occupies entire center stage, blocking lesson content.

**Recommended "Digital Desk" Layout:**
```
Center: Lesson content (slides/PDF/whiteboard) - always visible
Top-right: Floating avatar widget (320x240px, draggable, resizable)
Fallback: Static image in widget + toast notification, NOT error screen
```

---

## TO-DO LIST — Additional Items from Post-Handoff Discussion

### 🔴 PRIORITY 1: Avatar Polish (Quick Wins)
- [ ] **Camera framing:** Zoom to waist-up view (not full body)
- [ ] **Idle animation:** Add breathing/subtle movement loop
- [ ] **Background:** Transparent or match theme color
- [ ] **Remove debug code** from gpu-streaming.js

### 🔴 PRIORITY 2: Floating Widget Conversion (Critical UX)
- [ ] **Position:** Top-right corner by default
- [ ] **Size:** ~320x240px initial
- [ ] **Draggable:** Like Teams/WhatsApp video calls
- [ ] **Minimize:** Collapse to small icon when not needed
- [ ] **Expand:** Click to enlarge temporarily

### 🟡 PRIORITY 3: Connect TTS to Avatar (1 week)
- [ ] Add volume-based lip sync to gpu-streaming.js
- [ ] Connect existing TTS audio playback to avatar mouth morph target
- [ ] Test with one lesson ("Google Analytics Mastery")
- [ ] Implement `startLipSync(audioElement)` function

### 🟡 PRIORITY 4: Content Stage (Essential)
- [ ] Create dedicated center area for lesson materials
- [ ] Support multiple content types: slides, PDF, whiteboard, video
- [ ] Ensure avatar NEVER blocks content
- [ ] Add content navigation controls

### 🟢 PRIORITY 5: Lesson Content Pipeline
- [ ] Write lesson scripts for "Google Analytics Mastery" course
- [ ] Generate TTS audio files (cache for reuse)
- [ ] Embed content into Vectorize for RAG
- [ ] Enable AI tutor Q&A with lesson context

---

## TO-DO LIST — Educational Content Strategy

### 📚 TRACK 1: Global Remote (6 Pathways)

**Content Volume:** 42 courses, 126 modules, 630 lessons (~1,200 content items)

| Task | Status | Priority |
|------|--------|----------|
| [ ] Audit existing lesson_content in database | Not Started | High |
| [ ] Complete "Google Analytics Mastery" as hero course | In Progress | High |
| [ ] Generate 5-10 AI lesson scripts for testing | Not Started | High |
| [ ] Curate OER links (freeCodeCamp, Google Digital Garage) | Not Started | Medium |
| [ ] Create content pipeline: Script → TTS → Avatar → Classroom | Not Started | High |

**Recommended Sources:**
- freeCodeCamp (Web Dev, Data Science) — BSD License
- Google Digital Garage (Digital Marketing) — Free
- Google Analytics Academy — Free
- HubSpot Academy (Marketing) — Free
- Figma Learn (UX Design) — Free

### 📚 TRACK 2: Local Education (4 Pathways — Maine K-12)

**Content Volume:** ~880 lessons across PreK-12

| Task | Status | Priority |
|------|--------|----------|
| [ ] Map Maine Learning Results to OER content | Not Started | High |
| [ ] Curate Khan Academy content by grade/subject | Not Started | High |
| [ ] Curate CK-12 content for Science/Math | Not Started | Medium |
| [ ] Create age-appropriate AI tutor personas | Designed | Medium |
| [ ] Build grade-level assessment alignment | Not Started | Medium |

**Recommended Sources:**
- Khan Academy (K-12 all subjects) — CC BY-NC-SA ⭐⭐⭐⭐⭐
- CK-12 (K-12 Math, Science, ELA) — CC BY-NC ⭐⭐⭐⭐⭐
- PBS LearningMedia (K-12 all subjects) — Free ⭐⭐⭐⭐
- PhET Simulations (Science, Math) — CC BY ⭐⭐⭐⭐⭐
- ReadWorks (ELA/Reading) — Free ⭐⭐⭐⭐

**Maine's 8 Content Areas:**
1. English Language Arts (ELA)
2. Mathematics
3. Science & Engineering
4. Social Studies
5. Health & Physical Education
6. Visual & Performing Arts
7. World Languages
8. Life & Career Readiness

### 📚 TRACK 3: Local Career (4 Pathways — Maine CTE)

**Content Volume:** ~400+ lessons with hands-on requirements

| Task | Status | Priority |
|------|--------|----------|
| [ ] Create OSHA 10/30 theory modules | Not Started | High |
| [ ] Create ServSafe prep content | Not Started | Medium |
| [ ] Identify partner facilities in Maine | Not Started | Medium |
| [ ] Build certification tracking system | Schema exists | Medium |
| [ ] Design theory + simulation hybrid approach | Documented | Low |

**Recommended Sources:**
- OSHA Outreach Training — Free (self-study)
- ServSafe study materials — Free (paid exam)
- American Red Cross (CPR/First Aid) — Paid but standard
- CareerTech curriculum frameworks — Free

**Partner Opportunities:**
- Southern Maine Community College (SMCC)
- Eastern Maine Community College (EMCC)
- Maine Maritime Academy
- Maine Building Construction Apprenticeship
- Maine Health (healthcare training)

---

## CONTENT CREATION WORKFLOW

### AI-Generated Content Pipeline:
```
1. Define learning objectives (Maine/industry standards)
2. Generate lesson script via Claude API
3. Expert review (subject matter expert)
4. Convert to TTS audio (OpenAI TTS - already integrated)
5. Create assessment questions (AI + review)
6. Embed in RAG system for AI tutor Q&A
7. Add to Vectorize for semantic search
```

### OER Curation Pipeline:
```
1. Search OER repositories (CK-12, Khan, etc.)
2. Map to Maine Learning Results / CTE standards
3. Create lesson wrapper (intro, context, summary)
4. Link or embed content (respecting license)
5. Create platform-native assessments
6. Track progress through PMERIT system
```

---

## COST ESTIMATES

| Approach | Year 1 Cost | Quality | Time to Launch |
|----------|-------------|---------|----------------|
| 100% OER | ~$0 | Good (variable) | 2-4 months |
| 100% AI-Generated | ~$3,000 | Good (needs review) | 1-3 months |
| Hybrid (RECOMMENDED) | ~$2,000-5,000 | High | 3-6 months |

---

## AI TUTOR COST PROJECTIONS

| Scale | Cost/Month | Strategy |
|-------|------------|----------|
| 1,000 students | $50-100 | Pre-cached TTS, rate-limited AI Q&A |
| 10,000 students | $200-500 | Cached lessons, premium AI for paid users |
| 100,000 students | $2,000-5,000 | Heavy caching, tiered AI access |

**Smart Strategy:** Pre-generate lesson audio (one-time cost), cache common Q&A, only use live AI for novel questions.

---

## FILES MODIFIED (Sessions 38-39)

### Frontend (pmerit-ai-platform)
- assets/js/proctor-controller.js (1,200 lines)
- assets/js/vision-ai.js (680 lines) — NEW
- assets/js/gpu-streaming.js (1,050+ lines) — NEW
- assets/js/config.js — Fixed API_BASE_URL
- assets/js/classroom-session.js — Added guest mode
- portal/classroom.html (+150 lines)
- assets/models/avatars/*.glb — NEW

### Backend (pmerit-api-worker)
- src/routes/exams.ts (~520 lines) — NEW
- src/routes/gpu.ts (~350 lines) — NEW
- src/routes/classroom.ts — Added to git
- src/index.ts — Registered new routes

---

## KEY COMMITS
- Backend: 4636b55, d8ba1b5
- Frontend: ea03cd3, 9340bd8

---

## TEST URLs
- Production: https://pmerit.com
- Classroom: https://pmerit.com/portal/classroom?courseId=989bb541-9272-4e05-828c-a7e18c59dd26
- API Health: https://pmerit-api-worker.peoplemerit.workers.dev/
- GPU Tiers: https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/gpu/tiers

---

## OVERALL PROGRESS

| Phase | Status |
|-------|--------|
| Homepage Gate | ✅ COMPLETE (9/10) |
| Phase 0-3 | ✅ COMPLETE |
| Phase 4 | 🔓 UNLOCKED (Dashboard & Courses) |
| Phase 5 | 🚀 MAJOR PROGRESS (Digital Desk ✅, Avatar ✅) |
| Phase 6 | 🔒 PENDING (Progress & Assessment Integration) |

---

## SEPARATE DOCUMENT CREATED

**Mission Holding Company Formation Guide** — See: `PMERIT_MISSION_HOLDING_COMPANY_FORMATION.md`

Contains complete L3C vs Mission Holding Company analysis, transition steps, and implementation timeline.

---

*End of Handoff — Session 40 Ready*
