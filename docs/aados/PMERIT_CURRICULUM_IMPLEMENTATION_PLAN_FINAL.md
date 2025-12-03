\# 📚 PMERIT CURRICULUM IMPLEMENTATION PLAN

\## Maine-Model Educational Framework with Global Adaptation



\*\*Version:\*\* 1.1  

\*\*Created:\*\* December 1, 2025  

\*\*Updated:\*\* December 2, 2025  

\*\*Status:\*\* Phase 2 In Progress  



---



\## 🎯 Executive Summary



This document outlines the complete implementation plan for PMERIT's curriculum system, using Maine's educational framework as the foundational model. The plan covers three distinct track types, user access flows, database architecture, and a phased rollout strategy.



---



\## ✅ COMPLETED MILESTONES



\### Session Progress (December 1-2, 2025)



| Task | Status | PR/Commit |

|------|--------|-----------|

| File renamed: `career.html` → `pathways.html` | ✅ Complete | PR #278 |

| URL redirect: `/career` → `/pathways` (301) | ✅ Complete | PR #278 |

| UI text: "Career Track" → "Learning Pathways" | ✅ Complete | PR #278 |

| Accordion sample courses (42 courses across 14 pathways) | ✅ Complete | PR #280 |

| Cloudflare deployment + cache purge | ✅ Complete | — |



---



\## 📊 Track Structure Overview



\### The Three Track Types



| Track Type | Pathways | Focus | Model Basis |

|------------|----------|-------|-------------|

| \*\*Global Remote\*\* | 6 | Work-from-anywhere careers | Industry-aligned competencies |

| \*\*Local Education\*\* | 4 | Age-based learning (PreK-College) | Maine Learning Results + CTE |

| \*\*Local Career\*\* | 4 | Location-based careers | Maine CTE 16 Career Clusters |



---



\## 🏫 TRACK 1: Global Remote (6 Pathways)



\### Structure

Each pathway = 12 courses × ~4-6 weeks per course = 48-72 weeks to completion



\### The 6 Global Remote Pathways



| # | Pathway | Core Competencies | Target Outcome |

|---|---------|-------------------|----------------|

| 1 | \*\*Data Analytics\*\* | Python, SQL, Tableau, Statistics | Data Analyst roles |

| 2 | \*\*Digital Marketing\*\* | SEO, Social Media, Content Strategy, Analytics | Marketing Specialist |

| 3 | \*\*UX Design\*\* | Figma, User Research, Prototyping, UI Design | UX/UI Designer |

| 4 | \*\*Web Development\*\* | HTML/CSS, JavaScript, React, Node.js | Full-Stack Developer |

| 5 | \*\*Project Management\*\* | Agile, Scrum, Risk Management, Stakeholder Comm | Project Manager |

| 6 | \*\*Business Analysis\*\* | Requirements Gathering, Process Mapping, SQL | Business Analyst |



\### Sample: Web Development Pathway (12 Courses)



| Course # | Course Title | Duration | Prerequisites | Key Deliverable |

|----------|--------------|----------|---------------|-----------------|

| WD-101 | HTML \& CSS Fundamentals | 2 weeks | None | Static portfolio page |

| WD-102 | JavaScript Essentials | 4 weeks | WD-101 | Interactive calculator |

| WD-103 | Responsive Design | 2 weeks | WD-102 | Mobile-first website |

| WD-104 | Version Control (Git) | 1 week | WD-102 | GitHub portfolio |

| WD-105 | React Fundamentals | 4 weeks | WD-104 | React todo app |

| WD-106 | Backend with Node.js | 4 weeks | WD-105 | REST API |

| WD-107 | Database Design | 3 weeks | WD-106 | PostgreSQL integration |

| WD-108 | Authentication \& Security | 2 weeks | WD-107 | Secure login system |

| WD-109 | Cloud Deployment | 2 weeks | WD-108 | Live deployed app |

| WD-110 | API Integration | 2 weeks | WD-109 | Third-party API usage |

