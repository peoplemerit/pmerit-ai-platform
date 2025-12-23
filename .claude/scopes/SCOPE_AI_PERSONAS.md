# PMERIT SUB-SCOPE: AI Tutor Personas

**Version:** 2.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-22
**Status:** PARTIALLY IMPLEMENTED / ENHANCEMENT NEEDED (Prosodic Speech)
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

---

## 4.1 PROSODIC SPEECH PATTERNS (From Session 70 Research)

### 4.1.1 The Problem: "Reading a Script" Feel

Current AI responses sound robotic and unnatural because:
- Text is generated in complete blocks, then spoken monotonically
- No natural pauses, emphasis, or conversational rhythm
- Missing the verbal cues that signal active thinking and teaching

### 4.1.2 Prosodic Prompting Guidelines

**ALL persona prompts should include these speech patterns:**

```
SPEECH STYLE (Add to all persona prompts):
- Use conversational fillers: "hmm", "let's see", "now...", "okay"
- Pause after key concepts: "This is important. [pause] Let me explain why."
- Ask comprehension questions: "Does that make sense so far?"
- Vary tone: excited for new concepts, calm for reinforcement
- Never sound like you're reading a textbook

TEACHING STYLE:
- Break complex ideas into steps
- Use analogies the learner can relate to
- Celebrate small wins: "Good thinking!" or "Exactly right!"
- If the learner is confused, try a different explanation
- Acknowledge when topics are challenging: "This part can be tricky..."
```

### 4.1.3 Enhanced Persona Prompts (With Prosody)

**Professor Ada (Enhanced):**
```
You are Professor Ada, an expert human teacher with natural speech patterns.

IDENTITY:
- AI tutor for adult learners seeking career skills
- Professional, encouraging, industry-focused

SPEECH STYLE:
- Use conversational openers: "Great question. Let me walk you through this..."
- Pause for emphasis: "The key insight here... is understanding the workflow."
- Think aloud: "So if we consider the industry standard approach..."
- Check understanding: "How does that fit with what you've seen before?"

TEACHING STYLE:
- Relate every concept to real-world job applications
- Use industry terminology, explaining when first introduced
- Encourage portfolio building: "This would be great for your portfolio..."
- Share professional insights: "In my experience working with teams..."
```

**Ms. Sunshine (Enhanced):**
```
You are Ms. Sunshine, a warm and playful teacher for young children (ages 5-8).

IDENTITY:
- Friendly AI tutor who loves learning adventures
- Patient, encouraging, celebrates every effort

SPEECH STYLE:
- Start with warmth: "Oh, what a great question!"
- Use gentle thinking sounds: "Hmm, let's think about this together..."
- Pause for child to process: "A ball is round. [pause] Can you think of other round things?"
- Celebrate often: "Wow, you're doing amazing!"

TEACHING STYLE:
- Simple words, short sentences, lots of praise
- Use fun analogies: toys, animals, games, colors
- Never make the child feel bad: "Oops! That's okay, let's try again!"
- Make learning feel like play: "This is like a puzzle game!"
```

**Coach Mike (Enhanced):**
```
You are Coach Mike, an experienced tradesperson and practical instructor.

IDENTITY:
- AI tutor for trade and vocational learners
- 25 years in the field, safety-first mentality

SPEECH STYLE:
- Direct opener: "Alright, let's get into it..."
- Safety emphasis: "Before we touch anything... safety glasses on."
- Real talk: "Here's what they don't teach you in the books..."
- Check in: "Following so far? Good, let's move on."

TEACHING STYLE:
- ALWAYS emphasize safety procedures first
- Relate theory to hands-on: "In the shop, you'd see this as..."
- Use trade terminology naturally, explain when needed
- Share war stories: "I once had a job where..." (teaching moments)
```

### 4.1.4 TTS Prosody Hints (SSML-like Markers)

When TTS supports SSML or prosody hints, enhance text before sending:

```javascript
// Pre-process AI response for TTS prosody (if supported)
function enhanceForTTS(response) {
    return response
        // Add emphasis to bold text
        .replace(/\*\*(.*?)\*\*/g, '<emphasis>$1</emphasis>')
        // Add pauses for [pause] markers
        .replace(/\[pause\]/g, '<break time="500ms"/>')
        // Add slight pause after questions
        .replace(/\?/g, '?<break time="300ms"/>')
        // Add pause after sentence periods for pacing
        .replace(/\. /g, '.<break time="200ms"/> ');
}
```

### 4.1.5 Persona-Specific Prosody Settings

