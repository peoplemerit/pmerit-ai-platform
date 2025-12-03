Let's brainstorm Idea for curriculum implementation.


Surveyed curriculum framework and prepared collaborative brainstorming session.


I'd be happy to brainstorm curriculum implementation ideas with you! Let me first pull up the existing curriculum framework and plans from the project knowledge to ensure our brainstorming builds on what's already established.


2 steps

Searched project for “Global Remote Track Local Career Track 12 courses dual pathways Nigeria employment”
5 results










Synthesized curriculum structure across multiple career pathways.


Excellent! I found comprehensive information about the existing curriculum architecture. Let me synthesize what's already planned and then brainstorm implementation ideas.

🎓 PMERIT Curriculum Implementation Brainstorm
📊 Current Foundation
Based on the project knowledge, you have:

Dual Career Tracks Structure:

Track Type	Focus	Examples
Global Remote (6 pathways)	Work-from-anywhere careers	Data Analytics, Web Development, UX Design, Digital Marketing, Project Management, Business Analysis
Local Education (4 pathways)	Age-based learning	Early Childhood → Primary → Secondary → College
Local Career (4 pathways)	Location-based careers	Healthcare, Skilled Trades, Hospitality, Public Service
Database Tables Ready:

career_pathways - Links careers to educational requirements
courses - Individual course definitions
course_modules - Module structure within courses
lessons - Individual lesson content
lesson_progress - Student tracking
💡 Brainstorm Ideas for Implementation
1. Competency-Based vs. Time-Based Curriculum
Option A: Traditional Time-Based

12 courses per track × 4 weeks per course = 48 weeks to completion
Fixed schedule, structured progression
Familiar to learners from traditional education
Option B: Competency-Based (Recommended for PMERIT Mission)

Learners advance when they demonstrate mastery
Ideal for working adults in Nigeria/rural US with irregular schedules
Supports "poverty liberation" goal — faster path to employment
AI tutor assesses competency, not just seat time
Hybrid Approach:

Course Structure:
├── Module 1: Foundational Concepts
│   ├── Lesson 1.1 (Self-paced learning)
│   ├── Lesson 1.2 
│   └── Module Assessment (Must pass to unlock Module 2)
├── Module 2: Applied Skills
│   └── Project-Based Learning (Demonstrate competency)
└── Course Capstone: Real-World Portfolio Piece
2. "12 Courses per Track" Implementation Model
For Global Remote Track: Web Development example:

Course #	Course Name	Duration	Key Competency
1	HTML & CSS Fundamentals	2 weeks	Build static webpage
2	JavaScript Essentials	4 weeks	Interactive UI elements
3	Responsive Design	2 weeks	Mobile-first development
4	Version Control (Git)	1 week	Collaborate on code
5	React Fundamentals	4 weeks	Build component-based apps
6	Backend with Node.js	4 weeks	Create REST APIs
7	Database Design	3 weeks	Design & query databases
8	Authentication & Security	2 weeks	Secure user systems
9	Cloud Deployment	2 weeks	Deploy to production
10	API Integration	2 weeks	Connect third-party services
11	Testing & QA	2 weeks	Write automated tests
12	Portfolio Capstone	4 weeks	Complete project showcase
Total: ~32 weeks to job-ready

3. Cultural Adaptation Framework
Content Localization Tiers:

Tier	Description	Example
Universal	Core technical content	"A variable stores data"
Contextual	Examples adapted to region	Nigeria: "Calculate naira exchange rate" vs US: "Calculate sales tax"
Cultural	References & analogies	Nigeria: "Think of it like organizing goods at Balogun Market"
Language	Full translation	English, Yoruba, Igbo, Hausa
Implementation:

javascript
// Content structure with cultural variants
{
  lesson_id: "js-variables-101",
  content: {
    universal: "Variables are containers for storing data values.",
    contextual: {
      nigeria: "Let's calculate the price of gari in naira...",
      us_rural: "Let's calculate feed costs for your farm..."
    },
    cultural: {
      yoruba: "Ronu bi apoti ti o fi pamọ nkan...",
      igbo: "Chee echiche dịka igbe ebe i na-echekwa ihe..."
    }
  }
}
```

---

#### **4. AI-Driven Personalized Pathways**

**Personality Assessment → Course Sequencing:**
```
Ibrahim (Nigeria) Assessment Results:
├── Big Five: High Conscientiousness, Low Extraversion
├── Holland Code: Investigative-Realistic
├── Learning Style: Visual learner
└── Current Skills: Basic computer literacy

AI Recommendation:
├── Track: Data Analytics (matches Investigative)
├── Learning Mode: Self-paced (matches low extraversion)
├── Content Format: Video-heavy (matches visual)
└── First Course: Python Fundamentals (skill gap identified)
```

---

#### **5. Employment-Linked Curriculum Design**

**"Learn → Earn" Model:**

| Stage | Activity | Outcome |
|-------|----------|---------|
| **Course 1-3** | Foundational skills | Eligible for micro-tasks |
| **Course 4-6** | Intermediate skills | Eligible for freelance gigs |
| **Course 7-9** | Professional skills | Eligible for part-time remote |
| **Course 10-12** | Advanced + Portfolio | Job-ready for full-time |

**Integrated Job Market Features:**
- Course completion unlocks job board access
- Portfolio pieces visible to employers
- Skills automatically update career profile
- NBS (Nigeria) / BLS (US) job matching active

---

#### **6. Offline-First Curriculum Architecture**

For learners with unreliable internet (critical for Nigerian rural areas):

**Offline Content Package:**
```
/offline-pack/data-analytics-module-1/
├── lessons/
│   ├── lesson-1.1-intro.mp4 (compressed)
│   ├── lesson-1.1-transcript.txt
│   └── lesson-1.1-quiz.json
├── exercises/
│   ├── practice-problems.json
│   └── sample-datasets.csv
├── ai-tutor/
│   └── cached-responses.json (common questions)
└── sync-manifest.json (for reconnection)
Sync Strategy:

Download content when connected
Complete lessons offline
Sync progress when back online
AI tutor provides cached responses for common questions
7. Implementation Phases
Phase	Focus	Deliverable
Phase 1	One Complete Track MVP	Web Development (12 courses, 48 lessons minimum)
Phase 2	Second Track + Assessment Integration	Data Analytics + career matching
Phase 3	Local Career Pathways	Healthcare, Trades (location-specific content)
Phase 4	Full Curriculum Library	All 6 Global + 4 Local tracks
🤔 Questions to Clarify Direction
Content Creation Strategy:
Build from scratch?
Partner with existing providers (Khan Academy, freeCodeCamp)?
Curate open educational resources (OER)?
AI-generated content with human review?
Course Pricing Model:
All free forever (mission-aligned)?
Freemium (basic free, premium $2.99-$4.99)?
Compassionate accountability ($0.50 after 3rd attempt)?
Certification/Credentialing:
Internal PMERIT certificates?
Partner with recognized bodies?
Blockchain-verified credentials?
First Track to Build:
Web Development (high demand globally)?
Data Analytics (aligns with AI platform)?
Digital Marketing (lower technical barrier)?
What aspects would you like to explore deeper? I can help:

Map out a specific track with all 12 courses detailed
Design the content creation workflow
Plan the database implementation for curriculum
Create the AI tutor integration strategy
Develop the offline-first architecture
1764638243905_image.png
I am considering the Global Remote (6 pathways) as one track on its own (this is settled). I'm thinking we should pick a model and tailor everything based on that.  Creating individual localized education might not be practical for now. Since the US and Nigeria are the primary focus, I would like us to use the Maine Educational system as a model. There's an existing structure for that; we will just tailor the existing structure to fit into the objectives here. We model it around the idea in the image. What do you think?


Validated Maine's educational framework as adaptable model for dual-region implementation.
15s








This is a brilliant strategic decision! Let me explain why this approach makes so much sense:

🎯 Why the Maine Model is Smart
Practical Benefits:

You're based in Maine — Direct familiarity and access to resources
Maine has documented standards — Maine Learning Results (MLR) + Common Core alignment
Transferable structure — Same framework adapts to Nigeria with cultural localization
Reduces development complexity — Build once, adapt twice (US + Nigeria)
Credibility — Based on an established, accredited educational system
Strategic Alignment:

Maine's rural communities mirror your US target audience
Maine already has Career and Technical Education (CTE) pathways
The structure scales globally once proven
📐 Proposed Two-Track Model
Track	Structure	Target Learners
Global Remote	6 career pathways × 12 courses each	Adults seeking remote work globally
Local Education	Maine K-12 model adapted	Age-based learners (US + Nigeria)
🔍 Let Me Research Maine's Structure
Would you like me to search for Maine's educational standards and framework so we can map it to PMERIT's objectives?

I can look for:

Maine Learning Results (K-12 standards)
Maine's CTE (Career & Technical Education) pathways
Grade-level competencies
How Maine structures Early Childhood → College readiness
Then we can create a concrete mapping:

Maine Standard → PMERIT Adaptation → Nigeria Localization
Should I search for Maine's educational framework now? This will give us the foundation to build the Local Education track properly.

1764638568392_image.png
Let's make it happen then. Create an implementation plan and phase it from start to finish. Note that we have certain structures in place, see the images. In addition to the implementation plan, see the access flow below. Guess users visiting the page will be able to see sample curricula on the front page when they click "Career Track & Explore Paths". The sample curricula will touch on each offering track (Track Type) Global Remote (6 pathways), Local Education (4 pathways), and Local Career (4 pathways). The real Track Type will be linked to the Dashboard, Classroom, and Admin. For a student, Once a student subscribes to the platform and the student's account and Dashboard are situated, they will have access to the curriculum of their chosen to add and drop classes/subjects/courses. Class added by the student will be under their account on the dashboard; The classes will auto flow to classrooms as the student finishes one class, or the student could add the classes manually.  For the Admin, the purpose is to manage curriculum, classes, courses, and materials. The Admin part will be designed to enable admin personnel to build curriculum and materials without having to write code.

Show more

Architecting two-track curriculum model with integrated access flows.



This is excellent clarity! Let me search for Maine's educational framework first, then create a comprehensive implementation plan.


2 steps

Maine Career Technical Education CTE pathways programs high school
10 results






















Synthesized Maine's educational framework to architect comprehensive implementation plan.



Excellent research! I now have a clear picture of Maine's educational framework. Let me create a comprehensive implementation plan.


2 steps

Copy implementation plan to outputs for user download



Synthesized implementation strategy and solicited constructive feedback.

I've created a comprehensive implementation plan! Here's the summary:

📋 PMERIT Curriculum Implementation Plan - Summary
View your complete plan

🎯 Key Decisions Confirmed
Decision	Details
Model Basis	Maine Learning Results + Maine CTE
Track 1	Global Remote (6 pathways, 12 courses each) — Standalone
Track 2	Local Education (4 pathways) — Maine K-12 adapted
Track 3	Local Career (4 pathways) — Maine CTE consolidated
👥 User Flows Defined
User Type	Access	Key Features
Public/Guest	"Career Track & Explore Paths"	Sample curricula preview, conversion to signup
Student (Subscribed)	Dashboard + Classroom	Add/drop courses, learning environment, progress tracking
Admin	Curriculum Builder	No-code interface to manage all content
🗄️ Database Additions
14 new tables required:

pathways, courses, course_modules, lessons
materials, material_attachments
pathway_enrollments, course_enrollments, lesson_progress
assessments, assessment_questions, assessment_attempts
content_translations, cultural_adaptations
📅 6-Phase Timeline
Phase	Duration	Focus
Phase 1	Weeks 1-3	Foundation (Database + Admin)
Phase 2	Weeks 4-6	Public Experience (Sample Curricula)
Phase 3	Weeks 7-10	Student Experience (Dashboard + Classroom)
Phase 4	Weeks 11-16	Content Population (First Complete Pathway)
Phase 5	Weeks 17-19	Localization (Nigeria Adaptation)
Phase 6	Ongoing	Scale (Additional Pathways)
Estimated Total to First Complete Pathway: ~16-19 weeks

❓ Questions for You
Do you approve this overall structure?
Which pathway should be the FIRST to build completely?
Web Development (high global demand)
Data Analytics (aligns with AI platform identity)
Digital Marketing (lower technical barrier)
Should we start Phase 1 (database + admin) now?
Any adjustments to the Admin no-code builder features?
Let me know your thoughts and we can begin implementation!

Pmerit curriculum implementation plan
# 📚 PMERIT CURRICULUM IMPLEMENTATION PLAN
## Maine-Model Educational Framework with Global Adaptation

**Version:** 1.0  
**Created:** December 1, 2025  
**Status:** Strategic Planning Document  

---

## 🎯 Executive Summary

This document outlines the complete implementation plan for PMERIT's curriculum system, using Maine's educational framework as the foundational model. The plan covers three distinct track types, user access flows, database architecture, and a phased rollout strategy.

---

## 📊 Track Structure Overview

### The Three Track Types

| Track Type | Pathways | Focus | Model Basis |
|------------|----------|-------|-------------|
| **Global Remote** | 6 | Work-from-anywhere careers | Industry-aligned competencies |
| **Local Education** | 4 | Age-based learning (PreK-College) | Maine Learning Results + CTE |
| **Local Career** | 4 | Location-based careers | Maine CTE 16 Career Clusters |

---

## 🏫 TRACK 1: Global Remote (6 Pathways)

### Structure
Each pathway = 12 courses × ~4-6 weeks per course = 48-72 weeks to completion

### The 6 Global Remote Pathways

| # | Pathway | Core Competencies | Target Outcome |
|---|---------|-------------------|----------------|
| 1 | **Data Analytics** | Python, SQL, Tableau, Statistics | Data Analyst roles |
| 2 | **Digital Marketing** | SEO, Social Media, Content Strategy, Analytics | Marketing Specialist |
| 3 | **UX Design** | Figma, User Research, Prototyping, UI Design | UX/UI Designer |
| 4 | **Web Development** | HTML/CSS, JavaScript, React, Node.js | Full-Stack Developer |
| 5 | **Project Management** | Agile, Scrum, Risk Management, Stakeholder Comm | Project Manager |
| 6 | **Business Analysis** | Requirements Gathering, Process Mapping, SQL | Business Analyst |

### Sample: Web Development Pathway (12 Courses)

| Course # | Course Title | Duration | Prerequisites | Key Deliverable |
|----------|--------------|----------|---------------|-----------------|
| WD-101 | HTML & CSS Fundamentals | 2 weeks | None | Static portfolio page |
| WD-102 | JavaScript Essentials | 4 weeks | WD-101 | Interactive calculator |
| WD-103 | Responsive Design | 2 weeks | WD-102 | Mobile-first website |
| WD-104 | Version Control (Git) | 1 week | WD-102 | GitHub portfolio |
| WD-105 | React Fundamentals | 4 weeks | WD-104 | React todo app |
| WD-106 | Backend with Node.js | 4 weeks | WD-105 | REST API |
| WD-107 | Database Design | 3 weeks | WD-106 | PostgreSQL integration |
| WD-108 | Authentication & Security | 2 weeks | WD-107 | Secure login system |
| WD-109 | Cloud Deployment | 2 weeks | WD-108 | Live deployed app |
| WD-110 | API Integration | 2 weeks | WD-109 | Third-party API usage |
| WD-111 | Testing & QA | 2 weeks | WD-110 | Automated test suite |
| WD-112 | Capstone Project | 4 weeks | All above | Full-stack portfolio project |

**Total Duration:** ~32 weeks to job-ready

---

## 🏫 TRACK 2: Local Education (4 Pathways) — Maine Model

### Based on Maine Learning Results Structure

Maine organizes education into **8 Content Areas** across **4 Grade Spans**:

#### Maine's 8 Content Areas (Adapted for PMERIT)
1. English Language Arts (ELA)
2. Mathematics
3. Science & Engineering
4. Social Studies
5. Health & Physical Education
6. Visual & Performing Arts
7. World Languages
8. Life & Career Readiness

#### Maine's Grade Spans (PMERIT Adaptation)

| Pathway | Maine Equivalent | Age Range | Grade Levels | Focus |
|---------|------------------|-----------|--------------|-------|
| **Early Childhood** | Pre-K to Grade 2 | Ages 3-7 | PreK, K, 1, 2 | Foundational literacy & numeracy |
| **Primary** | Childhood (K-5) | Ages 5-11 | K, 1, 2, 3, 4, 5 | Core academic skills |
| **Secondary** | Early Adolescence + Adolescence | Ages 11-18 | 6, 7, 8, 9, 10, 11, 12 | College & career prep |
| **College** | Post-secondary | Ages 18+ | Higher Ed | Degree pathways |

### Sample: Secondary Education Pathway

#### Grade Level Structure (Based on Maine Learning Results)

