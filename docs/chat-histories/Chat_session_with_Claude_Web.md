SCOPE_TTS.mdmdPMERIT CONTINUE Please review: I have completed the TTS with Claude Code.Dec 157 stepsCheck current task tracker statusShow working fileAssessed TTS completion status and identified remaining integration tasks.16sI now have a good picture of what's going on. The SCOPE_TTS.md document shows that Sessions 52-56 completed significant TTS work, but the TASK_TRACKER and STATE.json haven't been updated to reflect this (they're still from Session 43).
Let me summarize what the TTS completion means:
TTS System Status (from SCOPE_TTS.md v2.3)
✅ COMPLETED:

Task 1: TTS_QUOTA_KV Binding (Session 52)
Task 2: Voice Testing - confirmed MeloTTS ignores voice param (Session 52)
Task 3a: Backend Primo Voice routing (Session 53, commit 0002ee9)
Task 3b: Frontend Voice UI - simplified to 2 real options (Session 53, commit 72dfc7b)
Task 3c: Premium CSS Styling (Session 53, commit 72dfc7b)
Task 3d: RunPod Secrets configured (Session 53)
RunPod deployment with 5 working voices (Session 55-56)
Dark theme support (Session 55-56)

Current Voice System:
VoiceEngineProviderTierStandard MaleEdge TTSRunPodFreeStandard FemaleEdge TTSRunPodFreeYoung VoiceEdge TTSRunPodFreePrimo VoicePiper TTSRunPodPremiumPrimo FemalePiper TTSRunPodPremium
RunPod Status:

Pod ID: xfdsuii2ig7rsl
Status: OFF (on-demand, to save costs)
GPU: RTX 4090 ($0.26/hr)
All 5 voices tested and working

I see three key areas still requiring attention. The premium subscription mechanism remains in testing mode, which means full monetization isn't yet implemented. Classroom avatar integration is pending, suggesting a broader product roadmap beyond core TTS functionality. Additionally, the TTS server's automatic startup on pod boot needs configuration to ensure seamless deployment.
The current implementation provides a solid foundation with five distinct voices across free and premium tiers. The next phase involves completing the subscription workflow, integrating with classroom features, and optimizing the RunPod deployment process for more reliable, automated startup.I'll review the completed TTS work from Sessions 52-56 based on the SCOPE_TTS.md document. Here's my assessment:

🎉 TTS System Review — OPERATIONAL
Summary of Completed Work
The TTS implementation is now fully operational with a properly tiered voice system:
Session 52: Foundation work (KV binding, voice testing) revealed that MeloTTS ignores voice parameters—all 6 legacy voices produced identical output with random variations.
Sessions 53-56: Pivoted to a genuine tiered system using RunPod:
VoiceEngineProviderTierStatusStandard MaleEdge TTSRunPodFree✅ WorkingStandard FemaleEdge TTSRunPodFree✅ WorkingYoung VoiceEdge TTSRunPodFree✅ WorkingPrimo VoicePiper TTSRunPodPremium✅ WorkingPrimo FemalePiper TTSRunPodPremium✅ Working

Key Technical Accomplishments
Backend (pmerit-api-worker):

tts.ts now routes "primo" voices to RunPod Piper TTS
Subscription gating implemented (currently TESTING_MODE = true)
Secrets configured: RUNPOD_API_KEY, RUNPOD_TTS_URL

Frontend (pmerit-ai-platform):

Simplified voice modal from 6 fake options to 5 genuine choices
Legacy voice IDs gracefully migrate to standard-male
Premium gold/amber styling with dark theme support

RunPod Infrastructure:

Pod: xfdsuii2ig7rsl (RTX 4090, $0.26/hr)
On-demand operation to minimize costs
Startup script ready in scripts/runpod/tts_server.py


What's Working Now

Free users get three genuinely different voices (male, female, young)
Premium users (in testing mode) get natural human-quality Piper voices
Voice modal properly shows tier badges and upgrade prompts
Dark theme fully supported


⚠️ Pending Items for Future Sessions
PriorityItemLocationNotesP1Wire premium subscription checktts.ts:173-220Set TESTING_MODE = false when readyP2Classroom avatar lip-syncAvatarManager.js, lip-sync-controller.jsVoice should persist per userP3Auto-start TTS serverRunPod configCurrently requires manual start on pod boot

📋 Recommendation
The TTS scope can be considered COMPLETE for MVP purposes. The remaining items (subscription wiring, avatar integration, auto-start) are integration tasks that belong in their respective scopes:

Subscription wiring → Part of Billing/Payment scope
Avatar lip-sync → Part of Classroom/Avatar scope
Auto-start → DevOps refinement

Would you like me to:

Update STATE.json and TASK_TRACKER to reflect Sessions 52-56 progress?
Create a handoff document summarizing TTS completion for the next session?
Discuss next priorities (parent portal, enrollment flows, COPPA compliance)?
We will be working on "Learning_Pathways.md" in the Project Knowledge. This page is supposed to be a page that gives users a glimpse into the services offered by the platform, where users can find out if the platform has what they are looking for. See ASU.edu as a sample of what I'm trying to describe. See what we currently have in the fourth image. I'm also thinking of ways we can package the "Global Remote Tracks" as a program that leads to a career.Dec 16Analyzed ASU's discovery model to restructure PMERIT's pathway offerings.The user is showing me ASU.edu's homepage as inspiration for improving PMERIT's Learning Pathways page. Let me analyze what I see:
ASU Screenshots (Images 1-3):

"Find my degree program" section with:

In Person / Online toggle
Search by keyword
Search by interest area dropdown (18 categories like Architecture & Construction, Arts, Business, etc.)
Degree type (Undergraduate / Graduate)
Submit button
"Discover what's right for me" link


The dropdown shows interest areas for In-Person students (18 categories)
When "Online" is selected, it shows different interest areas (11 categories) - more condensed/career-focused
"I am a future" section with student types:

First-year student
Transfer student
Graduate student
International student
Veteran student
Non-degree student



PMERIT Current State (Image 4):

"Discover Your Perfect Learning Path" hero
Two CTAs: "Discover Your Path" and "See All Courses"
Three track tabs: Global Remote Tracks, Local Education, Local Career Pathways
Currently showing Global Remote Tracks with pathway cards (Data Analytics, Digital Marketing, UX Design)

User's Goals:

Make the Learning Pathways page help users find what they're looking for
Package "Global Remote Tracks" as programs that lead to careers
Follow ASU's approach of guided discovery

Let me search the project knowledge for the Learning_Pathways.md document to understand the current vision.I can see what you're going for! ASU's homepage does a brilliant job of helping users self-select into the right program through a guided discovery flow. Let me review your Learning Pathways documentation and then brainstorm how we can adapt this approach for PMERIT.Searched project for “Learning Pathways page discovery tracks programs careers”6 resultsLearning_Pathways.md4 relevant sectionstextscripts/002_curriculum_migration.sqltextAbout Pmerit3 relevant sectionstextscripts/run-migration.js2 relevant sectionstextBRAINSTORM_ASU_LIKE_SCHEMA.mdtextdocs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.mdtextSynthesized discovery patterns and reframed remote tracks as career programs.21sNow I have a good understanding of:

Current PMERIT pathways page (Image 4):

"Discover Your Perfect Learning Path" hero
Three track tabs (Global Remote, Local Education, Local Career)
Pathway cards with icons
Very clean but more of a catalog view


ASU's approach (Images 1-3):

Program Finder with guided questions:

In Person vs Online toggle
Search by keyword
Search by interest area dropdown
Degree type (Undergraduate/Graduate)


"I am a future" section with student type links
"Discover what's right for me" link for assessment-based discovery


What the user wants:

Help users self-discover if PMERIT has what they need
Package "Global Remote Tracks" as programs leading to careers
More guided discovery like ASU



Let me brainstorm what this could look like for PMERIT:
Key UX Pattern from ASU
ASU uses a dual-path discovery model:

Direct Search - Know what you want? Search by keyword, interest area
Guided Discovery - Not sure? "Discover what's right for me" leads to assessment

How This Translates to PMERIT
For PMERIT, the three tracks serve different audiences:

Global Remote → Adults seeking remote careers (the user wants this packaged as "programs")
Local Education → K-12 students/parents
Local Career → CTE/vocational seekers

Proposed "Program Finder" for PMERIT:

First Question: "I am looking for..."

Remote work training (→ Global Remote)
K-12 education (→ Local Education)
Career/vocational training (→ Local Career)



I'll refine the discovery process by adding nuanced experience and interest levels. The second question targets experience, allowing personalized pathway recommendations. By segmenting users into beginner, intermediate, and career-changing categories, PMERIT can provide tailored guidance.
The third question focuses on specific interest areas, creating a more precise matching system. Technology, creative, and business tracks offer clear career pathways. This approach transforms the current catalog view into an interactive, user-centric discovery experience.
Recommended pathway results will provide concrete, actionable information. Time to completion, potential career outcomes, salary ranges, and required commitment give users transparent expectations about their learning journey.
The core innovation involves reframing educational tracks as comprehensive "Career Programs" instead of traditional course sequences. This strategic repositioning emphasizes tangible professional outcomes: specific job roles, comprehensive portfolios, industry credentials, and direct employment potential.
By packaging learning experiences as targeted career programs, PMERIT creates a more compelling value proposition. The example of transforming "Data Analytics" from a course pathway to a holistic "Data Analytics Career Program" illustrates this approach, highlighting duration, specific career outcomes, salary potential, learning objectives, project deliverables, and earned credentials.This is excellent! I can see exactly what you're going for. Let me analyze the ASU approach and brainstorm how to apply it to PMERIT.

🎯 ASU vs PMERIT: Key UX Patterns
What ASU Does Well
Image 1-3: "Find my degree program" (Program Finder)

In Person / Online toggle — immediate audience segmentation
Search by keyword — for users who know what they want
Search by interest area — 18 categories (In-Person) or 11 categories (Online)
Degree type filter — Undergraduate / Graduate
"Discover what's right for me" — leads to guided assessment

"I am a future" section provides identity-based entry points:

First-year student, Transfer student, Graduate student, International student, Veteran student, Non-degree student

PMERIT Current State (Image 4)
Your current page is catalog-oriented rather than discovery-oriented:

Hero with generic CTAs
Three track tabs showing pathway cards
Users must browse to find what fits

The Gap: No guided discovery. Users don't know if PMERIT is right for them until they dig in.

💡 Brainstorm: PMERIT Program Finder
Concept: Dual-Path Discovery
Like ASU, give users two ways to find their path:
PathFor WhoFlowDirect Search"I know what I want"Keyword search + filtersGuided Discovery"Help me find my fit"Assessment → Recommendation
Proposed Layout Structure
┌─────────────────────────────────────────────────────────────────────┐
│ HERO: "Find Your Path to a New Career"                              │
│ Subtitle: "Discover programs that match your goals and experience"  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PROGRAM FINDER (Left 40%)          │  I AM A... (Right 30%)        │
│                                    │                                │
│ ○ Career Training (Remote)         │  → Career Changer              │
│ ○ K-12 Education (Local)           │  → Recent Graduate             │
│ ○ Vocational/CTE (Local)           │  → Working Professional        │
│                                    │  → Parent/Guardian             │
│ [Search by Interest Area ▼]        │  → Student (Under 18)          │
│ - Technology & Data                │  → Employer/Partner            │
│ - Creative & Design                │                                │
│ - Business & Management            │  [Not sure? Take Assessment]   │
│ - Healthcare                       │                                │
│ - Skilled Trades                   │                                │
│                                    │                                │
│ [Find Programs]                    │                                │
└─────────────────────────────────────────────────────────────────────┘
Reframing "Global Remote Tracks" as Career Programs
Current Problem: "Data Analytics" sounds like a course topic, not a career program.
ASU Pattern: Each program has:

Degree name (BS Computer Science)
Duration (4 years)
Career outcomes
Admission requirements

PMERIT Reframe for Global Remote:
CurrentProposedData AnalyticsData Analyst Career ProgramDigital MarketingDigital Marketing Specialist ProgramUX DesignUX Designer Career ProgramWeb DevelopmentFull-Stack Web Developer ProgramProject ManagementProject Manager Professional ProgramBusiness AnalysisBusiness Analyst Career Program
Program Card Enhancement
┌─────────────────────────────────────────────────────────────────┐
│ 📊 DATA ANALYST CAREER PROGRAM                                  │
├─────────────────────────────────────────────────────────────────┤
│ Duration: 6 months (part-time)  |  Level: Beginner-friendly     │
│                                                                 │
│ CAREER OUTCOMES                                                 │
│ → Junior Data Analyst                                           │
│ → Business Intelligence Analyst                                 │
│ → Data Operations Specialist                                    │
│                                                                 │
│ MEDIAN SALARY RANGE: $55,000 - $75,000                         │
│                                                                 │
│ WHAT YOU'LL BUILD                                               │
│ ✓ 3 data analysis projects                                     │
│ ✓ SQL portfolio                                                 │
│ ✓ Dashboard visualization showcase                              │
│                                                                 │
│ SKILLS YOU'LL GAIN                                              │
│ [SQL] [Excel] [Python] [Tableau] [Statistics]                   │
│                                                                 │
│ CERTIFICATE: PMERIT Data Analytics Professional                 │
│                                                                 │
│ [Learn More]  [Start Free]  [Compare Programs]                  │
└─────────────────────────────────────────────────────────────────┘

🔧 Implementation Approach
Phase 1: Program Finder Component (Quick Win)
Add a program finder form above the current pathway tabs:
javascript// Program Finder Questions
const PROGRAM_FINDER = {
  step1: {
    question: "What are you looking for?",
    options: [
      { value: 'global_remote', label: 'Remote career training', icon: '🌍' },
      { value: 'local_education', label: 'K-12 education', icon: '📚' },
      { value: 'local_career', label: 'Trade/vocational training', icon: '🔧' }
    ]
  },
  step2_global_remote: {
    question: "Your area of interest",
    options: [
      { value: 'tech', label: 'Technology & Data', pathways: ['data-analytics', 'web-development'] },
      { value: 'creative', label: 'Creative & Design', pathways: ['ux-design', 'digital-marketing'] },
      { value: 'business', label: 'Business & Management', pathways: ['project-management', 'business-analysis'] }
    ]
  }
};
Phase 2: "I Am A..." Entry Points
Add identity-based navigation (like ASU's "I am a future" section):
IdentityLanding ExperienceCareer ChangerHighlight transferable skills, shorter programsRecent GraduateEntry-level programs, portfolio focusWorking ProfessionalPart-time options, upskilling pathsParent/GuardianK-12 overview, parent portal introStudent (Under 18)Age-appropriate tracks, guardian signupEmployer/PartnerPartnership info, bulk enrollment
Phase 3: Enhanced Pathway Data
Add career outcome data to the pathways table:
sqlALTER TABLE pathways ADD COLUMN IF NOT EXISTS career_outcomes JSONB;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_min INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_max INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS duration_weeks INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS commitment_hours_per_week INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS certificate_name VARCHAR(255);

📝 Questions for You
Before I draft the full HANDOFF_DOCUMENT for Claude Code, I need your input:

Priority Focus: Should we start with:

A) Program Finder form only (quick win)
B) Full page redesign with both finder + enhanced cards
C) Just the "I Am A..." identity navigation