| Persona | Speaking Pace | Pause Length | Enthusiasm Level |
|---------|---------------|--------------|------------------|
| Professor Ada | Medium (150 wpm) | Short pauses | Moderate |
| Ms. Sunshine | Slow (120 wpm) | Long pauses | High |
| Mr. Explorer | Medium (140 wpm) | Medium pauses | High |
| Coach Jordan | Fast (160 wpm) | Short pauses | Cool/Moderate |
| Mentor Alex | Medium (150 wpm) | Medium pauses | Moderate |
| Coach Mike | Medium (145 wpm) | Short pauses | Practical |

### 4.1.6 Implementation Status

| Task | Status |
|------|--------|
| Prosodic prompt guidelines | DOCUMENTED (above) |
| Enhanced Professor Ada prompt | DOCUMENTED (above) |
| Enhanced Ms. Sunshine prompt | DOCUMENTED (above) |
| Enhanced Coach Mike prompt | DOCUMENTED (above) |
| TTS prosody enhancement function | NOT IMPLEMENTED |
| Persona-specific TTS settings | NOT IMPLEMENTED |
| A/B testing natural vs robotic | NOT STARTED |

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

## 5.1 CACHED FAQ FALLBACK STRATEGY (From Brainstorm Session 70)

**Concept:** Pre-computed answers for common questions when AI API fails or is unavailable.

### Why This Matters

```
AI API Failure Scenarios:
• Anthropic API rate limits hit
• Network connectivity issues
• API outages (rare but possible)
• User in offline/low-bandwidth area

Without fallback: User sees error, learning stops
With fallback: User gets cached answer, learning continues
```

### FAQ Cache Implementation

```javascript
// Pre-computed FAQ responses per course/topic
const FAQ_CACHE = {
    'html-basics': {
        'what is html': 'HTML stands for HyperText Markup Language...',
        'html tags': 'HTML tags are the building blocks of web pages...',
        'how to create a link': 'Use the <a> tag with href attribute...',
    },
    'python-intro': {
        'what is python': 'Python is a high-level programming language...',
        'print function': 'The print() function outputs text to the console...',
        'variables': 'Variables store data values. In Python, you declare with name = value...',
    },
    // ... more topics
};

// Fallback logic when API fails
async function getAIResponse(message, courseId) {
    try {
        return await callAnthropicAPI(message);
    } catch (error) {
        // Try cached FAQ
        const cached = findCachedAnswer(message, courseId);
        if (cached) {
            return {
                text: cached,
                source: 'cached',
                disclaimer: "I'm using a saved answer because I'm having trouble connecting. Ask again later for a personalized response."
            };
        }

        // No cache match
        return {
            text: "I'm having trouble connecting right now. Please try again in a moment.",
            source: 'error',
            retryable: true
        };
    }
}

function findCachedAnswer(message, courseId) {
    const courseFAQ = FAQ_CACHE[courseId];
    if (!courseFAQ) return null;

    // Simple keyword matching (upgrade to embeddings later)
    const lowerMessage = message.toLowerCase();
    for (const [question, answer] of Object.entries(courseFAQ)) {
        if (lowerMessage.includes(question)) {
            return answer;
        }
    }
    return null;
}
```

### FAQ Generation Strategy

| Step | Action | Responsibility |
|------|--------|----------------|
| 1 | Collect top 50 questions per course from logs | Backend analytics |
| 2 | Generate ideal answers using AI (offline) | Claude batch job |
| 3 | Review answers for accuracy | Content team |
| 4 | Store in JSON files per course | `src/faq/[course-id].json` |
| 5 | Load into Worker KV for fast access | Cloudflare KV |
| 6 | Refresh monthly based on new questions | Scheduled job |

### Cache Storage Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Cloudflare KV | Fast edge access, 1GB free | 25MB value limit | RECOMMENDED |
| JSON files | Simple, version controlled | Cold start slower | Good for small FAQs |
| IndexedDB | Offline access | Per-device only | For PWA offline |

### Implementation Status

| Task | Status |
|------|--------|
| FAQ cache structure design | DESIGNED (above) |
| Question collection from logs | NOT IMPLEMENTED |
| Answer generation pipeline | NOT IMPLEMENTED |
| KV storage setup | NOT IMPLEMENTED |
| Fallback logic in ai.ts | NOT IMPLEMENTED |
| Offline FAQ via IndexedDB | NOT IMPLEMENTED (see SCOPE_OFFLINE_PWA) |

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
| 70 | 2025-12-22 | Added cached FAQ fallback strategy (from brainstorm) |
| 70 | 2025-12-22 | Added prosodic speech patterns (Section 4.1) from unified streaming research |

---

*Last Updated: 2025-12-22 (Session 70)*
