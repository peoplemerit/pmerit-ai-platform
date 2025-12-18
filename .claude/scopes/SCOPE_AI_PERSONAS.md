# PMERIT SUB-SCOPE: AI Tutor Personas

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** PARTIALLY IMPLEMENTED
**Phase:** Core AI Feature
**Priority:** P1 - Differentiated Learning Experience

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Age-Appropriate AI Tutor Personas by Track/Grade |
| **System** | AI Chat with persona-based system prompts |
| **API Endpoints** | `/api/v1/ai/chat` (existing) |
| **Backend Files** | `src/routes/ai.ts`, `src/prompts/*.json` (TBD) |
| **Frontend** | Avatar component in classroom |
| **TTS Integration** | Voice per persona via SCOPE_TTS |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

The AI persona system is **PARTIALLY IMPLEMENTED**. A single AI tutor (Professor Ada) works in the classroom. The architecture for 6 different personas exists in documentation but is not fully implemented.

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| AI Chat API | WORKING | `/api/v1/ai/chat` functional |
| Single persona (Ada) | WORKING | Professional tone for Track 1 |
| Avatar display | WORKING | classroom.html shows avatar |
| TTS for avatar | WORKING | Speaks responses aloud |
| System prompt | PARTIAL | Hardcoded, not persona-aware |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Persona selection logic | NOT BUILT | All users get same persona |
| Grade-based persona switching | NOT BUILT | K-12 gets adult tone |
| Persona prompt templates | NOT BUILT | Single hardcoded prompt |
| Persona-specific voices | NOT BUILT | Same TTS voice for all |
| Persona avatars | NOT BUILT | Same avatar image for all |

### Current AI Flow

```
1. User sends message in classroom
2. Frontend calls POST /api/v1/ai/chat
3. Backend uses hardcoded system prompt
4. Claude API responds
5. Response displayed + TTS speaks
```

**Missing:** Persona detection based on track/grade/course

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| AI-001 | AI Provider | Anthropic Claude | Best reasoning, safety | 30 |
| AI-002 | Persona count | 6 personas | Cover all tracks/ages | 43 |
| AI-003 | Persona selection | Track + Grade-based | Automatic, contextual | 43 |
| AI-004 | Prompt storage | JSON files in /prompts | Easy to edit, version | 43 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §8*

### 6 AI Tutor Personas

| Persona | Track | Age Group | Tone | Voice |
|---------|-------|-----------|------|-------|
| **Professor Ada** | Track 1 (Global Remote) | Adults | Professional, mentor-like | Female, mature |
| **Ms. Sunshine** | Track 2 (K-2) | Ages 5-8 | Playful, encouraging | Female, warm |
| **Mr. Explorer** | Track 2 (3-5) | Ages 8-11 | Curious, supportive | Male, friendly |
| **Coach Jordan** | Track 2 (6-8) | Ages 11-14 | Relatable, guiding | Gender-neutral, cool |
| **Mentor Alex** | Track 2 (9-12) | Ages 14-18 | Academic, preparing | Gender-neutral, serious |
| **Coach Mike** | Track 3 (CTE) | Adults | Practical, hands-on | Male, experienced |

### Persona Selection Logic

```javascript
function selectPersona(user, course) {
  const trackType = course.track_type;

  if (trackType === 'global_remote') {
    return 'professor_ada';
  }

  if (trackType === 'local_career') {
    return 'coach_mike';
  }

  if (trackType === 'local_education') {
    const gradeSpan = course.grade_span;
    switch (gradeSpan) {
      case 'K-2': return 'ms_sunshine';
      case '3-5': return 'mr_explorer';
      case '6-8': return 'coach_jordan';
      case '9-12': return 'mentor_alex';
      default: return 'mentor_alex';
    }
  }

  return 'professor_ada'; // Default
}
```

### Persona Prompt Templates

```
/src/prompts/
├── professor_ada.json      # Track 1: Professional adult mentor
├── ms_sunshine.json        # K-2: Playful, simple language
├── mr_explorer.json        # 3-5: Curious, discovery-based
├── coach_jordan.json       # 6-8: Relatable, teen-friendly
├── mentor_alex.json        # 9-12: Academic, college-prep
└── coach_mike.json         # Track 3: Practical, safety-focused
```