Career Outcome Data: Do you have salary ranges and duration estimates for the 6 Global Remote pathways, or should we use placeholder data?
"Career Program" vs "Pathway": Should we rename the database field pathway_name to include "Program" (e.g., "Data Analytics" → "Data Analyst Career Program"), or just display it differently on the frontend?
Assessment Integration: The "Discover what's right for me" flow—should this use your existing Big Five/Holland Code assessment, or be a shorter "quick match" quiz?

Let me know your thoughts and I'll prepare the HANDOFF_DOCUMENT for implementation!Where would the curate source for the Global Remote? Is there a source like MOOSE to use?Dec 161 stepSearched project for “content sources curriculum MOOSE freeCodeCamp OSHA curated Global Remote career training”9 resultsscripts/002_curriculum_migration.sqltextTASK_TRACKER.mdtextdocs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.mdtextSTATE.jsontextBRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextPmerit_Project_Document.mdtextscripts/seed-modules.jstextPROJECT_CONTEXT_WORK_ORDER.mdtextPmerit-comprehensively-narrative-users-and-Admin-Journey.mdtextInvestigated content curation sources and explored educational resources.The user is asking about content sources for Global Remote tracks. From the project knowledge, I can see that the architecture decision mentions "Curator model (MOOSE, freeCodeCamp, OSHA)" but this is somewhat vague for the Global Remote track specifically.
Let me search for more information about content sources and also do a web search to find the best open educational resources for career training in areas like Data Analytics, Web Development, UX Design, Digital Marketing, Project Management, and Business Analysis.Excellent question! This is actually a critical gap I should research. Your architecture mentions "Curator model (MOOSE, freeCodeCamp, OSHA)" but that's not fully mapped to the Global Remote tracks. Let me find what's available.4 stepsfree open source UX design curriculum Google Skillshop HubSpot Academy digital marketing certification OER10 resultsHubSpot Academyhubspot.comHubSpot Resources - 35 Free Course Resourceshubspot.comGoogle Digital Marketing & E-commerce Professional Certificate | Courseracoursera.orgDigital Marketing Certification Coursehubspot.comMaster Google Tools with Online Training - Skillshopwithgoogle.comTop 50+ Free Certificate Courses 2025 - Skilr Blogskilr.com100+ Free Online Courses With Certificates To Boost Your Career [2025 Updated] - Scholarshipscholarscholarshipscholar.com[2025] 450+ Free Google Certificates and Badges — Class Centralclasscentral.com[2025] Massive List of Thousands of Free Certificates and Badges — Class Centralclasscentral.com70+ HubSpot Academy Courses [2025] | Learn Online for Free | Class Centralclasscentral.comSynthesized content sources and expanded research scope strategically.Now I have a much better picture of the content source landscape. Let me also search for project management training sources like PMI, Atlassian, and Scrum.org to complete the picture.Now I have a comprehensive picture. Here's the MOOSE-equivalent mapping for Global Remote tracks:

🎓 Global Remote Content Sources
Unlike K-12 education (where MOOSE provides a unified state-backed curriculum), adult career training is fragmented across industry providers. However, there are excellent free, open, and industry-recognized sources:
PathwayPrimary SourcesLicense TypeNotesWeb DevelopmentfreeCodeCamp, The Odin ProjectCC BY-NC-SA 4.0✅ True OER, 40K+ developers trainedData AnalyticsfreeCodeCamp, Google Career Certs (audit free)CC / Proprietary (audit)Google is industry gold standardDigital MarketingHubSpot Academy, Google Skillshop, Semrush AcademyFree (proprietary)Industry-recognized certs, 100% freeUX DesignGoogle UX Design Cert (audit), IxDF, Figma tutorialsProprietary (audit)Google cert is employer-recognizedProject ManagementPMI Free Courses, Atlassian University, Scrum.orgFree (proprietary)Prepares for PMP, CSM examsBusiness AnalysisIIBA Free Resources, Coursera (audit)MixedLess structured than others

📊 Detailed Source Breakdown
1. Web Development — The Odin Project + freeCodeCamp
AttributeValueProviderThe Odin Project (CC BY-NC-SA 4.0), freeCodeCamp (BSD-3-Clause)FormatFull curriculum, project-basedDuration6-12 months full-time equivalentCoverageHTML/CSS/JS → React/Node → Full StackPMERIT Integration✅ Can curate and link directlyLicensing NoteNon-commercial OK; need permission for commercial use
This is your MOOSE-equivalent for Web Dev.
2. Digital Marketing — HubSpot Academy + Google Skillshop
AttributeValueProviderHubSpot Academy (26 free certs), Google Skillshop (14 free certs), Semrush Academy (90+ free courses)FormatVideo courses + assessmentsDuration2-4 hours per certificationCoverageSEO, Content Marketing, Social Media, Email, AdsPMERIT IntegrationLink to external certs; supplement with portfolio projectsLicensingProprietary but 100% free; users earn industry badges
Recommended Approach: Create a PMERIT "Digital Marketing Program" that sequences HubSpot + Google certs with portfolio projects.
3. Data Analytics — freeCodeCamp + Google Data Analytics
AttributeValueProviderfreeCodeCamp (Data Analysis with Python), Google Career Cert (audit free)FormatInteractive coding + videoDuration3-6 monthsCoverageSQL, Python, Tableau, Excel, StatisticsPMERIT IntegrationCurate fCC for Python/SQL; link Google for structure
4. UX Design — Google UX Design Certificate
AttributeValueProviderGoogle (via Coursera), Interaction Design FoundationFormatVideo + portfolio projectsDuration3-6 monthsCoverageResearch, Wireframing, Prototyping, FigmaPMERIT IntegrationMore challenging—no true OER; link to audit-free courses
5. Project Management — Free Industry Resources
AttributeValueProviderPMI (free membership tier), Atlassian University, Scrum.orgFormatMixedCoverageAgile, Scrum, Waterfall, PMBOK basicsPMERIT IntegrationCurate free content + prep for certifications

🔑 Key Differences from MOOSE
AspectMOOSE (K-12)Global Remote SourcesGovernanceState of Maine (law-backed)Industry providers (voluntary)LicensePublic domain / OERMixed (CC, proprietary, audit-free)StructureUnified curriculumFragmented, requires curationUpdatesState-controlledProvider-controlledStabilityHigh (government)Medium (business decisions)

💡 Recommendation: Hybrid Curator Model
Rather than trying to find a single "MOOSE for Global Remote," I suggest:
Tier 1: True OER (Own the Content)

Web Development → freeCodeCamp + Odin Project (fork/curate allowed)
Data Analytics (Python/SQL) → freeCodeCamp Data Analysis

Tier 2: Industry Partnership (Link + Supplement)

Digital Marketing → HubSpot Academy + Google Skillshop (link to their certs)
UX Design → Google UX Cert (Coursera audit) + Figma tutorials
Project Management → PMI free tier + Atlassian University

Tier 3: PMERIT Original (Portfolio Projects)

For each pathway, PMERIT creates 3-5 portfolio projects that integrate skills from external courses
These projects become the differentiator and assessment mechanism


📝 Questions for You

Licensing Comfort: Are you comfortable with the CC BY-NC-SA license for Odin Project (non-commercial OK, need permission for commercial)?
Industry Cert Integration: Should PMERIT track external certifications (e.g., "User completed Google Analytics cert") alongside internal progress?
Content Strategy: Should PMERIT:

A) Curate & Link — Point users to external content, track completion
B) Fork & Host — Copy OER content into PMERIT platform (where allowed)
C) Hybrid — Fork OER for Web Dev/Data; link for Marketing/UX/PM



Let me know your preferences and I'll draft the content source architecture into the Learning Pathways scope!Do you understand that the page we are working on is not the page that allows users to register for classes? The page allows the user to see the type of program the platform offers. Users do not need to sign up or register to access and search for classes and programs on this page.6:42 AMRecalibrated understanding of page purpose as discovery tool, not enrollment platform.16sThe user is clarifying the purpose of the Learning Pathways page. Let me re-read what they're asking for:

This is a discovery/browsing page - NOT a registration page
Users should be able to see what programs/classes are offered WITHOUT signing up
It's like ASU's homepage where you can explore programs before committing

Looking back at the ASU screenshots:

Image 1: "Find my degree program" - browse/search without login
Image 2: Dropdown showing interest areas - pure discovery
Image 3: Online filter with interest areas - still just browsing
Image 4: PMERIT's current /pathways page - shows tracks but is more of a catalog

The user wants me to understand:

This page is for window shopping - seeing what's available
No registration/enrollment happens here
Users can freely browse to determine if PMERIT has what they're looking for
The content source question was about what programs to DISPLAY, not what to teach

So my previous response about curriculum sources (freeCodeCamp, HubSpot, etc.) was partially off-track. The user is asking:

"What content do we SHOW on this page to help users understand our offerings?"
NOT "What content do we use to TEACH the courses?"

Although... the content sources ARE relevant because they inform what programs we can credibly offer. But the immediate question is about the USER EXPERIENCE of the discovery page, not the backend curriculum.
Let me refocus on what the page should accomplish:

Help users quickly find if PMERIT offers what they're looking for
Show program details (duration, outcomes, career paths)
No login required
Similar to ASU's "Find my degree program" experience

The user's original question about "curate source for Global Remote" was asking: where does the PROGRAM INFORMATION come from (like how MOOSE defines what K-12 education looks like in Maine), not necessarily the teaching materials.
I recognize I misunderstood the core purpose and need to pivot my approach. I'll focus on creating a user-friendly discovery experience that transparently showcases PMERIT's program offerings without creating barriers to exploration.You're absolutely right—I apologize for the confusion. Let me reset.

🎯 Page Purpose: Program Discovery (Not Registration)
What this page IS:

A public catalog where anyone can browse programs
No login required
"Window shopping" experience
Helps users answer: "Does PMERIT have what I'm looking for?"

What this page is NOT:

Registration or enrollment
Class sign-up
Dashboard or logged-in experience


ASU Parallel
Looking at your screenshots again:
ASU ElementPurpose"Find my degree program"Browse/filter programs without accountInterest area dropdownNarrow down options"I am a future..."Self-identify to see relevant programsProgram cardsPreview what's offered
Users browse freely → Find something interesting → THEN sign up

Your Actual Question
When you asked about "curated source for Global Remote like MOOSE," you're asking:

What defines the PROGRAM STRUCTURE we display on this discovery page?

For K-12, MOOSE defines what grades/subjects exist. For Global Remote careers, what defines what programs/tracks we should show?
Is that the question? If so, the answer would be more about:

Career frameworks (O*NET, BLS Occupational Outlook)
Industry-recognized career paths (what employers actually hire for)
Salary data sources (to show career outcomes)

Rather than curriculum content (freeCodeCamp, etc.), which comes AFTER someone enrolls.
Did I understand correctly this time?This is because we need to provide a structured experience that allows users to see the whole ecosystem of education that the platform offers, unlike the ASU, which focuses on College only6:46 AMSynthesized comprehensive educational ecosystem spanning K-12 through adult career pathways.Now I understand! The user is saying:

ASU only shows college programs (undergraduate/graduate)
PMERIT has THREE tracks spanning the ENTIRE educational journey:

Global Remote (adult career training)
Local Education (K-12)
Local Career (CTE/vocational)



So the Learning Pathways page needs to showcase this ENTIRE ECOSYSTEM - from early childhood through adult career training. This is a much broader scope than ASU.
The user wants to show users:

"We have K-12 education (if you're a parent or student)"
"We have career training (if you're an adult looking to change careers)"
"We have vocational/trade training (if you want hands-on skills)"

The question about "curated source for Global Remote like MOOSE" is about:

MOOSE provides the STRUCTURE for K-12 (grades, subjects, standards)
What provides the STRUCTURE for Global Remote careers?

Not the curriculum content itself, but the FRAMEWORK that defines:

What career programs exist?
How are they organized?
What outcomes do they lead to?
How long do they take?

This is about the TAXONOMY/STRUCTURE of career programs, not the learning content.
For K-12: Maine Learning Results / MOOSE defines the structure
For CTE: Maine CTE Clusters / OSHA certifications define the structure
For Global Remote: What defines this structure?
Possible answers:

O*NET (US Dept of Labor occupational database)
BLS Occupational Outlook Handbook
LinkedIn's Skills Graph
Industry frameworks (e.g., SFIA for IT skills)

This would help define:

What career programs to offer
What skills each program should cover
What job titles graduates can pursue
Salary expectations

This is the DISCOVERY framework, not the curriculum content.NOW I understand!

The Real Challenge
ASU shows: College programs only (one slice of education)
PMERIT shows: The ENTIRE educational ecosystem:
┌─────────────────────────────────────────────────────────────────┐
│                    PMERIT EDUCATIONAL ECOSYSTEM                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👶 Early Childhood ──► 📚 K-12 ──► 🎓 Career Training ──► 💼 Job │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ LOCAL        │  │ LOCAL        │  │ GLOBAL       │          │
│  │ EDUCATION    │  │ CAREER       │  │ REMOTE       │          │
│  │ (K-12)       │  │ (CTE/Trades) │  │ (Digital)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

What You Need for the Discovery Page
A unified framework that shows users where they (or their children) fit in this ecosystem:
TrackWho It's ForStructure SourceLocal EducationParents, K-12 studentsMOOSE / Maine Learning ResultsLocal CareerJob seekers wanting tradesMaine CTE Clusters / Industry CertsGlobal RemoteAdults wanting remote careers??? (This is your question)

The Gap: Global Remote Structure
For K-12, MOOSE tells you: "Here are the grades, here are the subjects, here's the progression."
For Global Remote, you need something that tells users:

What career paths exist in remote/digital work?
How are they organized?
What's the progression?
What outcomes can I expect?

Potential structure sources:
SourceWhat It ProvidesO*NET (Dept of Labor)Occupational taxonomy, skills, salary dataBLS Occupational OutlookJob growth projections, median salariesLinkedIn Economic GraphIn-demand skills by regionIndustry CertificationsGoogle, HubSpot, AWS define career paths

Proposed: Career Cluster Framework for Global Remote
Similar to how Maine CTE has 16 clusters, you could organize Global Remote into career clusters:
ClusterCareer ProgramsEntry JobsGrowth JobsData & AnalyticsData Analytics, Business IntelligenceJunior AnalystData ScientistDesign & CreativeUX Design, Digital MarketingDesigner, CoordinatorCreative DirectorDevelopment & EngineeringWeb Dev, Full StackJunior DeveloperSenior EngineerOperations & ManagementProject Management, Business AnalysisCoordinatorProgram Manager
This gives users a mental model of the career ecosystem, just like grade levels give parents a mental model of K-12.

Is this the direction you're thinking?
Should we design the discovery page around career clusters + life stages so users can see:

"I'm a parent" → Shows K-12 tracks
"I want a trade career" → Shows CTE/vocational
"I want a remote career" → Shows digital career clusters

And each option shows the full journey from entry to advancement?I think this should work. However, I also think that we should design two scopes here to consolidate the whole system of   the discovery page and the actual page where the registered users actually register for classes. Let's work on SCOPE_courses.md, and if we need a handoff for continuation, that is what we will do. We are to provide updates to the scopes. The scope docs are are actual current platform setup that we need to correct and build upon.7:12 AMThinking about designing dual scopes for course discovery and registration systems.The user wants to:

Work on two scopes - the discovery page (Learning Pathways) and the registration page (Courses)
Start with SCOPE_courses.md
These scope docs represent the CURRENT platform state that needs correction and building upon
Create handoff if needed for continuation

Let me first review the SCOPE_courses.md file in the project knowledge to understand the current state.Understood! Let me review the current SCOPE_courses.md to understand what we're working with.4 stepsSearched project for “SCOPE_courses courses.html enrollment registration class signup”5 resultsBRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextSCOPE_courses.md4 relevant sectionstextdocs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextSCOPE_Learning_Pathways.mdtextTASK_TRACKER.mdtextReviewed documentation to consolidate discovery and registration scopes.I found SCOPE_courses.md in the project knowledge. Now let me also review SCOPE_Learning_Pathways.md to understand both scopes fully before we update them.I found SCOPE_courses.md exists in project knowledge. Now let me also get the full Learning Pathways scope:2 stepsSearched project for “SCOPE Learning Pathways pathways.html discovery page public catalog”6 resultsSCOPE_Learning_Pathways.md4 relevant sectionstextSCOPE_courses.md4 relevant sectionstextBRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextscripts/003_seed_courses_content.sql2 relevant sectionstextdocs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextsrc/routes/curriculum.tstextSynthesized dual-scope architecture for discovery and registration workflows.Now I have a clear picture of both scopes. Let me summarize the current state and then we can define clear boundaries and updates for both scopes.
Current State:
SCOPE_Learning_Pathways.md (Discovery Page - pathways.html)

URL: /pathways
Purpose: Public discovery page showing the educational ecosystem
Shows 14 pathways in 3 tracks (Global Remote, Local Education, Local Career)
No login required
Current gaps: No search, no filters, static sample courses, no enrollment counts

SCOPE_courses.md (Registration Page - courses.html)

URL: /courses (appears to be for catalog/course listing)
Purpose: Course catalog with enrollment capability
Shows 42 courses with filters
Requires login for enrollment
Current gaps: No content in modules/lessons, no rating system, no reviews

The user wants to clearly delineate:

Discovery Page (Learning Pathways) - "Does PMERIT have what I'm looking for?"
Registration Page (Courses) - "I'm ready to sign up for classes"

Let me now create a clear HANDOFF_DOCUMENT section for SCOPE_courses.md that addresses the user's vision.Now I have a complete picture. Let me summarize what we're working with and propose the scope updates.

📊 Current State Summary
Two Overlapping Pages with Unclear Purposes
PageURLCurrent PurposeActual Filespathways.html/pathwaysShows pathways + sample courses1139 lines (monolithic)courses.html/coursesShows all 42 courses + enrollment~1198 lines
The Problem: Both pages show courses, but with different UX. The distinction between "discovery" and "registration" is blurred.

🎯 Proposed Scope Separation
SCOPE_Learning_Pathways.md — Program Discovery
AttributeDefinitionPurposeHelp users understand the PMERIT educational ecosystemAudienceAnyone (no login required)URL/pathways (rename to /discover or /programs?)Question Answered"Does PMERIT have what I'm looking for?"Key ActionsBrowse tracks → Explore programs → View career outcomes → See course previewsDoes NOT includeEnrollment, progress tracking, dashboard features
SCOPE_courses.md — Course Registration
AttributeDefinitionPurposeAllow users to find and enroll in specific coursesAudienceRegistered users (login required for enrollment)URL/courses or /catalogQuestion Answered"I'm ready to sign up—which classes do I take?"Key ActionsSearch courses → Filter by criteria → View syllabus → EnrollRequiresUser account for enrollment actions

