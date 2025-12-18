# PMERIT SUB-SCOPE: External Content Sources

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** PARTIALLY IMPLEMENTED
**Phase:** Content Strategy
**Priority:** P2 - Content Foundation

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | External OER Content Integration (freeCodeCamp, MOOSE, Coursera, etc.) |
| **Strategy** | "Playlist Curator, Not Textbook Writer" |
| **Database Tables** | `content_sources`, `course_external_content`, `user_external_certifications` |
| **Content Types** | Video, Article, Interactive, Quiz (external links) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

External content integration is **PARTIALLY IMPLEMENTED**. Database tables exist (Migration 004) and 9 content sources are seeded. Lesson records can store external URLs, but systematic content curation is not complete.

### What EXISTS

#### Database Tables (Created Session 58)

| Table | Status | Records |
|-------|--------|---------|
| `content_sources` | EXISTS | 9 sources seeded |
| `course_external_content` | EXISTS | Ready for links |
| `user_external_certifications` | EXISTS | Ready for user certs |

#### Seeded Content Sources

| Source | Type | License |
|--------|------|---------|
| freeCodeCamp | Curriculum | BSD-3 |
| Google Career Certificates | Courses | Audit available |
| HubSpot Academy | Courses | Free |
| Khan Academy | Videos | CC BY-NC-SA |
| The Odin Project | Curriculum | MIT |
| Coursera | Courses | Varies |
| YouTube | Videos | Standard |
| CK-12 | Textbooks | CC BY-NC |
| MOOSE (Maine DOE) | K-12 Curriculum | State-funded |

#### Lesson External Content Support

| Field | Status | Notes |
|-------|--------|-------|
| `lessons.content_url` | EXISTS | Can store external URL |
| `lessons.content_source` | EXISTS | Can reference source |
| `lessons.external_provider` | EXISTS | Provider name |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Content mapping complete | PARTIAL | Not all lessons have URLs |
| Link validation | NOT BUILT | Dead links not detected |
| MOOSE integration | NOT BUILT | K-12 content not linked |
| Content refresh automation | NOT BUILT | No periodic validation |
| External cert tracking | NOT BUILT | User certs not captured |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

*Source: PMERIT_ARCHITECTURE_FINAL.md §6*

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| CS-001 | Content Strategy | Curator, not creator | Leverage existing quality OER | 43 |
| CS-002 | Primary Source (Track 1) | freeCodeCamp | Free, comprehensive, career-focused | 43 |
| CS-003 | Primary Source (Track 2) | MOOSE | Maine-aligned, state-funded | 43 |
| CS-004 | Primary Source (Track 3) | OSHA Education | Authoritative, free | 43 |
| CS-005 | AI Context | Store locally | AI tutor always has context | 43 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §6*

### Content Curation Philosophy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PMERIT CONTENT STRATEGY                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "Playlist Curator, Not Textbook Writer"                            │
│                                                                     │
│  PMERIT does NOT create original content.                           │
│  PMERIT CURATES and WRAPS existing quality OER content.             │
│                                                                     │
│  What we CURATE:                                                    │
│  • Video lessons from YouTube, Coursera, Khan Academy               │
│  • Interactive exercises from freeCodeCamp, CK-12                   │
│  • Reading materials from open sources                              │
│  • Assessments from existing question banks                         │
│                                                                     │
│  What we ADD (the PMERIT layer):                                    │
│  • AI Tutoring integration                                          │
│  • Progress tracking                                                │
│  • Unified learning path                                            │
│  • Credentials and certificates                                     │
│  • Personalized recommendations                                     │
│                                                                     │
│  Result: High-quality content + AI tutoring + credentials           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Content Sources by Track

| Track | Primary Source | Secondary Sources | PMERIT Adds |
|-------|----------------|-------------------|-------------|
| **Track 1: Global Remote** | freeCodeCamp | Odin Project, Kaggle, Google Certs | AI Tutor, Portfolio Projects, Credentials |
| **Track 2: K-12 Education** | MOOSE (Maine DOE) | Khan Academy, CK-12, EngageNY | Age-appropriate AI, Assessments, Parent Portal |
| **Track 3: CTE/Vocational** | OSHA Education | CareerOneStop, SkillsCommons | Safety-focused AI, Pre-apprenticeship Prep |

### Source Quality Criteria

| Criterion | Weight | Evaluation |
|-----------|--------|------------|
| **Quality** | 30% | Accuracy, depth, production value |
| **Alignment** | 25% | Fits curriculum structure |
| **Licensing** | 20% | OER-compliant, legally usable |
| **Accessibility** | 15% | Easy to embed/link, stable URLs |
| **Longevity** | 10% | Stable organization, maintained |

### Content Integration Pattern

```javascript
// Lesson record with external content
{
  lesson_id: "uuid",
  title: "Introduction to HTML",
  description: "Learn the basics of HTML structure",
  lesson_type: "video",

  // External content link
  content_url: "https://www.youtube.com/watch?v=xxx",
  content_source: "youtube",
  external_provider: "Traversy Media",

  // Local AI context (always available)
  ai_context: `
    This lesson covers HTML basics:
    - Document structure (DOCTYPE, html, head, body)
    - Common tags (h1-h6, p, a, img, div, span)
    - Attributes (href, src, class, id)
    - Semantic HTML5 elements

    Key concepts to reinforce:
    - Nesting and hierarchy
    - Opening vs closing tags
    - Self-closing tags
  `,

  estimated_minutes: 15,
  sequence_order: 1
}
```

