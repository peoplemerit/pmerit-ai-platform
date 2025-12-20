# PMERIT Platform - Demo Guide & Feature Walkthrough

**Confidential**
**Prepared:** December 2025
**Version:** 1.0

---

## DEMO OVERVIEW

**Production URL:** https://pmerit.com
**API Endpoint:** https://pmerit-api-worker.peoplemerit.workers.dev

**Demo Duration:** 30-45 minutes
**Recommended Browser:** Chrome, Firefox, or Safari (latest)

---

## PRE-DEMO CHECKLIST

- [ ] Stable internet connection
- [ ] Browser with DevTools access (optional)
- [ ] Test account credentials (provided separately)
- [ ] Screen sharing enabled
- [ ] Mobile device for responsive demo (optional)

---

## DEMO SCRIPT

### Part 1: Homepage & AI Chat (5-7 minutes)

#### 1.1 Landing Page Experience

**Navigate to:** https://pmerit.com

**Highlight:**
- Clean, Google-style minimal design
- Dark/light theme toggle (top right)
- Mobile-responsive layout
- Professional branding

**Key Elements to Show:**
1. **Hero Section** - "Accessible Global Education" messaging
2. **AI Chatbox** - Central, prominent placement
3. **Left Sidebar** - Quick action buttons
4. **Language Selector** - 40+ languages

#### 1.2 AI Chat Demonstration

**Action:** Type in the chatbox: "What career would be good for someone who likes helping people?"

**Expected Response:** AI (Gabriel persona) provides helpful career suggestions with context.

**Follow-up:** "Tell me more about healthcare careers"

**Highlight:**
- Streaming response (real-time)
- Contextual follow-up understanding
- Career-focused guidance
- Professional, helpful tone

#### 1.3 Customer Service Mode

**Action:** Click "Customer Service" in left sidebar

**Expected:** AI switches to support persona (Alex)

**Demo Query:** "I'm having trouble logging in"

**Highlight:**
- Distinct persona with support focus
- Problem-solving approach
- Helpdesk-style responses

---

### Part 2: Assessment Pipeline (10-12 minutes)

#### 2.1 Assessment Entry

**Navigate to:** Click "Begin Assessment" or go to /assessment-entry.html

**Highlight:**
1. **Welcome Hero** - Clear value proposition
2. **What to Expect** - 5-step timeline visualization
3. **Privacy & Consent** - GDPR-ready consent flow
4. **Begin Button** - Only enabled after consent

**Action:** Check both required consent boxes, click "Begin Assessment"

#### 2.2 Assessment Questions

**Navigate to:** Automatically redirected to /assessment-questions.html

**Highlight:**
1. **Progress Bar** - Shows 0 of 120
2. **Section Indicators** - Big Five traits (O, C, E, A, N)
3. **Question Display** - Clear, readable format
4. **Answer Scale** - 5-point Likert (Very Inaccurate → Very Accurate)

**Demo Actions:**
- Answer 5-10 questions to show progress
- Show auto-save feature (answers persist if page refreshed)
- Point out section transitions

**Note:** For full demo, use a pre-completed assessment to skip to results.

#### 2.3 Assessment Results

**Navigate to:** /assessment-results.html (with completed session)

**Highlight:**
1. **Big Five Scores** - Radar chart visualization
   - Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
   - Percentile rankings
   - Facet breakdowns

2. **Holland Code** - RIASEC display
   - Three-letter code (e.g., "AIS")
   - Score breakdown chart

3. **Career Matches** - Top 10 recommendations
   - Match percentage
   - Salary ranges (BLS data)
   - Growth outlook
   - Education requirements

4. **AI Insights** - Personalized analysis
   - Strengths summary
   - Career recommendations
   - Learning path suggestions

5. **Export Options** - PDF download (if implemented)

---

### Part 3: Learning Platform (8-10 minutes)

#### 3.1 Learning Pathways

**Navigate to:** /pathways.html

**Highlight:**
1. **Three-Track Model:**
   - Global Remote (6 career pathways)
   - Local Education (K-12)
   - Local Career (Vocational)

2. **Pathway Cards:**
   - Title and description
   - Salary range ($65K - $112K format)
   - Career outcomes
   - Duration and commitment hours
   - BLS data integration

3. **Program Finder** - Track selector tabs

**Action:** Click on "Data Analytics" pathway

#### 3.2 Course Catalog

**Navigate to:** /courses.html

**Highlight:**
1. **Filter System** - By pathway, difficulty, category
2. **Course Cards:**
   - Title and description
   - Instructor name
   - Estimated hours
   - Free/Premium badge
   - Enrollment count

3. **Search Functionality** - Filter by keyword

**Action:** Click on a course to view details

#### 3.3 Course Detail Page

**Navigate to:** /course.html?id=[course_id]

**Highlight:**
1. **Course Overview** - Full description
2. **Module List** - Course structure
3. **Enrollment Button** - CTA
4. **Prerequisites** - If any
5. **Learning Outcomes** - What you'll learn

---

### Part 4: Dashboard & User Portal (5-7 minutes)

#### 4.1 Sign Up / Login

**Navigate to:** Click "Sign In" or any protected action

**Highlight:**
1. **Auth Modal** - Professional design
2. **Tab Switching** - Sign Up / Sign In
3. **Form Validation** - Real-time
4. **Password Toggle** - Show/hide

**Action:** Login with test credentials (or create new account)

#### 4.2 Student Dashboard

**Navigate to:** /dashboard.html (after login)

**Highlight:**
1. **Welcome Section** - Personalized greeting
2. **My Courses** - Enrolled courses with progress
3. **Quick Actions** - Resume learning, explore, settings
4. **Progress Overview** - Overall completion stats
5. **Recommended** - Based on assessment (if completed)

