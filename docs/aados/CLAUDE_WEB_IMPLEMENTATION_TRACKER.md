# Claude Web Recommendations - Implementation Tracker

**Created:** Session 76 (2025-12-24)
**Source:** `docs/chat-histories/CLAUDE-WEB_SCOPE_DISCUSS_SESSION.md`
**Purpose:** Track all recommendations, ideas, and corrections from the Architect (Claude Web)

---

## Implementation Status Overview

| Priority | Task | Status | Session |
|----------|------|--------|---------|
| P0 | Context-aware model selection | ✅ DONE | 76 |
| P0 | Homework detection patterns | ✅ DONE | 76 |
| P0 | Dual-mode front page AI | ✅ DONE | 76 |
| P1 | Strengthen persona prompts | ⏳ MIGRATION READY | 76 |
| P2 | Frontend grade_code passing | 🔲 PENDING | - |
| P3 | SCOPE_CTE_VOCATIONAL | 🔲 PENDING | - |

---

## 1. DUAL-MODE FRONT PAGE AI (P0) - ✅ COMPLETE

**Implemented:** Session 76 | **Backend Version:** 2.6.0 | **Commit:** `81544c3`

### Test Results (2025-12-24)

| Mode | Input | Result |
|------|-------|--------|
| General Knowledge | "Who is the current US president?" | ✅ "Joe Biden" (direct answer) |
| Platform Questions | "How do I sign up for courses?" | ✅ Step-by-step guide |
| Homework | "Write an essay about the Civil War" | ✅ Redirected to tutor signup |

### Concept
Transform the front page AI from a "receptionist" to a "helpful assistant + receptionist":

```
USER MESSAGE
     │
     ▼
┌─────────────────┐
│ QUERY CLASSIFIER │
└────────┬────────┘
         │
    ┌────┼────┬────────────┐
    │    │    │            │
    ▼    ▼    ▼            ▼
GENERAL  HOMEWORK  PLATFORM  CODING
KNOWLEDGE DETECTED QUESTION  QUESTION
    │       │         │         │
    ▼       ▼         ▼         ▼
ANSWER   REDIRECT   GUIDE    ANSWER
DIRECTLY TO TUTOR  PLATFORM  DIRECTLY
```

### Implementation Tasks

- [ ] Add query classification logic to `/api/v1/ai/chat`
- [ ] Create `classifyQuery()` function with categories:
  - `general_knowledge` - Answer directly (e.g., "Who is the US president?")
  - `homework` - Redirect to tutor (already done!)
  - `platform` - Guide to features
  - `coding` - Answer directly (low cheating risk)
- [ ] Update front page chat prompt to handle general questions
- [ ] Add knowledge cutoff handling (current events)
- [ ] Test with various query types

### Model Selection
- Front page: `@cf/mistralai/mistral-small-3.1-24b-instruct` (efficient)
- All $0 cost on Cloudflare Workers AI

### Success Criteria
- "Who is the US president?" → Direct answer
- "Write my essay" → Redirect to tutor
- "How do I sign up?" → Platform guidance

---

## 2. STRENGTHEN PERSONA PROMPTS (P1) - ⏳ MIGRATION READY

**Status:** Code complete, migration ready to run | **Backend Version:** 2.7.0 | **Commit:** `f5df351`

### Problem
70B model is better than 8B but still not perfectly following persona instructions. Ms. Sunshine responses aren't "warm and playful" enough for K-2.

### Solution: Add Few-Shot Examples

Migration 017 created with:
- `example_interactions` JSONB column added to `ai_tutor_personas`
- 2 example interactions per persona demonstrating ideal style/tone
- Backend code updated to inject examples into system prompt

### Implementation Tasks

- [x] Create Migration 017 to add `example_interactions` column
- [x] Write 2-3 example interactions for each persona
- [x] Update `getPersonaFromDatabase()` to include examples
- [x] Modify system prompt builder to inject examples
- [ ] **NEXT: Run migration on Neon database**
- [ ] Deploy to Cloudflare Workers
- [ ] Test with K-2, 3-5, 6-8, 9-12 queries

### Persona Example Guidelines

| Persona | Tone | Example Style |
|---------|------|---------------|
| Ms. Sunshine | Warm, celebratory | Uses emojis, short sentences, analogies to toys/food |
| Mr. Explorer | Curious, adventurous | "What if...", "Let's discover...", exploration metaphors |
| Coach Jordan | Cool, relatable | Uses "yo", connects to real-world, confident |
| Mentor Alex | Academic, supportive | College-prep focus, career connections |
| Professor Ada | Professional, clear | Adult learner, efficient explanations |
| Coach Mike | Practical, hands-on | CTE focus, workplace scenarios |