**Middle School (Grades 6-8)**
| Subject | Maine Standard Alignment | Weekly Hours | Competencies |
|---------|-------------------------|--------------|--------------|
| English Language Arts | MLR-ELA 6-8 | 5 hrs | Reading comprehension, writing, speaking |
| Mathematics | MLR-Math 6-8 (Algebraic Reasoning) | 5 hrs | Pre-algebra, ratios, geometry basics |
| Science | MLR-Science 6-8 | 4 hrs | Life science, earth science, physical science |
| Social Studies | MLR-SS 6-8 | 3 hrs | World geography, civics, economics basics |
| Health/PE | MLR-Health 6-8 | 2 hrs | Wellness, decision-making, physical fitness |
| Electives | Various | 2 hrs | Arts, technology, world languages |

**High School (Grades 9-12)**
| Subject | Maine Standard Alignment | Credits Required | Notes |
|---------|-------------------------|-----------------|-------|
| English Language Arts | MLR-ELA 9-Diploma | 4 credits | Literature, composition, communication |
| Mathematics | MLR-Math 9-Diploma | 4 credits | Algebra I/II, Geometry, Statistics/Calculus |
| Science | MLR-Science 9-Diploma | 3 credits | Biology, Chemistry, Physics |
| Social Studies | MLR-SS 9-Diploma | 3 credits | US History, World History, Government |
| Health/PE | MLR-Health 9-Diploma | 1 credit | Health education, physical fitness |
| Visual/Performing Arts | MLR-Arts 9-Diploma | 1 credit | Art, music, drama, media |
| World Languages | MLR-WL 9-Diploma | 2 credits | Spanish, French, or other |
| Electives | Various | 4+ credits | CTE pathways, AP courses |

### Nigeria Adaptation

The same Maine structure adapts to Nigeria by:
1. **Mapping to Nigerian Educational Levels:**
   - Early Childhood → Early Child Care Development Education (ECCDE)
   - Primary → Primary Education (Basic 1-6)
   - Secondary → Junior Secondary (JSS 1-3) + Senior Secondary (SSS 1-3)
   - College → Tertiary Education

2. **Cultural Content Localization:**
   - Local history and geography content
   - Nigerian civic education
   - Indigenous language options (Yoruba, Igbo, Hausa)
   - Culturally relevant examples and case studies

---

## 🏫 TRACK 3: Local Career (4 Pathways) — Maine CTE Model

### Based on Maine's 16 Career Clusters (Consolidated to 4)

Maine's CTE system uses **16 Career Clusters** with **79 Career Pathways**. For PMERIT, we consolidate into 4 primary pathways:

| PMERIT Pathway | Maine CTE Clusters Included | Example Careers |
|----------------|----------------------------|-----------------|
| **Healthcare Careers** | Health Science | CNA, EMT, Medical Assistant, Nursing |
| **Skilled Trades** | Architecture & Construction, Manufacturing, Transportation | Electrician, Plumber, Welder, Automotive Tech |
| **Hospitality & Service** | Hospitality & Tourism, Human Services | Culinary Arts, Hotel Management, Food Service |
| **Public Service** | Government & Public Admin, Law/Public Safety, Education | Law Enforcement, Firefighting, Teaching Assistant |

### Sample: Skilled Trades Pathway

#### Based on Maine CTE Programs

| Course Code | Course Title | Duration | Certification | Career Link |
|-------------|--------------|----------|---------------|-------------|
| ST-101 | Trade Foundations | 4 weeks | OSHA 10 | All trades |
| ST-102 | Blueprint Reading | 3 weeks | — | Construction, Manufacturing |
| ST-103 | Basic Electrical | 6 weeks | — | Electrician pathway |
| ST-104 | Plumbing Fundamentals | 6 weeks | — | Plumber pathway |
| ST-105 | HVAC Basics | 6 weeks | EPA 608 | HVAC Technician |
| ST-106 | Welding & Fabrication | 8 weeks | AWS Certification | Welder |
| ST-107 | Automotive Technology | 8 weeks | ASE Prep | Auto Mechanic |
| ST-108 | Building Construction | 8 weeks | — | Carpenter, Builder |
| ST-109 | Machine Tool Operation | 6 weeks | — | CNC Operator |
| ST-110 | Safety & Compliance | 2 weeks | OSHA 30 | All trades |
| ST-111 | Apprenticeship Prep | 4 weeks | — | Union pathways |
| ST-112 | Trade Capstone | 6 weeks | Portfolio | Employment ready |

---

## 👥 USER ACCESS FLOWS

### Flow 1: Public/Guest Access

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PUBLIC USER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Visit pmerit.com                                                   │
│       │                                                             │
│       ▼                                                             │
│  Homepage (AI Chat + Quick Actions)                                 │
│       │                                                             │
│       ▼                                                             │
│  Click "Career Track & Explore Paths"                               │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              SAMPLE CURRICULA (Preview Mode)                │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │  Tab 1: Global Remote Tracks (6 pathways)                   │    │
│  │    • Data Analytics (preview 2 courses)                     │    │
│  │    • Digital Marketing (preview 2 courses)                  │    │
│  │    • UX Design (preview 2 courses)                          │    │
│  │    • Web Development (preview 2 courses)                    │    │
│  │    • Project Management (preview 2 courses)                 │    │
│  │    • Business Analysis (preview 2 courses)                  │    │
│  │                                                             │    │
│  │  Tab 2: Local Education (4 pathways)                        │    │
│  │    • Early Childhood (preview curriculum map)               │    │
│  │    • Primary School (preview curriculum map)                │    │
│  │    • Secondary School (preview curriculum map)              │    │
│  │    • College Prep (preview curriculum map)                  │    │
│  │                                                             │    │
│  │  Tab 3: Local Career Pathways (4 pathways)                  │    │
│  │    • Healthcare Careers (preview 2 courses)                 │    │
│  │    • Skilled Trades (preview 2 courses)                     │    │
│  │    • Hospitality & Service (preview 2 courses)              │    │
│  │    • Public Service (preview 2 courses)                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                             │
│       ▼                                                             │
│  Click "Start Learning" or "Begin Assessment"                       │
│       │                                                             │
│       ▼                                                             │
│  Prompt to Sign Up / Subscribe                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Student Access (Subscribed)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STUDENT USER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Sign In → Account Verified                                         │
│       │                                                             │
│       ▼                                                             │
│  DASHBOARD (Personalized Home)                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  • My Enrolled Courses (Current classes)                    │    │
│  │  • Progress Overview (% complete per course)                │    │
│  │  • Next Up (Next lesson/assignment)                         │    │
│  │  • Achievements/Certificates                                │    │
│  │  • AI Recommendations                                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                             │
│       ▼                                                             │
│  COURSE CATALOG (Full Access)                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Browse All Pathways                                        │    │
│  │    │                                                        │    │
│  │    ├── Global Remote (6 pathways, 12 courses each)          │    │
│  │    ├── Local Education (4 pathways, grade-level courses)    │    │
│  │    └── Local Career (4 pathways, certification courses)     │    │
│  │                                                             │    │
│  │  [+ Add Course] → Course added to Dashboard                 │    │
│  │  [- Drop Course] → Course removed from Dashboard            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                             │
│       ▼                                                             │
│  CLASSROOM (Learning Environment)                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Active Course View                                         │    │
│  │    • Video Lessons                                          │    │
│  │    • Reading Materials                                      │    │
│  │    • Interactive Exercises                                  │    │
│  │    • Quizzes/Assessments                                    │    │
│  │    • AI Tutor Chat (contextual help)                        │    │
│  │    • Progress Tracker                                       │    │
│  │                                                             │    │
│  │  Course Completion Flow:                                    │    │
│  │    Complete Course → Certificate → Next Course Auto-Added   │    │
│  │    OR Manual Selection from Catalog                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Admin Access (Curriculum Management)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ADMIN USER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Admin Sign In → Role Verified                                      │
│       │                                                             │
│       ▼                                                             │
│  ADMIN DASHBOARD                                                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Overview Stats:                                            │    │
│  │    • Total Students Enrolled                                │    │
│  │    • Courses Active                                         │    │
│  │    • Completion Rates                                       │    │
│  │    • Popular Pathways                                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                             │
│       ▼                                                             │
│  CURRICULUM BUILDER (No-Code Interface)                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │  1. PATHWAY MANAGEMENT                                      │    │
│  │     [+ Create Pathway]                                      │    │
│  │       • Name: _______________                               │    │
│  │       • Track Type: [Dropdown: Global/Education/Career]     │    │
│  │       • Description: _______________                        │    │
│  │       • Icon: [Upload/Select]                               │    │
│  │       • Duration: ___ weeks                                 │    │
│  │       • Difficulty: [Beginner/Intermediate/Advanced]        │    │
│  │     [Save Pathway]                                          │    │
│  │                                                             │    │
│  │  2. COURSE MANAGEMENT                                       │    │
│  │     Select Pathway: [Dropdown]                              │    │
│  │     [+ Add Course]                                          │    │
│  │       • Course Code: _______________                        │    │
│  │       • Course Title: _______________                       │    │
│  │       • Description: _______________                        │    │
│  │       • Duration: ___ weeks                                 │    │
│  │       • Prerequisites: [Multi-select existing courses]      │    │
│  │       • Learning Objectives: [Add multiple]                 │    │
│  │       • Order in Pathway: [Drag & Drop]                     │    │
│  │     [Save Course]                                           │    │
│  │                                                             │    │
│  │  3. MODULE MANAGEMENT                                       │    │
│  │     Select Course: [Dropdown]                               │    │
│  │     [+ Add Module]                                          │    │
│  │       • Module Number: ___                                  │    │
│  │       • Module Title: _______________                       │    │
│  │       • Description: _______________                        │    │
│  │       • Duration: ___ hours                                 │    │
│  │       • Order: [Drag & Drop]                                │    │
│  │     [Save Module]                                           │    │
│  │                                                             │    │
│  │  4. LESSON MANAGEMENT                                       │    │
│  │     Select Module: [Dropdown]                               │    │
│  │     [+ Add Lesson]                                          │    │
│  │       • Lesson Type: [Video/Reading/Interactive/Quiz/Project]│    │
│  │       • Lesson Title: _______________                       │    │
│  │       • Content: [Rich Text Editor / Video Upload / Quiz Builder] │
│  │       • Duration: ___ minutes                               │    │
│  │       • Required: [Yes/No]                                  │    │
│  │       • Order: [Drag & Drop]                                │    │
│  │     [Save Lesson]                                           │    │
│  │                                                             │    │
│  │  5. MATERIALS LIBRARY                                       │    │
│  │     [+ Upload Material]                                     │    │
│  │       • Type: [PDF/Video/Image/Document/External Link]      │    │
│  │       • File: [Upload]                                      │    │
│  │       • Title: _______________                              │    │
│  │       • Description: _______________                        │    │
│  │       • Tags: [Multiple tags]                               │    │
│  │       • Attach to: [Select Course/Module/Lesson]            │    │
│  │     [Save Material]                                         │    │
│  │                                                             │    │
│  │  6. ASSESSMENT BUILDER                                      │    │
│  │     [+ Create Assessment]                                   │    │
│  │       • Type: [Quiz/Exam/Project/Portfolio]                 │    │
│  │       • Questions: [Add Multiple Choice/True-False/Essay]   │    │
│  │       • Passing Score: ___%                                 │    │
│  │       • Time Limit: ___ minutes                             │    │
│  │       • Attempts Allowed: ___                               │    │
│  │     [Save Assessment]                                       │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                             │
│       ▼                                                             │
│  STUDENT MANAGEMENT                                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  • View All Students                                        │    │
│  │  • Search/Filter by Course, Progress, Date                  │    │
│  │  • Individual Student View (progress, grades, activity)     │    │
│  │  • Bulk Actions (enroll, message, export)                   │    │
│  │  • Reports & Analytics                                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### New Tables Required

```sql
-- =============================================
-- PATHWAY TABLES
-- =============================================

-- 1. Pathways (Top-level organization)
CREATE TABLE pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('global_remote', 'local_education', 'local_career')),
    pathway_name VARCHAR(255) NOT NULL,
    pathway_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    target_outcome TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses (Belong to pathways)
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisite_course_ids UUID[],
    thumbnail_url TEXT,
    intro_video_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Modules (Belong to courses)
CREATE TABLE course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_module_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

-- 4. Lessons (Belong to modules)
CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type VARCHAR(20) CHECK (lesson_type IN ('video', 'reading', 'interactive', 'quiz', 'project')),
    content_url TEXT,
    content_text TEXT,
    content_metadata JSONB,
    estimated_duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_lesson_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

-- 5. Materials Library
CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type VARCHAR(20) CHECK (material_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Material Attachments (Link materials to courses/modules/lessons)
CREATE TABLE material_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(material_id) ON DELETE CASCADE,
    attached_to_type VARCHAR(20) CHECK (attached_to_type IN ('pathway', 'course', 'module', 'lesson')),
    attached_to_id UUID NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STUDENT ENROLLMENT TABLES
-- =============================================

-- 7. Student Pathway Enrollments
CREATE TABLE pathway_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    certificate_url TEXT,
    UNIQUE(user_id, pathway_id)
);

-- 8. Student Course Enrollments
CREATE TABLE course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    pathway_enrollment_id UUID REFERENCES pathway_enrollments(enrollment_id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    final_grade DECIMAL(5,2),
    certificate_url TEXT,
    UNIQUE(user_id, course_id)
);

-- 9. Lesson Progress
CREATE TABLE lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    score DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,
    last_position JSONB,
    UNIQUE(user_id, lesson_id)
);

-- =============================================
-- ASSESSMENT TABLES
-- =============================================

-- 10. Assessments
CREATE TABLE assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    module_id UUID REFERENCES course_modules(module_id),
    lesson_id UUID REFERENCES lessons(lesson_id),
    assessment_type VARCHAR(20) CHECK (assessment_type IN ('quiz', 'exam', 'project', 'portfolio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessment Questions
CREATE TABLE assessment_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB,
    points DECIMAL(5,2) DEFAULT 1.00,
    explanation TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Student Assessment Attempts
CREATE TABLE assessment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    answers JSONB,
    score DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT,
    attempt_number INTEGER DEFAULT 1
);

-- =============================================
-- LOCALIZATION TABLES
-- =============================================

-- 13. Content Translations
CREATE TABLE content_translations (
    translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20) CHECK (content_type IN ('pathway', 'course', 'module', 'lesson', 'material')),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    translated_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language_code, field_name)
);

-- 14. Cultural Adaptations
CREATE TABLE cultural_adaptations (
    adaptation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    adaptation_type VARCHAR(20) CHECK (adaptation_type IN ('example', 'analogy', 'case_study', 'context')),
    original_content TEXT,
    adapted_content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pathways_track_type ON pathways(track_type);
CREATE INDEX idx_pathways_published ON pathways(is_published);
CREATE INDEX idx_courses_pathway ON courses(pathway_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_modules_course ON course_modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_pathway_enrollments_user ON pathway_enrollments(user_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_translations_content ON content_translations(content_type, content_id, language_code);
```

---

## 📅 IMPLEMENTATION PHASES

### Phase Overview

| Phase | Name | Duration | Focus |
|-------|------|----------|-------|
| **Phase 1** | Foundation | 2-3 weeks | Database + Admin Core |
| **Phase 2** | Public Experience | 2-3 weeks | Sample Curricula + Browse |
| **Phase 3** | Student Experience | 3-4 weeks | Dashboard + Classroom |
| **Phase 4** | Content Population | 4-6 weeks | First Complete Pathway |
| **Phase 5** | Localization | 2-3 weeks | Nigeria Adaptation |
| **Phase 6** | Scale | Ongoing | Additional Pathways |

---

### 📍 PHASE 1: Foundation (Weeks 1-3)

#### Goals
- Deploy curriculum database schema
- Build Admin CRUD operations
- Create basic admin interface

#### Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 1.1 | Deploy 14 new database tables | Critical | 4 |
| 1.2 | Create API endpoints for CRUD operations | Critical | 16 |
| 1.3 | Build Admin authentication/authorization | Critical | 8 |
| 1.4 | Create Pathway management UI | High | 12 |
| 1.5 | Create Course management UI | High | 12 |
| 1.6 | Create Module management UI | High | 8 |
| 1.7 | Create Lesson management UI | High | 12 |
| 1.8 | Create Materials upload/library UI | Medium | 8 |
| 1.9 | Create Assessment builder UI | Medium | 12 |
| 1.10 | Admin dashboard with stats | Medium | 8 |

**Phase 1 Deliverables:**
- [ ] Database schema deployed to Neon PostgreSQL
- [ ] Admin can create/edit/delete pathways
- [ ] Admin can create/edit/delete courses within pathways
- [ ] Admin can create/edit/delete modules within courses
- [ ] Admin can create/edit/delete lessons within modules
- [ ] Admin can upload and attach materials
- [ ] Admin can create assessments with questions

---

### 📍 PHASE 2: Public Experience (Weeks 4-6)

#### Goals
- Build sample curricula display
- Enhance "Career Track & Explore Paths" page
- Create conversion funnel to signup

#### Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 2.1 | Redesign Career Paths page with tabs | High | 8 |
| 2.2 | Build Global Remote preview cards | High | 8 |
| 2.3 | Build Local Education preview cards | High | 8 |
| 2.4 | Build Local Career preview cards | High | 8 |
| 2.5 | Create pathway detail preview page | High | 12 |
| 2.6 | Create course preview page | Medium | 8 |
| 2.7 | Add "Start Learning" CTA flow | High | 4 |
| 2.8 | Connect to signup/subscription flow | High | 6 |
| 2.9 | SEO optimization for curricula pages | Low | 4 |

**Phase 2 Deliverables:**
- [ ] Career Paths page shows 3 tabs (Global Remote, Local Education, Local Career)
- [ ] Each pathway shows preview cards with key info
- [ ] Clicking pathway shows detailed preview (courses, duration, outcomes)
- [ ] Non-subscribers can browse but see "Subscribe to Enroll" prompts
- [ ] Clear CTA paths to signup

---

### 📍 PHASE 3: Student Experience (Weeks 7-10)

#### Goals
- Build student dashboard integration
- Create classroom learning environment
- Implement enrollment and progress tracking

#### Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 3.1 | Enhance Dashboard with "My Courses" section | Critical | 8 |
| 3.2 | Build course catalog for enrolled students | Critical | 12 |
| 3.3 | Implement Add/Drop course functionality | Critical | 8 |
| 3.4 | Create Classroom learning view | Critical | 20 |
| 3.5 | Build video lesson player | High | 12 |
| 3.6 | Build reading lesson view | High | 8 |
| 3.7 | Build interactive exercise framework | High | 16 |
| 3.8 | Build quiz/assessment taking interface | High | 12 |
| 3.9 | Implement progress tracking | High | 8 |
| 3.10 | Build course completion flow | High | 8 |
| 3.11 | Auto-enroll next course feature | Medium | 6 |
| 3.12 | Certificate generation | Medium | 8 |
| 3.13 | AI Tutor integration in classroom | Medium | 12 |

**Phase 3 Deliverables:**
- [ ] Students see enrolled courses on Dashboard
- [ ] Students can browse and add courses from catalog
- [ ] Students can drop courses
- [ ] Classroom displays lesson content by type
- [ ] Progress saves automatically
- [ ] Completing course triggers next course option
- [ ] Basic certificate on course completion

---

### 📍 PHASE 4: Content Population (Weeks 11-16)

#### Goals
- Create complete first pathway content
- Establish content creation workflow
- Quality assurance process

#### Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 4.1 | Select first pathway (recommend: Web Development) | Critical | 2 |
| 4.2 | Create detailed course outlines (12 courses) | Critical | 16 |
| 4.3 | Create Module breakdowns (4-6 modules per course) | Critical | 24 |
| 4.4 | Create/source video content | High | 80+ |
| 4.5 | Create reading materials | High | 40 |
| 4.6 | Create interactive exercises | High | 40 |
| 4.7 | Create assessments | High | 24 |
| 4.8 | Create capstone project guidelines | High | 8 |
| 4.9 | Internal QA review | High | 16 |
| 4.10 | Beta testing with pilot students | High | 20 |

**Phase 4 Deliverables:**
- [ ] One complete pathway (12 courses) with all content
- [ ] ~48+ modules with structured content
- [ ] ~200+ lessons across all modules
- [ ] All assessments created and tested
- [ ] Beta feedback incorporated

---

### 📍 PHASE 5: Localization (Weeks 17-19)

#### Goals
- Adapt Maine model for Nigeria
- Implement language translations
- Create cultural adaptations

#### Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 5.1 | Map Maine standards to Nigerian equivalents | High | 8 |
| 5.2 | Create Nigerian curriculum adaptation document | High | 12 |
| 5.3 | Translate UI to Yoruba, Igbo, Hausa | High | 24 |
| 5.4 | Create Nigerian-context examples | High | 20 |
| 5.5 | Adapt currency examples (Naira) | Medium | 4 |
| 5.6 | Create Nigerian case studies | Medium | 12 |
| 5.7 | Test with Nigerian pilot users | High | 16 |

**Phase 5 Deliverables:**
- [ ] Nigerian curriculum mapping document
- [ ] UI translations for 3 Nigerian languages
- [ ] Cultural adaptations for first pathway
- [ ] Nigerian pilot user feedback incorporated

---

### 📍 PHASE 6: Scale (Ongoing)

#### Goals
- Add remaining pathways
- Continuous improvement
- Partner integrations

#### Tasks (Repeating)
- Add second Global Remote pathway
- Add third Global Remote pathway
- Continue until all 14 pathways complete
- Partner content integrations
- Advanced features (certificates, job board integration, etc.)

---

## 📊 Success Metrics

### Phase 1 Success
- [ ] Admin can manage curriculum without writing code
- [ ] Database handles 1000+ courses without performance issues

### Phase 2 Success
- [ ] Public page bounce rate < 50%
- [ ] Signup conversion rate > 5% from curriculum pages

### Phase 3 Success
- [ ] Course completion rate > 30%
- [ ] Average session time > 15 minutes

### Phase 4 Success
- [ ] First pathway 100% content complete
- [ ] Student satisfaction > 4.0/5.0

### Phase 5 Success
- [ ] Nigerian users can complete pathway in local language
- [ ] Cultural relevance score > 4.0/5.0

---

## 🚀 Immediate Next Steps

1. **Review and approve this plan** — Confirm track structure and phases
2. **Deploy Phase 1 database schema** — Run SQL against Neon PostgreSQL
3. **Begin Admin API development** — Create backend endpoints
4. **Seed sample data** — Populate with placeholder content for testing

---

## 📎 Appendix: Maine Learning Results Reference

### 8 Content Areas
1. English Language Arts
2. Mathematics
3. Science and Engineering
4. Social Studies
5. Health, Physical Education and Wellness
6. Visual and Performing Arts
7. World Languages
8. Life and Career Readiness

### Grade Spans
- **Childhood:** K-5
- **Early Adolescence:** 6-8
- **Adolescence:** 9-Diploma

### Maine's Guiding Principles (Cross-Curricular Skills)
1. Clear and Effective Communicator
2. Self-Directed and Lifelong Learner
3. Creative and Practical Problem Solver
4. Responsible and Involved Citizen
5. Integrative and Informed Thinker

### Maine CTE Career Clusters (16)
1. Agriculture, Food & Natural Resources
2. Architecture & Construction
3. Arts, A/V Technology & Communications
4. Business, Management & Administration
5. Education & Training
6. Finance
7. Government & Public Administration
8. Health Science
9. Hospitality & Tourism
10. Human Services
11. Information Technology
12. Law, Public Safety & Security
13. Manufacturing
14. Marketing, Sales & Service
15. Science, Technology, Engineering & Math
16. Transportation, Distribution & Logistics

---

**Document End**
Document · MD 
1764640819275_image.png
1764640867547_image.png
1764640891827_image.png
1764640959593_image.png
Now, let's implement the sample on the front page. See the current setup for the page in the image. Clicking "See All Courses" takes you to the third image. The file name should not be career. That's inaccurate naming; we need to change that. How can we work with this?


Analyzed platform structure and strategized file renaming with curriculum integration.
37s













Excellent! I can see the current setup clearly. Let me analyze and propose a solution:

📊 Current State Analysis
URL	File (Likely)	Content	Issue
pmerit.com/career	career.html	Pathways & Tracks overview	Name suggests "careers/jobs" not "learning paths"
pmerit.com/courses	courses.html	Individual courses list	Name is accurate ✅
🎯 Recommended Renaming Strategy
Current	Proposed	URL Change	Reason
career.html	pathways.html	/career → /pathways	Matches content: "Learning Paths"
courses.html	Keep as-is	/courses	Accurate - shows individual courses
Alternative Options:

learning-paths.html → /learning-paths
explore.html → /explore
tracks.html → /tracks
🔧 Implementation Approach
Before we proceed, I need to check the current file structure. Let me read the governance files first as required:


Check project structure and governance files


Assessed file structure and devised renaming strategy for implementation.
13s







I can see the project knowledge files. Since we're in Claude Web and need to modify files in your local frontend repository, let me provide you with a clear implementation plan.

📋 Implementation Plan for File Renaming + Sample Curricula
Step 1: File Renaming Strategy
Files to Rename/Update:

Action	Current	New	Notes
Rename	career.html	pathways.html	Main pathways overview
Keep	courses.html	courses.html	Individual courses - accurate
Create	—	_redirects or update routing	Redirect /career → /pathways
Links to Update (search for these):

File	Change
index.html	Update any links from /career to /pathways
learner-portal.html	Update sidebar links
Navigation components	Update menu links
Footer	Update Platform section links
Step 2: How to Proceed
Since I'm in Claude Web, we have two options:

Option A: Claude Code Desktop (Preferred) If you have Claude Code Desktop available, switch there and I can directly read/write the files.

Option B: Manual Execution with My Guidance I provide you the exact commands and changes, you execute locally.

❓ Quick Questions Before We Start:
Do you have Claude Code Desktop available?
If yes, type: CODE DESKTOP AVAILABLE
If no, type: CODE DESKTOP UNAVAILABLE
Preferred new URL:
/pathways (my recommendation)
/learning-paths
/explore
Other: ___________
Do you want to set up a redirect from /career → new URL for existing links/bookmarks?
Yes (recommended for SEO)
No
📁 Files I'll Need to See/Modify
Once you confirm the approach, I'll need access to or you'll need to show me:

pmerit-ai-platform/
├── career.html          ← Rename to pathways.html
├── courses.html         ← Review for consistency
├── index.html           ← Update links
├── learner-portal.html  ← Update sidebar
├── assets/
│   └── js/
│       └── navigation.js (if exists) ← Update routes
└── _redirects (or wrangler.toml) ← Add redirect rule
What's your preference? Let me know and we'll get started on the implementation!

CODE DESKTOP AVAILABLE
/pathways
Yes

Deliberated optimal handoff strategy for Code Desktop implementation.
11s








Excellent! Since Code Desktop is available, let's switch there for direct file access. Here's what to do:

🚀 Switch to Claude Code Desktop
Step 1: Open Code Desktop
Open Claude Code Desktop and navigate to your frontend repository:

bash
cd E:\pmerit\pmerit-ai-platform
Step 2: Sync Check (Required)
bash
git fetch origin && git status
```

Confirm repos are synced before proceeding.

---

### Step 3: Give Code Desktop These Instructions

Copy and paste this prompt into Code Desktop:

---
```
PMERIT CURRICULUM IMPLEMENTATION - File Renaming Task

CONTEXT:
We're renaming the career pathways page from `/career` to `/pathways` for accuracy.
The current `career.html` shows learning paths/tracks, not job careers.

TASKS TO COMPLETE:

1. RENAME FILE:
   - Rename `career.html` → `pathways.html`

2. UPDATE ALL INTERNAL LINKS:
   Search all HTML/JS files and replace:
   - `href="/career"` → `href="/pathways"`
   - `href="career.html"` → `href="pathways.html"`
   - `"/career"` → `"/pathways"` (in JS routing)

3. ADD REDIRECT (for SEO):
   In `_redirects` file (create if doesn't exist) or in Cloudflare routing:
```
   /career /pathways 301
```

4. UPDATE NAVIGATION:
   - Check `index.html` for "Career Track & Explore Paths" links
   - Check sidebar in `learner-portal.html`
   - Check footer links
   - Check any JavaScript navigation files

5. VERIFY:
   - All links point to `/pathways`
   - Old `/career` URL redirects to `/pathways`

Execute one step at a time, wait for DONE confirmation.
📋 Files Likely Affected
File	What to Check/Change
career.html	Rename to pathways.html
index.html	Update "Career Track" link in sidebar
learner-portal.html	Update sidebar navigation
courses.html	Check for any back-links
footer component	Update Platform section links
_redirects	Add redirect rule
✅ After Code Desktop Completes
Test locally if possible
Commit with message: refactor: Rename career.html to pathways.html for accuracy
Push to GitHub
Verify on production that /career redirects to /pathways
Ready to switch to Code Desktop? Once you've completed the renaming there, come back here and type RENAME COMPLETE and we'll continue with implementing the sample curricula content on the pathways page.

1764674172974_image.png
1764674234927_image.png
1764674262509_image.png

I'll help you rename the career page to pathways and update all related links. Let me start by exploring the codebase structure and creating a task plan. Update Todos Exploring codebase structure Rename career.html to pathways.html Update all internal links referencing /career Add redirec

pasted

DONE


Verified deployment completion and charted next implementation phase.




✅ RENAME COMPLETE - Excellent Work!
Summary of What Was Done:
Item	Status
File renamed: career.html → pathways.html	✅
Internal links updated (11 files)	✅
UI text: "Career Track" → "Learning Pathways"	✅
SEO redirects: /career → /pathways (301)	✅
PR #278 merged to main	✅
Cloudflare deployed	✅
Cache purged	✅
🔍 Quick Verification
Can you confirm these URLs work correctly?

New URL: https://pmerit.com/pathways — Should load the Learning Pathways page
Redirect test: https://pmerit.com/career — Should redirect to /pathways
🚀 Next Step: Sample Curricula Implementation
Now that the file is properly named, we're ready to implement the sample curricula content on the pathways page.

What We'll Build:
Based on the implementation plan, clicking "Learn More →" on each pathway card should show sample courses for that pathway. Currently the cards exist but don't link to detailed content.

Options for implementation:

Option	Description	Complexity
A) Modal Preview	Click "Learn More" → Modal shows 2-3 sample courses	Medium
B) Expand Cards	Click "Learn More" → Card expands to show courses inline	Medium
C) Detail Pages	Click "Learn More" → Navigate to /pathways/web-development	Higher
D) Accordion Sections	Each pathway section has accordion that expands	Lower
My Recommendation: Start with Option A (Modal Preview) — It's visually impactful, doesn't require new pages, and matches the current UI pattern.

❓ Before We Continue:
Did the URLs verify correctly? (pmerit.com/pathways works, /career redirects)
Which implementation option do you prefer for sample curricula?
A) Modal Preview
B) Expand Cards
C) Detail Pages
D) Accordion Sections
Should we continue in Code Desktop or do you want me to prepare the code here first?
1764674364181_image.png
Did the URLs verify correctly? (pmerit.com/pathways works, /career redirects): YES
Which implementation option do you prefer for sample curricula?: Accordion Sections
Let's continue in Code Desktop.

Orchestrated accordion implementation strategy for pathway curricula display.



✅ URL Verification Confirmed!
pmerit.com/pathways is live and working.

🎯 Next: Implement Accordion Sections for Sample Curricula
Copy This to Code Desktop:
PMERIT CURRICULUM IMPLEMENTATION - Accordion Sample Curricula

CONTEXT:
We're adding accordion sections to the pathways page (pathways.html) so that when users click "Learn More →" on a pathway card, it expands to show 2-3 sample courses for that pathway.