**Action:** Click "Enter Classroom" on an enrolled course

#### 4.3 Virtual Classroom

**Navigate to:** /portal/classroom.html

**Highlight:**
1. **3D Avatar** - AI tutor visual representation
2. **Content Area** - Lesson display
3. **Chat Interface** - Ask questions to AI tutor
4. **Navigation** - Previous/Next lesson buttons
5. **Progress Tracking** - Session time, completion

**Demo the AI Tutor:**
- Type: "Can you explain this concept in simpler terms?"
- Show avatar response with TTS (if enabled)

---

### Part 5: Advanced Features (5-7 minutes)

#### 5.1 Text-to-Speech Demo

**Location:** Any page with AI responses

**Action:** Enable TTS in settings or click speaker icon

**Highlight:**
- Multiple voice options
- Free voices (Edge TTS)
- Premium voices (Piper TTS - subscription)
- Natural speech synthesis

#### 5.2 Multi-Language Support

**Action:** Click language selector (globe icon)

**Highlight:**
1. **40+ Languages** - Comprehensive list
2. **Offline Languages** - English, Yoruba, Igbo, Hausa
3. **Search Filter** - Find languages quickly
4. **Instant Switch** - UI updates immediately

**Demo:** Switch to Spanish or another language, show UI translation

#### 5.3 Dark Mode

**Action:** Toggle theme switch (sun/moon icon)

**Highlight:**
- Full dark theme implementation
- System preference detection
- Persistent preference storage
- Consistent across all pages

#### 5.4 Mobile Responsiveness

**Action:** Resize browser or show on mobile device

**Highlight:**
- Hamburger menu
- Touch-friendly buttons
- Readable content
- Functional on all screen sizes

---

### Part 6: Admin Portal (3-5 minutes)

#### 6.1 Admin Access

**Navigate to:** /admin/index.html (requires admin account)

**Highlight:**
1. **Two-Tier System:**
   - Tier 1: System administrators
   - Tier 2: Content administrators

2. **Admin Dashboard:**
   - User statistics
   - Content overview
   - System health

#### 6.2 User Management (Tier 1)

**Navigate to:** /admin/tier1.html

**Highlight:**
- User list with pagination
- Role management
- Audit log viewing
- User search/filter

#### 6.3 Content Management (Tier 2)

**Navigate to:** /admin/tier2.html

**Highlight:**
- Course CRUD operations
- Module management
- Lesson editing
- Content organization

---

### Part 7: API Demonstration (Optional, 3-5 minutes)

#### 7.1 Health Check

**Endpoint:** GET https://pmerit-api-worker.peoplemerit.workers.dev/

**Response:** Shows API version, status, available endpoints

#### 7.2 Pathways API

**Endpoint:** GET /api/v1/pathways

**Response:** JSON array of 14 pathways with full metadata

#### 7.3 AI Chat API

**Endpoint:** POST /api/v1/ai/chat

**Payload:**
```json
{
  "messages": [
    {"role": "user", "content": "What careers are good for creative people?"}
  ]
}
```

**Response:** Streaming AI response

---

## DEMO TALKING POINTS

### Value Propositions to Emphasize

1. **Free Forever Core**
   - "All courses remain free for all users, always"
   - "Premium enhances but never gates learning"

2. **AI-Native Design**
   - "5 specialized AI personas"
   - "Not just chatbot - contextual tutor"

3. **Global Accessibility**
   - "40+ languages from day one"
   - "Designed for developing nations"

4. **Validated Assessment**
   - "Based on IPIP-NEO psychometric instrument"
   - "500+ careers with BLS salary data"

5. **Unique Avatar Technology**
   - "3D animated tutor with lip-sync"
   - "Comparable to Synthesia/HeyGen"

6. **Scalable Architecture**
   - "Serverless = unlimited scale"
   - "Global edge distribution"

### Common Questions & Answers

**Q: How is this different from Coursera/Udemy?**
A: Free-first model, AI tutor throughout, validated career assessment, 3D avatar engagement

**Q: What about the business model?**
A: Sustainable freemium - premium AI/voices, corporate sponsorships, donations

**Q: How does the AI work?**
A: Cloudflare Workers AI with Llama 3.1, RAG for career knowledge, 5 specialized personas

**Q: Is it really free?**
A: Yes - core education always free. Premium for advanced AI, verified certs, no retry fees

**Q: What's the tech stack?**
A: Cloudflare ecosystem (Pages, Workers, AI, Vectorize), Neon PostgreSQL, TypeScript

---

## TROUBLESHOOTING

### Common Issues

| Issue | Solution |
|-------|----------|
| Page not loading | Check internet, try different browser |
| AI not responding | API may be rate-limited, wait 30 seconds |
| TTS not working | Check browser audio permissions |
| Login failing | Clear cookies, use incognito window |
| Mobile layout broken | Force refresh (Ctrl+Shift+R) |

### Demo Environment Reset

If needed, clear browser data:
1. Clear cookies for pmerit.com
2. Clear localStorage
3. Refresh page

---

## POST-DEMO NEXT STEPS

1. **Technical Review** - Access to GitHub repos
2. **Financial Review** - Detailed projections document
3. **Due Diligence** - Full documentation package
4. **Follow-up Call** - Q&A session
5. **Proposal** - LOI or term sheet discussion

---

## CONTACT

For demo scheduling or questions:
[Contact Information to be Added]

---

*Demo guide prepared for potential acquirers and investors.*
*Confidential - Do not distribute without authorization.*