### AI Context Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI CONTEXT PATTERN                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WHY: External content may go offline or change.                    │
│  AI tutor needs context even if video unavailable.                  │
│                                                                     │
│  WHAT TO STORE:                                                     │
│  • Key concepts covered in the lesson                               │
│  • Learning objectives                                              │
│  • Common misconceptions to address                                 │
│  • Practice problems/examples                                       │
│  • Related topics for follow-up                                     │
│                                                                     │
│  BENEFIT:                                                           │
│  • AI can discuss lesson even if link broken                        │
│  • AI can quiz student on content                                   │
│  • AI can relate to other lessons                                   │
│  • Resilient to external changes                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Database Schema (Existing)

```sql
-- Content sources (seeded)
content_sources (
    source_id UUID PRIMARY KEY,
    name VARCHAR(100), -- 'freeCodeCamp'
    slug VARCHAR(100),
    url VARCHAR(500),
    license_type VARCHAR(50), -- 'BSD-3', 'CC BY-NC-SA', etc.
    attribution_required BOOLEAN,
    api_available BOOLEAN,
    notes TEXT
);

-- Course to external content mapping
course_external_content (
    id UUID PRIMARY KEY,
    course_id UUID REFERENCES courses(id),
    source_id UUID REFERENCES content_sources(source_id),
    external_url TEXT,
    content_type VARCHAR(50), -- 'curriculum', 'video', 'article'
    is_primary BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMPTZ
);

-- User external certifications (from Coursera, Google, etc.)
user_external_certifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    source_id UUID REFERENCES content_sources(source_id),
    certification_name VARCHAR(200),
    credential_url TEXT,
    earned_at TIMESTAMPTZ,
    verified BOOLEAN DEFAULT FALSE
);
```

### Link Validation Script (Proposed)

```javascript
// scripts/validate-content-links.js
async function validateContentLinks() {
  const lessons = await db.query(`
    SELECT lesson_id, title, content_url
    FROM lessons
    WHERE content_url IS NOT NULL
  `);

  const results = {
    valid: [],
    broken: [],
    redirected: []
  };

  for (const lesson of lessons) {
    try {
      const response = await fetch(lesson.content_url, { method: 'HEAD' });
      if (response.ok) {
        results.valid.push(lesson);
      } else if (response.status >= 300 && response.status < 400) {
        results.redirected.push({ ...lesson, newUrl: response.headers.get('location') });
      } else {
        results.broken.push({ ...lesson, status: response.status });
      }
    } catch (error) {
      results.broken.push({ ...lesson, error: error.message });
    }
  }

  // Log results, send alerts for broken links
  console.log(`Valid: ${results.valid.length}`);
  console.log(`Broken: ${results.broken.length}`);
  console.log(`Redirected: ${results.redirected.length}`);

  return results;
}
```

---

## 5. RESEARCH_FINDINGS

### Session 58 (2025-12-17)

**Migration 004 Applied:**
- Created `content_sources` table
- Created `course_external_content` table
- Created `user_external_certifications` table
- Seeded 9 content sources

**Content Sources Investigation:**
- freeCodeCamp: Excellent for Web Dev, BSD-3 license
- MOOSE: Requires partnership conversation with Maine DOE
- Google Career Certs: Audit mode available on Coursera

### MOOSE Partnership Opportunity

| Detail | Information |
|--------|-------------|
| **URL** | learnwithmoose.maine.gov |
| **Contact** | Jennifer Page (jennifer.page@maine.gov) |
| **Status** | State-funded, publicly available |
| **Opportunity** | Become recognized delivery platform |
| **Pitch** | "PMERIT extends Maine's educational excellence globally through AI tutoring" |

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | External content providers | freeCodeCamp, MOOSE, etc. |
| **Enables** | SCOPE_courses | Course content from external sources |
| **Enables** | SCOPE_K12_EDUCATION | MOOSE content for Track 2 |
| **Enables** | SCOPE_CTE_VOCATIONAL | OSHA content for Track 3 |
| **Enables** | SCOPE_CLASSROOM | External content displayed |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Content Mapping
- [ ] All Track 1 courses have external content URLs
- [ ] AI context created for each lesson
- [ ] Content sources properly attributed
- [ ] License compliance documented

### Phase 2: Validation
- [ ] Link validation script created
- [ ] Weekly validation runs
- [ ] Broken link alerts sent
- [ ] Fallback content strategy defined

### Phase 3: K-12 Integration
- [ ] MOOSE content mapped to grade/subject
- [ ] Maine Learning Results alignment documented
- [ ] Parent-friendly content descriptions
- [ ] Age-appropriate content filtering

### Phase 4: User Certifications
- [ ] Users can add external certifications
- [ ] Verification flow for external certs
- [ ] Display on user profile/credentials

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 43 | 2025-12-09 | Content strategy defined |
| 58 | 2025-12-17 | Migration 004, 9 sources seeded |
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