### Example Persona Prompts

**Professor Ada (Track 1 - Adults):**
```
You are Professor Ada, an AI tutor for adult learners seeking career skills.
Tone: Professional, encouraging, industry-focused.
Communication: Concise, practical, career-oriented.
Always relate concepts to real-world job applications.
Use industry terminology appropriately.
Encourage portfolio building and project-based learning.
```

**Ms. Sunshine (K-2):**
```
You are Ms. Sunshine, a friendly AI tutor for young children (ages 5-8).
Tone: Playful, warm, encouraging, patient.
Communication: Simple words, short sentences, lots of praise.
Use fun analogies children understand (toys, animals, games).
Celebrate every small win enthusiastically.
Never make the child feel bad for wrong answers.
Use emojis sparingly but appropriately.
```

**Coach Mike (Track 3 - CTE):**
```
You are Coach Mike, an AI tutor for trade and vocational learners.
Tone: Practical, direct, experienced, safety-conscious.
Communication: Clear instructions, real-world examples.
ALWAYS emphasize safety procedures first.
Relate theory to hands-on applications.
Use trade terminology and explain when needed.
Share practical tips from "years of experience."
```

### Avatar Visual Requirements

| Persona | Avatar Style | Primary Color |
|---------|--------------|---------------|
| Professor Ada | Professional woman, business attire | Navy blue |
| Ms. Sunshine | Friendly cartoon character, bright | Yellow/Orange |
| Mr. Explorer | Animated explorer with hat | Green |
| Coach Jordan | Modern teen-style character | Purple |
| Mentor Alex | Young professional, casual | Teal |
| Coach Mike | Tradesperson with safety gear | Orange/Gray |

### TTS Voice Mapping

| Persona | TTS Voice | Characteristics |
|---------|-----------|-----------------|
| Professor Ada | primo-female | Mature, professional |
| Ms. Sunshine | TBD | Warm, cheerful |
| Mr. Explorer | TBD | Friendly, curious |
| Coach Jordan | TBD | Cool, relatable |
| Mentor Alex | TBD | Clear, academic |
| Coach Mike | primo-male | Experienced, practical |

---

## 5. RESEARCH_FINDINGS

### Current Implementation (Session 62)

**ai.ts current system prompt:**
```typescript
const systemPrompt = `You are an AI tutor for PMERIT...`
// Single hardcoded prompt, no persona awareness
```

**Required changes:**
1. Load persona from course/user context
2. Load persona prompt from JSON file
3. Inject persona into system message
4. Pass persona to TTS for voice selection

### Integration Points

| Component | Change Needed |
|-----------|---------------|
| `/api/v1/ai/chat` | Accept `personaId` or detect from `courseId` |
| `classroom.js` | Pass course context to AI chat |
| TTS endpoint | Accept voice parameter from persona |
| Avatar component | Load persona-specific avatar image |

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_CLASSROOM | Persona displayed in classroom |
| **Requires** | SCOPE_TTS | Voice per persona |
| **Requires** | SCOPE_courses | Course determines track/grade |
| **Requires** | SCOPE_K12_EDUCATION | Grade spans define child personas |
| **Enables** | Age-appropriate learning | Right tone for right age |
| **Enables** | Track differentiation | Career vs K-12 vs CTE |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Persona Infrastructure
- [ ] Persona prompt templates created (6 files)
- [ ] Persona selection function implemented
- [ ] AI chat accepts courseId/personaId
- [ ] Correct persona loaded based on course

### Phase 2: Persona Integration
- [ ] Avatar image changes per persona
- [ ] TTS voice changes per persona
- [ ] K-2 students get Ms. Sunshine
- [ ] Track 3 students get Coach Mike
- [ ] Track 1 adults get Professor Ada

### Phase 3: Persona Refinement
- [ ] Persona prompts refined based on user feedback
- [ ] A/B testing different persona approaches
- [ ] Persona effectiveness metrics tracked
- [ ] Age-appropriate content filtering per persona

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 30 | 2025-12-04 | AI chat implemented (single persona) |
| 43 | 2025-12-09 | 6 personas specified in architecture |
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