DESIGN REQUIREMENTS:
- Match existing PMERIT dark theme (Dark Blue #0a1628, Cards #1a2a4a, Teal accents #4AA4B9)
- Smooth expand/collapse animation (300ms ease)
- Only one accordion open at a time (clicking another closes the previous)
- Mobile responsive
- Each sample course shows: Title, Duration, Brief Description, Difficulty Tag

IMPLEMENTATION TASKS:

1. MODIFY pathways.html:
   - Add accordion container below each pathway card
   - Add sample course cards inside accordion (hidden by default)
   - Change "Learn More →" button to toggle accordion

2. ADD CSS for accordion:
   - Accordion container styles
   - Expand/collapse animation
   - Sample course card styles inside accordion

3. ADD JavaScript:
   - Toggle accordion on "Learn More" click
   - Close other accordions when one opens
   - Smooth height animation

4. SAMPLE DATA TO USE:

GLOBAL REMOTE TRACKS:

Data Analytics (3 sample courses):
- "Python for Data Analysis" | 4 weeks | Beginner | Learn Python basics, pandas, and data manipulation
- "SQL Fundamentals" | 3 weeks | Beginner | Master database queries and data extraction
- "Data Visualization with Tableau" | 3 weeks | Intermediate | Create compelling dashboards and reports

Digital Marketing (3 sample courses):
- "SEO Fundamentals" | 2 weeks | Beginner | Optimize websites for search engines
- "Social Media Strategy" | 3 weeks | Beginner | Build effective social media campaigns
- "Google Analytics Mastery" | 2 weeks | Intermediate | Track and analyze website performance

UX Design (3 sample courses):
- "UX Research Methods" | 3 weeks | Beginner | Learn user interviews, surveys, and usability testing
- "Figma Essentials" | 4 weeks | Beginner | Master the industry-standard design tool
- "Prototyping & Testing" | 3 weeks | Intermediate | Create interactive prototypes and validate designs

Web Development (3 sample courses):
- "HTML & CSS Fundamentals" | 2 weeks | Beginner | Build your first responsive websites
- "JavaScript Essentials" | 4 weeks | Beginner | Add interactivity to web pages
- "React Fundamentals" | 4 weeks | Intermediate | Build modern component-based applications

Project Management (3 sample courses):
- "Agile & Scrum Basics" | 2 weeks | Beginner | Understand agile methodologies
- "Project Planning Tools" | 3 weeks | Beginner | Master Jira, Trello, and Asana
- "Stakeholder Communication" | 2 weeks | Intermediate | Effective project communication

Business Analysis (3 sample courses):
- "Requirements Gathering" | 3 weeks | Beginner | Elicit and document business requirements
- "Process Mapping" | 2 weeks | Beginner | Visualize and optimize business processes
- "Data-Driven Decisions" | 3 weeks | Intermediate | Use analytics for business insights

LOCAL EDUCATION TRACKS:

Early Childhood Education (3 sample courses):
- "Foundational Literacy" | 8 weeks | Ages 3-5 | Letter recognition, phonics, early reading
- "Number Concepts" | 6 weeks | Ages 3-5 | Counting, shapes, basic math readiness
- "Social-Emotional Learning" | 6 weeks | Ages 3-5 | Self-regulation, cooperation, empathy

Primary School (3 sample courses):
- "Reading Comprehension" | 10 weeks | Grades 1-5 | Fluency, vocabulary, comprehension strategies
- "Math Foundations" | 10 weeks | Grades 1-5 | Arithmetic, problem-solving, math fluency
- "Science Exploration" | 8 weeks | Grades 1-5 | Hands-on experiments and discovery

Secondary School (3 sample courses):
- "Algebra & Geometry" | 12 weeks | Grades 6-12 | Core math concepts for college readiness
- "English Language Arts" | 12 weeks | Grades 6-12 | Writing, analysis, communication skills
- "College & Career Prep" | 8 weeks | Grades 9-12 | SAT/ACT prep, applications, planning

College & University (3 sample courses):
- "Academic Writing" | 8 weeks | College | Research papers, citations, academic style
- "Critical Thinking" | 6 weeks | College | Analysis, argumentation, logical reasoning
- "Career Readiness" | 6 weeks | College | Resume, interviews, professional skills

LOCAL CAREER PATHWAYS:

Healthcare Careers (3 sample courses):
- "CNA Certification Prep" | 8 weeks | Entry Level | Prepare for Certified Nursing Assistant exam
- "Medical Terminology" | 4 weeks | Entry Level | Essential healthcare vocabulary
- "Patient Care Fundamentals" | 6 weeks | Entry Level | Hands-on care techniques

Skilled Trades (3 sample courses):
- "Electrical Basics" | 6 weeks | Entry Level | Circuits, wiring, safety fundamentals
- "Plumbing Fundamentals" | 6 weeks | Entry Level | Pipe systems, fixtures, repairs
- "OSHA Safety Certification" | 2 weeks | Entry Level | Workplace safety requirements

Hospitality & Service (3 sample courses):
- "Culinary Arts Basics" | 8 weeks | Entry Level | Cooking techniques, food safety
- "Customer Service Excellence" | 4 weeks | Entry Level | Communication, problem resolution
- "Hotel Operations" | 6 weeks | Entry Level | Front desk, housekeeping, management

Public Service (3 sample courses):
- "Emergency Response Training" | 6 weeks | Entry Level | First aid, CPR, emergency protocols
- "Community Services" | 4 weeks | Entry Level | Social work basics, case management
- "Public Administration" | 6 weeks | Entry Level | Government operations, civic engagement

5. UI STRUCTURE for each accordion:

<div class="pathway-accordion" data-pathway="data-analytics">
  <div class="accordion-content">
    <h4 class="accordion-title">Sample Courses in This Pathway</h4>
    <div class="sample-courses-grid">
      <!-- Sample course cards here -->
      <div class="sample-course-card">
        <div class="course-header">
          <span class="course-title">Python for Data Analysis</span>
          <span class="course-badge beginner">Beginner</span>
        </div>
        <p class="course-description">Learn Python basics, pandas, and data manipulation</p>
        <div class="course-meta">
          <span class="course-duration"><i class="fas fa-clock"></i> 4 weeks</span>
        </div>
      </div>
      <!-- More course cards... -->
    </div>
    <div class="accordion-cta">
      <button class="btn-enroll">Start Learning →</button>
    </div>
  </div>
</div>

6. EXPECTED BEHAVIOR:
- Page loads with all accordions collapsed
- Click "Learn More →" on a card → that accordion expands smoothly
- Click "Learn More →" on another card → previous closes, new one opens
- Click same "Learn More →" again → accordion collapses
- "Start Learning →" button links to /courses or signup flow

Execute one step at a time. Start by reading pathways.html to understand current structure.
📋 Expected Outcome
After implementation, clicking "Learn More →" on any pathway card will smoothly expand to reveal sample courses like this:

┌─────────────────────────────────────────────────────────┐
│ 📊 Data Analytics                                       │
│ Learn to analyze data, create visualizations...         │
│ [Python] [SQL] [Tableau] [Statistics]                   │
│                                                         │
│ [Learn More ↓]  ← Click to expand                       │
├─────────────────────────────────────────────────────────┤
│ Sample Courses in This Pathway                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │Python for   │ │SQL          │ │Data Viz     │        │
│ │Data Analysis│ │Fundamentals │ │with Tableau │        │
│ │4 weeks      │ │3 weeks      │ │3 weeks      │        │
│ │[Beginner]   │ │[Beginner]   │ │[Intermediate]│       │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                         │
│            [ Start Learning → ]                         │
└─────────────────────────────────────────────────────────┘
Ready to paste into Code Desktop! Let me know when complete or if you need any adjustments.

Would this sample showcase the different Track Type?


Verified comprehensive coverage across all three track types.







✅ Yes! All Three Track Types Are Covered
The sample data I provided includes all 14 pathways across all 3 Track Types:

Track Type Coverage
Track Type	# Pathways	Sample Courses Provided
Global Remote Tracks	6	✅ 3 courses each (18 total)
Local Education	4	✅ 3 courses each (12 total)
Local Career Pathways	4	✅ 3 courses each (12 total)
TOTAL	14	42 sample courses
Visual Flow on the Page
┌─────────────────────────────────────────────────────────────────┐
│  [Global Remote Tracks]  [Local Education]  [Local Career]      │  ← Tabs
└─────────────────────────────────────────────────────────────────┘

🌐 GLOBAL REMOTE TRACKS (Tab 1 - Currently showing)
├── 📊 Data Analytics        → [Learn More] → Accordion expands
├── 📢 Digital Marketing     → [Learn More] → Accordion expands  
├── 🎨 UX Design             → [Learn More] → Accordion expands
├── 💻 Web Development       → [Learn More] → Accordion expands
├── 📋 Project Management    → [Learn More] → Accordion expands
└── 📈 Business Analysis     → [Learn More] → Accordion expands

🏫 LOCAL EDUCATION (Tab 2)
├── 👶 Early Childhood       → [Learn More] → Accordion expands
├── 📚 Primary School        → [Learn More] → Accordion expands
├── 🎓 Secondary School      → [Learn More] → Accordion expands
└── 🏛️ College & University  → [Learn More] → Accordion expands

💼 LOCAL CAREER PATHWAYS (Tab 3)
├── 🏥 Healthcare Careers    → [Learn More] → Accordion expands
├── 🔧 Skilled Trades        → [Learn More] → Accordion expands
├── 🍽️ Hospitality & Service → [Learn More] → Accordion expands
└── 🏛️ Public Service        → [Learn More] → Accordion expands
Each Accordion Shows:
Element	Content
Title	"Sample Courses in This Pathway"
Course Cards	3 sample courses with title, duration, level, description
CTA Button	"Start Learning →" (links to signup/courses)
Ready to proceed with Code Desktop? The instructions cover all track types comprehensively.

1764676662602_image.png
1764676736022_image.png
1764676767915_image.png

I'll implement the accordion feature for the pathways page. Let me start by reading the current structure: Update Todos Reading pathways.html structure Add accordion CSS styles Modify career-tracks.json with sample course data Update JavaScript to render accordions and handle toggle Tes

pasted

DONE


Synthesized deployment completion and verification steps.

✅ Accordion Sample Courses - COMPLETE!
Summary of Implementation
Item	Status
PR #280 merged	✅
Cloudflare deployed	✅
Cache purged	✅
What Was Built
Files Modified:

pathways.html — Added 200+ lines of CSS and JavaScript
assets/data/career-tracks.json — Added sample courses for all 14 pathways
Features Implemented:

Feature	Details
Accordion animation	Smooth 300ms expand/collapse
Single-open behavior	Clicking one closes others
Responsive grid	3 columns → 2 → 1 on mobile
Level badges	Color-coded (Beginner=teal, Intermediate=yellow)
CTA button	"Start Learning →" links to courses
Accessibility	Full ARIA attributes, keyboard support
Sample Course Data:

Track Type	Pathways	Courses
Global Remote	6	18 samples
Local Education	4	12 samples
Local Career	4	12 samples
Total	14	42 samples
🔍 Please Verify on Production
Visit https://pmerit.com/pathways and test:

Click "Learn More →" on any pathway card — Should expand smoothly
Click another card — Previous should close, new one opens
Click same card again — Should collapse
Check all 3 tabs — Global Remote, Local Education, Local Career
Test on mobile — Should be responsive
📸 Can You Share a Screenshot?
I'd love to see how it looks on production! Once verified, we can move to the next step.

🚀 What's Next?
Based on the implementation plan, here are the options:

Priority	Next Task	Description
A	Update Implementation Plan doc	Save to project governance files
B	Database Schema Deployment	Deploy the 14 curriculum tables to Neon
C	Admin Curriculum Builder	Start building no-code admin interface
D	Create Handoff Document	Document this session's progress
Which would you like to tackle next? (Or type VERIFY COMPLETE once you've tested the accordions)

1764714066414_image.png
It's beautiful! Let's follow the implementation plan, A to D.


Charted systematic progression through implementation phases A through D.





🎉 Verified! The Accordions Look Fantastic!
I can see:

✅ All 3 Track Types displaying beautifully
✅ "Learn More ∨" buttons with chevron icons
✅ All 14 pathways with proper cards
✅ Footer updated with "Learning Pathways" link
✅ Clean, consistent PMERIT theme
📋 Proceeding with A → D
Let me work through each item:

A. Update Implementation Plan Document
I'll save the comprehensive implementation plan to your project governance files:


2 steps

Copy implementation plan to outputs



Preserved implementation plan and commenced database schema construction.

✅ A. Implementation Plan Document — COMPLETE
View Implementation Plan

B. Database Schema SQL File
# 📚 PMERIT CURRICULUM IMPLEMENTATION PLAN
## Maine-Model Educational Framework with Global Adaptation

**Version:** 1.1  
**Created:** December 1, 2025  
**Updated:** December 2, 2025  
**Status:** Phase 2 In Progress  

---

## 🎯 Executive Summary

This document outlines the complete implementation plan for PMERIT's curriculum system, using Maine's educational framework as the foundational model. The plan covers three distinct track types, user access flows, database architecture, and a phased rollout strategy.

---

## ✅ COMPLETED MILESTONES

### Session Progress (December 1-2, 2025)

| Task | Status | PR/Commit |
|------|--------|-----------|
| File renamed: `career.html` → `pathways.html` | ✅ Complete | PR #278 |
| URL redirect: `/career` → `/pathways` (301) | ✅ Complete | PR #278 |
| UI text: "Career Track" → "Learning Pathways" | ✅ Complete | PR #278 |
| Accordion sample courses (42 courses across 14 pathways) | ✅ Complete | PR #280 |
| Cloudflare deployment + cache purge | ✅ Complete | — |

---

## 📊 Track Structure Overview

### The Three Track Types

| Track Type | Pathways | Focus | Model Basis |
|------------|----------|-------|-------------|
| **Global Remote** | 6 | Work-from-anywhere careers | Industry-aligned competencies |
| **Local Education** | 4 | Age-based learning (PreK-College) | Maine Learning Results + CTE |
| **Local Career** | 4 | Location-based careers | Maine CTE 16 Career Clusters |

---

## 🏫 TRACK 1: Global Remote (6 Pathways)

### Structure
Each pathway = 12 courses × ~4-6 weeks per course = 48-72 weeks to completion

### The 6 Global Remote Pathways

| # | Pathway | Core Competencies | Target Outcome |
|---|---------|-------------------|----------------|
| 1 | **Data Analytics** | Python, SQL, Tableau, Statistics | Data Analyst roles |
| 2 | **Digital Marketing** | SEO, Social Media, Content Strategy, Analytics | Marketing Specialist |
| 3 | **UX Design** | Figma, User Research, Prototyping, UI Design | UX/UI Designer |
| 4 | **Web Development** | HTML/CSS, JavaScript, React, Node.js | Full-Stack Developer |
| 5 | **Project Management** | Agile, Scrum, Risk Management, Stakeholder Comm | Project Manager |
| 6 | **Business Analysis** | Requirements Gathering, Process Mapping, SQL | Business Analyst |

### Sample: Web Development Pathway (12 Courses)

| Course # | Course Title | Duration | Prerequisites | Key Deliverable |
|----------|--------------|----------|---------------|-----------------|
| WD-101 | HTML & CSS Fundamentals | 2 weeks | None | Static portfolio page |
| WD-102 | JavaScript Essentials | 4 weeks | WD-101 | Interactive calculator |
| WD-103 | Responsive Design | 2 weeks | WD-102 | Mobile-first website |
| WD-104 | Version Control (Git) | 1 week | WD-102 | GitHub portfolio |
| WD-105 | React Fundamentals | 4 weeks | WD-104 | React todo app |
| WD-106 | Backend with Node.js | 4 weeks | WD-105 | REST API |
| WD-107 | Database Design | 3 weeks | WD-106 | PostgreSQL integration |
| WD-108 | Authentication & Security | 2 weeks | WD-107 | Secure login system |
| WD-109 | Cloud Deployment | 2 weeks | WD-108 | Live deployed app |
| WD-110 | API Integration | 2 weeks | WD-109 | Third-party API usage |
| WD-111 | Testing & QA | 2 weeks | WD-110 | Automated test suite |
| WD-112 | Capstone Project | 4 weeks | All above | Full-stack portfolio project |

**Total Duration:** ~32 weeks to job-ready

---

## 🏫 TRACK 2: Local Education (4 Pathways) — Maine Model

### Based on Maine Learning Results Structure

Maine organizes education into **8 Content Areas** across **4 Grade Spans**:

#### Maine's 8 Content Areas (Adapted for PMERIT)
1. English Language Arts (ELA)
2. Mathematics
3. Science & Engineering
4. Social Studies
5. Health & Physical Education
6. Visual & Performing Arts
7. World Languages
8. Life & Career Readiness

#### Maine's Grade Spans (PMERIT Adaptation)

| Pathway | Maine Equivalent | Age Range | Grade Levels | Focus |
|---------|------------------|-----------|--------------|-------|
| **Early Childhood** | Pre-K to Grade 2 | Ages 3-7 | PreK, K, 1, 2 | Foundational literacy & numeracy |
| **Primary** | Childhood (K-5) | Ages 5-11 | K, 1, 2, 3, 4, 5 | Core academic skills |
| **Secondary** | Early Adolescence + Adolescence | Ages 11-18 | 6, 7, 8, 9, 10, 11, 12 | College & career prep |
| **College** | Post-secondary | Ages 18+ | Higher Ed | Degree pathways |

### Nigeria Adaptation

The same Maine structure adapts to Nigeria by:
1. **Mapping to Nigerian Educational Levels:**
   - Early Childhood → Early Child Care Development Education (ECCDE)
   - Primary → Primary Education (Basic 1-6)
   - Secondary → Junior Secondary (JSS 1-3) + Senior Secondary (SSS 1-3)
   - College → Tertiary Education

2. **Cultural Content Localization:**
   - Local history and geography content
   - Nigerian civic education
   - Indigenous language options (Yoruba, Igbo, Hausa)
   - Culturally relevant examples and case studies

---

## 🏫 TRACK 3: Local Career (4 Pathways) — Maine CTE Model

### Based on Maine's 16 Career Clusters (Consolidated to 4)

| PMERIT Pathway | Maine CTE Clusters Included | Example Careers |
|----------------|----------------------------|-----------------|
| **Healthcare Careers** | Health Science | CNA, EMT, Medical Assistant, Nursing |
| **Skilled Trades** | Architecture & Construction, Manufacturing, Transportation | Electrician, Plumber, Welder, Automotive Tech |
| **Hospitality & Service** | Hospitality & Tourism, Human Services | Culinary Arts, Hotel Management, Food Service |
| **Public Service** | Government & Public Admin, Law/Public Safety, Education | Law Enforcement, Firefighting, Teaching Assistant |

---

## 👥 USER ACCESS FLOWS

### Flow 1: Public/Guest Access

```
Visit pmerit.com
    │
    ▼
Homepage (AI Chat + Quick Actions)
    │
    ▼
Click "Learning Pathways" in sidebar
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│              SAMPLE CURRICULA (Preview Mode)                │
├─────────────────────────────────────────────────────────────┤
│  Tab 1: Global Remote Tracks (6 pathways)                   │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
│                                                             │
│  Tab 2: Local Education (4 pathways)                        │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
│                                                             │
│  Tab 3: Local Career Pathways (4 pathways)                  │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Click "Start Learning" or "Discover Your Path"
    │
    ▼
Prompt to Sign Up / Subscribe
```

### Flow 2: Student Access (Subscribed)

```
Sign In → Account Verified
    │
    ▼
DASHBOARD (Personalized Home)
┌─────────────────────────────────────────────────────────────┐
│  • My Enrolled Courses (Current classes)                    │
│  • Progress Overview (% complete per course)                │
│  • Next Up (Next lesson/assignment)                         │
│  • Achievements/Certificates                                │
│  • AI Recommendations                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
COURSE CATALOG (Full Access)
┌─────────────────────────────────────────────────────────────┐
│  Browse All Pathways                                        │
│    │                                                        │
│    ├── Global Remote (6 pathways, 12 courses each)          │
│    ├── Local Education (4 pathways, grade-level courses)    │
│    └── Local Career (4 pathways, certification courses)     │
│                                                             │
│  [+ Add Course] → Course added to Dashboard                 │
│  [- Drop Course] → Course removed from Dashboard            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
CLASSROOM (Learning Environment)
┌─────────────────────────────────────────────────────────────┐
│  Active Course View                                         │
│    • Video Lessons                                          │
│    • Reading Materials                                      │
│    • Interactive Exercises                                  │
│    • Quizzes/Assessments                                    │
│    • AI Tutor Chat (contextual help)                        │
│    • Progress Tracker                                       │
│                                                             │
│  Course Completion Flow:                                    │
│    Complete Course → Certificate → Next Course Auto-Added   │
│    OR Manual Selection from Catalog                         │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Admin Access (Curriculum Management)

```
Admin Sign In → Role Verified
    │
    ▼
ADMIN DASHBOARD
┌─────────────────────────────────────────────────────────────┐
│  Overview Stats:                                            │
│    • Total Students Enrolled                                │
│    • Courses Active                                         │
│    • Completion Rates                                       │
│    • Popular Pathways                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
CURRICULUM BUILDER (No-Code Interface)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. PATHWAY MANAGEMENT                                      │
│     [+ Create Pathway]                                      │
│       • Name, Track Type, Description, Icon                 │
│       • Duration, Difficulty                                │
│     [Save Pathway]                                          │
│                                                             │
│  2. COURSE MANAGEMENT                                       │
│     Select Pathway → [+ Add Course]                         │
│       • Course Code, Title, Description                     │
│       • Duration, Prerequisites, Learning Objectives        │
│     [Save Course]                                           │
│                                                             │
│  3. MODULE MANAGEMENT                                       │
│     Select Course → [+ Add Module]                          │
│       • Module Number, Title, Description                   │
│       • Duration, Order (Drag & Drop)                       │
│     [Save Module]                                           │
│                                                             │
│  4. LESSON MANAGEMENT                                       │
│     Select Module → [+ Add Lesson]                          │
│       • Type: Video/Reading/Interactive/Quiz/Project        │
│       • Content: Rich Text Editor / Video Upload            │
│     [Save Lesson]                                           │
│                                                             │
│  5. MATERIALS LIBRARY                                       │
│     [+ Upload Material] → PDF/Video/Image/Link              │
│     Attach to Course/Module/Lesson                          │
│                                                             │
│  6. ASSESSMENT BUILDER                                      │
│     [+ Create Assessment]                                   │
│       • Type: Quiz/Exam/Project/Portfolio                   │
│       • Questions: Multiple Choice/True-False/Essay         │
│       • Passing Score, Time Limit, Attempts                 │
│     [Save Assessment]                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### New Tables Required (14 Tables)

```sql
-- =============================================
-- PATHWAY TABLES
-- =============================================

-- 1. Pathways (Top-level organization)
CREATE TABLE pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('global_remote', 'local_education', 'local_career')),
    pathway_name VARCHAR(255) NOT NULL,
    pathway_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    target_outcome TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses (Belong to pathways)
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisite_course_ids UUID[],
    thumbnail_url TEXT,
    intro_video_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Modules (Belong to courses)
CREATE TABLE course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_module_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

-- 4. Lessons (Belong to modules)
CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type VARCHAR(20) CHECK (lesson_type IN ('video', 'reading', 'interactive', 'quiz', 'project')),
    content_url TEXT,
    content_text TEXT,
    content_metadata JSONB,
    estimated_duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_lesson_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

-- 5. Materials Library
CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type VARCHAR(20) CHECK (material_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Material Attachments
CREATE TABLE material_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(material_id) ON DELETE CASCADE,
    attached_to_type VARCHAR(20) CHECK (attached_to_type IN ('pathway', 'course', 'module', 'lesson')),
    attached_to_id UUID NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STUDENT ENROLLMENT TABLES
-- =============================================

-- 7. Student Pathway Enrollments
CREATE TABLE pathway_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    certificate_url TEXT,
    UNIQUE(user_id, pathway_id)
);

-- 8. Student Course Enrollments
CREATE TABLE course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    pathway_enrollment_id UUID REFERENCES pathway_enrollments(enrollment_id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    final_grade DECIMAL(5,2),
    certificate_url TEXT,
    UNIQUE(user_id, course_id)
);

-- 9. Lesson Progress
CREATE TABLE lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    score DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,
    last_position JSONB,
    UNIQUE(user_id, lesson_id)
);

-- =============================================
-- ASSESSMENT TABLES
-- =============================================

-- 10. Assessments
CREATE TABLE assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    module_id UUID REFERENCES course_modules(module_id),
    lesson_id UUID REFERENCES lessons(lesson_id),
    assessment_type VARCHAR(20) CHECK (assessment_type IN ('quiz', 'exam', 'project', 'portfolio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessment Questions
CREATE TABLE assessment_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB,
    points DECIMAL(5,2) DEFAULT 1.00,
    explanation TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Student Assessment Attempts
CREATE TABLE assessment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    answers JSONB,
    score DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT,
    attempt_number INTEGER DEFAULT 1
);

-- =============================================
-- LOCALIZATION TABLES
-- =============================================

-- 13. Content Translations
CREATE TABLE content_translations (
    translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20) CHECK (content_type IN ('pathway', 'course', 'module', 'lesson', 'material')),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    translated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language_code, field_name)
);

-- 14. Cultural Adaptations
CREATE TABLE cultural_adaptations (
    adaptation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    adaptation_type VARCHAR(20) CHECK (adaptation_type IN ('example', 'analogy', 'case_study', 'context')),
    original_content TEXT,
    adapted_content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pathways_track_type ON pathways(track_type);
CREATE INDEX idx_pathways_published ON pathways(is_published);
CREATE INDEX idx_courses_pathway ON courses(pathway_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_modules_course ON course_modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_pathway_enrollments_user ON pathway_enrollments(user_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_translations_content ON content_translations(content_type, content_id, language_code);
```

---

## 📅 IMPLEMENTATION PHASES

### Phase Overview

| Phase | Name | Duration | Focus | Status |
|-------|------|----------|-------|--------|
| **Phase 1** | Foundation | 2-3 weeks | Database + Admin Core | 🔜 Next |
| **Phase 2** | Public Experience | 2-3 weeks | Sample Curricula + Browse | ✅ Partial |
| **Phase 3** | Student Experience | 3-4 weeks | Dashboard + Classroom | ⏳ Pending |
| **Phase 4** | Content Population | 4-6 weeks | First Complete Pathway | ⏳ Pending |
| **Phase 5** | Localization | 2-3 weeks | Nigeria Adaptation | ⏳ Pending |
| **Phase 6** | Scale | Ongoing | Additional Pathways | ⏳ Pending |

---

### 📍 PHASE 1: Foundation (Weeks 1-3) — NEXT

#### Goals
- Deploy curriculum database schema
- Build Admin CRUD operations
- Create basic admin interface

#### Tasks

| # | Task | Priority | Est. Hours | Status |
|---|------|----------|------------|--------|
| 1.1 | Deploy 14 new database tables | Critical | 4 | ⏳ |
| 1.2 | Create API endpoints for CRUD operations | Critical | 16 | ⏳ |
| 1.3 | Build Admin authentication/authorization | Critical | 8 | ⏳ |
| 1.4 | Create Pathway management UI | High | 12 | ⏳ |
| 1.5 | Create Course management UI | High | 12 | ⏳ |
| 1.6 | Create Module management UI | High | 8 | ⏳ |
| 1.7 | Create Lesson management UI | High | 12 | ⏳ |
| 1.8 | Create Materials upload/library UI | Medium | 8 | ⏳ |
| 1.9 | Create Assessment builder UI | Medium | 12 | ⏳ |
| 1.10 | Admin dashboard with stats | Medium | 8 | ⏳ |

---

### 📍 PHASE 2: Public Experience (Weeks 4-6) — PARTIAL COMPLETE

#### Goals
- Build sample curricula display ✅
- Enhance "Learning Pathways" page ✅
- Create conversion funnel to signup

#### Completed Tasks

| # | Task | Status |
|---|------|--------|
| 2.1 | Rename career.html to pathways.html | ✅ PR #278 |
| 2.2 | Add accordion sample courses | ✅ PR #280 |
| 2.3 | Update navigation links | ✅ PR #278 |
| 2.4 | Add SEO redirects | ✅ PR #278 |

#### Remaining Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 2.5 | Create pathway detail preview page | High | 12 |
| 2.6 | Create course preview page | Medium | 8 |
| 2.7 | Connect "Start Learning" to signup flow | High | 4 |

---

## 📊 Success Metrics

### Phase 1 Success Criteria
- [ ] Admin can manage curriculum without writing code
- [ ] Database handles 1000+ courses without performance issues

### Phase 2 Success Criteria
- [x] Pathways page displays all 3 track types
- [x] Accordion shows sample courses
- [ ] Public page bounce rate < 50%
- [ ] Signup conversion rate > 5% from curriculum pages

---

## 📎 Appendix: Maine Learning Results Reference

### 8 Content Areas
1. English Language Arts
2. Mathematics
3. Science and Engineering
4. Social Studies
5. Health, Physical Education and Wellness
6. Visual and Performing Arts
7. World Languages
8. Life and Career Readiness

### Grade Spans
- **Childhood:** K-5
- **Early Adolescence:** 6-8
- **Adolescence:** 9-Diploma

### Maine's Guiding Principles (Cross-Curricular Skills)
1. Clear and Effective Communicator
2. Self-Directed and Lifelong Learner
3. Creative and Practical Problem Solver
4. Responsible and Involved Citizen
5. Integrative and Informed Thinker

### Maine CTE Career Clusters (16)
1. Agriculture, Food & Natural Resources
2. Architecture & Construction
3. Arts, A/V Technology & Communications
4. Business, Management & Administration
5. Education & Training
6. Finance
7. Government & Public Administration
8. Health Science
9. Hospitality & Tourism
10. Human Services
11. Information Technology
12. Law, Public Safety & Security
13. Manufacturing
14. Marketing, Sales & Service
15. Science, Technology, Engineering & Math
16. Transportation, Distribution & Logistics

---

## 📝 Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 1, 2025 | Initial plan created |
| 1.1 | Dec 2, 2025 | Updated with completed milestones (PR #278, #280) |

---

**Document End**
Now creating the deployment-ready SQL file for Neon PostgreSQL:

Pmerit curriculum implementation plan final
Document · MD 

2 steps

Copy SQL schema to outputs



Orchestrated comprehensive handoff documentation for seamless continuity.

✅ B. Database Schema SQL — COMPLETE
View Database Schema SQL

Schema includes:

14 tables with full column definitions
Performance indexes
Auto-update triggers
Seed data for all 14 pathways
Verification queries
C. Admin Curriculum Builder — Noted for Next Session
The Admin Curriculum Builder is a larger implementation task. It's documented in the Implementation Plan for Phase 1 tasks 1.4-1.9. This will be the focus of the next development session.

D. Handoff Document
Creating the session handoff document:

Pmerit curriculum schema
Code · SQL 

2 steps

Copy handoff document to outputs



Synthesized four completed tasks for implementation.

✅ D. Handoff Document — COMPLETE
View Handoff Document

📋 All Tasks Complete (A → D)
Task	Deliverable	Status
A	Implementation Plan	✅ Download
B	Database Schema SQL	✅ Download
C	Admin Builder	📝 Documented for Phase 1
D	Handoff Document	✅ Download
🎉 Session Summary
What We Accomplished
Category	Achievement
Strategy	Finalized 3 Track Types, 14 Pathways, Maine model
Frontend	2 PRs merged, accordion sample courses live
Database	14-table schema ready for deployment
Documentation	Implementation plan, schema, handoff complete
Production Status
✅ Live at: https://pmerit.com/pathways

Beautiful accordion sample courses
All 14 pathways with 42 sample courses
SEO redirects working
🔜 For Your Next Session
Files to Add to Project Governance
Copy these 3 files to docs/aados/ in your frontend repo:

PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md
PMERIT_CURRICULUM_SCHEMA.sql
HANDOFF_SESSION_CURRICULUM.md
Next Priority: Deploy Database Schema
Use the SQL file to deploy the 14 curriculum tables to Neon PostgreSQL, then begin building the Admin Curriculum Builder.

Excellent progress today! 🚀 The curriculum foundation is solid and the frontend is looking great!

-- ============================================================================
-- PMERIT CURRICULUM DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0
-- Created: December 2, 2025
-- Database: Neon PostgreSQL
-- Purpose: Curriculum management for PMERIT educational platform
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PATHWAY TABLES (4 Tables)
-- ============================================================================

-- 1. Pathways (Top-level organization)
-- Represents the 14 learning pathways across 3 track types
CREATE TABLE IF NOT EXISTS pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('global_remote', 'local_education', 'local_career')),
    pathway_name VARCHAR(255) NOT NULL,
    pathway_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_class VARCHAR(50), -- FontAwesome class e.g., 'fa-chart-line'
    icon_url TEXT,
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    target_outcome TEXT,
    tags TEXT[], -- Array of skill tags
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pathways IS 'Top-level learning pathways organized by track type (Global Remote, Local Education, Local Career)';

-- 2. Courses (Belong to pathways)
-- Each pathway contains multiple courses (typically 12 per Global Remote pathway)
CREATE TABLE IF NOT EXISTS courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    course_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'WD-101', 'DA-102'
    course_title VARCHAR(255) NOT NULL,
    course_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    learning_objectives TEXT[], -- Array of learning objectives
    estimated_duration_weeks INTEGER,
    estimated_hours INTEGER, -- Total hours to complete
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisite_course_ids UUID[], -- Array of prerequisite course IDs
    required_skills TEXT[], -- Skills needed before starting
    thumbnail_url TEXT,
    intro_video_url TEXT,
    syllabus JSONB, -- Detailed syllabus as JSON
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    enrollment_limit INTEGER, -- NULL = unlimited
    current_enrollments INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE courses IS 'Individual courses within pathways, containing modules and lessons';

-- 3. Course Modules (Belong to courses)
-- Each course is divided into modules (typically 4-6 per course)
CREATE TABLE IF NOT EXISTS course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_module_ids UUID[],
    unlock_date TIMESTAMPTZ, -- For drip content
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

COMMENT ON TABLE course_modules IS 'Modules within courses, grouping related lessons together';

-- 4. Lessons (Belong to modules)
-- Individual learning units within modules
CREATE TABLE IF NOT EXISTS lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type VARCHAR(20) NOT NULL CHECK (lesson_type IN ('video', 'reading', 'interactive', 'quiz', 'project', 'discussion')),
    content_url TEXT, -- URL to video, PDF, etc.
    content_text TEXT, -- Markdown/HTML content for reading lessons
    content_metadata JSONB, -- Duration, file size, etc.
    estimated_duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    is_preview BOOLEAN DEFAULT FALSE, -- Can be viewed without enrollment
    prerequisite_lesson_ids UUID[],
    transcript TEXT, -- For video lessons
    resources JSONB, -- Additional downloadable resources
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

COMMENT ON TABLE lessons IS 'Individual lessons/learning units within modules';

-- ============================================================================
-- MATERIALS LIBRARY (2 Tables)
-- ============================================================================

-- 5. Materials Library
-- Central repository for all uploaded materials
CREATE TABLE IF NOT EXISTS materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type VARCHAR(20) NOT NULL CHECK (material_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio', 'archive')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    duration_seconds INTEGER, -- For video/audio
    tags TEXT[],
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID, -- References users table
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE materials IS 'Central library of all uploaded learning materials';

-- 6. Material Attachments
-- Links materials to pathways, courses, modules, or lessons
CREATE TABLE IF NOT EXISTS material_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(material_id) ON DELETE CASCADE,
    attached_to_type VARCHAR(20) NOT NULL CHECK (attached_to_type IN ('pathway', 'course', 'module', 'lesson')),
    attached_to_id UUID NOT NULL,
    attachment_label VARCHAR(100), -- e.g., "Supplementary Reading", "Practice File"
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE material_attachments IS 'Junction table linking materials to content items';

-- ============================================================================
-- STUDENT ENROLLMENT TABLES (3 Tables)
-- ============================================================================

-- 7. Pathway Enrollments
-- Tracks student enrollment in entire pathways
CREATE TABLE IF NOT EXISTS pathway_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References users table
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped', 'expired')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    courses_completed INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expected_completion TIMESTAMPTZ,
    certificate_url TEXT,
    certificate_issued_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(user_id, pathway_id)
);

COMMENT ON TABLE pathway_enrollments IS 'Student enrollments in learning pathways';

-- 8. Course Enrollments
-- Tracks student enrollment in individual courses
CREATE TABLE IF NOT EXISTS course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    pathway_enrollment_id UUID REFERENCES pathway_enrollments(enrollment_id) ON DELETE SET NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER DEFAULT 0,
    final_grade DECIMAL(5,2),
    certificate_url TEXT,
    certificate_issued_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

COMMENT ON TABLE course_enrollments IS 'Student enrollments in individual courses';

-- 9. Lesson Progress
-- Tracks student progress through individual lessons
CREATE TABLE IF NOT EXISTS lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position JSONB, -- Video timestamp, scroll position, etc.
    score DECIMAL(5,2), -- For quiz/assessment lessons
    attempts INTEGER DEFAULT 0,
    notes TEXT, -- Student's personal notes
    bookmarked BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, lesson_id)
);