---

## 3. FRONTEND GRADE_CODE PASSING (P2)

### Current State
- Backend supports `grade_code` in context
- Frontend (`classroom.js`) doesn't pass it
- All users get default persona

### Implementation Tasks

- [ ] Add `data-grade-code` attribute to classroom page (from user profile)
- [ ] Update `classroom.js` to read grade code
- [ ] Pass `context: { grade_code: "X" }` in tutor API calls
- [ ] Test persona selection end-to-end

### Code Location
```
pmerit-ai-platform/js/classroom.js
pmerit-ai-platform/classroom.html
```

---

## 4. MOOSE INTEGRATION (Future)

### From Claude Web Discussion

MOOSE (Maine Online Opportunities for Sustained Education) offers:
- PreK-12 interdisciplinary modules
- Creative Commons licensed (free, modifiable)
- Aligned to Maine Learning Results
- No login required

### Integration Strategy: Curator Model
- Store MOOSE URLs in `k12_lessons.content_url`
- Store AI context summaries locally (`ai_context` field)
- Link to MOOSE for actual content delivery
- Validate links weekly

### Contact
Jennifer Page (jennifer.page@maine.gov) - MOOSE Project Manager

---

## 5. AGE-APPROPRIATE UI DESIGNS (Future)

### From Claude Web Discussion

| Grade Span | Design Principles |
|------------|-------------------|
| K-2 | Large touch targets, heavy icons, audio support, bright colors, stars/animations |
| 3-5 | Gamification, badges, quests, avatar presence, progress visible |
| 6-8 | Streaks, ranks, XP, goal-setting, cooler aesthetic, dark mode option |
| 9-12 | Professional, GPA tracking, portfolio, college/career focus |

### Implementation
This connects to `SCOPE_K12_EDUCATION` UI requirements. The `get_ui_type_for_grade()` function already returns these tiers.

---

## 6. RAG ARCHITECTURE FOR K-12 (Future)

### From Claude Web Discussion

```
MOOSE Content + Maine Learning Results + Khan Academy (backup)
                        │
                        ▼
            ┌───────────────────────┐
            │ KNOWLEDGE INDEXING    │
            │ - Lesson embeddings   │
            │ - Standard mapping    │
            │ - Prerequisite graph  │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ RETRIEVAL + RANKING   │
            │ - Semantic search     │
            │ - Grade-level filter  │
            │ - MLR alignment score │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ GENERATION (Claude)   │
            │ - Persona prompt      │
            │ - Retrieved context   │
            │ - Scaffolding rules   │
            └───────────────────────┘
```

### Key Decisions (from Claude Web)
- Embedding Model: Cloudflare AI Vectorize (already bound!)
- Chunk Size: 500 tokens (K-2), 1000 tokens (9-12)
- Retrieval Top-K: 3 chunks
- Hallucination Guard: "I don't know" prompt rule

---

## 7. CORRECTIONS & FINDINGS

### Session 75-76 Discoveries

1. **Two Persona Systems Problem** (FIXED)
   - AI Handler Types (assistant/support/tutor) ≠ Database Personas (Ms. Sunshine, etc.)
   - Solution: `getPersonaForContext()` unifies them

2. **Empty system_prompt Column** (FIXED)
   - Migration 016 populated all 6 personas

3. **8B Model Doesn't Follow Personas** (FIXED)
   - Upgraded to 70B for K-12

4. **Version Number Not Updating** (FIXED)
   - Health endpoint was hardcoded, now matches code version

---

## 8. SCOPE FILES TO UPDATE

After implementing each task, update these scope files:

| Task | Scope File |
|------|------------|
| Dual-mode front page | Create `SCOPE_FRONT_PAGE_AI.md` |
| Persona prompts | `SCOPE_AI_PERSONAS.md` |
| Grade code passing | `SCOPE_CLASSROOM.md` |
| CTE Track 3 | `SCOPE_CTE_VOCATIONAL.md` |

---

## Quick Reference: API Endpoints

| Endpoint | Purpose | Model |
|----------|---------|-------|
| `/api/v1/ai/chat` | Front page assistant | 24B Mistral |
| `/api/v1/ai/tutor` | K-12/CTE tutoring | 70B Llama |
| `/api/v1/ai/support` | Platform support | 24B Mistral |

---

*Last Updated: Session 76 (2025-12-24) - P1 code complete, awaiting migration*