| WD-111 | Testing \& QA | 2 weeks | WD-110 | Automated test suite |

| WD-112 | Capstone Project | 4 weeks | All above | Full-stack portfolio project |



\*\*Total Duration:\*\* ~32 weeks to job-ready



---



\## 🏫 TRACK 2: Local Education (4 Pathways) — Maine Model



\### Based on Maine Learning Results Structure



Maine organizes education into \*\*8 Content Areas\*\* across \*\*4 Grade Spans\*\*:



\#### Maine's 8 Content Areas (Adapted for PMERIT)

1\. English Language Arts (ELA)

2\. Mathematics

3\. Science \& Engineering

4\. Social Studies

5\. Health \& Physical Education

6\. Visual \& Performing Arts

7\. World Languages

8\. Life \& Career Readiness



\#### Maine's Grade Spans (PMERIT Adaptation)



| Pathway | Maine Equivalent | Age Range | Grade Levels | Focus |

|---------|------------------|-----------|--------------|-------|

| \*\*Early Childhood\*\* | Pre-K to Grade 2 | Ages 3-7 | PreK, K, 1, 2 | Foundational literacy \& numeracy |

| \*\*Primary\*\* | Childhood (K-5) | Ages 5-11 | K, 1, 2, 3, 4, 5 | Core academic skills |

| \*\*Secondary\*\* | Early Adolescence + Adolescence | Ages 11-18 | 6, 7, 8, 9, 10, 11, 12 | College \& career prep |

| \*\*College\*\* | Post-secondary | Ages 18+ | Higher Ed | Degree pathways |



\### Nigeria Adaptation



The same Maine structure adapts to Nigeria by:

1\. \*\*Mapping to Nigerian Educational Levels:\*\*

&nbsp;  - Early Childhood → Early Child Care Development Education (ECCDE)

&nbsp;  - Primary → Primary Education (Basic 1-6)

&nbsp;  - Secondary → Junior Secondary (JSS 1-3) + Senior Secondary (SSS 1-3)

&nbsp;  - College → Tertiary Education



2\. \*\*Cultural Content Localization:\*\*

&nbsp;  - Local history and geography content

&nbsp;  - Nigerian civic education

&nbsp;  - Indigenous language options (Yoruba, Igbo, Hausa)

&nbsp;  - Culturally relevant examples and case studies



---



\## 🏫 TRACK 3: Local Career (4 Pathways) — Maine CTE Model



\### Based on Maine's 16 Career Clusters (Consolidated to 4)



| PMERIT Pathway | Maine CTE Clusters Included | Example Careers |

|----------------|----------------------------|-----------------|

| \*\*Healthcare Careers\*\* | Health Science | CNA, EMT, Medical Assistant, Nursing |

| \*\*Skilled Trades\*\* | Architecture \& Construction, Manufacturing, Transportation | Electrician, Plumber, Welder, Automotive Tech |

| \*\*Hospitality \& Service\*\* | Hospitality \& Tourism, Human Services | Culinary Arts, Hotel Management, Food Service |

| \*\*Public Service\*\* | Government \& Public Admin, Law/Public Safety, Education | Law Enforcement, Firefighting, Teaching Assistant |



---



\## 👥 USER ACCESS FLOWS



\### Flow 1: Public/Guest Access



```

Visit pmerit.com

&nbsp;   │

&nbsp;   ▼

Homepage (AI Chat + Quick Actions)

&nbsp;   │

&nbsp;   ▼

Click "Learning Pathways" in sidebar

&nbsp;   │

&nbsp;   ▼

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

&nbsp;   │

&nbsp;   ▼

Click "Start Learning" or "Discover Your Path"

&nbsp;   │

&nbsp;   ▼

Prompt to Sign Up / Subscribe

```



\### Flow 2: Student Access (Subscribed)