COMMENT ON TABLE lesson_progress IS 'Individual lesson completion tracking per student';

-- ============================================================================
-- ASSESSMENT TABLES (3 Tables)
-- ============================================================================

-- 10. Assessments
-- Quizzes, exams, projects, and portfolios
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('quiz', 'exam', 'project', 'portfolio', 'peer_review')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    total_points DECIMAL(7,2) DEFAULT 100.00,
    time_limit_minutes INTEGER, -- NULL = unlimited
    max_attempts INTEGER DEFAULT 3, -- NULL = unlimited
    shuffle_questions BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    show_correct_after VARCHAR(20) DEFAULT 'submission' CHECK (show_correct_after IN ('never', 'submission', 'deadline', 'always')),
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE assessments IS 'Assessment definitions (quizzes, exams, projects)';

-- 11. Assessment Questions
-- Questions within assessments
CREATE TABLE IF NOT EXISTS assessment_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'multiple_select', 'true_false', 'short_answer', 'essay', 'matching', 'fill_blank', 'code')),
    question_text TEXT NOT NULL,
    question_media_url TEXT, -- Image or video for the question
    options JSONB, -- For multiple choice: [{id, text, is_correct}]
    correct_answer JSONB, -- Varies by question type
    points DECIMAL(5,2) DEFAULT 1.00,
    partial_credit BOOLEAN DEFAULT FALSE,
    explanation TEXT, -- Shown after answering
    hint TEXT,
    tags TEXT[],
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE assessment_questions IS 'Individual questions within assessments';