📝 HANDOFF_DOCUMENT for SCOPE_courses.md
Let me draft the handoff section for Claude Code:
markdown## HANDOFF_DOCUMENT

**Session:** 58
**Date:** 2025-12-17
**Author:** Claude Web (Architect)
**For:** Claude Code (Implementer)

---

### CONTEXT

This scope covers the **course registration system**—where authenticated users search, filter, and enroll in classes. This is SEPARATE from the discovery page (SCOPE_Learning_Pathways.md) which helps users explore the platform's offerings without an account.

### USER JOURNEY POSITION
```
[Discovery: /pathways] → User decides PMERIT fits their goals
                       ↓
[Registration: /courses] → User searches for specific courses
                       ↓
[Enrollment] → User signs up / logs in → Enrolls in course
                       ↓
[Dashboard] → User sees enrolled courses → Enters classroom
```

### CURRENT STATE ISSUES

1. **courses.html tries to do both discovery AND registration**
   - Has "Career Tracks" section (duplicates pathways.html)
   - Has course catalog with enrollment

2. **No clear course detail page**
   - `/courses/:slug` should show full syllabus before enrollment
   - Currently goes straight to enrollment modal

3. **No pathway-to-course flow**
   - User on pathways.html clicks "Learn More" → Where do they go?
   - Should land on `/courses?pathway=data-analytics` (filtered view)

### REQUIREMENTS

#### R1: Remove Discovery Features from courses.html

**Current:** courses.html has a "Career Tracks" hero section
**Change:** Remove it. Let pathways.html handle discovery.
**Why:** Clear separation of concerns

#### R2: Create Course Detail Page

**New page:** `/course/:slug` (course-detail.html)
**Purpose:** Full course information before enrollment decision
**Content:**
- Course title, description, instructor
- Duration, difficulty, prerequisites
- Module list with lesson counts
- Career outcomes / skills gained
- Syllabus download (PDF)
- "Enroll Now" CTA (requires login)

#### R3: Add Pathway Filter Parameter

**URL pattern:** `/courses?pathway=data-analytics`
**Behavior:** 
- Pre-filter course list by pathway
- Show breadcrumb: "Data Analytics > All Courses"
- Link from pathways.html "View All Courses" button

#### R4: Course Registration Flow
```
/courses (catalog)
    └── User clicks course card
        └── /course/:slug (detail page)
            └── User clicks "Enroll Now"
                └── If not logged in: Auth modal → Return to detail
                └── If logged in: Enrollment confirmation
                    └── Redirect to /dashboard (My Courses section)
```

### DATABASE REQUIREMENTS

No new tables needed. Existing `courses` table has all required fields.

Add columns if missing:
```sql
ALTER TABLE courses ADD COLUMN IF NOT EXISTS syllabus_content TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[];
ALTER TABLE courses ADD COLUMN IF NOT EXISTS career_outcomes TEXT[];
```

### FILES TO MODIFY

| File | Action |
|------|--------|
| `courses.html` | Remove "Career Tracks" section, simplify to catalog |
| `course-detail.html` | **CREATE** - New page for individual course |
| `assets/js/course-detail.js` | **CREATE** - Course detail page logic |
| `dashboard-courses.js` | Update enrollment flow redirect |

### ACCEPTANCE CRITERIA

- [ ] courses.html shows ONLY the course catalog (no pathway discovery)
- [ ] `/courses?pathway=xxx` filters by pathway slug
- [ ] `/course/:slug` shows full course detail with syllabus
- [ ] Enrollment requires authentication
- [ ] After enrollment, user redirects to dashboard
- [ ] "View All Courses" from pathways.html links to filtered courses page

### OUT OF SCOPE (for this iteration)

- Course ratings/reviews (separate scope)
- Module/lesson content creation (admin scope)
- Course thumbnails (design scope)
- Enrollment limits enforcement

📝 HANDOFF_DOCUMENT for SCOPE_Learning_Pathways.md
markdown## HANDOFF_DOCUMENT

**Session:** 58
**Date:** 2025-12-17
**Author:** Claude Web (Architect)
**For:** Claude Code (Implementer)

---

### CONTEXT

This scope covers the **program discovery page**—where anyone can explore the PMERIT educational ecosystem to answer: "Does PMERIT have what I'm looking for?"

This is the PUBLIC-FACING entry point comparable to ASU's homepage program finder, but showing the ENTIRE educational spectrum (K-12, Career Training, Trades) rather than just college programs.

### VISION: Educational Ecosystem Discovery

Unlike ASU (college-only), PMERIT serves:
- Early childhood through adult learners
- Academic AND vocational tracks  
- Local AND global career paths

The discovery page must help users **self-identify** and find their place in this ecosystem.

### CURRENT STATE ISSUES

1. **Catalog-oriented, not discovery-oriented**
   - Shows pathway cards without helping users find their fit
   - No "Program Finder" flow
   - No "I am a..." identity selection

2. **Global Remote needs better framing**
   - Current: "Data Analytics" (sounds like a topic)
   - Better: "Data Analyst Career Program" (sounds like a career path)
   - Need: Career outcomes, salary ranges, duration

3. **No guided discovery**
   - Users must browse to find fit
   - No assessment-based recommendations on this page
   - No quick filters by user type

### REQUIREMENTS

#### R1: Add Program Finder Component

**Location:** Above current pathway sections
**Purpose:** Help users narrow options before browsing
```
┌─────────────────────────────────────────────────────────────┐
│ FIND YOUR PROGRAM                                           │
│                                                             │
│ I'm interested in:                                          │
│ ○ Remote career training (work from anywhere)               │
│ ○ K-12 education (for my child)                            │
│ ○ Trade/vocational training (local careers)                │
│                                                             │
│ [Show Programs]   or   [Take Career Assessment]            │
└─────────────────────────────────────────────────────────────┘
```

#### R2: Add "I Am A..." Identity Navigation

**Location:** Right sidebar or secondary section
**Purpose:** Entry points based on user identity

| Identity | Leads To |
|----------|----------|
| Career Changer | Global Remote tracks with "no experience required" filter |
| Parent/Guardian | Local Education tracks + parent portal info |
| Recent Graduate | Entry-level programs across all tracks |
| Working Professional | Part-time/upskilling programs |
| Student (Under 18) | Age-appropriate tracks with guardian info |
| Employer/Partner | Partnership information page |

#### R3: Reframe Global Remote as Career Programs

**Current card:**
```
Data Analytics
Learn to analyze data, create visualizations...
[Tags: SQL, Python, Tableau]
```

**Enhanced card:**
```
DATA ANALYST CAREER PROGRAM
Duration: 6 months | Level: Beginner-friendly

CAREER OUTCOMES:
→ Junior Data Analyst ($55K-$75K)
→ Business Intelligence Analyst
→ Data Operations Specialist

WHAT YOU'LL BUILD:
✓ 3 portfolio projects
✓ Industry certifications prep

[Explore Program] [View Courses]
```

#### R4: Add Career Outcome Data to Pathways

**Database additions:**
```sql
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS career_outcomes JSONB;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_min INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_max INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS duration_weeks INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS program_type VARCHAR(50); -- 'career_program', 'k12_track', 'vocational'
```

**Seed data for Global Remote:**
| Pathway | salary_range_min | salary_range_max | duration_weeks |
|---------|------------------|------------------|----------------|
| Data Analytics | 55000 | 75000 | 24 |
| Digital Marketing | 45000 | 70000 | 20 |
| UX Design | 60000 | 85000 | 24 |
| Web Development | 55000 | 90000 | 28 |
| Project Management | 65000 | 95000 | 20 |
| Business Analysis | 60000 | 85000 | 20 |

#### R5: Connect to Course Catalog

**"View Courses" button behavior:**
- Links to `/courses?pathway={slug}`
- Passes context so courses.html shows filtered view

**"Explore Program" button behavior:**
- Expands to show more detail (accordion or modal)
- Shows full course list, career paths, FAQs

### ACCEPTANCE CRITERIA

- [ ] Program Finder component added at top of page
- [ ] "I Am A..." section provides identity-based navigation
- [ ] Global Remote pathways show career outcomes + salary ranges
- [ ] "View Courses" links to filtered `/courses?pathway=xxx`
- [ ] Page remains fully functional without login
- [ ] Mobile responsive (program finder collapses gracefully)

### OUT OF SCOPE (for this iteration)

- Assessment integration on this page
- Enrollment functionality (handled by courses scope)
- Admin pathway editing
- Content source attribution (MOOSE, freeCodeCamp, etc.)

Next Steps

Should I create these as files for Claude Code to pick up?
Do you want to refine any requirements before implementation?
Priority order: Which scope should Claude Code tackle first?
Always allow for a conclusion before a major handoff to conserve tokens. Since classes are contained within a program, we will need a syllabus that lists the classes users will complete based on the selected program. This syllabus will guide users in registering for the appropriate courses. What do you think?7:21 AMValidated hierarchical structure aligning pathways, syllabi, and course registration.The user is making an excellent point about the flow:

User discovers a PROGRAM (e.g., "Data Analyst Career Program")
Program has a SYLLABUS showing all required COURSES
User uses syllabus to know which COURSES to register for
User then goes to course registration to enroll in those specific courses

This is exactly how traditional education works:

You enroll in a DEGREE PROGRAM (like BS Computer Science)
The program has a CURRICULUM/SYLLABUS (required courses, electives, sequence)
You then REGISTER for individual CLASSES each semester

For PMERIT:

PATHWAY = PROGRAM (e.g., "Data Analyst Career Program")
SYLLABUS = List of courses in sequence with requirements
COURSES = Individual classes to enroll in

This creates a clear hierarchy:
PATHWAY (Program)
├── SYLLABUS (curriculum document)
│   ├── Required Courses (in sequence)
│   ├── Elective Courses
│   └── Capstone/Portfolio Requirements
└── COURSES (individual classes)
    └── MODULES → LESSONS
The user is asking for my opinion on this approach. I think it's exactly right and aligns with how the BRAINSTORM_ASU_LIKE_SCHEMA.md already envisions the system.
Let me provide a concise response affirming this approach and suggesting how it fits into the two scopes, then prepare for handoff.You're absolutely right. The syllabus is the bridge between discovery and registration.

The Flow
DISCOVERY (pathways.html)
    │
    │  User selects: "Data Analyst Career Program"
    ▼
PROGRAM SYLLABUS (new: program-syllabus.html or modal)
    │
    │  Shows: Course sequence, requirements, duration
    │  User sees: "I need to take these 3 courses"
    ▼
COURSE REGISTRATION (courses.html)
    │
    │  User enrolls in Course 1 from syllabus
    ▼
DASHBOARD → CLASSROOM

Syllabus Structure
SectionContentProgram OverviewDuration, career outcomes, salary rangeRequired CoursesSequenced list (Course 1 → 2 → 3)Electives (if any)Optional coursesCapstone/PortfolioFinal project requirementsCertification PrepExternal certs this prepares you for

Database Implication
The pathways table becomes the program container, and we need a way to define course sequence:
sql-- Add to courses table or create junction table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sequence_order INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT TRUE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisite_course_id UUID;