```

Sign In → Account Verified

&nbsp;   │

&nbsp;   ▼

DASHBOARD (Personalized Home)

┌─────────────────────────────────────────────────────────────┐

│  • My Enrolled Courses (Current classes)                    │

│  • Progress Overview (% complete per course)                │

│  • Next Up (Next lesson/assignment)                         │

│  • Achievements/Certificates                                │

│  • AI Recommendations                                       │

└─────────────────────────────────────────────────────────────┘

&nbsp;   │

&nbsp;   ▼

COURSE CATALOG (Full Access)

┌─────────────────────────────────────────────────────────────┐

│  Browse All Pathways                                        │

│    │                                                        │

│    ├── Global Remote (6 pathways, 12 courses each)          │

│    ├── Local Education (4 pathways, grade-level courses)    │

│    └── Local Career (4 pathways, certification courses)     │

│                                                             │

│  \[+ Add Course] → Course added to Dashboard                 │

│  \[- Drop Course] → Course removed from Dashboard            │

└─────────────────────────────────────────────────────────────┘

&nbsp;   │

&nbsp;   ▼

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



\### Flow 3: Admin Access (Curriculum Management)



```

Admin Sign In → Role Verified

&nbsp;   │

&nbsp;   ▼

ADMIN DASHBOARD

┌─────────────────────────────────────────────────────────────┐

│  Overview Stats:                                            │

│    • Total Students Enrolled                                │

│    • Courses Active                                         │

│    • Completion Rates                                       │

│    • Popular Pathways                                       │

└─────────────────────────────────────────────────────────────┘

&nbsp;   │

&nbsp;   ▼

CURRICULUM BUILDER (No-Code Interface)

┌─────────────────────────────────────────────────────────────┐

│                                                             │

│  1. PATHWAY MANAGEMENT                                      │

│     \[+ Create Pathway]                                      │

│       • Name, Track Type, Description, Icon                 │

│       • Duration, Difficulty                                │

│     \[Save Pathway]                                          │

│                                                             │

│  2. COURSE MANAGEMENT                                       │

│     Select Pathway → \[+ Add Course]                         │

│       • Course Code, Title, Description                     │

│       • Duration, Prerequisites, Learning Objectives        │

│     \[Save Course]                                           │

│                                                             │

│  3. MODULE MANAGEMENT                                       │

│     Select Course → \[+ Add Module]                          │

│       • Module Number, Title, Description                   │

│       • Duration, Order (Drag \& Drop)                       │

│     \[Save Module]                                           │

│                                                             │

│  4. LESSON MANAGEMENT                                       │

│     Select Module → \[+ Add Lesson]                          │

│       • Type: Video/Reading/Interactive/Quiz/Project        │

│       • Content: Rich Text Editor / Video Upload            │

│     \[Save Lesson]                                           │

│                                                             │

│  5. MATERIALS LIBRARY                                       │

│     \[+ Upload Material] → PDF/Video/Image/Link              │

│     Attach to Course/Module/Lesson                          │

│                                                             │

│  6. ASSESSMENT BUILDER                                      │

│     \[+ Create Assessment]                                   │

│       • Type: Quiz/Exam/Project/Portfolio                   │

│       • Questions: Multiple Choice/True-False/Essay         │

│       • Passing Score, Time Limit, Attempts                 │

│     \[Save Assessment]                                       │

│                                                             │

└─────────────────────────────────────────────────────────────┘

```



---



\## 🗄️ DATABASE SCHEMA ADDITIONS



\### New Tables Required (14 Tables)



```sql

-- =============================================

-- PATHWAY TABLES

-- =============================================



-- 1. Pathways (Top-level organization)