-- 12. Assessment Attempts
-- Student attempts at assessments
CREATE TABLE IF NOT EXISTS assessment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER,
    answers JSONB, -- {question_id: {answer, is_correct, points_earned}}
    score DECIMAL(7,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT, -- Instructor feedback
    graded_by UUID, -- For manual grading
    graded_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT
);

COMMENT ON TABLE assessment_attempts IS 'Student assessment attempt records';

-- ============================================================================
-- LOCALIZATION TABLES (2 Tables)
-- ============================================================================

-- 13. Content Translations
-- Translations for all content types
CREATE TABLE IF NOT EXISTS content_translations (
    translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('pathway', 'course', 'module', 'lesson', 'material', 'assessment', 'question')),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL, -- e.g., 'en', 'yo' (Yoruba), 'ig' (Igbo), 'ha' (Hausa)
    field_name VARCHAR(50) NOT NULL, -- e.g., 'title', 'description', 'content_text'
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_machine_translated BOOLEAN DEFAULT FALSE,
    translated_by UUID,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language_code, field_name)
);

COMMENT ON TABLE content_translations IS 'Translations for content in multiple languages';

-- 14. Cultural Adaptations
-- Region-specific content adaptations (examples, case studies, etc.)
CREATE TABLE IF NOT EXISTS cultural_adaptations (
    adaptation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL, -- e.g., 'US-ME' (Maine), 'NG' (Nigeria), 'NG-LA' (Lagos)
    adaptation_type VARCHAR(20) NOT NULL CHECK (adaptation_type IN ('example', 'analogy', 'case_study', 'context', 'currency', 'measurement')),
    original_content TEXT,
    adapted_content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_by UUID,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cultural_adaptations IS 'Culturally adapted content for different regions';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Pathway indexes
CREATE INDEX IF NOT EXISTS idx_pathways_track_type ON pathways(track_type);
CREATE INDEX IF NOT EXISTS idx_pathways_published ON pathways(is_published);
CREATE INDEX IF NOT EXISTS idx_pathways_slug ON pathways(pathway_slug);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_pathway ON courses(pathway_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(course_slug);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);

-- Module indexes
CREATE INDEX IF NOT EXISTS idx_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_sort ON course_modules(course_id, sort_order);

-- Lesson indexes
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_sort ON lessons(module_id, sort_order);

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(material_type);
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);