Scope Adjustment
ScopeOwnsSCOPE_Learning_PathwaysDiscovery + Program Syllabus viewSCOPE_coursesCourse catalog + Individual enrollment
The syllabus lives in the discovery scope because it's part of understanding the program—not yet registering for classes.

Conclusion
I agree completely. The syllabus gives users clarity: "Here's your roadmap. Now go register for these courses."
Ready for handoff? I can consolidate both scope documents into a single handoff file for Claude Code, including:

SCOPE_Learning_Pathways updates (Program Finder + Syllabus)
SCOPE_courses updates (Registration flow)
Database schema additions
File creation/modification list
Is there a clear path for or to the curation of courses and materials for programs/ classes in the syllabus?7:34 AMIdentified a foundational gap in content curation strategy.The user is asking a critical question: Where does the actual course content come from?
We've been discussing:

Discovery page (pathways.html) - browse programs
Syllabus - shows what courses are in a program
Registration (courses.html) - enroll in courses

But we haven't addressed: What's INSIDE those courses? Where does the curriculum content come from?
For Local Education (K-12): MOOSE provides the content
For Local Career (CTE): OSHA, industry certs provide structure
For Global Remote: We discussed freeCodeCamp, Odin Project, HubSpot, etc.
But there's no clear curation path defined. The current state shows:

42 courses exist in database
126 modules seeded
630 lessons seeded (from MOOSE)

But for Global Remote, there's no equivalent MOOSE-like source that's been integrated.
The user is essentially asking: "Before we build the syllabus UI, do we have a plan for what goes IN the syllabus?"
This is a foundational question - you can't build a syllabus view if the underlying content structure isn't defined.
Let me think about what needs to be addressed:

Content Curation Strategy - Who/what defines what courses belong to a program?
Content Source Integration - Where does lesson content come from?
Admin Workflow - How do admins add/organize content?

Currently:

MOOSE content is seeded for Local Education
Global Remote has 42 courses but no clear content source
No admin UI for creating modules/lessons

The honest answer is: No, there's not a clear path yet. This is a gap.No, there isn't a clear path yet. That's a foundational gap.

Current Reality
TrackContent SourceCuration StatusLocal Education (K-12)MOOSE✅ 630 lessons seeded from MOOSELocal Career (CTE)OSHA, industry certs⚠️ Course shells exist, no lesson contentGlobal RemotefreeCodeCamp, HubSpot, etc.⚠️ Course shells exist, no lesson content
What exists:

14 pathways (program containers)
42 courses (titles, descriptions, instructors)
126 modules (subdivisions)
630 lessons (MOOSE content only)

What's missing:

Global Remote lesson content
Local Career lesson content
Admin UI to curate/create content
Content source attribution system


The Content Pipeline Question
Before we can show a syllabus, we need to answer:
QuestionCurrent AnswerWho defines which courses belong to a program?Seeded in DB, no admin UIWho creates the lessons inside courses?MOOSE import script (K-12 only)How do we link external content (freeCodeCamp, HubSpot)?Not implementedHow do admins add/edit curriculum?Partial admin-courses.html (no module/lesson UI)

Two Approaches
Option A: Curator Model (Link to External)
Don't host content—link to it.
Program: Data Analyst Career Program
├── Course 1: Python Fundamentals
│   └── Content: freeCodeCamp Python Course (external link)
├── Course 2: SQL for Data Analysis  
│   └── Content: freeCodeCamp SQL Course (external link)
├── Course 3: Data Visualization
│   └── Content: Google Data Analytics Module 4 (external link)
└── Capstone: Portfolio Project
    └── Content: PMERIT original (internal)
Pros: Fast to implement, leverages existing quality content
Cons: Less control, dependency on external platforms
Option B: Content Ingestion Model (Host Content)
Import/create content inside PMERIT.
Program: Data Analyst Career Program
├── Course 1: Python Fundamentals
│   ├── Module 1: Variables & Data Types
│   │   ├── Lesson 1.1: Introduction (PMERIT content)
│   │   ├── Lesson 1.2: Practice (embedded exercises)
│   │   └── Quiz 1.1
│   └── Module 2: Control Flow
│       └── ...
Pros: Full control, consistent UX, offline capability
Cons: Requires content creation/licensing, more work

What Needs to Happen Before Syllabus
StepDescriptionScope1Decide curation strategy (A, B, or hybrid)Architecture decision2Map content sources to programsContent planning3Build admin curation UI (or import scripts)SCOPE_admin_curriculum4Populate Global Remote contentContent work5Then build syllabus viewSCOPE_Learning_Pathways

My Recommendation
Hybrid approach:

Global Remote: Curator model (link to freeCodeCamp, HubSpot, Google)
Local Education: Content ingestion (MOOSE already done)
Local Career: Hybrid (theory = internal, certification = external links)

This lets you launch the syllabus with Global Remote quickly (just linking), while K-12 uses the existing MOOSE content.

Question for You
Before we finalize the handoff:

Which curation approach do you prefer for Global Remote?
Should we add a SCOPE_curriculum_curation to handle the content pipeline separately?
Can you research online for existing, widely used, and recognized open source programs for Global Remote careers that we could leverage? I know that the "Local Education: Content ingestion" is settled. But we need a clear, similar solution for the Global Remote: Curator model and Local Career: Hybrid.7:40 AMCataloging open source career training solutions strategically.The user wants me to research open source programs for Global Remote careers that could be leveraged similar to how MOOSE is used for K-12. They need concrete, established sources they can curate from.
Let me search for:

Open source career training programs
Established free curriculum for tech careers (data analytics, web dev, UX, digital marketing, project management, business analysis)
Programs that are widely recognized and have structure

I should search comprehensively across the 6 Global Remote pathways and the 4 Local Career pathways.Absolutely. Let me research established open-source and free career training programs that could serve as your "MOOSE equivalent" for Global Remote and Local Career tracks.freeCodeCamp curriculum structure certifications open source web development data analysis10 resultsfreeCodeCamp Certificationsfreecodecamp.orgGitHub - freeCodeCamp/freeCodeCamp: freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science for free.github.comWe're Building Data Science Courses with Advanced Mathematics and Machine Learningfreecodecamp.orgPython Certifications are Now Live, and Other freeCodeCamp Version 7.0 Curriculum Updatesfreecodecamp.orgGitHub - FreeCodeCamp-Solutions/freeCodeCamp: freeCodeCamp.org's open source codebase and curriculum. Learn to code at home.github.comGitHub - Tamonne-Cotodie/freeCodeCamp: freeCodeCamp.org's open source codebase and curriculum. Learn to code for free.github.com1000+ Free Developer Certificationsfreecodecamp.orgIntroducing New freeCodeCamp Certifications in the Full Stack Developer Curriculumfreecodecamp.orgFreeCodeCamp - Open Source Agendaopensourceagenda.comfreeCodeCamp's new coding curriculum is now live with 1,400 coding lessons and 6 developer certifications you can earnfreecodecamp.orgSurveyed existing programs and identified gaps across multiple career tracks.The user is asking me to continue researching open source programs for Global Remote careers. I found good information about freeCodeCamp, but I need to research more sources for other career tracks like Digital Marketing, UX Design, Project Management, and also Local Career (vocational/trade) content sources.
Let me search for more specific programs.Let me continue researching more comprehensively across all the Global Remote pathways and Local Career tracks.12 stepsfree healthcare certification training CNA phlebotomy online curriculum open source10 resultsPhlebotomy Technician Certification Training | University of Houstonuh.eduCertified Phlebotomy Technician | Florida Techfit.eduPhlebotomy Course - CNA Technical Center - Courses - (813) 257-9096cnatechnicalcenter.comEKG & Phlebotomy Certification Program | The City College of New Yorkcuny.eduCourses Offered | A Plus CNA Trainingapluscnatraining.comOnline Phlebotomy Class & National Certification | Phlebotomy Career Trainingphlebotomycareertraining.comCertified Phlebotomy Technician Trainingumbc.eduHealthcare Training For Texas: CNA, Phlebotomy, and Seminars.h2hhealth.comCNA Test Prep - Medical Training of the Palm Beachesmedicaltrainingpb.comTaite Healthcare Training - Cna, Education, Schooltaitetraining.infoSynthesized healthcare training constraints and organized findings by career track.Good research on healthcare training. The key insight is that healthcare training (CNA, Phlebotomy, etc.) requires hands-on components and state certification - it's not purely online like web development. Let me now compile my research findings into a comprehensive summary for the user.
Let me organize this information into a clear structure showing what's available for each track type.Now I have comprehensive research. Let me compile this into a clear content source mapping for you.

📊 RESEARCH FINDINGS: Open Source & Free Career Training Programs
GLOBAL REMOTE TRACKS — Content Source Matrix
PMERIT PathwayPrimary SourceLicenseHoursCertificationsIntegration ModelWeb DevelopmentfreeCodeCampBSD-3-Clause (permissive)1,800+ hrs10+ verified certsIngest - can fork curriculumWeb DevelopmentThe Odin ProjectCC BY-NC-SA 4.01,000+ hrsNone (portfolio-based)Hybrid - link + supplementData AnalyticsGoogle Data Analytics (Coursera)Proprietary (audit free)240 hrsGoogle Career CertificateLink - direct to Coursera auditUX DesignGoogle UX Design (Coursera)Proprietary (audit free)200+ hrsGoogle Career CertificateLink - direct to Coursera auditProject ManagementGoogle Project Management (Coursera)Proprietary (audit free)152 hrsGoogle Career Certificate + CAPM prepLink - direct to Coursera auditDigital MarketingHubSpot AcademyProprietary (100% free)50+ hrs26+ industry certificationsLink - external cert trackingDigital MarketingGoogle SkillshopProprietary (100% free)VariableGoogle Ads, Analytics certsLink - external cert trackingBusiness AnalysisGoogle Advanced Data AnalyticsProprietary (audit free)180 hrsGoogle Career CertificateLink - direct to Coursera audit

Detailed Source Analysis
1. freeCodeCamp (BEST FOR WEB DEV)
AttributeDetailsLicenseBSD-3-Clause (extremely permissive - can fork, modify, commercialize)CurriculumBSD-3-Clause for code; CC-BY-SA-4.0 for learning resourcesCertifications10 verified certifications (each ~300 hrs)StructureLinear progression with 5 required projects per certCoursesResponsive Web Design, JS Algorithms, Front End Libraries, Data Visualization, Back End APIs, Scientific Computing (Python), Data Analysis (Python), Machine Learning, Information SecurityRecognition40,000+ developers hired; industry-recognizedGitHubgithub.com/freeCodeCamp/freeCodeCamp
PMERIT Integration: Can fork entire curriculum, host lessons internally, track progress in PMERIT dashboard. This is the closest to a "MOOSE equivalent" for tech careers.

2. The Odin Project (ALTERNATIVE WEB DEV)
AttributeDetailsLicenseCC BY-NC-SA 4.0 (non-commercial; need permission for commercial use)CurriculumWeb Development Foundations → Full Stack JS OR Full Stack RubyCertificationsNone - portfolio-basedStructureProject-based with curated external resourcesCommunity718,000+ Discord membersGitHubgithub.com/TheOdinProject/curriculum
PMERIT Integration: Requires permission for commercial use. Better as supplementary resource or link-to model.