CREATE TABLE pathways (

&nbsp;   pathway\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   track\_type VARCHAR(20) NOT NULL CHECK (track\_type IN ('global\_remote', 'local\_education', 'local\_career')),

&nbsp;   pathway\_name VARCHAR(255) NOT NULL,

&nbsp;   pathway\_slug VARCHAR(100) UNIQUE NOT NULL,

&nbsp;   description TEXT,

&nbsp;   icon\_url TEXT,

&nbsp;   estimated\_duration\_weeks INTEGER,

&nbsp;   difficulty\_level VARCHAR(20) CHECK (difficulty\_level IN ('beginner', 'intermediate', 'advanced')),

&nbsp;   target\_outcome TEXT,

&nbsp;   is\_published BOOLEAN DEFAULT FALSE,

&nbsp;   is\_featured BOOLEAN DEFAULT FALSE,

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW()

);



-- 2. Courses (Belong to pathways)

CREATE TABLE courses (

&nbsp;   course\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   pathway\_id UUID REFERENCES pathways(pathway\_id) ON DELETE CASCADE,

&nbsp;   course\_code VARCHAR(20) UNIQUE NOT NULL,

&nbsp;   course\_title VARCHAR(255) NOT NULL,

&nbsp;   course\_slug VARCHAR(100) UNIQUE NOT NULL,

&nbsp;   description TEXT,

&nbsp;   learning\_objectives TEXT\[],

&nbsp;   estimated\_duration\_weeks INTEGER,

&nbsp;   difficulty\_level VARCHAR(20) CHECK (difficulty\_level IN ('beginner', 'intermediate', 'advanced')),

&nbsp;   prerequisite\_course\_ids UUID\[],

&nbsp;   thumbnail\_url TEXT,

&nbsp;   intro\_video\_url TEXT,

&nbsp;   is\_published BOOLEAN DEFAULT FALSE,

&nbsp;   is\_free BOOLEAN DEFAULT TRUE,

&nbsp;   price\_usd DECIMAL(10,2) DEFAULT 0.00,

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW()

);



-- 3. Modules (Belong to courses)

CREATE TABLE course\_modules (

&nbsp;   module\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   course\_id UUID REFERENCES courses(course\_id) ON DELETE CASCADE,

&nbsp;   module\_number INTEGER NOT NULL,

&nbsp;   module\_title VARCHAR(255) NOT NULL,

&nbsp;   description TEXT,

&nbsp;   learning\_objectives TEXT\[],

&nbsp;   estimated\_duration\_hours INTEGER,

&nbsp;   is\_required BOOLEAN DEFAULT TRUE,

&nbsp;   prerequisite\_module\_ids UUID\[],

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   UNIQUE(course\_id, module\_number)

);



-- 4. Lessons (Belong to modules)

CREATE TABLE lessons (

&nbsp;   lesson\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   module\_id UUID REFERENCES course\_modules(module\_id) ON DELETE CASCADE,

&nbsp;   lesson\_number INTEGER NOT NULL,

&nbsp;   lesson\_title VARCHAR(255) NOT NULL,

&nbsp;   lesson\_type VARCHAR(20) CHECK (lesson\_type IN ('video', 'reading', 'interactive', 'quiz', 'project')),

&nbsp;   content\_url TEXT,

&nbsp;   content\_text TEXT,

&nbsp;   content\_metadata JSONB,

&nbsp;   estimated\_duration\_minutes INTEGER,

&nbsp;   is\_required BOOLEAN DEFAULT TRUE,

&nbsp;   prerequisite\_lesson\_ids UUID\[],

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   UNIQUE(module\_id, lesson\_number)

);



-- 5. Materials Library