-- Material attachments indexes
CREATE INDEX IF NOT EXISTS idx_attachments_material ON material_attachments(material_id);
CREATE INDEX IF NOT EXISTS idx_attachments_target ON material_attachments(attached_to_type, attached_to_id);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_pathway_enrollments_user ON pathway_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_pathway_enrollments_status ON pathway_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_pathway ON course_enrollments(pathway_enrollment_id);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON lesson_progress(course_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_module ON assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON assessment_attempts(assessment_id);

-- Translation indexes
CREATE INDEX IF NOT EXISTS idx_translations_content ON content_translations(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON content_translations(language_code);

-- Cultural adaptation indexes
CREATE INDEX IF NOT EXISTS idx_adaptations_lesson ON cultural_adaptations(lesson_id);
CREATE INDEX IF NOT EXISTS idx_adaptations_region ON cultural_adaptations(region_code);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name IN ('pathways', 'courses', 'course_modules', 'lessons', 'materials', 'assessments', 'content_translations', 'cultural_adaptations')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA: Initial Pathways
-- ============================================================================

-- Insert the 14 pathways matching the frontend
INSERT INTO pathways (track_type, pathway_name, pathway_slug, description, icon_class, difficulty_level, tags, is_published, sort_order) VALUES

-- Global Remote Tracks (6)
('global_remote', 'Data Analytics', 'data-analytics', 'Learn to analyze data, create visualizations, and drive business insights with modern analytics tools.', 'fa-chart-line', 'beginner', ARRAY['Python', 'SQL', 'Tableau', 'Statistics'], TRUE, 1),
('global_remote', 'Digital Marketing', 'digital-marketing', 'Master SEO, social media marketing, content strategy, and analytics to grow businesses online.', 'fa-bullhorn', 'beginner', ARRAY['SEO', 'Social Media', 'Analytics', 'Content'], TRUE, 2),
('global_remote', 'UX Design', 'ux-design', 'Create user-centered designs, conduct research, and build intuitive interfaces for web and mobile.', 'fa-palette', 'beginner', ARRAY['Figma', 'User Research', 'Prototyping', 'UI Design'], TRUE, 3),
('global_remote', 'Web Development', 'web-development', 'Build modern, responsive websites and web applications using the latest technologies and frameworks.', 'fa-code', 'beginner', ARRAY['HTML/CSS', 'JavaScript', 'React', 'Node.js'], TRUE, 4),
('global_remote', 'Project Management', 'project-management', 'Lead teams, manage projects, and deliver results using agile methodologies and PM best practices.', 'fa-tasks', 'intermediate', ARRAY['Agile', 'Scrum', 'Leadership', 'Planning'], TRUE, 5),
('global_remote', 'Business Analysis', 'business-analysis', 'Bridge the gap between business needs and technical solutions through strategic analysis.', 'fa-briefcase', 'intermediate', ARRAY['Requirements', 'Process Modeling', 'Strategy', 'Communication'], TRUE, 6),

-- Local Education Tracks (4)
('local_education', 'Early Childhood Education', 'early-childhood', 'Foundational programs for nursery and kindergarten focusing on holistic child development.', 'fa-child', 'all_levels', ARRAY['Ages 3-5', 'Play-Based', 'Social Skills', 'Early Literacy'], TRUE, 1),
('local_education', 'Primary School', 'primary-school', 'Core academic subjects and essential skills for grades 1-6 with personalized learning support.', 'fa-book-open', 'all_levels', ARRAY['Math', 'Reading', 'Science', 'Art'], TRUE, 2),
('local_education', 'Secondary School', 'secondary-school', 'Advanced curricula preparing students for college and career pathways through grades 7-12.', 'fa-graduation-cap', 'all_levels', ARRAY['STEM', 'Humanities', 'College Prep', 'Career Ready'], TRUE, 3),
('local_education', 'College & University', 'college-university', 'Higher education programs with degree and certification pathways in partnership with institutions.', 'fa-university', 'advanced', ARRAY['Bachelor''s', 'Associate', 'Certificates', 'Online'], TRUE, 4),

-- Local Career Pathways (4)
('local_career', 'Healthcare Careers', 'healthcare-careers', 'Training for medical assistants, nursing, and healthcare administration roles in local facilities.', 'fa-heartbeat', 'beginner', ARRAY['Nursing', 'Medical Tech', 'Admin', 'Certified'], TRUE, 1),
('local_career', 'Skilled Trades', 'skilled-trades', 'Hands-on training in electrical, plumbing, HVAC, and construction trades with apprenticeships.', 'fa-tools', 'beginner', ARRAY['Electrical', 'Plumbing', 'HVAC', 'Apprenticeship'], TRUE, 2),
('local_career', 'Hospitality & Service', 'hospitality-service', 'Customer service, culinary arts, and hotel management programs for the tourism industry.', 'fa-concierge-bell', 'beginner', ARRAY['Culinary', 'Hotel Mgmt', 'Customer Service', 'Tourism'], TRUE, 3),
('local_career', 'Public Service', 'public-service', 'Career preparation for public safety, social work, and government administration positions.', 'fa-landmark', 'beginner', ARRAY['Fire/EMS', 'Social Work', 'Admin', 'Community'], TRUE, 4)

ON CONFLICT (pathway_slug) DO UPDATE SET
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    updated_at = NOW();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
    'pathways', 'courses', 'course_modules', 'lessons',
    'materials', 'material_attachments',
    'pathway_enrollments', 'course_enrollments', 'lesson_progress',
    'assessments', 'assessment_questions', 'assessment_attempts',
    'content_translations', 'cultural_adaptations'
)
ORDER BY table_name;

-- Verify pathways were seeded
SELECT pathway_name, track_type, is_published FROM pathways ORDER BY track_type, sort_order;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
# 📚 PMERIT CURRICULUM IMPLEMENTATION PLAN
## Maine-Model Educational Framework with Global Adaptation

**Version:** 1.1  
**Created:** December 1, 2025  
**Updated:** December 2, 2025  
**Status:** Phase 2 In Progress  

---

## 🎯 Executive Summary

This document outlines the complete implementation plan for PMERIT's curriculum system, using Maine's educational framework as the foundational model. The plan covers three distinct track types, user access flows, database architecture, and a phased rollout strategy.

---

## ✅ COMPLETED MILESTONES

### Session Progress (December 1-2, 2025)

| Task | Status | PR/Commit |
|------|--------|-----------|
| File renamed: `career.html` → `pathways.html` | ✅ Complete | PR #278 |
| URL redirect: `/career` → `/pathways` (301) | ✅ Complete | PR #278 |
| UI text: "Career Track" → "Learning Pathways" | ✅ Complete | PR #278 |
| Accordion sample courses (42 courses across 14 pathways) | ✅ Complete | PR #280 |
| Cloudflare deployment + cache purge | ✅ Complete | — |

---

## 📊 Track Structure Overview

### The Three Track Types

| Track Type | Pathways | Focus | Model Basis |
|------------|----------|-------|-------------|
| **Global Remote** | 6 | Work-from-anywhere careers | Industry-aligned competencies |
| **Local Education** | 4 | Age-based learning (PreK-College) | Maine Learning Results + CTE |
| **Local Career** | 4 | Location-based careers | Maine CTE 16 Career Clusters |

---

## 🏫 TRACK 1: Global Remote (6 Pathways)

### Structure
Each pathway = 12 courses × ~4-6 weeks per course = 48-72 weeks to completion

### The 6 Global Remote Pathways

| # | Pathway | Core Competencies | Target Outcome |
|---|---------|-------------------|----------------|
| 1 | **Data Analytics** | Python, SQL, Tableau, Statistics | Data Analyst roles |
| 2 | **Digital Marketing** | SEO, Social Media, Content Strategy, Analytics | Marketing Specialist |
| 3 | **UX Design** | Figma, User Research, Prototyping, UI Design | UX/UI Designer |
| 4 | **Web Development** | HTML/CSS, JavaScript, React, Node.js | Full-Stack Developer |
| 5 | **Project Management** | Agile, Scrum, Risk Management, Stakeholder Comm | Project Manager |
| 6 | **Business Analysis** | Requirements Gathering, Process Mapping, SQL | Business Analyst |

### Sample: Web Development Pathway (12 Courses)

| Course # | Course Title | Duration | Prerequisites | Key Deliverable |
|----------|--------------|----------|---------------|-----------------|
| WD-101 | HTML & CSS Fundamentals | 2 weeks | None | Static portfolio page |
| WD-102 | JavaScript Essentials | 4 weeks | WD-101 | Interactive calculator |
| WD-103 | Responsive Design | 2 weeks | WD-102 | Mobile-first website |
| WD-104 | Version Control (Git) | 1 week | WD-102 | GitHub portfolio |
| WD-105 | React Fundamentals | 4 weeks | WD-104 | React todo app |
| WD-106 | Backend with Node.js | 4 weeks | WD-105 | REST API |
| WD-107 | Database Design | 3 weeks | WD-106 | PostgreSQL integration |
| WD-108 | Authentication & Security | 2 weeks | WD-107 | Secure login system |
| WD-109 | Cloud Deployment | 2 weeks | WD-108 | Live deployed app |
| WD-110 | API Integration | 2 weeks | WD-109 | Third-party API usage |
| WD-111 | Testing & QA | 2 weeks | WD-110 | Automated test suite |
| WD-112 | Capstone Project | 4 weeks | All above | Full-stack portfolio project |

**Total Duration:** ~32 weeks to job-ready

---

## 🏫 TRACK 2: Local Education (4 Pathways) — Maine Model

### Based on Maine Learning Results Structure

Maine organizes education into **8 Content Areas** across **4 Grade Spans**:

#### Maine's 8 Content Areas (Adapted for PMERIT)
1. English Language Arts (ELA)
2. Mathematics
3. Science & Engineering
4. Social Studies
5. Health & Physical Education
6. Visual & Performing Arts
7. World Languages
8. Life & Career Readiness

#### Maine's Grade Spans (PMERIT Adaptation)

| Pathway | Maine Equivalent | Age Range | Grade Levels | Focus |
|---------|------------------|-----------|--------------|-------|
| **Early Childhood** | Pre-K to Grade 2 | Ages 3-7 | PreK, K, 1, 2 | Foundational literacy & numeracy |
| **Primary** | Childhood (K-5) | Ages 5-11 | K, 1, 2, 3, 4, 5 | Core academic skills |
| **Secondary** | Early Adolescence + Adolescence | Ages 11-18 | 6, 7, 8, 9, 10, 11, 12 | College & career prep |
| **College** | Post-secondary | Ages 18+ | Higher Ed | Degree pathways |

### Nigeria Adaptation

The same Maine structure adapts to Nigeria by:
1. **Mapping to Nigerian Educational Levels:**
   - Early Childhood → Early Child Care Development Education (ECCDE)
   - Primary → Primary Education (Basic 1-6)
   - Secondary → Junior Secondary (JSS 1-3) + Senior Secondary (SSS 1-3)
   - College → Tertiary Education

2. **Cultural Content Localization:**
   - Local history and geography content
   - Nigerian civic education
   - Indigenous language options (Yoruba, Igbo, Hausa)
   - Culturally relevant examples and case studies

---

## 🏫 TRACK 3: Local Career (4 Pathways) — Maine CTE Model

### Based on Maine's 16 Career Clusters (Consolidated to 4)

| PMERIT Pathway | Maine CTE Clusters Included | Example Careers |
|----------------|----------------------------|-----------------|
| **Healthcare Careers** | Health Science | CNA, EMT, Medical Assistant, Nursing |
| **Skilled Trades** | Architecture & Construction, Manufacturing, Transportation | Electrician, Plumber, Welder, Automotive Tech |
| **Hospitality & Service** | Hospitality & Tourism, Human Services | Culinary Arts, Hotel Management, Food Service |
| **Public Service** | Government & Public Admin, Law/Public Safety, Education | Law Enforcement, Firefighting, Teaching Assistant |

---

## 👥 USER ACCESS FLOWS

### Flow 1: Public/Guest Access

```
Visit pmerit.com
    │
    ▼
Homepage (AI Chat + Quick Actions)
    │
    ▼
Click "Learning Pathways" in sidebar
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│              SAMPLE CURRICULA (Preview Mode)                │
├─────────────────────────────────────────────────────────────┤
│  Tab 1: Global Remote Tracks (6 pathways)                   │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
│                                                             │
│  Tab 2: Local Education (4 pathways)                        │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
│                                                             │
│  Tab 3: Local Career Pathways (4 pathways)                  │
│    • Click "Learn More ∨" → Accordion shows 3 sample courses│
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Click "Start Learning" or "Discover Your Path"
    │
    ▼
Prompt to Sign Up / Subscribe
```

### Flow 2: Student Access (Subscribed)

```
Sign In → Account Verified
    │
    ▼
DASHBOARD (Personalized Home)
┌─────────────────────────────────────────────────────────────┐
│  • My Enrolled Courses (Current classes)                    │
│  • Progress Overview (% complete per course)                │
│  • Next Up (Next lesson/assignment)                         │
│  • Achievements/Certificates                                │
│  • AI Recommendations                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
COURSE CATALOG (Full Access)
┌─────────────────────────────────────────────────────────────┐
│  Browse All Pathways                                        │
│    │                                                        │
│    ├── Global Remote (6 pathways, 12 courses each)          │
│    ├── Local Education (4 pathways, grade-level courses)    │
│    └── Local Career (4 pathways, certification courses)     │
│                                                             │
│  [+ Add Course] → Course added to Dashboard                 │
│  [- Drop Course] → Course removed from Dashboard            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
CLASSROOM (Learning Environment)
┌─────────────────────────────────────────────────────────────┐
│  Active Course View                                         │
│    • Video Lessons                                          │
│    • Reading Materials                                      │
│    • Interactive Exercises                                  │
│    • Quizzes/Assessments                                    │
│    • AI Tutor Chat (contextual help)                        │
│    • Progress Tracker                                       │
│                                                             │
│  Course Completion Flow:                                    │
│    Complete Course → Certificate → Next Course Auto-Added   │
│    OR Manual Selection from Catalog                         │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Admin Access (Curriculum Management)

```
Admin Sign In → Role Verified
    │
    ▼
ADMIN DASHBOARD
┌─────────────────────────────────────────────────────────────┐
│  Overview Stats:                                            │
│    • Total Students Enrolled                                │
│    • Courses Active                                         │
│    • Completion Rates                                       │
│    • Popular Pathways                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
CURRICULUM BUILDER (No-Code Interface)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. PATHWAY MANAGEMENT                                      │
│     [+ Create Pathway]                                      │
│       • Name, Track Type, Description, Icon                 │
│       • Duration, Difficulty                                │
│     [Save Pathway]                                          │
│                                                             │
│  2. COURSE MANAGEMENT                                       │
│     Select Pathway → [+ Add Course]                         │
│       • Course Code, Title, Description                     │
│       • Duration, Prerequisites, Learning Objectives        │
│     [Save Course]                                           │
│                                                             │
│  3. MODULE MANAGEMENT                                       │
│     Select Course → [+ Add Module]                          │
│       • Module Number, Title, Description                   │
│       • Duration, Order (Drag & Drop)                       │
│     [Save Module]                                           │
│                                                             │
│  4. LESSON MANAGEMENT                                       │
│     Select Module → [+ Add Lesson]                          │
│       • Type: Video/Reading/Interactive/Quiz/Project        │
│       • Content: Rich Text Editor / Video Upload            │
│     [Save Lesson]                                           │
│                                                             │
│  5. MATERIALS LIBRARY                                       │
│     [+ Upload Material] → PDF/Video/Image/Link              │
│     Attach to Course/Module/Lesson                          │
│                                                             │
│  6. ASSESSMENT BUILDER                                      │
│     [+ Create Assessment]                                   │
│       • Type: Quiz/Exam/Project/Portfolio                   │
│       • Questions: Multiple Choice/True-False/Essay         │
│       • Passing Score, Time Limit, Attempts                 │
│     [Save Assessment]                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### New Tables Required (14 Tables)

```sql
-- =============================================
-- PATHWAY TABLES
-- =============================================

-- 1. Pathways (Top-level organization)
CREATE TABLE pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('global_remote', 'local_education', 'local_career')),
    pathway_name VARCHAR(255) NOT NULL,
    pathway_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    target_outcome TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses (Belong to pathways)
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisite_course_ids UUID[],
    thumbnail_url TEXT,
    intro_video_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Modules (Belong to courses)
CREATE TABLE course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_module_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

-- 4. Lessons (Belong to modules)
CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type VARCHAR(20) CHECK (lesson_type IN ('video', 'reading', 'interactive', 'quiz', 'project')),
    content_url TEXT,
    content_text TEXT,
    content_metadata JSONB,
    estimated_duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_lesson_ids UUID[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

-- 5. Materials Library
CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type VARCHAR(20) CHECK (material_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Material Attachments
CREATE TABLE material_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(material_id) ON DELETE CASCADE,
    attached_to_type VARCHAR(20) CHECK (attached_to_type IN ('pathway', 'course', 'module', 'lesson')),
    attached_to_id UUID NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STUDENT ENROLLMENT TABLES
-- =============================================

-- 7. Student Pathway Enrollments
CREATE TABLE pathway_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ,
    certificate_url TEXT,
    UNIQUE(user_id, pathway_id)
);

-- 8. Student Course Enrollments
CREATE TABLE course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    pathway_enrollment_id UUID REFERENCES pathway_enrollments(enrollment_id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    final_grade DECIMAL(5,2),
    certificate_url TEXT,
    UNIQUE(user_id, course_id)
);

-- 9. Lesson Progress
CREATE TABLE lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    score DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,
    last_position JSONB,
    UNIQUE(user_id, lesson_id)
);

-- =============================================
-- ASSESSMENT TABLES
-- =============================================

-- 10. Assessments
CREATE TABLE assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    module_id UUID REFERENCES course_modules(module_id),
    lesson_id UUID REFERENCES lessons(lesson_id),
    assessment_type VARCHAR(20) CHECK (assessment_type IN ('quiz', 'exam', 'project', 'portfolio')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessment Questions
CREATE TABLE assessment_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB,
    points DECIMAL(5,2) DEFAULT 1.00,
    explanation TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Student Assessment Attempts
CREATE TABLE assessment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    answers JSONB,
    score DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT,
    attempt_number INTEGER DEFAULT 1
);

-- =============================================
-- LOCALIZATION TABLES
-- =============================================

-- 13. Content Translations
CREATE TABLE content_translations (
    translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20) CHECK (content_type IN ('pathway', 'course', 'module', 'lesson', 'material')),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    translated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language_code, field_name)
);

-- 14. Cultural Adaptations
CREATE TABLE cultural_adaptations (
    adaptation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    adaptation_type VARCHAR(20) CHECK (adaptation_type IN ('example', 'analogy', 'case_study', 'context')),
    original_content TEXT,
    adapted_content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pathways_track_type ON pathways(track_type);
CREATE INDEX idx_pathways_published ON pathways(is_published);
CREATE INDEX idx_courses_pathway ON courses(pathway_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_modules_course ON course_modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_pathway_enrollments_user ON pathway_enrollments(user_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_translations_content ON content_translations(content_type, content_id, language_code);
```

---

## 📅 IMPLEMENTATION PHASES

### Phase Overview

| Phase | Name | Duration | Focus | Status |
|-------|------|----------|-------|--------|
| **Phase 1** | Foundation | 2-3 weeks | Database + Admin Core | 🔜 Next |
| **Phase 2** | Public Experience | 2-3 weeks | Sample Curricula + Browse | ✅ Partial |
| **Phase 3** | Student Experience | 3-4 weeks | Dashboard + Classroom | ⏳ Pending |
| **Phase 4** | Content Population | 4-6 weeks | First Complete Pathway | ⏳ Pending |
| **Phase 5** | Localization | 2-3 weeks | Nigeria Adaptation | ⏳ Pending |
| **Phase 6** | Scale | Ongoing | Additional Pathways | ⏳ Pending |

---

### 📍 PHASE 1: Foundation (Weeks 1-3) — NEXT

#### Goals
- Deploy curriculum database schema
- Build Admin CRUD operations
- Create basic admin interface

#### Tasks

| # | Task | Priority | Est. Hours | Status |
|---|------|----------|------------|--------|
| 1.1 | Deploy 14 new database tables | Critical | 4 | ⏳ |
| 1.2 | Create API endpoints for CRUD operations | Critical | 16 | ⏳ |
| 1.3 | Build Admin authentication/authorization | Critical | 8 | ⏳ |
| 1.4 | Create Pathway management UI | High | 12 | ⏳ |
| 1.5 | Create Course management UI | High | 12 | ⏳ |
| 1.6 | Create Module management UI | High | 8 | ⏳ |
| 1.7 | Create Lesson management UI | High | 12 | ⏳ |
| 1.8 | Create Materials upload/library UI | Medium | 8 | ⏳ |
| 1.9 | Create Assessment builder UI | Medium | 12 | ⏳ |
| 1.10 | Admin dashboard with stats | Medium | 8 | ⏳ |

---

### 📍 PHASE 2: Public Experience (Weeks 4-6) — PARTIAL COMPLETE

#### Goals
- Build sample curricula display ✅
- Enhance "Learning Pathways" page ✅
- Create conversion funnel to signup

#### Completed Tasks

| # | Task | Status |
|---|------|--------|
| 2.1 | Rename career.html to pathways.html | ✅ PR #278 |
| 2.2 | Add accordion sample courses | ✅ PR #280 |
| 2.3 | Update navigation links | ✅ PR #278 |
| 2.4 | Add SEO redirects | ✅ PR #278 |

#### Remaining Tasks

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 2.5 | Create pathway detail preview page | High | 12 |
| 2.6 | Create course preview page | Medium | 8 |
| 2.7 | Connect "Start Learning" to signup flow | High | 4 |

---

## 📊 Success Metrics

### Phase 1 Success Criteria
- [ ] Admin can manage curriculum without writing code
- [ ] Database handles 1000+ courses without performance issues

### Phase 2 Success Criteria
- [x] Pathways page displays all 3 track types
- [x] Accordion shows sample courses
- [ ] Public page bounce rate < 50%
- [ ] Signup conversion rate > 5% from curriculum pages

---

## 📎 Appendix: Maine Learning Results Reference

### 8 Content Areas
1. English Language Arts
2. Mathematics
3. Science and Engineering
4. Social Studies
5. Health, Physical Education and Wellness
6. Visual and Performing Arts
7. World Languages
8. Life and Career Readiness

### Grade Spans
- **Childhood:** K-5
- **Early Adolescence:** 6-8
- **Adolescence:** 9-Diploma

### Maine's Guiding Principles (Cross-Curricular Skills)
1. Clear and Effective Communicator
2. Self-Directed and Lifelong Learner
3. Creative and Practical Problem Solver
4. Responsible and Involved Citizen
5. Integrative and Informed Thinker

### Maine CTE Career Clusters (16)
1. Agriculture, Food & Natural Resources
2. Architecture & Construction
3. Arts, A/V Technology & Communications
4. Business, Management & Administration
5. Education & Training
6. Finance
7. Government & Public Administration
8. Health Science
9. Hospitality & Tourism
10. Human Services
11. Information Technology
12. Law, Public Safety & Security
13. Manufacturing
14. Marketing, Sales & Service
15. Science, Technology, Engineering & Math
16. Transportation, Distribution & Logistics

---

## 📝 Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 1, 2025 | Initial plan created |
| 1.1 | Dec 2, 2025 | Updated with completed milestones (PR #278, #280) |

---

**Document End**
Handoff session curriculum
# 📋 PMERIT Platform — Handoff Document
## Session: Curriculum Implementation Brainstorm & Initial Build

**Date:** December 1-2, 2025  
**Session Focus:** Curriculum Implementation Planning & Frontend Sample Curricula  
**Status:** ✅ Phase 2 Partial Complete  
**Next Session:** Verify existing backend database schema  

---

## 🎯 Session Summary

This session accomplished the strategic planning and initial frontend implementation for PMERIT's curriculum system based on the Maine educational model.

---

## ✅ Completed Tasks

### 1. Strategic Planning
| Task | Deliverable |
|------|-------------|
| Curriculum structure finalized | 3 Track Types, 14 Pathways |
| Maine model research | MLR + CTE framework documented |
| Implementation plan created | 6-phase, 16-19 week roadmap |
| User flows designed | Public, Student, Admin flows |

### 2. Frontend Implementation

| Task | PR | Status |
|------|-----|--------|
| Rename `career.html` → `pathways.html` | PR #278 | ✅ Merged |
| Update all navigation links | PR #278 | ✅ Merged |
| Add SEO redirects `/career` → `/pathways` | PR #278 | ✅ Merged |
| UI text: "Career Track" → "Learning Pathways" | PR #278 | ✅ Merged |
| Accordion sample courses (42 courses) | PR #280 | ✅ Merged |
| Fix accordion toggle bug | PR #281 | ✅ Merged |
| Mobile header bugs (globe + sticky) | PR #282 | ✅ Merged |
| Cloudflare deployment + cache purge | — | ✅ Complete |

### 3. Documentation Created

| Document | Location |
|----------|----------|
| Implementation Plan v1.1 | `/mnt/user-data/outputs/PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md` |
| Database Schema SQL | `/mnt/user-data/outputs/PMERIT_CURRICULUM_SCHEMA.sql` |
| This Handoff Document | `/mnt/user-data/outputs/HANDOFF_SESSION_CURRICULUM.md` |

---

## 📊 Current State

### Production URLs
- ✅ `https://pmerit.com/pathways` — Live with accordion sample courses
- ✅ `https://pmerit.com/career` — Redirects to `/pathways` (301)
- ✅ `https://pmerit.com/courses` — Individual courses page

### Repository State
- **Frontend:** `peoplemerit/pmerit-ai-platform` — Main branch updated
- **Backend:** `peoplemerit/pmerit-api-worker` — No changes this session

### Database State
- **Neon PostgreSQL:** Schema NOT yet deployed (pending Phase 1)
- **SQL Ready:** 14-table curriculum schema prepared

---

## 🏗️ Architecture Decisions Made

### 1. Three Track Types (Confirmed)

| Track Type | Pathways | Model Basis |
|------------|----------|-------------|
| Global Remote | 6 | Industry competencies |
| Local Education | 4 | Maine Learning Results |
| Local Career | 4 | Maine CTE Clusters |

### 2. Maine Model Adaptation

**Why Maine:**
- Founder based in Maine
- Direct access to resources
- Rural focus matches target audience
- Transferable to Nigeria

**Key Standards:**
- Maine Learning Results (MLR) — K-12 academic standards
- Maine CTE — 16 Career Clusters, 79 Pathways
- Common Core alignment

### 3. Pathway Structure

| Level | Contains | Example |
|-------|----------|---------|
| Track Type | 4-6 Pathways | Global Remote |
| Pathway | 12 Courses | Web Development |
| Course | 4-6 Modules | JavaScript Essentials |
| Module | 5-10 Lessons | Variables & Data Types |
| Lesson | Content + Assessment | Video: What are Variables? |

### 4. Database Schema

**14 Tables Designed:**
1. `pathways` — Top-level organization
2. `courses` — Individual courses
3. `course_modules` — Module containers
4. `lessons` — Learning units
5. `materials` — Content library
6. `material_attachments` — Content links
7. `pathway_enrollments` — Pathway tracking
8. `course_enrollments` — Course tracking
9. `lesson_progress` — Lesson completion
10. `assessments` — Quiz/exam definitions
11. `assessment_questions` — Question bank
12. `assessment_attempts` — Student attempts
13. `content_translations` — Localization
14. `cultural_adaptations` — Regional content

---

## 🔜 Next Steps (Priority Order)

### Immediate (Phase 1 — Foundation)

| Priority | Task | Estimated Time |
|----------|------|----------------|
| 1 | Deploy curriculum schema to Neon PostgreSQL | 1-2 hours |
| 2 | Create backend API endpoints (CRUD for pathways/courses) | 8-12 hours |
| 3 | Build Admin dashboard UI foundation | 8-12 hours |
| 4 | Create Pathway management (no-code) | 8-12 hours |
| 5 | Create Course management (no-code) | 8-12 hours |

### Database Deployment Instructions

```bash
# Option 1: Via Neon Dashboard
# 1. Go to https://console.neon.tech
# 2. Select pmerit database
# 3. Open SQL Editor
# 4. Paste contents of PMERIT_CURRICULUM_SCHEMA.sql
# 5. Execute

# Option 2: Via CLI (if psql available)
psql "postgresql://user:pass@host/dbname" -f PMERIT_CURRICULUM_SCHEMA.sql
```

### Files to Add to Governance

Copy these to `docs/aados/` in frontend repo:
1. `PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md`
2. `PMERIT_CURRICULUM_SCHEMA.sql`

---

## 📁 Files Modified This Session

### Frontend Repository (`pmerit-ai-platform`)

| File | Change |
|------|--------|
| `career.html` → `pathways.html` | Renamed |
| `pathways.html` | Added accordion CSS + JS (~300 lines) |
| `assets/data/career-tracks.json` | Added sampleCourses for 14 pathways |
| `index.html` | Updated sidebar navigation |
| `learner-portal.html` | Updated navigation links |
| `old-index.html` | Updated navigation links |
| `partials/header.html` | Updated menu text |
| `partials/footer.html` | Updated footer links |
| `assets/js/main.js` | Updated navigation handlers |
| `assets/js/layout-loader.js` | Updated click handlers |
| `assets/js/assessment-results.js` | Updated career links |
| `assessment-results.html` | Updated pathway links |
| `_redirects` | Added /career → /pathways (301) |

---

## 🧪 Verification Checklist

### Frontend (All Passing)
- [x] `pmerit.com/pathways` loads correctly
- [x] `/career` redirects to `/pathways`
- [x] All 3 tabs display (Global Remote, Local Education, Local Career)
- [x] All 14 pathway cards render
- [x] Accordion expands/collapses on click
- [x] Sample courses display correctly (3 per pathway)
- [x] "Start Learning" button links to courses page
- [x] Mobile responsive
- [x] Navigation links updated throughout site

### Backend (Pending)
- [ ] Database schema deployed
- [ ] API endpoints created
- [ ] Admin authentication working

---

## 🚨 Known Issues / Notes

### None Critical

### Minor Observations:
1. `career-tracks.json` now contains all curriculum data — may want to move to database once schema deployed
2. Accordion animation could be enhanced with icon rotation (currently using text toggle)
3. "Start Learning" currently goes to `/courses` — will need to connect to enrollment flow later

---

## 📞 For Next Session

### Command to Resume
```
PMERIT CONTINUE
```

### Recommended Focus
**Verify Existing Backend Database Schema**

### Next Session Tasks
1. Check existing tables in Neon PostgreSQL
2. Compare with new curriculum schema requirements
3. Identify gaps between existing and required tables
4. Plan migration/additions if needed
5. Deploy any new tables required

### Backend Environment
- **Repository:** `peoplemerit/pmerit-api-worker`
- **Local Path:** `E:\pmerit\pmerit-api-worker`
- **Database:** Neon PostgreSQL (check Cloudflare environment variables)

### Key Questions for Next Session
1. What tables already exist in the database?
2. Does the existing schema support curriculum management?
3. What new tables need to be added from `PMERIT_CURRICULUM_SCHEMA.sql`?

### Key Documents to Review
1. This handoff document
2. `PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md`
3. `PMERIT_CURRICULUM_SCHEMA.sql`
4. Existing backend code: `E:\pmerit\pmerit-api-worker\src\`

---

## 📊 Session Metrics

| Metric | Value |
|--------|-------|
| PRs Created | 4 |
| PRs Merged | 4 |
| Files Modified | 15+ |
| Lines Added | ~800 |
| Tables Designed | 14 |
| Sample Courses Added | 42 |
| Documentation Pages | 3 |
| Mobile Bugs Fixed | 3 |

---

**Session Complete** ✅

*This handoff document enables seamless continuation in the next Claude session.*
Document · MD 
Pmerit curriculum implementation plan final
Document · MD 
Pmerit curriculum schema
Code · SQL 
All files saved locally. Note that the "PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md" was saved to docs/handoffs/. Let's pull to local and push to main.


Identified git workflow steps for syncing and deploying changes.



📋 Git Sync Instructions for Code Desktop
Copy and paste these commands into Code Desktop:

Step 1: Pull Latest from Remote
bash
cd E:\pmerit\pmerit-ai-platform
git fetch origin
git pull origin main
Step 2: Add New Documentation Files
bash
git add docs/handoffs/PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md
git add docs/aados/PMERIT_CURRICULUM_SCHEMA.sql
git add docs/aados/HANDOFF_SESSION_CURRICULUM.md
git status
Step 3: Commit and Push
bash
git commit -m "docs: Add curriculum implementation plan, schema, and handoff document

- PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md (docs/handoffs/)
- PMERIT_CURRICULUM_SCHEMA.sql (docs/aados/)
- HANDOFF_SESSION_CURRICULUM.md (docs/aados/)

Phase 2 partial complete: Accordion sample courses live on production"

git push origin main
```

---

### Expected Output
```
[main xxxxxxx] docs: Add curriculum implementation plan, schema, and handoff document
 3 files changed, XXX insertions(+)
 create mode docs/handoffs/PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md
 create mode docs/aados/PMERIT_CURRICULUM_SCHEMA.sql
 create mode docs/aados/HANDOFF_SESSION_CURRICULUM.md
Let me know when complete! Type PUSH COMPLETE when done.

1764715242845_image.png

PS E:\pmerit\pmerit-ai-platform> git fetch origin PS E:\pmerit\pmerit-ai-platform> git status On branch main Your branch is up to date with 'origin/main'. nothing to commit, working tree clean PS E:\pmerit\pmerit-ai-platform> .\Start-PmeritSession.ps1 ===== PMERIT SESSION STARTUP =====

pasted

DONE! What should we do next? Note that the "Learn More v" is not opening.


Identified accordion bug and strategized debugging approach.






🐛 Bug Detected: Accordion Not Opening
The SQL schema was pushed successfully, but the accordion functionality isn't working. Let's debug and fix this.

Step 1: Check Browser Console
On the pmerit.com/pathways page:

Press F12 to open Developer Tools
Click the Console tab
Look for any red error messages
Click "Learn More ∨" and see if any errors appear
Share a screenshot of the console or tell me what errors you see.

Step 2: Quick Debug in Code Desktop
While checking the console, also run this in Code Desktop to inspect the accordion code:

PMERIT DEBUG - Accordion Not Working

The "Learn More ∨" buttons on pmerit.com/pathways are not expanding the accordions.

Tasks:
1. Read pathways.html and check the accordion JavaScript
2. Look for:
   - Event listener attachment issues
   - Missing function definitions
   - CSS display issues
   - Any syntax errors
3. Check if initAccordions() is being called
4. Test the fix locally if possible
5. Fix and push
Likely Causes
Possible Issue	How to Check
JS error blocking execution	Console shows red error
initAccordions() not called	Search for function call
Event listeners not attaching	Check if cards have accordion-toggle class
CSS display: none stuck	Check accordion container styles
Please share the browser console output and I'll help identify the exact fix!

1764715827167_image.png
1764715896663_image.png
1764715934008_image.png
DONE
Let me investigate the accordion issue:
Read/home/user/pmerit-ai-platform/pathways.html
Read 120 lines
Read/home/user/pmerit-ai-platform/pathways.html
Read 100 lines
I found the issue! The initAccordions() function is called inside renderCards(), but renderCards() is called 3 times. This causes event listeners to be attached multiple times, causing the accordion to open and immediately close.
Let me fix this:
Edit/home/user/pmerit-ai-platform/pathways.html
        // Render Global Remote Tracks
        renderCards(data.globalRemoteTracks, 'global-cards');
        // Render Local Education Tracks
        renderCards(data.localEducationTracks, 'education-cards');
        // Render Local Career Pathways
        renderCards(data.localCareerPathways, 'career-cards');
 
        // Render Local Education Tracks
        renderCards(data.localEducationTracks, 'education-cards');
 
        // Render Local Career Pathways
        renderCards(data.localCareerPathways, 'career-cards');
 
        // Initialize accordions ONCE after all cards are rendered
        initAccordions();
Now I need to remove the duplicate call from inside renderCards():
Read/home/user/pmerit-ai-platform/pathways.html
Read 30 lines
Edit/home/user/pmerit-ai-platform/pathways.html
        wrapper.appendChild(accordion);
        container.appendChild(wrapper);
      });
 
      // Initialize accordion toggle functionality
      initAccordions();
    }
Now let me commit and push the fix:
Bashgit add pathways.html && git commit -m "fix: Accordion toggle now works - call initAccordions once after all cards rendered" && git push
remote:  To http://127.0.0.1:36841/git/peoplemerit/pmerit-ai-platform  * [new branch]      claude/rename-career-to-pathways-011rUCEao3pySYCvk42mkApA -> claude/rename-career-to-pathways-011rUCEao3pySYCvk42mkApA... +8 lines
Fixed
Issue: The accordion wasn't working because initAccordions() was being called 3 times (once per renderCards() call), causing multiple event listeners to attach to each button. When clicked, the accordion would open and immediately close.
Fix: Moved initAccordions() to be called once in loadCareerTracks() after all three renderCards() calls complete, instead of inside each renderCards() call.
Before:

renderCards(data.globalRemoteTracks, 'global-cards');   // calls initAccordions() ❌
renderCards(data.localEducationTracks, 'education-cards'); // calls initAccordions() ❌
renderCards(data.localCareerPathways, 'career-cards');     // calls initAccordions() ❌
After:

renderCards(data.globalRemoteTracks, 'global-cards');
renderCards(data.localEducationTracks, 'education-cards');
renderCards(data.localCareerPathways, 'career-cards');
initAccordions(); // Called once after all cards rendered ✓
Pushed to branch: claude/rename-career-to-pathways-011rUCEao3pySYCvk42mkApA

Show more

Confirmed fix deployed and verified on production successfully.



✅ Accordion Bug Fixed & Deployed!
What Was Fixed
Issue	Solution
initAccordions() called 3 times	Moved to single call after all cards render
Multiple event listeners attached	Now only one listener per button
Accordion opened then immediately closed	Now opens/closes properly
Deployment Status
Step	Status
PR #281 merged	✅
Cloudflare deployed	✅ (1 minute ago)
Cache purged	✅
🧪 Please Verify on Production
Visit https://pmerit.com/pathways and test:

Click "Learn More ∨" on any pathway card
Accordion should expand showing 3 sample courses
Click another card — previous closes, new opens
Click same card again — should collapse
Share a screenshot of an expanded accordion when it's working!

1764715998335_image.png
Now working


Validated bug fix and charted next steps forward.


🎉 Accordion Working Perfectly!
I can see the Primary School accordion expanded showing:

Reading Comprehension (Grades 1-5)
Math Foundations (Grades 1-5)
Science Exploration (Grades 1-5)
The "Local Education" tab is also highlighted, showing the tab navigation works correctly too!

✅ Session Complete — All Tasks Done
Final Summary
Task	Status	PR
Rename career.html → pathways.html	✅	#278
Add accordion sample courses	✅	#280
Fix accordion toggle bug	✅	#281
Implementation Plan document	✅	Saved locally
Database Schema SQL	✅	Committed
Handoff document	✅	Saved locally
Production URLs
✅ https://pmerit.com/pathways — Live with working accordions
✅ /career → /pathways redirect working
🔜 What's Next?
Option	Description
A	Deploy database schema to Neon PostgreSQL
B	Start Admin Curriculum Builder (Phase 1)
C	Sync remaining documentation files to GitHub
D	End session — handoff is ready
What would you like to do?

1764716482127_WhatsApp Image 2025-12-02 at 18.00.13_c916bf2c.jpg
1764716564701_image.png
1764716712456_WhatsApp Image 2025-12-02 at 18.00.52_57afff51.jpg
Another bug I would like to fix. See, the Globe on the mobile screen is having a white background. Also, the Globe is so tiny on a real mobile screen. When a chat starts on the mobile screen, the header is pushed away (disappears).


Identified three mobile UI bugs and pinpointed CSS issues.





🐛 3 Mobile Bugs Identified
Bug	Issue	Location
1	Globe icon has white background	Header/language selector
2	Globe icon too small on mobile	Header CSS
3	Header disappears when chat starts	Chat container pushing header
📋 Copy to Code Desktop
PMERIT MOBILE BUG FIX - 3 Issues

BUG 1: Globe icon has white background on mobile
- The language selector globe (🌐 EN) has a white/light background
- Should be transparent to match dark header

BUG 2: Globe icon too tiny on mobile
- The globe + "EN" text is very small on real mobile devices
- Needs larger touch target (min 44x44px for accessibility)

BUG 3: Header disappears when chat starts
- When user sends a message, the header scrolls/pushes off screen
- Header should remain fixed/sticky at top during chat

TASKS:
1. Read index.html to find the language selector and header styles
2. Read partials/header.html for header structure
3. Fix globe background (remove white, make transparent)
4. Increase globe/language selector size on mobile (min 44px touch target)
5. Make header sticky/fixed so it doesn't disappear during chat
6. Test fixes
7. Commit and push

EXPECTED CSS CHANGES:
- Language selector: background: transparent; min-width: 44px; min-height: 44px;
- Header: position: fixed; or position: sticky; top: 0;
- Chat container: margin-top or padding-top to account for fixed header
Paste this into Code Desktop to start the fix!

1764717091519_image.png
1764717125663_image.png
1764717168850_image.png

Update Todos Reading mobile header styles Fix globe icon white background Increase globe/language selector size for accessibility Make header sticky during chat Commit and push fixes Read /home/user/pmerit-ai-platform/index.html Read 150 lines Read /home/user/pmerit-ai-platform/partia

pasted

DONE


Verified deployment completion and prepared verification request.


✅ Mobile Bug Fixes Deployed!
Summary
Bug	Fix	PR
Globe white background	Transparent background	#282
Globe too tiny	44px touch target	#282
Header disappears	Sticky positioning	#282
🧪 Please Verify on Mobile
Test on your real phone at https://pmerit.com:

Globe icon — Should have transparent/dark background now
Globe size — Should be larger and easier to tap
Chat test — Send "Hello" and check if header stays visible
Share a screenshot from your mobile to confirm!

📊 Session Progress
PR	Description	Status
#278	Rename career → pathways	✅ Merged
#280	Accordion sample courses	✅ Merged
#281	Fix accordion toggle	✅ Merged
#282	Mobile header bugs	✅ Merged
Total: 4 PRs merged this session! 🎉

1764717414987_image.png
The header is working


Verified mobile header functionality and confirmed successful implementation.


✅ Mobile Header Fixed & Verified!
I can see in the screenshot:

Fix	Status
Header stays visible during chat	✅ Working
Globe shows "🌐 YO" (Yoruba)	✅ Visible
Globe background transparent	✅ Fixed
Chat scrolls while header stays	✅ Working
The interface also shows the Yoruba translation is active — "Wọlé" (Sign In), "Béèrè nípa àwọn ẹ̀kọ́" (Ask about courses), and the footer in Yoruba. Beautiful!

📊 Session Complete — Final Summary
PRs Merged This Session
PR	Description	Impact
#278	Rename career → pathways	SEO + UX improvement
#280	Accordion sample courses	42 sample courses visible
#281	Fix accordion toggle	Bug fix
#282	Mobile header bugs	3 mobile UX fixes
Documents Created
Document	Location
Implementation Plan	docs/handoffs/PMERIT_CURRICULUM_IMPLEMENTATION_PLAN_FINAL.md
Database Schema SQL	docs/aados/PMERIT_CURRICULUM_SCHEMA.sql
Handoff Document	docs/handoffs/HANDOFF_SESSION_CURRICULUM.md
🔜 What's Next?
Option	Description
A	Deploy database schema to Neon
B	End session — resume later
C	Address another bug/feature
What would you like to do?

We have an existing schema. Let's switch to a new chat window and verify the schema in the backend.


Orchestrated transition to backend schema verification session.

✅ Creating Final Handoff for Schema Verification
Let me update the handoff document to prepare for the next session:


8 steps

Copy updated handoff to outputs



Orchestrated schema verification strategy for backend validation.

✅ Handoff Complete — Ready for New Session
Download Updated Handoff

📋 Copy This to New Chat Window:
PMERIT CONTINUE

CONTEXT: Previous session completed frontend curriculum implementation.
Now need to verify existing backend database schema.

ENVIRONMENT: Backend (ENV: BE)
- Repository: peoplemerit/pmerit-api-worker
- Local Path: E:\pmerit\pmerit-api-worker
- Database: Neon PostgreSQL

TASKS:
1. Read existing backend code to understand current schema
2. Query Neon database to list existing tables
3. Compare with PMERIT_CURRICULUM_SCHEMA.sql (in Project Knowledge)
4. Identify gaps and plan additions

GOVERNANCE FILES: docs/aados/ in frontend repo contains:
- PMERIT_CURRICULUM_SCHEMA.sql (14 new tables designed)
- HANDOFF_SESSION_CURRICULUM.md (session handoff)
🎉 This Session Accomplished
Category	Achievement
PRs Merged	4 (#278, #280, #281, #282)
Sample Courses	42 courses across 14 pathways
Bug Fixes	Accordion toggle + 3 mobile header issues
Documentation	Implementation plan + schema + handoff
Great session! See you in the next window for backend schema verification. 