3. Google Career Certificates (DATA, UX, PM)
CertificateCoursesHoursAudit AccessPrep ForData Analytics8 courses240 hrsYes (individual courses)Entry-level analystAdvanced Data Analytics7 courses180 hrsYesSenior analyst, data scientistUX Design7 courses200 hrsYesEntry-level UX designerProject Management6 courses152 hrsYesEntry-level PM + CAPM examDigital Marketing & E-commerce7 courses190 hrsYesEntry-level marketer
Key Insight: Coursera allows auditing individual courses for FREE (no certificate, but full content access). Users can audit all courses, then pay only when ready for certificate.
PMERIT Integration: Link to Coursera audit mode. PMERIT provides supplementary projects, AI tutoring, and portfolio building.

4. HubSpot Academy (DIGITAL MARKETING)
AttributeDetailsCost100% FreeCertifications26+ free certificationsKey CertsDigital Marketing, Content Marketing, Inbound Marketing, SEO, Social Media, Email MarketingFormatVideo lessons + quizzes + practical exercisesRecognitionIndustry gold standard for inbound marketingBadgeShareable certification badges (valid 13 months, renewable)
PMERIT Integration: Link to HubSpot for certification. PMERIT tracks which HubSpot certs users complete, provides portfolio projects.

LOCAL CAREER TRACKS — Content Source Matrix
PMERIT PathwayContent SourceLicenseIntegration ModelNotesSkilled Trades (Safety)OSHA OutreachGovernment (public)HybridOSHA 10/30 required for most jobsSkilled Trades (Safety)Oregon OSHA Free CoursesGovernment (public)IngestCan embed free trainingSkilled Trades (Safety)OSHAcademyFreemiumLinkFree access, paid certificatesHealthcare CareersNHA (National Healthcareer Assoc)ProprietaryLinkCNA, Phlebotomy, EKG certsHealthcare CareersRed Cross TrainingProprietaryLinkFirst Aid, CPR, CNAHospitality & ServiceServSafe (Food Handler)ProprietaryLinkIndustry standardHospitality & ServiceAmerican Hotel & Lodging AssocProprietaryLinkHospitality certifications
Key Challenge: Local Career tracks (healthcare, trades) require:

Hands-on clinical hours (can't be 100% online)
State-specific licensing (varies by state)
Accredited programs for certification eligibility


🎯 Recommended Content Strategy by Track
GLOBAL REMOTE: Curator Model
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL REMOTE CONTENT MODEL                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TIER 1: INGEST (Own the Content)                              │
│  ├── freeCodeCamp curriculum (BSD-3 license)                   │
│  │   → Fork repo, host lessons in PMERIT                       │
│  │   → Track progress in PMERIT dashboard                      │
│  │   → Award PMERIT completion certificates                    │
│  │                                                             │
│  TIER 2: LINK + SUPPLEMENT                                     │
│  ├── Google Career Certificates (Coursera audit)               │
│  │   → Link to Coursera for core lessons                       │
│  │   → PMERIT provides AI tutor support                        │
│  │   → PMERIT provides portfolio projects                      │
│  ├── HubSpot Academy (free certifications)                     │
│  │   → Link to HubSpot for lessons & certs                     │
│  │   → Track external certs in PMERIT profile                  │
│  │                                                             │
│  TIER 3: PMERIT ORIGINAL                                       │
│  ├── Portfolio projects (3-5 per pathway)                      │
│  ├── Capstone assessments                                      │
│  └── AI tutor conversations & feedback                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

LOCAL CAREER: Hybrid Model
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL CAREER CONTENT MODEL                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  THEORY (Online - PMERIT)                                      │
│  ├── Safety fundamentals (OSHA-aligned content)                │
│  ├── Medical terminology                                       │
│  ├── Industry knowledge & regulations                          │
│  ├── Soft skills (customer service, communication)             │
│                                                                 │
│  CERTIFICATION PREP (Online - PMERIT)                          │
│  ├── Practice exams & quizzes                                  │
│  ├── Study guides & flashcards                                 │
│  ├── AI tutor Q&A                                             │
│                                                                 │
│  HANDS-ON (External Partners)                                  │
│  ├── Partner with local community colleges                     │
│  ├── Partner with Maine CTE programs                           │
│  ├── Clinical placements for healthcare                        │
│  ├── Apprenticeship connections for trades                     │
│                                                                 │
│  CERTIFICATION (External)                                      │
│  ├── Link to OSHA Outreach providers                          │
│  ├── Link to NHA for healthcare certs                         │
│  ├── Track external certs in PMERIT profile                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

📋 Summary: The Three-Track Content Architecture
TrackModelPrimary SourcePMERIT RoleLocal Education (K-12)IngestMOOSE (Maine)Host all content, AI tutoringGlobal Remote (Careers)CuratorfreeCodeCamp + Google + HubSpotFork fCC, link others, add projectsLocal Career (Vocational)HybridOSHA + external certs + partnersTheory online, hands-on via partners

❓ Questions for You Before Handoff

freeCodeCamp Integration Depth: Fork and host internally, or link with progress tracking?
Google Certificates Strategy: Direct users to Coursera (audit mode), or embed via API if available?
External Cert Tracking: Should PMERIT database track externally-earned certifications (HubSpot, Google, OSHA)?
Local Career Partnerships: Should we document a partnership model for Maine CTE programs and community colleges?
Ready for Handoff? I can consolidate this research + the scope updates into a single handoff document for Claude Code.
I'm looking for the best and quality, practical, and sustainable pathways for the questions you throw at me. Evalutate options that are avalable, pick the best one. Then, create a handoff.7:48 AMEvaluated integration options and architected sustainable learning pathway recommendations.17sThe user wants me to evaluate the options and make decisive recommendations rather than asking more questions. Let me analyze each decision point and pick the best option based on quality, practicality, and sustainability.
Let me evaluate:

freeCodeCamp Integration Depth


Option A: Fork and host internally
Option B: Link with progress tracking

Evaluation:

Fork and host: Full control, consistent UX, can customize, but requires maintenance burden, need to keep up with fCC updates
Link with progress tracking: Less maintenance, always up-to-date, but less control, users leave platform

Best choice: Hybrid - Fork the curriculum structure (lesson outlines, learning objectives) but link to freeCodeCamp for interactive exercises. Host PMERIT-original portfolio projects. This gives structure without maintenance burden.
Actually, let me reconsider. freeCodeCamp's value is in the interactive coding challenges which are hard to replicate. Better to:

Link to freeCodeCamp for the interactive learning
Track progress via user self-reporting or OAuth integration (if available)
Add PMERIT value through AI tutoring, portfolio projects, and career guidance


Google Certificates Strategy


Option A: Direct to Coursera (audit mode)
Option B: Embed via API

Evaluation:

Coursera doesn't have a public API for embedding course content
Audit mode is free and gives full access to content
Users can pay Coursera directly when ready for certificate

Best choice: Direct to Coursera audit mode with clear instructions on how to audit for free. PMERIT adds value through:

AI tutor support for questions
Portfolio projects that complement Google curriculum
Career guidance and job prep


External Cert Tracking


Option A: Track externally-earned certs
Option B: Don't track

Evaluation:

Tracking adds value - users see complete picture of credentials
Employers like seeing all certs in one place
Implementation is straightforward, involving user-uploaded documentation and optional verification

Best choice: Track external certifications in user profile. Users can easily upload certificate images or PDFs, with an optional verification process to enhance credibility.

Local Career Partnerships


Option A: Document partnership model
Option B: Handle later

Evaluation:

Local Career requires hands-on components
Can't scale without strategic partnerships
Existing Maine CTE system provides a foundation

Best choice: Document partnership model as a Phase 2 initiative. Initial focus will be on Global Remote (fully online) and Local Education platforms.
I'll develop a comprehensive handoff document integrating multiple project scopes. The document will systematically address course documentation, learning pathway updates, content curation strategies, and a clear implementation roadmap.You're right. Let me evaluate and decide.

Evaluation & Decisions
1. freeCodeCamp Integration
OptionProsConsSustainabilityFork & HostFull control, offline capableMaintenance burden, sync issues⚠️ MediumLink OnlyAlways current, no maintenanceUsers leave platform⚠️ MediumHybrid: Link + PMERIT ProjectsBest of both, adds unique valueRequires project creation✅ High
Decision: Hybrid — Link to freeCodeCamp for interactive lessons, add PMERIT-original portfolio projects and AI tutoring. fCC handles curriculum updates; PMERIT adds differentiated value.

2. Google Certificates Strategy
OptionProsConsSustainabilityDirect to Coursera AuditFree, always current, no legal issuesUsers leave platform✅ HighEmbed via APISeamless UXNo public API exists, TOS issues❌ Not feasible
Decision: Direct to Coursera Audit — Provide clear "How to Audit for Free" instructions. PMERIT adds AI tutoring, supplementary projects, and career prep that Coursera doesn't offer.

3. External Certification Tracking
OptionProsConsSustainabilityTrack in PMERITComplete learner profile, employer valueVerification complexity✅ HighDon't TrackSimplerIncomplete picture⚠️ Medium
Decision: Track External Certs — Simple upload system (user submits cert image/PDF). Optional verification badge for validated certs. Creates comprehensive learner portfolio.

4. Local Career Partnerships
OptionProsConsSustainabilityPartner Model (Phase 2)Scalable, leverages existing infrastructureRequires relationship building✅ HighBuild In-HouseFull controlImpossible for hands-on training❌ Not feasible
Decision: Partner Model, Phase 2 — Focus Global Remote first (100% online). Document partnership framework for Maine CTE/community colleges. Activate when user demand proves concept.

Final Content Architecture
PMERIT CONTENT STRATEGY
═══════════════════════

LOCAL EDUCATION (K-12)
├── Source: MOOSE (Maine)
├── Model: INGEST (fully hosted)
├── Status: ✅ 630 lessons seeded
└── AI Enhancement: Tutor personas per subject

GLOBAL REMOTE (Career Training)
├── Web Development
│   ├── Core: freeCodeCamp (link)
│   ├── Alt: The Odin Project (link)
│   └── PMERIT: 5 portfolio projects + AI tutor
├── Data Analytics
│   ├── Core: Google Data Analytics (Coursera audit)
│   └── PMERIT: 3 portfolio projects + AI tutor
├── UX Design
│   ├── Core: Google UX Design (Coursera audit)
│   └── PMERIT: 3 portfolio projects + AI tutor
├── Project Management
│   ├── Core: Google PM (Coursera audit)
│   └── PMERIT: 3 portfolio projects + AI tutor
├── Digital Marketing
│   ├── Core: HubSpot Academy (free certs)
│   ├── Alt: Google Skillshop
│   └── PMERIT: 3 portfolio projects + AI tutor
└── Business Analysis
    ├── Core: Google Advanced Analytics (Coursera audit)
    └── PMERIT: 3 portfolio projects + AI tutor

LOCAL CAREER (Vocational) — PHASE 2
├── Theory: PMERIT-hosted (OSHA-aligned)
├── Certification Prep: PMERIT-hosted
├── Hands-On: Partner referrals (Maine CTE, community colleges)
└── Certification: External provider links

Now let me create the consolidated handoff document.2 stepsPresented fileSynthesized options and architected comprehensive handoff document.I've created the comprehensive handoff document. Let me give the user a concise summary of what was decided and what the handoff contains.Done. Here's the handoff summary:

Session 58 Handoff Complete
Decisions Made
QuestionDecisionRationalefreeCodeCamp IntegrationLink + PMERIT ProjectsfCC handles curriculum updates; PMERIT adds AI tutoring and original portfolio projectsGoogle CertificatesDirect to Coursera AuditFree access, no API needed, PMERIT supplements with projectsExternal Cert TrackingYesSimple upload system, creates complete learner portfolioLocal CareerPhase 2Requires partnerships; focus Global Remote first
Content Architecture
TrackSourceModelLocal EducationMOOSE✅ Already ingestedGlobal RemotefreeCodeCamp + Google + HubSpotLink + SupplementLocal CareerOSHA + PartnersPhase 2
Implementation Sequence

Database — Add content_sources table, pathway career data
API — Syllabus endpoint, pathway filter
Pathways Page — Program Finder, career outcomes, syllabus modal
Courses Page — Remove duplicates, add detail page
Cert Tracking — User profile upload

The handoff document includes SQL schemas, HTML mockups, API specs, and acceptance criteria for Claude Code to implement.


# HANDOFF: Session 58 — Courses, Pathways & Content Curation

**Created:** 2025-12-17
**Author:** Claude Web (Architect)
**For:** Claude Code (Implementer)
**Session:** 58
**Focus:** Learning Pathways discovery, Course registration, Content curation strategy

---

## EXECUTIVE SUMMARY

This handoff consolidates two related scopes that form the educational catalog experience:

1. **SCOPE_Learning_Pathways** — Program discovery (public, no login)
2. **SCOPE_courses** — Course registration (authenticated enrollment)

Additionally, this document establishes the **content curation strategy** for all three tracks, resolving the "where does content come from?" question.

---

## PART 1: CONTENT CURATION ARCHITECTURE

### The Three-Track Model

| Track | Content Model | Primary Source | Status |
|-------|---------------|----------------|--------|
| **Local Education (K-12)** | INGEST | MOOSE (Maine) | ✅ 630 lessons seeded |
| **Global Remote (Careers)** | CURATOR | freeCodeCamp + Google + HubSpot | 🔧 Implement |
| **Local Career (Vocational)** | HYBRID | OSHA + Partners | 📋 Phase 2 |

---

### Global Remote: Curator Model Implementation

#### Content Sources by Pathway

| Pathway | Primary Source | License | Integration |
|---------|----------------|---------|-------------|
| **Web Development** | freeCodeCamp | BSD-3-Clause | Link to fCC |
| **Web Development (Alt)** | The Odin Project | CC BY-NC-SA 4.0 | Link (supplementary) |
| **Data Analytics** | Google Data Analytics | Proprietary (audit free) | Link to Coursera |
| **UX Design** | Google UX Design | Proprietary (audit free) | Link to Coursera |
| **Project Management** | Google Project Management | Proprietary (audit free) | Link to Coursera |
| **Digital Marketing** | HubSpot Academy | Proprietary (100% free) | Link to HubSpot |
| **Digital Marketing (Alt)** | Google Skillshop | Proprietary (100% free) | Link to Google |
| **Business Analysis** | Google Advanced Data Analytics | Proprietary (audit free) | Link to Coursera |

#### PMERIT Value-Add Per Pathway

For each Global Remote pathway, PMERIT provides:

1. **Syllabus** — Structured learning path with course sequence
2. **AI Tutor** — Subject-matter expert persona for Q&A
3. **Portfolio Projects** — 3-5 original projects per pathway
4. **Progress Tracking** — User self-reports completion, PMERIT tracks
5. **External Cert Tracking** — Upload industry certs to profile
6. **Career Guidance** — Salary data, job titles, employer expectations

---

### Database Schema: Content Curation

```sql
-- External content sources
CREATE TABLE IF NOT EXISTS content_sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,           -- "freeCodeCamp", "Google Data Analytics"
    provider VARCHAR(100) NOT NULL,       -- "freeCodeCamp.org", "Coursera"
    url TEXT NOT NULL,                    -- Base URL
    license_type VARCHAR(50),             -- "BSD-3", "CC BY-NC-SA", "Proprietary"
    is_free BOOLEAN DEFAULT TRUE,
    requires_account BOOLEAN DEFAULT TRUE,
    integration_type VARCHAR(20) NOT NULL, -- "link", "embed", "ingest"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link courses to external content
CREATE TABLE IF NOT EXISTS course_external_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    source_id UUID REFERENCES content_sources(source_id),
    external_url TEXT NOT NULL,           -- Direct link to external course/module
    external_title VARCHAR(255),          -- Title as shown on external site
    estimated_hours INTEGER,
    sequence_order INTEGER DEFAULT 1,     -- Order within PMERIT course
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User external certifications
CREATE TABLE IF NOT EXISTS user_external_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    source_id UUID REFERENCES content_sources(source_id),
    certification_name VARCHAR(255) NOT NULL,
    issued_date DATE,
    expiry_date DATE,                     -- Some certs expire (HubSpot = 13 months)
    credential_url TEXT,                  -- Link to verify cert
    certificate_image_url TEXT,           -- Uploaded proof
    is_verified BOOLEAN DEFAULT FALSE,    -- Admin verified
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pathway career outcomes (for discovery page)
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS career_outcomes JSONB;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_min INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS salary_range_max INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS duration_weeks INTEGER;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS program_type VARCHAR(50) DEFAULT 'career_program';
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS primary_content_source_id UUID;

-- Course sequencing within pathway
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 1;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT TRUE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisite_course_id UUID;
```

---

### Seed Data: Content Sources

```sql
INSERT INTO content_sources (name, provider, url, license_type, is_free, requires_account, integration_type) VALUES
('freeCodeCamp', 'freeCodeCamp.org', 'https://www.freecodecamp.org', 'BSD-3-Clause', TRUE, TRUE, 'link'),
('The Odin Project', 'theodinproject.com', 'https://www.theodinproject.com', 'CC BY-NC-SA 4.0', TRUE, FALSE, 'link'),
('Google Data Analytics', 'Coursera', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Proprietary', TRUE, TRUE, 'link'),
('Google UX Design', 'Coursera', 'https://www.coursera.org/professional-certificates/google-ux-design', 'Proprietary', TRUE, TRUE, 'link'),
('Google Project Management', 'Coursera', 'https://www.coursera.org/professional-certificates/google-project-management', 'Proprietary', TRUE, TRUE, 'link'),
('Google Advanced Data Analytics', 'Coursera', 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics', 'Proprietary', TRUE, TRUE, 'link'),
('HubSpot Academy', 'HubSpot', 'https://academy.hubspot.com', 'Proprietary', TRUE, TRUE, 'link'),
('Google Skillshop', 'Google', 'https://skillshop.withgoogle.com', 'Proprietary', TRUE, TRUE, 'link'),
('MOOSE', 'Maine DOE', 'https://moose.maine.gov', 'Public Domain', TRUE, FALSE, 'ingest')
ON CONFLICT DO NOTHING;
```

---

### Seed Data: Pathway Career Outcomes

```sql
-- Update Global Remote pathways with career data
UPDATE pathways SET
    career_outcomes = '["Junior Data Analyst", "Business Intelligence Analyst", "Data Operations Specialist"]',
    salary_range_min = 55000,
    salary_range_max = 75000,
    duration_weeks = 24,
    program_type = 'career_program'
WHERE pathway_slug = 'data-analytics';

UPDATE pathways SET
    career_outcomes = '["Digital Marketing Specialist", "Social Media Manager", "Content Marketing Coordinator"]',
    salary_range_min = 45000,
    salary_range_max = 70000,
    duration_weeks = 20,
    program_type = 'career_program'
WHERE pathway_slug = 'digital-marketing';

UPDATE pathways SET
    career_outcomes = '["Junior UX Designer", "UI/UX Designer", "Product Designer"]',
    salary_range_min = 60000,
    salary_range_max = 85000,
    duration_weeks = 24,
    program_type = 'career_program'
WHERE pathway_slug = 'ux-design';

UPDATE pathways SET
    career_outcomes = '["Junior Web Developer", "Front-End Developer", "Full-Stack Developer"]',
    salary_range_min = 55000,
    salary_range_max = 90000,
    duration_weeks = 28,
    program_type = 'career_program'
WHERE pathway_slug = 'web-development';

UPDATE pathways SET
    career_outcomes = '["Project Coordinator", "Junior Project Manager", "Scrum Master"]',
    salary_range_min = 65000,
    salary_range_max = 95000,
    duration_weeks = 20,
    program_type = 'career_program'
WHERE pathway_slug = 'project-management';

UPDATE pathways SET
    career_outcomes = '["Junior Business Analyst", "Data Analyst", "Operations Analyst"]',
    salary_range_min = 60000,
    salary_range_max = 85000,
    duration_weeks = 20,
    program_type = 'career_program'
WHERE pathway_slug = 'business-analysis';
```

---

## PART 2: SCOPE_Learning_Pathways — Program Discovery

### Purpose

Help users answer: **"Does PMERIT have what I'm looking for?"**

This is the PUBLIC-FACING discovery page. No login required.

### Current State

- **URL:** https://pmerit.com/pathways
- **File:** pathways.html (1139 lines, monolithic)
- **Data:** 14 pathways, 42 courses via API
- **Status:** Working but catalog-oriented, not discovery-oriented

### Requirements

#### R1: Add Program Finder Component

**Location:** Top of page, above pathway sections

```html
<section class="program-finder">
  <h2>Find Your Program</h2>
  <div class="finder-options">
    <label>
      <input type="radio" name="track" value="global_remote">
      <span>Remote Career Training</span>
      <small>Work from anywhere in digital careers</small>
    </label>
    <label>
      <input type="radio" name="track" value="local_education">
      <span>K-12 Education</span>
      <small>Maine-aligned curriculum for students</small>
    </label>
    <label>
      <input type="radio" name="track" value="local_career">
      <span>Trade & Vocational</span>
      <small>Hands-on career training</small>
    </label>
  </div>
  <div class="finder-actions">
    <button id="show-programs">Show Programs</button>
    <a href="/assessment">Or Take Career Assessment →</a>
  </div>
</section>
```

**Behavior:** Selection scrolls to corresponding track section and highlights it.

---

#### R2: Reframe Global Remote as Career Programs

**Current pathway card:**
```
Data Analytics
Learn to analyze data, create visualizations...
```

**New pathway card structure:**

```html
<div class="pathway-card career-program">
  <div class="card-header">
    <span class="program-badge">Career Program</span>
    <h3>Data Analyst Career Program</h3>
  </div>
  
  <div class="card-meta">
    <span class="duration">📅 6 months</span>
    <span class="level">🎯 Beginner-friendly</span>
  </div>
  
  <div class="career-outcomes">
    <h4>Career Outcomes</h4>
    <ul>
      <li>Junior Data Analyst <span class="salary">$55K-$75K</span></li>
      <li>Business Intelligence Analyst</li>
      <li>Data Operations Specialist</li>
    </ul>
  </div>
  
  <div class="card-actions">
    <button class="btn-primary" onclick="showSyllabus('data-analytics')">
      View Syllabus
    </button>
    <a href="/courses?pathway=data-analytics" class="btn-secondary">
      Browse Courses
    </a>
  </div>
</div>
```

---

#### R3: Add Program Syllabus Modal/Accordion

When user clicks "View Syllabus," show complete program structure:

```html
<div class="syllabus-modal" id="syllabus-data-analytics">
  <div class="syllabus-header">
    <h2>Data Analyst Career Program</h2>
    <p>Master data analysis skills and launch your analytics career</p>
  </div>
  
  <div class="syllabus-overview">
    <div class="stat">
      <strong>Duration:</strong> 6 months (part-time)
    </div>
    <div class="stat">
      <strong>Commitment:</strong> 10-15 hours/week
    </div>
    <div class="stat">
      <strong>Prerequisites:</strong> None
    </div>
  </div>
  
  <div class="syllabus-courses">
    <h3>Required Courses</h3>
    
    <div class="course-item">
      <span class="sequence">1</span>
      <div class="course-info">
        <h4>Python for Data Analysis</h4>
        <p>Learn Python basics and data manipulation with Pandas</p>
        <div class="course-meta">
          <span>4 weeks</span>
          <span>Beginner</span>
          <span class="source">📚 freeCodeCamp</span>
        </div>
      </div>
    </div>
    
    <div class="course-item">
      <span class="sequence">2</span>
      <div class="course-info">
        <h4>SQL Fundamentals</h4>
        <p>Query databases and extract insights</p>
        <div class="course-meta">
          <span>3 weeks</span>
          <span>Beginner</span>
          <span class="source">📚 freeCodeCamp</span>
        </div>
      </div>
    </div>
    
    <!-- More courses... -->
    
    <div class="course-item capstone">
      <span class="sequence">★</span>
      <div class="course-info">
        <h4>Capstone: Analytics Portfolio Project</h4>
        <p>Build a complete data analysis project for your portfolio</p>
        <div class="course-meta">
          <span>4 weeks</span>
          <span>Applied</span>
          <span class="source">🎯 PMERIT Original</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="syllabus-certifications">
    <h3>Prepare For Industry Certifications</h3>
    <ul>
      <li>Google Data Analytics Certificate</li>
      <li>IBM Data Analyst Professional Certificate</li>
    </ul>
  </div>
  
  <div class="syllabus-actions">
    <a href="/signup?pathway=data-analytics" class="btn-primary">
      Start This Program
    </a>
    <a href="/courses?pathway=data-analytics" class="btn-secondary">
      Browse Individual Courses
    </a>
  </div>
</div>
```

---

#### R4: API Enhancement for Syllabus Data

**New endpoint:** `GET /api/v1/pathways/:slug/syllabus`

**Response:**
```json
{
  "success": true,
  "pathway": {
    "pathway_id": "...",
    "pathway_name": "Data Analytics",
    "pathway_slug": "data-analytics",
    "program_type": "career_program",
    "duration_weeks": 24,
    "salary_range_min": 55000,
    "salary_range_max": 75000,
    "career_outcomes": ["Junior Data Analyst", "BI Analyst", "Data Ops"],
    "description": "...",
    "courses": [
      {
        "course_id": "...",
        "title": "Python for Data Analysis",
        "sequence_order": 1,
        "is_required": true,
        "estimated_hours": 20,
        "difficulty_level": "beginner",
        "external_content": [
          {
            "source_name": "freeCodeCamp",
            "external_url": "https://www.freecodecamp.org/learn/data-analysis-with-python/",
            "external_title": "Data Analysis with Python"
          }
        ]
      }
    ],
    "certifications_prep": ["Google Data Analytics Certificate"],
    "content_sources": ["freeCodeCamp", "Google Data Analytics (Coursera)"]
  }
}
```

---

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `pathways.html` | Modify | Add Program Finder, enhance pathway cards |
| `assets/css/pathways.css` | Create | Extract inline styles |
| `assets/js/pathways.js` | Create | Extract inline JS, add syllabus modal |
| `src/routes/curriculum.ts` | Modify | Add syllabus endpoint |

---

## PART 3: SCOPE_courses — Course Registration

### Purpose

Allow users to **search, filter, and enroll** in specific courses.

This requires authentication for enrollment actions.

### Current State

- **URL:** https://pmerit.com/courses
- **File:** courses.html (~1198 lines)
- **Data:** 42 courses via API
- **Status:** Working, but duplicates pathway discovery content

### Requirements

#### R1: Remove Discovery Content from courses.html

**Remove:** "Career Tracks" hero section (duplicates pathways.html)

**Keep:** Course catalog with filters

**Result:** Clean separation — pathways.html for discovery, courses.html for registration

---

#### R2: Add Pathway Filter Parameter

**URL pattern:** `/courses?pathway=data-analytics`

**Behavior:**
- Pre-filter course list by pathway
- Show breadcrumb: "Data Analytics → All Courses"
- "Clear Filter" returns to full catalog

**Implementation:**
```javascript
// On page load
const params = new URLSearchParams(window.location.search);
const pathwayFilter = params.get('pathway');

if (pathwayFilter) {
  // Fetch pathway name for breadcrumb
  // Apply filter to course list
  // Show "Showing courses in Data Analytics program"
}
```

---

#### R3: Create Course Detail Page

**New page:** `/course/:slug` (course-detail.html)

**Purpose:** Full course information before enrollment decision

**Sections:**
1. Course header (title, instructor, duration, level)
2. Description & learning objectives
3. Module list with lesson counts
4. External content sources (with links)
5. Prerequisites (if any)
6. Enrollment CTA

```html
<main class="course-detail">
  <header class="course-header">
    <nav class="breadcrumb">
      <a href="/pathways">Programs</a> → 
      <a href="/courses?pathway=data-analytics">Data Analytics</a> → 
      <span>Python for Data Analysis</span>
    </nav>
    
    <h1>Python for Data Analysis</h1>
    
    <div class="course-meta">
      <span class="instructor">👤 Dr. Sarah Chen</span>
      <span class="duration">⏱️ 20 hours</span>
      <span class="level">📊 Beginner</span>
    </div>
  </header>
  
  <section class="course-description">
    <h2>About This Course</h2>
    <p>Learn Python basics and data manipulation with Pandas...</p>
    
    <h3>What You'll Learn</h3>
    <ul>
      <li>Python fundamentals for data work</li>
      <li>Data manipulation with Pandas</li>
      <li>Data visualization basics</li>
    </ul>
  </section>
  
  <section class="course-content">
    <h2>Course Content</h2>
    
    <div class="content-source">
      <h3>📚 Primary Content: freeCodeCamp</h3>
      <p>This course uses content from freeCodeCamp's Data Analysis with Python certification.</p>
      <a href="https://www.freecodecamp.org/learn/data-analysis-with-python/" 
         target="_blank" rel="noopener">
        View on freeCodeCamp →
      </a>
    </div>
    
    <div class="module-list">
      <h3>Modules</h3>
      <div class="module">
        <h4>Module 1: Python Basics</h4>
        <span>5 lessons</span>
      </div>
      <div class="module">
        <h4>Module 2: Pandas Fundamentals</h4>
        <span>6 lessons</span>
      </div>
      <!-- More modules -->
    </div>
    
    <div class="pmerit-additions">
      <h3>🎯 PMERIT Additions</h3>
      <ul>
        <li>AI Tutor support for questions</li>
        <li>Portfolio project: Analyze a real dataset</li>
        <li>Progress tracking in your dashboard</li>
      </ul>
    </div>
  </section>
  
  <aside class="enrollment-sidebar">
    <div class="enrollment-card">
      <div class="price">Free</div>
      <button class="btn-enroll" id="enroll-btn">
        Enroll Now
      </button>
      <p class="enroll-note">
        Requires free account. <a href="/signup">Sign up</a>
      </p>
    </div>
  </aside>
</main>
```

---

#### R4: Enrollment Flow

```
User on course-detail.html
    │
    ├── NOT logged in
    │   └── Click "Enroll Now"
    │       └── Auth modal appears
    │           └── After login/signup → Auto-enroll → Redirect to dashboard
    │
    └── Logged in
        └── Click "Enroll Now"
            └── POST /api/v1/courses/:id/enroll
                └── Success → Redirect to dashboard with success toast
```

---

### Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `courses.html` | Modify | Remove Career Tracks section, add pathway filter |
| `course-detail.html` | Create | New page for individual course view |
| `assets/js/course-detail.js` | Create | Course detail page logic |
| `assets/css/course-detail.css` | Create | Course detail page styles |

---

## PART 4: IMPLEMENTATION SEQUENCE

### Phase 1: Database Schema (Backend)

1. Run schema migrations (content_sources, course_external_content, user_external_certifications)
2. Add columns to pathways table (career_outcomes, salary_range, duration_weeks)
3. Seed content_sources table
4. Update Global Remote pathways with career data

### Phase 2: API Enhancements (Backend)

1. Create `GET /api/v1/pathways/:slug/syllabus` endpoint
2. Modify `GET /api/v1/courses` to support `?pathway=` filter
3. Create `GET /api/v1/course/:slug` for course detail

### Phase 3: Learning Pathways Page (Frontend)

1. Extract inline CSS/JS to external files
2. Add Program Finder component
3. Enhance pathway cards with career outcomes
4. Implement syllabus modal

### Phase 4: Courses Page (Frontend)

1. Remove "Career Tracks" section
2. Implement pathway filter from URL params
3. Create course-detail.html page
4. Update enrollment flow

### Phase 5: External Cert Tracking (Both)

1. Add cert upload UI to user profile
2. Create `POST /api/v1/users/:id/certifications` endpoint
3. Display external certs on profile page

---

## ACCEPTANCE CRITERIA

### Learning Pathways Page

- [ ] Program Finder component at top of page
- [ ] Pathway cards show career outcomes and salary ranges
- [ ] "View Syllabus" opens modal with course sequence
- [ ] "Browse Courses" links to `/courses?pathway=slug`
- [ ] Page works without login

### Courses Page

- [ ] No duplicate discovery content (Career Tracks removed)
- [ ] `/courses?pathway=data-analytics` filters correctly
- [ ] Breadcrumb shows when filtered
- [ ] Course cards link to detail page

### Course Detail Page

- [ ] Shows full course info including external content sources
- [ ] Shows modules/lesson structure
- [ ] "Enroll Now" triggers auth if not logged in
- [ ] After enrollment, redirects to dashboard

### Database

- [ ] content_sources table created and seeded
- [ ] pathways table has career outcome data
- [ ] course_external_content table ready for linking

---

## OUT OF SCOPE (Future)

- Course ratings/reviews system
- Course thumbnails (custom images)
- Module/lesson content creation admin UI
- Local Career partnership implementation
- External certification verification workflow

---

## REFERENCE: Content Source URLs

| Source | URL | Access |
|--------|-----|--------|
| freeCodeCamp | https://www.freecodecamp.org/learn | Free, account required |
| The Odin Project | https://www.theodinproject.com/paths | Free, no account needed |
| Google Data Analytics | https://www.coursera.org/professional-certificates/google-data-analytics | Audit free |
| Google UX Design | https://www.coursera.org/professional-certificates/google-ux-design | Audit free |
| Google Project Management | https://www.coursera.org/professional-certificates/google-project-management | Audit free |
| HubSpot Academy | https://academy.hubspot.com | Free, account required |
| Google Skillshop | https://skillshop.withgoogle.com | Free, Google account |

---

## SESSION NOTES

**Key Decisions Made:**
1. Global Remote uses Curator model (link to external, add PMERIT value)
2. freeCodeCamp is primary source for Web Development (BSD-3 license)
3. Google Certificates via Coursera audit mode (free access to content)
4. External certifications tracked in user profile
5. Local Career deferred to Phase 2 (requires partnerships)

**Token Status:** Handoff created proactively to ensure continuity.

---

*Last Updated: 2025-12-17 (Session 58)*