CREATE TABLE materials (

&nbsp;   material\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   material\_type VARCHAR(20) CHECK (material\_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio')),

&nbsp;   title VARCHAR(255) NOT NULL,

&nbsp;   description TEXT,

&nbsp;   file\_url TEXT,

&nbsp;   file\_size\_bytes BIGINT,

&nbsp;   mime\_type VARCHAR(100),

&nbsp;   tags TEXT\[],

&nbsp;   is\_public BOOLEAN DEFAULT FALSE,

&nbsp;   uploaded\_by UUID,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW()

);



-- 6. Material Attachments

CREATE TABLE material\_attachments (

&nbsp;   attachment\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   material\_id UUID REFERENCES materials(material\_id) ON DELETE CASCADE,

&nbsp;   attached\_to\_type VARCHAR(20) CHECK (attached\_to\_type IN ('pathway', 'course', 'module', 'lesson')),

&nbsp;   attached\_to\_id UUID NOT NULL,

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW()

);



-- =============================================

-- STUDENT ENROLLMENT TABLES

-- =============================================



-- 7. Student Pathway Enrollments

CREATE TABLE pathway\_enrollments (

&nbsp;   enrollment\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   user\_id UUID NOT NULL,

&nbsp;   pathway\_id UUID REFERENCES pathways(pathway\_id) ON DELETE CASCADE,

&nbsp;   enrolled\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped')),

&nbsp;   progress\_percentage DECIMAL(5,2) DEFAULT 0.00,

&nbsp;   completed\_at TIMESTAMPTZ,

&nbsp;   certificate\_url TEXT,

&nbsp;   UNIQUE(user\_id, pathway\_id)

);



-- 8. Student Course Enrollments

CREATE TABLE course\_enrollments (

&nbsp;   enrollment\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   user\_id UUID NOT NULL,

&nbsp;   course\_id UUID REFERENCES courses(course\_id) ON DELETE CASCADE,

&nbsp;   pathway\_enrollment\_id UUID REFERENCES pathway\_enrollments(enrollment\_id),

&nbsp;   enrolled\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   status VARCHAR(20) DEFAULT 'not\_started' CHECK (status IN ('not\_started', 'in\_progress', 'completed', 'dropped')),

&nbsp;   progress\_percentage DECIMAL(5,2) DEFAULT 0.00,

&nbsp;   started\_at TIMESTAMPTZ,

&nbsp;   completed\_at TIMESTAMPTZ,

&nbsp;   final\_grade DECIMAL(5,2),

&nbsp;   certificate\_url TEXT,

&nbsp;   UNIQUE(user\_id, course\_id)

);



-- 9. Lesson Progress

CREATE TABLE lesson\_progress (

&nbsp;   progress\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   user\_id UUID NOT NULL,

&nbsp;   lesson\_id UUID REFERENCES lessons(lesson\_id) ON DELETE CASCADE,

&nbsp;   course\_enrollment\_id UUID REFERENCES course\_enrollments(enrollment\_id),

&nbsp;   status VARCHAR(20) DEFAULT 'not\_started' CHECK (status IN ('not\_started', 'in\_progress', 'completed')),

&nbsp;   started\_at TIMESTAMPTZ,

&nbsp;   completed\_at TIMESTAMPTZ,

&nbsp;   time\_spent\_seconds INTEGER DEFAULT 0,

&nbsp;   score DECIMAL(5,2),

&nbsp;   attempts INTEGER DEFAULT 0,

&nbsp;   last\_position JSONB,

&nbsp;   UNIQUE(user\_id, lesson\_id)

);



-- =============================================

-- ASSESSMENT TABLES

-- =============================================



-- 10. Assessments

CREATE TABLE assessments (

&nbsp;   assessment\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   course\_id UUID REFERENCES courses(course\_id),

&nbsp;   module\_id UUID REFERENCES course\_modules(module\_id),

&nbsp;   lesson\_id UUID REFERENCES lessons(lesson\_id),

&nbsp;   assessment\_type VARCHAR(20) CHECK (assessment\_type IN ('quiz', 'exam', 'project', 'portfolio')),

&nbsp;   title VARCHAR(255) NOT NULL,

&nbsp;   description TEXT,

&nbsp;   instructions TEXT,

&nbsp;   passing\_score DECIMAL(5,2) DEFAULT 70.00,

&nbsp;   time\_limit\_minutes INTEGER,

&nbsp;   max\_attempts INTEGER DEFAULT 3,

&nbsp;   is\_published BOOLEAN DEFAULT FALSE,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW()

);



-- 11. Assessment Questions

CREATE TABLE assessment\_questions (

&nbsp;   question\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   assessment\_id UUID REFERENCES assessments(assessment\_id) ON DELETE CASCADE,

&nbsp;   question\_type VARCHAR(20) CHECK (question\_type IN ('multiple\_choice', 'true\_false', 'short\_answer', 'essay', 'matching')),

&nbsp;   question\_text TEXT NOT NULL,

&nbsp;   options JSONB,

&nbsp;   correct\_answer JSONB,

&nbsp;   points DECIMAL(5,2) DEFAULT 1.00,

&nbsp;   explanation TEXT,

&nbsp;   sort\_order INTEGER DEFAULT 0,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW()

);



-- 12. Student Assessment Attempts

CREATE TABLE assessment\_attempts (

&nbsp;   attempt\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   user\_id UUID NOT NULL,

&nbsp;   assessment\_id UUID REFERENCES assessments(assessment\_id) ON DELETE CASCADE,

&nbsp;   started\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   submitted\_at TIMESTAMPTZ,

&nbsp;   answers JSONB,

&nbsp;   score DECIMAL(5,2),

&nbsp;   passed BOOLEAN,

&nbsp;   feedback TEXT,

&nbsp;   attempt\_number INTEGER DEFAULT 1

);



-- =============================================

-- LOCALIZATION TABLES

-- =============================================



-- 13. Content Translations

CREATE TABLE content\_translations (

&nbsp;   translation\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   content\_type VARCHAR(20) CHECK (content\_type IN ('pathway', 'course', 'module', 'lesson', 'material')),

&nbsp;   content\_id UUID NOT NULL,

&nbsp;   language\_code VARCHAR(10) NOT NULL,

&nbsp;   field\_name VARCHAR(50) NOT NULL,

&nbsp;   translated\_text TEXT NOT NULL,

&nbsp;   is\_approved BOOLEAN DEFAULT FALSE,

&nbsp;   translated\_by UUID,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   updated\_at TIMESTAMPTZ DEFAULT NOW(),

&nbsp;   UNIQUE(content\_type, content\_id, language\_code, field\_name)

);



-- 14. Cultural Adaptations

CREATE TABLE cultural\_adaptations (

&nbsp;   adaptation\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&nbsp;   lesson\_id UUID REFERENCES lessons(lesson\_id) ON DELETE CASCADE,

&nbsp;   region\_code VARCHAR(10) NOT NULL,

&nbsp;   adaptation\_type VARCHAR(20) CHECK (adaptation\_type IN ('example', 'analogy', 'case\_study', 'context')),

&nbsp;   original\_content TEXT,

&nbsp;   adapted\_content TEXT NOT NULL,

&nbsp;   is\_approved BOOLEAN DEFAULT FALSE,

&nbsp;   created\_at TIMESTAMPTZ DEFAULT NOW()

);



-- =============================================

-- INDEXES FOR PERFORMANCE

-- =============================================



CREATE INDEX idx\_pathways\_track\_type ON pathways(track\_type);

CREATE INDEX idx\_pathways\_published ON pathways(is\_published);

CREATE INDEX idx\_courses\_pathway ON courses(pathway\_id);

CREATE INDEX idx\_courses\_published ON courses(is\_published);

CREATE INDEX idx\_modules\_course ON course\_modules(course\_id);

CREATE INDEX idx\_lessons\_module ON lessons(module\_id);

CREATE INDEX idx\_pathway\_enrollments\_user ON pathway\_enrollments(user\_id);

CREATE INDEX idx\_course\_enrollments\_user ON course\_enrollments(user\_id);

CREATE INDEX idx\_lesson\_progress\_user ON lesson\_progress(user\_id);

CREATE INDEX idx\_translations\_content ON content\_translations(content\_type, content\_id, language\_code);

```



---



\## 📅 IMPLEMENTATION PHASES



\### Phase Overview



| Phase | Name | Duration | Focus | Status |

|-------|------|----------|-------|--------|

| \*\*Phase 1\*\* | Foundation | 2-3 weeks | Database + Admin Core | 🔜 Next |

| \*\*Phase 2\*\* | Public Experience | 2-3 weeks | Sample Curricula + Browse | ✅ Partial |

| \*\*Phase 3\*\* | Student Experience | 3-4 weeks | Dashboard + Classroom | ⏳ Pending |

| \*\*Phase 4\*\* | Content Population | 4-6 weeks | First Complete Pathway | ⏳ Pending |

| \*\*Phase 5\*\* | Localization | 2-3 weeks | Nigeria Adaptation | ⏳ Pending |

| \*\*Phase 6\*\* | Scale | Ongoing | Additional Pathways | ⏳ Pending |



---



\### 📍 PHASE 1: Foundation (Weeks 1-3) — NEXT



\#### Goals

\- Deploy curriculum database schema

\- Build Admin CRUD operations

\- Create basic admin interface



\#### Tasks



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



\### 📍 PHASE 2: Public Experience (Weeks 4-6) — PARTIAL COMPLETE



\#### Goals

\- Build sample curricula display ✅

\- Enhance "Learning Pathways" page ✅

\- Create conversion funnel to signup



\#### Completed Tasks



| # | Task | Status |

|---|------|--------|

| 2.1 | Rename career.html to pathways.html | ✅ PR #278 |

| 2.2 | Add accordion sample courses | ✅ PR #280 |

| 2.3 | Update navigation links | ✅ PR #278 |

| 2.4 | Add SEO redirects | ✅ PR #278 |



\#### Remaining Tasks



| # | Task | Priority | Est. Hours |

|---|------|----------|------------|

| 2.5 | Create pathway detail preview page | High | 12 |

| 2.6 | Create course preview page | Medium | 8 |

| 2.7 | Connect "Start Learning" to signup flow | High | 4 |



---



\## 📊 Success Metrics



\### Phase 1 Success Criteria

\- \[ ] Admin can manage curriculum without writing code

\- \[ ] Database handles 1000+ courses without performance issues



\### Phase 2 Success Criteria

\- \[x] Pathways page displays all 3 track types

\- \[x] Accordion shows sample courses

\- \[ ] Public page bounce rate < 50%

\- \[ ] Signup conversion rate > 5% from curriculum pages



---



\## 📎 Appendix: Maine Learning Results Reference



\### 8 Content Areas

1\. English Language Arts

2\. Mathematics

3\. Science and Engineering

4\. Social Studies

5\. Health, Physical Education and Wellness

6\. Visual and Performing Arts

7\. World Languages

8\. Life and Career Readiness



\### Grade Spans

\- \*\*Childhood:\*\* K-5

\- \*\*Early Adolescence:\*\* 6-8

\- \*\*Adolescence:\*\* 9-Diploma



\### Maine's Guiding Principles (Cross-Curricular Skills)

1\. Clear and Effective Communicator

2\. Self-Directed and Lifelong Learner

3\. Creative and Practical Problem Solver

4\. Responsible and Involved Citizen

5\. Integrative and Informed Thinker



\### Maine CTE Career Clusters (16)

1\. Agriculture, Food \& Natural Resources

2\. Architecture \& Construction

3\. Arts, A/V Technology \& Communications

4\. Business, Management \& Administration

5\. Education \& Training

6\. Finance

7\. Government \& Public Administration

8\. Health Science

9\. Hospitality \& Tourism

10\. Human Services

11\. Information Technology

12\. Law, Public Safety \& Security

13\. Manufacturing

14\. Marketing, Sales \& Service

15\. Science, Technology, Engineering \& Math

16\. Transportation, Distribution \& Logistics



---



\## 📝 Document History



| Version | Date | Changes |

|---------|------|---------|

| 1.0 | Dec 1, 2025 | Initial plan created |

| 1.1 | Dec 2, 2025 | Updated with completed milestones (PR #278, #280) |



---



\*\*Document End\*\*

